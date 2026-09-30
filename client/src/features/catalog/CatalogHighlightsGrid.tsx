import { useTranslations } from 'next-intl';
import type { LocaleCode } from '@/i18n/routing';
import CatalogGrid from './CatalogGrid';
import type { CardDesign, CatalogItemCard } from './types';

/** Server-rendered grid used by the `catalogHighlights` section (items hydrated by the API). */
const CatalogHighlightsGrid = ({
  items,
  design,
  locale,
}: {
  items: CatalogItemCard[];
  design?: CardDesign;
  locale: LocaleCode;
}) => {
  const t = useTranslations('catalog');
  if (!items.length) return null;
  const fallback: CardDesign = {
    variant: 'imageTop',
    imageRatio: '1:1',
    showSummary: true,
    cardSpecKeys: [],
    badgeSpecKey: '',
    priceSpecKey: '',
  };
  return (
    <CatalogGrid
      items={items}
      design={design ?? fallback}
      locale={locale}
      labels={{ yes: t('yes'), no: t('no') }}
      dense
    />
  );
};

export default CatalogHighlightsGrid;
