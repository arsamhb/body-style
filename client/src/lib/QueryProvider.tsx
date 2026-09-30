'use client';

import { handleApiError } from '@/lib/api/handleApiError';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => handleApiError(error),
  }),
  mutationCache: new MutationCache({
    onError: (error) => handleApiError(error),
  }),
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default QueryProvider;
