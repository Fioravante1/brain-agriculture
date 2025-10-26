'use client';

import styled from 'styled-components';
import { Card, Button, Table, Modal } from '@/shared/ui';
import { CropForm, useCropsListPage } from '@/features/crops';
import { CROPS_TABLE_COLUMNS } from '@/features/crops/config/crops-table-columns';

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
  const {
    crops,
    isLoading,
    isModalOpen,
    editingCrop,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSubmit,
    handleDelete,
    handleNavigateToDashboard,
    handleNavigateToProducers,
    handleNavigateToHarvests,
    handleNavigateToFarmCrops,
    createCrop,
    updateCrop,
  } = useCropsListPage();

  const columns = [
    ...CROPS_TABLE_COLUMNS.slice(0, -1),
    {
      key: 'actions',
      header: 'Ações',
      width: '20%',
      render: (crop: any) => (
        <ActionsCell>
          <Button variant='outline' size='sm' onClick={() => handleOpenEditModal(crop)}>
            Editar
          </Button>
          <Button variant='danger' size='sm' onClick={() => handleDelete(crop.id)}>
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
          <Button variant='outline' onClick={handleNavigateToDashboard}>
            Ver Dashboard
          </Button>
          <Button variant='outline' onClick={handleNavigateToProducers}>
            Ver Produtores
          </Button>
          <Button variant='outline' onClick={handleNavigateToHarvests}>
            Ver Safras
          </Button>
          <Button variant='outline' onClick={handleNavigateToFarmCrops}>
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
