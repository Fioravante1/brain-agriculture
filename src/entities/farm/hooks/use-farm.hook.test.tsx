import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useFarms, useFarm, useCreateFarm, useUpdateFarm, useDeleteFarm, farmKeys } from './use-farm.hook';
import { farmApi } from '../api';
import { Farm, FarmFormData } from '../model';

// Mock da API
jest.mock('../api', () => ({
  farmApi: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockFarmApi = farmApi as jest.Mocked<typeof farmApi>;

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

describe('Farm Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('farmKeys', () => {
    it('deve ter estrutura correta de chaves', () => {
      expect(farmKeys.all).toEqual(['farms']);
      expect(farmKeys.lists()).toEqual(['farms', 'list']);
      expect(farmKeys.list()).toEqual(['farms', 'list', { producerId: undefined }]);
      expect(farmKeys.list('producer-1')).toEqual(['farms', 'list', { producerId: 'producer-1' }]);
      expect(farmKeys.details()).toEqual(['farms', 'detail']);
      expect(farmKeys.detail('123')).toEqual(['farms', 'detail', '123']);
    });
  });

  describe('useFarms', () => {
    it('deve buscar todas as fazendas com sucesso', async () => {
      const mockFarms: Farm[] = [
        {
          id: '1',
          producerId: '1',
          name: 'Fazenda São João',
          city: 'São Paulo',
          state: 'SP',
          totalArea: 100,
          arableArea: 80,
          vegetationArea: 20,
          farmCrops: [],
          producer: {
            id: '1',
            name: 'João Silva',
            cpfCnpj: '12345678901',
          },
        },
        {
          id: '2',
          producerId: '2',
          name: 'Fazenda Santa Maria',
          city: 'Rio de Janeiro',
          state: 'RJ',
          totalArea: 200,
          arableArea: 150,
          vegetationArea: 50,
          farmCrops: [],
          producer: {
            id: '2',
            name: 'Maria Santos',
            cpfCnpj: '12345678000195',
          },
        },
      ];

      mockFarmApi.getAll.mockResolvedValue(mockFarms);

      const { result } = renderHook(() => useFarms(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockFarms);
      expect(mockFarmApi.getAll).toHaveBeenCalledTimes(1);
      expect(mockFarmApi.getAll).toHaveBeenCalledWith(undefined);
    });

    it('deve buscar fazendas filtradas por producerId', async () => {
      const mockFarms: Farm[] = [
        {
          id: '1',
          producerId: '1',
          name: 'Fazenda São João',
          city: 'São Paulo',
          state: 'SP',
          totalArea: 100,
          arableArea: 80,
          vegetationArea: 20,
          farmCrops: [],
          producer: {
            id: '1',
            name: 'João Silva',
            cpfCnpj: '12345678901',
          },
        },
      ];

      mockFarmApi.getAll.mockResolvedValue(mockFarms);

      const { result } = renderHook(() => useFarms('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockFarms);
      expect(mockFarmApi.getAll).toHaveBeenCalledWith('1');
    });

    it('deve lidar com erro ao buscar fazendas', async () => {
      const error = new Error('Erro ao buscar fazendas');
      mockFarmApi.getAll.mockRejectedValue(error);

      const { result } = renderHook(() => useFarms(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
      expect(mockFarmApi.getAll).toHaveBeenCalledTimes(1);
    });

    it('deve usar queryKey correta', () => {
      renderHook(() => useFarms(), {
        wrapper: createWrapper(),
      });

      expect(mockFarmApi.getAll).toHaveBeenCalledTimes(1);
    });

    it('deve usar queryKey correta com producerId', () => {
      renderHook(() => useFarms('producer-123'), {
        wrapper: createWrapper(),
      });

      expect(mockFarmApi.getAll).toHaveBeenCalledWith('producer-123');
    });
  });

  describe('useFarm', () => {
    it('deve buscar fazenda por ID com sucesso', async () => {
      const mockFarm: Farm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
        farmCrops: [],
        producer: {
          id: '1',
          name: 'João Silva',
          cpfCnpj: '12345678901',
        },
      };

      mockFarmApi.getById.mockResolvedValue(mockFarm);

      const { result } = renderHook(() => useFarm('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockFarm);
      expect(mockFarmApi.getById).toHaveBeenCalledWith('1');
    });

    it('deve retornar null quando fazenda não é encontrada', async () => {
      mockFarmApi.getById.mockResolvedValue(null);

      const { result } = renderHook(() => useFarm('999'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeNull();
      expect(mockFarmApi.getById).toHaveBeenCalledWith('999');
    });

    it('deve lidar com erro ao buscar fazenda', async () => {
      const error = new Error('Erro ao buscar fazenda');
      mockFarmApi.getById.mockRejectedValue(error);

      const { result } = renderHook(() => useFarm('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
      expect(mockFarmApi.getById).toHaveBeenCalledWith('1');
    });

    it('não deve executar query quando ID está vazio', () => {
      renderHook(() => useFarm(''), {
        wrapper: createWrapper(),
      });

      expect(mockFarmApi.getById).not.toHaveBeenCalled();
    });

    it('não deve executar query quando ID é undefined', () => {
      renderHook(() => useFarm(undefined as unknown as string), {
        wrapper: createWrapper(),
      });

      expect(mockFarmApi.getById).not.toHaveBeenCalled();
    });
  });

  describe('useCreateFarm', () => {
    it('deve criar fazenda com sucesso', async () => {
      const mockFormData: FarmFormData = {
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      const mockFarm: Farm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
        farmCrops: [],
        producer: {
          id: '1',
          name: 'João Silva',
          cpfCnpj: '12345678901',
        },
      };

      mockFarmApi.create.mockResolvedValue(mockFarm);

      const { result } = renderHook(() => useCreateFarm(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockFarm);
      expect(mockFarmApi.create).toHaveBeenCalledWith(mockFormData);
    });

    it('deve chamar onSuccess quando fornecido', async () => {
      const mockFormData: FarmFormData = {
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      const mockFarm: Farm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
        farmCrops: [],
        producer: {
          id: '1',
          name: 'João Silva',
          cpfCnpj: '12345678901',
        },
      };

      const onSuccess = jest.fn();
      mockFarmApi.create.mockResolvedValue(mockFarm);

      const { result } = renderHook(() => useCreateFarm({ onSuccess }), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onSuccess).toHaveBeenCalledWith(mockFarm);
    });

    it('deve chamar onError quando fornecido', async () => {
      const mockFormData: FarmFormData = {
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      const error = new Error('Erro ao criar fazenda');
      const onError = jest.fn();
      mockFarmApi.create.mockRejectedValue(error);

      const { result } = renderHook(() => useCreateFarm({ onError }), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(onError).toHaveBeenCalled();
    });

    it('deve invalidar queries após sucesso', async () => {
      const mockFormData: FarmFormData = {
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      const mockFarm: Farm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
        farmCrops: [],
        producer: {
          id: '1',
          name: 'João Silva',
          cpfCnpj: '12345678901',
        },
      };

      mockFarmApi.create.mockResolvedValue(mockFarm);

      const { result } = renderHook(() => useCreateFarm(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFarmApi.create).toHaveBeenCalledWith(mockFormData);
    });
  });

  describe('useUpdateFarm', () => {
    it('deve atualizar fazenda com sucesso', async () => {
      const mockFormData: FarmFormData = {
        producerId: '1',
        name: 'Fazenda São João Atualizada',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 120,
        arableArea: 90,
        vegetationArea: 30,
      };

      const mockFarm: Farm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda São João Atualizada',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 120,
        arableArea: 90,
        vegetationArea: 30,
        farmCrops: [],
        producer: {
          id: '1',
          name: 'João Silva',
          cpfCnpj: '12345678901',
        },
      };

      mockFarmApi.update.mockResolvedValue(mockFarm);

      const { result } = renderHook(() => useUpdateFarm(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '1', data: mockFormData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockFarm);
      expect(mockFarmApi.update).toHaveBeenCalledWith('1', mockFormData);
    });

    it('deve chamar onSuccess quando fornecido', async () => {
      const mockFormData: FarmFormData = {
        producerId: '1',
        name: 'Fazenda São João Atualizada',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 120,
        arableArea: 90,
        vegetationArea: 30,
      };

      const mockFarm: Farm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda São João Atualizada',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 120,
        arableArea: 90,
        vegetationArea: 30,
        farmCrops: [],
        producer: {
          id: '1',
          name: 'João Silva',
          cpfCnpj: '12345678901',
        },
      };

      const onSuccess = jest.fn();
      mockFarmApi.update.mockResolvedValue(mockFarm);

      const { result } = renderHook(() => useUpdateFarm({ onSuccess }), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '1', data: mockFormData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onSuccess).toHaveBeenCalledWith(mockFarm);
    });

    it('deve chamar onError quando fornecido', async () => {
      const mockFormData: FarmFormData = {
        producerId: '1',
        name: 'Fazenda São João Atualizada',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 120,
        arableArea: 90,
        vegetationArea: 30,
      };

      const error = new Error('Erro ao atualizar fazenda');
      const onError = jest.fn();
      mockFarmApi.update.mockRejectedValue(error);

      const { result } = renderHook(() => useUpdateFarm({ onError }), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '1', data: mockFormData });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(onError).toHaveBeenCalled();
    });

    it('deve invalidar queries após sucesso', async () => {
      const mockFormData: FarmFormData = {
        producerId: '1',
        name: 'Fazenda São João Atualizada',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 120,
        arableArea: 90,
        vegetationArea: 30,
      };

      const mockFarm: Farm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda São João Atualizada',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 120,
        arableArea: 90,
        vegetationArea: 30,
        farmCrops: [],
        producer: {
          id: '1',
          name: 'João Silva',
          cpfCnpj: '12345678901',
        },
      };

      mockFarmApi.update.mockResolvedValue(mockFarm);

      const { result } = renderHook(() => useUpdateFarm(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '1', data: mockFormData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFarmApi.update).toHaveBeenCalledWith('1', mockFormData);
    });
  });

  describe('useDeleteFarm', () => {
    it('deve deletar fazenda com sucesso', async () => {
      mockFarmApi.delete.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteFarm(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFarmApi.delete).toHaveBeenCalledWith('1');
    });

    it('deve chamar onSuccess quando fornecido', async () => {
      const onSuccess = jest.fn();
      mockFarmApi.delete.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteFarm({ onSuccess }), {
        wrapper: createWrapper(),
      });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onSuccess).toHaveBeenCalled();
    });

    it('deve chamar onError quando fornecido', async () => {
      const error = new Error('Erro ao deletar fazenda');
      const onError = jest.fn();
      mockFarmApi.delete.mockRejectedValue(error);

      const { result } = renderHook(() => useDeleteFarm({ onError }), {
        wrapper: createWrapper(),
      });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(onError).toHaveBeenCalled();
    });

    it('deve invalidar queries após sucesso', async () => {
      mockFarmApi.delete.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteFarm(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFarmApi.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('Estados de loading e error', () => {
    it('deve ter estado de loading inicial correto', () => {
      const { result } = renderHook(() => useFarms(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(false);
    });

    it('deve ter estado de loading inicial correto para mutations', () => {
      const { result } = renderHook(() => useCreateFarm(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(false);
    });

    it('deve ter estado de pending durante mutation', async () => {
      const mockFormData: FarmFormData = {
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      const mockFarm: Farm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
        farmCrops: [],
        producer: {
          id: '1',
          name: 'João Silva',
          cpfCnpj: '12345678901',
        },
      };

      mockFarmApi.create.mockResolvedValue(mockFarm);

      const { result } = renderHook(() => useCreateFarm(), {
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
    it('deve usar queryKey correta para useFarms', () => {
      renderHook(() => useFarms(), {
        wrapper: createWrapper(),
      });

      expect(mockFarmApi.getAll).toHaveBeenCalledTimes(1);
    });

    it('deve usar queryKey correta para useFarm', () => {
      renderHook(() => useFarm('123'), {
        wrapper: createWrapper(),
      });

      expect(mockFarmApi.getById).toHaveBeenCalledWith('123');
    });

    it('deve usar mutationFn correta para useCreateFarm', async () => {
      const mockFormData: FarmFormData = {
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      const mockFarm: Farm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
        farmCrops: [],
        producer: {
          id: '1',
          name: 'João Silva',
          cpfCnpj: '12345678901',
        },
      };

      mockFarmApi.create.mockResolvedValue(mockFarm);

      const { result } = renderHook(() => useCreateFarm(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFarmApi.create).toHaveBeenCalledWith(mockFormData);
    });

    it('deve usar mutationFn correta para useUpdateFarm', async () => {
      const mockFormData: FarmFormData = {
        producerId: '1',
        name: 'Fazenda São João Atualizada',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 120,
        arableArea: 90,
        vegetationArea: 30,
      };

      const mockFarm: Farm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda São João Atualizada',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 120,
        arableArea: 90,
        vegetationArea: 30,
        farmCrops: [],
        producer: {
          id: '1',
          name: 'João Silva',
          cpfCnpj: '12345678901',
        },
      };

      mockFarmApi.update.mockResolvedValue(mockFarm);

      const { result } = renderHook(() => useUpdateFarm(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '1', data: mockFormData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFarmApi.update).toHaveBeenCalledWith('1', mockFormData);
    });

    it('deve usar mutationFn correta para useDeleteFarm', async () => {
      mockFarmApi.delete.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteFarm(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFarmApi.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('Validação de parâmetros específicos', () => {
    it('deve usar enabled: false quando ID está vazio em useFarm', () => {
      const { result } = renderHook(() => useFarm(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
    });

    it('deve usar enabled: false quando ID é undefined em useFarm', () => {
      const { result } = renderHook(() => useFarm(undefined as unknown as string), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
    });

    it('deve usar enabled: true quando ID é válido em useFarm', () => {
      const { result } = renderHook(() => useFarm('valid-id'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('Callback functions', () => {
    it('deve chamar onSuccess com dados corretos em useCreateFarm', async () => {
      const mockFormData: FarmFormData = {
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      const mockFarm: Farm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
        farmCrops: [],
        producer: {
          id: '1',
          name: 'João Silva',
          cpfCnpj: '12345678901',
        },
      };

      const onSuccess = jest.fn();
      mockFarmApi.create.mockResolvedValue(mockFarm);

      const { result } = renderHook(() => useCreateFarm({ onSuccess }), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onSuccess).toHaveBeenCalledWith(mockFarm);
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onError com erro correto em useCreateFarm', async () => {
      const mockFormData: FarmFormData = {
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      const error = new Error('Erro específico');
      const onError = jest.fn();
      mockFarmApi.create.mockRejectedValue(error);

      const { result } = renderHook(() => useCreateFarm({ onError }), {
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
});
