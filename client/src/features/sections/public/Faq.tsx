import { useTranslations } from 'next-intl';
import Cta from '@/shared/UI/Cta';
import IconByName from '@/shared/UI/IconByName';
import Paragraphs from '@/shared/UI/Paragraphs';
import SectionShell from '@/shared/UI/SectionShell';
import type { SectionComponentProps } from '../types';

const Faq = ({ section }: SectionComponentProps<'faq'>) => {
  const t = useTranslations();
  const { heading, text, items } = section.props;
  return (
    <SectionShell id={section.key} heading={heading} text={text} container="content">
      <div className="flex flex-col divide-y divide-line rounded-lg border border-line bg-surface">
        {items.map((item, i) => (
          <details key={i} className="group" name={`${section.key}-faq`}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-body font-medium marker:hidden [&::-webkit-details-marker]:hidden">
              <span>{item.question}</span>
              <IconByName
                name="chevron-down"
                className="size-5 shrink-0 text-ink-subtle transition-transform duration-base ease-out-expo group-open:rotate-180"
              />
            </summary>
            <div className="px-5 pb-5">
              <Paragraphs text={item.answer} className="text-small" />
            </div>
          </details>
        ))}
      </div>
      <p className="flex flex-wrap items-center justify-center gap-3 text-small text-ink-muted">
        {t('sections.faqHint')}
        <Cta href="/contact" variant="ghost" size="sm" icon="arrow-right">
          {t('common.contactUs')}
        </Cta>
      </p>
    </SectionShell>
  );
};

export default Faq;
