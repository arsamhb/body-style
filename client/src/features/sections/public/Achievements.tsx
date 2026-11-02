import IconByName from '@/shared/UI/IconByName';
import SectionShell from '@/shared/UI/SectionShell';
import SmartImage from '@/shared/UI/SmartImage';
import type { SectionComponentProps } from '../types';

const Achievements = ({ section }: SectionComponentProps<'achievements'>) => {
  const { heading, text, items } = section.props;
  // No photos at all (e.g. a list of standards): show slim icon cards instead of image tiles.
  if (items.every((item) => !item.image)) {
    return (
      <SectionShell id={section.key} heading={heading} text={text}>
        <ul
          className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5"
          role="list"
        >
          {items.map((item, i) => (
            <li
              key={i}
              className="group relative flex min-h-48 flex-col justify-between gap-8 bg-surface p-6 transition-colors hover:bg-surface-raised"
            >
              <span className="absolute inset-x-0 top-0 h-0.5 origin-start scale-x-0 bg-brand transition-transform duration-base group-hover:scale-x-100" />
              <div className="flex items-start justify-between gap-3">
                <span className="icon-tile icon-hover">
                  <IconByName name={item.icon || 'award'} className="size-6" strokeWidth={1.75} />
                </span>
                <span className="text-h4 font-black text-ink-subtle/35 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {item.year && (
                  <span className="text-caption font-medium text-ink-subtle tabular-nums">
                    {item.year}
                  </span>
                )}
                <h3 className="text-h4 transition-colors group-hover:text-brand-strong" dir="auto">
                  {item.title}
                </h3>
                {item.text && <p className="text-small text-ink-muted">{item.text}</p>}
              </div>
            </li>
          ))}
        </ul>
      </SectionShell>
    );
  }
  return (
    <SectionShell id={section.key} heading={heading} text={text}>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
        {items.map((item, i) => (
          <li
            key={i}
            className="group flex h-full flex-col overflow-hidden rounded-xs border border-line bg-surface card-hover"
          >
            {item.image ? (
              <SmartImage
                src={item.image}
                alt={item.title}
                className="aspect-[4/3]"
                imgClassName="saturate-[.8] contrast-110 transition-[transform,filter] duration-slow ease-out-expo group-hover:scale-105 group-hover:saturate-100"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center bg-pattern-dots">
                <span className="icon-tile size-16">
                  <IconByName name={item.icon ?? 'award'} className="size-8" strokeWidth={1.5} />
                </span>
              </div>
            )}
            <div className="relative flex flex-col gap-2 border-t border-line p-5">
              <span className="absolute inset-x-0 top-0 h-0.5 origin-start scale-x-0 bg-brand transition-transform duration-base group-hover:scale-x-100" />
              {item.year && (
                <span className="text-caption font-medium text-ink-subtle tabular-nums">
                  {item.year}
                </span>
              )}
              <h3 className="text-h4 transition-colors group-hover:text-brand-strong">
                {item.title}
              </h3>
              {item.text && <p className="text-small text-ink-muted">{item.text}</p>}
            </div>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
};

export default Achievements;
