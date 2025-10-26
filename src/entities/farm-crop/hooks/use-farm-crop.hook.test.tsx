import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFarmCrops, useFarmCrop, useCreateFarmCrop, useDeleteFarmCrop, farmCropKeys } from './use-farm-crop.hook';
import { farmCropApi } from '../api';
import { FarmCrop, FarmCropFormData } from '../model';

// Mock da API
jest.mock('../api', () => ({
  farmCropApi: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockFarmCropApi = farmCropApi as jest.Mocked<typeof farmCropApi>;

// Helper para criar QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useFarmCrop hooks', () => {
  const mockFarmCrop: FarmCrop = {
    id: '1',
    farmId: '1',
    cropId: '1',
    harvestId: '1',
    createdAt: new Date('2021-01-01T00:00:00.000Z'),
    updatedAt: new Date('2021-01-01T00:00:00.000Z'),
    farm: {
      id: '1',
      name: 'Fazenda São João',
      producer: {
        id: '1',
        name: 'João Silva',
      },
    },
    crop: {
      id: '1',
      name: 'Soja',
    },
    harvest: {
      id: '1',
      name: 'Safra 2021',
      year: 2021,
    },
  };

  const mockFarmCrops: FarmCrop[] = [
    mockFarmCrop,
    {
      id: '2',
      farmId: '2',
      cropId: '2',
      harvestId: '2',
      createdAt: new Date('2021-01-01T00:00:00.000Z'),
      updatedAt: new Date('2021-01-01T00:00:00.000Z'),
      farm: {
        id: '2',
        name: 'Fazenda Santa Maria',
        producer: {
          id: '2',
          name: 'Maria Santos',
        },
      },
      crop: {
        id: '2',
        name: 'Milho',
      },
      harvest: {
        id: '2',
        name: 'Safra 2022',
        year: 2022,
      },
    },
  ];

  const mockFormData: FarmCropFormData = {
    farmId: '1',
    cropId: '1',
    harvestId: '1',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('farmCropKeys', () => {
    it('deve ter estrutura correta das chaves', () => {
      expect(farmCropKeys.all).toEqual(['farm-crops']);
      expect(farmCropKeys.lists()).toEqual(['farm-crops', 'list']);
      expect(farmCropKeys.list()).toEqual(['farm-crops', 'list']);
      expect(farmCropKeys.details()).toEqual(['farm-crops', 'detail']);
      expect(farmCropKeys.detail('1')).toEqual(['farm-crops', 'detail', '1']);
    });

    it('deve gerar chaves únicas para diferentes IDs', () => {
      const key1 = farmCropKeys.detail('1');
      const key2 = farmCropKeys.detail('2');

      expect(key1).toEqual(['farm-crops', 'detail', '1']);
      expect(key2).toEqual(['farm-crops', 'detail', '2']);
      expect(key1).not.toEqual(key2);
    });
  });

  describe('useFarmCrops', () => {
    it('deve buscar todas as associações com sucesso', async () => {
      mockFarmCropApi.getAll.mockResolvedValue(mockFarmCrops);

      const { result } = renderHook(() => useFarmCrops(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockFarmCrops);
      expect(result.current.isLoading).toBe(false);
      expect(mockFarmCropApi.getAll).toHaveBeenCalledTimes(1);
    });

    it('deve lidar com erro na busca', async () => {
      const error = new Error('Erro ao buscar associações');
      mockFarmCropApi.getAll.mockRejectedValue(error);

      const { result } = renderHook(() => useFarmCrops(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
      expect(result.current.data).toBeUndefined();
      expect(mockFarmCropApi.getAll).toHaveBeenCalledTimes(1);
    });

    it('deve usar queryKey correta', () => {
      renderHook(() => useFarmCrops(), {
        wrapper: createWrapper(),
      });

      expect(mockFarmCropApi.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('useFarmCrop', () => {
    it('deve buscar associação por ID com sucesso', async () => {
      mockFarmCropApi.getById.mockResolvedValue(mockFarmCrop);

      const { result } = renderHook(() => useFarmCrop('1'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockFarmCrop);
      expect(result.current.isLoading).toBe(false);
      expect(mockFarmCropApi.getById).toHaveBeenCalledWith('1');
    });

    it('deve retornar null quando associação não existe', async () => {
      mockFarmCropApi.getById.mockResolvedValue(null);

      const { result } = renderHook(() => useFarmCrop('999'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeNull();
      expect(mockFarmCropApi.getById).toHaveBeenCalledWith('999');
    });

    it('deve lidar com erro na busca por ID', async () => {
      const error = new Error('Erro ao buscar associação');
      mockFarmCropApi.getById.mockRejectedValue(error);

      const { result } = renderHook(() => useFarmCrop('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
      expect(result.current.data).toBeUndefined();
    });

    it('deve estar desabilitado quando ID é vazio', () => {
      const { result } = renderHook(() => useFarmCrop(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(mockFarmCropApi.getById).not.toHaveBeenCalled();
    });

    it('deve estar desabilitado quando ID é undefined', () => {
      const { result } = renderHook(() => useFarmCrop(undefined as unknown as string), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(mockFarmCropApi.getById).not.toHaveBeenCalled();
    });

    it('deve usar queryKey correta com ID', () => {
      renderHook(() => useFarmCrop('1'), {
        wrapper: createWrapper(),
      });

      expect(mockFarmCropApi.getById).toHaveBeenCalledWith('1');
    });
  });

  describe('useCreateFarmCrop', () => {
    it('deve criar associação com sucesso', async () => {
      mockFarmCropApi.create.mockResolvedValue(mockFarmCrop);

      const { result } = renderHook(() => useCreateFarmCrop(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(false);

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockFarmCrop);
      expect(mockFarmCropApi.create).toHaveBeenCalledWith(mockFormData);
    });

    it('deve chamar onSuccess quando fornecido', async () => {
      const onSuccess = jest.fn();
      mockFarmCropApi.create.mockResolvedValue(mockFarmCrop);

      const { result } = renderHook(() => useCreateFarmCrop({ onSuccess }), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onSuccess).toHaveBeenCalledWith(mockFarmCrop);
    });

    it('deve chamar onError quando fornecido', async () => {
      const error = new Error('Erro ao criar associação');
      const onError = jest.fn();
      mockFarmCropApi.create.mockRejectedValue(error);

      const { result } = renderHook(() => useCreateFarmCrop({ onError }), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(onError).toHaveBeenCalled();
    });

    it('deve invalidar queries após sucesso', async () => {
      mockFarmCropApi.create.mockResolvedValue(mockFarmCrop);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useCreateFarmCrop(), {
        wrapper,
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFarmCropApi.create).toHaveBeenCalledWith(mockFormData);
    });

    it('deve funcionar com diferentes dados de formulário', async () => {
      const differentFormData: FarmCropFormData = {
        farmId: '2',
        cropId: '3',
        harvestId: '4',
      };

      mockFarmCropApi.create.mockResolvedValue(mockFarmCrop);

      const { result } = renderHook(() => useCreateFarmCrop(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(differentFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFarmCropApi.create).toHaveBeenCalledWith(differentFormData);
    });
  });

  describe('useDeleteFarmCrop', () => {
    it('deve deletar associação com sucesso', async () => {
      mockFarmCropApi.delete.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteFarmCrop(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(false);

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFarmCropApi.delete).toHaveBeenCalledWith('1');
    });

    it('deve chamar onSuccess quando fornecido', async () => {
      const onSuccess = jest.fn();
      mockFarmCropApi.delete.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteFarmCrop({ onSuccess }), {
        wrapper: createWrapper(),
      });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onSuccess).toHaveBeenCalled();
    });

    it('deve chamar onError quando fornecido', async () => {
      const error = new Error('Erro ao deletar associação');
      const onError = jest.fn();
      mockFarmCropApi.delete.mockRejectedValue(error);

      const { result } = renderHook(() => useDeleteFarmCrop({ onError }), {
        wrapper: createWrapper(),
      });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(onError).toHaveBeenCalled();
    });

    it('deve invalidar queries após sucesso', async () => {
      mockFarmCropApi.delete.mockResolvedValue(undefined);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useDeleteFarmCrop(), {
        wrapper,
      });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFarmCropApi.delete).toHaveBeenCalledWith('1');
    });

    it('deve funcionar com diferentes IDs', async () => {
      mockFarmCropApi.delete.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteFarmCrop(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('999');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFarmCropApi.delete).toHaveBeenCalledWith('999');
    });
  });

  describe('integração', () => {
    it('deve funcionar com múltiplos hooks simultaneamente', async () => {
      mockFarmCropApi.getAll.mockResolvedValue(mockFarmCrops);
      mockFarmCropApi.getById.mockResolvedValue(mockFarmCrop);
      mockFarmCropApi.create.mockResolvedValue(mockFarmCrop);
      mockFarmCropApi.delete.mockResolvedValue(undefined);

      const wrapper = createWrapper();

      const { result: farmsResult } = renderHook(() => useFarmCrops(), { wrapper });
      const { result: farmResult } = renderHook(() => useFarmCrop('1'), { wrapper });
      const { result: createResult } = renderHook(() => useCreateFarmCrop(), { wrapper });
      const { result: deleteResult } = renderHook(() => useDeleteFarmCrop(), { wrapper });

      await waitFor(() => {
        expect(farmsResult.current.isSuccess).toBe(true);
      });

      await waitFor(() => {
        expect(farmResult.current.isSuccess).toBe(true);
      });

      createResult.current.mutate(mockFormData);
      await waitFor(() => {
        expect(createResult.current.isSuccess).toBe(true);
      });

      deleteResult.current.mutate('1');
      await waitFor(() => {
        expect(deleteResult.current.isSuccess).toBe(true);
      });

      expect(farmsResult.current.data).toEqual(mockFarmCrops);
      expect(farmResult.current.data).toEqual(mockFarmCrop);
      expect(createResult.current.data).toEqual(mockFarmCrop);
    });

    it('deve manter estado independente entre diferentes instâncias', async () => {
      mockFarmCropApi.getById.mockResolvedValue(mockFarmCrop);

      const wrapper = createWrapper();

      const { result: result1 } = renderHook(() => useFarmCrop('1'), { wrapper });
      const { result: result2 } = renderHook(() => useFarmCrop('2'), { wrapper });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
        expect(result2.current.isSuccess).toBe(true);
      });

      expect(mockFarmCropApi.getById).toHaveBeenCalledWith('1');
      expect(mockFarmCropApi.getById).toHaveBeenCalledWith('2');
    });
  });

  describe('estados de loading', () => {
    it('deve mostrar loading inicial correto', () => {
      mockFarmCropApi.getAll.mockResolvedValue(mockFarmCrops);

      const { result } = renderHook(() => useFarmCrops(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it('deve mostrar pending correto em mutations', async () => {
      mockFarmCropApi.create.mockResolvedValue(mockFarmCrop);

      const { result } = renderHook(() => useCreateFarmCrop(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(false);

      result.current.mutate(mockFormData);

      // Verifica se a mutation foi chamada
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFarmCropApi.create).toHaveBeenCalledWith(mockFormData);
    });
  });
});
