import * as Yup from 'yup';
import { localizedString } from '../settings/validation';

export const pageSeoValidationSchema = Yup.object({
  title: localizedString({ max: 120 }),
  description: localizedString({ max: 300 }),
  ogImageUrl: Yup.string(),
});
