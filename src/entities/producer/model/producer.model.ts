import { Farm } from '@/entities/farm';

/**
 * Produtor Rural
 */
export interface Producer {
  id: string;
  cpfCnpj: string;
  name: string;
  farms: Farm[];
}

/**
 * DTO para criação/edição de produtor
 */
export interface ProducerFormData {
  id?: string;
  cpfCnpj: string;
  name: string;
}
