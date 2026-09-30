import pino from 'pino';
import { pinoHttp } from 'pino-http';
import { config } from '../config/env';

/**
 * `pino-pretty` is a devDependency, so it is only there outside the production image. Without it
 * (or in production) logs are one JSON object per line on stdout, which is what `docker logs` wants.
 */
const prettyTransport = (): pino.TransportSingleOptions | undefined => {
  if (config.isProd) return undefined;
  try {
    require.resolve('pino-pretty');
    return {
      target: 'pino-pretty',
      options: { translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
    };
  } catch {
    return undefined;
  }
};

/** Process-wide logger. Always on, in every environment. */
export const logger = pino({
  level: config.logLevel,
  transport: prettyTransport(),
});

/**
 * One line per request: id, method, url, status, duration. Headers are left out on purpose, so
 * bearer tokens never reach the logs. Health probes are skipped: compose calls them every few seconds.
 */
export const httpLogger = pinoHttp({
  logger,
  autoLogging: { ignore: (req) => req.url?.startsWith('/health') ?? false },
  serializers: {
    req: (req) => ({ id: req.id, method: req.method, url: req.url }),
    res: (res) => ({ statusCode: res.statusCode }),
  },
});
