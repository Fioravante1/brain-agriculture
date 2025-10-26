import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCrops, useDeleteCrop, useCreateCrop, useUpdateCrop, Crop } from '@/entities/crop';
import { CropFormValues } from '@/features/crops';

export function useCropsListPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const router = useRouter();

  const { data: crops, isLoading } = useCrops();

  const createCrop = useCreateCrop({
    onSuccess: () => {
      alert('Cultura criada com sucesso!');
      setIsModalOpen(false);
    },
    onError: error => {
      alert(`Erro ao criar cultura: ${error.message}`);
    },
  });

  const updateCrop = useUpdateCrop({
    onSuccess: () => {
      alert('Cultura atualizada com sucesso!');
      setIsModalOpen(false);
      setEditingCrop(null);
    },
    onError: error => {
      alert(`Erro ao atualizar cultura: ${error.message}`);
    },
  });

  const deleteCrop = useDeleteCrop({
    onSuccess: () => {
      alert('Cultura excluída com sucesso!');
    },
    onError: error => {
      alert(`Erro ao excluir cultura: ${error.message}`);
    },
  });

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

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta cultura?')) {
      deleteCrop.mutate(id);
    }
  };

  const handleNavigateToDashboard = () => {
    router.push('/dashboard');
  };

  const handleNavigateToProducers = () => {
    router.push('/producers');
  };

  const handleNavigateToHarvests = () => {
    router.push('/harvests');
  };

  const handleNavigateToFarmCrops = () => {
    router.push('/farm-crops');
  };

  return {
    // Data
    crops,
    isLoading,

    // Modal state
    isModalOpen,
    editingCrop,

    // Handlers
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSubmit,
    handleDelete,

    // Navigation handlers
    handleNavigateToDashboard,
    handleNavigateToProducers,
    handleNavigateToHarvests,
    handleNavigateToFarmCrops,

    // Mutations
    createCrop,
    updateCrop,
    deleteCrop,
  };
}
