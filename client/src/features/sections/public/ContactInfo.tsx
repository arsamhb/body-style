import { contactWayHref } from '@/features/site/contactWays';
import IconByName from '@/shared/UI/IconByName';
import SectionShell from '@/shared/UI/SectionShell';
import type { SectionComponentProps } from '../types';

/** Big-format contact cards. Data comes from SiteSettings.contactWays (single source of truth). */
const ContactInfo = ({ section, site }: SectionComponentProps<'contactInfo'>) => {
  const { heading, text } = section.props;
  return (
    <SectionShell id={section.key} heading={heading} text={text} background="subtle">
      <ul className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]" role="list">
        {site.contactWays.map((way) => {
          const href = contactWayHref(way);
          const external = href?.startsWith('http');
          return (
            <li
              key={way.id}
              className="flex flex-col gap-5 rounded-lg border border-line bg-surface p-6 lg:p-8 card-hover"
            >
              <span className="icon-tile size-16 icon-hover">
                <IconByName name={way.icon} className="size-8" strokeWidth={1.5} />
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-h4">{way.label}</h3>
                <p className="text-small text-ink-muted">{way.description}</p>
              </div>
              {href ? (
                <a
                  href={href}
                  className="mt-auto text-lead font-medium link-underline w-fit"
                  dir="ltr"
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {way.value}
                </a>
              ) : (
                <p className="mt-auto text-body">{way.value}</p>
              )}
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
};

export default ContactInfo;
