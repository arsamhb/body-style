import { RequestHandler } from 'express';
import * as Yup from 'yup';
import { ApiError, ApiErrorDetail } from '../errors/ApiError';

/**
 * Validates (and strips unknown keys from) a request part against a Yup schema.
 * On failure it throws ApiError.validation with details[{ field, code, message }] — `field`
 * matches Formik field names so the frontend renders inline errors (applyFormikValidationErrors.ts).
 *
 * Only `body` / `params` are supported: Express 5 makes `req.query` a getter, so query
 * parsing is done via core/pagination instead of reassignment here.
 */
export const validate =
  (schema: Yup.Schema, target: 'body' | 'params' = 'body'): RequestHandler =>
  async (req, _res, next) => {
    try {
      const validated = await schema.validate(req[target], {
        abortEarly: false,
        stripUnknown: true,
      });
      (req as unknown as Record<string, unknown>)[target] = validated;
      next();
    } catch (e) {
      if (e instanceof Yup.ValidationError) {
        const source = e.inner.length ? e.inner : [e];
        const details: ApiErrorDetail[] = source.map((err) => ({
          field: err.path ?? '',
          code: err.type ?? 'invalid',
          message: err.message,
        }));
        next(ApiError.validation(details));
        return;
      }
      next(e);
    }
  };
