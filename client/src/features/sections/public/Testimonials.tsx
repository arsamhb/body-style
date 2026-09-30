import IconByName from '@/shared/UI/IconByName';
import SectionShell from '@/shared/UI/SectionShell';
import SmartImage from '@/shared/UI/SmartImage';
import type { SectionComponentProps } from '../types';

const Testimonials = ({ section }: SectionComponentProps<'testimonials'>) => {
  const { heading, items } = section.props;
  return (
    <SectionShell id={section.key} heading={heading} align="center" background="dots">
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" role="list">
        {items.map((item, i) => (
          <li key={i}>
            <figure className="flex h-full flex-col gap-6 rounded-lg border border-line bg-surface p-6 lg:p-8 shadow-xs">
              <IconByName name="quote" className="size-6 text-ink-subtle" />
              <blockquote className="text-body text-ink flex-grow">{item.quote}</blockquote>
              <figcaption className="flex items-center gap-3">
                <SmartImage
                  src={item.avatar}
                  alt=""
                  className="size-11 rounded-full"
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
