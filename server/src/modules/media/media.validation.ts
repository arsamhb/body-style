import * as Yup from 'yup';
import { localizedString } from '../../core/i18n/validation';

/** multipart text field `alt` arrives as JSON; parsed in the controller before validation. */
export const mediaAltValidationSchema = Yup.object({
  alt: localizedString({ max: 200, optional: true }),
}).noUnknown(true, 'Unknown fields are not allowed');
