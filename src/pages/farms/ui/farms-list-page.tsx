'use client';

import styled from 'styled-components';
import { Card, Button, Table, Modal } from '@/shared/ui';
import { FarmForm, useFarmsListPage } from '@/features/farms';
import { FARMS_TABLE_COLUMNS } from '@/features/farms/config/farms-table-columns';
import { Farm } from '@/entities/farm';

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

export function FarmsListPage() {
  const {
    farms,
    isLoading,
    isModalOpen,
    editingFarm,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSubmit,
    handleDelete,
    handleNavigateToDashboard,
    handleNavigateToProducers,
    handleNavigateToCrops,
    handleNavigateToHarvests,
    handleNavigateToFarmCrops,
    createFarm,
    updateFarm,
  } = useFarmsListPage();

  const columns = [
    ...FARMS_TABLE_COLUMNS.slice(0, -1),
    {
      key: 'actions',
      header: 'Ações',
      width: '4%',
      render: (farm: Farm) => (
        <ActionsCell>
          <Button variant='outline' size='sm' onClick={() => handleOpenEditModal(farm)}>
            Editar
          </Button>
          <Button variant='danger' size='sm' onClick={() => handleDelete(farm)}>
            Excluir
          </Button>
        </ActionsCell>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader>
        <Title>Fazendas</Title>
        <Subtitle>Gerencie as fazendas cadastradas no sistema</Subtitle>

        <Actions>
          <Button onClick={handleOpenCreateModal}>+ Nova Fazenda</Button>
          <Button variant='outline' onClick={handleNavigateToDashboard}>
            Ver Dashboard
          </Button>
          <Button variant='outline' onClick={handleNavigateToProducers}>
            Ver Produtores
          </Button>
          <Button variant='outline' onClick={handleNavigateToCrops}>
            Ver Culturas
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
        <Table data={farms || []} columns={columns} loading={isLoading} emptyMessage='Nenhuma fazenda cadastrada' />
      </Card>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingFarm ? 'Editar Fazenda' : 'Nova Fazenda'} size='lg'>
        <FarmForm
          defaultValues={
            editingFarm
              ? {
                  producerId: editingFarm.producerId,
                  name: editingFarm.name,
                  city: editingFarm.city,
                  state: editingFarm.state,
                  totalArea: editingFarm.totalArea,
                  arableArea: editingFarm.arableArea,
                  vegetationArea: editingFarm.vegetationArea,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={createFarm.isPending || updateFarm.isPending}
        />
      </Modal>
    </PageContainer>
  );
}
