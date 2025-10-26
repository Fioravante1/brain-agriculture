import { FarmCrop, FarmCropFormData } from '../model';

const API_BASE_URL = '/api';

/**
 * Interface para resposta da API
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: unknown;
}

export const farmCropApi = {
  /**
   * Lista todas as associações fazenda-cultura-safra
   */
  getAll: async (): Promise<FarmCrop[]> => {
    const response = await fetch(`${API_BASE_URL}/farm-crops`);

    if (!response.ok) {
      throw new Error('Erro ao buscar associações');
    }

    const result: ApiResponse<FarmCrop[]> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Erro ao buscar associações');
    }

    return result.data;
  },

  /**
   * Busca associação por ID
   */
  getById: async (id: string): Promise<FarmCrop | null> => {
    const response = await fetch(`${API_BASE_URL}/farm-crops/${id}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error('Erro ao buscar associação');
    }

    const result: ApiResponse<FarmCrop> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Erro ao buscar associação');
    }

    return result.data;
  },

  /**
   * Cria nova associação
   */
  create: async (data: FarmCropFormData): Promise<FarmCrop> => {
    const response = await fetch(`${API_BASE_URL}/farm-crops`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result: ApiResponse<FarmCrop> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Erro ao criar associação');
    }

    return result.data;
  },

  /**
   * Deleta associação
   */
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/farm-crops/${id}`, {
      method: 'DELETE',
    });

    const result: ApiResponse<void> = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Erro ao deletar associação');
    }
  },
};
