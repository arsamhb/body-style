import clsx from 'clsx';
import { Link } from '@/i18n/navigation';
import IconByName from '@/shared/UI/IconByName';
import SectionShell from '@/shared/UI/SectionShell';
import type { SectionComponentProps } from '../types';

const Features = ({ section }: SectionComponentProps<'features'>) => {
  const { eyebrow, heading, text, items } = section.props;
  const compact = items.every((item) => !item.text);
  return (
    <SectionShell
      id={section.key}
      eyebrow={eyebrow}
      heading={heading}
      text={text}
      background="subtle"
      align="start"
    >
      <ul
        className={clsx(
          'grid gap-px border border-line bg-line sm:grid-cols-2',
          items.length === 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'
        )}
        role="list"
      >
        {items.map((item, i) => {
          const body = (
            <>
              <div className="flex items-start justify-between gap-4">
                <span className="icon-tile icon-hover">
                  <IconByName name={item.icon} className="size-6" strokeWidth={1.75} />
                </span>
                <span className="text-h3 font-black text-ink-subtle/35 transition-colors group-hover:text-brand-strong">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3
                className={clsx(
                  'text-h3 transition-colors group-hover:text-brand-strong',
                  compact ? 'mt-6' : 'mt-8'
                )}
              >
                {item.title}
              </h3>
              {item.text && <p className="mt-3 text-small text-ink-muted">{item.text}</p>}
              <span className="mt-8 h-px w-10 bg-line-strong transition-all duration-base ease-out-expo group-hover:w-full group-hover:bg-brand" />
            </>
          );
          const cls = clsx(
            'group relative flex h-full flex-col bg-surface p-6 transition-[background-color,transform] duration-base ease-out-expo hover:z-10 hover:-translate-y-1 hover:bg-surface-raised lg:p-8',
            compact ? 'min-h-56' : 'min-h-72'
          );
          return (
            <li key={i} className="h-full">
              {item.href ? (
                <Link href={item.href} className={cls}>
                  {body}
                </Link>
              ) : (
                <div className={cls}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
};

export default Features;
