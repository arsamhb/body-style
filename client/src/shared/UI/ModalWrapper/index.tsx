import clsx from 'clsx';
import React, { useEffect, useRef } from 'react';

export interface ModalWrapperProps {
  modalId: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  isOpen?: boolean;
  onClose?: () => void;
  withCloseButton?: boolean;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  modalId,
  children,
  size = 'md',
  isOpen,
  onClose,
  withCloseButton = true,
}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const closeModal = () => {
    dialogRef.current?.close();
    onClose?.();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) dialog.showModal();
      dialog.setAttribute('aria-modal', 'true');
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isOpen]);

  const dialogClassName = clsx(
    'backdrop:bg-base-300/80 relative pt-lg pe-md pb-md p-md shadow-lg rounded-lg bg-base-300',
    {
      'w-[480px]': size === 'sm',
      'w-[640px]': size === 'md',
      'w-[900px]': size === 'lg',
    }
  );

  return (
    <dialog
      id={modalId}
      ref={dialogRef}
      className={dialogClassName}
      role="dialog"
      aria-modal="true"
    >
      {withCloseButton && (
        <button aria-label="Close modal" onClick={closeModal} className="absolute top-2 end-4">
          ✕
        </button>
      )}
      <div className="flex flex-col items-center pt-2 gap-md">{children}</div>
    </dialog>
  );
};

export default ModalWrapper;
