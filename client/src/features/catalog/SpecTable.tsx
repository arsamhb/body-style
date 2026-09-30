import { useTranslations } from 'next-intl';
import type { LocaleCode } from '@/i18n/routing';
import IconByName from '@/shared/UI/IconByName';
import { formatSpecValue } from './formatSpec';
import type { PublicSpec } from './types';

const SpecTable = ({ specs, locale }: { specs: PublicSpec[]; locale: LocaleCode }) => {
  const t = useTranslations('catalog');
  if (specs.length === 0) return null;
  const labels = { yes: t('yes'), no: t('no') };
  return (
    <section aria-labelledby="specs-heading" className="flex flex-col gap-3">
      <h2 id="specs-heading" className="text-h4">
        {t('specs')}
      </h2>
      <dl className="divide-y divide-line rounded-lg border border-line bg-surface">
        {specs.map((s) => (
          <div
            key={s.key}
            className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-4 px-4 py-3 text-small"
          >
            <dt className="text-ink-muted">{s.label}</dt>
            <dd className="font-medium">
              {s.type === 'url' ? (
                <a
                  href={String(s.value)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 link-underline"
                  dir="ltr"
                >
                  {formatSpecValue(s, locale, labels)}
                  <IconByName name="external-link" className="size-3.5" />
                </a>
              ) : s.type === 'boolean' ? (
                <span className={s.value ? 'text-success' : 'text-ink-muted'}>
                  {formatSpecValue(s, locale, labels)}
                </span>
              ) : (
                formatSpecValue(s, locale, labels)
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default SpecTable;
