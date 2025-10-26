import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { farmCropApi } from '../api';
import { FarmCrop, FarmCropFormData } from '../model';

/**
 * Query keys para React Query
 */
export const farmCropKeys = {
  all: ['farm-crops'] as const,
  lists: () => [...farmCropKeys.all, 'list'] as const,
  list: () => [...farmCropKeys.lists()] as const,
  details: () => [...farmCropKeys.all, 'detail'] as const,
  detail: (id: string) => [...farmCropKeys.details(), id] as const,
};

/**
 * Hook para listar todas as associações
 */
export function useFarmCrops() {
  return useQuery({
    queryKey: farmCropKeys.list(),
    queryFn: () => farmCropApi.getAll(),
  });
}

/**
 * Hook para buscar associação por ID
 */
export function useFarmCrop(id: string) {
  return useQuery({
    queryKey: farmCropKeys.detail(id),
    queryFn: () => farmCropApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook para criar associação
 */
export interface UseCreateFarmCropOptions {
  onSuccess?: (data: FarmCrop) => void;
  onError?: (error: Error) => void;
}

export function useCreateFarmCrop(options?: UseCreateFarmCropOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FarmCropFormData) => farmCropApi.create(data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: farmCropKeys.lists() });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook para deletar associação
 */
export interface UseDeleteFarmCropOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useDeleteFarmCrop(options?: UseDeleteFarmCropOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => farmCropApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: farmCropKeys.lists() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}
