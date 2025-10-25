import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { harvestApi } from '../api';
import { Harvest, HarvestFormData } from '../model';

/**
 * Query keys para React Query
 */
export const harvestKeys = {
  all: ['harvests'] as const,
  lists: () => [...harvestKeys.all, 'list'] as const,
  list: () => [...harvestKeys.lists()] as const,
  details: () => [...harvestKeys.all, 'detail'] as const,
  detail: (id: string) => [...harvestKeys.details(), id] as const,
};

/**
 * Hook para listar todas as safras
 */
export function useHarvests() {
  return useQuery({
    queryKey: harvestKeys.list(),
    queryFn: () => harvestApi.getAll(),
  });
}

/**
 * Hook para buscar safra por ID
 */
export function useHarvest(id: string) {
  return useQuery({
    queryKey: harvestKeys.detail(id),
    queryFn: () => harvestApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook para criar safra
 */
export interface UseCreateHarvestOptions {
  onSuccess?: (data: Harvest) => void;
  onError?: (error: Error) => void;
}

export function useCreateHarvest(options?: UseCreateHarvestOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: HarvestFormData) => harvestApi.create(data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: harvestKeys.lists() });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook para atualizar safra
 */
export interface UseUpdateHarvestOptions {
  onSuccess?: (data: Harvest) => void;
  onError?: (error: Error) => void;
}

export function useUpdateHarvest(options?: UseUpdateHarvestOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: HarvestFormData }) => harvestApi.update(id, data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: harvestKeys.lists() });
      queryClient.invalidateQueries({ queryKey: harvestKeys.detail(data.id) });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook para deletar safra
 */
export interface UseDeleteHarvestOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useDeleteHarvest(options?: UseDeleteHarvestOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => harvestApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: harvestKeys.lists() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}
