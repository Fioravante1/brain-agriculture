import { useQuery } from '@tanstack/react-query';

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

export interface DashboardStats {
  totalFarms: number;
  totalHectares: number;
  farmsByState: Array<{ name: string; value: number }>;
  farmsByCrop: Array<{ name: string; value: number }>;
  landUse: Array<{ name: string; value: number }>;
}

/**
 * Query keys para React Query
 */
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
};

/**
 * Hook para buscar estatísticas do dashboard
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async (): Promise<DashboardStats> => {
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`);

      if (!response.ok) {
        throw new Error('Erro ao buscar estatísticas do dashboard');
      }

      const result: ApiResponse<DashboardStats> = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.message || 'Erro ao buscar estatísticas do dashboard');
      }

      return result.data;
    },
  });
}
