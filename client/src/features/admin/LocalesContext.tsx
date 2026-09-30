'use client';

import { createContext, useContext, useMemo } from 'react';
import { useGetAdminSettings } from '@/app/_service/settings/hook.query';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type LocaleCode } from '@/i18n/routing';

interface LocalesContextValue {
  /** Locales content editors see tabs for (enabled in settings). */
  locales: LocaleCode[];
  defaultLocale: LocaleCode;
}

const LocalesContext = createContext<LocalesContextValue>({
  locales: [...SUPPORTED_LOCALES],
  defaultLocale: DEFAULT_LOCALE,
});

/** Feeds every LocalizedTextInput with the enabled locales. Falls back to all supported ones. */
export const LocalesProvider = ({ children }: { children: React.ReactNode }) => {
  const { data } = useGetAdminSettings();
  const value = useMemo<LocalesContextValue>(() => {
    const defaultLocale = data?.defaultLocale ?? DEFAULT_LOCALE;
    const enabled = data?.enabledLocales?.length ? data.enabledLocales : [...SUPPORTED_LOCALES];
    const locales = [defaultLocale, ...enabled.filter((l) => l !== defaultLocale)];
    return { locales, defaultLocale };
  }, [data]);
  return <LocalesContext.Provider value={value}>{children}</LocalesContext.Provider>;
};

export const useLocales = () => useContext(LocalesContext);
