import React from 'react';

export interface CheckboxInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'className' | 'id' | 'name'
> {
  label: string;
  error?: string;
  id: string;
  name: string;
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({ label, error, id, name, ...rest }) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className={`label w-fit gap-sm ${error ? 'custom-error-label' : 'custom-label-text'}`}
      >
        <input
          id={id}
          name={name}
          type="checkbox"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="checkbox checkbox-primary border"
          {...rest}
        />
        {label}
      </label>
      {error && (
        <p id={`${id}-error`} role="alert" className="custom-error-message">
          {error}
        </p>
      )}
    </div>
  );
};

export default CheckboxInput;
