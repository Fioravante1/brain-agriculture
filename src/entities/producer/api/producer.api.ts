import { Producer, ProducerFormData } from '../model';

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

export const producerApi = {
  /**
   * Lista todos os produtores
   */
  getAll: async (): Promise<Producer[]> => {
    const response = await fetch(`${API_BASE_URL}/producers`);

    if (!response.ok) {
      throw new Error('Erro ao buscar produtores');
    }

    const result: ApiResponse<Producer[]> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Erro ao buscar produtores');
    }

    return result.data;
  },

  /**
   * Busca produtor por ID
   */
  getById: async (id: string): Promise<Producer | null> => {
    const response = await fetch(`${API_BASE_URL}/producers/${id}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error('Erro ao buscar produtor');
    }

    const result: ApiResponse<Producer> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Erro ao buscar produtor');
    }

    return result.data;
  },

  /**
   * Cria novo produtor
   */
  create: async (data: ProducerFormData): Promise<Producer> => {
    const response = await fetch(`${API_BASE_URL}/producers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result: ApiResponse<Producer> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Erro ao criar produtor');
    }

    return result.data;
  },

  /**
   * Atualiza produtor existente
   */
  update: async (id: string, data: ProducerFormData): Promise<Producer> => {
    const response = await fetch(`${API_BASE_URL}/producers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result: ApiResponse<Producer> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Erro ao atualizar produtor');
    }

    return result.data;
  },

  /**
   * Deleta produtor
   */
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/producers/${id}`, {
      method: 'DELETE',
    });

    const result: ApiResponse<void> = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Erro ao deletar produtor');
    }
  },
};
