'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  text?: string;
  confirmLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  open,
  title,
  text,
  confirmLabel,
  danger,
  loading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const t = useTranslations('admin.common');
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className="modal" onClose={onCancel}>
      <div className="modal-box border border-line bg-canvas">
        <h3 className="text-h4">{title}</h3>
        {text && <p className="mt-2 text-small text-ink-muted">{text}</p>}
        <div className="modal-action">
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={loading}>
            {t('cancel')}
          </button>
          <button
            type="button"
            className={danger ? 'btn btn-error' : 'btn btn-primary'}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <span className="loading loading-spinner loading-xs" />}
            {confirmLabel ?? t('confirm')}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmDialog;
