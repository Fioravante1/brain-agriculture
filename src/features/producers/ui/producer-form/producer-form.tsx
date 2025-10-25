'use client';

import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { producerFormSchema, ProducerFormValues } from './producer-form.schema';
import { Input, Button } from '@/shared/ui';
import { maskCPFOrCNPJ } from '@/shared/lib/utils';

export interface ProducerFormProps {
  defaultValues?: Partial<ProducerFormValues>;
  onSubmit: (data: ProducerFormValues) => void;
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

export function ProducerForm({ defaultValues, onSubmit, onCancel, isLoading = false }: ProducerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProducerFormValues>({
    resolver: zodResolver(producerFormSchema),
    defaultValues: {
      cpfCnpj: '',
      name: '',
      ...defaultValues,
    },
  });

  const cpfCnpj = watch('cpfCnpj') || '';

  const handleCPFCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCPFOrCNPJ(e.target.value);
    setValue('cpfCnpj', masked);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="CPF/CNPJ *"
        placeholder="000.000.000-00 ou 00.000.000/0000-00"
        {...register('cpfCnpj')}
        onChange={handleCPFCNPJChange}
        value={cpfCnpj}
        error={errors.cpfCnpj?.message}
        fullWidth
        disabled={isLoading}
      />

      <Input
        label="Nome do Produtor *"
        placeholder="Digite o nome do produtor"
        {...register('name')}
        error={errors.name?.message}
        fullWidth
        disabled={isLoading}
      />

      <FormActions>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar'}
        </Button>
      </FormActions>
    </Form>
  );
}
