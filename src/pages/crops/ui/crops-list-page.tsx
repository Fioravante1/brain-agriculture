'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCrops, useDeleteCrop, useCreateCrop, useUpdateCrop, Crop } from '@/entities/crop';
import { Card, Button, Table, Modal } from '@/shared/ui';
import { CropForm, CropFormValues } from '@/features/crops';

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

export function CropsListPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const router = useRouter();

  const { data: crops, isLoading } = useCrops();
  const createCrop = useCreateCrop({
    onSuccess: () => {
      setIsModalOpen(false);
      setEditingCrop(null);
    },
  });
  const updateCrop = useUpdateCrop({
    onSuccess: () => {
      setIsModalOpen(false);
      setEditingCrop(null);
    },
  });
  const deleteCrop = useDeleteCrop();

  const handleOpenCreateModal = () => {
    setEditingCrop(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (crop: Crop) => {
    setEditingCrop(crop);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCrop(null);
  };

  const handleSubmit = (data: CropFormValues) => {
    if (editingCrop) {
      updateCrop.mutate({ id: editingCrop.id, data });
    } else {
      createCrop.mutate(data);
    }
  };

  const handleDelete = (crop: Crop) => {
    if (confirm(`Tem certeza que deseja excluir a cultura "${crop.name}"?`)) {
      deleteCrop.mutate(crop.id);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Nome da Cultura',
      width: '80%',
    },
    {
      key: 'actions',
      header: 'Ações',
      width: '20%',
      render: (crop: Crop) => (
        <ActionsCell>
          <Button variant='outline' size='sm' onClick={() => handleOpenEditModal(crop)}>
            Editar
          </Button>
          <Button variant='danger' size='sm' onClick={() => handleDelete(crop)}>
            Excluir
          </Button>
        </ActionsCell>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader>
        <Title>Culturas</Title>
        <Subtitle>Gerencie as culturas cadastradas no sistema</Subtitle>

        <Actions>
          <Button onClick={handleOpenCreateModal}>+ Nova Cultura</Button>
          <Button variant='outline' onClick={() => router.push('/dashboard')}>
            Ver Dashboard
          </Button>
          <Button variant='outline' onClick={() => router.push('/producers')}>
            Ver Produtores
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
        <Table data={crops || []} columns={columns} loading={isLoading} emptyMessage='Nenhuma cultura cadastrada' />
      </Card>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingCrop ? 'Editar Cultura' : 'Nova Cultura'} size='md'>
        <CropForm
          defaultValues={editingCrop ? { name: editingCrop.name } : undefined}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={createCrop.isPending || updateCrop.isPending}
        />
      </Modal>
    </PageContainer>
  );
}
