import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCropsListPage } from './use-crops-list-page.hook';
import { useCrops, useCreateCrop, useUpdateCrop, useDeleteCrop, Crop } from '@/entities/crop';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@/entities/crop', () => ({
  useCrops: jest.fn(),
  useCreateCrop: jest.fn(),
  useUpdateCrop: jest.fn(),
  useDeleteCrop: jest.fn(),
  CropFormValues: jest.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient();
  const Wrapper = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};

const mockCrops: Crop[] = [
  {
    id: '1',
    name: 'Soja',
    createdAt: new Date('2021-01-01'),
    updatedAt: new Date('2021-01-01'),
  },
  {
    id: '2',
    name: 'Milho',
    createdAt: new Date('2021-01-02'),
    updatedAt: new Date('2021-01-02'),
  },
  {
    id: '3',
    name: 'Café',
    createdAt: new Date('2021-01-03'),
    updatedAt: new Date('2021-01-03'),
  },
];

describe('useCropsListPage', () => {
  beforeEach(() => {
    (useCrops as jest.Mock).mockReturnValue({
      data: mockCrops,
      isLoading: false,
    });
    (useCreateCrop as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });
    (useUpdateCrop as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });
    (useDeleteCrop as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: false });
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  describe('Estado inicial', () => {
    it('deve retornar estado inicial correto', () => {
      const { result } = renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      expect(result.current.crops).toEqual(mockCrops);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isModalOpen).toBe(false);
      expect(result.current.editingCrop).toBeNull();
    });

    it('deve retornar todas as funções necessárias', () => {
      const { result } = renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.handleOpenCreateModal).toBe('function');
      expect(typeof result.current.handleOpenEditModal).toBe('function');
      expect(typeof result.current.handleCloseModal).toBe('function');
      expect(typeof result.current.handleSubmit).toBe('function');
      expect(typeof result.current.handleDelete).toBe('function');
      expect(typeof result.current.handleNavigateToDashboard).toBe('function');
      expect(typeof result.current.handleNavigateToProducers).toBe('function');
      expect(typeof result.current.handleNavigateToHarvests).toBe('function');
      expect(typeof result.current.handleNavigateToFarmCrops).toBe('function');
    });

    it('deve retornar mutations corretas', () => {
      const { result } = renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      expect(result.current.createCrop).toBeDefined();
      expect(result.current.updateCrop).toBeDefined();
      expect(result.current.deleteCrop).toBeDefined();
    });
  });

  describe('Gerenciamento de modal', () => {
    it('deve abrir modal de criação', () => {
      const { result } = renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleOpenCreateModal();
      });

      expect(result.current.isModalOpen).toBe(true);
      expect(result.current.editingCrop).toBeNull();
    });

    it('deve abrir modal de edição', () => {
      const { result } = renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleOpenEditModal(mockCrops[0]);
      });

      expect(result.current.isModalOpen).toBe(true);
      expect(result.current.editingCrop).toEqual(mockCrops[0]);
    });

    it('deve fechar modal', () => {
      const { result } = renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleOpenEditModal(mockCrops[0]);
      });

      expect(result.current.isModalOpen).toBe(true);
      expect(result.current.editingCrop).toEqual(mockCrops[0]);

      act(() => {
        result.current.handleCloseModal();
      });

      expect(result.current.isModalOpen).toBe(false);
      expect(result.current.editingCrop).toBeNull();
    });

    it('deve limpar editingCrop ao abrir modal de criação', () => {
      const { result } = renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleOpenEditModal(mockCrops[0]);
      });

      expect(result.current.editingCrop).toEqual(mockCrops[0]);

      act(() => {
        result.current.handleOpenCreateModal();
      });

      expect(result.current.isModalOpen).toBe(true);
      expect(result.current.editingCrop).toBeNull();
    });
  });

  describe('Submissão de formulário', () => {
    it('deve chamar createCrop.mutate quando não há editingCrop', () => {
      const mockMutate = jest.fn();
      (useCreateCrop as jest.Mock).mockReturnValue({ mutate: mockMutate, isPending: false });

      const { result } = renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      const formData = { name: 'Nova Cultura' };

      act(() => {
        result.current.handleSubmit(formData);
      });

      expect(mockMutate).toHaveBeenCalledWith(formData);
    });

    it('deve chamar updateCrop.mutate quando há editingCrop', () => {
      const mockMutate = jest.fn();
      (useUpdateCrop as jest.Mock).mockReturnValue({ mutate: mockMutate, isPending: false });

      const { result } = renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleOpenEditModal(mockCrops[0]);
      });

      const formData = { name: 'Cultura Atualizada' };

      act(() => {
        result.current.handleSubmit(formData);
      });

      expect(mockMutate).toHaveBeenCalledWith({
        id: mockCrops[0].id,
        data: formData,
      });
    });
  });

  describe('Exclusão de cultura', () => {
    it('deve chamar deleteCrop.mutate quando confirmado', () => {
      const mockMutate = jest.fn();
      (useDeleteCrop as jest.Mock).mockReturnValue({ mutate: mockMutate, isPending: false });

      const { result } = renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleDelete('1');
      });

      expect(mockMutate).toHaveBeenCalledWith('1');
    });

    it('não deve chamar deleteCrop.mutate quando cancelado', () => {
      const mockMutate = jest.fn();
      (useDeleteCrop as jest.Mock).mockReturnValue({ mutate: mockMutate, isPending: false });
      jest.spyOn(window, 'confirm').mockReturnValue(false);

      const { result } = renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleDelete('1');
      });

      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe('Navegação', () => {
    it('deve navegar para dashboard', () => {
      const { result } = renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleNavigateToDashboard();
      });

      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    it('deve navegar para produtores', () => {
      const { result } = renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleNavigateToProducers();
      });

      expect(mockPush).toHaveBeenCalledWith('/producers');
    });

    it('deve navegar para safras', () => {
      const { result } = renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleNavigateToHarvests();
      });

      expect(mockPush).toHaveBeenCalledWith('/harvests');
    });

    it('deve navegar para associações', () => {
      const { result } = renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleNavigateToFarmCrops();
      });

      expect(mockPush).toHaveBeenCalledWith('/farm-crops');
    });
  });

  describe('Callbacks de sucesso e erro', () => {
    it('deve mostrar alert de sucesso ao criar cultura', () => {
      let onSuccessCallback: () => void;

      (useCreateCrop as jest.Mock).mockImplementation(({ onSuccess }) => {
        onSuccessCallback = onSuccess;
        return { mutate: jest.fn(), isPending: false };
      });

      const { result } = renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleOpenCreateModal();
      });

      expect(result.current.isModalOpen).toBe(true);

      act(() => {
        onSuccessCallback!();
      });

      expect(result.current.isModalOpen).toBe(false);
    });

    it('deve mostrar alert de erro ao criar cultura', () => {
      let onErrorCallback: ((error: Error) => void) | undefined;

      (useCreateCrop as jest.Mock).mockImplementation(({ onError }) => {
        onErrorCallback = onError;
        return { mutate: jest.fn(), isPending: false };
      });

      renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      const error = new Error('Erro ao criar cultura');

      act(() => {
        onErrorCallback!(error);
      });

      expect(onErrorCallback).toBeDefined();
    });

    it('deve mostrar alert de sucesso ao atualizar cultura', () => {
      let onSuccessCallback: () => void;

      (useUpdateCrop as jest.Mock).mockImplementation(({ onSuccess }) => {
        onSuccessCallback = onSuccess;
        return { mutate: jest.fn(), isPending: false };
      });

      const { result } = renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleOpenEditModal(mockCrops[0]);
      });

      expect(result.current.isModalOpen).toBe(true);
      expect(result.current.editingCrop).toEqual(mockCrops[0]);

      act(() => {
        onSuccessCallback!();
      });

      expect(result.current.isModalOpen).toBe(false);
      expect(result.current.editingCrop).toBeNull();
    });

    it('deve mostrar alert de erro ao atualizar cultura', () => {
      let onErrorCallback: ((error: Error) => void) | undefined;

      (useUpdateCrop as jest.Mock).mockImplementation(({ onError }) => {
        onErrorCallback = onError;
        return { mutate: jest.fn(), isPending: false };
      });

      renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      const error = new Error('Erro ao atualizar cultura');

      act(() => {
        onErrorCallback!(error);
      });

      expect(onErrorCallback).toBeDefined();
    });

    it('deve mostrar alert de sucesso ao excluir cultura', () => {
      let onSuccessCallback: (() => void) | undefined;

      (useDeleteCrop as jest.Mock).mockImplementation(({ onSuccess }) => {
        onSuccessCallback = onSuccess;
        return { mutate: jest.fn(), isPending: false };
      });

      renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      act(() => {
        onSuccessCallback!();
      });

      expect(onSuccessCallback).toBeDefined();
    });

    it('deve mostrar alert de erro ao excluir cultura', () => {
      let onErrorCallback: ((error: Error) => void) | undefined;

      (useDeleteCrop as jest.Mock).mockImplementation(({ onError }) => {
        onErrorCallback = onError;
        return { mutate: jest.fn(), isPending: false };
      });

      renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      const error = new Error('Erro ao excluir cultura');

      act(() => {
        onErrorCallback!(error);
      });

      expect(onErrorCallback).toBeDefined();
    });
  });

  describe('Fechamento de modal após sucesso', () => {
    it('deve fechar modal após criar cultura com sucesso', () => {
      let onSuccessCallback: () => void;

      (useCreateCrop as jest.Mock).mockImplementation(({ onSuccess }) => {
        onSuccessCallback = onSuccess;
        return { mutate: jest.fn(), isPending: false };
      });

      const { result } = renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleOpenCreateModal();
      });

      expect(result.current.isModalOpen).toBe(true);

      act(() => {
        onSuccessCallback!();
      });

      expect(result.current.isModalOpen).toBe(false);
    });

    it('deve fechar modal e limpar editingCrop após atualizar cultura com sucesso', () => {
      let onSuccessCallback: () => void;

      (useUpdateCrop as jest.Mock).mockImplementation(({ onSuccess }) => {
        onSuccessCallback = onSuccess;
        return { mutate: jest.fn(), isPending: false };
      });

      const { result } = renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleOpenEditModal(mockCrops[0]);
      });

      expect(result.current.isModalOpen).toBe(true);
      expect(result.current.editingCrop).toEqual(mockCrops[0]);

      act(() => {
        onSuccessCallback!();
      });

      expect(result.current.isModalOpen).toBe(false);
      expect(result.current.editingCrop).toBeNull();
    });
  });

  describe('Valores retornados', () => {
    it('deve retornar crops corretos', () => {
      const { result } = renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      expect(result.current.crops).toEqual(mockCrops);
    });

    it('deve retornar isLoading correto', () => {
      (useCrops as jest.Mock).mockReturnValue({
        data: mockCrops,
        isLoading: true,
      });

      const { result } = renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('deve retornar mutations com isPending correto', () => {
      (useCreateCrop as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: true });
      (useUpdateCrop as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: true });
      (useDeleteCrop as jest.Mock).mockReturnValue({ mutate: jest.fn(), isPending: true });

      const { result } = renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      expect(result.current.createCrop.isPending).toBe(true);
      expect(result.current.updateCrop.isPending).toBe(true);
      expect(result.current.deleteCrop.isPending).toBe(true);
    });
  });

  describe('Casos extremos', () => {
    it('deve lidar com crops undefined', () => {
      (useCrops as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
      });

      const { result } = renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      expect(result.current.crops).toBeUndefined();
    });

    it('deve lidar com crops vazio', () => {
      (useCrops as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
      });

      const { result } = renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      expect(result.current.crops).toEqual([]);
    });

    it('deve lidar com ID vazio na exclusão', () => {
      const mockMutate = jest.fn();
      (useDeleteCrop as jest.Mock).mockReturnValue({ mutate: mockMutate, isPending: false });

      const { result } = renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleDelete('');
      });

      expect(mockMutate).toHaveBeenCalledWith('');
    });

    it('deve lidar com formData vazio na submissão', () => {
      const mockMutate = jest.fn();
      (useCreateCrop as jest.Mock).mockReturnValue({ mutate: mockMutate, isPending: false });

      const { result } = renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      const emptyFormData = { name: '' };

      act(() => {
        result.current.handleSubmit(emptyFormData);
      });

      expect(mockMutate).toHaveBeenCalledWith(emptyFormData);
    });
  });

  describe('Integração com React Router', () => {
    it('deve chamar router.push para cada navegação', () => {
      const { result } = renderHook(() => useCropsListPage(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleNavigateToDashboard();
      });
      expect(mockPush).toHaveBeenCalledWith('/dashboard');

      act(() => {
        result.current.handleNavigateToProducers();
      });
      expect(mockPush).toHaveBeenCalledWith('/producers');

      act(() => {
        result.current.handleNavigateToHarvests();
      });
      expect(mockPush).toHaveBeenCalledWith('/harvests');

      act(() => {
        result.current.handleNavigateToFarmCrops();
      });
      expect(mockPush).toHaveBeenCalledWith('/farm-crops');
    });
  });
});
