import { formatCPFOrCNPJ, formatNumber, formatHectares, formatDateUTC } from './format';

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

describe('formatDateUTC', () => {
  it('should format dates in UTC using pt-BR format', () => {
    expect(formatDateUTC(new Date('2021-01-01T00:00:00.000Z'))).toBe('01/01/2021');
    expect(formatDateUTC(new Date('2022-12-31T23:59:59.999Z'))).toBe('31/12/2022');
  });

  it('should handle string dates', () => {
    expect(formatDateUTC('2021-06-15T00:00:00.000Z')).toBe('15/06/2021');
  });

  it('should handle timestamp numbers', () => {
    expect(formatDateUTC(0)).toBe('01/01/1970'); // Unix epoch in UTC
    expect(formatDateUTC(1609459200000)).toBe('01/01/2021'); // 2021-01-01 00:00:00 UTC
  });

  it('should return "Invalid Date" for invalid dates', () => {
    expect(formatDateUTC('invalid')).toBe('Invalid Date');
    expect(formatDateUTC(NaN)).toBe('Invalid Date');
  });

  it('should be consistent regardless of local timezone', () => {
    // This date is midnight UTC, which would be 21:00 of previous day in UTC-3 (Brazil)
    // But formatDateUTC should always show the UTC date
    const date = new Date('2021-01-01T00:00:00.000Z');
    expect(formatDateUTC(date)).toBe('01/01/2021');
  });
});
