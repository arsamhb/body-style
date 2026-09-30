import Container from '@/shared/UI/Container';
import Cta from '@/shared/UI/Cta';
import type { SectionComponentProps } from '../types';

const CtaBanner = ({ section }: SectionComponentProps<'ctaBanner'>) => {
  const { heading, text, cta } = section.props;
  return (
    <section id={section.key} aria-labelledby={`${section.key}-heading`} className="section-py-sm">
      <Container size="wide">
        <div className="relative isolate overflow-hidden rounded-2xl bg-gradient-ink px-6 py-12 text-center text-white md:px-16 md:py-20">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-pattern-grid opacity-[0.12] mask-fade-edges"
          />
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
            <h2 id={`${section.key}-heading`} className="text-h2 text-white">
              {heading}
            </h2>
            <p className="text-lead text-white/75">{text}</p>
            {cta?.href && (
              <Cta
                href={cta.href}
                size="lg"
                icon="arrow-right"
                className="bg-white text-gray-950 hover:bg-gray-200"
              >
                {cta.label}
              </Cta>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CtaBanner;
