import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/shared/lib/theme';

// Helper para renderizar com tema
export const renderWithTheme = (component: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;

  return render(component, { wrapper: Wrapper, ...options });
};

// Re-exportar tudo do testing-library para conveniência
export * from '@testing-library/react';
