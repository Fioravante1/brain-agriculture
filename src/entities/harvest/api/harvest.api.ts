import { Harvest, HarvestFormData } from '../model';

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

export const harvestApi = {
  /**
   * Lista todas as safras
   */
  getAll: async (): Promise<Harvest[]> => {
    const response = await fetch(`${API_BASE_URL}/harvests`);

    if (!response.ok) {
      throw new Error('Erro ao buscar safras');
    }

    const result: ApiResponse<Harvest[]> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Erro ao buscar safras');
    }

    return result.data;
  },

  /**
   * Busca safra por ID
   */
  getById: async (id: string): Promise<Harvest | null> => {
    const response = await fetch(`${API_BASE_URL}/harvests/${id}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error('Erro ao buscar safra');
    }

    const result: ApiResponse<Harvest> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Erro ao buscar safra');
    }

    return result.data;
  },

  /**
   * Cria nova safra
   */
  create: async (data: HarvestFormData): Promise<Harvest> => {
    const response = await fetch(`${API_BASE_URL}/harvests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result: ApiResponse<Harvest> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Erro ao criar safra');
    }

    return result.data;
  },

  /**
   * Atualiza safra existente
   */
  update: async (id: string, data: HarvestFormData): Promise<Harvest> => {
    const response = await fetch(`${API_BASE_URL}/harvests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result: ApiResponse<Harvest> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Erro ao atualizar safra');
    }

    return result.data;
  },

  /**
   * Deleta safra
   */
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/harvests/${id}`, {
      method: 'DELETE',
    });

    const result: ApiResponse<void> = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Erro ao deletar safra');
    }
  },
};
