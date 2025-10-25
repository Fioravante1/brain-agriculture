import { validateCPF, validateCNPJ, validateCPFOrCNPJ, removeNonNumeric } from './validate-cpf-cnpj';

describe('removeNonNumeric', () => {
  it('should remove all non-numeric characters', () => {
    expect(removeNonNumeric('123.456.789-00')).toBe('12345678900');
    expect(removeNonNumeric('12.345.678/0001-00')).toBe('12345678000100');
    expect(removeNonNumeric('abc123def456')).toBe('123456');
  });
});

describe('validateCPF', () => {
  it('should validate correct CPF', () => {
    expect(validateCPF('123.456.789-09')).toBe(true);
    expect(validateCPF('12345678909')).toBe(true);
  });

  it('should invalidate incorrect CPF', () => {
    expect(validateCPF('123.456.789-00')).toBe(false);
    expect(validateCPF('12345678900')).toBe(false);
  });

  it('should invalidate CPF with all same digits', () => {
    expect(validateCPF('111.111.111-11')).toBe(false);
    expect(validateCPF('000.000.000-00')).toBe(false);
  });

  it('should invalidate CPF with wrong length', () => {
    expect(validateCPF('123.456.789')).toBe(false);
    expect(validateCPF('123456')).toBe(false);
  });
});

describe('validateCNPJ', () => {
  it('should validate correct CNPJ', () => {
    expect(validateCNPJ('11.222.333/0001-81')).toBe(true);
    expect(validateCNPJ('11222333000181')).toBe(true);
  });

  it('should invalidate incorrect CNPJ', () => {
    expect(validateCNPJ('11.222.333/0001-00')).toBe(false);
    expect(validateCNPJ('11222333000100')).toBe(false);
  });

  it('should invalidate CNPJ with all same digits', () => {
    expect(validateCNPJ('11.111.111/1111-11')).toBe(false);
    expect(validateCNPJ('00.000.000/0000-00')).toBe(false);
  });

  it('should invalidate CNPJ with wrong length', () => {
    expect(validateCNPJ('11.222.333/0001')).toBe(false);
    expect(validateCNPJ('112223')).toBe(false);
  });
});

describe('validateCPFOrCNPJ', () => {
  it('should validate CPF when 11 digits', () => {
    expect(validateCPFOrCNPJ('123.456.789-09')).toBe(true);
    expect(validateCPFOrCNPJ('123.456.789-00')).toBe(false);
  });

  it('should validate CNPJ when 14 digits', () => {
    expect(validateCPFOrCNPJ('11.222.333/0001-81')).toBe(true);
    expect(validateCPFOrCNPJ('11.222.333/0001-00')).toBe(false);
  });

  it('should return false for invalid lengths', () => {
    expect(validateCPFOrCNPJ('123456')).toBe(false);
    expect(validateCPFOrCNPJ('123456789012')).toBe(false);
  });
});
