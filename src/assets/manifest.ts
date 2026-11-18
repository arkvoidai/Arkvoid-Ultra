import type { AssetRequest } from './assetLoader';

/**
 * Declared assets. Every entry needs a row in docs/production/ASSET_REGISTER.md
 * once the file exists. The game must run with all fallbacks.
 */
export const ASSETS = {
  playerAvatar: {
    id: 'player-avatar',
    url: '/assets/models/player.glb',
    required: false,
    retries: 0,
  },
} as const satisfies Record<string, AssetRequest>;
