'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import IconByName from '@/shared/UI/IconByName';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'md' | 'lg';
}

/** Side panel for create/edit forms. Slides in from the end edge (RTL-aware). */
const Drawer = ({ open, onClose, title, children, footer, size = 'md' }: DrawerProps) => {
  const t = useTranslations('admin.common');
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div
      className={clsx('fixed inset-0 z-50', open ? 'pointer-events-auto' : 'pointer-events-none')}
      aria-hidden={!open}
    >
      <div
        className={clsx(
          'absolute inset-0 bg-gray-950/50 transition-opacity duration-base',
          open ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={clsx(
          'absolute inset-y-0 end-0 flex w-full flex-col bg-canvas shadow-lg transition-transform duration-base ease-out-expo',
          size === 'md' ? 'sm:max-w-lg' : 'sm:max-w-3xl',
          open ? 'translate-x-0' : 'ltr:translate-x-full rtl:-translate-x-full'
        )}
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-h4">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('close')}
            className="btn btn-ghost btn-square btn-sm"
          >
            <IconByName name="x" className="size-5" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-5">{open && children}</div>
        {footer && (
          <footer className="flex items-center justify-end gap-2 border-t border-line px-5 py-4">
            {footer}
          </footer>
        )}
      </section>
    </div>
  );
};

export default Drawer;
