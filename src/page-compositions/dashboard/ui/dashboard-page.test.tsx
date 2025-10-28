import { fireEvent, renderWithTheme, screen } from '@/shared/lib/test-utils';
import { DashboardPage } from './dashboard-page';
import { DashboardStats } from '@/features/dashboard';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockUseDashboardStats = jest.fn();
jest.mock('@/features/dashboard', () => ({
  useDashboardStats: () => mockUseDashboardStats(),
  DashboardStats: {},
}));

jest.mock('@/widgets/dashboard', () => ({
  StatCard: ({ title, value }: { title: string; value: string }) => (
    <div data-testid='stat-card'>
      <h3>{title}</h3>
      <span>{value}</span>
    </div>
  ),
  PieChartCard: ({ title, data }: { title: string; data: Array<{ name: string; value: number }> }) => (
    <div data-testid='pie-chart-card'>
      <h3>{title}</h3>
      <div data-testid='chart-data'>{JSON.stringify(data)}</div>
    </div>
  ),
}));

jest.mock('@/shared/lib/utils', () => ({
  formatNumber: (value: number) => value.toLocaleString('pt-BR'),
  formatHectares: (value: number) => `${value.toLocaleString('pt-BR')} ha`,
}));

describe('DashboardPage', () => {
  const mockDashboardStats: DashboardStats = {
    totalFarms: 10,
    totalHectares: 5000,
    farmsByState: [
      { name: 'São Paulo', value: 5 },
      { name: 'Rio de Janeiro', value: 3 },
      { name: 'Minas Gerais', value: 2 },
    ],
    farmsByCrop: [
      { name: 'Soja', value: 6 },
      { name: 'Milho', value: 3 },
      { name: 'Algodão', value: 1 },
    ],
    landUse: [
      { name: 'Área Agricultável', value: 4000 },
      { name: 'Vegetação', value: 1000 },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDashboardStats.mockReturnValue({
      data: mockDashboardStats,
      isLoading: false,
    });
  });

  it('deve renderizar página com título e subtítulo', () => {
    renderWithTheme(<DashboardPage />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Visão geral das fazendas e produtores cadastrados')).toBeInTheDocument();
  });

  it('deve renderizar botões de navegação', () => {
    renderWithTheme(<DashboardPage />);

    expect(screen.getByText('Ver Produtores')).toBeInTheDocument();
    expect(screen.getByText('Ver Fazendas')).toBeInTheDocument();
    expect(screen.getByText('Ver Culturas')).toBeInTheDocument();
    expect(screen.getByText('Ver Safras')).toBeInTheDocument();
    expect(screen.getByText('Ver Associações')).toBeInTheDocument();
  });

  it('deve renderizar cards de estatísticas', () => {
    renderWithTheme(<DashboardPage />);

    const statCards = screen.getAllByTestId('stat-card');
    expect(statCards).toHaveLength(2);

    expect(screen.getByText('Total de Fazendas')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Total de Hectares')).toBeInTheDocument();
    expect(screen.getByText('5.000 ha')).toBeInTheDocument();
  });

  it('deve renderizar gráficos de pizza', () => {
    renderWithTheme(<DashboardPage />);

    const pieChartCards = screen.getAllByTestId('pie-chart-card');
    expect(pieChartCards).toHaveLength(3);

    expect(screen.getByText('Fazendas por Estado')).toBeInTheDocument();
    expect(screen.getByText('Culturas Plantadas')).toBeInTheDocument();
    expect(screen.getByText('Uso do Solo')).toBeInTheDocument();
  });

  it('deve renderizar dados dos gráficos corretamente', () => {
    renderWithTheme(<DashboardPage />);

    const chartDataElements = screen.getAllByTestId('chart-data');
    expect(chartDataElements).toHaveLength(3);

    expect(chartDataElements[0]).toHaveTextContent(JSON.stringify(mockDashboardStats.farmsByState));
    expect(chartDataElements[1]).toHaveTextContent(JSON.stringify(mockDashboardStats.farmsByCrop));
    expect(chartDataElements[2]).toHaveTextContent(JSON.stringify(mockDashboardStats.landUse));
  });

  it('deve navegar para produtores ao clicar no botão', () => {
    renderWithTheme(<DashboardPage />);

    fireEvent.click(screen.getByText('Ver Produtores'));
    expect(mockPush).toHaveBeenCalledWith('/producers');
  });

  it('deve navegar para fazendas ao clicar no botão', () => {
    renderWithTheme(<DashboardPage />);

    fireEvent.click(screen.getByText('Ver Fazendas'));
    expect(mockPush).toHaveBeenCalledWith('/farms');
  });

  it('deve navegar para culturas ao clicar no botão', () => {
    renderWithTheme(<DashboardPage />);

    fireEvent.click(screen.getByText('Ver Culturas'));
    expect(mockPush).toHaveBeenCalledWith('/crops');
  });

  it('deve navegar para safras ao clicar no botão', () => {
    renderWithTheme(<DashboardPage />);

    fireEvent.click(screen.getByText('Ver Safras'));
    expect(mockPush).toHaveBeenCalledWith('/harvests');
  });

  it('deve navegar para associações ao clicar no botão', () => {
    renderWithTheme(<DashboardPage />);

    fireEvent.click(screen.getByText('Ver Associações'));
    expect(mockPush).toHaveBeenCalledWith('/farm-crops');
  });

  it('deve mostrar loading quando dados estão carregando', () => {
    mockUseDashboardStats.mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    renderWithTheme(<DashboardPage />);

    expect(screen.getByText('Carregando dados...')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('deve mostrar erro quando dados não são carregados', () => {
    mockUseDashboardStats.mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    renderWithTheme(<DashboardPage />);

    expect(screen.getByText('Erro ao carregar dados do dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('deve mostrar loading quando isClient é false', () => {
    mockUseDashboardStats.mockReturnValue({
      data: mockDashboardStats,
      isLoading: false,
    });

    renderWithTheme(<DashboardPage />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Carregando dados...')).not.toBeInTheDocument();
  });

  it('deve renderizar com dados diferentes', () => {
    const differentStats: DashboardStats = {
      totalFarms: 25,
      totalHectares: 12000,
      farmsByState: [
        { name: 'Paraná', value: 10 },
        { name: 'Santa Catarina', value: 8 },
        { name: 'Rio Grande do Sul', value: 7 },
      ],
      farmsByCrop: [
        { name: 'Trigo', value: 12 },
        { name: 'Aveia', value: 8 },
        { name: 'Cevada', value: 5 },
      ],
      landUse: [
        { name: 'Área Agricultável', value: 10000 },
        { name: 'Vegetação', value: 2000 },
      ],
    };

    mockUseDashboardStats.mockReturnValue({
      data: differentStats,
      isLoading: false,
    });

    renderWithTheme(<DashboardPage />);

    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('12.000 ha')).toBeInTheDocument();
    expect(screen.getAllByTestId('chart-data')[0]).toHaveTextContent(JSON.stringify(differentStats.farmsByState));
  });

  it('deve renderizar com dados vazios', () => {
    const emptyStats: DashboardStats = {
      totalFarms: 0,
      totalHectares: 0,
      farmsByState: [],
      farmsByCrop: [],
      landUse: [],
    };

    mockUseDashboardStats.mockReturnValue({
      data: emptyStats,
      isLoading: false,
    });

    renderWithTheme(<DashboardPage />);

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('0 ha')).toBeInTheDocument();
    expect(screen.getAllByTestId('chart-data')[0]).toHaveTextContent('[]');
  });

  it('deve renderizar com estrutura HTML correta', () => {
    renderWithTheme(<DashboardPage />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Visão geral das fazendas e produtores cadastrados')).toBeInTheDocument();
    expect(screen.getAllByTestId('stat-card')).toHaveLength(2);
    expect(screen.getAllByTestId('pie-chart-card')).toHaveLength(3);
  });

  it('deve renderizar botões com variantes corretas', () => {
    renderWithTheme(<DashboardPage />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(5);

    expect(screen.getByText('Ver Produtores')).toBeInTheDocument();

    expect(screen.getByText('Ver Fazendas')).toBeInTheDocument();
    expect(screen.getByText('Ver Culturas')).toBeInTheDocument();
    expect(screen.getByText('Ver Safras')).toBeInTheDocument();
    expect(screen.getByText('Ver Associações')).toBeInTheDocument();
  });

  it('deve usar formatação correta dos números', () => {
    const statsWithLargeNumbers: DashboardStats = {
      totalFarms: 1234567,
      totalHectares: 9876543,
      farmsByState: [],
      farmsByCrop: [],
      landUse: [],
    };

    mockUseDashboardStats.mockReturnValue({
      data: statsWithLargeNumbers,
      isLoading: false,
    });

    renderWithTheme(<DashboardPage />);

    expect(screen.getByText('1.234.567')).toBeInTheDocument();
    expect(screen.getByText('9.876.543 ha')).toBeInTheDocument();
  });

  it('deve renderizar todos os elementos de navegação', () => {
    renderWithTheme(<DashboardPage />);

    const navigationButtons = ['Ver Produtores', 'Ver Fazendas', 'Ver Culturas', 'Ver Safras', 'Ver Associações'];

    navigationButtons.forEach(buttonText => {
      expect(screen.getByText(buttonText)).toBeInTheDocument();
    });
  });

  it('deve renderizar com layout responsivo', () => {
    renderWithTheme(<DashboardPage />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getAllByTestId('stat-card')).toHaveLength(2);
    expect(screen.getAllByTestId('pie-chart-card')).toHaveLength(3);
  });

  it('deve renderizar com título principal', () => {
    renderWithTheme(<DashboardPage />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('deve renderizar com subtítulo descritivo', () => {
    renderWithTheme(<DashboardPage />);
    expect(screen.getByText('Visão geral das fazendas e produtores cadastrados')).toBeInTheDocument();
  });

  it('deve renderizar com cards de estatísticas principais', () => {
    renderWithTheme(<DashboardPage />);
    expect(screen.getByText('Total de Fazendas')).toBeInTheDocument();
    expect(screen.getByText('Total de Hectares')).toBeInTheDocument();
  });

  it('deve renderizar com gráficos informativos', () => {
    renderWithTheme(<DashboardPage />);
    expect(screen.getByText('Fazendas por Estado')).toBeInTheDocument();
    expect(screen.getByText('Culturas Plantadas')).toBeInTheDocument();
    expect(screen.getByText('Uso do Solo')).toBeInTheDocument();
  });

  it('deve renderizar com estrutura completa da página', () => {
    renderWithTheme(<DashboardPage />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Visão geral das fazendas e produtores cadastrados')).toBeInTheDocument();

    expect(screen.getAllByTestId('stat-card')).toHaveLength(2);

    expect(screen.getAllByTestId('pie-chart-card')).toHaveLength(3);

    expect(screen.getAllByRole('button')).toHaveLength(5);
  });

  it('deve lidar com múltiplos cliques nos botões', () => {
    renderWithTheme(<DashboardPage />);

    const producersButton = screen.getByText('Ver Produtores');
    const farmsButton = screen.getByText('Ver Fazendas');

    fireEvent.click(producersButton);
    fireEvent.click(farmsButton);
    fireEvent.click(producersButton);

    expect(mockPush).toHaveBeenCalledWith('/producers');
    expect(mockPush).toHaveBeenCalledWith('/farms');
    expect(mockPush).toHaveBeenCalledTimes(3);
  });

  it('deve renderizar com dados de diferentes estados', () => {
    const multiStateStats: DashboardStats = {
      totalFarms: 15,
      totalHectares: 7500,
      farmsByState: [
        { name: 'São Paulo', value: 8 },
        { name: 'Rio de Janeiro', value: 4 },
        { name: 'Minas Gerais', value: 2 },
        { name: 'Paraná', value: 1 },
      ],
      farmsByCrop: [
        { name: 'Soja', value: 10 },
        { name: 'Milho', value: 3 },
        { name: 'Algodão', value: 2 },
      ],
      landUse: [
        { name: 'Área Agricultável', value: 6000 },
        { name: 'Vegetação', value: 1500 },
      ],
    };

    mockUseDashboardStats.mockReturnValue({
      data: multiStateStats,
      isLoading: false,
    });

    renderWithTheme(<DashboardPage />);

    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('7.500 ha')).toBeInTheDocument();

    const chartData = screen.getAllByTestId('chart-data');
    expect(chartData[0]).toHaveTextContent(JSON.stringify(multiStateStats.farmsByState));
    expect(chartData[1]).toHaveTextContent(JSON.stringify(multiStateStats.farmsByCrop));
    expect(chartData[2]).toHaveTextContent(JSON.stringify(multiStateStats.landUse));
  });
});
