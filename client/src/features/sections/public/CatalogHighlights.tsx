import { useTranslations } from 'next-intl';
import CatalogHighlightsGrid from '@/features/catalog/CatalogHighlightsGrid';
import type { CardDesign, CatalogItemCard } from '@/features/catalog/types';
import Cta from '@/shared/UI/Cta';
import SectionShell from '@/shared/UI/SectionShell';
import type { SectionComponentProps } from '../types';

interface HydratedProps {
  items?: CatalogItemCard[];
  cardDesign?: CardDesign;
  typeHref?: string;
}

/** Items and the card design are hydrated server-side by `GET /public/pages/:key`. */
const CatalogHighlights = ({ section, locale }: SectionComponentProps<'catalogHighlights'>) => {
  const t = useTranslations('common');
  const { heading, text } = section.props;
  const { items = [], cardDesign, typeHref = '/catalog' } = section.props as HydratedProps;
  if (items.length === 0) return null;
  return (
    <SectionShell
      id={section.key}
      heading={heading}
      text={text}
      aside={
        <Cta href={typeHref} variant="ghost" icon="arrow-right">
          {t('viewAll')}
        </Cta>
      }
    >
      <CatalogHighlightsGrid items={items} design={cardDesign} locale={locale} />
    </SectionShell>
  );
};

export default CatalogHighlights;
