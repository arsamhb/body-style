'use client';

import { useField } from 'formik';
import React from 'react';
import CheckboxInput, { CheckboxInputProps } from './CheckboxInput';

interface FormikCheckboxInputProps extends Omit<
  CheckboxInputProps,
  'checked' | 'onChange' | 'onBlur' | 'error'
> {
  name: string;
}

const FormikCheckboxInput: React.FC<FormikCheckboxInputProps> = ({ name, ...props }) => {
  const [field, meta] = useField({ name, type: 'checkbox' });
  const showError = meta.touched && meta.error;

  return (
    <CheckboxInput
      {...props}
      name={name}
      checked={field.checked}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={showError ? meta.error : undefined}
    />
  );
};

export default FormikCheckboxInput;
