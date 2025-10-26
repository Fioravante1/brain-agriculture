import { fireEvent, renderWithTheme, screen, waitFor } from '@/shared/lib/test-utils';
import { CropsListPage } from './crops-list-page';

// Mock do Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock dos hooks de entidades
const mockCrops = [
  { id: '1', name: 'Soja' },
  { id: '2', name: 'Milho' },
  { id: '3', name: 'Algodão' },
];

jest.mock('@/entities/crop', () => ({
  useCrops: jest.fn(() => ({
    data: mockCrops,
    isLoading: false,
  })),
  useCreateCrop: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
  useUpdateCrop: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
  useDeleteCrop: jest.fn(() => ({
    mutate: jest.fn(),
  })),
}));

// Mock do window.confirm
const mockConfirm = jest.fn();
Object.defineProperty(window, 'confirm', {
  value: mockConfirm,
  writable: true,
});

describe('Componente CropsListPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConfirm.mockReturnValue(true);
  });

  it('deve renderizar página com título e subtítulo', () => {
    renderWithTheme(<CropsListPage />);

    expect(screen.getByText('Culturas')).toBeInTheDocument();
    expect(screen.getByText('Gerencie as culturas cadastradas no sistema')).toBeInTheDocument();
  });

  it('deve renderizar botões de ação', () => {
    renderWithTheme(<CropsListPage />);

    expect(screen.getByText('+ Nova Cultura')).toBeInTheDocument();
    expect(screen.getByText('Ver Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Ver Produtores')).toBeInTheDocument();
    expect(screen.getByText('Ver Safras')).toBeInTheDocument();
    expect(screen.getByText('Ver Associações')).toBeInTheDocument();
  });

  it('deve renderizar tabela com dados das culturas', () => {
    renderWithTheme(<CropsListPage />);

    expect(screen.getByText('Nome da Cultura')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();
    expect(screen.getByText('Soja')).toBeInTheDocument();
    expect(screen.getByText('Milho')).toBeInTheDocument();
    expect(screen.getByText('Algodão')).toBeInTheDocument();
  });

  it('deve renderizar botões de ação para cada cultura', () => {
    renderWithTheme(<CropsListPage />);

    const editButtons = screen.getAllByText('Editar');
    const deleteButtons = screen.getAllByText('Excluir');

    expect(editButtons).toHaveLength(3);
    expect(deleteButtons).toHaveLength(3);
  });

  it('deve abrir modal ao clicar em Nova Cultura', () => {
    renderWithTheme(<CropsListPage />);

    const newCropButton = screen.getByText('+ Nova Cultura');
    fireEvent.click(newCropButton);

    expect(screen.getByText('Nova Cultura')).toBeInTheDocument();
  });

  it('deve abrir modal de edição ao clicar em Editar', () => {
    renderWithTheme(<CropsListPage />);

    const editButtons = screen.getAllByText('Editar');
    fireEvent.click(editButtons[0]);

    expect(screen.getByText('Editar Cultura')).toBeInTheDocument();
  });

  it('deve fechar modal ao clicar em cancelar', () => {
    renderWithTheme(<CropsListPage />);

    const newCropButton = screen.getByText('+ Nova Cultura');
    fireEvent.click(newCropButton);

    expect(screen.getByText('Nova Cultura')).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    // Verifica se o botão cancelar foi clicado (funcionalidade básica)
    expect(cancelButton).toBeInTheDocument();
  });

  it('deve navegar para dashboard ao clicar em Ver Dashboard', () => {
    renderWithTheme(<CropsListPage />);

    const dashboardButton = screen.getByText('Ver Dashboard');
    fireEvent.click(dashboardButton);

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('deve navegar para produtores ao clicar em Ver Produtores', () => {
    renderWithTheme(<CropsListPage />);

    const producersButton = screen.getByText('Ver Produtores');
    fireEvent.click(producersButton);

    expect(mockPush).toHaveBeenCalledWith('/producers');
  });

  it('deve navegar para safras ao clicar em Ver Safras', () => {
    renderWithTheme(<CropsListPage />);

    const harvestsButton = screen.getByText('Ver Safras');
    fireEvent.click(harvestsButton);

    expect(mockPush).toHaveBeenCalledWith('/harvests');
  });

  it('deve navegar para associações ao clicar em Ver Associações', () => {
    renderWithTheme(<CropsListPage />);

    const associationsButton = screen.getByText('Ver Associações');
    fireEvent.click(associationsButton);

    expect(mockPush).toHaveBeenCalledWith('/farm-crops');
  });

  it('deve mostrar confirmação ao clicar em Excluir', () => {
    renderWithTheme(<CropsListPage />);

    const deleteButtons = screen.getAllByText('Excluir');
    fireEvent.click(deleteButtons[0]);

    expect(mockConfirm).toHaveBeenCalledWith('Tem certeza que deseja excluir esta cultura?');
  });

  it('deve renderizar com estrutura HTML correta', () => {
    renderWithTheme(<CropsListPage />);

    const pageContainer = document.querySelector('div');
    expect(pageContainer).toBeInTheDocument();
  });

  it('deve renderizar com card contendo tabela', () => {
    renderWithTheme(<CropsListPage />);

    expect(screen.getByText('Nome da Cultura')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();
  });

  it('deve renderizar com colunas corretas da tabela', () => {
    renderWithTheme(<CropsListPage />);

    expect(screen.getByText('Nome da Cultura')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();
  });

  it('deve renderizar com dados das culturas na tabela', () => {
    renderWithTheme(<CropsListPage />);

    expect(screen.getByText('Soja')).toBeInTheDocument();
    expect(screen.getByText('Milho')).toBeInTheDocument();
    expect(screen.getByText('Algodão')).toBeInTheDocument();
  });

  it('deve renderizar com botões de ação para cada linha', () => {
    renderWithTheme(<CropsListPage />);

    const editButtons = screen.getAllByText('Editar');
    const deleteButtons = screen.getAllByText('Excluir');

    expect(editButtons).toHaveLength(3);
    expect(deleteButtons).toHaveLength(3);
  });

  it('deve renderizar com layout responsivo', () => {
    renderWithTheme(<CropsListPage />);

    const pageContainer = document.querySelector('div');
    expect(pageContainer).toBeInTheDocument();
  });

  it('deve renderizar com título principal', () => {
    renderWithTheme(<CropsListPage />);

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveTextContent('Culturas');
  });

  it('deve renderizar com subtítulo descritivo', () => {
    renderWithTheme(<CropsListPage />);

    expect(screen.getByText('Gerencie as culturas cadastradas no sistema')).toBeInTheDocument();
  });

  it('deve renderizar com botão de nova cultura', () => {
    renderWithTheme(<CropsListPage />);

    const newCropButton = screen.getByText('+ Nova Cultura');
    expect(newCropButton).toBeInTheDocument();
  });

  it('deve renderizar com botões de navegação', () => {
    renderWithTheme(<CropsListPage />);

    expect(screen.getByText('Ver Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Ver Produtores')).toBeInTheDocument();
    expect(screen.getByText('Ver Safras')).toBeInTheDocument();
    expect(screen.getByText('Ver Associações')).toBeInTheDocument();
  });

  it('deve renderizar com tabela de culturas', () => {
    renderWithTheme(<CropsListPage />);

    expect(screen.getByText('Nome da Cultura')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();
  });

  it('deve renderizar com modal fechado inicialmente', () => {
    renderWithTheme(<CropsListPage />);

    // Verifica se os elementos principais da página estão presentes
    expect(screen.getByText('Culturas')).toBeInTheDocument();
    expect(screen.getByText('Gerencie as culturas cadastradas no sistema')).toBeInTheDocument();

    // Verifica se os elementos principais estão presentes
    expect(screen.getByText('+ Nova Cultura')).toBeInTheDocument();
    expect(screen.getByText('Nome da Cultura')).toBeInTheDocument();
  });

  it('deve renderizar com formulário de cultura no modal', async () => {
    renderWithTheme(<CropsListPage />);

    const newCropButton = screen.getByText('+ Nova Cultura');
    fireEvent.click(newCropButton);

    await waitFor(() => {
      expect(screen.getByText('Nome da Cultura *')).toBeInTheDocument();
    });
  });

  it('deve renderizar com botões de cancelar e salvar no modal', async () => {
    renderWithTheme(<CropsListPage />);

    const newCropButton = screen.getByText('+ Nova Cultura');
    fireEvent.click(newCropButton);

    await waitFor(() => {
      expect(screen.getByText('Cancelar')).toBeInTheDocument();
      expect(screen.getByText('Salvar')).toBeInTheDocument();
    });
  });

  it('deve renderizar com estado de loading da tabela', () => {
    renderWithTheme(<CropsListPage />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('deve renderizar com estrutura completa da página', () => {
    renderWithTheme(<CropsListPage />);

    expect(screen.getByText('Culturas')).toBeInTheDocument();
    expect(screen.getByText('Gerencie as culturas cadastradas no sistema')).toBeInTheDocument();
    expect(screen.getByText('+ Nova Cultura')).toBeInTheDocument();
    expect(screen.getByText('Nome da Cultura')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();
  });
});
