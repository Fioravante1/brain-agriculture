import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFarms, useDeleteFarm, useCreateFarm, useUpdateFarm, Farm } from '@/entities/farm';
import { FarmFormValues } from '@/features/farms';

export function useFarmsListPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const router = useRouter();

  const { data: farms, isLoading } = useFarms();

  const createFarm = useCreateFarm({
    onSuccess: () => {
      alert('Fazenda criada com sucesso!');
      setIsModalOpen(false);
      setEditingFarm(null);
    },
    onError: error => {
      alert(`Erro ao criar fazenda: ${error.message}`);
    },
  });

  const updateFarm = useUpdateFarm({
    onSuccess: () => {
      alert('Fazenda atualizada com sucesso!');
      setIsModalOpen(false);
      setEditingFarm(null);
    },
    onError: error => {
      alert(`Erro ao atualizar fazenda: ${error.message}`);
    },
  });

  const deleteFarm = useDeleteFarm({
    onSuccess: () => {
      alert('Fazenda excluída com sucesso!');
    },
    onError: error => {
      alert(`Erro ao excluir fazenda: ${error.message}`);
    },
  });

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

  const handleNavigateToDashboard = () => {
    router.push('/dashboard');
  };

  const handleNavigateToProducers = () => {
    router.push('/producers');
  };

  const handleNavigateToCrops = () => {
    router.push('/crops');
  };

  const handleNavigateToHarvests = () => {
    router.push('/harvests');
  };

  const handleNavigateToFarmCrops = () => {
    router.push('/farm-crops');
  };

  return {
    // Data
    farms,
    isLoading,

    // Modal state
    isModalOpen,
    editingFarm,

    // Handlers
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSubmit,
    handleDelete,

    // Navigation handlers
    handleNavigateToDashboard,
    handleNavigateToProducers,
    handleNavigateToCrops,
    handleNavigateToHarvests,
    handleNavigateToFarmCrops,

    // Mutations
    createFarm,
    updateFarm,
    deleteFarm,
  };
}
