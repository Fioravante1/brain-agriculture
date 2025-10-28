import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useProducers, useDeleteProducer, useCreateProducer, useUpdateProducer } from '@/entities/producer';
import { useProducersListPage } from './use-producers-list-page.hook';
import { ProducerFormValues } from '@/features/producers';
import { ToastProvider } from '@/shared/lib/contexts/toast-context';
import { ConfirmProvider } from '@/shared/lib/contexts/confirm-context';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/shared/lib/theme';

const mockPush = jest.fn();
const mockConfirm = jest.fn();
const mockShowToast = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
}));

jest.mock('@/entities/producer', () => ({
  useProducers: jest.fn(),
  useDeleteProducer: jest.fn(),
  useCreateProducer: jest.fn(),
  useUpdateProducer: jest.fn(),
}));

jest.mock('@/shared/lib', () => ({
  ...jest.requireActual('@/shared/lib'),
  useConfirm: () => mockConfirm,
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient();
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <ConfirmProvider>{children}</ConfirmProvider>
        </ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};

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

    mockConfirm.mockResolvedValue(true);
  });

  describe('Estado inicial', () => {
    it('deve retornar estado inicial correto', () => {
      const { result } = renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

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

      const { result } = renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

      expect(result.current.producers).toBeUndefined();
      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('Gerenciamento de modal', () => {
    it('deve abrir modal de criação', () => {
      const { result } = renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

      act(() => {
        result.current.handleOpenCreateModal();
      });

      expect(result.current.isModalOpen).toBe(true);
      expect(result.current.editingProducer).toBeNull();
    });

    it('deve abrir modal de edição', () => {
      const { result } = renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

      act(() => {
        result.current.handleOpenEditModal(mockProducer);
      });

      expect(result.current.isModalOpen).toBe(true);
      expect(result.current.editingProducer).toEqual(mockProducer);
    });

    it('deve fechar modal', () => {
      const { result } = renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

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
      const { result } = renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

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
      const { result } = renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

      act(() => {
        result.current.handleSubmit(mockFormData);
      });

      expect(mockCreateProducer.mutate).toHaveBeenCalledWith(mockFormData);
      expect(mockUpdateProducer.mutate).not.toHaveBeenCalled();
    });

    it('deve chamar updateProducer.mutate quando há editingProducer', () => {
      const { result } = renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

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
      const { result } = renderHook(() => useProducersListPage(), { wrapper: createWrapper() });
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
    it('deve chamar deleteProducer.mutate quando confirm é true', async () => {
      mockConfirm.mockResolvedValue(true);
      const { result } = renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.handleDelete('1');
      });

      expect(mockConfirm).toHaveBeenCalledWith({
        title: 'Excluir Produtor',
        message: 'Tem certeza que deseja excluir este produtor? Esta ação não pode ser desfeita.',
        confirmText: 'Sim, excluir',
        cancelText: 'Cancelar',
        variant: 'danger',
      });
      expect(mockDeleteProducer.mutate).toHaveBeenCalledWith('1');
    });

    it('não deve chamar deleteProducer.mutate quando confirm é false', async () => {
      mockConfirm.mockResolvedValue(false);
      const { result } = renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.handleDelete('1');
      });

      expect(mockConfirm).toHaveBeenCalledWith({
        title: 'Excluir Produtor',
        message: 'Tem certeza que deseja excluir este produtor? Esta ação não pode ser desfeita.',
        confirmText: 'Sim, excluir',
        cancelText: 'Cancelar',
        variant: 'danger',
      });
      expect(mockDeleteProducer.mutate).not.toHaveBeenCalled();
    });

    it('deve usar ID correto na exclusão', async () => {
      mockConfirm.mockResolvedValue(true);
      const { result } = renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.handleDelete('2');
      });

      expect(mockDeleteProducer.mutate).toHaveBeenCalledWith('2');
    });
  });

  describe('Navegação', () => {
    it('deve navegar para dashboard', () => {
      const { result } = renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

      act(() => {
        result.current.handleNavigateToDashboard();
      });

      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    it('deve navegar para fazendas', () => {
      const { result } = renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

      act(() => {
        result.current.handleNavigateToFarms();
      });

      expect(mockPush).toHaveBeenCalledWith('/farms');
    });

    it('deve navegar para culturas', () => {
      const { result } = renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

      act(() => {
        result.current.handleNavigateToCrops();
      });

      expect(mockPush).toHaveBeenCalledWith('/crops');
    });

    it('deve navegar para safras', () => {
      const { result } = renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

      act(() => {
        result.current.handleNavigateToHarvests();
      });

      expect(mockPush).toHaveBeenCalledWith('/harvests');
    });

    it('deve navegar para associações', () => {
      const { result } = renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

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

      renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

      expect(useCreateProducer).toHaveBeenCalledWith({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      });
    });

    it('deve configurar callbacks corretos para updateProducer', () => {
      renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

      expect(useUpdateProducer).toHaveBeenCalledWith({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      });
    });

    it('deve configurar callbacks corretos para deleteProducer', () => {
      renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

      expect(useDeleteProducer).toHaveBeenCalledWith({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      });
    });

    it('deve executar callback onSuccess ao criar produtor', () => {
      let onSuccessCallback: () => void;

      (useCreateProducer as jest.Mock).mockImplementation(({ onSuccess }) => {
        onSuccessCallback = onSuccess;
        return mockCreateProducer;
      });

      renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

      act(() => {
        onSuccessCallback!();
      });
    });

    it('deve executar callback onError ao criar produtor', () => {
      let onErrorCallback: (error: Error) => void;

      (useCreateProducer as jest.Mock).mockImplementation(({ onError }) => {
        onErrorCallback = onError;
        return mockCreateProducer;
      });

      renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

      const error = new Error('Erro de teste');
      act(() => {
        onErrorCallback!(error);
      });
    });

    it('deve executar callback onSuccess ao atualizar produtor', () => {
      let onSuccessCallback: () => void;

      (useUpdateProducer as jest.Mock).mockImplementation(({ onSuccess }) => {
        onSuccessCallback = onSuccess;
        return mockUpdateProducer;
      });

      renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

      act(() => {
        onSuccessCallback!();
      });
    });

    it('deve executar callback onError ao atualizar produtor', () => {
      let onErrorCallback: (error: Error) => void;

      (useUpdateProducer as jest.Mock).mockImplementation(({ onError }) => {
        onErrorCallback = onError;
        return mockUpdateProducer;
      });

      renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

      const error = new Error('Erro de atualização');
      act(() => {
        onErrorCallback!(error);
      });
    });

    it('deve executar callback onSuccess ao excluir produtor', () => {
      let onSuccessCallback: () => void;

      (useDeleteProducer as jest.Mock).mockImplementation(({ onSuccess }) => {
        onSuccessCallback = onSuccess;
        return mockDeleteProducer;
      });

      renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

      act(() => {
        onSuccessCallback!();
      });
    });

    it('deve executar callback onError ao excluir produtor', () => {
      let onErrorCallback: (error: Error) => void;

      (useDeleteProducer as jest.Mock).mockImplementation(({ onError }) => {
        onErrorCallback = onError;
        return mockDeleteProducer;
      });

      renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

      const error = new Error('Erro de exclusão');
      act(() => {
        onErrorCallback!(error);
      });
    });
  });

  describe('Fechamento de modal nos callbacks', () => {
    it('deve fechar modal após criar produtor com sucesso', () => {
      let onSuccessCallback: () => void;

      (useCreateProducer as jest.Mock).mockImplementation(({ onSuccess }) => {
        onSuccessCallback = onSuccess;
        return mockCreateProducer;
      });

      const { result } = renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

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

      const { result } = renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

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
      const { result } = renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

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
      const { result } = renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

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

      const { result } = renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

      expect(result.current.producers).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
    });

    it('deve lidar com producers array vazio', () => {
      (useProducers as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
      });

      const { result } = renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

      expect(result.current.producers).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });

    it('deve lidar com ID vazio na exclusão', async () => {
      mockConfirm.mockResolvedValue(true);
      const { result } = renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.handleDelete('');
      });

      expect(mockDeleteProducer.mutate).toHaveBeenCalledWith('');
    });

    it('deve lidar com dados de formulário vazios', () => {
      const { result } = renderHook(() => useProducersListPage(), { wrapper: createWrapper() });
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
      renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

      expect(useRouter).toHaveBeenCalled();
    });

    it('deve chamar router.push com URLs corretas', () => {
      const { result } = renderHook(() => useProducersListPage(), { wrapper: createWrapper() });

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
