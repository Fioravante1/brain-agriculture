'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFarms, useDeleteFarm, useCreateFarm, useUpdateFarm, Farm } from '@/entities/farm';
import { Card, Button, Table, Modal } from '@/shared/ui';
import { formatNumber } from '@/shared/lib/utils';
import { FarmForm, FarmFormValues } from '@/features/farms';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const router = useRouter();

  const { data: farms, isLoading } = useFarms();
  const createFarm = useCreateFarm({
    onSuccess: () => {
      setIsModalOpen(false);
      setEditingFarm(null);
    },
  });
  const updateFarm = useUpdateFarm({
    onSuccess: () => {
      setIsModalOpen(false);
      setEditingFarm(null);
    },
  });
  const deleteFarm = useDeleteFarm();

  const handleOpenCreateModal = () => {
    setEditingFarm(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (farm: Farm) => {
    setEditingFarm(farm);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFarm(null);
  };

  const handleSubmit = (data: FarmFormValues) => {
    if (editingFarm) {
      updateFarm.mutate({ id: editingFarm.id, data });
    } else {
      createFarm.mutate(data);
    }
  };

  const handleDelete = (farm: Farm) => {
    if (confirm(`Tem certeza que deseja excluir a fazenda "${farm.name}"?`)) {
      deleteFarm.mutate(farm.id);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Nome da Fazenda',
      width: '25%',
    },
    {
      key: 'producer',
      header: 'Produtor',
      width: '20%',
      render: (farm: Farm) => farm.producer.name,
    },
    {
      key: 'location',
      header: 'Localização',
      width: '15%',
      render: (farm: Farm) => `${farm.city}/${farm.state}`,
    },
    {
      key: 'totalArea',
      header: 'Área Total',
      width: '12%',
      render: (farm: Farm) => `${formatNumber(farm.totalArea)} ha`,
    },
    {
      key: 'arableArea',
      header: 'Área Agricultável',
      width: '12%',
      render: (farm: Farm) => `${formatNumber(farm.arableArea)} ha`,
    },
    {
      key: 'vegetationArea',
      header: 'Área Vegetação',
      width: '12%',
      render: (farm: Farm) => `${formatNumber(farm.vegetationArea)} ha`,
    },
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
          <Button variant='outline' onClick={() => router.push('/dashboard')}>
            Ver Dashboard
          </Button>
          <Button variant='outline' onClick={() => router.push('/producers')}>
            Ver Produtores
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
