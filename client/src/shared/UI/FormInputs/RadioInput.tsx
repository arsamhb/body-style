import clsx from 'clsx';
import React, { ChangeEvent } from 'react';

export interface RadioInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'className' | 'value' | 'onChange' | 'id' | 'name' | 'type' | 'checked' | 'disabled'
> {
  label: string;
  value: string;
  isChecked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  id: string;
  name: string;
  disabled?: boolean;
  containerClassName?: string;
  labelClassName?: string;
}

const RadioInput: React.FC<RadioInputProps> = ({
  label,
  value,
  isChecked,
  onChange,
  error,
  id,
  name,
  disabled,
  containerClassName,
  labelClassName,
}) => {
  const labelTitleClassName = clsx('label-text', {
    'custom-error-label': error,
  });

  return (
    <div className={containerClassName}>
      <label className={`custom-label-text flex items-center gap-md ${labelClassName || ''}`}>
        <input
          id={id}
          name={name}
          type="radio"
          value={value}
          checked={isChecked}
          disabled={disabled}
          className="radio radio-primary border-2"
          onChange={onChange}
          onFocus={(e) => e.currentTarget.scrollIntoView({ block: 'center', behavior: 'smooth' })}
        />
        <span className={labelTitleClassName}>{label}</span>
      </label>
      {error && <p className="custom-error-message">{error}</p>}
    </div>
  );
};

export default RadioInput;
