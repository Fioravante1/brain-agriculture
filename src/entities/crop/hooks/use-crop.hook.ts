import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cropApi } from '../api';
import { Crop, CropFormData } from '../model';

/**
 * Query keys para React Query
 */
export const cropKeys = {
  all: ['crops'] as const,
  lists: () => [...cropKeys.all, 'list'] as const,
  list: () => [...cropKeys.lists()] as const,
  details: () => [...cropKeys.all, 'detail'] as const,
  detail: (id: string) => [...cropKeys.details(), id] as const,
};

/**
 * Hook para listar todas as culturas
 */
export function useCrops() {
  return useQuery({
    queryKey: cropKeys.list(),
    queryFn: () => cropApi.getAll(),
  });
}

/**
 * Hook para buscar cultura por ID
 */
export function useCrop(id: string) {
  return useQuery({
    queryKey: cropKeys.detail(id),
    queryFn: () => cropApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook para criar cultura
 */
export interface UseCreateCropOptions {
  onSuccess?: (data: Crop) => void;
  onError?: (error: Error) => void;
}

export function useCreateCrop(options?: UseCreateCropOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CropFormData) => cropApi.create(data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: cropKeys.lists() });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook para atualizar cultura
 */
export interface UseUpdateCropOptions {
  onSuccess?: (data: Crop) => void;
  onError?: (error: Error) => void;
}

export function useUpdateCrop(options?: UseUpdateCropOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CropFormData }) => cropApi.update(id, data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: cropKeys.lists() });
      queryClient.invalidateQueries({ queryKey: cropKeys.detail(data.id) });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook para deletar cultura
 */
export interface UseDeleteCropOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useDeleteCrop(options?: UseDeleteCropOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cropApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cropKeys.lists() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}
