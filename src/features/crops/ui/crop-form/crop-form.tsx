'use client';

import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cropFormSchema, CropFormValues } from './crop-form.schema';
import { Input, Button } from '@/shared/ui';

export interface CropFormProps {
  defaultValues?: Partial<CropFormValues>;
  onSubmit: (data: CropFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export function CropForm({ defaultValues, onSubmit, onCancel, isLoading = false }: CropFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CropFormValues>({
    resolver: zodResolver(cropFormSchema),
    defaultValues: {
      name: '',
      ...defaultValues,
    },
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label='Nome da Cultura *'
        placeholder='Digite o nome da cultura (ex: Soja, Milho, Algodão)'
        {...register('name')}
        error={errors.name?.message}
        fullWidth
        disabled={isLoading}
      />

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
