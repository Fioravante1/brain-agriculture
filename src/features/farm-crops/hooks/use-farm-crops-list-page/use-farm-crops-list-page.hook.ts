import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFarmCrops, useDeleteFarmCrop, useCreateFarmCrop, FarmCrop } from '@/entities/farm-crop';
import { FarmCropFormValues } from '@/features/farm-crops';

export function useFarmCropsListPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const { data: farmCrops, isLoading } = useFarmCrops();

  const createFarmCrop = useCreateFarmCrop({
    onSuccess: () => {
      alert('Associação criada com sucesso!');
      setIsModalOpen(false);
    },
    onError: error => {
      alert(`Erro ao criar associação: ${error.message}`);
    },
  });

  const deleteFarmCrop = useDeleteFarmCrop({
    onSuccess: () => {
      alert('Associação excluída com sucesso!');
    },
    onError: error => {
      alert(`Erro ao excluir associação: ${error.message}`);
    },
  });

  const handleOpenCreateModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (data: FarmCropFormValues) => {
    createFarmCrop.mutate(data);
  };

  const handleDelete = (farmCrop: FarmCrop) => {
    const associationName = `${farmCrop.farm.name} - ${farmCrop.crop.name} - ${farmCrop.harvest.name}`;
    if (confirm(`Tem certeza que deseja excluir a associação "${associationName}"?`)) {
      deleteFarmCrop.mutate(farmCrop.id);
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

  const handleNavigateToCrops = () => {
    router.push('/crops');
  };

  const handleNavigateToHarvests = () => {
    router.push('/harvests');
  };

  return {
    // Data
    farmCrops,
    isLoading,

    // Modal state
    isModalOpen,

    // Handlers
    handleOpenCreateModal,
    handleCloseModal,
    handleSubmit,
    handleDelete,

    // Navigation handlers
    handleNavigateToDashboard,
    handleNavigateToProducers,
    handleNavigateToFarms,
    handleNavigateToCrops,
    handleNavigateToHarvests,

    // Mutations
    createFarmCrop,
    deleteFarmCrop,
  };
}
