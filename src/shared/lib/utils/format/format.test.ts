import { formatCPFOrCNPJ, formatNumber, formatHectares } from './format';

describe('formatCPFOrCNPJ', () => {
  it('should format CPF correctly', () => {
    expect(formatCPFOrCNPJ('12345678909')).toBe('123.456.789-09');
  });

  it('should format CNPJ correctly', () => {
    expect(formatCPFOrCNPJ('11222333000181')).toBe('11.222.333/0001-81');
  });

  it('should return original value for invalid lengths', () => {
    expect(formatCPFOrCNPJ('123456')).toBe('123456');
    expect(formatCPFOrCNPJ('123456789012')).toBe('123456789012');
  });

  it('should handle already formatted values', () => {
    expect(formatCPFOrCNPJ('123.456.789-09')).toBe('123.456.789-09');
    expect(formatCPFOrCNPJ('11.222.333/0001-81')).toBe('11.222.333/0001-81');
  });
});

describe('formatNumber', () => {
  it('should format numbers with thousand separators', () => {
    expect(formatNumber(1000)).toBe('1.000');
    expect(formatNumber(1000000)).toBe('1.000.000');
  });

  it('should format single digit numbers', () => {
    expect(formatNumber(5)).toBe('5');
  });

  it('should format zero', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('should handle decimal numbers', () => {
    expect(formatNumber(1234.56)).toBe('1.234,56');
  });
});

describe('formatHectares', () => {
  it('should format hectares with "ha" suffix', () => {
    expect(formatHectares(1000)).toBe('1.000 ha');
    expect(formatHectares(500.5)).toBe('500,5 ha');
  });

  it('should format zero hectares', () => {
    expect(formatHectares(0)).toBe('0 ha');
  });

  it('should format large values correctly', () => {
    expect(formatHectares(1000000)).toBe('1.000.000 ha');
  });
});
