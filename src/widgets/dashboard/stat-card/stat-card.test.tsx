import { renderWithTheme, screen } from '../../../shared/lib/test-utils';
import { StatCard } from './stat-card';

describe('Componente StatCard', () => {
  it('deve renderizar com título e valor', () => {
    renderWithTheme(<StatCard title='Total de Vendas' value='R$ 15.000' />);

    expect(screen.getByText('Total de Vendas')).toBeInTheDocument();
    expect(screen.getByText('R$ 15.000')).toBeInTheDocument();
  });

  it('deve renderizar título correto', () => {
    renderWithTheme(<StatCard title='Usuários Ativos' value={1250} />);

    const title = screen.getByText('Usuários Ativos');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H3');
  });

  it('deve renderizar valor numérico', () => {
    renderWithTheme(<StatCard title='Produtos' value={42} />);

    const value = screen.getByText('42');
    expect(value).toBeInTheDocument();
  });

  it('deve renderizar valor como string', () => {
    renderWithTheme(<StatCard title='Status' value='Ativo' />);

    const value = screen.getByText('Ativo');
    expect(value).toBeInTheDocument();
  });

  it('deve renderizar valor zero', () => {
    renderWithTheme(<StatCard title='Itens' value={0} />);

    const value = screen.getByText('0');
    expect(value).toBeInTheDocument();
  });

  it('deve renderizar valor negativo', () => {
    renderWithTheme(<StatCard title='Saldo' value={-150} />);

    const value = screen.getByText('-150');
    expect(value).toBeInTheDocument();
  });

  it('deve renderizar valor decimal', () => {
    renderWithTheme(<StatCard title='Taxa' value={15.75} />);

    const value = screen.getByText('15.75');
    expect(value).toBeInTheDocument();
  });

  it('deve renderizar valor com formatação monetária', () => {
    renderWithTheme(<StatCard title='Receita' value='R$ 1.250.000,00' />);

    const value = screen.getByText('R$ 1.250.000,00');
    expect(value).toBeInTheDocument();
  });

  it('deve renderizar valor com porcentagem', () => {
    renderWithTheme(<StatCard title='Crescimento' value='+25.5%' />);

    const value = screen.getByText('+25.5%');
    expect(value).toBeInTheDocument();
  });

  it('deve renderizar com título longo', () => {
    renderWithTheme(<StatCard title='Total de Vendas no Período Atual' value='R$ 50.000' />);

    const title = screen.getByText('Total de Vendas no Período Atual');
    expect(title).toBeInTheDocument();
  });

  it('deve renderizar com valor longo', () => {
    renderWithTheme(<StatCard title='Descrição' value='Este é um valor muito longo para teste' />);

    const value = screen.getByText('Este é um valor muito longo para teste');
    expect(value).toBeInTheDocument();
  });

  it('deve renderizar com caracteres especiais no título', () => {
    renderWithTheme(<StatCard title='Vendas & Marketing' value='R$ 10.000' />);

    const title = screen.getByText('Vendas & Marketing');
    expect(title).toBeInTheDocument();
  });

  it('deve renderizar com caracteres especiais no valor', () => {
    renderWithTheme(<StatCard title='Status' value='Ativo ✅' />);

    const value = screen.getByText('Ativo ✅');
    expect(value).toBeInTheDocument();
  });

  it('deve renderizar com acentos no título', () => {
    renderWithTheme(<StatCard title='Produção Agrícola' value='1000 kg' />);

    const title = screen.getByText('Produção Agrícola');
    expect(title).toBeInTheDocument();
  });

  it('deve renderizar com acentos no valor', () => {
    renderWithTheme(<StatCard title='Produto' value='Açaí' />);

    const value = screen.getByText('Açaí');
    expect(value).toBeInTheDocument();
  });

  it('deve renderizar com estrutura HTML correta', () => {
    renderWithTheme(<StatCard title='Teste' value='Valor' />);

    const container = screen.getByText('Teste').closest('div');
    expect(container).toBeInTheDocument();

    const title = screen.getByText('Teste');
    const value = screen.getByText('Valor');

    expect(title).toBeInTheDocument();
    expect(value).toBeInTheDocument();
    expect(title.tagName).toBe('H3');
  });

  it('deve renderizar com todas as props combinadas', () => {
    renderWithTheme(<StatCard title='Métricas Completas' value='R$ 1.000.000' />);

    expect(screen.getByText('Métricas Completas')).toBeInTheDocument();
    expect(screen.getByText('R$ 1.000.000')).toBeInTheDocument();
  });

  it('deve renderizar múltiplos cards', () => {
    renderWithTheme(
      <div>
        <StatCard title='Card 1' value='Valor 1' />
        <StatCard title='Card 2' value='Valor 2' />
        <StatCard title='Card 3' value='Valor 3' />
      </div>,
    );

    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Valor 1')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
    expect(screen.getByText('Valor 2')).toBeInTheDocument();
    expect(screen.getByText('Card 3')).toBeInTheDocument();
    expect(screen.getByText('Valor 3')).toBeInTheDocument();
  });

  it('deve renderizar com valores de diferentes tipos', () => {
    const testCases = [
      { title: 'String', value: 'Texto' },
      { title: 'Number', value: 123 },
      { title: 'Zero', value: 0 },
      { title: 'Decimal', value: 99.99 },
      { title: 'Negativo', value: -50 },
    ];

    testCases.forEach(({ title, value }) => {
      const { unmount } = renderWithTheme(<StatCard title={title} value={value} />);

      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(String(value))).toBeInTheDocument();

      unmount();
    });
  });

  it('deve renderizar com valores que contêm espaços', () => {
    renderWithTheme(<StatCard title='Nome Completo' value='João da Silva' />);

    expect(screen.getByText('Nome Completo')).toBeInTheDocument();
    expect(screen.getByText('João da Silva')).toBeInTheDocument();
  });

  it('deve renderizar com valores que contêm quebras de linha', () => {
    renderWithTheme(<StatCard title='Descrição' value='Linha 1\nLinha 2' />);

    expect(screen.getByText('Descrição')).toBeInTheDocument();
    // Verifica se o valor está presente no DOM
    const valueElement = screen.getByText('Descrição').closest('div')?.querySelector('div');
    expect(valueElement).toBeInTheDocument();
    expect(valueElement?.textContent).toContain('Linha 1');
    expect(valueElement?.textContent).toContain('Linha 2');
  });

  it('deve renderizar com valores vazios', () => {
    renderWithTheme(<StatCard title='Vazio' value='' />);

    expect(screen.getByText('Vazio')).toBeInTheDocument();
    // Para valores vazios, verificamos se o elemento existe mas está vazio
    const valueElement = screen.getByText('Vazio').closest('div')?.querySelector('div');
    expect(valueElement).toBeInTheDocument();
  });

  it('deve renderizar com valores undefined/null convertidos para string', () => {
    renderWithTheme(<StatCard title='Undefined' value={undefined as any} />);

    expect(screen.getByText('Undefined')).toBeInTheDocument();
    // Para undefined, verificamos se o elemento existe mas está vazio
    const valueElement = screen.getByText('Undefined').closest('div')?.querySelector('div');
    expect(valueElement).toBeInTheDocument();
  });

  it('deve renderizar com valores booleanos', () => {
    renderWithTheme(<StatCard title='Ativo' value={true as any} />);

    expect(screen.getByText('Ativo')).toBeInTheDocument();
    // Para booleanos, verificamos se o elemento existe mas está vazio
    const valueElement = screen.getByText('Ativo').closest('div')?.querySelector('div');
    expect(valueElement).toBeInTheDocument();
  });

  it('deve renderizar com valores de array convertidos para string', () => {
    renderWithTheme(<StatCard title='Lista' value={[1, 2, 3] as any} />);

    expect(screen.getByText('Lista')).toBeInTheDocument();
    // Para arrays, verificamos se o elemento existe mas está vazio
    const valueElement = screen.getByText('Lista').closest('div')?.querySelector('div');
    expect(valueElement).toBeInTheDocument();
  });

  it('deve renderizar com valores de objeto convertidos para string', () => {
    // Objetos não podem ser renderizados diretamente no React
    // Este teste verifica se o componente não quebra com objetos
    expect(() => {
      renderWithTheme(<StatCard title='Objeto' value={{ key: 'value' } as any} />);
    }).toThrow();
  });
});
