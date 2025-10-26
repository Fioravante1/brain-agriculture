import { renderHook, act } from '@testing-library/react';
import { useHarvestsListPage } from './use-harvests-list-page.hook';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@/entities/harvest', () => ({
  useHarvests: jest.fn(),
  useCreateHarvest: jest.fn(),
  useUpdateHarvest: jest.fn(),
  useDeleteHarvest: jest.fn(),
}));

import { useHarvests, useCreateHarvest, useUpdateHarvest, useDeleteHarvest } from '@/entities/harvest';

const mockHarvests = [
  {
    id: '1',
    name: 'Safra 2021',
    year: 2021,
    createdAt: new Date('2021-01-01'),
    updatedAt: new Date('2021-01-01'),
  },
  {
    id: '2',
    name: 'Safra 2022',
    year: 2022,
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2022-01-01'),
  },
];

const mockCreateHarvest = {
  mutate: jest.fn(),
  isPending: false,
};

const mockUpdateHarvest = {
  mutate: jest.fn(),
  isPending: false,
};

const mockDeleteHarvest = {
  mutate: jest.fn(),
  isPending: false,
};

describe('useHarvestsListPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useHarvests as jest.Mock).mockReturnValue({
      data: mockHarvests,
      isLoading: false,
    });

    (useCreateHarvest as jest.Mock).mockReturnValue(mockCreateHarvest);
    (useUpdateHarvest as jest.Mock).mockReturnValue(mockUpdateHarvest);
    (useDeleteHarvest as jest.Mock).mockReturnValue(mockDeleteHarvest);
  });

  it('deve retornar estado inicial correto', () => {
    const { result } = renderHook(() => useHarvestsListPage());

    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.editingHarvest).toBeNull();
    expect(result.current.harvests).toEqual(mockHarvests);
    expect(result.current.isLoading).toBe(false);
  });

  it('deve abrir modal de criação', () => {
    const { result } = renderHook(() => useHarvestsListPage());

    act(() => {
      result.current.handleOpenCreateModal();
    });

    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.editingHarvest).toBeNull();
  });

  it('deve abrir modal de edição', () => {
    const { result } = renderHook(() => useHarvestsListPage());

    act(() => {
      result.current.handleOpenEditModal(mockHarvests[0]);
    });

    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.editingHarvest).toEqual(mockHarvests[0]);
  });

  it('deve fechar modal', () => {
    const { result } = renderHook(() => useHarvestsListPage());

    act(() => {
      result.current.handleOpenCreateModal();
    });

    expect(result.current.isModalOpen).toBe(true);

    act(() => {
      result.current.handleCloseModal();
    });

    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.editingHarvest).toBeNull();
  });

  it('deve submeter formulário para criação', () => {
    const { result } = renderHook(() => useHarvestsListPage());
    const formData = { name: 'Nova Safra', year: 2023 };

    act(() => {
      result.current.handleSubmit(formData);
    });

    expect(mockCreateHarvest.mutate).toHaveBeenCalledWith(formData);
  });

  it('deve submeter formulário para edição', () => {
    const { result } = renderHook(() => useHarvestsListPage());
    const formData = { name: 'Safra Editada', year: 2023 };

    act(() => {
      result.current.handleOpenEditModal(mockHarvests[0]);
    });

    act(() => {
      result.current.handleSubmit(formData);
    });

    expect(mockUpdateHarvest.mutate).toHaveBeenCalledWith({
      id: mockHarvests[0].id,
      data: formData,
    });
  });

  it('deve deletar safra com confirmação', () => {
    const { result } = renderHook(() => useHarvestsListPage());
    const mockConfirm = jest.spyOn(window, 'confirm').mockReturnValue(true);

    act(() => {
      result.current.handleDelete('1');
    });

    expect(mockConfirm).toHaveBeenCalledWith('Tem certeza que deseja excluir esta safra?');
    expect(mockDeleteHarvest.mutate).toHaveBeenCalledWith('1');

    mockConfirm.mockRestore();
  });

  it('deve cancelar exclusão quando usuário não confirma', () => {
    const { result } = renderHook(() => useHarvestsListPage());
    const mockConfirm = jest.spyOn(window, 'confirm').mockReturnValue(false);

    act(() => {
      result.current.handleDelete('1');
    });

    expect(mockConfirm).toHaveBeenCalledWith('Tem certeza que deseja excluir esta safra?');
    expect(mockDeleteHarvest.mutate).not.toHaveBeenCalled();

    mockConfirm.mockRestore();
  });

  it('deve navegar para dashboard', () => {
    const { result } = renderHook(() => useHarvestsListPage());

    act(() => {
      result.current.handleNavigateToDashboard();
    });

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('deve navegar para produtores', () => {
    const { result } = renderHook(() => useHarvestsListPage());

    act(() => {
      result.current.handleNavigateToProducers();
    });

    expect(mockPush).toHaveBeenCalledWith('/producers');
  });

  it('deve navegar para fazendas', () => {
    const { result } = renderHook(() => useHarvestsListPage());

    act(() => {
      result.current.handleNavigateToFarms();
    });

    expect(mockPush).toHaveBeenCalledWith('/farms');
  });

  it('deve navegar para associações', () => {
    const { result } = renderHook(() => useHarvestsListPage());

    act(() => {
      result.current.handleNavigateToFarmCrops();
    });

    expect(mockPush).toHaveBeenCalledWith('/farm-crops');
  });

  it('deve retornar estado de loading correto', () => {
    (useHarvests as jest.Mock).mockReturnValue({
      data: mockHarvests,
      isLoading: true,
    });

    const { result } = renderHook(() => useHarvestsListPage());

    expect(result.current.isLoading).toBe(true);
  });

  it('deve retornar harvests undefined quando não há dados', () => {
    (useHarvests as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    const { result } = renderHook(() => useHarvestsListPage());

    expect(result.current.harvests).toBeUndefined();
  });

  it('deve retornar harvests vazio quando array está vazio', () => {
    (useHarvests as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });

    const { result } = renderHook(() => useHarvestsListPage());

    expect(result.current.harvests).toEqual([]);
  });

  it('deve retornar estado de pending correto para createHarvest', () => {
    (useCreateHarvest as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: true,
    });

    const { result } = renderHook(() => useHarvestsListPage());

    expect(result.current.createHarvest.isPending).toBe(true);
  });

  it('deve retornar estado de pending correto para updateHarvest', () => {
    (useUpdateHarvest as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: true,
    });

    const { result } = renderHook(() => useHarvestsListPage());

    expect(result.current.updateHarvest.isPending).toBe(true);
  });

  it('deve retornar estado de pending correto para deleteHarvest', () => {
    (useDeleteHarvest as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: true,
    });

    const { result } = renderHook(() => useHarvestsListPage());

    expect(result.current.deleteHarvest.isPending).toBe(true);
  });

  it('deve retornar todos os valores e funções necessárias', () => {
    const { result } = renderHook(() => useHarvestsListPage());

    expect(result.current).toHaveProperty('harvests');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('isModalOpen');
    expect(result.current).toHaveProperty('editingHarvest');
    expect(result.current).toHaveProperty('handleOpenCreateModal');
    expect(result.current).toHaveProperty('handleOpenEditModal');
    expect(result.current).toHaveProperty('handleCloseModal');
    expect(result.current).toHaveProperty('handleSubmit');
    expect(result.current).toHaveProperty('handleDelete');
    expect(result.current).toHaveProperty('handleNavigateToDashboard');
    expect(result.current).toHaveProperty('handleNavigateToProducers');
    expect(result.current).toHaveProperty('handleNavigateToFarms');
    expect(result.current).toHaveProperty('handleNavigateToFarmCrops');
    expect(result.current).toHaveProperty('createHarvest');
    expect(result.current).toHaveProperty('updateHarvest');
    expect(result.current).toHaveProperty('deleteHarvest');
  });

  it('deve chamar useCreateHarvest com callbacks corretos', () => {
    renderHook(() => useHarvestsListPage());

    expect(useCreateHarvest).toHaveBeenCalledWith({
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    });
  });

  it('deve chamar useUpdateHarvest com callbacks corretos', () => {
    renderHook(() => useHarvestsListPage());

    expect(useUpdateHarvest).toHaveBeenCalledWith({
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    });
  });

  it('deve chamar useDeleteHarvest com callbacks corretos', () => {
    renderHook(() => useHarvestsListPage());

    expect(useDeleteHarvest).toHaveBeenCalledWith({
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    });
  });
});
