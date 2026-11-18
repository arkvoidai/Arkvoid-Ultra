import type { Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { createLogger } from '../core/logger';

const log = createLogger('assets');

export interface AssetRequest {
  readonly id: string;
  readonly url: string;
  /** Required assets log at error level when they fall back; optional at warn. */
  readonly required: boolean;
  readonly timeoutMs?: number;
  readonly retries?: number;
}

export interface AssetFailure {
  readonly id: string;
  readonly url: string;
  readonly reason: string;
}

export interface LoadedAsset {
  readonly object: Object3D;
  readonly usedFallback: boolean;
}

const DEFAULT_TIMEOUT_MS = 8000;
const DEFAULT_RETRIES = 2;
const failures: AssetFailure[] = [];

export function getAssetFailures(): readonly AssetFailure[] {
  return failures;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timed out after ${ms} ms`));
    }, ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error instanceof Error ? error : new Error(String(error)));
      },
    );
  });
}

/**
 * Loads a glTF with timeout + retries. On final failure the failure is logged
 * and recorded, and `fallback()` supplies a stand-in so the game stays playable.
 */
export async function loadGltfWithFallback(
  request: AssetRequest,
  fallback: () => Object3D,
): Promise<LoadedAsset> {
  const loader = new GLTFLoader();
  const timeout = request.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const attempts = (request.retries ?? DEFAULT_RETRIES) + 1;
  let lastReason = 'unknown';

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const gltf = await withTimeout(loader.loadAsync(request.url), timeout);
      log.info(`Loaded asset "${request.id}"`, { attempt });
      return { object: gltf.scene, usedFallback: false };
    } catch (error) {
      lastReason = error instanceof Error ? error.message : String(error);
      log.debug(`Asset "${request.id}" attempt ${attempt}/${attempts} failed`, lastReason);
    }
  }

  failures.push({ id: request.id, url: request.url, reason: lastReason });
  const message = `Asset "${request.id}" unavailable, using fallback`;
  if (request.required) log.error(message, lastReason);
  else log.warn(message, lastReason);
  return { object: fallback(), usedFallback: true };
}
