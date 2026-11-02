import IconByName from '@/shared/UI/IconByName';
import SectionShell from '@/shared/UI/SectionShell';
import SmartImage from '@/shared/UI/SmartImage';
import type { SectionComponentProps } from '../types';

const Testimonials = ({ section }: SectionComponentProps<'testimonials'>) => {
  const { heading, items } = section.props;
  return (
    <SectionShell id={section.key} heading={heading} align="center" background="dots">
      <ul
        className="grid gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-3"
        role="list"
      >
        {items.map((item, i) => (
          <li key={i}>
            <figure className="group flex h-full min-h-72 flex-col gap-7 bg-surface p-6 transition-colors hover:bg-surface-raised lg:p-8">
              <div className="flex items-center justify-between">
                <IconByName name="quote" className="size-8 text-brand-strong" />
                <span className="text-caption font-bold tracking-[0.16em] text-ink-subtle">
                  / {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <blockquote className="flex-grow text-lead text-ink">{item.quote}</blockquote>
              <figcaption className="flex items-center gap-3 border-t border-line pt-5">
                <SmartImage
                  src={item.avatar}
                  alt=""
                  className="size-11 rounded-xs border border-line-strong"
                  sizes="44px"
                  placeholderIcon="user"
                />
                <div className="flex flex-col">
                  <span className="text-small font-medium">{item.author}</span>
                  <span className="text-caption text-ink-muted">{item.role}</span>
                </div>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
};

export default Testimonials;
