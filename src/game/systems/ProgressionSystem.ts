export interface ProgressionSnapshot {
  qi: number;
  spiritShards: number;
  rankName: string;
  currentThreshold: number;
  nextThreshold: number;
  progress: number;
}

interface RankDefinition {
  name: string;
  minimumQi: number;
}

const RANKS: readonly RankDefinition[] = [
  { name: 'Mortal Foundation', minimumQi: 0 },
  { name: 'Qi Condensation · First Layer', minimumQi: 30 },
  { name: 'Qi Condensation · Third Layer', minimumQi: 85 },
  { name: 'Qi Condensation · Sixth Layer', minimumQi: 160 },
  { name: 'Foundation Establishment', minimumQi: 280 },
  { name: 'Foundation Establishment · Stable', minimumQi: 450 },
];

export class ProgressionSystem {
  constructor(
    private qi = 0,
    private spiritShards = 0,
  ) {
    this.qi = Math.max(0, Math.floor(qi));
    this.spiritShards = Math.max(0, Math.floor(spiritShards));
  }

  addQi(amount: number): void {
    if (Number.isFinite(amount) && amount > 0) this.qi += Math.floor(amount);
  }

  addSpiritShards(amount: number): void {
    if (Number.isFinite(amount) && amount > 0) this.spiritShards += Math.floor(amount);
  }

  snapshot(): ProgressionSnapshot {
    let rankIndex = 0;
    for (let index = 0; index < RANKS.length; index += 1) {
      if (this.qi >= RANKS[index]!.minimumQi) rankIndex = index;
    }

    const current = RANKS[rankIndex]!;
    const next = RANKS[rankIndex + 1];
    const nextThreshold = next?.minimumQi ?? current.minimumQi + 200;
    const span = Math.max(1, nextThreshold - current.minimumQi);
    const progress = Math.min(1, Math.max(0, (this.qi - current.minimumQi) / span));

    return {
      qi: this.qi,
      spiritShards: this.spiritShards,
      rankName: current.name,
      currentThreshold: current.minimumQi,
      nextThreshold,
      progress,
    };
  }
}
