'use client';

import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { harvestFormSchema, HarvestFormValues } from './harvest-form.schema';
import { Input, Button } from '@/shared/ui';

export interface HarvestFormProps {
  defaultValues?: Partial<HarvestFormValues>;
  onSubmit: (data: HarvestFormValues) => void;
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

export function HarvestForm({ defaultValues, onSubmit, onCancel, isLoading = false }: HarvestFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HarvestFormValues>({
    resolver: zodResolver(harvestFormSchema),
    defaultValues: {
      name: '',
      year: new Date().getFullYear(),
      ...defaultValues,
    },
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Input label='Nome da Safra *' placeholder='Digite o nome da safra (ex: Safra 2024/2025)' {...register('name')} error={errors.name?.message} fullWidth disabled={isLoading} />

      <FormRow>
        <Input
          label='Ano da Safra *'
          type='number'
          min='2000'
          max='2100'
          placeholder='2024'
          {...register('year', { valueAsNumber: true })}
          error={errors.year?.message}
          fullWidth
          disabled={isLoading}
        />
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
