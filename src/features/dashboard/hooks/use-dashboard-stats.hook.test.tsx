import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDashboardStats, dashboardKeys, DashboardStats } from './use-dashboard-stats.hook';

// Mock do fetch global
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Helper para criar QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useDashboardStats', () => {
  const mockDashboardStats: DashboardStats = {
    totalFarms: 10,
    totalHectares: 5000,
    farmsByState: [
      { name: 'São Paulo', value: 5 },
      { name: 'Rio de Janeiro', value: 3 },
      { name: 'Minas Gerais', value: 2 },
    ],
    farmsByCrop: [
      { name: 'Soja', value: 6 },
      { name: 'Milho', value: 3 },
      { name: 'Algodão', value: 1 },
    ],
    landUse: [
      { name: 'Área Agricultável', value: 4000 },
      { name: 'Vegetação', value: 1000 },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('dashboardKeys', () => {
    it('deve ter estrutura correta das chaves', () => {
      expect(dashboardKeys.all).toEqual(['dashboard']);
      expect(dashboardKeys.stats()).toEqual(['dashboard', 'stats']);
    });

    it('deve gerar chaves consistentes', () => {
      const key1 = dashboardKeys.stats();
      const key2 = dashboardKeys.stats();
      expect(key1).toEqual(key2);
    });
  });

  describe('useDashboardStats', () => {
    it('deve buscar estatísticas com sucesso', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: mockDashboardStats,
          }),
      });

      const { result } = renderHook(() => useDashboardStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockDashboardStats);
      expect(mockFetch).toHaveBeenCalledWith('/api/dashboard/stats');
    });

    it('deve lidar com erro de resposta HTTP', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const { result } = renderHook(() => useDashboardStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(
        expect.objectContaining({
          message: 'Erro ao buscar estatísticas do dashboard',
        }),
      );
    });

    it('deve lidar com resposta de erro da API', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: false,
            error: 'Erro interno',
            message: 'Falha ao processar dados',
          }),
      });

      const { result } = renderHook(() => useDashboardStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(
        expect.objectContaining({
          message: 'Falha ao processar dados',
        }),
      );
    });

    it('deve lidar com resposta sem dados', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: null,
          }),
      });

      const { result } = renderHook(() => useDashboardStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(
        expect.objectContaining({
          message: 'Erro ao buscar estatísticas do dashboard',
        }),
      );
    });

    it('deve lidar com erro de rede', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useDashboardStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(
        expect.objectContaining({
          message: 'Network error',
        }),
      );
    });

    it('deve usar queryKey correta', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: mockDashboardStats,
          }),
      });

      const { result } = renderHook(() => useDashboardStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Verifica se a query foi executada com a chave correta
      expect(mockFetch).toHaveBeenCalledWith('/api/dashboard/stats');
    });

    it('deve mostrar loading inicial', () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: mockDashboardStats,
          }),
      });

      const { result } = renderHook(() => useDashboardStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it('deve funcionar com diferentes dados de estatísticas', async () => {
      const differentStats: DashboardStats = {
        totalFarms: 25,
        totalHectares: 12000,
        farmsByState: [
          { name: 'Paraná', value: 10 },
          { name: 'Santa Catarina', value: 8 },
          { name: 'Rio Grande do Sul', value: 7 },
        ],
        farmsByCrop: [
          { name: 'Trigo', value: 12 },
          { name: 'Aveia', value: 8 },
          { name: 'Cevada', value: 5 },
        ],
        landUse: [
          { name: 'Área Agricultável', value: 10000 },
          { name: 'Vegetação', value: 2000 },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: differentStats,
          }),
      });

      const { result } = renderHook(() => useDashboardStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(differentStats);
    });

    it('deve lidar com resposta com dados vazios', async () => {
      const emptyStats: DashboardStats = {
        totalFarms: 0,
        totalHectares: 0,
        farmsByState: [],
        farmsByCrop: [],
        landUse: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: emptyStats,
          }),
      });

      const { result } = renderHook(() => useDashboardStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(emptyStats);
    });

    it('deve fazer chamada para URL correta', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: mockDashboardStats,
          }),
      });

      renderHook(() => useDashboardStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/dashboard/stats');
      });
    });

    it('deve lidar com timeout de requisição', async () => {
      mockFetch.mockImplementationOnce(() => new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), 100)));

      const { result } = renderHook(() => useDashboardStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(
        expect.objectContaining({
          message: 'Request timeout',
        }),
      );
    });

    it('deve lidar com JSON inválido', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      const { result } = renderHook(() => useDashboardStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(
        expect.objectContaining({
          message: 'Invalid JSON',
        }),
      );
    });

    it('deve manter estado de loading durante requisição', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise(resolve => {
        resolvePromise = resolve;
      });

      mockFetch.mockReturnValueOnce(promise);

      const { result } = renderHook(() => useDashboardStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);

      resolvePromise!({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: mockDashboardStats,
          }),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });
  });

  describe('integração', () => {
    it('deve funcionar com múltiplas instâncias do hook', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: mockDashboardStats,
          }),
      });

      const { result: hook1 } = renderHook(() => useDashboardStats(), {
        wrapper: createWrapper(),
      });
      const { result: hook2 } = renderHook(() => useDashboardStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(hook1.current.isSuccess).toBe(true));
      await waitFor(() => expect(hook2.current.isSuccess).toBe(true));

      expect(hook1.current.data).toEqual(mockDashboardStats);
      expect(hook2.current.data).toEqual(mockDashboardStats);
    });

    it('deve compartilhar cache entre instâncias', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: mockDashboardStats,
          }),
      });

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result: hook1 } = renderHook(() => useDashboardStats(), { wrapper });

      await waitFor(() => expect(hook1.current.isSuccess).toBe(true));

      // Segunda instância deve usar cache
      const { result: hook2 } = renderHook(() => useDashboardStats(), { wrapper });

      expect(hook2.current.data).toEqual(mockDashboardStats);
      expect(mockFetch).toHaveBeenCalledTimes(1); // Apenas uma chamada
    });

    it('deve invalidar cache quando necessário', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: mockDashboardStats,
          }),
      });

      const wrapper = createWrapper();
      const { result } = renderHook(() => useDashboardStats(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Simular invalidação do cache
      result.current.refetch();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('estados de loading', () => {
    it('deve mostrar loading inicial correto', () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: mockDashboardStats,
          }),
      });

      const { result } = renderHook(() => useDashboardStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toBeUndefined();
    });

    it('deve mostrar estado de sucesso após carregamento', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: mockDashboardStats,
          }),
      });

      const { result } = renderHook(() => useDashboardStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toEqual(mockDashboardStats);
    });

    it('deve mostrar estado de erro após falha', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useDashboardStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.data).toBeUndefined();
    });
  });
});
