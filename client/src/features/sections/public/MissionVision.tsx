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
  return (
    <SectionShell id={section.key} background="subtle">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
        <div className="grid gap-4">
          {blocks.map((b) => (
            <article
              key={b.title}
              className="flex gap-5 rounded-lg border border-line bg-surface p-6 lg:p-8"
            >
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
          className="aspect-square rounded-xl border border-line lg:aspect-[4/5]"
          sizes="(max-width: 1024px) 100vw, 50vw"
          placeholderIcon="compass"
        />
      </div>
    </SectionShell>
  );
};

export default MissionVision;
