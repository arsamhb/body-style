'use client';

import { Form, Formik, FormikConfig, FormikValues } from 'formik';
import React from 'react';

interface FormikWrapperProps<T extends FormikValues> extends FormikConfig<T> {
  children: React.ReactNode;
  formId?: string;
  className?: string;
}

function FormikWrapper<T extends FormikValues>({
  children,
  formId,
  className,
  ...formikConfig
}: FormikWrapperProps<T>) {
  return (
    <Formik {...formikConfig}>
      <Form id={formId} className={className}>
        {children}
      </Form>
    </Formik>
  );
}

export default FormikWrapper;
