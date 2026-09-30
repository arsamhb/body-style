// notificationService.ts
import { isApiError, type ApiError } from '@/lib/api/errors';
import { toast, ToastOptions } from 'react-toastify';

const hash = (s: string) =>
  Array.from(s).reduce((acc, c) => ((acc << 5) - acc + c.charCodeAt(0)) | 0, 0);

const normalizeMessage = (input: unknown): string => {
  if (isApiError(input)) return input.message;

  if (Array.isArray(input)) {
    return input.filter(Boolean).map(String).join(' • ');
  }
  if (typeof input === 'object' && input !== null) {
    const anyObj = input as Record<string, unknown>;
    const nestedError = anyObj.error;
    if (typeof nestedError === 'object' && nestedError !== null) {
      const message = (nestedError as Record<string, unknown>).message;
      if (typeof message === 'string') return message;
    }

    const fromMessage = anyObj.message;
    if (Array.isArray(fromMessage)) return fromMessage.filter(Boolean).map(String).join(' • ');
    if (typeof fromMessage === 'string') return fromMessage;

    const fromErrors = anyObj.errors;
    if (Array.isArray(fromErrors)) return fromErrors.filter(Boolean).map(String).join(' • ');
  }
  return String(input ?? '');
};

const show = (
  type: 'success' | 'error' | 'info' | 'warn',
  rawMsg: unknown,
  opts?: ToastOptions & { dedupeKey?: string }
) => {
  const msg = normalizeMessage(rawMsg).trim();
  if (!msg) return;

  const key = opts?.dedupeKey ?? msg;
  const id = opts?.toastId ?? `t-${hash(key)}`;

  if (toast.isActive(id)) return;

  const common = { ...opts, toastId: id };
  switch (type) {
    case 'success':
      toast.success(msg, common);
      break;
    case 'error':
      toast.error(msg, common);
      break;
    case 'info':
      toast.info(msg, common);
      break;
    case 'warn':
      toast.warn(msg, common);
      break;
  }
};

export const notify = {
  success: (msg: string, opts?: ToastOptions & { dedupeKey?: string }) =>
    show('success', msg, opts),
  error: (msg: unknown, opts?: ToastOptions & { dedupeKey?: string }) => show('error', msg, opts),
  apiError: (err: ApiError, opts?: ToastOptions & { dedupeKey?: string }) =>
    show('error', err.message, {
      ...opts,
      dedupeKey: opts?.dedupeKey ?? `api-error-${err.status}-${err.code}`,
    }),
  info: (msg: string, opts?: ToastOptions & { dedupeKey?: string }) => show('info', msg, opts),
  warn: (msg: string, opts?: ToastOptions & { dedupeKey?: string }) => show('warn', msg, opts),
};
