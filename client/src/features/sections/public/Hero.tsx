import clsx from 'clsx';
import Image from 'next/image';
import Container from '@/shared/UI/Container';
import Cta from '@/shared/UI/Cta';
import type { SectionComponentProps } from '../types';

const PATTERN_CLASS = {
  dots: 'bg-pattern-dots mask-fade-edges',
  grid: 'bg-pattern-grid mask-fade-edges',
  gradient: 'bg-gradient-subtle',
  none: '',
} as const;

const Hero = ({ section }: SectionComponentProps<'hero'>) => {
  const { eyebrow, title, subtitle, primaryCta, secondaryCta, backgroundImage, pattern } =
    section.props;
  const hasImage = Boolean(backgroundImage);
  return (
    <section
      id={section.key}
      aria-labelledby={`${section.key}-title`}
      className={clsx(
        'relative isolate overflow-hidden flex items-center',
        'min-h-[min(70svh,44rem)] lg:min-h-[min(80svh,52rem)]',
        hasImage ? 'text-ink-inverse' : 'text-ink'
      )}
    >
      {hasImage ? (
        <>
          <Image
            src={backgroundImage as string}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover -z-20"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-950/85 via-gray-950/50 to-gray-950/20" />
        </>
      ) : (
        <div aria-hidden className={clsx('absolute inset-0 -z-10', PATTERN_CLASS[pattern])} />
      )}
      <Container size="wide" className="section-py-lg">
        <div className="max-w-4xl flex flex-col gap-6 lg:gap-8">
          {eyebrow && (
            <span
              className={clsx(
                'inline-flex w-fit items-center gap-2 rounded-pill border px-3 py-1 text-caption font-medium tracking-wide',
                hasImage ? 'border-white/30 bg-white/10 backdrop-blur' : 'border-line bg-surface'
              )}
            >
              <span className="size-1.5 rounded-full bg-current" />
              {eyebrow}
            </span>
          )}
          <h1
            id={`${section.key}-title`}
            className={clsx('text-display', hasImage && 'text-ink-inverse')}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={clsx('text-lead max-w-2xl', hasImage ? 'text-white/80' : 'text-ink-muted')}
            >
              {subtitle}
            </p>
          )}
          {(primaryCta?.href || secondaryCta?.href) && (
            <div className="flex flex-wrap gap-3 pt-2">
              {primaryCta?.href && (
                <Cta href={primaryCta.href} size="lg" icon="arrow-right">
                  {primaryCta.label}
                </Cta>
              )}
              {secondaryCta?.href && (
                <Cta href={secondaryCta.href} size="lg" variant={hasImage ? 'ghost' : 'secondary'}>
                  {secondaryCta.label}
                </Cta>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default Hero;
