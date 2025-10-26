import { renderHook, act } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useProducers, useDeleteProducer, useCreateProducer, useUpdateProducer } from '@/entities/producer';
import { useProducersListPage } from './use-producers-list-page.hook';
import { ProducerFormValues } from '@/features/producers';

// Mock do useRouter
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
}));

// Mock dos hooks de producer
jest.mock('@/entities/producer', () => ({
  useProducers: jest.fn(),
  useDeleteProducer: jest.fn(),
  useCreateProducer: jest.fn(),
  useUpdateProducer: jest.fn(),
}));

// Mock do window.confirm e window.alert
const mockConfirm = jest.fn();
const mockAlert = jest.fn();

Object.defineProperty(window, 'confirm', {
  value: mockConfirm,
  writable: true,
});

Object.defineProperty(window, 'alert', {
  value: mockAlert,
  writable: true,
});

describe('useProducersListPage', () => {
  const mockProducers = [
    {
      id: '1',
      name: 'João Silva',
      cpfCnpj: '12345678901',
      farms: [],
    },
    {
      id: '2',
      name: 'Maria Santos',
      cpfCnpj: '12345678000195',
      farms: [],
    },
  ];

  const mockProducer = mockProducers[0];

  const mockCreateProducer = {
    mutate: jest.fn(),
    isPending: false,
  };

  const mockUpdateProducer = {
    mutate: jest.fn(),
    isPending: false,
  };

  const mockDeleteProducer = {
    mutate: jest.fn(),
    isPending: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useProducers as jest.Mock).mockReturnValue({
      data: mockProducers,
      isLoading: false,
    });

    (useCreateProducer as jest.Mock).mockReturnValue(mockCreateProducer);
    (useUpdateProducer as jest.Mock).mockReturnValue(mockUpdateProducer);
    (useDeleteProducer as jest.Mock).mockReturnValue(mockDeleteProducer);
  });

  describe('Estado inicial', () => {
    it('deve retornar estado inicial correto', () => {
      const { result } = renderHook(() => useProducersListPage());

      expect(result.current.producers).toEqual(mockProducers);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isModalOpen).toBe(false);
      expect(result.current.editingProducer).toBeNull();
    });

    it('deve retornar dados de loading quando isLoading é true', () => {
      (useProducers as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: true,
      });

      const { result } = renderHook(() => useProducersListPage());

      expect(result.current.producers).toBeUndefined();
      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('Gerenciamento de modal', () => {
    it('deve abrir modal de criação', () => {
      const { result } = renderHook(() => useProducersListPage());

      act(() => {
        result.current.handleOpenCreateModal();
      });

      expect(result.current.isModalOpen).toBe(true);
      expect(result.current.editingProducer).toBeNull();
    });

    it('deve abrir modal de edição', () => {
      const { result } = renderHook(() => useProducersListPage());

      act(() => {
        result.current.handleOpenEditModal(mockProducer);
      });

      expect(result.current.isModalOpen).toBe(true);
      expect(result.current.editingProducer).toEqual(mockProducer);
    });

    it('deve fechar modal', () => {
      const { result } = renderHook(() => useProducersListPage());

      act(() => {
        result.current.handleOpenEditModal(mockProducer);
      });

      expect(result.current.isModalOpen).toBe(true);
      expect(result.current.editingProducer).toEqual(mockProducer);

      act(() => {
        result.current.handleCloseModal();
      });

      expect(result.current.isModalOpen).toBe(false);
      expect(result.current.editingProducer).toBeNull();
    });

    it('deve limpar editingProducer ao abrir modal de criação', () => {
      const { result } = renderHook(() => useProducersListPage());

      act(() => {
        result.current.handleOpenEditModal(mockProducer);
      });

      expect(result.current.editingProducer).toEqual(mockProducer);

      act(() => {
        result.current.handleOpenCreateModal();
      });

      expect(result.current.editingProducer).toBeNull();
    });
  });

  describe('Submissão de formulário', () => {
    const mockFormData: ProducerFormValues = {
      name: 'Novo Produtor',
      cpfCnpj: '98765432100',
    };

    it('deve chamar createProducer.mutate quando não há editingProducer', () => {
      const { result } = renderHook(() => useProducersListPage());

      act(() => {
        result.current.handleSubmit(mockFormData);
      });

      expect(mockCreateProducer.mutate).toHaveBeenCalledWith(mockFormData);
      expect(mockUpdateProducer.mutate).not.toHaveBeenCalled();
    });

    it('deve chamar updateProducer.mutate quando há editingProducer', () => {
      const { result } = renderHook(() => useProducersListPage());

      act(() => {
        result.current.handleOpenEditModal(mockProducer);
      });

      act(() => {
        result.current.handleSubmit(mockFormData);
      });

      expect(mockUpdateProducer.mutate).toHaveBeenCalledWith({
        id: mockProducer.id,
        data: mockFormData,
      });
      expect(mockCreateProducer.mutate).not.toHaveBeenCalled();
    });

    it('deve usar ID correto do editingProducer', () => {
      const { result } = renderHook(() => useProducersListPage());
      const secondProducer = mockProducers[1];

      act(() => {
        result.current.handleOpenEditModal(secondProducer);
      });

      act(() => {
        result.current.handleSubmit(mockFormData);
      });

      expect(mockUpdateProducer.mutate).toHaveBeenCalledWith({
        id: secondProducer.id,
        data: mockFormData,
      });
    });
  });

  describe('Exclusão de produtor', () => {
    it('deve chamar deleteProducer.mutate quando confirm é true', () => {
      mockConfirm.mockReturnValue(true);
      const { result } = renderHook(() => useProducersListPage());

      act(() => {
        result.current.handleDelete('1');
      });

      expect(mockConfirm).toHaveBeenCalledWith('Tem certeza que deseja excluir este produtor?');
      expect(mockDeleteProducer.mutate).toHaveBeenCalledWith('1');
    });

    it('não deve chamar deleteProducer.mutate quando confirm é false', () => {
      mockConfirm.mockReturnValue(false);
      const { result } = renderHook(() => useProducersListPage());

      act(() => {
        result.current.handleDelete('1');
      });

      expect(mockConfirm).toHaveBeenCalledWith('Tem certeza que deseja excluir este produtor?');
      expect(mockDeleteProducer.mutate).not.toHaveBeenCalled();
    });

    it('deve usar ID correto na exclusão', () => {
      mockConfirm.mockReturnValue(true);
      const { result } = renderHook(() => useProducersListPage());

      act(() => {
        result.current.handleDelete('2');
      });

      expect(mockDeleteProducer.mutate).toHaveBeenCalledWith('2');
    });
  });

  describe('Navegação', () => {
    it('deve navegar para dashboard', () => {
      const { result } = renderHook(() => useProducersListPage());

      act(() => {
        result.current.handleNavigateToDashboard();
      });

      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    it('deve navegar para fazendas', () => {
      const { result } = renderHook(() => useProducersListPage());

      act(() => {
        result.current.handleNavigateToFarms();
      });

      expect(mockPush).toHaveBeenCalledWith('/farms');
    });

    it('deve navegar para culturas', () => {
      const { result } = renderHook(() => useProducersListPage());

      act(() => {
        result.current.handleNavigateToCrops();
      });

      expect(mockPush).toHaveBeenCalledWith('/crops');
    });

    it('deve navegar para safras', () => {
      const { result } = renderHook(() => useProducersListPage());

      act(() => {
        result.current.handleNavigateToHarvests();
      });

      expect(mockPush).toHaveBeenCalledWith('/harvests');
    });

    it('deve navegar para associações', () => {
      const { result } = renderHook(() => useProducersListPage());

      act(() => {
        result.current.handleNavigateToFarmCrops();
      });

      expect(mockPush).toHaveBeenCalledWith('/farm-crops');
    });
  });

  describe('Callbacks de sucesso e erro', () => {
    it('deve configurar callbacks corretos para createProducer', () => {
      (useCreateProducer as jest.Mock).mockReturnValue({
        mutate: jest.fn(),
        isPending: false,
      });

      renderHook(() => useProducersListPage());

      expect(useCreateProducer).toHaveBeenCalledWith({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      });
    });

    it('deve configurar callbacks corretos para updateProducer', () => {
      renderHook(() => useProducersListPage());

      expect(useUpdateProducer).toHaveBeenCalledWith({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      });
    });

    it('deve configurar callbacks corretos para deleteProducer', () => {
      renderHook(() => useProducersListPage());

      expect(useDeleteProducer).toHaveBeenCalledWith({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      });
    });

    it('deve mostrar alert de sucesso ao criar produtor', () => {
      let onSuccessCallback: () => void;

      (useCreateProducer as jest.Mock).mockImplementation(({ onSuccess }) => {
        onSuccessCallback = onSuccess;
        return mockCreateProducer;
      });

      renderHook(() => useProducersListPage());

      act(() => {
        onSuccessCallback!();
      });

      expect(mockAlert).toHaveBeenCalledWith('Produtor criado com sucesso!');
    });

    it('deve mostrar alert de erro ao criar produtor', () => {
      let onErrorCallback: (error: Error) => void;

      (useCreateProducer as jest.Mock).mockImplementation(({ onError }) => {
        onErrorCallback = onError;
        return mockCreateProducer;
      });

      renderHook(() => useProducersListPage());

      const error = new Error('Erro de teste');
      act(() => {
        onErrorCallback!(error);
      });

      expect(mockAlert).toHaveBeenCalledWith('Erro ao criar produtor: Erro de teste');
    });

    it('deve mostrar alert de sucesso ao atualizar produtor', () => {
      let onSuccessCallback: () => void;

      (useUpdateProducer as jest.Mock).mockImplementation(({ onSuccess }) => {
        onSuccessCallback = onSuccess;
        return mockUpdateProducer;
      });

      renderHook(() => useProducersListPage());

      act(() => {
        onSuccessCallback!();
      });

      expect(mockAlert).toHaveBeenCalledWith('Produtor atualizado com sucesso!');
    });

    it('deve mostrar alert de erro ao atualizar produtor', () => {
      let onErrorCallback: (error: Error) => void;

      (useUpdateProducer as jest.Mock).mockImplementation(({ onError }) => {
        onErrorCallback = onError;
        return mockUpdateProducer;
      });

      renderHook(() => useProducersListPage());

      const error = new Error('Erro de atualização');
      act(() => {
        onErrorCallback!(error);
      });

      expect(mockAlert).toHaveBeenCalledWith('Erro ao atualizar produtor: Erro de atualização');
    });

    it('deve mostrar alert de sucesso ao excluir produtor', () => {
      let onSuccessCallback: () => void;

      (useDeleteProducer as jest.Mock).mockImplementation(({ onSuccess }) => {
        onSuccessCallback = onSuccess;
        return mockDeleteProducer;
      });

      renderHook(() => useProducersListPage());

      act(() => {
        onSuccessCallback!();
      });

      expect(mockAlert).toHaveBeenCalledWith('Produtor excluído com sucesso!');
    });

    it('deve mostrar alert de erro ao excluir produtor', () => {
      let onErrorCallback: (error: Error) => void;

      (useDeleteProducer as jest.Mock).mockImplementation(({ onError }) => {
        onErrorCallback = onError;
        return mockDeleteProducer;
      });

      renderHook(() => useProducersListPage());

      const error = new Error('Erro de exclusão');
      act(() => {
        onErrorCallback!(error);
      });

      expect(mockAlert).toHaveBeenCalledWith('Erro ao excluir produtor: Erro de exclusão');
    });
  });

  describe('Fechamento de modal nos callbacks', () => {
    it('deve fechar modal após criar produtor com sucesso', () => {
      let onSuccessCallback: () => void;

      (useCreateProducer as jest.Mock).mockImplementation(({ onSuccess }) => {
        onSuccessCallback = onSuccess;
        return mockCreateProducer;
      });

      const { result } = renderHook(() => useProducersListPage());

      act(() => {
        result.current.handleOpenCreateModal();
      });

      expect(result.current.isModalOpen).toBe(true);

      act(() => {
        onSuccessCallback!();
      });

      expect(result.current.isModalOpen).toBe(false);
    });

    it('deve fechar modal e limpar editingProducer após atualizar produtor com sucesso', () => {
      let onSuccessCallback: () => void;

      (useUpdateProducer as jest.Mock).mockImplementation(({ onSuccess }) => {
        onSuccessCallback = onSuccess;
        return mockUpdateProducer;
      });

      const { result } = renderHook(() => useProducersListPage());

      act(() => {
        result.current.handleOpenEditModal(mockProducer);
      });

      expect(result.current.isModalOpen).toBe(true);
      expect(result.current.editingProducer).toEqual(mockProducer);

      act(() => {
        onSuccessCallback!();
      });

      expect(result.current.isModalOpen).toBe(false);
      expect(result.current.editingProducer).toBeNull();
    });
  });

  describe('Retorno do hook', () => {
    it('deve retornar todas as propriedades necessárias', () => {
      const { result } = renderHook(() => useProducersListPage());

      expect(result.current).toHaveProperty('producers');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('isModalOpen');
      expect(result.current).toHaveProperty('editingProducer');
      expect(result.current).toHaveProperty('handleOpenCreateModal');
      expect(result.current).toHaveProperty('handleOpenEditModal');
      expect(result.current).toHaveProperty('handleCloseModal');
      expect(result.current).toHaveProperty('handleSubmit');
      expect(result.current).toHaveProperty('handleDelete');
      expect(result.current).toHaveProperty('handleNavigateToDashboard');
      expect(result.current).toHaveProperty('handleNavigateToFarms');
      expect(result.current).toHaveProperty('handleNavigateToCrops');
      expect(result.current).toHaveProperty('handleNavigateToHarvests');
      expect(result.current).toHaveProperty('handleNavigateToFarmCrops');
      expect(result.current).toHaveProperty('createProducer');
      expect(result.current).toHaveProperty('updateProducer');
      expect(result.current).toHaveProperty('deleteProducer');
    });

    it('deve retornar mutations corretas', () => {
      const { result } = renderHook(() => useProducersListPage());

      expect(result.current.createProducer).toBe(mockCreateProducer);
      expect(result.current.updateProducer).toBe(mockUpdateProducer);
      expect(result.current.deleteProducer).toBe(mockDeleteProducer);
    });
  });

  describe('Casos extremos', () => {
    it('deve lidar com producers undefined', () => {
      (useProducers as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
      });

      const { result } = renderHook(() => useProducersListPage());

      expect(result.current.producers).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
    });

    it('deve lidar com producers array vazio', () => {
      (useProducers as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
      });

      const { result } = renderHook(() => useProducersListPage());

      expect(result.current.producers).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });

    it('deve lidar com ID vazio na exclusão', () => {
      mockConfirm.mockReturnValue(true);
      const { result } = renderHook(() => useProducersListPage());

      act(() => {
        result.current.handleDelete('');
      });

      expect(mockDeleteProducer.mutate).toHaveBeenCalledWith('');
    });

    it('deve lidar com dados de formulário vazios', () => {
      const { result } = renderHook(() => useProducersListPage());
      const emptyFormData: ProducerFormValues = {
        name: '',
        cpfCnpj: '',
      };

      act(() => {
        result.current.handleSubmit(emptyFormData);
      });

      expect(mockCreateProducer.mutate).toHaveBeenCalledWith(emptyFormData);
    });
  });

  describe('Integração com React Router', () => {
    it('deve usar useRouter corretamente', () => {
      renderHook(() => useProducersListPage());

      expect(useRouter).toHaveBeenCalled();
    });

    it('deve chamar router.push com URLs corretas', () => {
      const { result } = renderHook(() => useProducersListPage());

      const navigationHandlers = [
        { handler: result.current.handleNavigateToDashboard, expectedUrl: '/dashboard' },
        { handler: result.current.handleNavigateToFarms, expectedUrl: '/farms' },
        { handler: result.current.handleNavigateToCrops, expectedUrl: '/crops' },
        { handler: result.current.handleNavigateToHarvests, expectedUrl: '/harvests' },
        { handler: result.current.handleNavigateToFarmCrops, expectedUrl: '/farm-crops' },
      ];

      navigationHandlers.forEach(({ handler, expectedUrl }) => {
        act(() => {
          handler();
        });

        expect(mockPush).toHaveBeenCalledWith(expectedUrl);
      });
    });
  });
});
