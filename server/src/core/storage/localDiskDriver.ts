import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { config } from '../../config/env';
import { StorageDriver } from './StorageDriver';

const ROOT = path.resolve(config.uploads.dir);
const SAFE_KEY = /^\d{4}\/\d{2}\/[a-z0-9-]+\.[a-z0-9]+$/;

const resolveKey = (key: string): string => {
  if (!SAFE_KEY.test(key)) throw new Error(`Unsafe storage key: ${key}`);
  const full = path.resolve(ROOT, key);
  if (!full.startsWith(ROOT + path.sep))
    throw new Error('Storage key escapes the uploads root');
  return full;
};

/** Writes under UPLOADS_DIR; files are served by `express.static('/uploads')` in app.ts. */
export const localDiskDriver: StorageDriver = {
  async put(key, data) {
    const full = resolveKey(key);
    await mkdir(path.dirname(full), { recursive: true });
    await writeFile(full, data);
    return { url: `/uploads/${key}` };
  },
  async remove(key) {
    await rm(resolveKey(key), { force: true });
  },
};
