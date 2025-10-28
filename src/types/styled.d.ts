import 'styled-components';
import { theme } from '@/shared/lib/theme';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: typeof theme.colors;
    spacing: typeof theme.spacing;
    borderRadius: typeof theme.borderRadius;
    shadows: typeof theme.shadows;
    typography: typeof theme.typography;
    breakpoints: typeof theme.breakpoints;
  }
}
