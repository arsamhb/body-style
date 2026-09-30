import clsx from 'clsx';
import type { LocaleCode } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import IconByName from '@/shared/UI/IconByName';
import SmartImage from '@/shared/UI/SmartImage';
import { formatSpecValue, type SpecLabels } from './formatSpec';
import type { CardDesign, CatalogItemCard, ImageRatio, PublicSpec } from './types';

export const RATIO_CLASS: Record<ImageRatio, string> = {
  '1:1': 'aspect-square',
  '4:3': 'aspect-[4/3]',
  '16:9': 'aspect-video',
  '3:4': 'aspect-[3/4]',
};

export interface CatalogCardProps {
  item: CatalogItemCard;
  design: CardDesign;
  locale: LocaleCode;
  labels: SpecLabels;
  /** Render without a link (builder preview). */
  preview?: boolean;
  sizes?: string;
}

const Badge = ({
  spec,
  locale,
  labels,
}: {
  spec: PublicSpec;
  locale: LocaleCode;
  labels: SpecLabels;
}) => {
  if (spec.type === 'boolean') {
    return (
      <span
        className={clsx(
          'inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-caption font-medium backdrop-blur',
          spec.value ? 'bg-success-soft text-success' : 'bg-surface/90 text-ink-muted'
        )}
      >
        <IconByName name={spec.value ? 'check' : 'x'} className="size-3" />
        {spec.label}
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-pill bg-surface/90 px-2 py-0.5 text-caption font-medium text-ink backdrop-blur">
      {formatSpecValue(spec, locale, labels)}
    </span>
  );
};

const Price = ({
  spec,
  locale,
  labels,
  className,
}: {
  spec: PublicSpec;
  locale: LocaleCode;
  labels: SpecLabels;
  className?: string;
}) => (
  <p className={clsx('text-body font-semibold tabular-nums', className)}>
    {formatSpecValue(spec, locale, labels)}
  </p>
);

const Specs = ({
  specs,
  locale,
  labels,
  className,
}: {
  specs: PublicSpec[];
  locale: LocaleCode;
  labels: SpecLabels;
  className?: string;
}) =>
  specs.length === 0 ? null : (
    <dl className={clsx('grid grid-cols-2 gap-x-3 gap-y-1 text-caption', className)}>
      {specs.map((s) => (
        <div key={s.key} className="flex flex-col">
          <dt className="text-ink-subtle">{s.label}</dt>
          <dd className="truncate font-medium text-ink">{formatSpecValue(s, locale, labels)}</dd>
        </div>
      ))}
    </dl>
  );

/**
 * The developer-designed product/service card. Hook-free so it renders in server components and
 * inside the type builder's live preview. `design` decides layout, ratio, badge, price and specs.
 */
const CatalogCard = ({
  item,
  design,
  locale,
  labels,
  preview,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
}: CatalogCardProps) => {
  const ratio = RATIO_CLASS[design.imageRatio] ?? RATIO_CLASS['4:3'];
  const Wrapper = preview ? 'div' : Link;
  const wrapperProps = preview ? {} : { href: item.href };
  const image = (
    <SmartImage
      src={item.coverImage}
      alt={item.title}
      className={clsx(ratio, 'w-full')}
      sizes={sizes}
      placeholderIcon="package"
      imgClassName="transition-transform duration-slow ease-out-expo group-hover:scale-105"
    />
  );

  if (design.variant === 'overlay') {
    return (
      <Wrapper
        {...(wrapperProps as { href: string })}
        className={clsx(
          'group relative block overflow-hidden rounded-lg border border-line',
          ratio,
          'w-full',
          !preview && 'card-hover'
        )}
      >
        {image}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/30 to-transparent" />
        {item.badge && (
          <div className="absolute start-3 top-3">
            <Badge spec={item.badge} locale={locale} labels={labels} />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 text-white">
          <h3 className="text-h4 text-white line-clamp-1">{item.title}</h3>
          {design.showSummary && item.summary && (
            <p className="text-caption text-white/75 line-clamp-2">{item.summary}</p>
          )}
          {item.price && (
            <Price spec={item.price} locale={locale} labels={labels} className="text-white" />
          )}
        </div>
      </Wrapper>
    );
  }

  if (design.variant === 'minimal') {
    return (
      <Wrapper
        {...(wrapperProps as { href: string })}
        className={clsx(
          'group flex h-full flex-col gap-3 rounded-lg border border-line bg-surface p-5',
          !preview && 'card-hover'
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-h4 line-clamp-2">{item.title}</h3>
          {item.badge && <Badge spec={item.badge} locale={locale} labels={labels} />}
        </div>
        {design.showSummary && item.summary && (
          <p className="text-small text-ink-muted line-clamp-3">{item.summary}</p>
        )}
        <Specs specs={item.cardSpecs} locale={locale} labels={labels} className="mt-auto" />
        {item.price && <Price spec={item.price} locale={locale} labels={labels} />}
      </Wrapper>
    );
  }

  const horizontal = design.variant === 'imageStart';
  return (
    <Wrapper
      {...(wrapperProps as { href: string })}
      className={clsx(
        'group flex h-full overflow-hidden rounded-lg border border-line bg-surface',
        horizontal ? 'flex-row' : 'flex-col',
        !preview && 'card-hover'
      )}
    >
      <div className={clsx('relative shrink-0', horizontal ? 'w-2/5' : 'w-full')}>
        {horizontal ? (
          <SmartImage
            src={item.coverImage}
            alt={item.title}
            className="h-full min-h-40 w-full"
            sizes={sizes}
            placeholderIcon="package"
            imgClassName="transition-transform duration-slow ease-out-expo group-hover:scale-105"
          />
        ) : (
          image
        )}
        {item.badge && (
          <div className="absolute start-3 top-3">
            <Badge spec={item.badge} locale={locale} labels={labels} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {item.categories.length > 0 && (
          <span className="text-caption text-ink-subtle">
            {item.categories.map((c) => c.name).join(' · ')}
          </span>
        )}
        <h3 className="text-h4 line-clamp-2">{item.title}</h3>
        {design.showSummary && item.summary && (
          <p className="text-small text-ink-muted line-clamp-2">{item.summary}</p>
        )}
        <Specs specs={item.cardSpecs} locale={locale} labels={labels} className="mt-1" />
        {item.price && (
          <Price spec={item.price} locale={locale} labels={labels} className="mt-auto pt-2" />
        )}
      </div>
    </Wrapper>
  );
};

export default CatalogCard;
