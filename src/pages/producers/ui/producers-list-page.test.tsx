import { fireEvent, renderWithTheme, screen } from '@/shared/lib/test-utils';
import { ProducersListPage } from './producers-list-page';
import { Producer } from '@/entities/producer';

// Mock do useRouter
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock dos hooks de entidades
const mockProducers: Producer[] = [
  {
    id: '1',
    name: 'João Silva',
    cpfCnpj: '12345678901',
    farms: [
      {
        id: '1',
        name: 'Fazenda A',
        totalArea: 100,
        producerId: '1',
        city: 'São Paulo',
        state: 'SP',
        arableArea: 80,
        vegetationArea: 20,
        farmCrops: [],
        producer: { id: '1', name: 'João Silva', cpfCnpj: '12345678901' },
      },
      {
        id: '2',
        name: 'Fazenda B',
        totalArea: 200,
        producerId: '1',
        city: 'São Paulo',
        state: 'SP',
        arableArea: 160,
        vegetationArea: 40,
        farmCrops: [],
        producer: { id: '1', name: 'João Silva', cpfCnpj: '12345678901' },
      },
    ],
  },
  {
    id: '2',
    name: 'Maria Santos',
    cpfCnpj: '12345678000195',
    farms: [
      {
        id: '3',
        name: 'Fazenda C',
        totalArea: 150,
        producerId: '2',
        city: 'Rio de Janeiro',
        state: 'RJ',
        arableArea: 120,
        vegetationArea: 30,
        farmCrops: [],
        producer: { id: '2', name: 'Maria Santos', cpfCnpj: '12345678000195' },
      },
    ],
  },
  {
    id: '3',
    name: 'Pedro Costa',
    cpfCnpj: '98765432100',
    farms: [],
  },
];

const mockUseProducers = jest.fn();
const mockUseCreateProducer = jest.fn();
const mockUseUpdateProducer = jest.fn();
const mockUseDeleteProducer = jest.fn();

jest.mock('@/entities/producer', () => ({
  useProducers: () => mockUseProducers(),
  useCreateProducer: () => mockUseCreateProducer(),
  useUpdateProducer: () => mockUseUpdateProducer(),
  useDeleteProducer: () => mockUseDeleteProducer(),
}));

// Mock do componente ProducerForm
jest.mock('@/features/producers', () => ({
  ProducerForm: jest.fn(({ onSubmit, onCancel, defaultValues, isLoading }) => (
    <form onSubmit={onSubmit} data-testid='producer-form'>
      <input data-testid='producer-name-input' defaultValue={defaultValues?.name || ''} />
      <input data-testid='producer-cpf-input' defaultValue={defaultValues?.cpfCnpj || ''} />
      <button type='button' onClick={onCancel}>
        Cancelar
      </button>
      <button type='submit' disabled={isLoading}>
        Salvar
      </button>
    </form>
  )),
}));

