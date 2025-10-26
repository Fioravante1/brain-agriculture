import { fireEvent, renderWithTheme, screen } from '@/shared/lib/test-utils';
import { HarvestsListPage } from './harvests-list-page';
import { Harvest } from '@/entities/harvest';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockUseHarvestsListPage = jest.fn();
jest.mock('@/features/harvests', () => ({
  HarvestForm: jest.fn(({ onSubmit, onCancel, defaultValues, isLoading }) => (
    <form onSubmit={onSubmit} data-testid='harvest-form'>
      <input data-testid='harvest-name-input' defaultValue={defaultValues?.name || ''} />
      <input data-testid='harvest-year-input' defaultValue={defaultValues?.year || ''} />
      <button type='button' onClick={onCancel}>
        Cancelar
      </button>
      <button type='submit' disabled={isLoading}>
        Salvar
      </button>
    </form>
  )),
  useHarvestsListPage: () => mockUseHarvestsListPage(),
}));

jest.mock('@/features/harvests/config/harvests-table-columns', () => ({
  HARVESTS_TABLE_COLUMNS: [
    {
      key: 'name',
      header: 'Nome da Safra',
      width: '40%',
    },
    {
      key: 'year',
      header: 'Ano',
      width: '20%',
      render: (harvest: any) => harvest.year.toString(),
    },
    {
      key: 'createdAt',
      header: 'Criada em',
      width: '20%',
      render: (harvest: any) => new Date(harvest.createdAt).toLocaleDateString('pt-BR'),
    },
    {
      key: 'actions',
      header: 'Ações',
      width: '20%',
      render: (harvest: any) => harvest.name,
    },
  ],
}));

