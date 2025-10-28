'use client';

import { ReactNode } from 'react';
import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';
import { ToastProvider, ToastContainer } from '@/shared/ui/toast';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';
import { ConfirmProvider } from '@/shared/lib/contexts/confirm-context';

export interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <ToastProvider>
          <ConfirmProvider>
            {children}
            <ToastContainer />
            <ConfirmDialog />
          </ConfirmProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
