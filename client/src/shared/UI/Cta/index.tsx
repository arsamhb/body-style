import clsx from 'clsx';
import React from 'react';
import { Link } from '@/i18n/navigation';
import IconByName from '../IconByName';

export type CtaVariant = 'primary' | 'secondary' | 'ghost';
export type CtaSize = 'sm' | 'md' | 'lg';

export interface CtaProps {
  href: string;
  children: React.ReactNode;
  variant?: CtaVariant;
  size?: CtaSize;
  /** Icon name in its LTR orientation; directional icons are mirrored automatically in RTL. */
  icon?: string;
  className?: string;
}

export const ctaClassName = (variant: CtaVariant = 'primary', size: CtaSize = 'md') =>
  clsx(
    'inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap',
    'transition-[background-color,color,border-color,box-shadow,transform] duration-base ease-out-expo',
    'focus-visible:shadow-glow active:translate-y-px',
    {
      'bg-brand text-brand-ink hover:bg-brand-hover': variant === 'primary',
      'bg-surface text-ink border border-line-strong hover:border-ink hover:bg-surface-raised':
        variant === 'secondary',
      'text-ink hover:bg-surface-raised': variant === 'ghost',
      'h-9 px-4 text-small': size === 'sm',
      'h-11 px-6 text-body': size === 'md',
      'h-13 px-8 text-lead': size === 'lg',
    }
  );

const isExternal = (href: string) =>
  /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');

/** Link styled as a button. Uses the locale-aware Link for internal paths. */
const Cta = ({ href, children, variant = 'primary', size = 'md', icon, className }: CtaProps) => {
  const cls = clsx(ctaClassName(variant, size), className);
  const content = (
    <>
      <span>{children}</span>
      {icon && <IconByName name={icon} className="size-4 rtl:-scale-x-100" />}
    </>
  );
  if (isExternal(href)) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
};

export default Cta;
