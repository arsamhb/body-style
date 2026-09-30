import clsx from 'clsx';
import Cta from '@/shared/UI/Cta';
import Paragraphs from '@/shared/UI/Paragraphs';
import SectionShell from '@/shared/UI/SectionShell';
import SmartImage from '@/shared/UI/SmartImage';
import type { SectionComponentProps } from '../types';

const Intro = ({ section }: SectionComponentProps<'intro'>) => {
  const { heading, body, image, imagePosition, cta } = section.props;
  return (
    <SectionShell id={section.key} container="wide">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
        <div className={clsx('flex flex-col gap-6', imagePosition === 'start' && 'lg:order-2')}>
          <h2 className="text-h2">{heading}</h2>
          <Paragraphs text={body} className="text-lead" />
          {cta?.href && (
            <Cta href={cta.href} variant="secondary" icon="arrow-right" className="w-fit">
              {cta.label}
            </Cta>
          )}
        </div>
        <SmartImage
          src={image}
          alt={heading}
          className={clsx(
            'aspect-[4/3] rounded-xl border border-line',
            imagePosition === 'start' && 'lg:order-1'
          )}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </SectionShell>
  );
};

export default Intro;
