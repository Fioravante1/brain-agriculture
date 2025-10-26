'use client';

import styled from 'styled-components';
import { Card, Button, Table, Modal } from '@/shared/ui';
import { FarmCropForm, useFarmCropsListPage } from '@/features/farm-crops';
import { FARM_CROPS_TABLE_COLUMNS } from '@/features/farm-crops/config/farm-crops-table-columns';

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

export function FarmCropsListPage() {
  const {
    farmCrops,
    isLoading,
    isModalOpen,
    handleOpenCreateModal,
    handleCloseModal,
    handleSubmit,
    handleDelete,
    handleNavigateToDashboard,
    handleNavigateToProducers,
    handleNavigateToFarms,
    handleNavigateToCrops,
    handleNavigateToHarvests,
    createFarmCrop,
  } = useFarmCropsListPage();

  const columns = [
    ...FARM_CROPS_TABLE_COLUMNS.slice(0, -1),
    {
      key: 'actions',
      header: 'Ações',
      width: '5%',
      render: (farmCrop: any) => (
        <ActionsCell>
          <Button variant='danger' size='sm' onClick={() => handleDelete(farmCrop)}>
            Excluir
          </Button>
        </ActionsCell>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader>
        <Title>Associações Fazenda-Cultura-Safra</Title>
        <Subtitle>Gerencie as associações entre fazendas, culturas e safras</Subtitle>

        <Actions>
          <Button onClick={handleOpenCreateModal}>+ Nova Associação</Button>
          <Button variant='outline' onClick={handleNavigateToDashboard}>
            Ver Dashboard
          </Button>
          <Button variant='outline' onClick={handleNavigateToProducers}>
            Ver Produtores
          </Button>
          <Button variant='outline' onClick={handleNavigateToFarms}>
            Ver Fazendas
          </Button>
          <Button variant='outline' onClick={handleNavigateToCrops}>
            Ver Culturas
          </Button>
          <Button variant='outline' onClick={handleNavigateToHarvests}>
            Ver Safras
          </Button>
        </Actions>
      </PageHeader>

      <Card padding='lg'>
        <Table data={farmCrops || []} columns={columns} loading={isLoading} emptyMessage='Nenhuma associação cadastrada' />
      </Card>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title='Nova Associação' size='lg'>
        <FarmCropForm onSubmit={handleSubmit} onCancel={handleCloseModal} isLoading={createFarmCrop.isPending} />
      </Modal>
    </PageContainer>
  );
}
