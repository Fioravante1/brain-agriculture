import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { farmApi } from '../api';
import { Farm, FarmFormData } from '../model';

/**
 * Query keys para React Query
 */
export const farmKeys = {
  all: ['farms'] as const,
  lists: () => [...farmKeys.all, 'list'] as const,
  list: (producerId?: string) => [...farmKeys.lists(), { producerId }] as const,
  details: () => [...farmKeys.all, 'detail'] as const,
  detail: (id: string) => [...farmKeys.details(), id] as const,
};

/**
 * Hook para listar todas as fazendas
 */
export function useFarms(producerId?: string) {
  return useQuery({
    queryKey: farmKeys.list(producerId),
    queryFn: () => farmApi.getAll(producerId),
  });
}

/**
 * Hook para buscar fazenda por ID
 */
export function useFarm(id: string) {
  return useQuery({
    queryKey: farmKeys.detail(id),
    queryFn: () => farmApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook para criar fazenda
 */
export interface UseCreateFarmOptions {
  onSuccess?: (data: Farm) => void;
  onError?: (error: Error) => void;
}

export function useCreateFarm(options?: UseCreateFarmOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FarmFormData) => farmApi.create(data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: farmKeys.lists() });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook para atualizar fazenda
 */
export interface UseUpdateFarmOptions {
  onSuccess?: (data: Farm) => void;
  onError?: (error: Error) => void;
}

export function useUpdateFarm(options?: UseUpdateFarmOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FarmFormData }) => farmApi.update(id, data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: farmKeys.lists() });
      queryClient.invalidateQueries({ queryKey: farmKeys.detail(data.id) });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook para deletar fazenda
 */
export interface UseDeleteFarmOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useDeleteFarm(options?: UseDeleteFarmOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => farmApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: farmKeys.lists() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}
