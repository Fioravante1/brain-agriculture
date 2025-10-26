import { renderWithTheme, screen } from '../../../shared/lib/test-utils';
import { PieChartCard, PieChartData } from './pie-chart-card';

// Mock do recharts para evitar problemas com SVG em testes
jest.mock('recharts', () => ({
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid='pie-chart'>{children}</div>,
  Pie: ({ data, children }: { data: any[]; children: React.ReactNode }) => (
    <div data-testid='pie' data-length={data.length}>
      {children}
    </div>
  ),
  Cell: ({ fill }: { fill: string }) => <div data-testid='cell' data-fill={fill} />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid='responsive-container'>{children}</div>,
  Legend: () => <div data-testid='legend' />,
  Tooltip: () => <div data-testid='tooltip' />,
}));

describe('Componente PieChartCard', () => {
  const mockData: PieChartData[] = [
    { name: 'Categoria A', value: 30 },
    { name: 'Categoria B', value: 25 },
    { name: 'Categoria C', value: 20 },
    { name: 'Categoria D', value: 15 },
    { name: 'Categoria E', value: 10 },
  ];

  it('deve renderizar com título e dados', () => {
    renderWithTheme(<PieChartCard title='Distribuição de Vendas' data={mockData} />);

    expect(screen.getByText('Distribuição de Vendas')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toBeInTheDocument();
  });

  it('deve renderizar título correto', () => {
    renderWithTheme(<PieChartCard title='Meu Gráfico' data={mockData} />);

    const title = screen.getByText('Meu Gráfico');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H3');
  });

  it('deve renderizar todos os componentes do gráfico', () => {
    renderWithTheme(<PieChartCard title='Teste' data={mockData} />);

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('deve renderizar células com cores corretas', () => {
    renderWithTheme(<PieChartCard title='Teste' data={mockData} />);

    const cells = screen.getAllByTestId('cell');
    expect(cells).toHaveLength(5);

    // Verifica se as cores estão sendo aplicadas
    expect(cells[0]).toHaveAttribute('data-fill', '#2E7D32');
    expect(cells[1]).toHaveAttribute('data-fill', '#4CAF50');
    expect(cells[2]).toHaveAttribute('data-fill', '#81C784');
    expect(cells[3]).toHaveAttribute('data-fill', '#FF6F00');
    expect(cells[4]).toHaveAttribute('data-fill', '#FF9800');
  });

  it('deve renderizar com dados de diferentes tamanhos', () => {
    const smallData: PieChartData[] = [
      { name: 'Item 1', value: 50 },
      { name: 'Item 2', value: 30 },
    ];

    renderWithTheme(<PieChartCard title='Dados Pequenos' data={smallData} />);

    const pie = screen.getByTestId('pie');
    expect(pie).toHaveAttribute('data-length', '2');

    const cells = screen.getAllByTestId('cell');
    expect(cells).toHaveLength(2);
  });

  it('deve renderizar com dados grandes', () => {
    const largeData: PieChartData[] = Array.from({ length: 10 }, (_, i) => ({
      name: `Item ${i + 1}`,
      value: Math.random() * 100,
    }));

    renderWithTheme(<PieChartCard title='Dados Grandes' data={largeData} />);

    const pie = screen.getByTestId('pie');
    expect(pie).toHaveAttribute('data-length', '10');

    const cells = screen.getAllByTestId('cell');
    expect(cells).toHaveLength(10);
  });

  it('deve renderizar mensagem de dados vazios quando data é array vazio', () => {
    renderWithTheme(<PieChartCard title='Sem Dados' data={[]} />);

    expect(screen.getByText('Sem Dados')).toBeInTheDocument();
    expect(screen.getByText('Nenhum dado disponível')).toBeInTheDocument();
    expect(screen.queryByTestId('pie-chart')).not.toBeInTheDocument();
  });

  it('deve renderizar mensagem de dados vazios quando data é null', () => {
    renderWithTheme(<PieChartCard title='Sem Dados' data={null as any} />);

    expect(screen.getByText('Sem Dados')).toBeInTheDocument();
    expect(screen.getByText('Nenhum dado disponível')).toBeInTheDocument();
    expect(screen.queryByTestId('pie-chart')).not.toBeInTheDocument();
  });

  it('deve renderizar mensagem de dados vazios quando data é undefined', () => {
    renderWithTheme(<PieChartCard title='Sem Dados' data={undefined as any} />);

    expect(screen.getByText('Sem Dados')).toBeInTheDocument();
    expect(screen.getByText('Nenhum dado disponível')).toBeInTheDocument();
    expect(screen.queryByTestId('pie-chart')).not.toBeInTheDocument();
  });

  it('deve renderizar com dados que têm propriedades extras', () => {
    const dataWithExtras: PieChartData[] = [
      { name: 'Produto A', value: 40, category: 'Eletrônicos', price: 299.99 },
      { name: 'Produto B', value: 35, category: 'Roupas', price: 89.99 },
    ];

    renderWithTheme(<PieChartCard title='Produtos' data={dataWithExtras} />);

    expect(screen.getByText('Produtos')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();

    const cells = screen.getAllByTestId('cell');
    expect(cells).toHaveLength(2);
  });

  it('deve renderizar com valores zero', () => {
    const dataWithZeros: PieChartData[] = [
      { name: 'Item 1', value: 0 },
      { name: 'Item 2', value: 0 },
    ];

    renderWithTheme(<PieChartCard title='Valores Zero' data={dataWithZeros} />);

    expect(screen.getByText('Valores Zero')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();

    const cells = screen.getAllByTestId('cell');
    expect(cells).toHaveLength(2);
  });

  it('deve renderizar com valores negativos', () => {
    const dataWithNegatives: PieChartData[] = [
      { name: 'Positivo', value: 50 },
      { name: 'Negativo', value: -20 },
    ];

    renderWithTheme(<PieChartCard title='Valores Negativos' data={dataWithNegatives} />);

    expect(screen.getByText('Valores Negativos')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();

    const cells = screen.getAllByTestId('cell');
    expect(cells).toHaveLength(2);
  });

  it('deve renderizar com nomes longos', () => {
    const dataWithLongNames: PieChartData[] = [
      { name: 'Categoria com nome muito longo e descritivo', value: 30 },
      { name: 'Outra categoria também com nome extenso', value: 25 },
    ];

    renderWithTheme(<PieChartCard title='Nomes Longos' data={dataWithLongNames} />);

    expect(screen.getByText('Nomes Longos')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();

    const cells = screen.getAllByTestId('cell');
    expect(cells).toHaveLength(2);
  });

  it('deve renderizar com nomes especiais', () => {
    const dataWithSpecialNames: PieChartData[] = [
      { name: 'Categoria & Especial', value: 30 },
      { name: 'Categoria @#$%', value: 25 },
      { name: 'Categoria com acentos: ção', value: 20 },
    ];

    renderWithTheme(<PieChartCard title='Nomes Especiais' data={dataWithSpecialNames} />);

    expect(screen.getByText('Nomes Especiais')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();

    const cells = screen.getAllByTestId('cell');
    expect(cells).toHaveLength(3);
  });

  it('deve renderizar com estrutura HTML correta', () => {
    renderWithTheme(<PieChartCard title='Estrutura' data={mockData} />);

    const container = screen.getByText('Estrutura').closest('div');
    expect(container).toBeInTheDocument();

    const title = screen.getByText('Estrutura');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H3');
  });

  it('deve renderizar com todas as props combinadas', () => {
    const complexData: PieChartData[] = [
      { name: 'Complexo A', value: 45, extra: 'dados extras' },
      { name: 'Complexo B', value: 35, extra: 'mais dados' },
      { name: 'Complexo C', value: 20, extra: 'ainda mais' },
    ];

    renderWithTheme(<PieChartCard title='Dados Complexos' data={complexData} />);

    expect(screen.getByText('Dados Complexos')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toHaveAttribute('data-length', '3');

    const cells = screen.getAllByTestId('cell');
    expect(cells).toHaveLength(3);
  });

  it('deve renderizar com cores que se repetem quando há muitos dados', () => {
    const manyData: PieChartData[] = Array.from({ length: 15 }, (_, i) => ({
      name: `Item ${i + 1}`,
      value: Math.random() * 100,
    }));

    renderWithTheme(<PieChartCard title='Muitos Dados' data={manyData} />);

    const cells = screen.getAllByTestId('cell');
    expect(cells).toHaveLength(15);

    // Verifica se as cores se repetem (modulo 8, pois temos 8 cores)
    expect(cells[0]).toHaveAttribute('data-fill', '#2E7D32'); // index 0
    expect(cells[8]).toHaveAttribute('data-fill', '#2E7D32'); // index 8 (0 % 8)
    expect(cells[9]).toHaveAttribute('data-fill', '#4CAF50'); // index 9 (1 % 8)
  });
});
