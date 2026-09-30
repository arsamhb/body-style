'use client';

import { useField } from 'formik';
import React from 'react';
import SelectInput, { SelectInputProps } from './SelectInput';

interface FormikSelectInputProps extends Omit<
  SelectInputProps,
  'value' | 'onChange' | 'onBlur' | 'error'
> {
  name: string;
}

const FormikSelectInput: React.FC<FormikSelectInputProps> = ({ name, ...props }) => {
  const [field, meta] = useField(name);
  const showError = meta.touched && meta.error;

  return (
    <SelectInput
      {...props}
      name={name}
      value={field.value ?? ''}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={showError ? meta.error : undefined}
    />
  );
};

export default FormikSelectInput;
