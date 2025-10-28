import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCrops, useDeleteCrop, useCreateCrop, useUpdateCrop, Crop } from '@/entities/crop';
import { CropFormValues } from '@/features/crops';
import { useToast } from '@/shared';
import { useConfirm } from '@/shared/lib';

export function useCropsListPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const router = useRouter();
  const { showToast } = useToast();
  const confirm = useConfirm();

  const { data: crops, isLoading } = useCrops();

  const createCrop = useCreateCrop({
    onSuccess: () => {
      showToast('Cultura criada com sucesso!', 'success');
      setIsModalOpen(false);
    },
    onError: error => {
      showToast(`Erro ao criar cultura: ${error.message}`, 'error');
    },
  });

  const updateCrop = useUpdateCrop({
    onSuccess: () => {
      showToast('Cultura atualizada com sucesso!', 'success');
      setIsModalOpen(false);
      setEditingCrop(null);
    },
    onError: error => {
      showToast(`Erro ao atualizar cultura: ${error.message}`, 'error');
    },
  });

  const deleteCrop = useDeleteCrop({
    onSuccess: () => {
      showToast('Cultura excluída com sucesso!', 'success');
    },
    onError: error => {
      showToast(`Erro ao excluir cultura: ${error.message}`, 'error');
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

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: 'Excluir Cultura',
      message: 'Tem certeza que deseja excluir esta cultura? Esta ação não pode ser desfeita.',
      confirmText: 'Sim, excluir',
      cancelText: 'Cancelar',
      variant: 'danger',
    });

    if (confirmed) {
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
