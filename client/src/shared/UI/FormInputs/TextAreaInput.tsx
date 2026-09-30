'use client';

import clsx from 'clsx';
import React, { ChangeEvent } from 'react';

export interface TextAreaInputProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  | 'className'
  | 'value'
  | 'onChange'
  | 'id'
  | 'name'
  | 'rows'
  | 'cols'
  | 'disabled'
  | 'placeholder'
  | 'onFocus'
> {
  value: string;
  label?: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  error?: string;
  id: string;
  name: string;
  containerClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
  rows?: number;
  cols?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({
  label,
  onChange,
  value,
  placeholder,
  error,
  id,
  name,
  containerClassName,
  labelClassName,
  disabled,
  rows = 4,
  cols,
  resize = 'none',
  ...props
}) => {
  return (
    <div className={containerClassName}>
      <div className="label p-0">{label && <h4 className={'custom-label-text'}>{label}</h4>}</div>
      <label
        className={clsx(
          `textarea flex items-start gap-2 ${labelClassName}`,
          error ? 'textarea-error' : 'textarea-default'
        )}
      >
        <textarea
          disabled={disabled}
          id={id}
          name={name}
          rows={rows}
          cols={cols}
          style={{ resize }}
          className="grow font-normal text-neutral-content min-h-25 p-3 outline-none rounded-xs bg-base-100"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={(e) => e.currentTarget.scrollIntoView({ block: 'center', behavior: 'smooth' })}
          {...props}
        />
      </label>
      {error && <p className="custom-error-message">{error}</p>}
    </div>
  );
};

export default TextAreaInput;
