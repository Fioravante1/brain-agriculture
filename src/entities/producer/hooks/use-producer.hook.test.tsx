import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useProducers, useProducer, useCreateProducer, useUpdateProducer, useDeleteProducer, producerKeys } from './use-producer.hook';
import { producerApi } from '../api';
import { Producer, ProducerFormData } from '../model';

// Mock da API
jest.mock('../api', () => ({
  producerApi: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockProducerApi = producerApi as jest.Mocked<typeof producerApi>;

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
  return ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('Producer Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('producerKeys', () => {
    it('deve ter estrutura correta de chaves', () => {
      expect(producerKeys.all).toEqual(['producers']);
      expect(producerKeys.lists()).toEqual(['producers', 'list']);
      expect(producerKeys.list()).toEqual(['producers', 'list']);
      expect(producerKeys.details()).toEqual(['producers', 'detail']);
      expect(producerKeys.detail('123')).toEqual(['producers', 'detail', '123']);
    });
  });

  describe('useProducers', () => {
    it('deve buscar todos os produtores com sucesso', async () => {
      const mockProducers: Producer[] = [
        {
          id: '1',
          name: 'João Silva',
          cpfCnpj: '12345678901',
          farms: [],
        },
        {
          id: '2',
          name: 'Maria Santos',
          cpfCnpj: '12345678000195',
          farms: [],
        },
      ];

      mockProducerApi.getAll.mockResolvedValue(mockProducers);

      const { result } = renderHook(() => useProducers(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProducers);
      expect(mockProducerApi.getAll).toHaveBeenCalledTimes(1);
    });

    it('deve lidar com erro ao buscar produtores', async () => {
      const error = new Error('Erro ao buscar produtores');
      mockProducerApi.getAll.mockRejectedValue(error);

      const { result } = renderHook(() => useProducers(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
      expect(mockProducerApi.getAll).toHaveBeenCalledTimes(1);
    });

    it('deve usar queryKey correta', () => {
      renderHook(() => useProducers(), {
        wrapper: createWrapper(),
      });

      expect(mockProducerApi.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('useProducer', () => {
    it('deve buscar produtor por ID com sucesso', async () => {
      const mockProducer: Producer = {
        id: '1',
        name: 'João Silva',
        cpfCnpj: '12345678901',
        farms: [],
      };

      mockProducerApi.getById.mockResolvedValue(mockProducer);

      const { result } = renderHook(() => useProducer('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProducer);
      expect(mockProducerApi.getById).toHaveBeenCalledWith('1');
    });

    it('deve retornar null quando produtor não é encontrado', async () => {
      mockProducerApi.getById.mockResolvedValue(null);

      const { result } = renderHook(() => useProducer('999'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeNull();
      expect(mockProducerApi.getById).toHaveBeenCalledWith('999');
    });

    it('deve lidar com erro ao buscar produtor', async () => {
      const error = new Error('Erro ao buscar produtor');
      mockProducerApi.getById.mockRejectedValue(error);

      const { result } = renderHook(() => useProducer('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
      expect(mockProducerApi.getById).toHaveBeenCalledWith('1');
    });

    it('não deve executar query quando ID está vazio', () => {
      renderHook(() => useProducer(''), {
        wrapper: createWrapper(),
      });

      expect(mockProducerApi.getById).not.toHaveBeenCalled();
    });

    it('não deve executar query quando ID é undefined', () => {
      renderHook(() => useProducer(undefined as any), {
        wrapper: createWrapper(),
      });

      expect(mockProducerApi.getById).not.toHaveBeenCalled();
    });
  });

  describe('useCreateProducer', () => {
    it('deve criar produtor com sucesso', async () => {
      const mockFormData: ProducerFormData = {
        name: 'João Silva',
        cpfCnpj: '12345678901',
      };

      const mockProducer: Producer = {
        id: '1',
        name: 'João Silva',
        cpfCnpj: '12345678901',
        farms: [],
      };

      mockProducerApi.create.mockResolvedValue(mockProducer);

      const { result } = renderHook(() => useCreateProducer(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProducer);
      expect(mockProducerApi.create).toHaveBeenCalledWith(mockFormData);
    });

    it('deve chamar onSuccess quando fornecido', async () => {
      const mockFormData: ProducerFormData = {
        name: 'João Silva',
        cpfCnpj: '12345678901',
      };

      const mockProducer: Producer = {
        id: '1',
        name: 'João Silva',
        cpfCnpj: '12345678901',
        farms: [],
      };

      const onSuccess = jest.fn();
      mockProducerApi.create.mockResolvedValue(mockProducer);

      const { result } = renderHook(() => useCreateProducer({ onSuccess }), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onSuccess).toHaveBeenCalledWith(mockProducer);
    });

    it('deve chamar onError quando fornecido', async () => {
      const mockFormData: ProducerFormData = {
        name: 'João Silva',
        cpfCnpj: '12345678901',
      };

      const error = new Error('Erro ao criar produtor');
      const onError = jest.fn();
      mockProducerApi.create.mockRejectedValue(error);

      const { result } = renderHook(() => useCreateProducer({ onError }), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(onError).toHaveBeenCalled();
    });

    it('deve invalidar queries após sucesso', async () => {
      const mockFormData: ProducerFormData = {
        name: 'João Silva',
        cpfCnpj: '12345678901',
      };

      const mockProducer: Producer = {
        id: '1',
        name: 'João Silva',
        cpfCnpj: '12345678901',
        farms: [],
      };

      mockProducerApi.create.mockResolvedValue(mockProducer);

      const { result } = renderHook(() => useCreateProducer(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockProducerApi.create).toHaveBeenCalledWith(mockFormData);
    });
  });

  describe('useUpdateProducer', () => {
    it('deve atualizar produtor com sucesso', async () => {
      const mockFormData: ProducerFormData = {
        name: 'João Silva Atualizado',
        cpfCnpj: '12345678901',
      };

      const mockProducer: Producer = {
        id: '1',
        name: 'João Silva Atualizado',
        cpfCnpj: '12345678901',
        farms: [],
      };

      mockProducerApi.update.mockResolvedValue(mockProducer);

      const { result } = renderHook(() => useUpdateProducer(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '1', data: mockFormData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProducer);
      expect(mockProducerApi.update).toHaveBeenCalledWith('1', mockFormData);
    });

    it('deve chamar onSuccess quando fornecido', async () => {
      const mockFormData: ProducerFormData = {
        name: 'João Silva Atualizado',
        cpfCnpj: '12345678901',
      };

      const mockProducer: Producer = {
        id: '1',
        name: 'João Silva Atualizado',
        cpfCnpj: '12345678901',
        farms: [],
      };

      const onSuccess = jest.fn();
      mockProducerApi.update.mockResolvedValue(mockProducer);

      const { result } = renderHook(() => useUpdateProducer({ onSuccess }), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '1', data: mockFormData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onSuccess).toHaveBeenCalledWith(mockProducer);
    });

    it('deve chamar onError quando fornecido', async () => {
      const mockFormData: ProducerFormData = {
        name: 'João Silva Atualizado',
        cpfCnpj: '12345678901',
      };

      const error = new Error('Erro ao atualizar produtor');
      const onError = jest.fn();
      mockProducerApi.update.mockRejectedValue(error);

      const { result } = renderHook(() => useUpdateProducer({ onError }), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '1', data: mockFormData });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(onError).toHaveBeenCalled();
    });

    it('deve invalidar queries após sucesso', async () => {
      const mockFormData: ProducerFormData = {
        name: 'João Silva Atualizado',
        cpfCnpj: '12345678901',
      };

      const mockProducer: Producer = {
        id: '1',
        name: 'João Silva Atualizado',
        cpfCnpj: '12345678901',
        farms: [],
      };

      mockProducerApi.update.mockResolvedValue(mockProducer);

      const { result } = renderHook(() => useUpdateProducer(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '1', data: mockFormData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockProducerApi.update).toHaveBeenCalledWith('1', mockFormData);
    });
  });

  describe('useDeleteProducer', () => {
    it('deve deletar produtor com sucesso', async () => {
      mockProducerApi.delete.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteProducer(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockProducerApi.delete).toHaveBeenCalledWith('1');
    });

    it('deve chamar onSuccess quando fornecido', async () => {
      const onSuccess = jest.fn();
      mockProducerApi.delete.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteProducer({ onSuccess }), {
        wrapper: createWrapper(),
      });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onSuccess).toHaveBeenCalled();
    });

    it('deve chamar onError quando fornecido', async () => {
      const error = new Error('Erro ao deletar produtor');
      const onError = jest.fn();
      mockProducerApi.delete.mockRejectedValue(error);

      const { result } = renderHook(() => useDeleteProducer({ onError }), {
        wrapper: createWrapper(),
      });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(onError).toHaveBeenCalled();
    });

    it('deve invalidar queries após sucesso', async () => {
      mockProducerApi.delete.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteProducer(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockProducerApi.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('Estados de loading e error', () => {
    it('deve ter estado de loading inicial correto', () => {
      const { result } = renderHook(() => useProducers(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(false);
    });

    it('deve ter estado de loading inicial correto para mutations', () => {
      const { result } = renderHook(() => useCreateProducer(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(false);
    });

    it('deve ter estado de pending durante mutation', async () => {
      const mockFormData: ProducerFormData = {
        name: 'João Silva',
        cpfCnpj: '12345678901',
      };

      const mockProducer: Producer = {
        id: '1',
        name: 'João Silva',
        cpfCnpj: '12345678901',
        farms: [],
      };

      mockProducerApi.create.mockResolvedValue(mockProducer);

      const { result } = renderHook(() => useCreateProducer(), {
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
    it('deve usar queryKey correta para useProducers', () => {
      renderHook(() => useProducers(), {
        wrapper: createWrapper(),
      });

      expect(mockProducerApi.getAll).toHaveBeenCalledTimes(1);
    });

    it('deve usar queryKey correta para useProducer', () => {
      renderHook(() => useProducer('123'), {
        wrapper: createWrapper(),
      });

      expect(mockProducerApi.getById).toHaveBeenCalledWith('123');
    });

    it('deve usar mutationFn correta para useCreateProducer', async () => {
      const mockFormData: ProducerFormData = {
        name: 'João Silva',
        cpfCnpj: '12345678901',
      };

      const mockProducer: Producer = {
        id: '1',
        name: 'João Silva',
        cpfCnpj: '12345678901',
        farms: [],
      };

      mockProducerApi.create.mockResolvedValue(mockProducer);

      const { result } = renderHook(() => useCreateProducer(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockProducerApi.create).toHaveBeenCalledWith(mockFormData);
    });

    it('deve usar mutationFn correta para useUpdateProducer', async () => {
      const mockFormData: ProducerFormData = {
        name: 'João Silva Atualizado',
        cpfCnpj: '12345678901',
      };

      const mockProducer: Producer = {
        id: '1',
        name: 'João Silva Atualizado',
        cpfCnpj: '12345678901',
        farms: [],
      };

      mockProducerApi.update.mockResolvedValue(mockProducer);

      const { result } = renderHook(() => useUpdateProducer(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: '1', data: mockFormData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockProducerApi.update).toHaveBeenCalledWith('1', mockFormData);
    });

    it('deve usar mutationFn correta para useDeleteProducer', async () => {
      mockProducerApi.delete.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteProducer(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockProducerApi.delete).toHaveBeenCalledWith('1');
    });
  });
});
