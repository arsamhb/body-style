'use client';

import { useField } from 'formik';
import React from 'react';
import RadioInput, { RadioInputProps } from './RadioInput';

interface FormikRadioInputProps extends Omit<
  RadioInputProps,
  'value' | 'onChange' | 'onBlur' | 'error' | 'isChecked'
> {
  name: string;
  value: string;
}

const FormikRadioInput: React.FC<FormikRadioInputProps> = ({ name, value, ...props }) => {
  const [field, meta] = useField(name);
  const showError = meta.touched && meta.error;

  return (
    <RadioInput
      {...props}
      name={name}
      value={value}
      isChecked={field.value === value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={showError ? meta.error : undefined}
    />
  );
};

export default FormikRadioInput;
