import Container from '@/shared/UI/Container';
import IconByName from '@/shared/UI/IconByName';
import type { SectionComponentProps } from '../types';

const Stats = ({ section, locale }: SectionComponentProps<'stats'>) => {
  const fmt = new Intl.NumberFormat(locale);
  return (
    <section
      id={section.key}
      className="relative overflow-hidden border-y border-line bg-surface-sunken"
    >
      <div className="absolute inset-y-0 start-0 w-1 bg-brand" />
      <Container size="wide">
        <dl className="grid grid-cols-2 divide-x divide-line rtl:divide-x-reverse md:grid-cols-4">
          {section.props.items.map((item, i) => (
            <div
              key={i}
              className="group relative flex min-h-44 flex-col justify-center gap-2 px-4 py-8 text-center transition-colors hover:bg-surface sm:min-h-52 lg:px-8"
            >
              <div className="flex items-center justify-center gap-2 text-accent">
                {item.icon && <IconByName name={item.icon} className="size-4" strokeWidth={1.75} />}
                <span className="text-caption font-bold uppercase tracking-[0.18em]">
                  {item.label}
                </span>
              </div>
              <dd className="text-display font-black tabular-nums leading-none transition-transform duration-base ease-out-expo group-hover:-translate-y-1">
                {fmt.format(item.value)}
                {item.suffix && (
                  <span className="ms-1 text-h3 text-brand-strong">{item.suffix}</span>
                )}
              </dd>
              <dt className="sr-only">{item.label}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
};

export default Stats;
