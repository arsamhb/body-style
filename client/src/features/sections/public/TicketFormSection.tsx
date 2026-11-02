import Paragraphs from '@/shared/UI/Paragraphs';
import SectionShell from '@/shared/UI/SectionShell';
import type { PageKey } from '@/features/site/types';
import TicketForm from '@/features/tickets/TicketForm';
import type { SectionComponentProps } from '../types';

const TicketFormSection = ({
  section,
  page,
}: SectionComponentProps<'ticketForm'> & { page?: PageKey }) => {
  const { heading, text } = section.props;
  return (
    <SectionShell id={section.key} background="subtle">
      <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">
        <div className="flex flex-col gap-5 lg:col-span-2 lg:pt-8">
          <span className="inline-flex items-center gap-2 text-caption font-bold uppercase tracking-[0.2em] text-accent">
            <span className="h-px w-7 bg-accent" />
            Body Style
          </span>
          <h2 className="text-h1">{heading}</h2>
          <Paragraphs text={text} className="text-lead" />
        </div>
        <div className="lg:col-span-3">
          <TicketForm source={{ page: page ?? 'landing', section: section.key }} />
        </div>
      </div>
    </SectionShell>
  );
};

export default TicketFormSection;
