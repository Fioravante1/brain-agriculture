import { renderHook, act } from '@testing-library/react';
import { useFarmsListPage } from './use-farms-list-page.hook';

// Mock do useRouter
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock dos hooks de entidades
const mockUseFarms = jest.fn();
const mockUseCreateFarm = jest.fn();
const mockUseUpdateFarm = jest.fn();
const mockUseDeleteFarm = jest.fn();

jest.mock('@/entities/farm', () => ({
  useFarms: () => mockUseFarms(),
  useCreateFarm: () => mockUseCreateFarm(),
  useUpdateFarm: () => mockUseUpdateFarm(),
  useDeleteFarm: () => mockUseDeleteFarm(),
}));

// Mock do FarmFormValues
jest.mock('@/features/farms', () => ({
  FarmFormValues: {},
}));

// Mock do alert
const mockAlert = jest.fn();
global.alert = mockAlert;

// Mock do confirm
const mockConfirm = jest.fn();
global.confirm = mockConfirm;

describe('useFarmsListPage', () => {
  const mockFarms = [
    {
      id: '1',
      producerId: '1',
      name: 'Fazenda São João',
      city: 'São Paulo',
      state: 'SP',
      totalArea: 100,
      arableArea: 80,
      vegetationArea: 20,
      farmCrops: [],
      producer: {
        id: '1',
        name: 'João Silva',
        cpfCnpj: '12345678901',
      },
    },
    {
      id: '2',
      producerId: '2',
      name: 'Fazenda Santa Maria',
      city: 'Rio de Janeiro',
      state: 'RJ',
      totalArea: 200,
      arableArea: 150,
      vegetationArea: 50,
      farmCrops: [],
      producer: {
        id: '2',
        name: 'Maria Santos',
        cpfCnpj: '12345678000195',
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFarms.mockReturnValue({ data: mockFarms, isLoading: false });
    mockUseCreateFarm.mockReturnValue({ mutate: jest.fn(), isPending: false });
    mockUseUpdateFarm.mockReturnValue({ mutate: jest.fn(), isPending: false });
    mockUseDeleteFarm.mockReturnValue({ mutate: jest.fn(), isPending: false });
  });

  it('deve retornar estado inicial correto', () => {
    const { result } = renderHook(() => useFarmsListPage());

    expect(result.current.farms).toEqual(mockFarms);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.editingFarm).toBeNull();
    expect(typeof result.current.handleOpenCreateModal).toBe('function');
    expect(typeof result.current.handleOpenEditModal).toBe('function');
    expect(typeof result.current.handleCloseModal).toBe('function');
    expect(typeof result.current.handleSubmit).toBe('function');
    expect(typeof result.current.handleDelete).toBe('function');
    expect(typeof result.current.handleNavigateToDashboard).toBe('function');
    expect(typeof result.current.handleNavigateToProducers).toBe('function');
    expect(typeof result.current.handleNavigateToCrops).toBe('function');
    expect(typeof result.current.handleNavigateToHarvests).toBe('function');
    expect(typeof result.current.handleNavigateToFarmCrops).toBe('function');
  });

  it('deve abrir modal de criação', () => {
    const { result } = renderHook(() => useFarmsListPage());

    act(() => {
      result.current.handleOpenCreateModal();
    });

    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.editingFarm).toBeNull();
  });

  it('deve abrir modal de edição', () => {
    const { result } = renderHook(() => useFarmsListPage());

    act(() => {
      result.current.handleOpenEditModal(mockFarms[0]);
    });

    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.editingFarm).toEqual(mockFarms[0]);
  });

  it('deve fechar modal', () => {
    const { result } = renderHook(() => useFarmsListPage());

    // Primeiro abre o modal
    act(() => {
      result.current.handleOpenCreateModal();
    });

    expect(result.current.isModalOpen).toBe(true);

    // Depois fecha o modal
    act(() => {
      result.current.handleCloseModal();
    });

    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.editingFarm).toBeNull();
  });

  it('deve submeter formulário para criação', () => {
    const mockMutate = jest.fn();
    mockUseCreateFarm.mockReturnValue({ mutate: mockMutate, isPending: false });

    const { result } = renderHook(() => useFarmsListPage());

    const formData = {
      producerId: '1',
      name: 'Nova Fazenda',
      city: 'São Paulo',
      state: 'SP',
      totalArea: 100,
      arableArea: 80,
      vegetationArea: 20,
    };

    act(() => {
      result.current.handleSubmit(formData);
    });

    expect(mockMutate).toHaveBeenCalledWith(formData);
  });

  it('deve submeter formulário para edição', () => {
    const mockMutate = jest.fn();
    mockUseUpdateFarm.mockReturnValue({ mutate: mockMutate, isPending: false });

    const { result } = renderHook(() => useFarmsListPage());

    // Primeiro abre o modal de edição
    act(() => {
      result.current.handleOpenEditModal(mockFarms[0]);
    });

    const formData = {
      producerId: '1',
      name: 'Fazenda Editada',
      city: 'São Paulo',
      state: 'SP',
      totalArea: 150,
      arableArea: 120,
      vegetationArea: 30,
    };

    act(() => {
      result.current.handleSubmit(formData);
    });

    expect(mockMutate).toHaveBeenCalledWith({ id: mockFarms[0].id, data: formData });
  });

  it('deve excluir fazenda com confirmação', () => {
    const mockMutate = jest.fn();
    mockUseDeleteFarm.mockReturnValue({ mutate: mockMutate, isPending: false });
    mockConfirm.mockReturnValue(true);

    const { result } = renderHook(() => useFarmsListPage());

    act(() => {
      result.current.handleDelete(mockFarms[0]);
    });

    expect(mockConfirm).toHaveBeenCalledWith('Tem certeza que deseja excluir a fazenda "Fazenda São João"?');
    expect(mockMutate).toHaveBeenCalledWith(mockFarms[0].id);
  });

  it('deve cancelar exclusão quando usuário não confirma', () => {
    const mockMutate = jest.fn();
    mockUseDeleteFarm.mockReturnValue({ mutate: mockMutate, isPending: false });
    mockConfirm.mockReturnValue(false);

    const { result } = renderHook(() => useFarmsListPage());

    act(() => {
      result.current.handleDelete(mockFarms[0]);
    });

    expect(mockConfirm).toHaveBeenCalledWith('Tem certeza que deseja excluir a fazenda "Fazenda São João"?');
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('deve navegar para dashboard', () => {
    const { result } = renderHook(() => useFarmsListPage());

    act(() => {
      result.current.handleNavigateToDashboard();
    });

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('deve navegar para produtores', () => {
    const { result } = renderHook(() => useFarmsListPage());

    act(() => {
      result.current.handleNavigateToProducers();
    });

    expect(mockPush).toHaveBeenCalledWith('/producers');
  });

  it('deve navegar para culturas', () => {
    const { result } = renderHook(() => useFarmsListPage());

    act(() => {
      result.current.handleNavigateToCrops();
    });

    expect(mockPush).toHaveBeenCalledWith('/crops');
  });

  it('deve navegar para safras', () => {
    const { result } = renderHook(() => useFarmsListPage());

    act(() => {
      result.current.handleNavigateToHarvests();
    });

    expect(mockPush).toHaveBeenCalledWith('/harvests');
  });

  it('deve navegar para associações', () => {
    const { result } = renderHook(() => useFarmsListPage());

    act(() => {
      result.current.handleNavigateToFarmCrops();
    });

    expect(mockPush).toHaveBeenCalledWith('/farm-crops');
  });

  it('deve retornar mutations corretas', () => {
    const mockCreateFarm = { mutate: jest.fn(), isPending: false };
    const mockUpdateFarm = { mutate: jest.fn(), isPending: false };
    const mockDeleteFarm = { mutate: jest.fn(), isPending: false };

    mockUseCreateFarm.mockReturnValue(mockCreateFarm);
    mockUseUpdateFarm.mockReturnValue(mockUpdateFarm);
    mockUseDeleteFarm.mockReturnValue(mockDeleteFarm);

    const { result } = renderHook(() => useFarmsListPage());

    expect(result.current.createFarm).toEqual(mockCreateFarm);
    expect(result.current.updateFarm).toEqual(mockUpdateFarm);
    expect(result.current.deleteFarm).toEqual(mockDeleteFarm);
  });

  it('deve lidar com fazendas undefined', () => {
    mockUseFarms.mockReturnValue({ data: undefined, isLoading: false });

    const { result } = renderHook(() => useFarmsListPage());

    expect(result.current.farms).toBeUndefined();
  });

  it('deve lidar com fazendas vazias', () => {
    mockUseFarms.mockReturnValue({ data: [], isLoading: false });

    const { result } = renderHook(() => useFarmsListPage());

    expect(result.current.farms).toEqual([]);
  });

  it('deve lidar com ID vazio na exclusão', () => {
    const mockMutate = jest.fn();
    mockUseDeleteFarm.mockReturnValue({ mutate: mockMutate, isPending: false });
    mockConfirm.mockReturnValue(true);

    const { result } = renderHook(() => useFarmsListPage());

    const farmWithEmptyId = { ...mockFarms[0], id: '' };

    act(() => {
      result.current.handleDelete(farmWithEmptyId);
    });

    expect(mockMutate).toHaveBeenCalledWith('');
  });

  it('deve integrar corretamente com useRouter', () => {
    const { result } = renderHook(() => useFarmsListPage());

    act(() => {
      result.current.handleNavigateToDashboard();
    });

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });
});
