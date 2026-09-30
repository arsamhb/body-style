'use client';

import { AuthProvider } from '@/context/AuthContext';

/** Auth lives only under /admin so public pages never run token timers. */
const AdminProviders = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

export default AdminProviders;
