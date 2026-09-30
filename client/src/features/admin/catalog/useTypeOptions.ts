'use client';

import { useGetAdminCatalogTypesList } from '@/app/_service/catalog/hook.query';
import type { CatalogTypeSchema } from '@/app/_service/catalog/interface.schema';
import { useLocales } from '../LocalesContext';

/** Types as `{ value, label }` for selects, labelled in the default locale. */
export const useTypeOptions = () => {
  const { data: types, isLoading } = useGetAdminCatalogTypesList();
  const { defaultLocale } = useLocales();
  const label = (t: CatalogTypeSchema) => t.name[defaultLocale] || t.slug;
  return {
    types: types ?? [],
    isLoading,
    options: (types ?? []).map((t) => ({ value: t.id, label: label(t) })),
    label,
  };
};
