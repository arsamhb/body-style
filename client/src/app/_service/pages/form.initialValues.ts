import type { PageSeoFormSchema } from './interface.form';
import type { PageSchema } from './interface.schema';

export const getPageSeoFormInitialValue = (page?: PageSchema): PageSeoFormSchema => ({
  title: page?.seo.title ?? {},
  description: page?.seo.description ?? {},
  ogImageUrl: page?.seo.ogImageUrl ?? '',
});
