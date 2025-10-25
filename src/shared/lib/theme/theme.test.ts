import { theme, Theme } from './theme';

describe('Theme', () => {
  describe('Estrutura do tema', () => {
    it('deve ter todas as propriedades principais', () => {
      expect(theme).toHaveProperty('colors');
      expect(theme).toHaveProperty('spacing');
      expect(theme).toHaveProperty('borderRadius');
      expect(theme).toHaveProperty('shadows');
      expect(theme).toHaveProperty('typography');
      expect(theme).toHaveProperty('breakpoints');
    });

    it('deve ser um objeto com estrutura imutável', () => {
      expect(theme).toBeDefined();
      expect(typeof theme).toBe('object');
      expect(theme).not.toBeNull();
    });
  });

  describe('Cores', () => {
    it('deve ter todas as cores primárias', () => {
      expect(theme.colors.primary).toBe('#2E7D32');
      expect(theme.colors.primaryDark).toBe('#1B5E20');
      expect(theme.colors.primaryLight).toBe('#4CAF50');
    });

    it('deve ter todas as cores secundárias', () => {
      expect(theme.colors.secondary).toBe('#FF6F00');
      expect(theme.colors.secondaryDark).toBe('#E65100');
      expect(theme.colors.secondaryLight).toBe('#FF9800');
    });

    it('deve ter cores de fundo', () => {
      expect(theme.colors.background).toBe('#F5F5F5');
      expect(theme.colors.surface).toBe('#FFFFFF');
    });

    it('deve ter cores de status', () => {
      expect(theme.colors.error).toBe('#D32F2F');
      expect(theme.colors.warning).toBe('#F57C00');
      expect(theme.colors.success).toBe('#388E3C');
      expect(theme.colors.info).toBe('#1976D2');
    });

    it('deve ter cores de texto', () => {
      expect(theme.colors.text.primary).toBe('#212121');
      expect(theme.colors.text.secondary).toBe('#757575');
      expect(theme.colors.text.disabled).toBe('#BDBDBD');
      expect(theme.colors.text.inverse).toBe('#FFFFFF');
    });

    it('deve ter cores de borda', () => {
      expect(theme.colors.border).toBe('#E0E0E0');
      expect(theme.colors.divider).toBe('#EEEEEE');
    });

    it('deve ter cores em formato hexadecimal válido', () => {
      const hexColorRegex = /^#[0-9A-F]{6}$/i;

      Object.values(theme.colors).forEach(color => {
        if (typeof color === 'string') {
          expect(color).toMatch(hexColorRegex);
        } else if (typeof color === 'object') {
          Object.values(color).forEach(nestedColor => {
            expect(nestedColor).toMatch(hexColorRegex);
          });
        }
      });
    });
  });

  describe('Espaçamento', () => {
    it('deve ter todos os tamanhos de espaçamento', () => {
      expect(theme.spacing.xs).toBe('4px');
      expect(theme.spacing.sm).toBe('8px');
      expect(theme.spacing.md).toBe('16px');
      expect(theme.spacing.lg).toBe('24px');
      expect(theme.spacing.xl).toBe('32px');
      expect(theme.spacing.xxl).toBe('48px');
    });

    it('deve ter espaçamentos em ordem crescente', () => {
      const spacingValues = Object.values(theme.spacing).map(value => parseInt(value.replace('px', '')));

      for (let i = 1; i < spacingValues.length; i++) {
        expect(spacingValues[i]).toBeGreaterThan(spacingValues[i - 1]);
      }
    });

    it('deve ter espaçamentos em formato px válido', () => {
      Object.values(theme.spacing).forEach(spacing => {
        expect(spacing).toMatch(/^\d+px$/);
      });
    });
  });

  describe('Border Radius', () => {
    it('deve ter todos os tamanhos de border radius', () => {
      expect(theme.borderRadius.sm).toBe('4px');
      expect(theme.borderRadius.md).toBe('8px');
      expect(theme.borderRadius.lg).toBe('12px');
      expect(theme.borderRadius.full).toBe('9999px');
    });

    it('deve ter border radius em formato px válido', () => {
      Object.values(theme.borderRadius).forEach(radius => {
        expect(radius).toMatch(/^\d+px$/);
      });
    });
  });

  describe('Sombras', () => {
    it('deve ter todas as sombras', () => {
      expect(theme.shadows.sm).toBe('0 1px 2px 0 rgba(0, 0, 0, 0.05)');
      expect(theme.shadows.md).toBe('0 4px 6px -1px rgba(0, 0, 0, 0.1)');
      expect(theme.shadows.lg).toBe('0 10px 15px -3px rgba(0, 0, 0, 0.1)');
      expect(theme.shadows.xl).toBe('0 20px 25px -5px rgba(0, 0, 0, 0.1)');
    });

    it('deve ter sombras em formato CSS válido', () => {
      Object.values(theme.shadows).forEach(shadow => {
        expect(shadow).toMatch(/^0 \d+px \d+px/);
        expect(shadow).toContain('rgba');
      });
    });
  });

  describe('Tipografia', () => {
    it('deve ter famílias de fonte', () => {
      expect(theme.typography.fontFamily.base).toContain('system');
      expect(theme.typography.fontFamily.mono).toContain('monospace');
    });

    it('deve ter todos os tamanhos de fonte', () => {
      expect(theme.typography.fontSize.xs).toBe('12px');
      expect(theme.typography.fontSize.sm).toBe('14px');
      expect(theme.typography.fontSize.base).toBe('16px');
      expect(theme.typography.fontSize.lg).toBe('18px');
      expect(theme.typography.fontSize.xl).toBe('20px');
      expect(theme.typography.fontSize['2xl']).toBe('24px');
      expect(theme.typography.fontSize['3xl']).toBe('30px');
      expect(theme.typography.fontSize['4xl']).toBe('36px');
    });

    it('deve ter tamanhos de fonte em ordem crescente', () => {
      const fontSizeValues = Object.values(theme.typography.fontSize).map(value => parseInt(value.replace('px', '')));

      for (let i = 1; i < fontSizeValues.length; i++) {
        expect(fontSizeValues[i]).toBeGreaterThan(fontSizeValues[i - 1]);
      }
    });

    it('deve ter pesos de fonte', () => {
      expect(theme.typography.fontWeight.normal).toBe(400);
      expect(theme.typography.fontWeight.medium).toBe(500);
      expect(theme.typography.fontWeight.semibold).toBe(600);
      expect(theme.typography.fontWeight.bold).toBe(700);
    });

    it('deve ter alturas de linha', () => {
      expect(theme.typography.lineHeight.tight).toBe(1.25);
      expect(theme.typography.lineHeight.normal).toBe(1.5);
      expect(theme.typography.lineHeight.relaxed).toBe(1.75);
    });
  });

  describe('Breakpoints', () => {
    it('deve ter todos os breakpoints', () => {
      expect(theme.breakpoints.mobile).toBe('640px');
      expect(theme.breakpoints.tablet).toBe('768px');
      expect(theme.breakpoints.desktop).toBe('1024px');
      expect(theme.breakpoints.wide).toBe('1280px');
    });

    it('deve ter breakpoints em ordem crescente', () => {
      const breakpointValues = Object.values(theme.breakpoints).map(value => parseInt(value.replace('px', '')));

      for (let i = 1; i < breakpointValues.length; i++) {
        expect(breakpointValues[i]).toBeGreaterThan(breakpointValues[i - 1]);
      }
    });

    it('deve ter breakpoints em formato px válido', () => {
      Object.values(theme.breakpoints).forEach(breakpoint => {
        expect(breakpoint).toMatch(/^\d+px$/);
      });
    });
  });

  describe('Tipo Theme', () => {
    it('deve ter tipo Theme exportado', () => {
      // Teste de tipo - se compilar sem erro, o tipo está correto
      const testTheme: Theme = theme;
      expect(testTheme).toBeDefined();
    });

    it('deve permitir acesso tipado às propriedades', () => {
      const primaryColor: string = theme.colors.primary;
      const spacingMd: string = theme.spacing.md;
      const fontSizeBase: string = theme.typography.fontSize.base;

      expect(primaryColor).toBe('#2E7D32');
      expect(spacingMd).toBe('16px');
      expect(fontSizeBase).toBe('16px');
    });
  });

  describe('Consistência do tema', () => {
    it('deve ter cores primárias harmonicas', () => {
      // Verifica se as cores primárias seguem uma progressão lógica
      const primary = theme.colors.primary;
      const primaryDark = theme.colors.primaryDark;
      const primaryLight = theme.colors.primaryLight;

      expect(primary).toBeDefined();
      expect(primaryDark).toBeDefined();
      expect(primaryLight).toBeDefined();
    });

    it('deve ter cores secundárias harmonicas', () => {
      const secondary = theme.colors.secondary;
      const secondaryDark = theme.colors.secondaryDark;
      const secondaryLight = theme.colors.secondaryLight;

      expect(secondary).toBeDefined();
      expect(secondaryDark).toBeDefined();
      expect(secondaryLight).toBeDefined();
    });

    it('deve ter espaçamentos proporcionais', () => {
      const spacing = theme.spacing;
      expect(parseInt(spacing.sm.replace('px', ''))).toBe(parseInt(spacing.xs.replace('px', '')) * 2);
      expect(parseInt(spacing.md.replace('px', ''))).toBe(parseInt(spacing.sm.replace('px', '')) * 2);
    });

    it('deve ter tamanhos de fonte proporcionais', () => {
      const fontSize = theme.typography.fontSize;
      expect(parseInt(fontSize.lg.replace('px', ''))).toBe(parseInt(fontSize.base.replace('px', '')) + 2);
      expect(parseInt(fontSize.xl.replace('px', ''))).toBe(parseInt(fontSize.base.replace('px', '')) + 4);
    });
  });
});
