import IconByName from '@/shared/UI/IconByName';
import Paragraphs from '@/shared/UI/Paragraphs';
import SectionShell from '@/shared/UI/SectionShell';
import SmartImage from '@/shared/UI/SmartImage';
import type { SectionComponentProps } from '../types';

const MissionVision = ({ section }: SectionComponentProps<'missionVision'>) => {
  const { mission, vision, image } = section.props;
  const blocks = [
    { icon: 'target', ...mission },
    { icon: 'eye', ...vision },
  ];
  if (!image) {
    return (
      <SectionShell id={section.key}>
        <div className="grid gap-px border border-line bg-line lg:grid-cols-2">
          {blocks.map((b, i) => (
            <article
              key={b.title}
              className="group relative flex flex-col gap-6 bg-surface p-7 transition-colors hover:bg-surface-raised lg:p-12"
            >
              <span className="absolute inset-x-0 top-0 h-0.5 origin-start scale-x-0 bg-brand transition-transform duration-slow ease-out-expo group-hover:scale-x-100" />
              <div className="flex items-center justify-between">
                <span className="icon-tile size-14 icon-hover">
                  <IconByName name={b.icon} className="size-7" strokeWidth={1.75} />
                </span>
                <span className="text-h2 font-black text-ink-subtle/30">0{i + 1}</span>
              </div>
              <h2 className="text-h2 transition-colors group-hover:text-brand-strong">{b.title}</h2>
              <Paragraphs text={b.text} className="text-body text-ink-muted" />
            </article>
          ))}
        </div>
      </SectionShell>
    );
  }
  return (
    <SectionShell id={section.key} background="subtle">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
        <div className="grid gap-px border border-line bg-line">
          {blocks.map((b, i) => (
            <article
              key={b.title}
              className="group relative flex gap-5 bg-surface p-6 transition-colors hover:bg-surface-raised lg:p-8"
            >
              <span className="absolute end-5 top-4 text-caption font-bold text-ink-subtle/50">
                0{i + 1}
              </span>
              <span className="icon-tile shrink-0">
                <IconByName name={b.icon} className="size-6" strokeWidth={1.75} />
              </span>
              <div className="flex flex-col gap-2">
                <h2 className="text-h3">{b.title}</h2>
                <Paragraphs text={b.text} className="text-small" />
              </div>
            </article>
          ))}
        </div>
        <SmartImage
          src={image}
          alt=""
          className="aspect-square border border-line-strong lg:aspect-[4/5]"
          imgClassName="saturate-[.8] contrast-110"
          sizes="(max-width: 1024px) 100vw, 50vw"
          placeholderIcon="compass"
        />
      </div>
    </SectionShell>
  );
};

export default MissionVision;
