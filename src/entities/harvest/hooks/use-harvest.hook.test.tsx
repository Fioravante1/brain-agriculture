import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useHarvests, useHarvest, useCreateHarvest, useUpdateHarvest, useDeleteHarvest, harvestKeys } from './use-harvest.hook';
import { harvestApi } from '../api';
import { Harvest, HarvestFormData } from '../model';

// Mock da API
jest.mock('../api', () => ({
  harvestApi: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockHarvestApi = harvestApi as jest.Mocked<typeof harvestApi>;

// Helper para criar QueryClient para testes
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

// Wrapper para React Query
const createWrapper = () => {
  const queryClient = createTestQueryClient();
  const Wrapper = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};

describe('Harvest Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('harvestKeys', () => {
    it('deve ter estrutura correta de chaves', () => {
      expect(harvestKeys.all).toEqual(['harvests']);
      expect(harvestKeys.lists()).toEqual(['harvests', 'list']);
      expect(harvestKeys.list()).toEqual(['harvests', 'list']);
      expect(harvestKeys.details()).toEqual(['harvests', 'detail']);
      expect(harvestKeys.detail('123')).toEqual(['harvests', 'detail', '123']);
    });
  });

  describe('useHarvests', () => {
    it('deve buscar todas as safras com sucesso', async () => {
      const mockHarvests: Harvest[] = [
        {
          id: '1',
          name: 'Safra 2021',
          year: 2021,
          createdAt: new Date('2021-01-01'),
          updatedAt: new Date('2021-01-01'),
        },
        {
          id: '2',
          name: 'Safra 2022',
          year: 2022,
          createdAt: new Date('2022-01-01'),
          updatedAt: new Date('2022-01-01'),
        },
        {
          id: '3',
          name: 'Safra 2023',
          year: 2023,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
      ];

      mockHarvestApi.getAll.mockResolvedValue(mockHarvests);

      const { result } = renderHook(() => useHarvests(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockHarvests);
      expect(mockHarvestApi.getAll).toHaveBeenCalledTimes(1);
      expect(mockHarvestApi.getAll).toHaveBeenCalledWith();
    });

    it('deve lidar com erro ao buscar safras', async () => {
      const error = new Error('Erro ao buscar safras');
      mockHarvestApi.getAll.mockRejectedValue(error);

      const { result } = renderHook(() => useHarvests(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
      expect(mockHarvestApi.getAll).toHaveBeenCalledTimes(1);
    });

    it('deve usar queryKey correta', () => {
      renderHook(() => useHarvests(), {
        wrapper: createWrapper(),
      });

      expect(mockHarvestApi.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('useHarvest', () => {
    it('deve buscar safra por ID com sucesso', async () => {
      const mockHarvest: Harvest = {
        id: '1',
        name: 'Safra 2021',
        year: 2021,
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-01'),
      };

      mockHarvestApi.getById.mockResolvedValue(mockHarvest);

      const { result } = renderHook(() => useHarvest('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockHarvest);
      expect(mockHarvestApi.getById).toHaveBeenCalledWith('1');
    });

    it('deve retornar null quando safra não é encontrada', async () => {
      mockHarvestApi.getById.mockResolvedValue(null);

      const { result } = renderHook(() => useHarvest('999'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeNull();
      expect(mockHarvestApi.getById).toHaveBeenCalledWith('999');
    });

    it('deve lidar com erro ao buscar safra', async () => {
      const error = new Error('Erro ao buscar safra');
      mockHarvestApi.getById.mockRejectedValue(error);

      const { result } = renderHook(() => useHarvest('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
      expect(mockHarvestApi.getById).toHaveBeenCalledWith('1');
    });

    it('não deve executar query quando ID está vazio', () => {
      renderHook(() => useHarvest(''), {
        wrapper: createWrapper(),
      });

      expect(mockHarvestApi.getById).not.toHaveBeenCalled();
    });

    it('não deve executar query quando ID é undefined', () => {
      renderHook(() => useHarvest(undefined as unknown as string), {
        wrapper: createWrapper(),
      });

      expect(mockHarvestApi.getById).not.toHaveBeenCalled();
    });
  });

  describe('useCreateHarvest', () => {
    it('deve criar safra com sucesso', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2024',
        year: 2024,
      };

      const mockHarvest: Harvest = {
        id: '4',
        name: 'Safra 2024',
        year: 2024,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      mockHarvestApi.create.mockResolvedValue(mockHarvest);

      const { result } = renderHook(() => useCreateHarvest(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockHarvest);
      expect(mockHarvestApi.create).toHaveBeenCalledWith(mockFormData);
    });

    it('deve chamar onSuccess quando fornecido', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2024',
        year: 2024,
      };

      const mockHarvest: Harvest = {
        id: '4',
        name: 'Safra 2024',
        year: 2024,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const onSuccess = jest.fn();
      mockHarvestApi.create.mockResolvedValue(mockHarvest);

      const { result } = renderHook(() => useCreateHarvest({ onSuccess }), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onSuccess).toHaveBeenCalledWith(mockHarvest);
    });

    it('deve chamar onError quando fornecido', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2024',
        year: 2024,
      };

      const error = new Error('Erro ao criar safra');
      const onError = jest.fn();
      mockHarvestApi.create.mockRejectedValue(error);

      const { result } = renderHook(() => useCreateHarvest({ onError }), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(onError).toHaveBeenCalled();
    });

    it('deve invalidar queries após sucesso', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2024',
        year: 2024,
      };

      const mockHarvest: Harvest = {
        id: '4',
        name: 'Safra 2024',
        year: 2024,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      mockHarvestApi.create.mockResolvedValue(mockHarvest);

      const { result } = renderHook(() => useCreateHarvest(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockHarvestApi.create).toHaveBeenCalledWith(mockFormData);
    });
  });

  describe('useUpdateHarvest', () => {
    it('deve atualizar safra com sucesso', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2024 Atualizada',
        year: 2024,
      };

      const mockHarvest: Harvest = {
        id: '4',
        name: 'Safra 2024 Atualizada',
        year: 2024,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };

      mockHarvestApi.update.mockResolvedValue(mockHarvest);

      const { result } = renderHook(() => useUpdateHarvest(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '4', data: mockFormData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockHarvest);
      expect(mockHarvestApi.update).toHaveBeenCalledWith('4', mockFormData);
    });

    it('deve chamar onSuccess quando fornecido', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2024 Atualizada',
        year: 2024,
      };

      const mockHarvest: Harvest = {
        id: '4',
        name: 'Safra 2024 Atualizada',
        year: 2024,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };

      const onSuccess = jest.fn();
      mockHarvestApi.update.mockResolvedValue(mockHarvest);

      const { result } = renderHook(() => useUpdateHarvest({ onSuccess }), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '4', data: mockFormData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onSuccess).toHaveBeenCalledWith(mockHarvest);
    });

    it('deve chamar onError quando fornecido', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2024 Atualizada',
        year: 2024,
      };

      const error = new Error('Erro ao atualizar safra');
      const onError = jest.fn();
      mockHarvestApi.update.mockRejectedValue(error);

      const { result } = renderHook(() => useUpdateHarvest({ onError }), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '4', data: mockFormData });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(onError).toHaveBeenCalled();
    });

    it('deve invalidar queries após sucesso', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2024 Atualizada',
        year: 2024,
      };

      const mockHarvest: Harvest = {
        id: '4',
        name: 'Safra 2024 Atualizada',
        year: 2024,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };

      mockHarvestApi.update.mockResolvedValue(mockHarvest);

      const { result } = renderHook(() => useUpdateHarvest(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '4', data: mockFormData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockHarvestApi.update).toHaveBeenCalledWith('4', mockFormData);
    });
  });

  describe('useDeleteHarvest', () => {
    it('deve deletar safra com sucesso', async () => {
      mockHarvestApi.delete.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteHarvest(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('4');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockHarvestApi.delete).toHaveBeenCalledWith('4');
    });

    it('deve chamar onSuccess quando fornecido', async () => {
      const onSuccess = jest.fn();
      mockHarvestApi.delete.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteHarvest({ onSuccess }), {
        wrapper: createWrapper(),
      });

      result.current.mutate('4');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onSuccess).toHaveBeenCalled();
    });

    it('deve chamar onError quando fornecido', async () => {
      const error = new Error('Erro ao deletar safra');
      const onError = jest.fn();
      mockHarvestApi.delete.mockRejectedValue(error);

      const { result } = renderHook(() => useDeleteHarvest({ onError }), {
        wrapper: createWrapper(),
      });

      result.current.mutate('4');

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(onError).toHaveBeenCalled();
    });

    it('deve invalidar queries após sucesso', async () => {
      mockHarvestApi.delete.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteHarvest(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('4');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockHarvestApi.delete).toHaveBeenCalledWith('4');
    });
  });

  describe('Estados de loading e error', () => {
    it('deve ter estado de loading inicial correto', () => {
      const { result } = renderHook(() => useHarvests(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(false);
    });

    it('deve ter estado de loading inicial correto para mutations', () => {
      const { result } = renderHook(() => useCreateHarvest(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(false);
    });

    it('deve ter estado de pending durante mutation', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2024',
        year: 2024,
      };

      const mockHarvest: Harvest = {
        id: '4',
        name: 'Safra 2024',
        year: 2024,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      mockHarvestApi.create.mockResolvedValue(mockHarvest);

      const { result } = renderHook(() => useCreateHarvest(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isPending).toBe(false);
    });
  });

  describe('Integração com React Query', () => {
    it('deve usar queryKey correta para useHarvests', () => {
      renderHook(() => useHarvests(), {
        wrapper: createWrapper(),
      });

      expect(mockHarvestApi.getAll).toHaveBeenCalledTimes(1);
    });

    it('deve usar queryKey correta para useHarvest', () => {
      renderHook(() => useHarvest('123'), {
        wrapper: createWrapper(),
      });

      expect(mockHarvestApi.getById).toHaveBeenCalledWith('123');
    });

    it('deve usar mutationFn correta para useCreateHarvest', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2024',
        year: 2024,
      };

      const mockHarvest: Harvest = {
        id: '4',
        name: 'Safra 2024',
        year: 2024,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      mockHarvestApi.create.mockResolvedValue(mockHarvest);

      const { result } = renderHook(() => useCreateHarvest(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockHarvestApi.create).toHaveBeenCalledWith(mockFormData);
    });

    it('deve usar mutationFn correta para useUpdateHarvest', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2024 Atualizada',
        year: 2024,
      };

      const mockHarvest: Harvest = {
        id: '4',
        name: 'Safra 2024 Atualizada',
        year: 2024,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };

      mockHarvestApi.update.mockResolvedValue(mockHarvest);

      const { result } = renderHook(() => useUpdateHarvest(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '4', data: mockFormData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockHarvestApi.update).toHaveBeenCalledWith('4', mockFormData);
    });

    it('deve usar mutationFn correta para useDeleteHarvest', async () => {
      mockHarvestApi.delete.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteHarvest(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('4');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockHarvestApi.delete).toHaveBeenCalledWith('4');
    });
  });

  describe('Validação de parâmetros específicos', () => {
    it('deve usar enabled: false quando ID está vazio em useHarvest', () => {
      const { result } = renderHook(() => useHarvest(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
    });

    it('deve usar enabled: false quando ID é undefined em useHarvest', () => {
      const { result } = renderHook(() => useHarvest(undefined as unknown as string), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
    });

    it('deve usar enabled: true quando ID é válido em useHarvest', () => {
      const { result } = renderHook(() => useHarvest('valid-id'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('Callback functions', () => {
    it('deve chamar onSuccess com dados corretos em useCreateHarvest', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2024',
        year: 2024,
      };

      const mockHarvest: Harvest = {
        id: '4',
        name: 'Safra 2024',
        year: 2024,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const onSuccess = jest.fn();
      mockHarvestApi.create.mockResolvedValue(mockHarvest);

      const { result } = renderHook(() => useCreateHarvest({ onSuccess }), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onSuccess).toHaveBeenCalledWith(mockHarvest);
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onError com erro correto em useCreateHarvest', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2024',
        year: 2024,
      };

      const error = new Error('Erro específico');
      const onError = jest.fn();
      mockHarvestApi.create.mockRejectedValue(error);

      const { result } = renderHook(() => useCreateHarvest({ onError }), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(onError).toHaveBeenCalledWith(error, mockFormData, undefined, expect.any(Object));
      expect(onError).toHaveBeenCalledTimes(1);
    });
  });

  describe('Cenários específicos de safra', () => {
    it('deve lidar com nomes de safra com caracteres especiais', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2024 & Colheita',
        year: 2024,
      };

      const mockHarvest: Harvest = {
        id: '5',
        name: 'Safra 2024 & Colheita',
        year: 2024,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      mockHarvestApi.create.mockResolvedValue(mockHarvest);

      const { result } = renderHook(() => useCreateHarvest(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.name).toBe('Safra 2024 & Colheita');
      expect(mockHarvestApi.create).toHaveBeenCalledWith({ name: 'Safra 2024 & Colheita', year: 2024 });
    });

    it('deve lidar com nomes de safra longos', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2024 - Colheita de Soja e Milho',
        year: 2024,
      };

      const mockHarvest: Harvest = {
        id: '6',
        name: 'Safra 2024 - Colheita de Soja e Milho',
        year: 2024,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      mockHarvestApi.create.mockResolvedValue(mockHarvest);

      const { result } = renderHook(() => useCreateHarvest(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.name).toBe('Safra 2024 - Colheita de Soja e Milho');
    });

    it('deve lidar com anos diferentes', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2025',
        year: 2025,
      };

      const mockHarvest: Harvest = {
        id: '7',
        name: 'Safra 2025',
        year: 2025,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      };

      mockHarvestApi.create.mockResolvedValue(mockHarvest);

      const { result } = renderHook(() => useCreateHarvest(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.year).toBe(2025);
    });

    it('deve lidar com lista vazia de safras', async () => {
      const mockHarvests: Harvest[] = [];

      mockHarvestApi.getAll.mockResolvedValue(mockHarvests);

      const { result } = renderHook(() => useHarvests(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
      expect(Array.isArray(result.current.data)).toBe(true);
    });

    it('deve lidar com atualização de safra existente', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2021 Atualizada',
        year: 2021,
      };

      const mockHarvest: Harvest = {
        id: '1',
        name: 'Safra 2021 Atualizada',
        year: 2021,
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-07'),
      };

      mockHarvestApi.update.mockResolvedValue(mockHarvest);

      const { result } = renderHook(() => useUpdateHarvest(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '1', data: mockFormData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.name).toBe('Safra 2021 Atualizada');
      expect(result.current.data?.updatedAt).toEqual(new Date('2021-01-07'));
    });

    it('deve lidar com anos negativos', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra Histórica',
        year: 1990,
      };

      const mockHarvest: Harvest = {
        id: '8',
        name: 'Safra Histórica',
        year: 1990,
        createdAt: new Date('1990-01-01'),
        updatedAt: new Date('1990-01-01'),
      };

      mockHarvestApi.create.mockResolvedValue(mockHarvest);

      const { result } = renderHook(() => useCreateHarvest(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.year).toBe(1990);
    });

    it('deve lidar com anos futuros', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra Futura',
        year: 2030,
      };

      const mockHarvest: Harvest = {
        id: '9',
        name: 'Safra Futura',
        year: 2030,
        createdAt: new Date('2030-01-01'),
        updatedAt: new Date('2030-01-01'),
      };

      mockHarvestApi.create.mockResolvedValue(mockHarvest);

      const { result } = renderHook(() => useCreateHarvest(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.year).toBe(2030);
    });
  });
});
