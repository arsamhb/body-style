import clsx from 'clsx';
import Image from 'next/image';
import Container from '@/shared/UI/Container';
import Cta from '@/shared/UI/Cta';
import HeroMachines from './HeroMachines';
import type { SectionComponentProps } from '../types';

const PATTERN_CLASS = {
  dots: 'bg-pattern-dots opacity-60',
  grid: 'bg-pattern-grid opacity-60',
  gradient:
    'bg-[radial-gradient(circle_at_70%_30%,color-mix(in_oklab,var(--color-accent)_20%,transparent),transparent_35%),linear-gradient(135deg,var(--color-canvas-subtle),var(--color-canvas))]',
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
        'relative isolate flex items-center overflow-hidden border-b border-line',
        'min-h-[min(82svh,52rem)] lg:min-h-[min(90svh,60rem)]',
        hasImage ? 'on-dark text-ink-inverse' : 'text-ink'
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
            className="object-cover object-center -z-20 scale-[1.02]"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(31,35,37,.96)_0%,rgba(31,35,37,.78)_43%,rgba(31,35,37,.22)_76%,rgba(31,35,37,.52)_100%)] rtl:bg-[linear-gradient(270deg,rgba(31,35,37,.96)_0%,rgba(31,35,37,.78)_43%,rgba(31,35,37,.22)_76%,rgba(31,35,37,.52)_100%)]" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-950/80 via-transparent to-gray-950/25" />
        </>
      ) : (
        <>
          <div aria-hidden className={clsx('absolute inset-0 -z-20', PATTERN_CLASS[pattern])} />
          <HeroMachines />
        </>
      )}
      <div
        aria-hidden
        className="absolute -end-10 top-[14%] z-0 h-3 w-56 -rotate-12 bg-brand shadow-[0_0_40px_color-mix(in_oklab,var(--color-brand)_45%,transparent)] lg:w-80"
      />
      <div
        aria-hidden
        className="absolute inset-y-[18%] start-0 w-px bg-gradient-to-b from-transparent via-accent/70 to-transparent"
      />
      <Container size="wide" className="section-py-lg">
        <div className="relative z-10 flex max-w-4xl flex-col gap-6 lg:max-w-[52%] lg:gap-8 xl:max-w-3xl">
          {eyebrow && (
            <span
              className={clsx(
                'inline-flex w-fit items-center gap-3 text-caption font-bold uppercase tracking-[0.24em] text-accent'
              )}
            >
              <span className="h-px w-9 bg-current" />
              {eyebrow}
            </span>
          )}
          <h1
            id={`${section.key}-title`}
            className={clsx(
              'text-display max-w-[13ch]',
              hasImage && 'text-ink-inverse drop-shadow-[0_4px_24px_rgb(0_0_0/.45)]'
            )}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={clsx(
                'max-w-2xl border-s-2 border-brand ps-5 text-lead',
                hasImage ? 'text-white/75' : 'text-ink-muted'
              )}
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
      <div className="absolute inset-x-0 bottom-0 z-20 flex h-8 items-center overflow-hidden border-t border-brand/30 bg-brand text-brand-ink">
        <div
          aria-hidden
          className="h-px w-full bg-[repeating-linear-gradient(90deg,currentColor_0,currentColor_44px,transparent_44px,transparent_58px)] opacity-50"
        />
      </div>
    </section>
  );
};

export default Hero;
