'use client';

import clsx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import type { LocaleCode } from '@/i18n/routing';
import { LOCALE_META } from '@/lib/i18n/locales';

interface LocaleSwitcherProps {
  locales: LocaleCode[];
  className?: string;
}

/** Segmented control listing the enabled locales. Hidden when only one is enabled. */
const LocaleSwitcher = ({ locales, className }: LocaleSwitcherProps) => {
  const t = useTranslations('locale');
  const current = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  if (locales.length < 2) return null;

  const switchTo = (locale: LocaleCode) => {
    startTransition(() => {
      // `usePathname` from i18n/navigation returns the concrete path without the locale prefix.
      router.replace(pathname, { locale });
    });
  };

  return (
    <div
      role="group"
      aria-label={t('switch')}
      className={clsx(
        'inline-flex h-10 items-center rounded-md border border-line bg-surface p-1',
        pending && 'opacity-60',
        className
      )}
    >
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          dir={LOCALE_META[code].dir}
          onClick={() => switchTo(code)}
          aria-pressed={code === current}
          className={clsx(
            'h-full rounded-sm px-2.5 text-caption font-medium transition-colors duration-fast',
            code === current ? 'bg-brand text-brand-ink' : 'text-ink-muted hover:text-ink'
          )}
        >
          {LOCALE_META[code].nativeLabel}
        </button>
      ))}
    </div>
  );
};

export default LocaleSwitcher;
