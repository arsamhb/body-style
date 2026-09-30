import { Link } from '@/i18n/navigation';
import SectionShell from '@/shared/UI/SectionShell';
import SmartImage from '@/shared/UI/SmartImage';
import type { SectionComponentProps } from '../types';

const Samples = ({ section }: SectionComponentProps<'samples'>) => {
  const { heading, text, items } = section.props;
  return (
    <SectionShell id={section.key} heading={heading} text={text}>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4" role="list">
        {items.map((item, i) => {
          const card = (
            <figure className="group relative overflow-hidden rounded-lg border border-line">
              <SmartImage
                src={item.image}
                alt={item.title}
                className="aspect-[4/3]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                imgClassName="transition-transform duration-slow ease-out-expo group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-gray-950/85 to-transparent p-5 pt-14 text-ink-inverse">
                <h3 className="text-h4 text-white">{item.title}</h3>
                <p className="text-small text-white/75 line-clamp-2">{item.text}</p>
              </figcaption>
            </figure>
          );
          return (
            <li key={i}>
              {item.href ? (
                <Link href={item.href} className="block">
                  {card}
                </Link>
              ) : (
                card
              )}
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
};

export default Samples;
