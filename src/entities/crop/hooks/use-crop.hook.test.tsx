import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useCrops, useCrop, useCreateCrop, useUpdateCrop, useDeleteCrop, cropKeys } from './use-crop.hook';
import { cropApi } from '../api';
import { Crop, CropFormData } from '../model';

// Mock da API
jest.mock('../api', () => ({
  cropApi: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockCropApi = cropApi as jest.Mocked<typeof cropApi>;

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

describe('Crop Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('cropKeys', () => {
    it('deve ter estrutura correta de chaves', () => {
      expect(cropKeys.all).toEqual(['crops']);
      expect(cropKeys.lists()).toEqual(['crops', 'list']);
      expect(cropKeys.list()).toEqual(['crops', 'list']);
      expect(cropKeys.details()).toEqual(['crops', 'detail']);
      expect(cropKeys.detail('123')).toEqual(['crops', 'detail', '123']);
    });
  });

  describe('useCrops', () => {
    it('deve buscar todas as culturas com sucesso', async () => {
      const mockCrops: Crop[] = [
        {
          id: '1',
          name: 'Soja',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: '2',
          name: 'Milho',
          createdAt: new Date('2024-01-02'),
          updatedAt: new Date('2024-01-02'),
        },
        {
          id: '3',
          name: 'Algodão',
          createdAt: new Date('2024-01-03'),
          updatedAt: new Date('2024-01-03'),
        },
      ];

      mockCropApi.getAll.mockResolvedValue(mockCrops);

      const { result } = renderHook(() => useCrops(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCrops);
      expect(mockCropApi.getAll).toHaveBeenCalledTimes(1);
      expect(mockCropApi.getAll).toHaveBeenCalledWith();
    });

    it('deve lidar com erro ao buscar culturas', async () => {
      const error = new Error('Erro ao buscar culturas');
      mockCropApi.getAll.mockRejectedValue(error);

      const { result } = renderHook(() => useCrops(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
      expect(mockCropApi.getAll).toHaveBeenCalledTimes(1);
    });

    it('deve usar queryKey correta', () => {
      renderHook(() => useCrops(), {
        wrapper: createWrapper(),
      });

      expect(mockCropApi.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('useCrop', () => {
    it('deve buscar cultura por ID com sucesso', async () => {
      const mockCrop: Crop = {
        id: '1',
        name: 'Soja',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      mockCropApi.getById.mockResolvedValue(mockCrop);

      const { result } = renderHook(() => useCrop('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCrop);
      expect(mockCropApi.getById).toHaveBeenCalledWith('1');
    });

    it('deve retornar null quando cultura não é encontrada', async () => {
      mockCropApi.getById.mockResolvedValue(null);

      const { result } = renderHook(() => useCrop('999'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeNull();
      expect(mockCropApi.getById).toHaveBeenCalledWith('999');
    });

    it('deve lidar com erro ao buscar cultura', async () => {
      const error = new Error('Erro ao buscar cultura');
      mockCropApi.getById.mockRejectedValue(error);

      const { result } = renderHook(() => useCrop('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
      expect(mockCropApi.getById).toHaveBeenCalledWith('1');
    });

    it('não deve executar query quando ID está vazio', () => {
      renderHook(() => useCrop(''), {
        wrapper: createWrapper(),
      });

      expect(mockCropApi.getById).not.toHaveBeenCalled();
    });

    it('não deve executar query quando ID é undefined', () => {
      renderHook(() => useCrop(undefined as unknown as string), {
        wrapper: createWrapper(),
      });

      expect(mockCropApi.getById).not.toHaveBeenCalled();
    });
  });

  describe('useCreateCrop', () => {
    it('deve criar cultura com sucesso', async () => {
      const mockFormData: CropFormData = {
        name: 'Café',
      };

      const mockCrop: Crop = {
        id: '4',
        name: 'Café',
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04'),
      };

      mockCropApi.create.mockResolvedValue(mockCrop);

      const { result } = renderHook(() => useCreateCrop(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCrop);
      expect(mockCropApi.create).toHaveBeenCalledWith(mockFormData);
    });

    it('deve chamar onSuccess quando fornecido', async () => {
      const mockFormData: CropFormData = {
        name: 'Café',
      };

      const mockCrop: Crop = {
        id: '4',
        name: 'Café',
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04'),
      };

      const onSuccess = jest.fn();
      mockCropApi.create.mockResolvedValue(mockCrop);

      const { result } = renderHook(() => useCreateCrop({ onSuccess }), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onSuccess).toHaveBeenCalledWith(mockCrop);
    });

    it('deve chamar onError quando fornecido', async () => {
      const mockFormData: CropFormData = {
        name: 'Café',
      };

      const error = new Error('Erro ao criar cultura');
      const onError = jest.fn();
      mockCropApi.create.mockRejectedValue(error);

      const { result } = renderHook(() => useCreateCrop({ onError }), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(onError).toHaveBeenCalled();
    });

    it('deve invalidar queries após sucesso', async () => {
      const mockFormData: CropFormData = {
        name: 'Café',
      };

      const mockCrop: Crop = {
        id: '4',
        name: 'Café',
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04'),
      };

      mockCropApi.create.mockResolvedValue(mockCrop);

      const { result } = renderHook(() => useCreateCrop(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockCropApi.create).toHaveBeenCalledWith(mockFormData);
    });
  });

  describe('useUpdateCrop', () => {
    it('deve atualizar cultura com sucesso', async () => {
      const mockFormData: CropFormData = {
        name: 'Café Especial',
      };

      const mockCrop: Crop = {
        id: '4',
        name: 'Café Especial',
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-05'),
      };

      mockCropApi.update.mockResolvedValue(mockCrop);

      const { result } = renderHook(() => useUpdateCrop(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '4', data: mockFormData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCrop);
      expect(mockCropApi.update).toHaveBeenCalledWith('4', mockFormData);
    });

    it('deve chamar onSuccess quando fornecido', async () => {
      const mockFormData: CropFormData = {
        name: 'Café Especial',
      };

      const mockCrop: Crop = {
        id: '4',
        name: 'Café Especial',
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-05'),
      };

      const onSuccess = jest.fn();
      mockCropApi.update.mockResolvedValue(mockCrop);

      const { result } = renderHook(() => useUpdateCrop({ onSuccess }), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '4', data: mockFormData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onSuccess).toHaveBeenCalledWith(mockCrop);
    });

    it('deve chamar onError quando fornecido', async () => {
      const mockFormData: CropFormData = {
        name: 'Café Especial',
      };

      const error = new Error('Erro ao atualizar cultura');
      const onError = jest.fn();
      mockCropApi.update.mockRejectedValue(error);

      const { result } = renderHook(() => useUpdateCrop({ onError }), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '4', data: mockFormData });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(onError).toHaveBeenCalled();
    });

    it('deve invalidar queries após sucesso', async () => {
      const mockFormData: CropFormData = {
        name: 'Café Especial',
      };

      const mockCrop: Crop = {
        id: '4',
        name: 'Café Especial',
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-05'),
      };

      mockCropApi.update.mockResolvedValue(mockCrop);

      const { result } = renderHook(() => useUpdateCrop(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '4', data: mockFormData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockCropApi.update).toHaveBeenCalledWith('4', mockFormData);
    });
  });

  describe('useDeleteCrop', () => {
    it('deve deletar cultura com sucesso', async () => {
      mockCropApi.delete.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteCrop(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('4');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockCropApi.delete).toHaveBeenCalledWith('4');
    });

    it('deve chamar onSuccess quando fornecido', async () => {
      const onSuccess = jest.fn();
      mockCropApi.delete.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteCrop({ onSuccess }), {
        wrapper: createWrapper(),
      });

      result.current.mutate('4');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onSuccess).toHaveBeenCalled();
    });

    it('deve chamar onError quando fornecido', async () => {
      const error = new Error('Erro ao deletar cultura');
      const onError = jest.fn();
      mockCropApi.delete.mockRejectedValue(error);

      const { result } = renderHook(() => useDeleteCrop({ onError }), {
        wrapper: createWrapper(),
      });

      result.current.mutate('4');

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(onError).toHaveBeenCalled();
    });

    it('deve invalidar queries após sucesso', async () => {
      mockCropApi.delete.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteCrop(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('4');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockCropApi.delete).toHaveBeenCalledWith('4');
    });
  });

  describe('Estados de loading e error', () => {
    it('deve ter estado de loading inicial correto', () => {
      const { result } = renderHook(() => useCrops(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(false);
    });

    it('deve ter estado de loading inicial correto para mutations', () => {
      const { result } = renderHook(() => useCreateCrop(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(false);
    });

    it('deve ter estado de pending durante mutation', async () => {
      const mockFormData: CropFormData = {
        name: 'Café',
      };

      const mockCrop: Crop = {
        id: '4',
        name: 'Café',
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04'),
      };

      mockCropApi.create.mockResolvedValue(mockCrop);

      const { result } = renderHook(() => useCreateCrop(), {
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
    it('deve usar queryKey correta para useCrops', () => {
      renderHook(() => useCrops(), {
        wrapper: createWrapper(),
      });

      expect(mockCropApi.getAll).toHaveBeenCalledTimes(1);
    });

    it('deve usar queryKey correta para useCrop', () => {
      renderHook(() => useCrop('123'), {
        wrapper: createWrapper(),
      });

      expect(mockCropApi.getById).toHaveBeenCalledWith('123');
    });

    it('deve usar mutationFn correta para useCreateCrop', async () => {
      const mockFormData: CropFormData = {
        name: 'Café',
      };

      const mockCrop: Crop = {
        id: '4',
        name: 'Café',
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04'),
      };

      mockCropApi.create.mockResolvedValue(mockCrop);

      const { result } = renderHook(() => useCreateCrop(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockCropApi.create).toHaveBeenCalledWith(mockFormData);
    });

    it('deve usar mutationFn correta para useUpdateCrop', async () => {
      const mockFormData: CropFormData = {
        name: 'Café Especial',
      };

      const mockCrop: Crop = {
        id: '4',
        name: 'Café Especial',
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-05'),
      };

      mockCropApi.update.mockResolvedValue(mockCrop);

      const { result } = renderHook(() => useUpdateCrop(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '4', data: mockFormData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockCropApi.update).toHaveBeenCalledWith('4', mockFormData);
    });

    it('deve usar mutationFn correta para useDeleteCrop', async () => {
      mockCropApi.delete.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteCrop(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('4');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockCropApi.delete).toHaveBeenCalledWith('4');
    });
  });

  describe('Validação de parâmetros específicos', () => {
    it('deve usar enabled: false quando ID está vazio em useCrop', () => {
      const { result } = renderHook(() => useCrop(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
    });

    it('deve usar enabled: false quando ID é undefined em useCrop', () => {
      const { result } = renderHook(() => useCrop(undefined as unknown as string), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
    });

    it('deve usar enabled: true quando ID é válido em useCrop', () => {
      const { result } = renderHook(() => useCrop('valid-id'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('Callback functions', () => {
    it('deve chamar onSuccess com dados corretos em useCreateCrop', async () => {
      const mockFormData: CropFormData = {
        name: 'Café',
      };

      const mockCrop: Crop = {
        id: '4',
        name: 'Café',
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04'),
      };

      const onSuccess = jest.fn();
      mockCropApi.create.mockResolvedValue(mockCrop);

      const { result } = renderHook(() => useCreateCrop({ onSuccess }), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onSuccess).toHaveBeenCalledWith(mockCrop);
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onError com erro correto em useCreateCrop', async () => {
      const mockFormData: CropFormData = {
        name: 'Café',
      };

      const error = new Error('Erro específico');
      const onError = jest.fn();
      mockCropApi.create.mockRejectedValue(error);

      const { result } = renderHook(() => useCreateCrop({ onError }), {
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

  describe('Cenários específicos de cultura', () => {
    it('deve lidar com nomes de cultura com caracteres especiais', async () => {
      const mockFormData: CropFormData = {
        name: 'Café & Chá',
      };

      const mockCrop: Crop = {
        id: '5',
        name: 'Café & Chá',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
      };

      mockCropApi.create.mockResolvedValue(mockCrop);

      const { result } = renderHook(() => useCreateCrop(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.name).toBe('Café & Chá');
      expect(mockCropApi.create).toHaveBeenCalledWith({ name: 'Café & Chá' });
    });

    it('deve lidar com nomes de cultura longos', async () => {
      const mockFormData: CropFormData = {
        name: 'Cana de Açúcar para Produção de Etanol',
      };

      const mockCrop: Crop = {
        id: '6',
        name: 'Cana de Açúcar para Produção de Etanol',
        createdAt: new Date('2024-01-06'),
        updatedAt: new Date('2024-01-06'),
      };

      mockCropApi.create.mockResolvedValue(mockCrop);

      const { result } = renderHook(() => useCreateCrop(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.name).toBe('Cana de Açúcar para Produção de Etanol');
    });

    it('deve lidar com lista vazia de culturas', async () => {
      const mockCrops: Crop[] = [];

      mockCropApi.getAll.mockResolvedValue(mockCrops);

      const { result } = renderHook(() => useCrops(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
      expect(Array.isArray(result.current.data)).toBe(true);
    });

    it('deve lidar com atualização de cultura existente', async () => {
      const mockFormData: CropFormData = {
        name: 'Soja Transgênica',
      };

      const mockCrop: Crop = {
        id: '1',
        name: 'Soja Transgênica',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-07'),
      };

      mockCropApi.update.mockResolvedValue(mockCrop);

      const { result } = renderHook(() => useUpdateCrop(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '1', data: mockFormData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.name).toBe('Soja Transgênica');
      expect(result.current.data?.updatedAt).toEqual(new Date('2024-01-07'));
    });
  });
});
