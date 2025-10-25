'use client';

import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { farmFormSchema, FarmFormValues } from './farm-form.schema';
import { Input, Button, Select } from '@/shared/ui';
import { useProducers } from '@/entities/producer';

export interface FarmFormProps {
  defaultValues?: Partial<FarmFormValues>;
  onSubmit: (data: FarmFormValues) => void;
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

export function FarmForm({ defaultValues, onSubmit, onCancel, isLoading = false }: FarmFormProps) {
  const { data: producers, isLoading: isLoadingProducers } = useProducers();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FarmFormValues>({
    resolver: zodResolver(farmFormSchema),
    defaultValues: {
      producerId: '',
      name: '',
      city: '',
      state: '',
      totalArea: 0,
      arableArea: 0,
      vegetationArea: 0,
      ...defaultValues,
    },
  });

  const totalArea = watch('totalArea') || 0;
  const arableArea = watch('arableArea') || 0;
  const vegetationArea = watch('vegetationArea') || 0;

  const remainingArea = totalArea - (arableArea + vegetationArea);

  const producerOptions =
    producers?.map(producer => ({
      value: producer.id,
      label: producer.name,
    })) || [];

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Select label='Produtor *' options={producerOptions} {...register('producerId')} error={errors.producerId?.message} disabled={isLoading || isLoadingProducers} fullWidth />

      <Input label='Nome da Fazenda *' placeholder='Digite o nome da fazenda' {...register('name')} error={errors.name?.message} fullWidth disabled={isLoading} />

      <FormRow>
        <Input label='Cidade *' placeholder='Digite a cidade' {...register('city')} error={errors.city?.message} fullWidth disabled={isLoading} />

        <Input label='Estado *' placeholder='Digite o estado (ex: SP, MG, MT)' {...register('state')} error={errors.state?.message} fullWidth disabled={isLoading} />
      </FormRow>

      <FormRow>
        <Input
          label='Área Total (hectares) *'
          type='number'
          step='0.01'
          min='0'
          placeholder='0.00'
          {...register('totalArea', { valueAsNumber: true })}
          error={errors.totalArea?.message}
          fullWidth
          disabled={isLoading}
        />

        <div>
          <Input
            label='Área Agricultável (hectares) *'
            type='number'
            step='0.01'
            min='0'
            placeholder='0.00'
            {...register('arableArea', { valueAsNumber: true })}
            error={errors.arableArea?.message}
            fullWidth
            disabled={isLoading}
          />
          {remainingArea < 0 && <div style={{ color: '#D32F2F', fontSize: '12px', marginTop: '4px' }}>⚠️ Área excede o total disponível</div>}
        </div>
      </FormRow>

      <Input
        label='Área de Vegetação (hectares) *'
        type='number'
        step='0.01'
        min='0'
        placeholder='0.00'
        {...register('vegetationArea', { valueAsNumber: true })}
        error={errors.vegetationArea?.message}
        fullWidth
        disabled={isLoading}
      />

      {remainingArea > 0 && (
        <div
          style={{
            color: '#757575',
            fontSize: '14px',
            padding: '8px 12px',
            backgroundColor: '#F5F5F5',
            borderRadius: '8px',
            border: '1px solid #E0E0E0',
          }}
        >
          📊 Área restante: {remainingArea.toFixed(2)} hectares
        </div>
      )}

      <FormActions>
        <Button type='button' variant='outline' onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type='submit' disabled={isLoading || remainingArea < 0}>
          {isLoading ? 'Salvando...' : 'Salvar'}
        </Button>
      </FormActions>
    </Form>
  );
}
