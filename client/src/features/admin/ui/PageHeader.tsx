interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => (
  <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div className="flex flex-col gap-1">
      <h1 className="text-h3">{title}</h1>
      {subtitle && <p className="text-small text-ink-muted">{subtitle}</p>}
    </div>
    {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
  </header>
);

export default PageHeader;