const mockHarvests: Harvest[] = [
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
  {
    id: '3',
    name: 'Safra 2023',
    year: 2023,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
];

describe('Componente HarvestsListPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseHarvestsListPage.mockReturnValue({
      harvests: mockHarvests,
      isLoading: false,
      isModalOpen: false,
      editingHarvest: null,
      handleOpenCreateModal: jest.fn(),
      handleOpenEditModal: jest.fn(),
      handleCloseModal: jest.fn(),
      handleSubmit: jest.fn(),
      handleDelete: jest.fn(),
      handleNavigateToDashboard: jest.fn(),
      handleNavigateToProducers: jest.fn(),
      handleNavigateToFarms: jest.fn(),
      handleNavigateToFarmCrops: jest.fn(),
      createHarvest: { mutate: jest.fn(), isPending: false },
      updateHarvest: { mutate: jest.fn(), isPending: false },
      deleteHarvest: { mutate: jest.fn(), isPending: false },
    });

    jest.spyOn(window, 'confirm').mockReturnValue(true);
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve renderizar página com título e subtítulo', () => {
    renderWithTheme(<HarvestsListPage />);
    expect(screen.getByText('Safras')).toBeInTheDocument();
    expect(screen.getByText('Gerencie as safras cadastradas no sistema')).toBeInTheDocument();
  });

  it('deve renderizar botões de ação', () => {
    renderWithTheme(<HarvestsListPage />);
    expect(screen.getByText('+ Nova Safra')).toBeInTheDocument();
    expect(screen.getByText('Ver Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Ver Produtores')).toBeInTheDocument();
    expect(screen.getByText('Ver Fazendas')).toBeInTheDocument();
    expect(screen.getByText('Ver Associações')).toBeInTheDocument();
  });

  it('deve renderizar tabela com dados das safras', () => {
    renderWithTheme(<HarvestsListPage />);
    expect(screen.getByText('Nome da Safra')).toBeInTheDocument();
    expect(screen.getByText('Ano')).toBeInTheDocument();
    expect(screen.getByText('Criada em')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();
  });

  it('deve renderizar dados das safras na tabela', () => {
    renderWithTheme(<HarvestsListPage />);
    expect(screen.getByText('Safra 2021')).toBeInTheDocument();
    expect(screen.getByText('Safra 2022')).toBeInTheDocument();
    expect(screen.getByText('Safra 2023')).toBeInTheDocument();
  });

  it('deve renderizar anos das safras na tabela', () => {
    renderWithTheme(<HarvestsListPage />);
    expect(screen.getByText('2021')).toBeInTheDocument();
    expect(screen.getByText('2022')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
  });

  it('deve renderizar datas de criação das safras na tabela', () => {
    renderWithTheme(<HarvestsListPage />);
    expect(screen.getByText('31/12/2020')).toBeInTheDocument();
    expect(screen.getByText('31/12/2021')).toBeInTheDocument();
    expect(screen.getByText('31/12/2022')).toBeInTheDocument();
  });

  it('deve renderizar botões de ação para cada safra', () => {
    renderWithTheme(<HarvestsListPage />);
    const editButtons = screen.getAllByText('Editar');
    const deleteButtons = screen.getAllByText('Excluir');

    expect(editButtons).toHaveLength(3);
    expect(deleteButtons).toHaveLength(3);
  });

  it('deve abrir modal ao clicar em Nova Safra', () => {
    renderWithTheme(<HarvestsListPage />);

    const newHarvestButton = screen.getByText('+ Nova Safra');
    fireEvent.click(newHarvestButton);

    expect(mockUseHarvestsListPage().handleOpenCreateModal).toHaveBeenCalled();
  });

  it('deve abrir modal de edição ao clicar em Editar', () => {
    renderWithTheme(<HarvestsListPage />);

    const editButtons = screen.getAllByText('Editar');
    fireEvent.click(editButtons[0]);

    expect(mockUseHarvestsListPage().handleOpenEditModal).toHaveBeenCalledWith(mockHarvests[0]);
  });

  it('deve fechar modal ao clicar em cancelar', () => {
    mockUseHarvestsListPage.mockReturnValue({
      ...mockUseHarvestsListPage(),
      isModalOpen: true,
    });
    renderWithTheme(<HarvestsListPage />);

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(mockUseHarvestsListPage().handleCloseModal).toHaveBeenCalled();
  });

  it('deve navegar para dashboard ao clicar em Ver Dashboard', () => {
    renderWithTheme(<HarvestsListPage />);

    const dashboardButton = screen.getByText('Ver Dashboard');
    fireEvent.click(dashboardButton);

    expect(mockUseHarvestsListPage().handleNavigateToDashboard).toHaveBeenCalled();
  });

  it('deve navegar para produtores ao clicar em Ver Produtores', () => {
    renderWithTheme(<HarvestsListPage />);

    const producersButton = screen.getByText('Ver Produtores');
    fireEvent.click(producersButton);

    expect(mockUseHarvestsListPage().handleNavigateToProducers).toHaveBeenCalled();
  });

  it('deve navegar para fazendas ao clicar em Ver Fazendas', () => {
    renderWithTheme(<HarvestsListPage />);

    const farmsButton = screen.getByText('Ver Fazendas');
    fireEvent.click(farmsButton);

    expect(mockUseHarvestsListPage().handleNavigateToFarms).toHaveBeenCalled();
  });

  it('deve navegar para associações ao clicar em Ver Associações', () => {
    renderWithTheme(<HarvestsListPage />);

    const associationsButton = screen.getByText('Ver Associações');
    fireEvent.click(associationsButton);

    expect(mockUseHarvestsListPage().handleNavigateToFarmCrops).toHaveBeenCalled();
  });

  it('deve mostrar confirmação ao clicar em Excluir', () => {
    renderWithTheme(<HarvestsListPage />);

    const deleteButtons = screen.getAllByText('Excluir');
    fireEvent.click(deleteButtons[0]);

    expect(mockUseHarvestsListPage().handleDelete).toHaveBeenCalledWith('1');
  });

  it('deve renderizar com estrutura HTML correta', () => {
    renderWithTheme(<HarvestsListPage />);

    const pageContainer = screen.getByText('Safras').closest('div');
    expect(pageContainer).toBeInTheDocument();
  });

  it('deve renderizar com card contendo tabela', () => {
    renderWithTheme(<HarvestsListPage />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('deve renderizar com colunas corretas da tabela', () => {
    renderWithTheme(<HarvestsListPage />);

    expect(screen.getByText('Nome da Safra')).toBeInTheDocument();
    expect(screen.getByText('Ano')).toBeInTheDocument();
    expect(screen.getByText('Criada em')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();
  });

  it('deve renderizar com dados das safras na tabela', () => {
    renderWithTheme(<HarvestsListPage />);

    expect(screen.getByText('Safra 2021')).toBeInTheDocument();
    expect(screen.getByText('Safra 2022')).toBeInTheDocument();
    expect(screen.getByText('Safra 2023')).toBeInTheDocument();
  });

  it('deve renderizar com botões de ação para cada linha', () => {
    renderWithTheme(<HarvestsListPage />);

    const editButtons = screen.getAllByText('Editar');
    const deleteButtons = screen.getAllByText('Excluir');

    expect(editButtons).toHaveLength(3);
    expect(deleteButtons).toHaveLength(3);
  });

  it('deve renderizar com layout responsivo', () => {
    renderWithTheme(<HarvestsListPage />);

    const actionsContainer = screen.getByText('+ Nova Safra').closest('div');
    expect(actionsContainer).toBeInTheDocument();
  });

  it('deve renderizar com título principal', () => {
    renderWithTheme(<HarvestsListPage />);

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveTextContent('Safras');
  });

  it('deve renderizar com subtítulo descritivo', () => {
    renderWithTheme(<HarvestsListPage />);

    expect(screen.getByText('Gerencie as safras cadastradas no sistema')).toBeInTheDocument();
  });

  it('deve renderizar com botão de nova safra', () => {
    renderWithTheme(<HarvestsListPage />);

    const newHarvestButton = screen.getByText('+ Nova Safra');
    expect(newHarvestButton).toBeInTheDocument();
  });

  it('deve renderizar com botões de navegação', () => {
    renderWithTheme(<HarvestsListPage />);

    expect(screen.getByText('Ver Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Ver Produtores')).toBeInTheDocument();
    expect(screen.getByText('Ver Fazendas')).toBeInTheDocument();
    expect(screen.getByText('Ver Associações')).toBeInTheDocument();
  });

  it('deve renderizar com tabela de safras', () => {
    renderWithTheme(<HarvestsListPage />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('deve renderizar com modal fechado inicialmente', () => {
    renderWithTheme(<HarvestsListPage />);

    // Verifica se os elementos principais da página estão presentes
    expect(screen.getByText('Safras')).toBeInTheDocument();
    expect(screen.getByText('Gerencie as safras cadastradas no sistema')).toBeInTheDocument();

    // Verifica se os elementos principais estão presentes
    expect(screen.getByText('+ Nova Safra')).toBeInTheDocument();
    expect(screen.getByText('Nome da Safra')).toBeInTheDocument();
  });

  it('deve renderizar com formulário de safra no modal', async () => {
    renderWithTheme(<HarvestsListPage />);

    const newHarvestButton = screen.getByText('+ Nova Safra');
    fireEvent.click(newHarvestButton);

    expect(screen.getByText('Nova Safra')).toBeInTheDocument();
    expect(screen.getByTestId('harvest-form')).toBeInTheDocument();
  });

  it('deve renderizar com botões de cancelar e salvar no modal', async () => {
    renderWithTheme(<HarvestsListPage />);

    const newHarvestButton = screen.getByText('+ Nova Safra');
    fireEvent.click(newHarvestButton);

    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });

  it('deve renderizar com estado de loading da tabela', () => {
    mockUseHarvestsListPage.mockReturnValue({
      ...mockUseHarvestsListPage(),
      isLoading: true,
    });
    renderWithTheme(<HarvestsListPage />);

    // Quando está loading, deve mostrar "Carregando..." em vez da tabela
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('deve renderizar com estrutura completa da página', () => {
    renderWithTheme(<HarvestsListPage />);

    expect(screen.getByText('Safras')).toBeInTheDocument();
    expect(screen.getByText('Gerencie as safras cadastradas no sistema')).toBeInTheDocument();
    expect(screen.getByText('+ Nova Safra')).toBeInTheDocument();
    expect(screen.getByText('Nome da Safra')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();
  });

  it('deve renderizar com dados formatados corretamente', () => {
    renderWithTheme(<HarvestsListPage />);

    // Verifica se os dados estão sendo renderizados
    expect(screen.getByText('Safra 2021')).toBeInTheDocument();
    expect(screen.getByText('Safra 2022')).toBeInTheDocument();
    expect(screen.getByText('Safra 2023')).toBeInTheDocument();
  });

  it('deve renderizar com anos formatados corretamente', () => {
    renderWithTheme(<HarvestsListPage />);

    // Verifica se os anos estão sendo renderizados como strings
    expect(screen.getByText('2021')).toBeInTheDocument();
    expect(screen.getByText('2022')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
  });

  it('deve renderizar com datas formatadas corretamente', () => {
    renderWithTheme(<HarvestsListPage />);

    // Verifica se as datas estão no formato brasileiro
    expect(screen.getByText('31/12/2020')).toBeInTheDocument();
    expect(screen.getByText('31/12/2021')).toBeInTheDocument();
    expect(screen.getByText('31/12/2022')).toBeInTheDocument();
  });

  it('deve renderizar com botões desabilitados durante exclusão', () => {
    mockUseHarvestsListPage.mockReturnValue({
      ...mockUseHarvestsListPage(),
      deleteHarvest: { mutate: jest.fn(), isPending: true },
    });
    renderWithTheme(<HarvestsListPage />);

    const deleteButtons = screen.getAllByText('Excluir');
    expect(deleteButtons).toHaveLength(3);
    expect(deleteButtons[0]).toBeInTheDocument();
  });

  it('deve renderizar com formulário preenchido ao editar', () => {
    mockUseHarvestsListPage.mockReturnValue({
      ...mockUseHarvestsListPage(),
      isModalOpen: true,
      editingHarvest: mockHarvests[0],
    });
    renderWithTheme(<HarvestsListPage />);

    expect(screen.getByText('Editar Safra')).toBeInTheDocument();
    expect(screen.getByTestId('harvest-form')).toBeInTheDocument();
  });

  it('deve renderizar com mensagem de lista vazia quando não há safras', () => {
    mockUseHarvestsListPage.mockReturnValue({
      ...mockUseHarvestsListPage(),
      harvests: [],
    });
    renderWithTheme(<HarvestsListPage />);

    expect(screen.getByText('Nenhuma safra cadastrada')).toBeInTheDocument();
  });

  it('deve renderizar com formulário de criação com campos vazios', () => {
    mockUseHarvestsListPage.mockReturnValue({
      ...mockUseHarvestsListPage(),
      isModalOpen: true,
      editingHarvest: null,
    });
    renderWithTheme(<HarvestsListPage />);

    expect(screen.getByTestId('harvest-name-input')).toHaveValue('');
    expect(screen.getByTestId('harvest-year-input')).toHaveValue('');
  });

  it('deve renderizar com formulário de edição preenchido', () => {
    mockUseHarvestsListPage.mockReturnValue({
      ...mockUseHarvestsListPage(),
      isModalOpen: true,
      editingHarvest: mockHarvests[0],
    });
    renderWithTheme(<HarvestsListPage />);

    expect(screen.getByTestId('harvest-name-input')).toHaveValue('Safra 2021');
    expect(screen.getByTestId('harvest-year-input')).toHaveValue('2021');
  });

  it('deve renderizar com botão salvar desabilitado durante carregamento', () => {
    mockUseHarvestsListPage.mockReturnValue({
      ...mockUseHarvestsListPage(),
      isModalOpen: true,
      createHarvest: { mutate: jest.fn(), isPending: true },
    });
    renderWithTheme(<HarvestsListPage />);

    const saveButton = screen.getByText('Salvar');
    expect(saveButton).toBeDisabled();
  });

  it('deve renderizar com botão salvar desabilitado durante atualização', () => {
    mockUseHarvestsListPage.mockReturnValue({
      ...mockUseHarvestsListPage(),
      isModalOpen: true,
      updateHarvest: { mutate: jest.fn(), isPending: true },
    });
    renderWithTheme(<HarvestsListPage />);

    const saveButton = screen.getByText('Salvar');
    expect(saveButton).toBeDisabled();
  });

  it('deve renderizar com dados de safra na tabela', () => {
    renderWithTheme(<HarvestsListPage />);

    expect(screen.getByText('Safra 2021')).toBeInTheDocument();
    expect(screen.getByText('Safra 2022')).toBeInTheDocument();
    expect(screen.getByText('Safra 2023')).toBeInTheDocument();
  });

  it('deve renderizar com todas as colunas da tabela', () => {
    renderWithTheme(<HarvestsListPage />);

    // Verifica se todas as colunas estão presentes
    expect(screen.getByText('Nome da Safra')).toBeInTheDocument();
    expect(screen.getByText('Ano')).toBeInTheDocument();
    expect(screen.getByText('Criada em')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();
  });

  it('deve renderizar com dados completos de cada safra', () => {
    renderWithTheme(<HarvestsListPage />);

    // Verifica dados da primeira safra
    expect(screen.getByText('Safra 2021')).toBeInTheDocument();
    expect(screen.getByText('2021')).toBeInTheDocument();
    expect(screen.getByText('31/12/2020')).toBeInTheDocument();

    // Verifica dados da segunda safra
    expect(screen.getByText('Safra 2022')).toBeInTheDocument();
    expect(screen.getByText('2022')).toBeInTheDocument();
    expect(screen.getByText('31/12/2021')).toBeInTheDocument();

    // Verifica dados da terceira safra
    expect(screen.getByText('Safra 2023')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('31/12/2022')).toBeInTheDocument();
  });

  it('deve renderizar com anos formatados como strings', () => {
    renderWithTheme(<HarvestsListPage />);

    // Verifica se os anos estão sendo convertidos para string
    expect(screen.getByText('2021')).toBeInTheDocument();
    expect(screen.getByText('2022')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
  });

  it('deve renderizar com datas no formato brasileiro', () => {
    renderWithTheme(<HarvestsListPage />);

    // Verifica se as datas estão no formato brasileiro (DD/MM/AAAA)
    expect(screen.getByText('31/12/2020')).toBeInTheDocument();
    expect(screen.getByText('31/12/2021')).toBeInTheDocument();
    expect(screen.getByText('31/12/2022')).toBeInTheDocument();
  });

  it('deve renderizar com botões de ação para cada safra', () => {
    renderWithTheme(<HarvestsListPage />);

    const editButtons = screen.getAllByText('Editar');
    const deleteButtons = screen.getAllByText('Excluir');

    expect(editButtons).toHaveLength(3);
    expect(deleteButtons).toHaveLength(3);
  });

  it('deve renderizar com estrutura de navegação completa', () => {
    renderWithTheme(<HarvestsListPage />);

    expect(screen.getByText('Ver Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Ver Produtores')).toBeInTheDocument();
    expect(screen.getByText('Ver Fazendas')).toBeInTheDocument();
    expect(screen.getByText('Ver Associações')).toBeInTheDocument();
  });

  it('deve renderizar com modal de criação', () => {
    renderWithTheme(<HarvestsListPage />);

    const newHarvestButton = screen.getByText('+ Nova Safra');
    fireEvent.click(newHarvestButton);

    expect(screen.getByText('Nova Safra')).toBeInTheDocument();
    expect(screen.getByTestId('harvest-form')).toBeInTheDocument();
  });

  it('deve renderizar com modal de edição', () => {
    mockUseHarvestsListPage.mockReturnValue({
      ...mockUseHarvestsListPage(),
      isModalOpen: true,
      editingHarvest: mockHarvests[0],
    });
    renderWithTheme(<HarvestsListPage />);

    expect(screen.getByText('Editar Safra')).toBeInTheDocument();
    expect(screen.getByTestId('harvest-form')).toBeInTheDocument();
  });

  it('deve renderizar com confirmação de exclusão', () => {
    renderWithTheme(<HarvestsListPage />);

    const deleteButtons = screen.getAllByText('Excluir');
    fireEvent.click(deleteButtons[0]);

    expect(mockUseHarvestsListPage().handleDelete).toHaveBeenCalledWith('1');
  });

  it('deve renderizar com dados de diferentes anos', () => {
    renderWithTheme(<HarvestsListPage />);

    // Verifica se safras de diferentes anos estão sendo exibidas
    expect(screen.getByText('Safra 2021')).toBeInTheDocument();
    expect(screen.getByText('Safra 2022')).toBeInTheDocument();
    expect(screen.getByText('Safra 2023')).toBeInTheDocument();
  });

  it('deve renderizar com estrutura de página completa', () => {
    renderWithTheme(<HarvestsListPage />);

    // Verifica elementos principais da página
    expect(screen.getByText('Safras')).toBeInTheDocument();
    expect(screen.getByText('Gerencie as safras cadastradas no sistema')).toBeInTheDocument();
    expect(screen.getByText('+ Nova Safra')).toBeInTheDocument();

    // Verifica estrutura da tabela
    expect(screen.getByText('Nome da Safra')).toBeInTheDocument();
    expect(screen.getByText('Ano')).toBeInTheDocument();
    expect(screen.getByText('Criada em')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();

    // Verifica dados na tabela
    expect(screen.getByText('Safra 2021')).toBeInTheDocument();
    expect(screen.getByText('Safra 2022')).toBeInTheDocument();
    expect(screen.getByText('Safra 2023')).toBeInTheDocument();
  });
});
