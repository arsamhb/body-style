import clsx from 'clsx';
import React from 'react';
import Container, { type ContainerSize } from '../Container';

export type SectionBackground = 'none' | 'subtle' | 'sunken' | 'dots' | 'grid';

export interface SectionShellProps {
  id: string;
  children: React.ReactNode;
  eyebrow?: string;
  heading?: string;
  text?: string;
  align?: 'start' | 'center';
  background?: SectionBackground;
  size?: 'sm' | 'md' | 'lg';
  container?: ContainerSize;
  headingLevel?: 'h1' | 'h2';
  className?: string;
  /** Extra node rendered next to the heading (e.g. a "view all" link). */
  aside?: React.ReactNode;
}

const BG_CLASS: Record<SectionBackground, string> = {
  none: '',
  subtle: 'bg-canvas-subtle',
  sunken: 'bg-surface-sunken',
  dots: 'bg-pattern-dots',
  grid: 'bg-pattern-grid',
};

const SIZE_CLASS = { sm: 'section-py-sm', md: 'section-py', lg: 'section-py-lg' } as const;

/**
 * Semantic wrapper every public section renders through: consistent vertical rhythm, optional
 * heading block, and theme-aware backgrounds. `id` doubles as the anchor and `aria-labelledby`.
 */
const SectionShell = ({
  id,
  children,
  eyebrow,
  heading,
  text,
  align = 'start',
  background = 'none',
  size = 'md',
  container = 'wide',
  headingLevel: Heading = 'h2',
  className,
  aside,
}: SectionShellProps) => {
  const headingId = heading ? `${id}-heading` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={clsx('relative', SIZE_CLASS[size], BG_CLASS[background], className)}
    >
      <Container size={container} className="flex flex-col gap-10 lg:gap-14">
        {(heading || text) && (
          <header
            className={clsx('flex flex-col gap-4', {
              'items-center text-center mx-auto max-w-3xl': align === 'center',
              'md:flex-row md:items-end md:justify-between': align === 'start' && aside,
            })}
          >
            <div className="flex flex-col gap-3 max-w-3xl">
              {eyebrow && (
                <span className="text-caption font-medium uppercase tracking-[0.18em] text-ink-subtle">
                  {eyebrow}
                </span>
              )}
              {heading && (
                <Heading id={headingId} className="text-h2">
                  {heading}
                </Heading>
              )}
              {text && <p className="text-lead text-ink-muted">{text}</p>}
            </div>
            {aside && <div className="shrink-0">{aside}</div>}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
};

export default SectionShell;
