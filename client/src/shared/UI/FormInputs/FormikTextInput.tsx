'use client';

import { useField } from 'formik';
import React from 'react';
import TextInput, { TextInputProps } from './TextInput';

interface FormikTextInputProps extends Omit<
  TextInputProps,
  'value' | 'onChange' | 'onBlur' | 'error'
> {
  name: string;
}

const FormikTextInput: React.FC<FormikTextInputProps> = ({ name, ...props }) => {
  const [field, meta] = useField(name);
  const showError = meta.touched && meta.error;

  return (
    <TextInput
      {...props}
      name={name}
      value={field.value ?? ''}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={showError ? meta.error : undefined}
    />
  );
};

export default FormikTextInput;
