import { createApp } from './app';
import { config } from './config/env';
import { connectDb, disconnectDb } from './config/db';
import { logger } from './core/logger';

async function bootstrap(): Promise<void> {
  await connectDb();

  const app = createApp();
  const server = app.listen(config.port, () => {
    logger.info(
      { port: config.port, env: config.nodeEnv },
      `API listening on http://localhost:${config.port}`,
    );
  });

  const shutdown = (signal: string): void => {
    logger.info(`${signal} received, shutting down...`);
    server.close(() => {
      void disconnectDb().finally(() => process.exit(0));
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

// Nothing fails silently: log, then let Docker restart the container.
process.on('unhandledRejection', (reason) => {
  logger.fatal({ err: reason }, 'Unhandled promise rejection');
  process.exit(1);
});
process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught exception');
  process.exit(1);
});

bootstrap().catch((err) => {
  logger.fatal({ err }, 'Failed to start server');
  process.exit(1);
});
