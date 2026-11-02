import { Link } from '@/i18n/navigation';
import SectionShell from '@/shared/UI/SectionShell';
import SmartImage from '@/shared/UI/SmartImage';
import type { SectionComponentProps } from '../types';

const Samples = ({ section }: SectionComponentProps<'samples'>) => {
  const { heading, text, items } = section.props;
  return (
    <SectionShell id={section.key} heading={heading} text={text}>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4" role="list">
        {items.map((item, i) => {
          const card = (
            <figure className="group relative overflow-hidden rounded-xs border border-line bg-surface card-hover">
              <SmartImage
                src={item.image}
                alt={item.title}
                className="aspect-[4/3] bg-surface-raised"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                imgClassName="saturate-[.8] contrast-110 transition-[transform,filter] duration-slow ease-out-expo group-hover:scale-105 group-hover:saturate-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/15 to-transparent" />
              <span className="absolute end-4 top-4 grid size-9 place-items-center border border-white/20 bg-black/30 text-caption font-bold text-white backdrop-blur">
                {String(i + 1).padStart(2, '0')}
              </span>
              <figcaption className="on-dark absolute inset-x-0 bottom-0 flex flex-col gap-1 p-5 pt-14 text-ink-inverse">
                <span className="mb-2 h-0.5 w-8 bg-brand transition-all duration-base group-hover:w-16" />
                <h3 className="text-h3 text-white transition-colors group-hover:text-brand-strong">
                  {item.title}
                </h3>
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
