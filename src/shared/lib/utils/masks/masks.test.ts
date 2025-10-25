import { maskCPFOrCNPJ } from './masks';

describe('maskCPFOrCNPJ', () => {
  it('should apply CPF mask for values with up to 11 digits', () => {
    expect(maskCPFOrCNPJ('123')).toBe('123');
    expect(maskCPFOrCNPJ('12345678')).toBe('123.456.78');
    expect(maskCPFOrCNPJ('12345678909')).toBe('123.456.789-09');
  });

  it('should apply CNPJ mask for values with more than 11 digits', () => {
    expect(maskCPFOrCNPJ('123456789012')).toBe('12.345.678/9012');
    expect(maskCPFOrCNPJ('11222333000181')).toBe('11.222.333/0001-81');
  });

  it('should handle partial input', () => {
    expect(maskCPFOrCNPJ('1')).toBe('1');
    expect(maskCPFOrCNPJ('12')).toBe('12');
    expect(maskCPFOrCNPJ('123')).toBe('123');
    expect(maskCPFOrCNPJ('1234')).toBe('123.4');
  });

  it('should remove non-numeric characters before masking', () => {
    expect(maskCPFOrCNPJ('123.456.789-09')).toBe('123.456.789-09');
    expect(maskCPFOrCNPJ('11.222.333/0001-81')).toBe('11.222.333/0001-81');
  });

  it('should handle empty string', () => {
    expect(maskCPFOrCNPJ('')).toBe('');
  });

  it('should limit CNPJ to 14 digits', () => {
    expect(maskCPFOrCNPJ('112223330001811111')).toBe('11.222.333/0001-81');
  });

  it('should treat values over 11 digits as CNPJ and limit to 14', () => {
    expect(maskCPFOrCNPJ('12345678909999')).toBe('12.345.678/9099-99');
  });
});
