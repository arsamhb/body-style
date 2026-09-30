'use client';

import clsx from 'clsx';
import { useField } from 'formik';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import IconByName from '@/shared/UI/IconByName';
import { FieldShell, useTranslateError } from '../ui/fields';
import MediaPickerModal from './MediaPickerModal';

interface ImageFieldProps {
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
  /** Tailwind aspect class for the preview. */
  aspect?: string;
}

/** Stores an image URL (from the media library). Preview + choose/replace/remove. */
const ImageField = ({ name, label, hint, required, aspect = 'aspect-video' }: ImageFieldProps) => {
  const t = useTranslations('admin.fields');
  const [field, meta, helpers] = useField<string>(name);
  const [open, setOpen] = useState(false);
  const tErr = useTranslateError();
  const error = meta.touched ? tErr(meta.error) : undefined;
  const id = `f-${name}`;

  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <div
          className={clsx(
            'relative w-full max-w-xs overflow-hidden rounded-md border border-line bg-surface-raised',
            aspect
          )}
        >
          {field.value ? (
            <Image
              src={field.value}
              alt=""
              fill
              sizes="320px"
              className="object-contain"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-pattern-dots text-ink-subtle">
              <IconByName name="image" className="size-6" />
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 sm:flex-col">
          <button type="button" id={id} className="btn btn-sm" onClick={() => setOpen(true)}>
            <IconByName name="image" className="size-4" />
            {field.value ? t('changeImage') : t('chooseImage')}
          </button>
          {field.value && (
            <button
              type="button"
              className="btn btn-ghost btn-sm text-danger"
              onClick={() => helpers.setValue('')}
            >
              <IconByName name="x" className="size-4" />
              {t('removeImage')}
            </button>
          )}
        </div>
      </div>
      <MediaPickerModal
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(m) => {
          helpers.setValue(m.url);
          setOpen(false);
        }}
      />
    </FieldShell>
  );
};

export default ImageField;
