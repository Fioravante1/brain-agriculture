import { renderHook, act } from '@testing-library/react';
import { useFarmCropsListPage } from './use-farm-crops-list-page.hook';

// Mock do useRouter
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock dos hooks de entidades
const mockUseFarmCrops = jest.fn();
const mockUseCreateFarmCrop = jest.fn();
const mockUseDeleteFarmCrop = jest.fn();

jest.mock('@/entities/farm-crop', () => ({
  useFarmCrops: () => mockUseFarmCrops(),
  useCreateFarmCrop: () => mockUseCreateFarmCrop(),
  useDeleteFarmCrop: () => mockUseDeleteFarmCrop(),
}));

// Mock do FarmCropFormValues
jest.mock('@/features/farm-crops', () => ({
  FarmCropFormValues: {},
}));

// Mock do alert
const mockAlert = jest.fn();
global.alert = mockAlert;

// Mock do confirm
const mockConfirm = jest.fn();
global.confirm = mockConfirm;

describe('useFarmCropsListPage', () => {
  const mockFarmCrops = [
    {
      id: '1',
      farmId: '1',
      cropId: '1',
      harvestId: '1',
      createdAt: new Date('2021-01-01T00:00:00.000Z'),
      updatedAt: new Date('2021-01-01T00:00:00.000Z'),
      farm: {
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
      crop: {
        id: '1',
        name: 'Soja',
        createdAt: '2021-01-01T00:00:00.000Z',
        updatedAt: '2021-01-01T00:00:00.000Z',
      },
      harvest: {
        id: '1',
        name: 'Safra 2021',
        year: 2021,
        createdAt: '2021-01-01T00:00:00.000Z',
        updatedAt: '2021-01-01T00:00:00.000Z',
      },
    },
    {
      id: '2',
      farmId: '2',
      cropId: '2',
      harvestId: '2',
      createdAt: new Date('2021-01-01T00:00:00.000Z'),
      updatedAt: new Date('2021-01-01T00:00:00.000Z'),
      farm: {
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
      crop: {
        id: '2',
        name: 'Milho',
        createdAt: '2021-01-01T00:00:00.000Z',
        updatedAt: '2021-01-01T00:00:00.000Z',
      },
      harvest: {
        id: '2',
        name: 'Safra 2022',
        year: 2022,
        createdAt: '2021-01-01T00:00:00.000Z',
        updatedAt: '2021-01-01T00:00:00.000Z',
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFarmCrops.mockReturnValue({ data: mockFarmCrops, isLoading: false });
    mockUseCreateFarmCrop.mockReturnValue({ mutate: jest.fn(), isPending: false });
    mockUseDeleteFarmCrop.mockReturnValue({ mutate: jest.fn(), isPending: false });
  });

  it('deve retornar estado inicial correto', () => {
    const { result } = renderHook(() => useFarmCropsListPage());

    expect(result.current.farmCrops).toEqual(mockFarmCrops);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isModalOpen).toBe(false);
    expect(typeof result.current.handleOpenCreateModal).toBe('function');
    expect(typeof result.current.handleCloseModal).toBe('function');
    expect(typeof result.current.handleSubmit).toBe('function');
    expect(typeof result.current.handleDelete).toBe('function');
    expect(typeof result.current.handleNavigateToDashboard).toBe('function');
    expect(typeof result.current.handleNavigateToProducers).toBe('function');
    expect(typeof result.current.handleNavigateToFarms).toBe('function');
    expect(typeof result.current.handleNavigateToCrops).toBe('function');
    expect(typeof result.current.handleNavigateToHarvests).toBe('function');
  });

  it('deve abrir modal de criação', () => {
    const { result } = renderHook(() => useFarmCropsListPage());

    act(() => {
      result.current.handleOpenCreateModal();
    });

    expect(result.current.isModalOpen).toBe(true);
  });

  it('deve fechar modal', () => {
    const { result } = renderHook(() => useFarmCropsListPage());

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
  });

  it('deve submeter formulário para criação', () => {
    const mockMutate = jest.fn();
    mockUseCreateFarmCrop.mockReturnValue({ mutate: mockMutate, isPending: false });

    const { result } = renderHook(() => useFarmCropsListPage());

    const formData = {
      farmId: '1',
      cropId: '1',
      harvestId: '1',
    };

    act(() => {
      result.current.handleSubmit(formData);
    });

    expect(mockMutate).toHaveBeenCalledWith(formData);
  });

  it('deve excluir associação com confirmação', () => {
    const mockMutate = jest.fn();
    mockUseDeleteFarmCrop.mockReturnValue({ mutate: mockMutate, isPending: false });
    mockConfirm.mockReturnValue(true);

    const { result } = renderHook(() => useFarmCropsListPage());

    act(() => {
      result.current.handleDelete(mockFarmCrops[0]);
    });

    expect(mockConfirm).toHaveBeenCalledWith('Tem certeza que deseja excluir a associação "Fazenda São João - Soja - Safra 2021"?');
    expect(mockMutate).toHaveBeenCalledWith(mockFarmCrops[0].id);
  });

  it('deve cancelar exclusão quando usuário não confirma', () => {
    const mockMutate = jest.fn();
    mockUseDeleteFarmCrop.mockReturnValue({ mutate: mockMutate, isPending: false });
    mockConfirm.mockReturnValue(false);

    const { result } = renderHook(() => useFarmCropsListPage());

    act(() => {
      result.current.handleDelete(mockFarmCrops[0]);
    });

    expect(mockConfirm).toHaveBeenCalledWith('Tem certeza que deseja excluir a associação "Fazenda São João - Soja - Safra 2021"?');
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('deve navegar para dashboard', () => {
    const { result } = renderHook(() => useFarmCropsListPage());

    act(() => {
      result.current.handleNavigateToDashboard();
    });

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('deve navegar para produtores', () => {
    const { result } = renderHook(() => useFarmCropsListPage());

    act(() => {
      result.current.handleNavigateToProducers();
    });

    expect(mockPush).toHaveBeenCalledWith('/producers');
  });

  it('deve navegar para fazendas', () => {
    const { result } = renderHook(() => useFarmCropsListPage());

    act(() => {
      result.current.handleNavigateToFarms();
    });

    expect(mockPush).toHaveBeenCalledWith('/farms');
  });

  it('deve navegar para culturas', () => {
    const { result } = renderHook(() => useFarmCropsListPage());

    act(() => {
      result.current.handleNavigateToCrops();
    });

    expect(mockPush).toHaveBeenCalledWith('/crops');
  });

  it('deve navegar para safras', () => {
    const { result } = renderHook(() => useFarmCropsListPage());

    act(() => {
      result.current.handleNavigateToHarvests();
    });

    expect(mockPush).toHaveBeenCalledWith('/harvests');
  });

  it('deve retornar mutations corretas', () => {
    const mockCreateFarmCrop = { mutate: jest.fn(), isPending: false };
    const mockDeleteFarmCrop = { mutate: jest.fn(), isPending: false };

    mockUseCreateFarmCrop.mockReturnValue(mockCreateFarmCrop);
    mockUseDeleteFarmCrop.mockReturnValue(mockDeleteFarmCrop);

    const { result } = renderHook(() => useFarmCropsListPage());

    expect(result.current.createFarmCrop).toEqual(mockCreateFarmCrop);
    expect(result.current.deleteFarmCrop).toEqual(mockDeleteFarmCrop);
  });

  it('deve lidar com associações undefined', () => {
    mockUseFarmCrops.mockReturnValue({ data: undefined, isLoading: false });

    const { result } = renderHook(() => useFarmCropsListPage());

    expect(result.current.farmCrops).toBeUndefined();
  });

  it('deve lidar com associações vazias', () => {
    mockUseFarmCrops.mockReturnValue({ data: [], isLoading: false });

    const { result } = renderHook(() => useFarmCropsListPage());

    expect(result.current.farmCrops).toEqual([]);
  });

  it('deve integrar corretamente com useRouter', () => {
    const { result } = renderHook(() => useFarmCropsListPage());

    act(() => {
      result.current.handleNavigateToDashboard();
    });

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });
});
