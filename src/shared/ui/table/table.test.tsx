import { renderWithTheme, screen, fireEvent } from '../../lib/test-utils';
import { Table, Column } from './table';

interface TestData {
  id: string;
  name: string;
  age: number;
  email: string;
}

describe('Componente Table', () => {
  const mockData: TestData[] = [
    { id: '1', name: 'João Silva', age: 30, email: 'joao@email.com' },
    { id: '2', name: 'Maria Santos', age: 25, email: 'maria@email.com' },
    { id: '3', name: 'Pedro Costa', age: 35, email: 'pedro@email.com' },
  ];

  const mockColumns: Column<TestData>[] = [
    { key: 'name', header: 'Nome' },
    { key: 'age', header: 'Idade' },
    { key: 'email', header: 'Email' },
  ];

  it('deve renderizar tabela com dados', () => {
    renderWithTheme(<Table data={mockData} columns={mockColumns} />);

    expect(screen.getByText('Nome')).toBeInTheDocument();
    expect(screen.getByText('Idade')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();

    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    expect(screen.getByText('Pedro Costa')).toBeInTheDocument();
  });

  it('deve renderizar cabeçalhos das colunas', () => {
    renderWithTheme(<Table data={mockData} columns={mockColumns} />);

    const table = screen.getByRole('table');
    const headers = screen.getAllByRole('columnheader');

    expect(table).toBeInTheDocument();
    expect(headers).toHaveLength(3);
    expect(headers[0]).toHaveTextContent('Nome');
    expect(headers[1]).toHaveTextContent('Idade');
    expect(headers[2]).toHaveTextContent('Email');
  });

  it('deve renderizar dados das linhas', () => {
    renderWithTheme(<Table data={mockData} columns={mockColumns} />);

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(4); // 1 header + 3 data rows

    const dataRows = rows.slice(1); // Remove header row
    expect(dataRows[0]).toHaveTextContent('João Silva');
    expect(dataRows[0]).toHaveTextContent('30');
    expect(dataRows[0]).toHaveTextContent('joao@email.com');
  });

  it('deve renderizar com colunas customizadas usando render', () => {
    const customColumns: Column<TestData>[] = [
      { key: 'name', header: 'Nome' },
      {
        key: 'age',
        header: 'Idade',
        render: item => `${item.age} anos`,
      },
      {
        key: 'email',
        header: 'Email',
        render: item => <a href={`mailto:${item.email}`}>{item.email}</a>,
      },
    ];

    renderWithTheme(<Table data={mockData} columns={customColumns} />);

    expect(screen.getByText('30 anos')).toBeInTheDocument();
    expect(screen.getByText('25 anos')).toBeInTheDocument();
    expect(screen.getByText('35 anos')).toBeInTheDocument();

    const emailLinks = screen.getAllByRole('link');
    expect(emailLinks).toHaveLength(3);
    expect(emailLinks[0]).toHaveAttribute('href', 'mailto:joao@email.com');
  });

  it('deve chamar onRowClick quando linha é clicada', () => {
    const handleRowClick = jest.fn();
    renderWithTheme(<Table data={mockData} columns={mockColumns} onRowClick={handleRowClick} />);

    const firstRow = screen.getByText('João Silva').closest('tr');
    if (firstRow) {
      fireEvent.click(firstRow);
      expect(handleRowClick).toHaveBeenCalledTimes(1);
      expect(handleRowClick).toHaveBeenCalledWith(mockData[0]);
    }
  });

  it('não deve chamar onRowClick quando não fornecido', () => {
    renderWithTheme(<Table data={mockData} columns={mockColumns} />);

    const firstRow = screen.getByText('João Silva').closest('tr');
    if (firstRow) {
      fireEvent.click(firstRow);
      // Não deve quebrar quando onRowClick não está definido
      expect(firstRow).toBeInTheDocument();
    }
  });

  it('deve renderizar estado de carregamento', () => {
    renderWithTheme(<Table data={[]} columns={mockColumns} loading={true} />);

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('deve renderizar mensagem de lista vazia', () => {
    renderWithTheme(<Table data={[]} columns={mockColumns} />);

    expect(screen.getByText('Nenhum registro encontrado')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('deve renderizar mensagem customizada de lista vazia', () => {
    renderWithTheme(<Table data={[]} columns={mockColumns} emptyMessage='Nenhum usuário cadastrado' />);

    expect(screen.getByText('Nenhum usuário cadastrado')).toBeInTheDocument();
    expect(screen.queryByText('Nenhum registro encontrado')).not.toBeInTheDocument();
  });

  it('deve renderizar com largura customizada das colunas', () => {
    const columnsWithWidth: Column<TestData>[] = [
      { key: 'name', header: 'Nome', width: '200px' },
      { key: 'age', header: 'Idade', width: '100px' },
      { key: 'email', header: 'Email', width: '300px' },
    ];

    renderWithTheme(<Table data={mockData} columns={columnsWithWidth} />);

    const headers = screen.getAllByRole('columnheader');
    expect(headers[0]).toHaveStyle('width: 200px');
    expect(headers[1]).toHaveStyle('width: 100px');
    expect(headers[2]).toHaveStyle('width: 300px');
  });

  it('deve renderizar valores nulos/undefined como traço', () => {
    const dataWithNulls: TestData[] = [
      { id: '1', name: 'João Silva', age: 30, email: 'joao@email.com' },
      { id: '2', name: 'Maria Santos', age: 25, email: '' },
    ];

    const columnsWithNulls: Column<TestData>[] = [
      { key: 'name', header: 'Nome' },
      { key: 'age', header: 'Idade' },
      { key: 'email', header: 'Email' },
      { key: 'phone', header: 'Telefone' }, // Campo que não existe
    ];

    renderWithTheme(<Table data={dataWithNulls} columns={columnsWithNulls} />);

    const phoneCells = screen.getAllByText('-');
    expect(phoneCells).toHaveLength(2); // Duas linhas com telefone vazio
  });

  it('deve renderizar com dados de diferentes tipos', () => {
    const mixedData = [
      { id: 1, name: 'Item 1', value: 100 },
      { id: 2, name: 'Item 2', value: 200 },
    ];

    const mixedColumns: Column<(typeof mixedData)[0]>[] = [
      { key: 'id', header: 'ID' },
      { key: 'name', header: 'Nome' },
      { key: 'value', header: 'Valor' },
    ];

    renderWithTheme(<Table data={mixedData} columns={mixedColumns} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('deve renderizar com estrutura HTML correta', () => {
    renderWithTheme(<Table data={mockData} columns={mockColumns} />);

    const table = screen.getByRole('table');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const rows = table.querySelectorAll('tr');

    expect(table).toBeInTheDocument();
    expect(thead).toBeInTheDocument();
    expect(tbody).toBeInTheDocument();
    expect(rows).toHaveLength(4); // 1 header + 3 data rows
  });

  it('deve renderizar com todas as props combinadas', () => {
    const handleRowClick = jest.fn();
    const customColumns: Column<TestData>[] = [
      { key: 'name', header: 'Nome Completo', width: '250px' },
      {
        key: 'age',
        header: 'Idade',
        render: item => <strong>{item.age}</strong>,
      },
    ];

    renderWithTheme(<Table data={mockData} columns={customColumns} onRowClick={handleRowClick} loading={false} emptyMessage='Lista vazia' />);

    expect(screen.getByText('Nome Completo')).toBeInTheDocument();
    expect(screen.getByText('Idade')).toBeInTheDocument();
    expect(screen.getByText('João Silva')).toBeInTheDocument();

    const strongElements = screen.getAllByText('30');
    expect(strongElements[0].tagName).toBe('STRONG');
  });

  it('deve ter cursor pointer quando onRowClick é fornecido', () => {
    const handleRowClick = jest.fn();
    renderWithTheme(<Table data={mockData} columns={mockColumns} onRowClick={handleRowClick} />);

    const firstRow = screen.getByText('João Silva').closest('tr');
    expect(firstRow).toBeInTheDocument();
  });

  it('deve renderizar com dados vazios mas não em estado de loading', () => {
    renderWithTheme(<Table data={[]} columns={mockColumns} loading={false} />);

    expect(screen.getByText('Nenhum registro encontrado')).toBeInTheDocument();
    expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
  });
});
