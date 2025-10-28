'use client';

import styled from 'styled-components';
import { Card, Button, Table, Modal } from '@/shared/ui';
import { ProducerForm, useProducersListPage } from '@/features/producers';
import { PRODUCERS_TABLE_COLUMNS } from '@/features/producers/config';
import { Producer } from '@/entities/producer';

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
  const {
    producers,
    isLoading,
    isModalOpen,
    editingProducer,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSubmit,
    handleDelete,
    handleNavigateToDashboard,
    handleNavigateToFarms,
    handleNavigateToCrops,
    handleNavigateToHarvests,
    handleNavigateToFarmCrops,
    createProducer,
    updateProducer,
    deleteProducer,
  } = useProducersListPage();

  const columns = [
    ...PRODUCERS_TABLE_COLUMNS,
    {
      key: 'actions',
      header: 'Ações',
      width: '15%',
      render: (producer: Producer) => (
        <ActionsCell>
          <Button size='sm' variant='outline' onClick={() => handleOpenEditModal(producer)}>
            Editar
          </Button>
          <Button
            size='sm'
            variant='danger'
            onClick={() => handleDelete(producer.id)}
            disabled={deleteProducer.isPending}
          >
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
          <Button variant='outline' onClick={handleNavigateToDashboard}>
            Ver Dashboard
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
          <Button variant='outline' onClick={handleNavigateToFarmCrops}>
            Ver Associações
          </Button>
        </Actions>
      </PageHeader>

      <Card padding='lg'>
        <Table data={producers || []} columns={columns} loading={isLoading} emptyMessage='Nenhum produtor cadastrado' />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProducer ? 'Editar Produtor' : 'Novo Produtor'}
      >
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
