'use client';

import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { farmCropFormSchema, FarmCropFormValues } from './farm-crop-form.schema';
import { Button, Select } from '@/shared/ui';
import { useFarms } from '@/entities/farm';
import { useCrops } from '@/entities/crop';
import { useHarvests } from '@/entities/harvest';

export interface FarmCropFormProps {
  defaultValues?: Partial<FarmCropFormValues>;
  onSubmit: (data: FarmCropFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export function FarmCropForm({ defaultValues, onSubmit, onCancel, isLoading = false }: FarmCropFormProps) {
  const { data: farms, isLoading: isLoadingFarms } = useFarms();
  const { data: crops, isLoading: isLoadingCrops } = useCrops();
  const { data: harvests, isLoading: isLoadingHarvests } = useHarvests();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FarmCropFormValues>({
    resolver: zodResolver(farmCropFormSchema),
    defaultValues: {
      farmId: '',
      cropId: '',
      harvestId: '',
      ...defaultValues,
    },
  });

  const farmOptions =
    farms?.map(farm => ({
      value: farm.id,
      label: `${farm.name} - ${farm.producer.name}`,
    })) || [];

  const cropOptions =
    crops?.map(crop => ({
      value: crop.id,
      label: crop.name,
    })) || [];

  const harvestOptions =
    harvests?.map(harvest => ({
      value: harvest.id,
      label: `${harvest.name} (${harvest.year})`,
    })) || [];

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Select label='Fazenda *' options={farmOptions} {...register('farmId')} error={errors.farmId?.message} disabled={isLoading || isLoadingFarms} fullWidth />

      <FormRow>
        <Select label='Cultura *' options={cropOptions} {...register('cropId')} error={errors.cropId?.message} disabled={isLoading || isLoadingCrops} fullWidth />

        <Select label='Safra *' options={harvestOptions} {...register('harvestId')} error={errors.harvestId?.message} disabled={isLoading || isLoadingHarvests} fullWidth />
      </FormRow>

      <FormActions>
        <Button type='button' variant='outline' onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type='submit' disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar'}
        </Button>
      </FormActions>
    </Form>
  );
}
