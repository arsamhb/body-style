'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useId, useState } from 'react';
import IconByName from '@/shared/UI/IconByName';
import Cta from '@/shared/UI/Cta';
import type { PublicNavItem } from '@/features/site/types';
import NavLinks from './NavLinks';

interface MobileNavProps {
  items: PublicNavItem[];
  ctaLabel: string;
}

const MobileNav = ({ items, ctaLabel }: MobileNavProps) => {
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? t('closeMenu') : t('openMenu')}
        className="inline-flex size-10 items-center justify-center rounded-xs border border-line-strong bg-surface text-ink transition-colors hover:border-brand hover:text-brand-strong"
      >
        <IconByName name={open ? 'x' : 'menu'} className="size-5" />
      </button>
      {open && (
        <div
          id={panelId}
          className="fixed inset-x-0 top-[var(--header-h)] bottom-0 z-40 flex flex-col gap-6 overflow-y-auto border-t border-line bg-canvas/98 p-5 backdrop-blur-xl animate-in"
        >
          <NavLinks items={items} orientation="vertical" onNavigate={() => setOpen(false)} />
          <div className="mt-auto flex flex-col gap-3 border-t border-line pt-4">
            <Cta href="/contact" icon="arrow-right">
              {ctaLabel}
            </Cta>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
