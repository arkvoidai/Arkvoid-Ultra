import {
  BufferAttribute,
  BoxGeometry,
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DodecahedronGeometry,
  Euler,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  Quaternion,
  Scene,
  SphereGeometry,
  TorusGeometry,
  Vector3,
} from 'three';
import { createSeededRandom } from './random';
import { terrainHeightAt, WORLD_HALF_EXTENT } from './terrain';

export interface WorldCollider {
  x: number;
  z: number;
  radius: number;
}

export interface QiCollectible {
  id: string;
  object: Group;
  position: Vector3;
  baseY: number;
  collected: boolean;
}

export interface TrainingTarget {
  object: Group;
  position: Vector3;
  durability: number;
  defeated: boolean;
}

export interface WorldBuildResult {
  colliders: WorldCollider[];
  collectibles: QiCollectible[];
  altarPosition: Vector3;
  trainingTarget: TrainingTarget;
}

const matrix = new Matrix4();
const quaternion = new Quaternion();
const upAxis = new Vector3(0, 1, 0);

export class WorldBuilder {
  private readonly random = createSeededRandom(0x41a7c0de);
  private readonly collectibles: QiCollectible[] = [];

  build(scene: Scene): WorldBuildResult {
    this.buildTerrain(scene);
    this.buildLake(scene);
    this.buildMountains(scene);
    const colliders = this.buildTrees(scene);
    this.buildRocks(scene);
    this.buildSectCompound(scene);
    const altarPosition = this.buildAltar(scene);
    const trainingTarget = this.buildTrainingTarget(scene);
    this.buildQiMotes(scene);

    return {
      colliders,
      collectibles: this.collectibles,
      altarPosition,
      trainingTarget,
    };
  }

  update(deltaSeconds: number, elapsedSeconds: number): void {
    for (const mote of this.collectibles) {
      if (mote.collected) continue;
      mote.object.position.y = mote.baseY + Math.sin(elapsedSeconds * 1.7 + mote.position.x) * 0.28;
      mote.object.rotation.y += deltaSeconds * 0.8;
      mote.object.rotation.x += deltaSeconds * 0.25;
    }
  }

  private buildTerrain(scene: Scene): void {
    const size = WORLD_HALF_EXTENT * 2;
    const segments = 176;
    const geometry = new PlaneGeometry(size, size, segments, segments);
    const positions = geometry.attributes.position;
    const colors: number[] = [];

    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index);
      const z = -positions.getY(index);
      const height = terrainHeightAt(x, z);
      positions.setZ(index, height);

