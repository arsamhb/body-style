import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'node:path';
import { config } from './config/env';
import routes from './routes';
import { mountSwagger } from './docs/swagger';
import { notFound } from './core/middleware/notFound';
import { errorHandler } from './core/middleware/errorHandler';
import { httpLogger } from './core/logger';

/** Builds the Express app. Kept separate from `server.ts` so it can be imported in tests. */
export const createApp = (): Express => {
  const app = express();

  // Behind a reverse proxy (Docker, Caddy) the client IP comes from X-Forwarded-For; needed for
  // rate limiting and IP hashing to see the real address instead of the proxy's.
  app.set('trust proxy', config.trustProxyHops);
  app.disable('x-powered-by');

  app.use(
    helmet({
      // Relax CSP enough for Swagger UI (inline scripts/styles) while keeping other defaults.
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'script-src': ["'self'", "'unsafe-inline'"],
          'style-src': ["'self'", "'unsafe-inline'"],
          'img-src': ["'self'", 'data:', 'validator.swagger.io'],
        },
      },
      // Uploaded images are embedded by the web app (a different origin in dev).
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(cors({ origin: config.corsOrigin, credentials: false }));
  app.use(express.json({ limit: '1mb' }));
  app.use(compression());
  app.use(httpLogger);

  // Uploaded media. `root` + no fallthrough = no path traversal, no directory listing, no dotfiles.
  app.use(
    '/uploads',
    express.static(path.resolve(config.uploads.dir), {
      dotfiles: 'deny',
      index: false,
      fallthrough: false,
      maxAge: '30d',
      immutable: true,
    }),
  );

  if (config.docsEnabled) mountSwagger(app);
  app.use(routes);

  // 404 + error envelope must be last.
  app.use(notFound);
  app.use(errorHandler);

  return app;
};
