import clsx from 'clsx';
import type { ReactNode } from 'react';
import Container from '@/shared/UI/Container';
import HeroMachines from './HeroMachines';

interface PageHeroProps {
  /** Section key: becomes the anchor and the base of the heading id. */
  id: string;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  /** Buttons or other actions rendered under the text. */
  children?: ReactNode;
  className?: string;
}

/**
 * Image-free page hero for the about and contact pages. It mirrors the landing hero (dotted
 * ground, animated gym machines, brand slash, tape bar) and adds a staggered text entrance, a
 * sweeping underline rule and a moving tape. All motion is CSS and honours reduced motion.
 */
const PageHero = ({
  id,
  title,
  subtitle,
  eyebrow = 'Body Style',
  children,
  className,
}: PageHeroProps) => (
  <section
    id={id}
    aria-labelledby={`${id}-title`}
    className={clsx(
      'page-hero relative isolate flex min-h-[min(72svh,44rem)] items-center overflow-hidden border-b border-line text-ink',
      className
    )}
  >
    <div aria-hidden className="absolute inset-0 -z-20 bg-pattern-dots opacity-60" />
    <div
      aria-hidden
      className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_75%_35%,color-mix(in_oklab,var(--color-accent)_16%,transparent),transparent_40%)]"
    />
    <HeroMachines />
    <div
      aria-hidden
      className="page-hero__slash absolute -end-10 top-[14%] z-0 h-3 w-56 -rotate-12 bg-brand shadow-[0_0_40px_color-mix(in_oklab,var(--color-brand)_45%,transparent)] lg:w-80"
    />
    <div
      aria-hidden
      className="absolute inset-y-[18%] start-0 w-px bg-gradient-to-b from-transparent via-accent/70 to-transparent"
    />
    <Container size="wide" className="section-py-lg">
      <div className="relative z-10 flex max-w-4xl flex-col gap-6 lg:max-w-[52%] lg:gap-8 xl:max-w-3xl">
        <span
          className="hero-rise inline-flex w-fit items-center gap-3 text-caption font-bold uppercase tracking-[0.24em] text-accent"
          style={{ '--hero-delay': '0.05s' } as React.CSSProperties}
        >
          <span className="hero-rule-x h-px w-9 bg-current" />
          {eyebrow}
        </span>
        <h1
          id={`${id}-title`}
          className="hero-rise text-display max-w-[14ch]"
          style={{ '--hero-delay': '0.18s' } as React.CSSProperties}
        >
          {title}
        </h1>
        <span
          aria-hidden
          className="hero-rise page-hero__rule block h-1 w-28 bg-gradient-to-r from-brand via-accent to-transparent rtl:bg-gradient-to-l"
          style={{ '--hero-delay': '0.3s' } as React.CSSProperties}
        />
        {subtitle && (
          <p
            className="hero-rise max-w-2xl border-s-2 border-brand ps-5 text-lead text-ink-muted"
            style={{ '--hero-delay': '0.42s' } as React.CSSProperties}
          >
            {subtitle}
          </p>
        )}
        {children && (
          <div
            className="hero-rise flex flex-wrap gap-3 pt-2"
            style={{ '--hero-delay': '0.58s' } as React.CSSProperties}
          >
            {children}
          </div>
        )}
      </div>
    </Container>
    <div className="absolute inset-x-0 bottom-0 z-20 flex h-8 items-center overflow-hidden border-t border-brand/30 bg-brand text-brand-ink">
      <div
        aria-hidden
        className="hero-tape h-px w-full bg-[repeating-linear-gradient(90deg,currentColor_0,currentColor_44px,transparent_44px,transparent_58px)] opacity-50"
      />
    </div>
  </section>
);

export default PageHero;
