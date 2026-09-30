'use client';

import { useTranslations } from 'next-intl';
import IconByName from '@/shared/UI/IconByName';
import useTheme from '@/shared/hooks/useTheme';

const ThemeToggle = ({ className }: { className?: string }) => {
  const t = useTranslations('theme');
  const { isDark, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t('toggle')}
      title={t('toggle')}
      className={`inline-flex size-10 items-center justify-center rounded-md border border-line bg-surface text-ink-muted icon-hover ${className ?? ''}`}
    >
      <IconByName name={isDark ? 'sun' : 'moon'} className="size-4" />
    </button>
  );
};

export default ThemeToggle;
