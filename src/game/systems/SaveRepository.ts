export interface PlayerSave {
  version: 1;
  qi: number;
  spiritShards: number;
  playerX: number;
  playerZ: number;
  attunementComplete: boolean;
  trainingTargetDefeated: boolean;
  collectedMoteIds: string[];
}

const SAVE_KEY = 'arkvoid.save.v1';
const validNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

export class SaveRepository {
  load(): PlayerSave | null {
    try {
      const raw = window.localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const parsed: unknown = JSON.parse(raw);
      if (typeof parsed !== 'object' || parsed === null) return null;

      const candidate = parsed as Record<string, unknown>;
      if (
        candidate.version !== 1 ||
        !validNumber(candidate.qi) ||
        !validNumber(candidate.spiritShards) ||
        !validNumber(candidate.playerX) ||
        !validNumber(candidate.playerZ) ||
        typeof candidate.attunementComplete !== 'boolean' ||
        typeof candidate.trainingTargetDefeated !== 'boolean' ||
        !Array.isArray(candidate.collectedMoteIds) ||
        !candidate.collectedMoteIds.every((item: unknown) => typeof item === 'string')
      ) {
        return null;
      }

      return {
        version: 1,
        qi: Math.max(0, Math.floor(candidate.qi)),
        spiritShards: Math.max(0, Math.floor(candidate.spiritShards)),
        playerX: candidate.playerX,
        playerZ: candidate.playerZ,
        attunementComplete: candidate.attunementComplete,
        trainingTargetDefeated: candidate.trainingTargetDefeated,
        collectedMoteIds: candidate.collectedMoteIds,
      };
    } catch {
      return null;
    }
  }

  save(save: PlayerSave): boolean {
    try {
      window.localStorage.setItem(SAVE_KEY, JSON.stringify(save));
      return true;
    } catch {
      return false;
    }
  }
}
