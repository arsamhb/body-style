import React from 'react';

export interface SelectInputProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'className' | 'value' | 'onChange' | 'id' | 'name'
> {
  label: string;
  placeholder: string;
  options: Array<{ key: string; value: string }>;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  id: string;
  name: string;
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  options,
  placeholder,
  value,
  onChange,
  error,
  id,
  name,
  ...rest
}) => {
  return (
    <div>
      <label htmlFor={id} className={`label ${error ? 'custom-error-label' : 'custom-label-text'}`}>
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="select select-bordered w-full"
        {...rest}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option value={opt.key} key={opt.key}>
            {opt.value}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} role="alert" className="custom-error-message">
          {error}
        </p>
      )}
    </div>
  );
};

export default SelectInput;
