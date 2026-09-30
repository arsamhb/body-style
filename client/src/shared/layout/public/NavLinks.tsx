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
        orientation === 'horizontal' ? 'items-center gap-1' : 'flex-col gap-1'
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
                'block rounded-md px-3 py-2 text-small font-medium transition-colors duration-fast',
                orientation === 'vertical' && 'px-4 py-3 text-body',
                active
                  ? 'bg-surface-raised text-ink'
                  : 'text-ink-muted hover:bg-surface-raised hover:text-ink'
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
