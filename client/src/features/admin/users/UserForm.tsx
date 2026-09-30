'use client';

import { Form, Formik, useFormikContext } from 'formik';
import { useTranslations } from 'next-intl';
import { ADMIN_ROLES } from '@/lib/auth/permissions';
import { getUserFormInitialValue } from '@/app/_service/users/form.initialValues';
import type { UserFormSchema } from '@/app/_service/users/interface.form';
import type { UserSchema } from '@/app/_service/users/interface.schema';
import {
  userCreateValidationSchema,
  userUpdateValidationSchema,
} from '@/app/_service/users/validation';
import { applyApiValidationErrorsToFormik } from '@/lib/api/applyFormikValidationErrors';
import { FormSelect, FormText, FormToggle } from '../ui/fields';
import PermissionMatrix from './PermissionMatrix';

interface UserFormProps {
  formId: string;
  user?: UserSchema;
  isSelf?: boolean;
  onSubmit: (values: UserFormSchema, helpers: { onError: (err: unknown) => void }) => void;
}

const Fields = ({ isEdit, isSelf }: { isEdit: boolean; isSelf: boolean }) => {
  const t = useTranslations('admin');
  const { values } = useFormikContext<UserFormSchema>();
  return (
    <div className="flex flex-col gap-5">
      <FormText
        name="email"
        type="email"
        label={t('users.email')}
        dir="ltr"
        required
        autoComplete="off"
      />
      <FormText name="displayName" label={t('users.displayName')} />
      <FormText
        name="password"
        type="password"
        label={t('users.password')}
        hint={isEdit ? t('users.passwordKeep') : undefined}
        required={!isEdit}
        autoComplete="new-password"
        dir="ltr"
      />
      <FormSelect
        name="role"
        label={t('users.role')}
        options={ADMIN_ROLES.map((r) => ({ value: r, label: t(`roles.${r}`) }))}
        disabled={isSelf}
      />
      {values.role === 'developer' ? (
        <p className="rounded-md bg-surface-raised px-3 py-2 text-small text-ink-muted">
          {t('users.developerHint')}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-small font-medium">{t('users.permissions')}</p>
          <p className="text-caption text-ink-subtle">{t('users.permissionsHint')}</p>
          <PermissionMatrix disabled={isSelf} />
        </div>
      )}
      {isEdit && <FormToggle name="isActive" label={t('users.isActive')} disabled={isSelf} />}
    </div>
  );
};

const UserForm = ({ formId, user, isSelf = false, onSubmit }: UserFormProps) => {
  const isEdit = Boolean(user);
  return (
    <Formik<UserFormSchema>
      initialValues={getUserFormInitialValue(user)}
      validationSchema={isEdit ? userUpdateValidationSchema : userCreateValidationSchema}
      enableReinitialize
      onSubmit={(values, { setFieldError }) =>
        onSubmit(values, { onError: (err) => applyApiValidationErrorsToFormik(setFieldError, err) })
      }
    >
      <Form id={formId} noValidate>
        <Fields isEdit={isEdit} isSelf={isSelf} />
      </Form>
    </Formik>
  );
};

export default UserForm;
