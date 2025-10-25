/**
 * Cultura agrícola (Soja, Milho, Algodão, etc)
 */
export interface Crop {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO para criação/edição de cultura
 */
export interface CropFormData {
  name: string;
}

/**
 * Tipos de cultura disponíveis mock
 */
export enum CropType {
  SOJA = 'Soja',
  MILHO = 'Milho',
  ALGODAO = 'Algodão',
  CAFE = 'Café',
  CANA_DE_ACUCAR = 'Cana de Açúcar',
}
