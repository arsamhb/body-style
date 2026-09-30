'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useCan } from '../Can';
import { SETTINGS_TABS } from './SettingsTabs';

/** /admin/settings → first tab the account may open. */
const SettingsIndexRedirect = () => {
  const router = useRouter();
  const can = useCan();
  useEffect(() => {
    const first = SETTINGS_TABS.find((tab) => can(tab));
    router.replace(first?.href ?? '/admin');
  }, [router, can]);
  return null;
};

export default SettingsIndexRedirect;
