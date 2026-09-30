import { Link } from '@/i18n/navigation';
import IconByName from '@/shared/UI/IconByName';
import SectionShell from '@/shared/UI/SectionShell';
import type { SectionComponentProps } from '../types';

const Features = ({ section }: SectionComponentProps<'features'>) => {
  const { eyebrow, heading, text, items } = section.props;
  return (
    <SectionShell
      id={section.key}
      eyebrow={eyebrow}
      heading={heading}
      text={text}
      background="subtle"
      align="center"
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4" role="list">
        {items.map((item, i) => {
          const body = (
            <>
              <span className="icon-tile icon-hover">
                <IconByName name={item.icon} className="size-6" strokeWidth={1.75} />
              </span>
              <h3 className="text-h4 mt-5">{item.title}</h3>
              <p className="text-small text-ink-muted mt-2">{item.text}</p>
            </>
          );
          const cls =
            'group flex h-full flex-col rounded-lg border border-line bg-surface p-6 lg:p-8 card-hover';
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
