import { Crop, CropFormData } from '../model';

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

export const cropApi = {
  /**
   * Lista todas as culturas
   */
  getAll: async (): Promise<Crop[]> => {
    const response = await fetch(`${API_BASE_URL}/crops`);

    if (!response.ok) {
      throw new Error('Erro ao buscar culturas');
    }

    const result: ApiResponse<Crop[]> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Erro ao buscar culturas');
    }

    return result.data;
  },

  /**
   * Busca cultura por ID
   */
  getById: async (id: string): Promise<Crop | null> => {
    const response = await fetch(`${API_BASE_URL}/crops/${id}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error('Erro ao buscar cultura');
    }

    const result: ApiResponse<Crop> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Erro ao buscar cultura');
    }

    return result.data;
  },

  /**
   * Cria nova cultura
   */
  create: async (data: CropFormData): Promise<Crop> => {
    const response = await fetch(`${API_BASE_URL}/crops`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result: ApiResponse<Crop> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Erro ao criar cultura');
    }

    return result.data;
  },

  /**
   * Atualiza cultura existente
   */
  update: async (id: string, data: CropFormData): Promise<Crop> => {
    const response = await fetch(`${API_BASE_URL}/crops/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result: ApiResponse<Crop> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Erro ao atualizar cultura');
    }

    return result.data;
  },

  /**
   * Deleta cultura
   */
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/crops/${id}`, {
      method: 'DELETE',
    });

    const result: ApiResponse<void> = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Erro ao deletar cultura');
    }
  },
};