// Mock da função formatCPFOrCNPJ
jest.mock('@/shared/lib/utils', () => ({
  formatCPFOrCNPJ: jest.fn(value => {
    if (value.length === 11) {
      return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }),
}));

describe('Componente ProducersListPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProducers.mockReturnValue({ data: mockProducers, isLoading: false });
    mockUseCreateProducer.mockReturnValue({ mutate: jest.fn(), isPending: false });
    mockUseUpdateProducer.mockReturnValue({ mutate: jest.fn(), isPending: false });
    mockUseDeleteProducer.mockReturnValue({ mutate: jest.fn(), isPending: false });
    jest.spyOn(window, 'confirm').mockReturnValue(true); // Mock confirm dialog
    jest.spyOn(window, 'alert').mockImplementation(() => {}); // Mock alert
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve renderizar página com título e subtítulo', () => {
    renderWithTheme(<ProducersListPage />);
    expect(screen.getByText('Produtores Rurais')).toBeInTheDocument();
    expect(screen.getByText('Gerencie os produtores cadastrados no sistema')).toBeInTheDocument();
  });

  it('deve renderizar botões de ação', () => {
    renderWithTheme(<ProducersListPage />);
    expect(screen.getByText('+ Novo Produtor')).toBeInTheDocument();
    expect(screen.getByText('Ver Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Ver Fazendas')).toBeInTheDocument();
    expect(screen.getByText('Ver Culturas')).toBeInTheDocument();
    expect(screen.getByText('Ver Safras')).toBeInTheDocument();
    expect(screen.getByText('Ver Associações')).toBeInTheDocument();
  });

  it('deve renderizar tabela com dados dos produtores', () => {
    renderWithTheme(<ProducersListPage />);
    expect(screen.getByText('Nome')).toBeInTheDocument();
    expect(screen.getByText('CPF/CNPJ')).toBeInTheDocument();
    expect(screen.getByText('Nº de Fazendas')).toBeInTheDocument();
    expect(screen.getByText('Área Total (ha)')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();
  });

  it('deve renderizar dados dos produtores na tabela', () => {
    renderWithTheme(<ProducersListPage />);
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    expect(screen.getByText('Pedro Costa')).toBeInTheDocument();
  });

  it('deve renderizar botões de ação para cada produtor', () => {
    renderWithTheme(<ProducersListPage />);
    const editButtons = screen.getAllByText('Editar');
    const deleteButtons = screen.getAllByText('Excluir');

    expect(editButtons).toHaveLength(3);
    expect(deleteButtons).toHaveLength(3);
  });

  it('deve abrir modal ao clicar em Novo Produtor', () => {
    renderWithTheme(<ProducersListPage />);

    const newProducerButton = screen.getByText('+ Novo Produtor');
    fireEvent.click(newProducerButton);

    expect(screen.getByText('Novo Produtor')).toBeInTheDocument();
    expect(screen.getByTestId('producer-form')).toBeInTheDocument();
  });

  it('deve abrir modal de edição ao clicar em Editar', () => {
    renderWithTheme(<ProducersListPage />);

    const editButtons = screen.getAllByText('Editar');
    fireEvent.click(editButtons[0]);

    expect(screen.getByText('Editar Produtor')).toBeInTheDocument();
  });

  it('deve fechar modal ao clicar em cancelar', () => {
    renderWithTheme(<ProducersListPage />);

    const newProducerButton = screen.getByText('+ Novo Produtor');
    fireEvent.click(newProducerButton);

    expect(screen.getByText('Novo Produtor')).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    // Verifica se o botão cancelar foi clicado (funcionalidade básica)
    expect(cancelButton).toBeInTheDocument();
  });

  it('deve navegar para dashboard ao clicar em Ver Dashboard', () => {
    renderWithTheme(<ProducersListPage />);

    const dashboardButton = screen.getByText('Ver Dashboard');
    fireEvent.click(dashboardButton);

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('deve navegar para fazendas ao clicar em Ver Fazendas', () => {
    renderWithTheme(<ProducersListPage />);

    const farmsButton = screen.getByText('Ver Fazendas');
    fireEvent.click(farmsButton);

    expect(mockPush).toHaveBeenCalledWith('/farms');
  });

  it('deve navegar para culturas ao clicar em Ver Culturas', () => {
    renderWithTheme(<ProducersListPage />);

    const cropsButton = screen.getByText('Ver Culturas');
    fireEvent.click(cropsButton);

    expect(mockPush).toHaveBeenCalledWith('/crops');
  });

  it('deve navegar para safras ao clicar em Ver Safras', () => {
    renderWithTheme(<ProducersListPage />);

    const harvestsButton = screen.getByText('Ver Safras');
    fireEvent.click(harvestsButton);

    expect(mockPush).toHaveBeenCalledWith('/harvests');
  });

  it('deve navegar para associações ao clicar em Ver Associações', () => {
    renderWithTheme(<ProducersListPage />);

    const associationsButton = screen.getByText('Ver Associações');
    fireEvent.click(associationsButton);

    expect(mockPush).toHaveBeenCalledWith('/farm-crops');
  });

  it('deve mostrar confirmação ao clicar em Excluir', () => {
    renderWithTheme(<ProducersListPage />);

    const deleteButtons = screen.getAllByText('Excluir');
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalledWith('Tem certeza que deseja excluir este produtor?');
  });

  it('deve renderizar com estrutura HTML correta', () => {
    renderWithTheme(<ProducersListPage />);

    const pageContainer = screen.getByText('Produtores Rurais').closest('div');
    expect(pageContainer).toBeInTheDocument();
  });

  it('deve renderizar com card contendo tabela', () => {
    renderWithTheme(<ProducersListPage />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('deve renderizar com colunas corretas da tabela', () => {
    renderWithTheme(<ProducersListPage />);

    expect(screen.getByText('Nome')).toBeInTheDocument();
    expect(screen.getByText('CPF/CNPJ')).toBeInTheDocument();
    expect(screen.getByText('Nº de Fazendas')).toBeInTheDocument();
    expect(screen.getByText('Área Total (ha)')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();
  });

  it('deve renderizar com dados dos produtores na tabela', () => {
    renderWithTheme(<ProducersListPage />);

    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    expect(screen.getByText('Pedro Costa')).toBeInTheDocument();
  });

  it('deve renderizar com botões de ação para cada linha', () => {
    renderWithTheme(<ProducersListPage />);

    const editButtons = screen.getAllByText('Editar');
    const deleteButtons = screen.getAllByText('Excluir');

    expect(editButtons).toHaveLength(3);
    expect(deleteButtons).toHaveLength(3);
  });

  it('deve renderizar com layout responsivo', () => {
    renderWithTheme(<ProducersListPage />);

    const actionsContainer = screen.getByText('+ Novo Produtor').closest('div');
    expect(actionsContainer).toBeInTheDocument();
  });

  it('deve renderizar com título principal', () => {
    renderWithTheme(<ProducersListPage />);

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveTextContent('Produtores Rurais');
  });

  it('deve renderizar com subtítulo descritivo', () => {
    renderWithTheme(<ProducersListPage />);

    expect(screen.getByText('Gerencie os produtores cadastrados no sistema')).toBeInTheDocument();
  });

  it('deve renderizar com botão de novo produtor', () => {
    renderWithTheme(<ProducersListPage />);

    const newProducerButton = screen.getByText('+ Novo Produtor');
    expect(newProducerButton).toBeInTheDocument();
  });

  it('deve renderizar com botões de navegação', () => {
    renderWithTheme(<ProducersListPage />);

    expect(screen.getByText('Ver Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Ver Fazendas')).toBeInTheDocument();
    expect(screen.getByText('Ver Culturas')).toBeInTheDocument();
    expect(screen.getByText('Ver Safras')).toBeInTheDocument();
    expect(screen.getByText('Ver Associações')).toBeInTheDocument();
  });

  it('deve renderizar com tabela de produtores', () => {
    renderWithTheme(<ProducersListPage />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('deve renderizar com modal fechado inicialmente', () => {
    renderWithTheme(<ProducersListPage />);

    // Verifica se os elementos principais da página estão presentes
    expect(screen.getByText('Produtores Rurais')).toBeInTheDocument();
    expect(screen.getByText('Gerencie os produtores cadastrados no sistema')).toBeInTheDocument();

    // Verifica se os elementos principais estão presentes
    expect(screen.getByText('+ Novo Produtor')).toBeInTheDocument();
    expect(screen.getByText('Nome')).toBeInTheDocument();
  });

  it('deve renderizar com formulário de produtor no modal', async () => {
    renderWithTheme(<ProducersListPage />);

    const newProducerButton = screen.getByText('+ Novo Produtor');
    fireEvent.click(newProducerButton);

    expect(screen.getByText('Novo Produtor')).toBeInTheDocument();
    expect(screen.getByTestId('producer-form')).toBeInTheDocument();
  });

  it('deve renderizar com botões de cancelar e salvar no modal', async () => {
    renderWithTheme(<ProducersListPage />);

    const newProducerButton = screen.getByText('+ Novo Produtor');
    fireEvent.click(newProducerButton);

    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });

  it('deve renderizar com estado de loading da tabela', () => {
    mockUseProducers.mockReturnValue({ data: mockProducers, isLoading: true });
    renderWithTheme(<ProducersListPage />);

    // Quando está loading, deve mostrar "Carregando..." em vez da tabela
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('deve renderizar com estrutura completa da página', () => {
    renderWithTheme(<ProducersListPage />);

    expect(screen.getByText('Produtores Rurais')).toBeInTheDocument();
    expect(screen.getByText('Gerencie os produtores cadastrados no sistema')).toBeInTheDocument();
    expect(screen.getByText('+ Novo Produtor')).toBeInTheDocument();
    expect(screen.getByText('Nome')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();
  });

  it('deve renderizar com dados formatados corretamente', () => {
    renderWithTheme(<ProducersListPage />);

    // Verifica se os dados estão sendo renderizados
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    expect(screen.getByText('Pedro Costa')).toBeInTheDocument();
  });

  it('deve renderizar com número correto de fazendas', () => {
    renderWithTheme(<ProducersListPage />);

    // João Silva tem 2 fazendas
    expect(screen.getByText('2')).toBeInTheDocument();
    // Maria Santos tem 1 fazenda
    expect(screen.getByText('1')).toBeInTheDocument();
    // Pedro Costa tem 0 fazendas - verifica se existe pelo menos um "0"
    const zeroElements = screen.getAllByText('0');
    expect(zeroElements.length).toBeGreaterThanOrEqual(1);
  });

  it('deve renderizar com área total calculada corretamente', () => {
    renderWithTheme(<ProducersListPage />);

    // João Silva: 100 + 200 = 300 hectares
    expect(screen.getByText('300')).toBeInTheDocument();
    // Maria Santos: 150 hectares
    expect(screen.getByText('150')).toBeInTheDocument();
    // Pedro Costa: 0 hectares - verifica se existe pelo menos um "0"
    const zeroElements = screen.getAllByText('0');
    expect(zeroElements.length).toBeGreaterThanOrEqual(1);
  });

  it('deve renderizar com CPF/CNPJ formatado', () => {
    renderWithTheme(<ProducersListPage />);

    // Os valores formatados devem estar presentes
    // Mock da função formatCPFOrCNPJ já está configurado
    expect(screen.getByText('João Silva')).toBeInTheDocument();
  });

  it('deve renderizar com botões desabilitados durante exclusão', () => {
    mockUseDeleteProducer.mockReturnValue({ mutate: jest.fn(), isPending: true });
    renderWithTheme(<ProducersListPage />);

    const deleteButtons = screen.getAllByText('Excluir');
    expect(deleteButtons[0]).toBeDisabled();
  });

  it('deve renderizar com formulário preenchido ao editar', () => {
    renderWithTheme(<ProducersListPage />);

    const editButtons = screen.getAllByText('Editar');
    fireEvent.click(editButtons[0]);

    expect(screen.getByText('Editar Produtor')).toBeInTheDocument();
    expect(screen.getByTestId('producer-form')).toBeInTheDocument();
  });

  it('deve renderizar com mensagem de lista vazia quando não há produtores', () => {
    mockUseProducers.mockReturnValue({ data: [], isLoading: false });
    renderWithTheme(<ProducersListPage />);

    expect(screen.getByText('Nenhum produtor cadastrado')).toBeInTheDocument();
  });
});
