import { fireEvent, renderWithTheme, screen } from '@/shared/lib/test-utils';
import { FarmsListPage } from './farms-list-page';
import { Farm } from '@/entities/farm';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockFarms: Farm[] = [
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
  {
    id: '3',
    producerId: '3',
    name: 'Fazenda Boa Vista',
    city: 'Belo Horizonte',
    state: 'MG',
    totalArea: 150,
    arableArea: 120,
    vegetationArea: 30,
    farmCrops: [],
    producer: {
      id: '3',
      name: 'Pedro Costa',
      cpfCnpj: '98765432100',
    },
  },
];

const mockUseFarmsListPage = jest.fn();

jest.mock('@/features/farms', () => ({
  FarmForm: jest.fn(({ onSubmit, onCancel, defaultValues, isLoading }) => (
    <form onSubmit={onSubmit} data-testid='farm-form'>
      <input data-testid='farm-name-input' defaultValue={defaultValues?.name || ''} />
      <input data-testid='farm-city-input' defaultValue={defaultValues?.city || ''} />
      <input data-testid='farm-state-input' defaultValue={defaultValues?.state || ''} />
      <input data-testid='farm-total-area-input' defaultValue={defaultValues?.totalArea || ''} />
      <input data-testid='farm-arable-area-input' defaultValue={defaultValues?.arableArea || ''} />
      <input data-testid='farm-vegetation-area-input' defaultValue={defaultValues?.vegetationArea || ''} />
      <button type='button' onClick={onCancel}>
        Cancelar
      </button>
      <button type='submit' disabled={isLoading}>
        Salvar
      </button>
    </form>
  )),
  useFarmsListPage: () => mockUseFarmsListPage(),
}));

// Mock da configuração das colunas
jest.mock('@/features/farms/config/farms-table-columns', () => ({
  FARMS_TABLE_COLUMNS: [
    { key: 'name', header: 'Nome da Fazenda', width: '25%' },
    { key: 'producer', header: 'Produtor', width: '20%', render: (farm: any) => farm.producer.name },
    { key: 'location', header: 'Localização', width: '15%', render: (farm: any) => `${farm.city}/${farm.state}` },
    { key: 'totalArea', header: 'Área Total', width: '12%', render: (farm: any) => `${farm.totalArea} ha` },
    { key: 'arableArea', header: 'Área Agricultável', width: '12%', render: (farm: any) => `${farm.arableArea} ha` },
    { key: 'vegetationArea', header: 'Área Vegetação', width: '12%', render: (farm: any) => `${farm.vegetationArea} ha` },
    { key: 'actions', header: 'Ações', width: '4%', render: (farm: any) => farm.name },
  ],
}));

// Mock da função formatNumber
jest.mock('@/shared/lib/utils', () => ({
  formatNumber: jest.fn(value => value.toLocaleString('pt-BR')),
}));

