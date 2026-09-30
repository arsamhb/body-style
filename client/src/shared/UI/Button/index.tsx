import clsx from 'clsx';
import React from 'react';
import Loading from '../Loading';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  isLoading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...rest
}) => {
  const isDisabled = disabled || isLoading;

  const buttonClassName = clsx(
    'btn',
    {
      'btn-primary': variant === 'primary',
      'btn-secondary': variant === 'secondary',
      'btn-disabled': isDisabled,
    },
    className
  );
  return (
    <button disabled={isDisabled} className={buttonClassName} type={type} {...rest}>
      {isLoading ? <Loading size="sm" /> : children}
    </button>
  );
};

export default Button;
