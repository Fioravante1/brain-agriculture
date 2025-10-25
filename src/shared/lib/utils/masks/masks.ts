/**
 * Aplica máscara de CPF/CNPJ enquanto digita
 */
export function maskCPFOrCNPJ(value: string): string {
  const cleanValue = value.replace(/\D/g, '');

  if (cleanValue.length <= 11) {
    // Máscara CPF - limita a 11 dígitos
    const limitedValue = cleanValue.slice(0, 11);
    return limitedValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } else {
    // Máscara CNPJ - limita a 14 dígitos
    const limitedValue = cleanValue.slice(0, 14);
    return limitedValue
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  }
}

/**
 * Aplica máscara de número decimal
 */
export function maskDecimal(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d)(\d{2})$/, '$1.$2')
    .replace(/(?=(\d{3})+(\D))\B/g, ',');
}
