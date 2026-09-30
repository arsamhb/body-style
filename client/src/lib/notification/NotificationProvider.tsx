'use client';

import { useLocale } from 'next-intl';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getDirection } from '@/lib/i18n/locales';
import type { LocaleCode } from '@/i18n/routing';

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const locale = useLocale() as LocaleCode;
  const rtl = getDirection(locale) === 'rtl';
  return (
    <>
      {children}
      <ToastContainer
        position={rtl ? 'top-left' : 'top-right'}
        autoClose={2500}
        limit={5}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={rtl}
        pauseOnFocusLoss={false}
        draggable={true}
        pauseOnHover
        theme="colored"
        transition={Slide}
      />
    </>
  );
};