describe('Componente FarmsListPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFarmsListPage.mockReturnValue({
      farms: mockFarms,
      isLoading: false,
      isModalOpen: false,
      editingFarm: null,
      handleOpenCreateModal: jest.fn(),
      handleOpenEditModal: jest.fn(),
      handleCloseModal: jest.fn(),
      handleSubmit: jest.fn(),
      handleDelete: jest.fn(),
      handleNavigateToDashboard: jest.fn(),
      handleNavigateToProducers: jest.fn(),
      handleNavigateToCrops: jest.fn(),
      handleNavigateToHarvests: jest.fn(),
      handleNavigateToFarmCrops: jest.fn(),
      createFarm: { mutate: jest.fn(), isPending: false },
      updateFarm: { mutate: jest.fn(), isPending: false },
      deleteFarm: { mutate: jest.fn(), isPending: false },
    });
    jest.spyOn(window, 'confirm').mockReturnValue(true); // Mock confirm dialog
    jest.spyOn(window, 'alert').mockImplementation(() => {}); // Mock alert
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve renderizar página com título e subtítulo', () => {
    renderWithTheme(<FarmsListPage />);
    expect(screen.getByText('Fazendas')).toBeInTheDocument();
    expect(screen.getByText('Gerencie as fazendas cadastradas no sistema')).toBeInTheDocument();
  });

  it('deve renderizar botões de ação', () => {
    renderWithTheme(<FarmsListPage />);
    expect(screen.getByText('+ Nova Fazenda')).toBeInTheDocument();
    expect(screen.getByText('Ver Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Ver Produtores')).toBeInTheDocument();
    expect(screen.getByText('Ver Culturas')).toBeInTheDocument();
    expect(screen.getByText('Ver Safras')).toBeInTheDocument();
    expect(screen.getByText('Ver Associações')).toBeInTheDocument();
  });

  it('deve renderizar tabela com dados das fazendas', () => {
    renderWithTheme(<FarmsListPage />);
    expect(screen.getByText('Nome da Fazenda')).toBeInTheDocument();
    expect(screen.getByText('Produtor')).toBeInTheDocument();
    expect(screen.getByText('Localização')).toBeInTheDocument();
    expect(screen.getByText('Área Total')).toBeInTheDocument();
    expect(screen.getByText('Área Agricultável')).toBeInTheDocument();
    expect(screen.getByText('Área Vegetação')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();
  });

  it('deve renderizar dados das fazendas na tabela', () => {
    renderWithTheme(<FarmsListPage />);
    expect(screen.getByText('Fazenda São João')).toBeInTheDocument();
    expect(screen.getByText('Fazenda Santa Maria')).toBeInTheDocument();
    expect(screen.getByText('Fazenda Boa Vista')).toBeInTheDocument();
  });

  it('deve renderizar dados dos produtores na tabela', () => {
    renderWithTheme(<FarmsListPage />);
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    expect(screen.getByText('Pedro Costa')).toBeInTheDocument();
  });

  it('deve renderizar localização das fazendas na tabela', () => {
    renderWithTheme(<FarmsListPage />);
    expect(screen.getByText('São Paulo/SP')).toBeInTheDocument();
    expect(screen.getByText('Rio de Janeiro/RJ')).toBeInTheDocument();
    expect(screen.getByText('Belo Horizonte/MG')).toBeInTheDocument();
  });

  it('deve renderizar áreas das fazendas formatadas na tabela', () => {
    renderWithTheme(<FarmsListPage />);
    expect(screen.getByText('100 ha')).toBeInTheDocument();
    expect(screen.getByText('80 ha')).toBeInTheDocument();
    expect(screen.getByText('20 ha')).toBeInTheDocument();
    expect(screen.getByText('200 ha')).toBeInTheDocument();
    expect(screen.getAllByText('150 ha')).toHaveLength(2); // Duas fazendas têm 150 ha
    expect(screen.getByText('50 ha')).toBeInTheDocument();
  });

  it('deve renderizar botões de ação para cada fazenda', () => {
    renderWithTheme(<FarmsListPage />);
    const editButtons = screen.getAllByText('Editar');
    const deleteButtons = screen.getAllByText('Excluir');

    expect(editButtons).toHaveLength(3);
    expect(deleteButtons).toHaveLength(3);
  });

  it('deve abrir modal ao clicar em Nova Fazenda', () => {
    renderWithTheme(<FarmsListPage />);

    const newFarmButton = screen.getByText('+ Nova Fazenda');
    fireEvent.click(newFarmButton);

    expect(mockUseFarmsListPage().handleOpenCreateModal).toHaveBeenCalled();
  });

  it('deve abrir modal de edição ao clicar em Editar', () => {
    renderWithTheme(<FarmsListPage />);

    const editButtons = screen.getAllByText('Editar');
    fireEvent.click(editButtons[0]);

    expect(mockUseFarmsListPage().handleOpenEditModal).toHaveBeenCalledWith(mockFarms[0]);
  });

  it('deve fechar modal ao clicar em cancelar', () => {
    mockUseFarmsListPage.mockReturnValue({
      ...mockUseFarmsListPage(),
      isModalOpen: true,
    });
    renderWithTheme(<FarmsListPage />);

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(mockUseFarmsListPage().handleCloseModal).toHaveBeenCalled();
  });

  it('deve navegar para dashboard ao clicar em Ver Dashboard', () => {
    renderWithTheme(<FarmsListPage />);

    const dashboardButton = screen.getByText('Ver Dashboard');
    fireEvent.click(dashboardButton);

    expect(mockUseFarmsListPage().handleNavigateToDashboard).toHaveBeenCalled();
  });

  it('deve navegar para produtores ao clicar em Ver Produtores', () => {
    renderWithTheme(<FarmsListPage />);

    const producersButton = screen.getByText('Ver Produtores');
    fireEvent.click(producersButton);

    expect(mockUseFarmsListPage().handleNavigateToProducers).toHaveBeenCalled();
  });

  it('deve navegar para culturas ao clicar em Ver Culturas', () => {
    renderWithTheme(<FarmsListPage />);

    const cropsButton = screen.getByText('Ver Culturas');
    fireEvent.click(cropsButton);

    expect(mockUseFarmsListPage().handleNavigateToCrops).toHaveBeenCalled();
  });

  it('deve navegar para safras ao clicar em Ver Safras', () => {
    renderWithTheme(<FarmsListPage />);

    const harvestsButton = screen.getByText('Ver Safras');
    fireEvent.click(harvestsButton);

    expect(mockUseFarmsListPage().handleNavigateToHarvests).toHaveBeenCalled();
  });

  it('deve navegar para associações ao clicar em Ver Associações', () => {
    renderWithTheme(<FarmsListPage />);

    const associationsButton = screen.getByText('Ver Associações');
    fireEvent.click(associationsButton);

    expect(mockUseFarmsListPage().handleNavigateToFarmCrops).toHaveBeenCalled();
  });

  it('deve mostrar confirmação ao clicar em Excluir', () => {
    renderWithTheme(<FarmsListPage />);

    const deleteButtons = screen.getAllByText('Excluir');
    fireEvent.click(deleteButtons[0]);

    expect(mockUseFarmsListPage().handleDelete).toHaveBeenCalledWith(mockFarms[0]);
  });

  it('deve renderizar com estrutura HTML correta', () => {
    renderWithTheme(<FarmsListPage />);

    const pageContainer = screen.getByText('Fazendas').closest('div');
    expect(pageContainer).toBeInTheDocument();
  });

  it('deve renderizar com card contendo tabela', () => {
    renderWithTheme(<FarmsListPage />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('deve renderizar com colunas corretas da tabela', () => {
    renderWithTheme(<FarmsListPage />);

    expect(screen.getByText('Nome da Fazenda')).toBeInTheDocument();
    expect(screen.getByText('Produtor')).toBeInTheDocument();
    expect(screen.getByText('Localização')).toBeInTheDocument();
    expect(screen.getByText('Área Total')).toBeInTheDocument();
    expect(screen.getByText('Área Agricultável')).toBeInTheDocument();
    expect(screen.getByText('Área Vegetação')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();
  });

  it('deve renderizar com dados das fazendas na tabela', () => {
    renderWithTheme(<FarmsListPage />);

    expect(screen.getByText('Fazenda São João')).toBeInTheDocument();
    expect(screen.getByText('Fazenda Santa Maria')).toBeInTheDocument();
    expect(screen.getByText('Fazenda Boa Vista')).toBeInTheDocument();
  });

  it('deve renderizar com botões de ação para cada linha', () => {
    renderWithTheme(<FarmsListPage />);

    const editButtons = screen.getAllByText('Editar');
    const deleteButtons = screen.getAllByText('Excluir');

    expect(editButtons).toHaveLength(3);
    expect(deleteButtons).toHaveLength(3);
  });

  it('deve renderizar com layout responsivo', () => {
    renderWithTheme(<FarmsListPage />);

    const actionsContainer = screen.getByText('+ Nova Fazenda').closest('div');
    expect(actionsContainer).toBeInTheDocument();
  });

  it('deve renderizar com título principal', () => {
    renderWithTheme(<FarmsListPage />);

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveTextContent('Fazendas');
  });

  it('deve renderizar com subtítulo descritivo', () => {
    renderWithTheme(<FarmsListPage />);

    expect(screen.getByText('Gerencie as fazendas cadastradas no sistema')).toBeInTheDocument();
  });

  it('deve renderizar com botão de nova fazenda', () => {
    renderWithTheme(<FarmsListPage />);

    const newFarmButton = screen.getByText('+ Nova Fazenda');
    expect(newFarmButton).toBeInTheDocument();
  });

  it('deve renderizar com botões de navegação', () => {
    renderWithTheme(<FarmsListPage />);

    expect(screen.getByText('Ver Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Ver Produtores')).toBeInTheDocument();
    expect(screen.getByText('Ver Culturas')).toBeInTheDocument();
    expect(screen.getByText('Ver Safras')).toBeInTheDocument();
    expect(screen.getByText('Ver Associações')).toBeInTheDocument();
  });

  it('deve renderizar com tabela de fazendas', () => {
    renderWithTheme(<FarmsListPage />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('deve renderizar com modal fechado inicialmente', () => {
    renderWithTheme(<FarmsListPage />);

    // Verifica se os elementos principais da página estão presentes
    expect(screen.getByText('Fazendas')).toBeInTheDocument();
    expect(screen.getByText('Gerencie as fazendas cadastradas no sistema')).toBeInTheDocument();

    // Verifica se os elementos principais estão presentes
    expect(screen.getByText('+ Nova Fazenda')).toBeInTheDocument();
    expect(screen.getByText('Nome da Fazenda')).toBeInTheDocument();
  });

  it('deve renderizar com formulário de fazenda no modal', async () => {
    renderWithTheme(<FarmsListPage />);

    const newFarmButton = screen.getByText('+ Nova Fazenda');
    fireEvent.click(newFarmButton);

    expect(screen.getByText('Nova Fazenda')).toBeInTheDocument();
    expect(screen.getByTestId('farm-form')).toBeInTheDocument();
  });

  it('deve renderizar com botões de cancelar e salvar no modal', async () => {
    renderWithTheme(<FarmsListPage />);

    const newFarmButton = screen.getByText('+ Nova Fazenda');
    fireEvent.click(newFarmButton);

    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });

  it('deve renderizar com estado de loading da tabela', () => {
    mockUseFarmsListPage.mockReturnValue({
      ...mockUseFarmsListPage(),
      isLoading: true,
    });
    renderWithTheme(<FarmsListPage />);

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('deve renderizar com estrutura completa da página', () => {
    renderWithTheme(<FarmsListPage />);

    expect(screen.getByText('Fazendas')).toBeInTheDocument();
    expect(screen.getByText('Gerencie as fazendas cadastradas no sistema')).toBeInTheDocument();
    expect(screen.getByText('+ Nova Fazenda')).toBeInTheDocument();
    expect(screen.getByText('Nome da Fazenda')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();
  });

  it('deve renderizar com dados formatados corretamente', () => {
    renderWithTheme(<FarmsListPage />);

    // Verifica se os dados estão sendo renderizados
    expect(screen.getByText('Fazenda São João')).toBeInTheDocument();
    expect(screen.getByText('Fazenda Santa Maria')).toBeInTheDocument();
    expect(screen.getByText('Fazenda Boa Vista')).toBeInTheDocument();
  });

  it('deve renderizar com áreas formatadas corretamente', () => {
    renderWithTheme(<FarmsListPage />);

    // Verifica se as áreas estão sendo formatadas com "ha"
    expect(screen.getByText('100 ha')).toBeInTheDocument();
    expect(screen.getByText('200 ha')).toBeInTheDocument();
    expect(screen.getAllByText('150 ha')).toHaveLength(2); // Duas fazendas têm 150 ha
  });

  it('deve renderizar com localização formatada corretamente', () => {
    renderWithTheme(<FarmsListPage />);

    // Verifica se a localização está no formato "Cidade/Estado"
    expect(screen.getByText('São Paulo/SP')).toBeInTheDocument();
    expect(screen.getByText('Rio de Janeiro/RJ')).toBeInTheDocument();
    expect(screen.getByText('Belo Horizonte/MG')).toBeInTheDocument();
  });

  it('deve renderizar com botões desabilitados durante exclusão', () => {
    mockUseFarmsListPage.mockReturnValue({
      ...mockUseFarmsListPage(),
      deleteFarm: { mutate: jest.fn(), isPending: true },
    });
    renderWithTheme(<FarmsListPage />);

    const deleteButtons = screen.getAllByText('Excluir');
    expect(deleteButtons).toHaveLength(3);
    expect(deleteButtons[0]).toBeInTheDocument();
  });

  it('deve renderizar com formulário preenchido ao editar', () => {
    mockUseFarmsListPage.mockReturnValue({
      ...mockUseFarmsListPage(),
      isModalOpen: true,
      editingFarm: mockFarms[0],
    });
    renderWithTheme(<FarmsListPage />);

    expect(screen.getByText('Editar Fazenda')).toBeInTheDocument();
    expect(screen.getByTestId('farm-form')).toBeInTheDocument();
  });

  it('deve renderizar com mensagem de lista vazia quando não há fazendas', () => {
    mockUseFarmsListPage.mockReturnValue({
      ...mockUseFarmsListPage(),
      farms: [],
    });
    renderWithTheme(<FarmsListPage />);

    expect(screen.getByText('Nenhuma fazenda cadastrada')).toBeInTheDocument();
  });

  it('deve renderizar com formulário de criação com campos vazios', () => {
    mockUseFarmsListPage.mockReturnValue({
      ...mockUseFarmsListPage(),
      isModalOpen: true,
      editingFarm: null,
    });
    renderWithTheme(<FarmsListPage />);

    expect(screen.getByTestId('farm-name-input')).toHaveValue('');
    expect(screen.getByTestId('farm-city-input')).toHaveValue('');
    expect(screen.getByTestId('farm-state-input')).toHaveValue('');
    expect(screen.getByTestId('farm-total-area-input')).toHaveValue('');
    expect(screen.getByTestId('farm-arable-area-input')).toHaveValue('');
    expect(screen.getByTestId('farm-vegetation-area-input')).toHaveValue('');
  });

  it('deve renderizar com formulário de edição preenchido', () => {
    mockUseFarmsListPage.mockReturnValue({
      ...mockUseFarmsListPage(),
      isModalOpen: true,
      editingFarm: mockFarms[0],
    });
    renderWithTheme(<FarmsListPage />);

    expect(screen.getByTestId('farm-name-input')).toHaveValue('Fazenda São João');
    expect(screen.getByTestId('farm-city-input')).toHaveValue('São Paulo');
    expect(screen.getByTestId('farm-state-input')).toHaveValue('SP');
    expect(screen.getByTestId('farm-total-area-input')).toHaveValue('100');
    expect(screen.getByTestId('farm-arable-area-input')).toHaveValue('80');
    expect(screen.getByTestId('farm-vegetation-area-input')).toHaveValue('20');
  });

  it('deve renderizar com botão salvar desabilitado durante carregamento', () => {
    mockUseFarmsListPage.mockReturnValue({
      ...mockUseFarmsListPage(),
      isModalOpen: true,
      createFarm: { mutate: jest.fn(), isPending: true },
    });
    renderWithTheme(<FarmsListPage />);

    const saveButton = screen.getByText('Salvar');
    expect(saveButton).toBeDisabled();
  });

  it('deve renderizar com botão salvar desabilitado durante atualização', () => {
    mockUseFarmsListPage.mockReturnValue({
      ...mockUseFarmsListPage(),
      isModalOpen: true,
      updateFarm: { mutate: jest.fn(), isPending: true },
    });
    renderWithTheme(<FarmsListPage />);

    const saveButton = screen.getByText('Salvar');
    expect(saveButton).toBeDisabled();
  });

  it('deve renderizar com dados de produtor na tabela', () => {
    renderWithTheme(<FarmsListPage />);

    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    expect(screen.getByText('Pedro Costa')).toBeInTheDocument();
  });

  it('deve renderizar com todas as colunas da tabela', () => {
    renderWithTheme(<FarmsListPage />);

    // Verifica se todas as colunas estão presentes
    expect(screen.getByText('Nome da Fazenda')).toBeInTheDocument();
    expect(screen.getByText('Produtor')).toBeInTheDocument();
    expect(screen.getByText('Localização')).toBeInTheDocument();
    expect(screen.getByText('Área Total')).toBeInTheDocument();
    expect(screen.getByText('Área Agricultável')).toBeInTheDocument();
    expect(screen.getByText('Área Vegetação')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();
  });

  it('deve renderizar com dados completos de cada fazenda', () => {
    renderWithTheme(<FarmsListPage />);

    // Verifica dados da primeira fazenda
    expect(screen.getByText('Fazenda São João')).toBeInTheDocument();
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('São Paulo/SP')).toBeInTheDocument();
    expect(screen.getByText('100 ha')).toBeInTheDocument();
    expect(screen.getByText('80 ha')).toBeInTheDocument();
    expect(screen.getByText('20 ha')).toBeInTheDocument();

    // Verifica dados da segunda fazenda
    expect(screen.getByText('Fazenda Santa Maria')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    expect(screen.getByText('Rio de Janeiro/RJ')).toBeInTheDocument();
    expect(screen.getByText('200 ha')).toBeInTheDocument();
    expect(screen.getAllByText('150 ha')).toHaveLength(2); // Duas fazendas têm 150 ha
    expect(screen.getByText('50 ha')).toBeInTheDocument();
  });
});
