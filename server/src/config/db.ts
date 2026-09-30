import mongoose from 'mongoose';
import { config } from './env';
import { logger } from '../core/logger';

/** Connect to MongoDB. Throws on failure so the caller can abort startup. */
export async function connectDb(): Promise<void> {
  mongoose.set('strictQuery', true);
  await mongoose.connect(config.mongoUri);
  logger.info('MongoDB connected');
}

/** Close the connection cleanly (used on graceful shutdown and by the seed script). */
export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
}
