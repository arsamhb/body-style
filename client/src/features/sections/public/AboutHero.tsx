import Image from 'next/image';
import Container from '@/shared/UI/Container';
import PageHero from './PageHero';
import type { SectionComponentProps } from '../types';

/**
 * Top of the about page. Without a photo it shows the animated machine hero used on the landing
 * page; with one it falls back to a full-width image with the title over a gradient.
 */
const AboutHero = ({ section }: SectionComponentProps<'aboutHero'>) => {
  const { image, title, subtitle } = section.props;
  if (!image) return <PageHero id={section.key} title={title} subtitle={subtitle} />;
  return (
    <section
      id={section.key}
      aria-labelledby={`${section.key}-title`}
      className="relative isolate flex min-h-[62svh] items-end overflow-hidden border-b border-line bg-surface-sunken"
    >
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover -z-20 saturate-[.8] contrast-110"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-950 via-gray-950/45 to-gray-950/10" />
      <div className="absolute -end-12 top-20 h-3 w-64 -rotate-12 bg-brand" />
      <Container size="wide" className="py-12 lg:py-20">
        <div className="on-dark max-w-3xl flex flex-col gap-4 text-white">
          <span className="inline-flex items-center gap-2 text-caption font-bold uppercase tracking-[0.2em] text-accent">
            <span className="h-px w-8 bg-accent" />
            Body Style
          </span>
          <h1 id={`${section.key}-title`} className="text-display text-white">
            {title}
          </h1>
          {subtitle && <p className="text-lead text-white/80">{subtitle}</p>}
        </div>
      </Container>
    </section>
  );
};

export default AboutHero;
