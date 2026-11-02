import Container from '@/shared/UI/Container';
import Cta from '@/shared/UI/Cta';
import type { SectionComponentProps } from '../types';

const CtaBanner = ({ section }: SectionComponentProps<'ctaBanner'>) => {
  const { heading, text, cta } = section.props;
  return (
    <section id={section.key} aria-labelledby={`${section.key}-heading`} className="section-py-sm">
      <Container size="wide">
        <div className="relative isolate overflow-hidden border border-brand/40 on-dark bg-gradient-ink px-6 py-12 text-white shadow-[10px_10px_0_rgb(252_152_36/.35)] md:px-16 md:py-20">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-pattern-grid opacity-[0.18] mask-fade-edges"
          />
          <div className="absolute -end-16 -top-10 -z-10 size-52 rotate-12 border-[24px] border-brand/10" />
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-7 text-center">
            <span className="inline-flex items-center gap-2 text-caption font-bold uppercase tracking-[0.22em] text-accent">
              <span className="h-px w-8 bg-accent" />
              Body Style
              <span className="h-px w-8 bg-accent" />
            </span>
            <h2 id={`${section.key}-heading`} className="text-h1 text-white">
              {heading}
            </h2>
            <p className="text-lead text-white/75">{text}</p>
            {cta?.href && (
              <Cta href={cta.href} size="lg" icon="arrow-right">
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
