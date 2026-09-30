import React from 'react';

export interface TextInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'className' | 'type' | 'value' | 'onChange' | 'id' | 'name'
> {
  value?: string | number;
  label: string;
  type: React.HTMLInputTypeAttribute;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
  id: string;
  name: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  onChange,
  type,
  value,
  placeholder,
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
      <input
        id={id}
        name={name}
        type={type}
        className="input input-bordered w-full"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="custom-error-message">
          {error}
        </p>
      )}
    </div>
  );
};

export default TextInput;