      const elevation = Math.max(0, Math.min(1, (height + 5) / 44));
      const variation = Math.sin(x * 0.11 + z * 0.06) * 0.025;
      colors.push(
        0.18 + elevation * 0.12 + variation,
        0.25 + elevation * 0.16 + variation,
        0.16 + elevation * 0.1,
      );
    }

    geometry.setAttribute('color', new BufferAttribute(new Float32Array(colors), 3));
    geometry.rotateX(-Math.PI / 2);
    geometry.computeVertexNormals();

    const terrain = new Mesh(
      geometry,
      new MeshStandardMaterial({ vertexColors: true, roughness: 0.96, metalness: 0.01 }),
    );
    terrain.name = 'procedural-valley-heightfield';
    terrain.receiveShadow = true;
    scene.add(terrain);
  }

  private buildLake(scene: Scene): void {
    const water = new Mesh(
      new CircleGeometry(1, 80),
      new MeshStandardMaterial({
        color: 0x4c8790,
        roughness: 0.22,
        metalness: 0.24,
        transparent: true,
        opacity: 0.88,
      }),
    );
    water.name = 'basin-water-surface';
    water.rotation.x = -Math.PI / 2;
    water.scale.set(19, 29, 1);
    water.position.set(62, -2.45, 18);
    water.receiveShadow = true;
    scene.add(water);
  }

  private buildMountains(scene: Scene): void {
    const material = new MeshStandardMaterial({ color: 0x46584e, roughness: 1 });
    const farMaterial = new MeshStandardMaterial({ color: 0x607168, roughness: 1 });
    const positions: Array<[number, number, number, number, number]> = [
      [-156, 26, -118, 46, 92], [-115, 17, -166, 38, 74],
      [-42, 20, -174, 48, 96], [52, 18, -170, 44, 86],
      [132, 25, -142, 53, 108], [168, 18, -54, 42, 78],
      [169, 23, 62, 55, 96], [114, 14, 157, 43, 74],
      [8, 16, 172, 51, 96], [-104, 22, 157, 49, 104],
      [-172, 21, 66, 47, 88], [-174, 14, -34, 38, 70],
    ];

    for (let index = 0; index < positions.length; index += 1) {
      const [x, y, z, radius, height] = positions[index]!;
      const mountain = new Mesh(
        new ConeGeometry(radius, height, 7, 1),
        index % 3 === 0 ? farMaterial : material,
      );
      mountain.position.set(x, y + terrainHeightAt(x, z) + height * 0.24, z);
      mountain.rotation.y = this.random() * Math.PI;
      mountain.scale.set(1.1 + this.random() * 0.5, 1, 0.8 + this.random() * 0.45);
      mountain.castShadow = true;
      mountain.receiveShadow = true;
      scene.add(mountain);
    }
  }

  private buildTrees(scene: Scene): WorldCollider[] {
    const requestedCount = 320;
    const trunks = new InstancedMesh(
      new CylinderGeometry(0.25, 0.42, 1, 7),
      new MeshStandardMaterial({ color: 0x584536, roughness: 1 }),
      requestedCount,
    );
    const canopies = new InstancedMesh(
      new ConeGeometry(1.9, 5.4, 7, 1),
      new MeshStandardMaterial({ color: 0x385b48, roughness: 0.92 }),
      requestedCount,
    );
    const colliders: WorldCollider[] = [];
    let placed = 0;
    let attempts = 0;

    while (placed < requestedCount && attempts < requestedCount * 8) {
      attempts += 1;
      const angle = this.random() * Math.PI * 2;
      const radius = 28 + this.random() * 140;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const lakeDistance = Math.hypot((x - 62) / 20, (z - 18) / 30);

      if (Math.hypot(x, z - 34) < 16) continue;
      if (Math.hypot(x, z + 48) < 29) continue;
      if (lakeDistance < 1.12) continue;
      if (Math.abs(x) > 165 || Math.abs(z) > 165) continue;

      const groundY = terrainHeightAt(x, z);
      const trunkHeight = 3.4 + this.random() * 2.5;
      const lean = (this.random() - 0.5) * 0.12;
      matrix.compose(
        new Vector3(x, groundY + trunkHeight * 0.5, z),
        quaternion.setFromAxisAngle(upAxis, lean),
        new Vector3(1, trunkHeight, 1),
      );
      trunks.setMatrixAt(placed, matrix);

      matrix.compose(
        new Vector3(x, groundY + trunkHeight + 1.45, z),
        quaternion.setFromAxisAngle(upAxis, this.random() * Math.PI),
        new Vector3(
          1.05 + this.random() * 0.55,
          1 + this.random() * 0.48,
          1.05 + this.random() * 0.55,
        ),
      );
      canopies.setMatrixAt(placed, matrix);
      canopies.setColorAt(
        placed,
        new Color(
          0.82 + this.random() * 0.22,
          0.88 + this.random() * 0.16,
          0.82 + this.random() * 0.18,
        ),
      );
      colliders.push({ x, z, radius: 0.9 });
      placed += 1;
    }

    trunks.count = placed;
    canopies.count = placed;
    trunks.castShadow = true;
    canopies.castShadow = true;
    trunks.receiveShadow = true;
    canopies.receiveShadow = true;
    trunks.name = 'instanced-tree-trunks';
    canopies.name = 'instanced-tree-canopies';
    trunks.computeBoundingSphere();
    canopies.computeBoundingSphere();
    scene.add(trunks, canopies);
    return colliders;
  }

  private buildRocks(scene: Scene): void {
    const count = 110;
    const rocks = new InstancedMesh(
      new DodecahedronGeometry(1, 0),
      new MeshStandardMaterial({ color: 0x66716a, roughness: 0.94 }),
      count,
    );

    for (let index = 0; index < count; index += 1) {
      const angle = this.random() * Math.PI * 2;
      const radius = 18 + this.random() * 130;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const scale = 0.35 + this.random() * 1.1;
      matrix.compose(
        new Vector3(x, terrainHeightAt(x, z) + scale * 0.55, z),
        quaternion.setFromEuler(new Euler(this.random(), this.random() * Math.PI, this.random())),
        new Vector3(scale * 1.4, scale, scale),
      );
      rocks.setMatrixAt(index, matrix);
    }

    rocks.castShadow = true;
    rocks.receiveShadow = true;
    rocks.name = 'instanced-valley-stones';
    rocks.computeBoundingSphere();
    scene.add(rocks);
  }

  private buildSectCompound(scene: Scene): void {
    const compound = new Group();
    compound.name = 'first-valley-sect-compound';
    const x = 0;
    const z = -48;
    const y = terrainHeightAt(x, z);

    const foundation = new MeshStandardMaterial({ color: 0x77776b, roughness: 0.88 });
    const timber = new MeshStandardMaterial({ color: 0x413d32, roughness: 0.78 });
    const plaster = new MeshStandardMaterial({ color: 0xb9b19b, roughness: 0.92 });
    const roof = new MeshStandardMaterial({ color: 0x263f3b, roughness: 0.58, metalness: 0.18 });
    const bronze = new MeshStandardMaterial({ color: 0x9d7746, roughness: 0.42, metalness: 0.68 });

    const addBox = (
      width: number,
      height: number,
      depth: number,
      material: MeshStandardMaterial,
      position: Vector3,
    ): Mesh => {
      const mesh = new Mesh(new BoxGeometry(width, height, depth), material);
      mesh.position.copy(position);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      compound.add(mesh);
      return mesh;
    };

    addBox(34, 1.3, 27, foundation, new Vector3(x, y + 0.7, z));
    addBox(28, 0.4, 22, plaster, new Vector3(x, y + 1.55, z));
    addBox(22, 5.8, 16, timber, new Vector3(x, y + 4.45, z));
    addBox(20.5, 4.5, 14.5, plaster, new Vector3(x, y + 4.15, z));

    const frontPillars: Array<[number, number, number]> = [
      [-5.8, y + 4.2, z + 7.35],
      [5.8, y + 4.2, z + 7.35],
    ];
    for (const [pillarX, pillarY, pillarZ] of frontPillars) {
      const pillar = new Mesh(new CylinderGeometry(0.5, 0.62, 6.4, 10), timber);
      pillar.position.set(pillarX, pillarY, pillarZ);
      pillar.castShadow = true;
      compound.add(pillar);
    }

    for (const side of [-1, 1]) {
      for (const depth of [-5.6, 5.6]) {
        const pillar = new Mesh(new CylinderGeometry(0.48, 0.62, 6.4, 10), timber);
        pillar.position.set(side * 9.2, y + 4.1, z + depth);
        pillar.castShadow = true;
        compound.add(pillar);
      }
    }

    const lowerRoof = new Mesh(new ConeGeometry(17, 4.1, 4), roof);
    lowerRoof.position.set(x, y + 8.3, z);
    lowerRoof.rotation.y = Math.PI / 4;
    lowerRoof.scale.set(1.18, 1, 0.94);
    lowerRoof.castShadow = true;
    compound.add(lowerRoof);

    const upperRoof = new Mesh(new ConeGeometry(10.5, 3.4, 4), roof);
    upperRoof.position.set(x, y + 10.65, z);
    upperRoof.rotation.y = Math.PI / 4;
    upperRoof.scale.set(1.2, 1, 0.96);
    upperRoof.castShadow = true;
    compound.add(upperRoof);

    const ridge = new Mesh(new CylinderGeometry(0.19, 0.19, 17, 8), bronze);
    ridge.rotation.z = Math.PI / 2;
    ridge.position.set(x, y + 12.35, z);
    compound.add(ridge);

    for (let index = 0; index < 7; index += 1) {
      const step = new Mesh(new BoxGeometry(9 + index * 1.4, 0.34, 1.05), foundation);
      step.position.set(0, y + 0.35 + index * 0.36, z + 15 + index * 0.62);
      step.castShadow = true;
      step.receiveShadow = true;
      compound.add(step);
    }

    for (const side of [-1, 1]) {
      const post = new Mesh(new CylinderGeometry(0.42, 0.52, 8.2, 9), timber);
      post.position.set(side * 12.5, y + 4.2, z + 23.5);
      compound.add(post);
    }
    const lintel = new Mesh(new BoxGeometry(28, 0.8, 1.3), bronze);
    lintel.position.set(0, y + 8.15, z + 23.5);
    compound.add(lintel);

    scene.add(compound);
  }

  private buildAltar(scene: Scene): Vector3 {
    const position = new Vector3(13, terrainHeightAt(13, 11), 11);
    const group = new Group();
    const stone = new MeshStandardMaterial({ color: 0x4d5851, roughness: 0.82 });
    const metal = new MeshStandardMaterial({ color: 0x9d8050, metalness: 0.72, roughness: 0.35 });
    const glow = new MeshStandardMaterial({
      color: 0x7fc9ba,
      emissive: 0x2d8e84,
      emissiveIntensity: 1.6,
      roughness: 0.22,
    });

    const base = new Mesh(new BoxGeometry(3.8, 0.8, 3.8), stone);
    base.position.y = 0.4;
    group.add(base);
    const column = new Mesh(new CylinderGeometry(0.7, 1.1, 2.6, 8), stone);
    column.position.y = 2.05;
    group.add(column);
    const ring = new Mesh(new TorusGeometry(1.08, 0.09, 8, 48), metal);
    ring.position.y = 2.1;
    ring.rotation.x = Math.PI / 2;
    group.add(ring);
    const core = new Mesh(new IcosahedronGeometry(0.62, 1), glow);
    core.position.y = 3.15;
    group.add(core);

    group.position.copy(position);
    group.name = 'spirit-attunement-altar';
    group.traverse((object) => {
      if (object instanceof Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    scene.add(group);
    return position;
  }

  private buildTrainingTarget(scene: Scene): TrainingTarget {
    const position = new Vector3(-11, terrainHeightAt(-11, 8), 8);
    const group = new Group();
    const straw = new MeshStandardMaterial({ color: 0x95734a, roughness: 1 });
    const wood = new MeshStandardMaterial({ color: 0x493c30, roughness: 0.96 });

    const torso = new Mesh(new CylinderGeometry(0.42, 0.56, 1.6, 8), straw);
    torso.position.y = 1.55;
    group.add(torso);
    const head = new Mesh(new SphereGeometry(0.42, 10, 8), straw);
    head.position.y = 2.65;
    group.add(head);
    const post = new Mesh(new CylinderGeometry(0.12, 0.15, 3.4, 7), wood);
    post.position.y = 1.55;
    group.add(post);
    const crossbar = new Mesh(new BoxGeometry(2.1, 0.16, 0.16), wood);
    crossbar.position.y = 2;
    group.add(crossbar);

    group.position.copy(position);
    group.name = 'training-effigy-blockout';
    group.traverse((object) => {
      if (object instanceof Mesh) object.castShadow = true;
    });
    scene.add(group);

    return { object: group, position, durability: 3, defeated: false };
  }

  private buildQiMotes(scene: Scene): void {
    const crystalMaterial = new MeshStandardMaterial({
      color: 0xa7f4dd,
      emissive: 0x3cae91,
      emissiveIntensity: 1.8,
      roughness: 0.18,
      metalness: 0.12,
    });
    let created = 0;
    let attempts = 0;
    const targetCount = 28;

    while (created < targetCount && attempts < targetCount * 12) {
      attempts += 1;
      const angle = this.random() * Math.PI * 2;
      const radius = 14 + this.random() * 54;
      const x = Math.cos(angle) * radius;
      const z = 25 + Math.sin(angle) * radius;
      if (Math.hypot(x, z - 34) < 7) continue;
      if (Math.hypot(x, z + 48) < 24) continue;

      const baseY = terrainHeightAt(x, z) + 1.6 + this.random() * 1.1;
      const object = new Group();
      const crystal = new Mesh(new IcosahedronGeometry(0.48, 1), crystalMaterial);
      crystal.scale.set(0.74, 1.25, 0.74);
      object.add(crystal);
      const halo = new Mesh(
        new SphereGeometry(0.78, 10, 8),
        new MeshStandardMaterial({
          color: 0x80d7c3,
          transparent: true,
          opacity: 0.12,
          emissive: 0x2b8376,
          emissiveIntensity: 0.7,
        }),
      );
      object.add(halo);
      object.position.set(x, baseY, z);
      object.name = 'collectible-qi-mote';
      scene.add(object);

      this.collectibles.push({
        id: `qi-${created + 1}`,
        object,
        position: new Vector3(x, baseY, z),
        baseY,
        collected: false,
      });
      created += 1;
    }
  }
}
