/**
 * OpenAPI 3 document. Served at /docs (Swagger UI) and /docs/openapi.json.
 * Hand-written: each module documents itself in `docs/paths/<module>.ts` (tags, schemas, paths)
 * and is merged here. Keep those files in sync with routes, Yup validation and response DTOs.
 */
import { commonResponses, commonSchemas } from './common';
import { authDocs } from './paths/auth';
import { catalogDocs } from './paths/catalog';
import { mediaDocs } from './paths/media';
import { pagesDocs } from './paths/pages';
import { settingsDocs } from './paths/settings';
import { ticketsDocs } from './paths/tickets';
import { usersDocs } from './paths/users';

interface ModuleDocs {
  tags: { name: string; description: string }[];
  schemas: Record<string, unknown>;
  paths: Record<string, unknown>;
}

const modules: ModuleDocs[] = [
  authDocs,
  usersDocs,
  settingsDocs,
  pagesDocs,
  catalogDocs,
  mediaDocs,
  ticketsDocs,
];

export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Promotional Website API',
    version: '0.2.0',
    description:
      'Express + MongoDB API behind the promotional-website boilerplate. ' +
      'Errors use `{ error: { code, message, details? } }`. Back-office routes use JWT Bearer access tokens; ' +
      '`/public/*` routes are unauthenticated and locale-resolved.',
  },
  servers: [{ url: '/', description: 'This server' }],
  tags: modules.flatMap((m) => m.tags),
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Access token from POST /auth/login or /auth/refresh',
      },
    },
    schemas: Object.assign({}, commonSchemas, ...modules.map((m) => m.schemas)),
    responses: commonResponses,
  },
  paths: Object.assign({}, ...modules.map((m) => m.paths)),
};
