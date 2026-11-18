import * as THREE from 'three';
import { loadGltfWithFallback } from '../assets/assetLoader';
import { ASSETS } from '../assets/manifest';
import { CAMERA, LOOP, PLAYER, RENDER, WORLD } from '../config/gameConfig';
import { FixedStepper } from '../core/fixedStepper';
import { clamp } from '../core/math';
import { createLogger } from '../core/logger';
import { Input } from '../input/input';
import type { MoveIntent, PlayerEnvironment } from '../player/playerController';
import { createPlayerState, stepPlayer } from '../player/playerController';
import { Hud } from '../ui/hud';
import { ChunkManager } from '../world/chunkManager';
import type { ChunkUpdateStats } from '../world/chunkManager';
import { createHeightfield } from '../world/heightfield';
import { createCourtyard } from '../world/structures';
import { buildTerrainChunk } from '../world/terrainMesh';

const log = createLogger('game');

const SKY_VERTEX = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const SKY_FRAGMENT = /* glsl */ `
  uniform vec3 topColor;
  uniform vec3 horizonColor;
  varying vec3 vDir;
  void main() {
    float t = pow(clamp(vDir.y, 0.0, 1.0), 0.55);
    gl_FragColor = vec4(mix(horizonColor, topColor, t), 1.0);
    #include <colorspace_fragment>
  }
`;

