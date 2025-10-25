import { Farm, FarmFormData } from '../model';

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

export const farmApi = {
  /**
   * Lista todas as fazendas
   */
  getAll: async (producerId?: string): Promise<Farm[]> => {
    const url = producerId ? `${API_BASE_URL}/farms?producerId=${producerId}` : `${API_BASE_URL}/farms`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Erro ao buscar fazendas');
    }

    const result: ApiResponse<Farm[]> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Erro ao buscar fazendas');
    }

    return result.data;
  },

  /**
   * Busca fazenda por ID
   */
  getById: async (id: string): Promise<Farm | null> => {
    const response = await fetch(`${API_BASE_URL}/farms/${id}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error('Erro ao buscar fazenda');
    }

    const result: ApiResponse<Farm> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Erro ao buscar fazenda');
    }

    return result.data;
  },

  /**
   * Cria nova fazenda
   */
  create: async (data: FarmFormData): Promise<Farm> => {
    const response = await fetch(`${API_BASE_URL}/farms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result: ApiResponse<Farm> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Erro ao criar fazenda');
    }

    return result.data;
  },

  /**
   * Atualiza fazenda existente
   */
  update: async (id: string, data: FarmFormData): Promise<Farm> => {
    const response = await fetch(`${API_BASE_URL}/farms/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result: ApiResponse<Farm> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Erro ao atualizar fazenda');
    }

    return result.data;
  },

  /**
   * Deleta fazenda
   */
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/farms/${id}`, {
      method: 'DELETE',
    });

    const result: ApiResponse<void> = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Erro ao deletar fazenda');
    }
  },
};
