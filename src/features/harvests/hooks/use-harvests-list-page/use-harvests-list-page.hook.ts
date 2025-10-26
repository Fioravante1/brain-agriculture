import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHarvests, useDeleteHarvest, useCreateHarvest, useUpdateHarvest, Harvest } from '@/entities/harvest';
import { HarvestFormValues } from '@/features/harvests';

export function useHarvestsListPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHarvest, setEditingHarvest] = useState<Harvest | null>(null);
  const router = useRouter();

  const { data: harvests, isLoading } = useHarvests();

  const createHarvest = useCreateHarvest({
    onSuccess: () => {
      alert('Safra criada com sucesso!');
      setIsModalOpen(false);
    },
    onError: error => {
      alert(`Erro ao criar safra: ${error.message}`);
    },
  });

  const updateHarvest = useUpdateHarvest({
    onSuccess: () => {
      alert('Safra atualizada com sucesso!');
      setIsModalOpen(false);
      setEditingHarvest(null);
    },
    onError: error => {
      alert(`Erro ao atualizar safra: ${error.message}`);
    },
  });

  const deleteHarvest = useDeleteHarvest({
    onSuccess: () => {
      alert('Safra excluída com sucesso!');
    },
    onError: error => {
      alert(`Erro ao excluir safra: ${error.message}`);
    },
  });

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

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta safra?')) {
      deleteHarvest.mutate(id);
    }
  };

  const handleNavigateToDashboard = () => {
    router.push('/dashboard');
  };

  const handleNavigateToProducers = () => {
    router.push('/producers');
  };

  const handleNavigateToFarms = () => {
    router.push('/farms');
  };

  const handleNavigateToFarmCrops = () => {
    router.push('/farm-crops');
  };

  return {
    // Data
    harvests,
    isLoading,

    // Modal state
    isModalOpen,
    editingHarvest,

    // Handlers
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSubmit,
    handleDelete,

    // Navigation handlers
    handleNavigateToDashboard,
    handleNavigateToProducers,
    handleNavigateToFarms,
    handleNavigateToFarmCrops,

    // Mutations
    createHarvest,
    updateHarvest,
    deleteHarvest,
  };
}
