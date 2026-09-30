import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { resolveLocale, type LocaleParams } from '@/lib/i18n/params';
import { getCatalogTypes } from '@/features/catalog/getPublicCatalog';
import Container from '@/shared/UI/Container';
import Cta from '@/shared/UI/Cta';
import IconByName from '@/shared/UI/IconByName';

type Props = { params: LocaleParams };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'nav' });
  return { title: t('catalog') };
}

/** Index of catalog types. With a single type it goes straight to its listing. */
export default async function CatalogIndexPage({ params }: Props) {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  const types = await getCatalogTypes(locale);
  if (types.length === 1) redirect({ href: types[0].href, locale });
  const t = await getTranslations('catalog');

  return (
    <Container size="wide" className="section-py flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-h1">{t('indexTitle')}</h1>
      </header>
      {types.length === 0 ? (
        <p className="text-lead text-ink-muted">{t('noTypes')}</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {types.map((type) => (
            <li
              key={type.id}
              className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-6 card-hover"
            >
              <span className="icon-tile">
                <IconByName name="package" className="size-5" />
              </span>
              <div className="flex flex-col gap-1">
                <h2 className="text-h3">{type.name}</h2>
                <p className="text-small text-ink-muted">{type.description}</p>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-caption text-ink-subtle">
                  {t('results', { count: type.itemCount })}
                </span>
                <Cta href={type.href} variant="secondary" size="sm" icon="arrow-right">
                  {t('browse')}
                </Cta>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
