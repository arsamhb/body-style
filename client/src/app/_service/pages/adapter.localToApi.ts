import { cleanLocalized } from '../settings/adapter.localToApi';
import type { PageSeoFormSchema, SectionPropsFormSchema } from './interface.form';
import type {
  AdminPagesSectionsUpdatePayload,
  AdminPagesSeoUpdatePayload,
} from './interface.payload';

export const pageSeoFormSchema2AdminPagesSeoUpdatePayload = (
  form: PageSeoFormSchema
): AdminPagesSeoUpdatePayload => ({
  title: cleanLocalized(form.title),
  description: cleanLocalized(form.description),
  ogImageUrl: form.ogImageUrl,
});

/** Props are sent as-is; the API validates them against the section type and drops empty locales. */
export const sectionPropsFormSchema2AdminPagesSectionsUpdatePayload = (
  form: SectionPropsFormSchema
): AdminPagesSectionsUpdatePayload => ({ props: form });
