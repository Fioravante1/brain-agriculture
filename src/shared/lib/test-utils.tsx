import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/shared/lib/theme';
import { ToastProvider } from '@/shared/lib/contexts/toast-context';
import { ConfirmProvider } from '@/shared/lib/contexts/confirm-context';

// Helper para renderizar com tema e providers necessários
export const renderWithTheme = (component: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <ConfirmProvider>
          {children}
        </ConfirmProvider>
      </ToastProvider>
    </ThemeProvider>
  );

  return render(component, { wrapper: Wrapper, ...options });
};

// Re-exportar tudo do testing-library para conveniência
export * from '@testing-library/react';
