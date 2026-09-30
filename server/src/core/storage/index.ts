import { localDiskDriver } from './localDiskDriver';
import { StorageDriver } from './StorageDriver';

export type { StorageDriver };

/** Swap the driver here (e.g. S3) without touching the media module. */
export const storage: StorageDriver = localDiskDriver;
