import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProducers, useDeleteProducer, useCreateProducer, useUpdateProducer, Producer } from '@/entities/producer';
import { ProducerFormValues } from '@/features/producers';

export function useProducersListPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProducer, setEditingProducer] = useState<Producer | null>(null);
  const router = useRouter();

  const { data: producers, isLoading } = useProducers();

  const createProducer = useCreateProducer({
    onSuccess: () => {
      alert('Produtor criado com sucesso!');
      setIsModalOpen(false);
    },
    onError: error => {
      alert(`Erro ao criar produtor: ${error.message}`);
    },
  });

  const updateProducer = useUpdateProducer({
    onSuccess: () => {
      alert('Produtor atualizado com sucesso!');
      setIsModalOpen(false);
      setEditingProducer(null);
    },
    onError: error => {
      alert(`Erro ao atualizar produtor: ${error.message}`);
    },
  });

  const deleteProducer = useDeleteProducer({
    onSuccess: () => {
      alert('Produtor excluído com sucesso!');
    },
    onError: error => {
      alert(`Erro ao excluir produtor: ${error.message}`);
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

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produtor?')) {
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
