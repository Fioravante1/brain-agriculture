import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { producerApi } from '../api';
import { Producer, ProducerFormData } from '../model';

/**
 * Query keys para React Query
 */
export const producerKeys = {
  all: ['producers'] as const,
  lists: () => [...producerKeys.all, 'list'] as const,
  list: () => [...producerKeys.lists()] as const,
  details: () => [...producerKeys.all, 'detail'] as const,
  detail: (id: string) => [...producerKeys.details(), id] as const,
};

/**
 * Hook para listar todos os produtores
 */
export function useProducers() {
  return useQuery({
    queryKey: producerKeys.list(),
    queryFn: () => producerApi.getAll(),
  });
}

/**
 * Hook para buscar produtor por ID
 */
export function useProducer(id: string) {
  return useQuery({
    queryKey: producerKeys.detail(id),
    queryFn: () => producerApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook para criar produtor
 */
export interface UseCreateProducerOptions {
  onSuccess?: (data: Producer) => void;
  onError?: (error: Error) => void;
}

export function useCreateProducer(options?: UseCreateProducerOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProducerFormData) => producerApi.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: producerKeys.lists() });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook para atualizar produtor
 */
export interface UseUpdateProducerOptions {
  onSuccess?: (data: Producer) => void;
  onError?: (error: Error) => void;
}

export function useUpdateProducer(options?: UseUpdateProducerOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProducerFormData }) => producerApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: producerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: producerKeys.detail(data.id) });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook para deletar produtor
 */
export interface UseDeleteProducerOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useDeleteProducer(options?: UseDeleteProducerOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => producerApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: producerKeys.lists() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}
