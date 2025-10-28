import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProducers, useDeleteProducer, useCreateProducer, useUpdateProducer, Producer } from '@/entities/producer';
import { ProducerFormValues } from '@/features/producers';
import { useToast } from '@/shared';
import { useConfirm } from '@/shared/lib';

export function useProducersListPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProducer, setEditingProducer] = useState<Producer | null>(null);
  const router = useRouter();
  const { showToast } = useToast();
  const confirm = useConfirm();

  const { data: producers, isLoading } = useProducers();

  const createProducer = useCreateProducer({
    onSuccess: () => {
      showToast('Produtor criado com sucesso!', 'success');
      setIsModalOpen(false);
    },
    onError: error => {
      showToast(`Erro ao criar produtor: ${error.message}`, 'error');
    },
  });

  const updateProducer = useUpdateProducer({
    onSuccess: () => {
      showToast('Produtor atualizado com sucesso!', 'success');
      setIsModalOpen(false);
      setEditingProducer(null);
    },
    onError: error => {
      showToast(`Erro ao atualizar produtor: ${error.message}`, 'error');
    },
  });

  const deleteProducer = useDeleteProducer({
    onSuccess: () => {
      showToast('Produtor excluído com sucesso!', 'success');
    },
    onError: error => {
      showToast(`Erro ao excluir produtor: ${error.message}`, 'error');
    },
  });

  const handleOpenCreateModal = () => {
    setEditingProducer(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (producer: Producer) => {
    setEditingProducer(producer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProducer(null);
  };

  const handleSubmit = (data: ProducerFormValues) => {
    if (editingProducer) {
      updateProducer.mutate({ id: editingProducer.id, data });
    } else {
      createProducer.mutate(data);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: 'Excluir Produtor',
      message: 'Tem certeza que deseja excluir este produtor? Esta ação não pode ser desfeita.',
      confirmText: 'Sim, excluir',
      cancelText: 'Cancelar',
      variant: 'danger',
    });

    if (confirmed) {
      deleteProducer.mutate(id);
    }
  };

  const handleNavigateToDashboard = () => {
    router.push('/dashboard');
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

  const handleNavigateToFarmCrops = () => {
    router.push('/farm-crops');
  };

  return {
    // Data
    producers,
    isLoading,

    // Modal state
    isModalOpen,
    editingProducer,

    // Handlers
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSubmit,
    handleDelete,

    // Navigation handlers
    handleNavigateToDashboard,
    handleNavigateToFarms,
    handleNavigateToCrops,
    handleNavigateToHarvests,
    handleNavigateToFarmCrops,

    // Mutations
    createProducer,
    updateProducer,
    deleteProducer,
  };
}
