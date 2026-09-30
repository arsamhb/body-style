import IconByName from '@/shared/UI/IconByName';
import SectionShell from '@/shared/UI/SectionShell';
import SmartImage from '@/shared/UI/SmartImage';
import type { SectionComponentProps } from '../types';

const Achievements = ({ section }: SectionComponentProps<'achievements'>) => {
  const { heading, text, items } = section.props;
  return (
    <SectionShell id={section.key} heading={heading} text={text}>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface card-hover"
          >
            {item.image ? (
              <SmartImage
                src={item.image}
                alt={item.title}
                className="aspect-[4/3]"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center bg-pattern-dots">
                <span className="icon-tile size-16">
                  <IconByName name={item.icon ?? 'award'} className="size-8" strokeWidth={1.5} />
                </span>
              </div>
            )}
            <div className="flex flex-col gap-2 p-5">
              {item.year && (
                <span className="text-caption font-medium text-ink-subtle tabular-nums">
                  {item.year}
                </span>
              )}
              <h3 className="text-h4">{item.title}</h3>
              <p className="text-small text-ink-muted">{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
};

export default Achievements;
