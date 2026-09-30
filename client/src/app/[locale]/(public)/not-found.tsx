import { useTranslations } from 'next-intl';
import Container from '@/shared/UI/Container';
import Cta from '@/shared/UI/Cta';

export default function NotFound() {
  const t = useTranslations('common');
  return (
    <Container
      size="content"
      className="section-py-lg flex flex-col items-center gap-4 text-center"
    >
      <span className="text-display text-ink-subtle">404</span>
      <h1 className="text-h2">{t('notFoundTitle')}</h1>
      <p className="text-lead text-ink-muted max-w-md">{t('notFoundText')}</p>
      <Cta href="/" variant="secondary" icon="arrow-right" className="mt-4">
        {t('goHome')}
      </Cta>
    </Container>
  );
}
