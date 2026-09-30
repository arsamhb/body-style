import IconByName from '@/shared/UI/IconByName';

interface EmptyStateProps {
  icon?: string;
  title: string;
  text?: string;
  action?: React.ReactNode;
}

const EmptyState = ({ icon = 'inbox', title, text, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-line-strong p-10 text-center">
    <span className="icon-tile size-12">
      <IconByName name={icon} className="size-5" />
    </span>
    <p className="text-body font-medium">{title}</p>
    {text && <p className="text-small text-ink-muted">{text}</p>}
    {action}
  </div>
);

export default EmptyState;
