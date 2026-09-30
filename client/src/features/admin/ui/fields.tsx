'use client';

import clsx from 'clsx';
import { useField } from 'formik';
import { useTranslations } from 'next-intl';
import React from 'react';

// Yup messages in the _service validation files are i18n keys; server messages are plain text.
export const useTranslateError = () => {
  const t = useTranslations();
  return (message?: string) => {
    if (!message) return undefined;
    return message.startsWith('validation.') && t.has(message) ? t(message) : message;
  };
};

interface FieldShellProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FieldShell = ({ id, label, hint, error, required, children }: FieldShellProps) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-small font-medium">
      {label}
      {required && <span className="text-danger ms-1">*</span>}
    </label>
    {children}
    {error ? (
      <p id={`${id}-error`} role="alert" className="text-caption text-danger">
        {error}
      </p>
    ) : (
      hint && <p className="text-caption text-ink-subtle">{hint}</p>
    )}
  </div>
);

interface FormTextProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'id'> {
  name: string;
  label: string;
  hint?: string;
}

export const FormText = ({ name, label, hint, required, className, ...rest }: FormTextProps) => {
  const [field, meta] = useField<string>(name);
  const tErr = useTranslateError();
  const error = meta.touched ? tErr(meta.error) : undefined;
  const id = `f-${name}`;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <input
        id={id}
        {...field}
        value={field.value ?? ''}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={clsx('input w-full', error && 'input-error', className)}
        {...rest}
      />
    </FieldShell>
  );
};

interface FormTextAreaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'name' | 'id'
> {
  name: string;
  label: string;
  hint?: string;
}

export const FormTextArea = ({
  name,
  label,
  hint,
  required,
  className,
  ...rest
}: FormTextAreaProps) => {
  const [field, meta] = useField<string>(name);
  const tErr = useTranslateError();
  const error = meta.touched ? tErr(meta.error) : undefined;
  const id = `f-${name}`;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <textarea
        id={id}
        {...field}
        value={field.value ?? ''}
        aria-invalid={!!error}
        className={clsx('textarea w-full', error && 'textarea-error', className)}
        {...rest}
      />
    </FieldShell>
  );
};

interface FormSelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'name' | 'id'
> {
  name: string;
  label: string;
  hint?: string;
  options: { value: string; label: string }[];
}

export const FormSelect = ({
  name,
  label,
  hint,
  required,
  options,
  className,
  ...rest
}: FormSelectProps) => {
  const [field, meta] = useField<string>(name);
  const tErr = useTranslateError();
  const error = meta.touched ? tErr(meta.error) : undefined;
  const id = `f-${name}`;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <select
        id={id}
        {...field}
        className={clsx('select w-full', error && 'select-error', className)}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
};

interface FormToggleProps {
  name: string;
  label: string;
  hint?: string;
  disabled?: boolean;
}

export const FormToggle = ({ name, label, hint, disabled }: FormToggleProps) => {
  // With `type: 'checkbox'` Formik exposes the boolean as `checked` (value is the optional value prop).
  const [{ value: _value, checked, ...field }] = useField<boolean>({ name, type: 'checkbox' });
  const id = `f-${name}`;
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
      <input
        id={id}
        type="checkbox"
        className="toggle toggle-primary mt-0.5"
        {...field}
        checked={!!checked}
        disabled={disabled}
      />
      <span className="flex flex-col">
        <span className="text-small font-medium">{label}</span>
        {hint && <span className="text-caption text-ink-subtle">{hint}</span>}
      </span>
    </label>
  );
};
