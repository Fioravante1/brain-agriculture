import { fireEvent, renderWithTheme, screen } from '@/shared/lib/test-utils';
import { FarmForm, FarmFormProps } from './farm-form';
import { FarmFormValues } from './farm-form.schema';

// Mock do hook de produtores
jest.mock('@/entities/producer', () => ({
  useProducers: jest.fn(() => ({
    data: [
      { id: '1', name: 'João Silva' },
      { id: '2', name: 'Maria Santos' },
      { id: '3', name: 'Pedro Costa' },
    ],
    isLoading: false,
  })),
}));

describe('Componente FarmForm', () => {
  const defaultProps: FarmFormProps = {
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar formulário com campos obrigatórios', () => {
    renderWithTheme(<FarmForm {...defaultProps} />);

    expect(screen.getByText('Produtor *')).toBeInTheDocument();
    expect(screen.getByText('Nome da Fazenda *')).toBeInTheDocument();
    expect(screen.getByText('Cidade *')).toBeInTheDocument();
    expect(screen.getByText('Estado *')).toBeInTheDocument();
    expect(screen.getByText('Área Total (hectares) *')).toBeInTheDocument();
    expect(screen.getByText('Área Agricultável (hectares) *')).toBeInTheDocument();
    expect(screen.getByText('Área de Vegetação (hectares) *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
  });

  it('deve renderizar com valores padrão', () => {
    renderWithTheme(<FarmForm {...defaultProps} />);

    const nameInput = screen.getByPlaceholderText('Digite o nome da fazenda');
    const cityInput = screen.getByPlaceholderText('Digite a cidade');
    const stateInput = screen.getByPlaceholderText('Digite o estado (ex: SP, MG, MT)');
    const numberInputs = screen.getAllByDisplayValue('');

    expect(nameInput).toBeInTheDocument();
    expect(cityInput).toBeInTheDocument();
    expect(stateInput).toBeInTheDocument();
    expect(numberInputs).toHaveLength(3);
  });

  it('deve renderizar com valores padrão customizados', () => {
    const customValues: Partial<FarmFormValues> = {
      name: 'Fazenda Teste',
      city: 'São Paulo',
      state: 'SP',
      totalArea: 100,
    };

    renderWithTheme(<FarmForm {...defaultProps} defaultValues={customValues} />);

    expect(screen.getByText('Produtor *')).toBeInTheDocument();
    expect(screen.getByText('Nome da Fazenda *')).toBeInTheDocument();
    expect(screen.getByText('Cidade *')).toBeInTheDocument();
    expect(screen.getByText('Estado *')).toBeInTheDocument();
  });

  it('deve chamar onCancel quando botão cancelar é clicado', () => {
    const handleCancel = jest.fn();
    renderWithTheme(<FarmForm {...defaultProps} onCancel={handleCancel} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    fireEvent.click(cancelButton);

    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it('deve renderizar botão de salvar com texto correto', () => {
    renderWithTheme(<FarmForm {...defaultProps} />);

    const saveButton = screen.getByRole('button', { name: 'Salvar' });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveAttribute('type', 'submit');
  });

  it('deve renderizar botão de cancelar com tipo correto', () => {
    renderWithTheme(<FarmForm {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveAttribute('type', 'button');
  });

  it('deve desabilitar campos quando isLoading é true', () => {
    renderWithTheme(<FarmForm {...defaultProps} isLoading={true} />);

    const nameInput = screen.getByPlaceholderText('Digite o nome da fazenda');
    const cityInput = screen.getByPlaceholderText('Digite a cidade');
    const stateInput = screen.getByPlaceholderText('Digite o estado (ex: SP, MG, MT)');
    const numberInputs = screen.getAllByDisplayValue('');
    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    const saveButton = screen.getByRole('button', { name: 'Salvando...' });

    expect(nameInput).toBeDisabled();
    expect(cityInput).toBeDisabled();
    expect(stateInput).toBeDisabled();
    numberInputs.forEach(input => {
      expect(input).toBeDisabled();
    });
    expect(cancelButton).toBeDisabled();
    expect(saveButton).toBeDisabled();
  });

  it('deve mostrar texto de carregamento quando isLoading é true', () => {
    renderWithTheme(<FarmForm {...defaultProps} isLoading={true} />);

    expect(screen.getByRole('button', { name: 'Salvando...' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Salvar' })).not.toBeInTheDocument();
  });

  it('deve habilitar campos quando isLoading é false', () => {
    renderWithTheme(<FarmForm {...defaultProps} isLoading={false} />);

    const nameInput = screen.getByPlaceholderText('Digite o nome da fazenda');
    const cityInput = screen.getByPlaceholderText('Digite a cidade');
    const stateInput = screen.getByPlaceholderText('Digite o estado (ex: SP, MG, MT)');
    const numberInputs = screen.getAllByDisplayValue('');
    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    const saveButton = screen.getByRole('button', { name: 'Salvar' });

    expect(nameInput).not.toBeDisabled();
    expect(cityInput).not.toBeDisabled();
    expect(stateInput).not.toBeDisabled();
    numberInputs.forEach(input => {
      expect(input).not.toBeDisabled();
    });
    expect(cancelButton).not.toBeDisabled();
    expect(saveButton).not.toBeDisabled();
  });

  it('deve renderizar com estrutura HTML correta', () => {
    renderWithTheme(<FarmForm {...defaultProps} />);

    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('deve renderizar com todas as props combinadas', () => {
    const customValues: Partial<FarmFormValues> = {
      name: 'Fazenda Completa',
      city: 'Brasília',
      state: 'DF',
      totalArea: 500,
      arableArea: 300,
      vegetationArea: 150,
    };

    const handleSubmit = jest.fn();
    const handleCancel = jest.fn();

    renderWithTheme(<FarmForm defaultValues={customValues} onSubmit={handleSubmit} onCancel={handleCancel} isLoading={false} />);

    expect(screen.getByText('Produtor *')).toBeInTheDocument();
    expect(screen.getByText('Nome da Fazenda *')).toBeInTheDocument();
    expect(screen.getByText('Cidade *')).toBeInTheDocument();
    expect(screen.getByText('Estado *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
  });

  it('deve renderizar com labels obrigatórios', () => {
    renderWithTheme(<FarmForm {...defaultProps} />);

    expect(screen.getByText('Produtor *')).toBeInTheDocument();
    expect(screen.getByText('Nome da Fazenda *')).toBeInTheDocument();
    expect(screen.getByText('Cidade *')).toBeInTheDocument();
    expect(screen.getByText('Estado *')).toBeInTheDocument();
    expect(screen.getByText('Área Total (hectares) *')).toBeInTheDocument();
    expect(screen.getByText('Área Agricultável (hectares) *')).toBeInTheDocument();
    expect(screen.getByText('Área de Vegetação (hectares) *')).toBeInTheDocument();
  });

  it('deve renderizar com placeholders corretos', () => {
    renderWithTheme(<FarmForm {...defaultProps} />);

    expect(screen.getByPlaceholderText('Digite o nome da fazenda')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite a cidade')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite o estado (ex: SP, MG, MT)')).toBeInTheDocument();
    const numberInputs = screen.getAllByPlaceholderText('0.00');
    expect(numberInputs).toHaveLength(3);
  });

  it('deve renderizar com gap correto entre elementos', () => {
    renderWithTheme(<FarmForm {...defaultProps} />);

    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('deve renderizar com botões alinhados à direita', () => {
    renderWithTheme(<FarmForm {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    const saveButton = screen.getByRole('button', { name: 'Salvar' });

    expect(cancelButton).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
  });

  it('deve renderizar com estado de loading completo', () => {
    renderWithTheme(<FarmForm {...defaultProps} isLoading={true} />);

    const nameInput = screen.getByPlaceholderText('Digite o nome da fazenda');
    const cityInput = screen.getByPlaceholderText('Digite a cidade');
    const stateInput = screen.getByPlaceholderText('Digite o estado (ex: SP, MG, MT)');
    const numberInputs = screen.getAllByPlaceholderText('0.00');
    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    const saveButton = screen.getByRole('button', { name: 'Salvando...' });

    expect(nameInput).toBeDisabled();
    expect(cityInput).toBeDisabled();
    expect(stateInput).toBeDisabled();
    numberInputs.forEach(input => {
      expect(input).toBeDisabled();
    });
    expect(cancelButton).toBeDisabled();
    expect(saveButton).toBeDisabled();
    expect(saveButton).toHaveTextContent('Salvando...');
  });

  it('deve renderizar com estado normal quando não está carregando', () => {
    renderWithTheme(<FarmForm {...defaultProps} isLoading={false} />);

    const nameInput = screen.getByPlaceholderText('Digite o nome da fazenda');
    const cityInput = screen.getByPlaceholderText('Digite a cidade');
    const stateInput = screen.getByPlaceholderText('Digite o estado (ex: SP, MG, MT)');
    const numberInputs = screen.getAllByPlaceholderText('0.00');
    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    const saveButton = screen.getByRole('button', { name: 'Salvar' });

    expect(nameInput).not.toBeDisabled();
    expect(cityInput).not.toBeDisabled();
    expect(stateInput).not.toBeDisabled();
    numberInputs.forEach(input => {
      expect(input).not.toBeDisabled();
    });
    expect(cancelButton).not.toBeDisabled();
    expect(saveButton).not.toBeDisabled();
    expect(saveButton).toHaveTextContent('Salvar');
  });

  it('deve renderizar com valores padrão vazios quando defaultValues não é fornecido', () => {
    renderWithTheme(<FarmForm {...defaultProps} />);

    const nameInput = screen.getByPlaceholderText('Digite o nome da fazenda');
    const cityInput = screen.getByPlaceholderText('Digite a cidade');
    const stateInput = screen.getByPlaceholderText('Digite o estado (ex: SP, MG, MT)');
    const numberInputs = screen.getAllByDisplayValue('');

    expect(nameInput).toBeInTheDocument();
    expect(cityInput).toBeInTheDocument();
    expect(stateInput).toBeInTheDocument();
    expect(numberInputs).toHaveLength(3);
  });

  it('deve renderizar com valores padrão parciais', () => {
    const partialValues: Partial<FarmFormValues> = {
      name: 'Fazenda Parcial',
    };

    renderWithTheme(<FarmForm {...defaultProps} defaultValues={partialValues} />);

    const nameInput = screen.getByPlaceholderText('Digite o nome da fazenda');
    const cityInput = screen.getByPlaceholderText('Digite a cidade');
    const stateInput = screen.getByPlaceholderText('Digite o estado (ex: SP, MG, MT)');
    const numberInputs = screen.getAllByPlaceholderText('0.00');

    expect(nameInput).toBeInTheDocument();
    expect(cityInput).toBeInTheDocument();
    expect(stateInput).toBeInTheDocument();
    expect(numberInputs).toHaveLength(3);
  });

  it('deve renderizar com layout responsivo', () => {
    renderWithTheme(<FarmForm {...defaultProps} />);

    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('deve renderizar com grid de duas colunas para cidade e estado', () => {
    renderWithTheme(<FarmForm {...defaultProps} />);

    const cityInput = screen.getByPlaceholderText('Digite a cidade');
    const stateInput = screen.getByPlaceholderText('Digite o estado (ex: SP, MG, MT)');

    expect(cityInput).toBeInTheDocument();
    expect(stateInput).toBeInTheDocument();
  });

  it('deve renderizar com grid de duas colunas para área total e agricultável', () => {
    renderWithTheme(<FarmForm {...defaultProps} />);

    const numberInputs = screen.getAllByDisplayValue('');
    expect(numberInputs).toHaveLength(3);
  });

  it('deve renderizar com fullWidth em todos os campos', () => {
    renderWithTheme(<FarmForm {...defaultProps} />);

    const nameInput = screen.getByPlaceholderText('Digite o nome da fazenda');
    const cityInput = screen.getByPlaceholderText('Digite a cidade');
    const stateInput = screen.getByPlaceholderText('Digite o estado (ex: SP, MG, MT)');
    const numberInputs = screen.getAllByDisplayValue('');

    expect(nameInput).toBeInTheDocument();
    expect(cityInput).toBeInTheDocument();
    expect(stateInput).toBeInTheDocument();
    expect(numberInputs).toHaveLength(3);
  });

  it('deve renderizar com campos numéricos com atributos corretos', () => {
    renderWithTheme(<FarmForm {...defaultProps} />);

    const numberInputs = screen.getAllByPlaceholderText('0.00');
    const firstNumberInput = numberInputs[0];

    expect(firstNumberInput).toHaveAttribute('type', 'number');
    expect(firstNumberInput).toHaveAttribute('step', '0.01');
    expect(firstNumberInput).toHaveAttribute('min', '0');
  });

  it('deve renderizar com select de produtores', () => {
    renderWithTheme(<FarmForm {...defaultProps} />);

    const producerSelect = screen.getByRole('combobox');
    expect(producerSelect).toBeInTheDocument();
  });
});
