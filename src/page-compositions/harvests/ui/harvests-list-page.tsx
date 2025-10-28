'use client';

import styled from 'styled-components';
import { Card, Button, Table, Modal } from '@/shared/ui';
import { HarvestForm, useHarvestsListPage } from '@/features/harvests';
import { HARVESTS_TABLE_COLUMNS } from '@/features/harvests/config/harvests-table-columns';
import { Harvest } from '@/entities/harvest';

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
  const {
    harvests,
    isLoading,
    isModalOpen,
    editingHarvest,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSubmit,
    handleDelete,
    handleNavigateToDashboard,
    handleNavigateToProducers,
    handleNavigateToFarms,
    handleNavigateToFarmCrops,
    createHarvest,
    updateHarvest,
  } = useHarvestsListPage();

  const columns = [
    ...HARVESTS_TABLE_COLUMNS.slice(0, -1),
    {
      key: 'actions',
      header: 'Ações',
      width: '20%',
      render: (harvest: Harvest) => (
        <ActionsCell>
          <Button variant='outline' size='sm' onClick={() => handleOpenEditModal(harvest)}>
            Editar
          </Button>
          <Button variant='danger' size='sm' onClick={() => handleDelete(harvest.id)}>
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
          <Button variant='outline' onClick={handleNavigateToDashboard}>
            Ver Dashboard
          </Button>
          <Button variant='outline' onClick={handleNavigateToProducers}>
            Ver Produtores
          </Button>
          <Button variant='outline' onClick={handleNavigateToFarms}>
            Ver Fazendas
          </Button>
          <Button variant='outline' onClick={handleNavigateToFarmCrops}>
            Ver Associações
          </Button>
        </Actions>
      </PageHeader>

      <Card padding='lg'>
        <Table data={harvests || []} columns={columns} loading={isLoading} emptyMessage='Nenhuma safra cadastrada' />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingHarvest ? 'Editar Safra' : 'Nova Safra'}
        size='md'
      >
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
