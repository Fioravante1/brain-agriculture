'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProducers, useDeleteProducer, useCreateProducer, useUpdateProducer, Producer } from '@/entities/producer';
import { Card, Button, Table, Modal } from '@/shared/ui';
import { formatCPFOrCNPJ } from '@/shared/lib/utils';
import { ProducerForm, ProducerFormValues } from '@/features/producers';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.background};
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ActionsCell = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export function ProducersListPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProducer, setEditingProducer] = useState<Producer | null>(null);
  const router = useRouter();

  const { data: producers, isLoading } = useProducers();

  const createProducer = useCreateProducer({
    onSuccess: () => {
      alert('Produtor criado com sucesso!');
      setIsModalOpen(false);
    },
    onError: error => {
      alert(`Erro ao criar produtor: ${error.message}`);
    },
  });

  const updateProducer = useUpdateProducer({
    onSuccess: () => {
      alert('Produtor atualizado com sucesso!');
      setIsModalOpen(false);
      setEditingProducer(null);
    },
    onError: error => {
      alert(`Erro ao atualizar produtor: ${error.message}`);
    },
  });

  const deleteProducer = useDeleteProducer({
    onSuccess: () => {
      alert('Produtor excluído com sucesso!');
    },
    onError: error => {
      alert(`Erro ao excluir produtor: ${error.message}`);
    },
  });

  const handleOpenCreateModal = () => {
    setEditingProducer(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (producer: Producer) => {
    setEditingProducer(producer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProducer(null);
  };

  const handleSubmit = (data: ProducerFormValues) => {
    if (editingProducer) {
      updateProducer.mutate({ id: editingProducer.id, data });
    } else {
      createProducer.mutate(data);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produtor?')) {
      deleteProducer.mutate(id);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Nome',
      width: '30%',
    },
    {
      key: 'cpfCnpj',
      header: 'CPF/CNPJ',
      width: '20%',
      render: (producer: Producer) => formatCPFOrCNPJ(producer.cpfCnpj),
    },
    {
      key: 'farms',
      header: 'Nº de Fazendas',
      width: '20%',
      render: (producer: Producer) => producer.farms.length,
    },
    {
      key: 'totalArea',
      header: 'Área Total (ha)',
      width: '15%',
      render: (producer: Producer) => {
        const total = producer.farms.reduce((sum, farm) => sum + farm.totalArea, 0);
        return total.toLocaleString('pt-BR');
      },
    },
    {
      key: 'actions',
      header: 'Ações',
      width: '15%',
      render: (producer: Producer) => (
        <ActionsCell>
          <Button size='sm' variant='outline' onClick={() => handleOpenEditModal(producer)}>
            Editar
          </Button>
          <Button size='sm' variant='danger' onClick={() => handleDelete(producer.id)} disabled={deleteProducer.isPending}>
            Excluir
          </Button>
        </ActionsCell>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader>
        <Title>Produtores Rurais</Title>
        <Subtitle>Gerencie os produtores cadastrados no sistema</Subtitle>

        <Actions>
          <Button onClick={handleOpenCreateModal}>+ Novo Produtor</Button>
          <Button variant='outline' onClick={() => router.push('/dashboard')}>
            Ver Dashboard
          </Button>
          <Button variant='outline' onClick={() => router.push('/farms')}>
            Ver Fazendas
          </Button>
          <Button variant='outline' onClick={() => router.push('/crops')}>
            Ver Culturas
          </Button>
          <Button variant='outline' onClick={() => router.push('/harvests')}>
            Ver Safras
          </Button>
          <Button variant='outline' onClick={() => router.push('/farm-crops')}>
            Ver Associações
          </Button>
        </Actions>
      </PageHeader>

      <Card padding='lg'>
        <Table data={producers || []} columns={columns} loading={isLoading} emptyMessage='Nenhum produtor cadastrado' />
      </Card>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingProducer ? 'Editar Produtor' : 'Novo Produtor'}>
        <ProducerForm
          defaultValues={editingProducer ? { cpfCnpj: editingProducer.cpfCnpj, name: editingProducer.name } : undefined}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={createProducer.isPending || updateProducer.isPending}
        />
      </Modal>
    </PageContainer>
  );
}
