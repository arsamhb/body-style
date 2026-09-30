import { useTranslations } from 'next-intl';
import Container from '@/shared/UI/Container';
import IconByName from '@/shared/UI/IconByName';
import type { SectionComponentProps } from '../types';

const ALLOWED_EMBED_PREFIX = 'https://www.google.com/maps/embed';

const MapSection = ({ section }: SectionComponentProps<'map'>) => {
  const t = useTranslations('sections');
  const { embedUrl, address } = section.props;
  const safeUrl = embedUrl && embedUrl.startsWith(ALLOWED_EMBED_PREFIX) ? embedUrl : undefined;
  return (
    <section id={section.key} className="section-py-sm">
      <Container size="wide">
        <div className="relative overflow-hidden rounded-xl border border-line bg-surface-raised aspect-[16/9] md:aspect-[21/9]">
          {safeUrl ? (
            <iframe
              src={safeUrl}
              title={address}
              className="absolute inset-0 h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              sandbox="allow-scripts allow-same-origin allow-popups"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-pattern-grid text-ink-subtle">
              <IconByName name="map-pin" className="size-10" strokeWidth={1.25} />
              <span className="text-small">{t('mapPlaceholder')}</span>
            </div>
          )}
          {address && (
            <address className="absolute bottom-4 start-4 max-w-sm rounded-md border border-line bg-surface/90 px-4 py-3 text-small not-italic shadow-md backdrop-blur">
              {address}
            </address>
          )}
        </div>
      </Container>
    </section>
  );
};

export default MapSection;
