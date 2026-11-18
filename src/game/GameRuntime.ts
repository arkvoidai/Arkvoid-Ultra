import {
  ACESFilmicToneMapping,
  Clock,
  Color,
  DirectionalLight,
  Fog,
  HemisphereLight,
  MathUtils,
  PCFShadowMap,
  PerspectiveCamera,
  SRGBColorSpace,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import { PlayerCharacter } from './character/PlayerCharacter';
import type { InputManager } from './input/InputManager';
import { ProgressionSystem } from './systems/ProgressionSystem';
import { SaveRepository } from './systems/SaveRepository';
import { WorldBuilder, type WorldBuildResult } from './world/WorldBuilder';
import { clampToWorld, terrainHeightAt } from './world/terrain';
import type { GameHud } from '../ui/GameHud';

const PLAYER_SPEED = 5.2;
const SPRINT_MULTIPLIER = 1.72;
const PLAYER_RADIUS = 0.62;
const CAMERA_SENSITIVITY = 0.0042;

export class GameRuntime {
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(58, 1, 0.1, 720);
  private readonly clock = new Clock();
  private readonly player = new PlayerCharacter();
  private readonly worldBuilder = new WorldBuilder();
  private readonly saveRepository = new SaveRepository();
  private readonly world: WorldBuildResult;
  private readonly cameraTarget = new Vector3();
  private readonly desiredCameraPosition = new Vector3();
  private readonly moveDirection = new Vector3();
  private readonly forward = new Vector3();
  private readonly right = new Vector3();
  private readonly input: InputManager;
  private readonly hud: GameHud;
  private progression: ProgressionSystem;
  private cameraYaw = 0;
  private cameraPitch = 0.16;
  private verticalVelocity = 0;
  private elapsedSeconds = 0;
  private frameCount = 0;
  private fpsAccumulator = 0;
  private displayedFps = 0;
  private attackCooldown = 0;
  private attackAnimationTime = 0;
  private objectiveComplete = false;
  private animationFrame = 0;
  private running = false;
  private lastSaveAt = 0;

  constructor(canvas: HTMLCanvasElement, input: InputManager, hud: GameHud) {
    this.input = input;
    this.hud = hud;
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFShadowMap;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);

    this.scene.background = new Color(0x9aafa5);
    this.scene.fog = new Fog(0x9aafa5, 95, 360);
    this.addLighting();
    this.world = this.worldBuilder.build(this.scene);

    const saved = this.saveRepository.load();
    this.progression = new ProgressionSystem(saved?.qi ?? 0, saved?.spiritShards ?? 0);
    this.objectiveComplete = saved?.attunementComplete ?? false;

    if (saved) {
      const spawn = clampToWorld(saved.playerX, saved.playerZ);
      this.player.root.position.set(spawn.x, terrainHeightAt(spawn.x, spawn.z), spawn.z);
      for (const mote of this.world.collectibles) {
        if (saved.collectedMoteIds.includes(mote.id)) {
          mote.collected = true;
          mote.object.visible = false;
        }
      }
      if (saved.trainingTargetDefeated) {
        this.world.trainingTarget.defeated = true;
        this.world.trainingTarget.object.visible = false;
      }
    } else {
      this.player.root.position.set(0, terrainHeightAt(0, 34), 34);
    }

    this.scene.add(this.player.root);
    this.updateCamera(1);
    this.resize();
    window.addEventListener('resize', this.resize);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.hud.showReady();
    this.clock.start();
    this.animationFrame = window.requestAnimationFrame(this.tick);
  }

  dispose(): void {
    this.saveNow();
    this.running = false;
    window.cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('resize', this.resize);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.input.dispose();
    this.hud.dispose();

    this.scene.traverse((object) => {
      const renderable = object as {
        geometry?: { dispose: () => void };
        material?: unknown;
      };
      renderable.geometry?.dispose();
      if (Array.isArray(renderable.material)) {
        renderable.material.forEach((material) => {
          if (material && typeof material === 'object' && 'dispose' in material) {
            (material as { dispose: () => void }).dispose();
          }
        });
      } else if (
        renderable.material &&
        typeof renderable.material === 'object' &&
        'dispose' in renderable.material
      ) {
        (renderable.material as { dispose: () => void }).dispose();
      }
    });
    this.renderer.dispose();
  }

  private readonly tick = (): void => {
    if (!this.running) return;
    const delta = Math.min(this.clock.getDelta(), 0.05);
    this.elapsedSeconds += delta;
    this.update(delta);
    this.renderer.render(this.scene, this.camera);
    this.updateFrameRate(delta);
    this.animationFrame = window.requestAnimationFrame(this.tick);
  };

  private update(deltaSeconds: number): void {
    const frame = this.input.consumeFrame();
    this.cameraYaw -= frame.lookX * CAMERA_SENSITIVITY;
    this.cameraPitch = MathUtils.clamp(
      this.cameraPitch + frame.lookY * CAMERA_SENSITIVITY,
      -0.05,
      0.86,
    );

    this.forward.set(-Math.sin(this.cameraYaw), 0, -Math.cos(this.cameraYaw));
    this.right.set(Math.cos(this.cameraYaw), 0, -Math.sin(this.cameraYaw));
    this.moveDirection
      .copy(this.forward)
      .multiplyScalar(-frame.moveZ)
      .addScaledVector(this.right, frame.moveX);

    const hasMovement = this.moveDirection.lengthSq() > 0.001;
    if (hasMovement) this.moveDirection.normalize();

    const speed = PLAYER_SPEED * (frame.sprint ? SPRINT_MULTIPLIER : 1);
    const position = this.player.root.position;
    const next = clampToWorld(
      position.x + this.moveDirection.x * speed * deltaSeconds,
      position.z + this.moveDirection.z * speed * deltaSeconds,
    );

    if (hasMovement) {
      const collision = this.world.colliders.find((collider) => {
        const distance = Math.hypot(next.x - collider.x, next.z - collider.z);
        return distance < collider.radius + PLAYER_RADIUS;
      });
      if (!collision) {
        position.x = next.x;
        position.z = next.z;
        this.player.setFacing(this.moveDirection);
      }
    }

    const groundY = terrainHeightAt(position.x, position.z);
    const grounded = position.y <= groundY + 0.025;
    if (frame.jumpPressed && grounded) this.verticalVelocity = 8.2;
    this.verticalVelocity -= 19.5 * deltaSeconds;
    position.y += this.verticalVelocity * deltaSeconds;
    if (position.y <= groundY) {
      position.y = groundY;
      this.verticalVelocity = 0;
    }

    this.player.updateAnimation(
      deltaSeconds,
      hasMovement ? speed : 0,
      this.attackAnimationTime > 0,
    );
    this.attackCooldown = Math.max(0, this.attackCooldown - deltaSeconds);
    this.attackAnimationTime = Math.max(0, this.attackAnimationTime - deltaSeconds);

    this.worldBuilder.update(deltaSeconds, this.elapsedSeconds);
    this.collectNearbyMotes();
    this.updateInteractionPrompt();
    this.handleActions(frame.interactPressed, frame.attackPressed);
    this.updateCamera(deltaSeconds);
    this.autosave();

    this.hud.render({
      progression: this.progression.snapshot(),
      objectiveTitle: this.objectiveComplete
        ? 'The Valley Has Answered'
        : 'A Breath Before the Mountain',
      objectiveCopy: this.objectiveComplete
        ? 'The first attunement is complete. Follow the old stone path beyond the compound.'
        : "Reach the stone altar and attune to the valley's spiritual current.",
      fieldNote: this.world.trainingTarget.defeated
        ? 'The training effigy has fallen. Qi motes still gather along the old path.'
        : 'Qi motes gather along old paths. Strike the wooden effigy to test your timing.',
      fps: this.displayedFps,
    });
  }

  private updateInteractionPrompt(): void {
    const position = this.player.root.position;
    const altarDistance = position.distanceTo(this.world.altarPosition);
    const targetDistance = position.distanceTo(this.world.trainingTarget.position);

    if (altarDistance < 7.5 && !this.objectiveComplete) {
      this.hud.setInteractionPrompt('E  ·  ATTUNE TO THE ALTAR');
    } else if (targetDistance < 4.4 && !this.world.trainingTarget.defeated) {
      this.hud.setInteractionPrompt('J  ·  STRIKE THE TRAINING EFFIGY');
    } else {
      this.hud.setInteractionPrompt('');
    }
  }

  private handleActions(interactPressed: boolean, attackPressed: boolean): void {
    const position = this.player.root.position;
    if (interactPressed) {
      const distance = position.distanceTo(this.world.altarPosition);
      if (distance <= 7.5 && !this.objectiveComplete) {
        this.progression.addQi(18);
        this.progression.addSpiritShards(1);
        this.objectiveComplete = true;
        this.hud.notify('Attunement complete · +18 Qi · +1 Spirit Shard');
        this.saveNow();
      } else if (this.objectiveComplete) {
        this.hud.notify('The altar has already answered your first attunement.');
      } else {
        this.hud.notify('The altar is beyond the training ground. Follow the stone path.');
      }
    }

    if (!attackPressed || this.attackCooldown > 0) return;
    this.attackCooldown = 0.42;
    this.attackAnimationTime = 0.28;
    const targetDistance = position.distanceTo(this.world.trainingTarget.position);

    if (targetDistance <= 4.4 && !this.world.trainingTarget.defeated) {
      this.world.trainingTarget.durability -= 1;
      this.world.trainingTarget.object.rotation.y += 0.3;
      if (this.world.trainingTarget.durability <= 0) {
        this.world.trainingTarget.defeated = true;
        this.world.trainingTarget.object.visible = false;
        this.progression.addQi(22);
        this.hud.notify('Training effigy broken · +22 Qi');
        this.saveNow();
      } else {
        this.hud.notify(
          `Strike landed · ${this.world.trainingTarget.durability} impacts remaining`,
        );
      }
    } else if (targetDistance <= 5.5) {
      this.hud.notify('The training effigy has already been broken.');
    } else {
      this.hud.notify('No training target in reach.');
    }
  }

  private collectNearbyMotes(): void {
    const position = this.player.root.position;
    for (const mote of this.world.collectibles) {
      if (mote.collected) continue;
      const distance = Math.hypot(position.x - mote.position.x, position.z - mote.position.z);
      if (distance > 2.2) continue;

      mote.collected = true;
      mote.object.visible = false;
      this.progression.addQi(5);
      this.hud.notify('Spiritual mote absorbed · +5 Qi');
      this.saveNow();
    }
  }

  private updateCamera(deltaSeconds: number): void {
    const position = this.player.root.position;
    const distance = 10.8;
    const horizontal = Math.cos(this.cameraPitch) * distance;
    const vertical = Math.sin(this.cameraPitch) * distance;

    this.desiredCameraPosition.set(
      position.x + Math.sin(this.cameraYaw) * horizontal,
      position.y + 3.2 + vertical,
      position.z + Math.cos(this.cameraYaw) * horizontal,
    );
    const smoothing = 1 - Math.exp(-deltaSeconds * 6.5);
    this.camera.position.lerp(this.desiredCameraPosition, smoothing);
    this.cameraTarget.set(position.x, position.y + 1.7, position.z);
    this.camera.lookAt(this.cameraTarget);
  }

  private addLighting(): void {
    this.scene.add(new HemisphereLight(0xdce9df, 0x56604d, 2.15));
    const sun = new DirectionalLight(0xffe4bd, 3.15);
    sun.position.set(-82, 116, 52);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1536, 1536);
    sun.shadow.camera.left = -105;
    sun.shadow.camera.right = 105;
    sun.shadow.camera.top = 105;
    sun.shadow.camera.bottom = -105;
    sun.shadow.bias = -0.00018;
    sun.shadow.normalBias = 0.035;
    this.scene.add(sun);
  }

  private updateFrameRate(deltaSeconds: number): void {
    this.frameCount += 1;
    this.fpsAccumulator += deltaSeconds;
    if (this.fpsAccumulator < 0.5) return;
    this.displayedFps = this.frameCount / this.fpsAccumulator;
    this.frameCount = 0;
    this.fpsAccumulator = 0;
  }

  private autosave(): void {
    if (this.elapsedSeconds - this.lastSaveAt >= 20) this.saveNow();
  }

  private saveNow(): void {
    const position = this.player.root.position;
    const state = this.progression.snapshot();
    const saved = this.saveRepository.save({
      version: 1,
      qi: state.qi,
      spiritShards: state.spiritShards,
      playerX: position.x,
      playerZ: position.z,
      attunementComplete: this.objectiveComplete,
      trainingTargetDefeated: this.world.trainingTarget.defeated,
      collectedMoteIds: this.world.collectibles
        .filter((mote) => mote.collected)
        .map((mote) => mote.id),
    });
    this.lastSaveAt = this.elapsedSeconds;
    if (!saved) this.hud.notify('Local save unavailable · progress may not persist after closing.');
  }

  private readonly resize = (): void => {
    const width = Math.max(1, window.innerWidth);
    const height = Math.max(1, window.innerHeight);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  };

  private readonly onVisibilityChange = (): void => {
    if (document.hidden) {
      this.saveNow();
      this.clock.stop();
    } else {
      this.clock.start();
    }
  };
}
