import clsx from 'clsx';

interface StatusBadgeProps {
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'brand';
  children: React.ReactNode;
  className?: string;
}

const TONE = {
  neutral: 'bg-surface-raised text-ink-muted border-line',
  success: 'bg-success-soft text-success border-transparent',
  warning: 'bg-warning-soft text-warning border-transparent',
  danger: 'bg-danger-soft text-danger border-transparent',
  brand: 'bg-brand text-brand-ink border-transparent',
} as const;

const StatusBadge = ({ tone = 'neutral', children, className }: StatusBadgeProps) => (
  <span
    className={clsx(
      'inline-flex items-center gap-1 rounded-pill border px-2 py-0.5 text-caption font-medium',
      TONE[tone],
      className
    )}
  >
    {children}
  </span>
);

export default StatusBadge;
