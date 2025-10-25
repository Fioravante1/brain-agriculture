/**
 * Formata CPF: 000.000.000-00
 */
export function formatCPF(cpf: string): string {
  const cleanCPF = cpf.replace(/\D/g, '');
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata CNPJ: 00.000.000/0000-00
 */
export function formatCNPJ(cnpj: string): string {
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  return cleanCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Formata CPF ou CNPJ automaticamente
 */
export function formatCPFOrCNPJ(value: string): string {
  const cleanValue = value.replace(/\D/g, '');

  if (cleanValue.length <= 11) {
    return formatCPF(cleanValue);
  } else {
    return formatCNPJ(cleanValue);
  }
}

/**
 * Formata número com separador de milhares
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

/**
 * Formata área em hectares
 */
export function formatHectares(value: number): string {
  return `${formatNumber(value)} ha`;
}
