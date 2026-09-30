import Image from 'next/image';
import Container from '@/shared/UI/Container';
import type { SectionComponentProps } from '../types';

/** Full-width, half-viewport-height image with the title over a gradient. */
const AboutHero = ({ section }: SectionComponentProps<'aboutHero'>) => {
  const { image, title, subtitle } = section.props;
  return (
    <section
      id={section.key}
      aria-labelledby={`${section.key}-title`}
      className="relative isolate flex min-h-[50svh] items-end overflow-hidden bg-surface-sunken"
    >
      <Image src={image} alt="" fill priority sizes="100vw" className="object-cover -z-20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-950/85 via-gray-950/35 to-transparent" />
      <Container size="wide" className="py-12 lg:py-20">
        <div className="max-w-3xl flex flex-col gap-4 text-white">
          <h1 id={`${section.key}-title`} className="text-h1 text-white">
            {title}
          </h1>
          {subtitle && <p className="text-lead text-white/80">{subtitle}</p>}
        </div>
      </Container>
    </section>
  );
};

export default AboutHero;
