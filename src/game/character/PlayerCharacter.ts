import {
  CapsuleGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  Vector3,
} from 'three';

export class PlayerCharacter {
  readonly root = new Group();
  private readonly body = new Group();
  private readonly leftArm: Group;
  private readonly rightArm: Group;
  private readonly leftLeg: Group;
  private readonly rightLeg: Group;
  private readonly weapon: Group;
  private animationTime = 0;

  constructor() {
    this.root.name = 'player-character-blockout';
    const robe = new MeshStandardMaterial({ color: 0x293f3c, roughness: 0.78, metalness: 0.08 });
    const trim = new MeshStandardMaterial({ color: 0xb08a54, roughness: 0.46, metalness: 0.58 });
    const skin = new MeshStandardMaterial({ color: 0xb78a70, roughness: 0.82 });
    const dark = new MeshStandardMaterial({ color: 0x202825, roughness: 0.88 });

    const torso = new Mesh(new CapsuleGeometry(0.53, 1.08, 4, 8), robe);
    torso.position.y = 1.42;
    this.body.add(torso);

    const sash = new Mesh(new CapsuleGeometry(0.56, 0.18, 3, 8), trim);
    sash.position.y = 1.2;
    sash.scale.set(1, 0.5, 1);
    this.body.add(sash);

    const head = new Mesh(new SphereGeometry(0.31, 14, 12), skin);
    head.position.y = 2.55;
    this.body.add(head);

    const hair = new Mesh(new SphereGeometry(0.34, 12, 8), dark);
    hair.position.set(0, 2.75, -0.04);
    hair.scale.set(1.02, 0.72, 1.06);
    this.body.add(hair);

    const hairTail = new Mesh(new CapsuleGeometry(0.09, 0.5, 3, 6), dark);
    hairTail.position.set(0, 2.32, -0.27);
    hairTail.rotation.x = -0.24;
    this.body.add(hairTail);

    const shoulder = new Mesh(new CapsuleGeometry(0.18, 0.54, 3, 6), robe);
    shoulder.position.y = 2.08;
    shoulder.scale.set(1.05, 0.72, 1.25);
    this.body.add(shoulder);

    this.leftArm = this.createLimb(robe, 0.16, 0.58, -0.68, 1.98);
    this.rightArm = this.createLimb(robe, 0.16, 0.58, 0.68, 1.98);
    this.leftLeg = this.createLimb(dark, 0.18, 0.7, -0.24, 0.48);
    this.rightLeg = this.createLimb(dark, 0.18, 0.7, 0.24, 0.48);
    this.body.add(this.leftArm, this.rightArm, this.leftLeg, this.rightLeg);

    this.weapon = new Group();
    const grip = new Mesh(new CapsuleGeometry(0.045, 0.58, 2, 5), dark);
    grip.position.y = -0.08;
    const blade = new Mesh(new CapsuleGeometry(0.075, 1.05, 3, 5), trim);
    blade.position.y = 0.72;
    blade.scale.set(0.72, 1, 0.24);
    this.weapon.add(grip, blade);
    this.weapon.position.set(0.82, 1.45, 0.02);
    this.weapon.rotation.z = -0.28;
    this.body.add(this.weapon);

    this.root.add(this.body);
  }

  setFacing(direction: Vector3): void {
    if (direction.lengthSq() < 0.0001) return;
    this.root.rotation.y = Math.atan2(direction.x, direction.z);
  }

  updateAnimation(deltaSeconds: number, horizontalSpeed: number, attacking: boolean): void {
    this.animationTime += deltaSeconds;
    const moving = horizontalSpeed > 0.15;
    const gait = moving ? Math.sin(this.animationTime * (horizontalSpeed > 7 ? 13 : 9)) : 0;
    this.body.position.y = moving ? Math.abs(gait) * 0.045 : Math.sin(this.animationTime * 1.2) * 0.018;
    this.leftLeg.rotation.x = gait * 0.36;
    this.rightLeg.rotation.x = -gait * 0.36;
    this.leftArm.rotation.x = -gait * 0.28;
    this.rightArm.rotation.x = gait * 0.28;
    this.weapon.rotation.z = attacking ? -1.12 : -0.28;
    this.weapon.rotation.x = attacking ? -0.26 : 0;
  }

  private createLimb(
    material: MeshStandardMaterial,
    radius: number,
    length: number,
    x: number,
    y: number,
  ): Group {
    const group = new Group();
    const limb = new Mesh(new CapsuleGeometry(radius, length, 3, 6), material);
    limb.position.y = -length * 0.24;
    group.position.set(x, y, 0);
    group.add(limb);
    return group;
  }
}
