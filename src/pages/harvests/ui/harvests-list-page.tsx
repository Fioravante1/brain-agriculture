'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHarvests, useDeleteHarvest, useCreateHarvest, useUpdateHarvest, Harvest } from '@/entities/harvest';
import { Card, Button, Table, Modal } from '@/shared/ui';
import { HarvestForm, HarvestFormValues } from '@/features/harvests';

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

export function HarvestsListPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHarvest, setEditingHarvest] = useState<Harvest | null>(null);
  const router = useRouter();

  const { data: harvests, isLoading } = useHarvests();
  const createHarvest = useCreateHarvest({
    onSuccess: () => {
      setIsModalOpen(false);
      setEditingHarvest(null);
    },
  });
  const updateHarvest = useUpdateHarvest({
    onSuccess: () => {
      setIsModalOpen(false);
      setEditingHarvest(null);
    },
  });
  const deleteHarvest = useDeleteHarvest();

  const handleOpenCreateModal = () => {
    setEditingHarvest(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (harvest: Harvest) => {
    setEditingHarvest(harvest);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingHarvest(null);
  };

  const handleSubmit = (data: HarvestFormValues) => {
    if (editingHarvest) {
      updateHarvest.mutate({ id: editingHarvest.id, data });
    } else {
      createHarvest.mutate(data);
    }
  };

  const handleDelete = (harvest: Harvest) => {
    if (confirm(`Tem certeza que deseja excluir a safra "${harvest.name}"?`)) {
      deleteHarvest.mutate(harvest.id);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Nome da Safra',
      width: '40%',
    },
    {
      key: 'year',
      header: 'Ano',
      width: '20%',
      render: (harvest: Harvest) => harvest.year.toString(),
    },
    {
      key: 'createdAt',
      header: 'Criada em',
      width: '20%',
      render: (harvest: Harvest) => new Date(harvest.createdAt).toLocaleDateString('pt-BR'),
    },
    {
      key: 'actions',
      header: 'Ações',
      width: '20%',
      render: (harvest: Harvest) => (
        <ActionsCell>
          <Button variant='outline' size='sm' onClick={() => handleOpenEditModal(harvest)}>
            Editar
          </Button>
          <Button variant='danger' size='sm' onClick={() => handleDelete(harvest)}>
            Excluir
          </Button>
        </ActionsCell>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader>
        <Title>Safras</Title>
        <Subtitle>Gerencie as safras cadastradas no sistema</Subtitle>

        <Actions>
          <Button onClick={handleOpenCreateModal}>+ Nova Safra</Button>
          <Button variant='outline' onClick={() => router.push('/dashboard')}>
            Ver Dashboard
          </Button>
          <Button variant='outline' onClick={() => router.push('/producers')}>
            Ver Produtores
          </Button>
          <Button variant='outline' onClick={() => router.push('/farms')}>
            Ver Fazendas
          </Button>
          <Button variant='outline' onClick={() => router.push('/farm-crops')}>
            Ver Associações
          </Button>
        </Actions>
      </PageHeader>

      <Card padding='lg'>
        <Table data={harvests || []} columns={columns} loading={isLoading} emptyMessage='Nenhuma safra cadastrada' />
      </Card>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingHarvest ? 'Editar Safra' : 'Nova Safra'} size='md'>
        <HarvestForm
          defaultValues={editingHarvest ? { name: editingHarvest.name, year: editingHarvest.year } : undefined}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={createHarvest.isPending || updateHarvest.isPending}
        />
      </Modal>
    </PageContainer>
  );
}
