import clsx from 'clsx';
import type { LocaleCode } from '@/i18n/routing';
import CatalogCard from './CatalogCard';
import type { SpecLabels } from './formatSpec';
import type { CardDesign, CatalogItemCard } from './types';

interface CatalogGridProps {
  items: CatalogItemCard[];
  design: CardDesign;
  locale: LocaleCode;
  labels: SpecLabels;
  dense?: boolean;
}

const CatalogGrid = ({ items, design, locale, labels, dense }: CatalogGridProps) => (
  <ul
    className={clsx(
      'grid gap-4',
      design.variant === 'imageStart'
        ? 'md:grid-cols-2 3xl:grid-cols-3'
        : dense
          ? 'sm:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-6'
          : 'sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 4xl:grid-cols-5'
    )}
    role="list"
  >
    {items.map((item) => (
      <li key={item.id}>
        <CatalogCard item={item} design={design} locale={locale} labels={labels} />
      </li>
    ))}
  </ul>
);

export default CatalogGrid;
