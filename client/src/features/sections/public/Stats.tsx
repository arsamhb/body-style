import Container from '@/shared/UI/Container';
import IconByName from '@/shared/UI/IconByName';
import type { SectionComponentProps } from '../types';

const Stats = ({ section, locale }: SectionComponentProps<'stats'>) => {
  const fmt = new Intl.NumberFormat(locale);
  return (
    <section id={section.key} className="section-py-sm border-y border-line bg-canvas-subtle">
      <Container size="wide">
        <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {section.props.items.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2 text-center">
              {item.icon && (
                <IconByName name={item.icon} className="size-6 text-ink-subtle" strokeWidth={1.5} />
              )}
              <dd className="order-1 text-h1 font-semibold tabular-nums">
                {fmt.format(item.value)}
                {item.suffix && <span className="text-h3 text-ink-muted">{item.suffix}</span>}
              </dd>
              <dt className="order-2 text-small text-ink-muted">{item.label}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
};

export default Stats;