export class Game {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly sun: THREE.DirectionalLight;
  private readonly sky: THREE.Mesh;
  private readonly avatar = new THREE.Group();
  private readonly input: Input;
  private readonly hud: Hud;
  private readonly stepper = new FixedStepper(LOOP.stepSeconds, LOOP.maxStepsPerFrame);
  private readonly heightAt = createHeightfield(WORLD);
  private readonly structures = createCourtyard(WORLD.plazaHeight);
  private readonly env: PlayerEnvironment;
  private readonly player = createPlayerState(0, WORLD.plazaHeight + 0.5, 30);
  private readonly intent: MoveIntent = {
    forward: 0,
    right: 0,
    run: false,
    jump: false,
    cameraYaw: 0,
  };
  private readonly terrainMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.95,
    metalness: 0,
  });
  private readonly chunks: ChunkManager<THREE.Mesh>;
  private readonly resizeObserver: ResizeObserver;

  private camYaw = 0;
  private camPitch = 0.35;
  private avatarIsPlaceholder = true;
  private lastChunkX = Number.NaN;
  private lastChunkZ = Number.NaN;
  private chunkStats: ChunkUpdateStats = { loaded: 0, unloaded: 0, resident: 0, pending: 0 };
  private running = false;
  private rafId = 0;
  private lastTime = 0;
  private smoothedDt = 1 / 60;
  private hudTimer = 0;

  constructor(private readonly container: HTMLElement) {
    try {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    } catch (error) {
      throw new Error(
        `WebGL is not available in this browser (${error instanceof Error ? error.message : 'unknown'})`,
      );
    }
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, RENDER.maxPixelRatio));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.append(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(CAMERA.fov, 1, CAMERA.near, CAMERA.far);

    // Atmosphere
    const horizon = new THREE.Color(RENDER.skyHorizon);
    this.scene.background = horizon;
    this.scene.fog = new THREE.Fog(horizon, RENDER.fogNear, RENDER.fogFar);
    this.sky = new THREE.Mesh(
      new THREE.SphereGeometry(500, 24, 12),
      new THREE.ShaderMaterial({
        uniforms: {
          topColor: { value: new THREE.Color(RENDER.skyTop) },
          horizonColor: { value: horizon },
        },
        vertexShader: SKY_VERTEX,
        fragmentShader: SKY_FRAGMENT,
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
      }),
    );
    this.sky.frustumCulled = false;
    this.scene.add(this.sky);

    this.scene.add(new THREE.HemisphereLight(0xcfe0f5, 0x4a4235, 0.9));
    this.sun = new THREE.DirectionalLight(0xfff1d6, 2.4);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(RENDER.shadowMapSize, RENDER.shadowMapSize);
    const e = RENDER.shadowExtent;
    Object.assign(this.sun.shadow.camera, { left: -e, right: e, top: e, bottom: -e, near: 1, far: 260 });
    this.sun.shadow.bias = -0.0004;
    this.scene.add(this.sun, this.sun.target);

    // Structures (placeholder blockout with real colliders)
    const stone = new THREE.MeshStandardMaterial({ color: 0x9a9488, roughness: 0.9, metalness: 0 });
    for (const s of this.structures) {
      const b = s.bounds;
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(b.maxX - b.minX, b.maxY - b.minY, b.maxZ - b.minZ),
        stone,
      );
      mesh.position.set((b.minX + b.maxX) / 2, (b.minY + b.maxY) / 2, (b.minZ + b.maxZ) / 2);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.name = `structure-${s.id}`;
      this.scene.add(mesh);
    }

    this.env = {
      terrainHeight: this.heightAt,
      colliders: this.structures.map((s) => s.bounds),
    };

    this.chunks = new ChunkManager<THREE.Mesh>({
      chunkSize: WORLD.chunkSize,
      viewRadius: WORLD.viewRadius,
      unloadRadius: WORLD.unloadRadius,
      maxLoadsPerUpdate: WORLD.maxLoadsPerUpdate,
      load: (cx, cz) => {
        const mesh = buildTerrainChunk(cx, cz, WORLD, this.heightAt, this.terrainMaterial);
        this.scene.add(mesh);
        return mesh;
      },
      unload: (mesh) => {
        this.scene.remove(mesh);
        mesh.geometry.dispose();
      },
    });

    this.scene.add(this.avatar);
    this.input = new Input(this.renderer.domElement);
    this.hud = new Hud(container);

    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
    });
    this.resizeObserver.observe(container);
    this.resize();
  }

  /** Loads assets and pre-builds the terrain around the spawn point. */
  async init(): Promise<void> {
    const loaded = await loadGltfWithFallback(ASSETS.playerAvatar, () => this.createPlaceholderAvatar());
    this.avatar.add(loaded.object);
    this.avatarIsPlaceholder = loaded.usedFallback;
    loaded.object.traverse((o) => {
      o.castShadow = true;
    });

    const t0 = performance.now();
    let guard = 0;
    do {
      this.chunkStats = this.chunks.update(this.player.position.x, this.player.position.z);
      guard++;
    } while (this.chunkStats.pending > 0 && guard < 1000);
    const ms = performance.now() - t0;
    log.info('Initial terrain built', {
      chunks: this.chunks.residentCount,
      totalMs: Math.round(ms),
      msPerChunk: Number((ms / Math.max(1, this.chunks.residentCount)).toFixed(2)),
    });
    this.lastChunkX = Math.floor(this.player.position.x / WORLD.chunkSize);
    this.lastChunkZ = Math.floor(this.player.position.z / WORLD.chunkSize);
    this.updateAvatarAndCamera();
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.frame);
  }

  dispose(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);
    this.resizeObserver.disconnect();
    this.input.dispose();
    this.chunks.disposeAll();
    this.terrainMaterial.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  private createPlaceholderAvatar(): THREE.Object3D {
    // PLACEHOLDER: capsule + facing marker. Not a character model.
    const group = new THREE.Group();
    const bodyHeight = PLAYER.height - 2 * PLAYER.radius;
    const body = new THREE.Mesh(
      new THREE.CapsuleGeometry(PLAYER.radius, bodyHeight, 6, 12),
      new THREE.MeshStandardMaterial({ color: 0x3d5a80, roughness: 0.7 }),
    );
    body.position.y = PLAYER.height / 2;
    const nose = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.18, 0.3),
      new THREE.MeshStandardMaterial({ color: 0xe0b45a }),
    );
    nose.position.set(0, PLAYER.height * 0.8, -PLAYER.radius);
    group.add(body, nose);
    group.name = 'placeholder-avatar';
    return group;
  }

  private resize(): void {
    const w = Math.max(1, this.container.clientWidth);
    const h = Math.max(1, this.container.clientHeight);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  private readonly frame = (now: number): void => {
    if (!this.running) return;
    this.rafId = requestAnimationFrame(this.frame);

    const dt = Math.min((now - this.lastTime) / 1000, 0.25);
    this.lastTime = now;
    this.smoothedDt += (dt - this.smoothedDt) * 0.05;

    const look = this.input.poll(dt);
    this.camYaw += look.lookYaw;
    this.camPitch = clamp(this.camPitch + look.lookPitch, CAMERA.minPitch, CAMERA.maxPitch);

    this.intent.forward = look.forward;
    this.intent.right = look.right;
    this.intent.run = look.run;
    this.intent.jump = look.jump;
    this.intent.cameraYaw = this.camYaw;

    const steps = this.stepper.advance(dt);
    for (let i = 0; i < steps; i++) {
      stepPlayer(this.player, this.intent, this.stepper.stepSeconds, this.env);
    }

    this.streamTerrain();
    this.updateAvatarAndCamera();
    this.renderer.render(this.scene, this.camera);

    this.hudTimer += dt;
    if (this.hudTimer >= LOOP.hudIntervalSeconds) {
      this.hudTimer = 0;
      this.updateHud();
    }
  };

  private streamTerrain(): void {
    const cx = Math.floor(this.player.position.x / WORLD.chunkSize);
    const cz = Math.floor(this.player.position.z / WORLD.chunkSize);
    if (cx === this.lastChunkX && cz === this.lastChunkZ && this.chunkStats.pending === 0) return;
    this.lastChunkX = cx;
    this.lastChunkZ = cz;
    this.chunkStats = this.chunks.update(this.player.position.x, this.player.position.z);
  }

  private updateAvatarAndCamera(): void {
    const p = this.player.position;
    this.avatar.position.set(p.x, p.y, p.z);
    this.avatar.rotation.y = this.player.yaw;

    // Third-person orbit camera.
    const cosPitch = Math.cos(this.camPitch);
    const fx = -Math.sin(this.camYaw);
    const fz = -Math.cos(this.camYaw);
    const tx = p.x;
    const ty = p.y + CAMERA.targetHeight;
    const tz = p.z;
    const cx = tx - fx * cosPitch * CAMERA.distance;
    const cz = tz - fz * cosPitch * CAMERA.distance;
    const cy = Math.max(
      ty + Math.sin(this.camPitch) * CAMERA.distance,
      this.heightAt(cx, cz) + CAMERA.minClearance,
    );
    this.camera.position.set(cx, cy, cz);
    this.camera.lookAt(tx, ty, tz);

    this.sky.position.copy(this.camera.position);
    this.sun.position.set(p.x + 70, p.y + 110, p.z + 45);
    this.sun.target.position.set(p.x, p.y, p.z);
  }

  private updateHud(): void {
    const info = this.renderer.info.render;
    const p = this.player.position;
    this.hud.update({
      fps: 1 / this.smoothedDt,
      frameMs: this.smoothedDt * 1000,
      drawCalls: info.calls,
      triangles: info.triangles,
      residentChunks: this.chunks.residentCount,
      pendingChunks: this.chunkStats.pending,
      x: p.x,
      y: p.y,
      z: p.z,
      grounded: this.player.grounded,
      avatarIsPlaceholder: this.avatarIsPlaceholder,
      pointerLocked: this.input.pointerLocked,
    });
  }
}
