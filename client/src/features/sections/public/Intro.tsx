import clsx from 'clsx';
import Cta from '@/shared/UI/Cta';
import Paragraphs from '@/shared/UI/Paragraphs';
import SectionShell from '@/shared/UI/SectionShell';
import SmartImage from '@/shared/UI/SmartImage';
import type { SectionComponentProps } from '../types';

const Intro = ({ section }: SectionComponentProps<'intro'>) => {
  const { heading, body, image, imagePosition, cta } = section.props;
  if (!image) {
    return (
      <SectionShell id={section.key} container="wide">
        <div className="grid items-start gap-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
          <div className="flex flex-col gap-6 lg:sticky lg:top-28">
            <span className="inline-flex items-center gap-2 text-caption font-bold uppercase tracking-[0.2em] text-accent">
              <span className="h-px w-7 bg-accent" />
              Body Style
            </span>
            <h2 className="text-h1 max-w-[16ch]">{heading}</h2>
            <span
              aria-hidden
              className="block h-1 w-20 bg-gradient-to-r from-brand to-accent rtl:bg-gradient-to-l"
            />
          </div>
          <div className="flex flex-col gap-7">
            <Paragraphs
              text={body}
              className="border-s-2 border-brand ps-6 text-lead text-ink-muted lg:ps-8"
            />
            {cta?.href && (
              <Cta href={cta.href} variant="secondary" icon="arrow-right" className="w-fit">
                {cta.label}
              </Cta>
            )}
          </div>
        </div>
      </SectionShell>
    );
  }
  return (
    <SectionShell id={section.key} container="wide">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
        <div className={clsx('flex flex-col gap-7', imagePosition === 'start' && 'lg:order-2')}>
          <span className="inline-flex items-center gap-2 text-caption font-bold uppercase tracking-[0.2em] text-accent">
            <span className="h-px w-7 bg-accent" />
            Body Style
          </span>
          <h2 className="text-h1 max-w-[15ch]">{heading}</h2>
          <Paragraphs text={body} className="text-lead" />
          {cta?.href && (
            <Cta href={cta.href} variant="secondary" icon="arrow-right" className="w-fit">
              {cta.label}
            </Cta>
          )}
        </div>
        <div
          className={clsx('group relative pb-5 pe-5', imagePosition === 'start' && 'lg:order-1')}
        >
          <div className="absolute inset-s-5 inset-e-0 bottom-0 top-5 border border-accent/50 bg-accent/10 transition-transform duration-slow ease-out-expo group-hover:translate-x-1.5 group-hover:translate-y-1.5 rtl:group-hover:-translate-x-1.5" />
          <SmartImage
            src={image}
            alt={heading}
            className="aspect-[4/3] border border-line-strong bg-surface"
            imgClassName="saturate-[.82] contrast-110 transition-transform duration-slow ease-out-expo group-hover:scale-[1.025]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <span className="absolute -start-3 top-8 grid size-12 place-items-center bg-brand text-caption font-black text-brand-ink shadow-lg">
            BS
          </span>
        </div>
      </div>
    </SectionShell>
  );
};

export default Intro;
