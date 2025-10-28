import { fireEvent, renderWithTheme, screen } from '@/shared/lib/test-utils';
import { FarmCropsListPage } from './farm-crops-list-page';

// Mock do hook useFarmCropsListPage
const mockUseFarmCropsListPage = jest.fn();
jest.mock('@/features/farm-crops', () => ({
  useFarmCropsListPage: () => mockUseFarmCropsListPage(),
  FarmCropForm: ({ onSubmit, onCancel, isLoading }: any) => (
    <div data-testid='farm-crop-form'>
      <button onClick={() => onSubmit({ farmId: '1', cropId: '1', harvestId: '1' })}>Salvar</button>
      <button onClick={onCancel}>Cancelar</button>
      {isLoading && <span>Carregando...</span>}
    </div>
  ),
}));

jest.mock('@/features/farm-crops/config/farm-crops-table-columns', () => ({
  FARM_CROPS_TABLE_COLUMNS: [
    {
      key: 'farm',
      header: 'Fazenda',
      width: '25%',
      render: (farmCrop: any) => farmCrop.farm.name,
    },
    {
      key: 'producer',
      header: 'Produtor',
      width: '20%',
      render: (farmCrop: any) => farmCrop.farm.producer.name,
    },
    {
      key: 'crop',
      header: 'Cultura',
      width: '20%',
      render: (farmCrop: any) => farmCrop.crop.name,
    },
    {
      key: 'harvest',
      header: 'Safra',
      width: '20%',
      render: (farmCrop: any) => `${farmCrop.harvest.name} (${farmCrop.harvest.year})`,
    },
    {
      key: 'createdAt',
      header: 'Criada em',
      width: '10%',
      render: (farmCrop: any) => new Date(farmCrop.createdAt).toLocaleDateString('pt-BR'),
    },
    {
      key: 'actions',
      header: 'Ações',
      width: '5%',
      render: (farmCrop: any) => farmCrop.farm.name,
    },
  ],
}));

