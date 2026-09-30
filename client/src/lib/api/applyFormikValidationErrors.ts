import { FormikHelpers } from 'formik';
import { isApiError } from './errors';

/**
 * Maps 422 VALIDATION_ERROR details onto Formik field errors.
 * Returns true when at least one field error was applied.
 */
export function applyApiValidationErrorsToFormik<T extends object>(
  setFieldError: FormikHelpers<T>['setFieldError'],
  err: unknown
): boolean {
  if (!isApiError(err) || err.code !== 'VALIDATION_ERROR' || !err.details?.length) {
    return false;
  }

  let applied = false;
  for (const detail of err.details) {
    if (detail.field) {
      setFieldError(detail.field, detail.message);
      applied = true;
    }
  }

  return applied;
}
