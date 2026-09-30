import type { PageKey, PublicNavItem } from './types';

/** Maps an internal href to the page it lives on, so links to disabled pages can be hidden. */
export const pageKeyForHref = (href: string): PageKey | null => {
  const path = href.split(/[?#]/)[0];
  if (path === '/' || path === '') return 'landing';
  if (path === '/about' || path.startsWith('/about/')) return 'about';
  if (path === '/contact' || path.startsWith('/contact/')) return 'contact';
  if (path === '/catalog' || path.startsWith('/catalog/')) return 'catalog';
  return null;
};

export const filterNavByEnabledPages = (
  items: PublicNavItem[],
  enabledPages: PageKey[]
): PublicNavItem[] =>
  items.filter((item) => {
    const key = pageKeyForHref(item.href);
    return key === null || enabledPages.includes(key);
  });