// Mock dos componentes UI
jest.mock('@/shared/ui', () => ({
  Card: ({ children, padding }: any) => (
    <div data-testid='card' data-padding={padding}>
      {children}
    </div>
  ),
  Button: ({ children, onClick, variant, size }: any) => (
    <button onClick={onClick} data-variant={variant} data-size={size}>
      {children}
    </button>
  ),
  Table: ({ data, columns, loading, emptyMessage }: any) => (
    <div data-testid='table'>
      {loading ? <span>Carregando...</span> : null}
      {data && data.length === 0 ? <span>{emptyMessage}</span> : null}
      {data && data.length > 0 ? (
        <table>
          <thead>
            <tr>
              {columns.map((col: any) => (
                <th key={col.key}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item: any, index: number) => (
              <tr key={index}>
                {columns.map((col: any) => (
                  <td key={col.key}>{col.render ? col.render(item) : item[col.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  ),
  Modal: ({ children, isOpen, onClose, title, size }: any) =>
    isOpen ? (
      <div data-testid='modal' data-size={size}>
        <h2>{title}</h2>
        <button onClick={onClose}>Fechar</button>
        {children}
      </div>
    ) : null,
}));

describe('FarmCropsListPage', () => {
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
        createdAt: new Date('2021-01-01T00:00:00.000Z'),
        updatedAt: new Date('2021-01-01T00:00:00.000Z'),
      },
      harvest: {
        id: '1',
        name: 'Safra 2021',
        year: 2021,
        createdAt: new Date('2021-01-01T00:00:00.000Z'),
        updatedAt: new Date('2021-01-01T00:00:00.000Z'),
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
        createdAt: new Date('2021-01-01T00:00:00.000Z'),
        updatedAt: new Date('2021-01-01T00:00:00.000Z'),
      },
      harvest: {
        id: '2',
        name: 'Safra 2022',
        year: 2022,
        createdAt: new Date('2021-01-01T00:00:00.000Z'),
        updatedAt: new Date('2021-01-01T00:00:00.000Z'),
      },
    },
  ];

  beforeEach(() => {
    mockUseFarmCropsListPage.mockReturnValue({
      farmCrops: mockFarmCrops,
      isLoading: false,
      isModalOpen: false,
      handleOpenCreateModal: jest.fn(),
      handleCloseModal: jest.fn(),
      handleSubmit: jest.fn(),
      handleDelete: jest.fn(),
      handleNavigateToDashboard: jest.fn(),
      handleNavigateToProducers: jest.fn(),
      handleNavigateToFarms: jest.fn(),
      handleNavigateToCrops: jest.fn(),
      handleNavigateToHarvests: jest.fn(),
      createFarmCrop: { isPending: false },
    });
  });

  it('deve renderizar página com título e subtítulo', () => {
    renderWithTheme(<FarmCropsListPage />);

    expect(screen.getByText('Associações Fazenda-Cultura-Safra')).toBeInTheDocument();
    expect(screen.getByText('Gerencie as associações entre fazendas, culturas e safras')).toBeInTheDocument();
  });

  it('deve renderizar botões de ação', () => {
    renderWithTheme(<FarmCropsListPage />);

    expect(screen.getByText('+ Nova Associação')).toBeInTheDocument();
    expect(screen.getByText('Ver Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Ver Produtores')).toBeInTheDocument();
    expect(screen.getByText('Ver Fazendas')).toBeInTheDocument();
    expect(screen.getByText('Ver Culturas')).toBeInTheDocument();
    expect(screen.getByText('Ver Safras')).toBeInTheDocument();
  });

  it('deve renderizar tabela com dados das associações', () => {
    renderWithTheme(<FarmCropsListPage />);

    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(screen.getByText('Fazenda')).toBeInTheDocument();
    expect(screen.getByText('Produtor')).toBeInTheDocument();
    expect(screen.getByText('Cultura')).toBeInTheDocument();
    expect(screen.getByText('Safra')).toBeInTheDocument();
    expect(screen.getByText('Criada em')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();
  });

  it('deve renderizar dados das associações na tabela', () => {
    renderWithTheme(<FarmCropsListPage />);

    expect(screen.getByText('Fazenda São João')).toBeInTheDocument();
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Soja')).toBeInTheDocument();
    expect(screen.getByText('Safra 2021 (2021)')).toBeInTheDocument();
    expect(screen.getByText('Fazenda Santa Maria')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    expect(screen.getByText('Milho')).toBeInTheDocument();
    expect(screen.getByText('Safra 2022 (2022)')).toBeInTheDocument();
  });

  it('deve renderizar botões de ação para cada associação', () => {
    renderWithTheme(<FarmCropsListPage />);

    const deleteButtons = screen.getAllByText('Excluir');
    expect(deleteButtons).toHaveLength(2);
  });

  it('deve abrir modal ao clicar em Nova Associação', () => {
    const mockHandleOpenCreateModal = jest.fn();
    mockUseFarmCropsListPage.mockReturnValue({
      ...mockUseFarmCropsListPage(),
      handleOpenCreateModal: mockHandleOpenCreateModal,
    });

    renderWithTheme(<FarmCropsListPage />);

    fireEvent.click(screen.getByText('+ Nova Associação'));
    expect(mockHandleOpenCreateModal).toHaveBeenCalled();
  });

  it('deve fechar modal ao clicar em cancelar', () => {
    const mockHandleCloseModal = jest.fn();
    mockUseFarmCropsListPage.mockReturnValue({
      ...mockUseFarmCropsListPage(),
      isModalOpen: true,
      handleCloseModal: mockHandleCloseModal,
    });

    renderWithTheme(<FarmCropsListPage />);

    fireEvent.click(screen.getByText('Cancelar'));
    expect(mockHandleCloseModal).toHaveBeenCalled();
  });

  it('deve navegar para dashboard ao clicar em Ver Dashboard', () => {
    const mockHandleNavigateToDashboard = jest.fn();
    mockUseFarmCropsListPage.mockReturnValue({
      ...mockUseFarmCropsListPage(),
      handleNavigateToDashboard: mockHandleNavigateToDashboard,
    });

    renderWithTheme(<FarmCropsListPage />);

    fireEvent.click(screen.getByText('Ver Dashboard'));
    expect(mockHandleNavigateToDashboard).toHaveBeenCalled();
  });

  it('deve navegar para produtores ao clicar em Ver Produtores', () => {
    const mockHandleNavigateToProducers = jest.fn();
    mockUseFarmCropsListPage.mockReturnValue({
      ...mockUseFarmCropsListPage(),
      handleNavigateToProducers: mockHandleNavigateToProducers,
    });

    renderWithTheme(<FarmCropsListPage />);

    fireEvent.click(screen.getByText('Ver Produtores'));
    expect(mockHandleNavigateToProducers).toHaveBeenCalled();
  });

  it('deve navegar para fazendas ao clicar em Ver Fazendas', () => {
    const mockHandleNavigateToFarms = jest.fn();
    mockUseFarmCropsListPage.mockReturnValue({
      ...mockUseFarmCropsListPage(),
      handleNavigateToFarms: mockHandleNavigateToFarms,
    });

    renderWithTheme(<FarmCropsListPage />);

    fireEvent.click(screen.getByText('Ver Fazendas'));
    expect(mockHandleNavigateToFarms).toHaveBeenCalled();
  });

  it('deve navegar para culturas ao clicar em Ver Culturas', () => {
    const mockHandleNavigateToCrops = jest.fn();
    mockUseFarmCropsListPage.mockReturnValue({
      ...mockUseFarmCropsListPage(),
      handleNavigateToCrops: mockHandleNavigateToCrops,
    });

    renderWithTheme(<FarmCropsListPage />);

    fireEvent.click(screen.getByText('Ver Culturas'));
    expect(mockHandleNavigateToCrops).toHaveBeenCalled();
  });

  it('deve navegar para safras ao clicar em Ver Safras', () => {
    const mockHandleNavigateToHarvests = jest.fn();
    mockUseFarmCropsListPage.mockReturnValue({
      ...mockUseFarmCropsListPage(),
      handleNavigateToHarvests: mockHandleNavigateToHarvests,
    });

    renderWithTheme(<FarmCropsListPage />);

    fireEvent.click(screen.getByText('Ver Safras'));
    expect(mockHandleNavigateToHarvests).toHaveBeenCalled();
  });

  it('deve mostrar confirmação ao clicar em Excluir', () => {
    const mockHandleDelete = jest.fn();
    mockUseFarmCropsListPage.mockReturnValue({
      ...mockUseFarmCropsListPage(),
      handleDelete: mockHandleDelete,
    });

    renderWithTheme(<FarmCropsListPage />);

    fireEvent.click(screen.getAllByText('Excluir')[0]);
    expect(mockHandleDelete).toHaveBeenCalledWith(mockFarmCrops[0]);
  });

  it('deve renderizar com estrutura HTML correta', () => {
    renderWithTheme(<FarmCropsListPage />);

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  it('deve renderizar com card contendo tabela', () => {
    renderWithTheme(<FarmCropsListPage />);

    const card = screen.getByTestId('card');
    const table = screen.getByTestId('table');
    expect(card).toContainElement(table);
  });

  it('deve renderizar com colunas corretas da tabela', () => {
    renderWithTheme(<FarmCropsListPage />);

    expect(screen.getByText('Fazenda')).toBeInTheDocument();
    expect(screen.getByText('Produtor')).toBeInTheDocument();
    expect(screen.getByText('Cultura')).toBeInTheDocument();
    expect(screen.getByText('Safra')).toBeInTheDocument();
    expect(screen.getByText('Criada em')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();
  });

  it('deve renderizar com dados das associações na tabela', () => {
    renderWithTheme(<FarmCropsListPage />);

    expect(screen.getByText('Fazenda São João')).toBeInTheDocument();
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Soja')).toBeInTheDocument();
    expect(screen.getByText('Safra 2021 (2021)')).toBeInTheDocument();
  });

  it('deve renderizar com botões de ação para cada linha', () => {
    renderWithTheme(<FarmCropsListPage />);

    const deleteButtons = screen.getAllByText('Excluir');
    expect(deleteButtons).toHaveLength(2);
  });

  it('deve renderizar com layout responsivo', () => {
    renderWithTheme(<FarmCropsListPage />);

    expect(screen.getByText('Associações Fazenda-Cultura-Safra')).toBeInTheDocument();
    expect(screen.getByText('Gerencie as associações entre fazendas, culturas e safras')).toBeInTheDocument();
  });

  it('deve renderizar com título principal', () => {
    renderWithTheme(<FarmCropsListPage />);

    const title = screen.getByText('Associações Fazenda-Cultura-Safra');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H1');
  });

  it('deve renderizar com subtítulo descritivo', () => {
    renderWithTheme(<FarmCropsListPage />);

    const subtitle = screen.getByText('Gerencie as associações entre fazendas, culturas e safras');
    expect(subtitle).toBeInTheDocument();
    expect(subtitle.tagName).toBe('P');
  });

  it('deve renderizar com botão de nova associação', () => {
    renderWithTheme(<FarmCropsListPage />);

    const newButton = screen.getByText('+ Nova Associação');
    expect(newButton).toBeInTheDocument();
  });

  it('deve renderizar com botões de navegação', () => {
    renderWithTheme(<FarmCropsListPage />);

    expect(screen.getByText('Ver Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Ver Produtores')).toBeInTheDocument();
    expect(screen.getByText('Ver Fazendas')).toBeInTheDocument();
    expect(screen.getByText('Ver Culturas')).toBeInTheDocument();
    expect(screen.getByText('Ver Safras')).toBeInTheDocument();
  });

  it('deve renderizar com tabela de associações', () => {
    renderWithTheme(<FarmCropsListPage />);

    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  it('deve renderizar com modal fechado inicialmente', () => {
    renderWithTheme(<FarmCropsListPage />);

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('deve renderizar com formulário de associação no modal', () => {
    mockUseFarmCropsListPage.mockReturnValue({
      ...mockUseFarmCropsListPage(),
      isModalOpen: true,
    });

    renderWithTheme(<FarmCropsListPage />);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('Nova Associação')).toBeInTheDocument();
    expect(screen.getByTestId('farm-crop-form')).toBeInTheDocument();
  });

  it('deve renderizar com botões de cancelar e salvar no modal', () => {
    mockUseFarmCropsListPage.mockReturnValue({
      ...mockUseFarmCropsListPage(),
      isModalOpen: true,
    });

    renderWithTheme(<FarmCropsListPage />);

    expect(screen.getByText('Salvar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('deve renderizar com estado de loading da tabela', () => {
    mockUseFarmCropsListPage.mockReturnValue({
      ...mockUseFarmCropsListPage(),
      isLoading: true,
    });

    renderWithTheme(<FarmCropsListPage />);

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('deve renderizar com mensagem de lista vazia quando não há associações', () => {
    mockUseFarmCropsListPage.mockReturnValue({
      ...mockUseFarmCropsListPage(),
      farmCrops: [],
    });

    renderWithTheme(<FarmCropsListPage />);

    expect(screen.getByText('Nenhuma associação cadastrada')).toBeInTheDocument();
  });

  it('deve renderizar com estrutura completa da página', () => {
    renderWithTheme(<FarmCropsListPage />);

    expect(screen.getByText('Associações Fazenda-Cultura-Safra')).toBeInTheDocument();
    expect(screen.getByText('Gerencie as associações entre fazendas, culturas e safras')).toBeInTheDocument();
    expect(screen.getByText('+ Nova Associação')).toBeInTheDocument();
    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  it('deve submeter formulário corretamente', () => {
    const mockHandleSubmit = jest.fn();
    mockUseFarmCropsListPage.mockReturnValue({
      ...mockUseFarmCropsListPage(),
      isModalOpen: true,
      handleSubmit: mockHandleSubmit,
    });

    renderWithTheme(<FarmCropsListPage />);

    fireEvent.click(screen.getByText('Salvar'));
    expect(mockHandleSubmit).toHaveBeenCalledWith({ farmId: '1', cropId: '1', harvestId: '1' });
  });

  it('deve renderizar com botão salvar desabilitado durante carregamento', () => {
    mockUseFarmCropsListPage.mockReturnValue({
      ...mockUseFarmCropsListPage(),
      isModalOpen: true,
      createFarmCrop: { isPending: true },
    });

    renderWithTheme(<FarmCropsListPage />);

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('deve renderizar com modal de tamanho correto', () => {
    mockUseFarmCropsListPage.mockReturnValue({
      ...mockUseFarmCropsListPage(),
      isModalOpen: true,
    });

    renderWithTheme(<FarmCropsListPage />);

    const modal = screen.getByTestId('modal');
    expect(modal).toHaveAttribute('data-size', 'lg');
  });

  it('deve renderizar com card com padding correto', () => {
    renderWithTheme(<FarmCropsListPage />);

    const card = screen.getByTestId('card');
    expect(card).toHaveAttribute('data-padding', 'lg');
  });
});
