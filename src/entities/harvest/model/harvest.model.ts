/**
 * Safra (ano agrícola)
 */
export interface Harvest {
  id: string;
  name: string;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO para criação/edição de safra
 */
export interface HarvestFormData {
  name: string;
  year: number;
}
