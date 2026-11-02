'use client';

import clsx from 'clsx';
import { Link, usePathname } from '@/i18n/navigation';
import type { PublicNavItem } from '@/features/site/types';

interface NavLinksProps {
  items: PublicNavItem[];
  orientation?: 'horizontal' | 'vertical';
  onNavigate?: () => void;
}

const isActive = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

const NavLinks = ({ items, orientation = 'horizontal', onNavigate }: NavLinksProps) => {
  const pathname = usePathname();
  return (
    <ul
      className={clsx(
        'flex',
        orientation === 'horizontal' ? 'items-center gap-3' : 'flex-col gap-1'
      )}
      role="list"
    >
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.id}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={clsx(
                'relative block px-3 py-2 text-caption font-bold uppercase tracking-[0.12em] transition-colors duration-fast',
                'after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-center after:bg-brand after:transition-transform after:duration-base after:ease-out-expo',
                orientation === 'vertical' &&
                  'border-b border-line px-2 py-4 text-body after:hidden',
                active
                  ? 'text-brand-strong after:scale-x-100'
                  : 'text-ink-muted after:scale-x-0 hover:text-ink hover:after:scale-x-100'
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavLinks;
