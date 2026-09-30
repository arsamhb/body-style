/**
 * Minimal blob storage contract. The local-disk driver is the default; an S3-compatible driver
 * only needs to implement these two methods and be returned from `core/storage/index.ts`.
 * Keys are always generated server-side (`YYYY/MM/<timestamp>-<random>.webp`), never from input.
 */
export interface StorageDriver {
  put(key: string, data: Buffer, contentType: string): Promise<{ url: string }>;
  remove(key: string): Promise<void>;
}
