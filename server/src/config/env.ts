import 'dotenv/config';
import * as Yup from 'yup';

/**
 * Environment schema. Validated once at boot — the process refuses to start with a
 * misconfigured environment rather than failing later at request time.
 */
const envSchema = Yup.object({
  NODE_ENV: Yup.string()
    .oneOf(['development', 'test', 'production'])
    .default('development'),
  PORT: Yup.number().default(4000),
  LOG_LEVEL: Yup.string()
    .oneOf(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('info'),
  /**
   * How many reverse proxies sit in front of the API (Express `trust proxy`). 1 = Docker/Caddy only.
   * Behind a CDN it is 2, but only once Caddy forwards the CDN's X-Forwarded-For (deploy/Caddyfile).
   */
  TRUST_PROXY_HOPS: Yup.number().integer().min(0).default(1),
  MONGODB_URI: Yup.string().required('MONGODB_URI is required'),
  /** Required in production (checked below); the default only serves local development. */
  CORS_ORIGIN: Yup.string().default('http://localhost:3000'),
  /** Swagger UI at /docs. Off in production unless switched on explicitly. */
  DOCS_ENABLED: Yup.boolean(),

  JWT_ACCESS_SECRET: Yup.string().required('JWT_ACCESS_SECRET is required'),
  JWT_REFRESH_SECRET: Yup.string().required('JWT_REFRESH_SECRET is required'),
  JWT_ACCESS_EXPIRES_IN: Yup.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: Yup.string().default('7d'),
  BCRYPT_SALT_ROUNDS: Yup.number().default(10),
  PASSWORD_MIN_LENGTH: Yup.number().min(8).default(10),

  /** Secrets for HMAC-signed form tokens and IP hashing. Fall back to the JWT secret in dev. */
  TICKET_TOKEN_SECRET: Yup.string().default(''),
  IP_HASH_SALT: Yup.string().default(''),

  /** Where the Next.js app listens (server-to-server) and the shared revalidation secret. */
  REVALIDATE_URL: Yup.string().default('http://localhost:3000'),
  REVALIDATE_SECRET: Yup.string().default(''),

  /** Local media storage. Relative paths resolve from the process cwd. */
  UPLOADS_DIR: Yup.string().default('uploads'),
  MAX_UPLOAD_MB: Yup.number().default(5),

  /** Content locales. Must match SUPPORTED_LOCALES in the client. */
  DEFAULT_LOCALE: Yup.string().default('fa'),

  /**
   * Accounts created by `npm run seed`. Development falls back to the well-known demo
   * credentials below; production has no fallback, so the seed refuses to invent accounts.
   */
  DEVELOPER_SEED_EMAIL: Yup.string().email().default(''),
  DEVELOPER_SEED_PASSWORD: Yup.string().default(''),
  ADMIN_SEED_EMAIL: Yup.string().email().default(''),
  ADMIN_SEED_PASSWORD: Yup.string().default(''),
});

const DEV_SEED = {
  developer: { email: 'developer@example.com', password: 'developer123' },
  admin: { email: 'admin@example.com', password: 'changeme123' },
} as const;

type Env = Yup.InferType<typeof envSchema>;

function loadEnv(): Env {
  try {
    return envSchema.validateSync(process.env, {
      abortEarly: false,
      stripUnknown: true,
    });
  } catch (e) {
    const err = e as Yup.ValidationError;
    console.error('❌ Invalid environment configuration:');
    err.errors.forEach((message) => console.error(`  - ${message}`));
    process.exit(1);
  }
}

const env = loadEnv();
const isProd = env.NODE_ENV === 'production';

if (isProd) {
  const origins = (process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map((o) => o.trim());
  if (!origins.some(Boolean) || origins.includes('*')) {
    console.error(
      '❌ CORS_ORIGIN must list the allowed web origins in production ("*" is not accepted)',
    );
    process.exit(1);
  }
}

if (isProd) {
  const weak = [
    ['JWT_ACCESS_SECRET', env.JWT_ACCESS_SECRET],
    ['JWT_REFRESH_SECRET', env.JWT_REFRESH_SECRET],
  ].filter(([, v]) => v.length < 32 || v.includes('change_me'));
  if (weak.length) {
    console.error(
      `❌ Weak secrets in production: ${weak.map(([k]) => k).join(', ')} (use 32+ random chars)`,
    );
    process.exit(1);
  }
}

/** Structured, typed view of the environment used across the app. */
export const config = {
  nodeEnv: env.NODE_ENV,
  isProd,
  port: env.PORT,
  logLevel: env.LOG_LEVEL,
  trustProxyHops: env.TRUST_PROXY_HOPS,
  docsEnabled: env.DOCS_ENABLED ?? !isProd,
  mongoUri: env.MONGODB_URI,
  corsOrigin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
  jwt: {
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },
  bcryptSaltRounds: env.BCRYPT_SALT_ROUNDS,
  passwordMinLength: env.PASSWORD_MIN_LENGTH,
  ticketTokenSecret:
    env.TICKET_TOKEN_SECRET || `${env.JWT_ACCESS_SECRET}:tickets`,
  ipHashSalt: env.IP_HASH_SALT || `${env.JWT_ACCESS_SECRET}:ip`,
  revalidate: {
    url: env.REVALIDATE_URL.replace(/\/$/, ''),
    secret: env.REVALIDATE_SECRET,
  },
  uploads: { dir: env.UPLOADS_DIR, maxBytes: env.MAX_UPLOAD_MB * 1024 * 1024 },
  defaultLocale: env.DEFAULT_LOCALE,
  seedDeveloper: {
    email: env.DEVELOPER_SEED_EMAIL || (isProd ? '' : DEV_SEED.developer.email),
    password:
      env.DEVELOPER_SEED_PASSWORD ||
      (isProd ? '' : DEV_SEED.developer.password),
  },
  seedAdmin: {
    email: env.ADMIN_SEED_EMAIL || (isProd ? '' : DEV_SEED.admin.email),
    password:
      env.ADMIN_SEED_PASSWORD || (isProd ? '' : DEV_SEED.admin.password),
  },
} as const;
