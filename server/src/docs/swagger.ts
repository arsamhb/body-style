import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { openApiDocument } from './openapi';

/** Mounts Swagger UI at /docs and the raw OpenAPI JSON at /docs/openapi.json. */
export const mountSwagger = (app: Express): void => {
  app.get('/docs/openapi.json', (_req, res) => {
    res.json(openApiDocument);
  });

  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(openApiDocument, {
      customSiteTitle: 'MERN Boilerplate API',
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
      },
    }),
  );
};
