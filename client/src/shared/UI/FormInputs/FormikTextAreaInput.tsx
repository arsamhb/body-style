'use client';

import { useField } from 'formik';
import React from 'react';
import TextAreaInput, { TextAreaInputProps } from './TextAreaInput';

interface FormikTextAreaInputProps extends Omit<
  TextAreaInputProps,
  'value' | 'onChange' | 'onBlur' | 'error'
> {
  name: string;
}

const FormikTextAreaInput: React.FC<FormikTextAreaInputProps> = ({ name, ...props }) => {
  const [field, meta] = useField(name);
  const showError = meta.touched && meta.error;

  return (
    <TextAreaInput
      {...props}
      name={name}
      value={field.value ?? ''}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={showError ? meta.error : undefined}
    />
  );
};

export default FormikTextAreaInput;
