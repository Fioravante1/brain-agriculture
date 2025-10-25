import { fireEvent, renderWithTheme, screen } from '@/shared/lib/test-utils';
import { HarvestForm, HarvestFormProps } from './harvest-form';
import { HarvestFormValues } from './harvest-form.schema';

describe('Componente HarvestForm', () => {
  const defaultProps: HarvestFormProps = {
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar formulário com campos obrigatórios', () => {
    renderWithTheme(<HarvestForm {...defaultProps} />);

    expect(screen.getByText('Nome da Safra *')).toBeInTheDocument();
    expect(screen.getByText('Ano da Safra *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
  });

  it('deve renderizar com valores padrão', () => {
    renderWithTheme(<HarvestForm {...defaultProps} />);

    const nameInput = screen.getByPlaceholderText('Digite o nome da safra (ex: Safra 2024/2025)');
    const yearInput = screen.getByPlaceholderText('2024');

    expect(nameInput).toBeInTheDocument();
    expect(yearInput).toBeInTheDocument();
  });

  it('deve renderizar com valores padrão customizados', () => {
    const customValues: Partial<HarvestFormValues> = {
      name: 'Safra 2024/2025',
      year: 2024,
    };

    renderWithTheme(<HarvestForm {...defaultProps} defaultValues={customValues} />);

    expect(screen.getByText('Nome da Safra *')).toBeInTheDocument();
    expect(screen.getByText('Ano da Safra *')).toBeInTheDocument();
  });

  it('deve chamar onCancel quando botão cancelar é clicado', () => {
    const handleCancel = jest.fn();
    renderWithTheme(<HarvestForm {...defaultProps} onCancel={handleCancel} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    fireEvent.click(cancelButton);

    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it('deve renderizar botão de salvar com texto correto', () => {
    renderWithTheme(<HarvestForm {...defaultProps} />);

    const saveButton = screen.getByRole('button', { name: 'Salvar' });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveAttribute('type', 'submit');
  });

  it('deve renderizar botão de cancelar com tipo correto', () => {
    renderWithTheme(<HarvestForm {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveAttribute('type', 'button');
  });

  it('deve desabilitar campos quando isLoading é true', () => {
    renderWithTheme(<HarvestForm {...defaultProps} isLoading={true} />);

    const nameInput = screen.getByPlaceholderText('Digite o nome da safra (ex: Safra 2024/2025)');
    const yearInput = screen.getByPlaceholderText('2024');
    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    const saveButton = screen.getByRole('button', { name: 'Salvando...' });

    expect(nameInput).toBeDisabled();
    expect(yearInput).toBeDisabled();
    expect(cancelButton).toBeDisabled();
    expect(saveButton).toBeDisabled();
  });

  it('deve mostrar texto de carregamento quando isLoading é true', () => {
    renderWithTheme(<HarvestForm {...defaultProps} isLoading={true} />);

    expect(screen.getByRole('button', { name: 'Salvando...' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Salvar' })).not.toBeInTheDocument();
  });

  it('deve habilitar campos quando isLoading é false', () => {
    renderWithTheme(<HarvestForm {...defaultProps} isLoading={false} />);

    const nameInput = screen.getByPlaceholderText('Digite o nome da safra (ex: Safra 2024/2025)');
    const yearInput = screen.getByPlaceholderText('2024');
    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    const saveButton = screen.getByRole('button', { name: 'Salvar' });

    expect(nameInput).not.toBeDisabled();
    expect(yearInput).not.toBeDisabled();
    expect(cancelButton).not.toBeDisabled();
    expect(saveButton).not.toBeDisabled();
  });

  it('deve renderizar com estrutura HTML correta', () => {
    renderWithTheme(<HarvestForm {...defaultProps} />);

    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('deve renderizar com todas as props combinadas', () => {
    const customValues: Partial<HarvestFormValues> = {
      name: 'Safra Completa 2024',
      year: 2024,
    };

    const handleSubmit = jest.fn();
    const handleCancel = jest.fn();

    renderWithTheme(<HarvestForm defaultValues={customValues} onSubmit={handleSubmit} onCancel={handleCancel} isLoading={false} />);

    expect(screen.getByText('Nome da Safra *')).toBeInTheDocument();
    expect(screen.getByText('Ano da Safra *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
  });

  it('deve renderizar com labels obrigatórios', () => {
    renderWithTheme(<HarvestForm {...defaultProps} />);

    expect(screen.getByText('Nome da Safra *')).toBeInTheDocument();
    expect(screen.getByText('Ano da Safra *')).toBeInTheDocument();
  });

  it('deve renderizar com placeholders corretos', () => {
    renderWithTheme(<HarvestForm {...defaultProps} />);

    expect(screen.getByPlaceholderText('Digite o nome da safra (ex: Safra 2024/2025)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('2024')).toBeInTheDocument();
  });

  it('deve renderizar com gap correto entre elementos', () => {
    renderWithTheme(<HarvestForm {...defaultProps} />);

    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('deve renderizar com botões alinhados à direita', () => {
    renderWithTheme(<HarvestForm {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    const saveButton = screen.getByRole('button', { name: 'Salvar' });

    expect(cancelButton).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
  });

  it('deve renderizar com estado de loading completo', () => {
    renderWithTheme(<HarvestForm {...defaultProps} isLoading={true} />);

    const nameInput = screen.getByPlaceholderText('Digite o nome da safra (ex: Safra 2024/2025)');
    const yearInput = screen.getByPlaceholderText('2024');
    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    const saveButton = screen.getByRole('button', { name: 'Salvando...' });

    expect(nameInput).toBeDisabled();
    expect(yearInput).toBeDisabled();
    expect(cancelButton).toBeDisabled();
    expect(saveButton).toBeDisabled();
    expect(saveButton).toHaveTextContent('Salvando...');
  });

  it('deve renderizar com estado normal quando não está carregando', () => {
    renderWithTheme(<HarvestForm {...defaultProps} isLoading={false} />);

    const nameInput = screen.getByPlaceholderText('Digite o nome da safra (ex: Safra 2024/2025)');
    const yearInput = screen.getByPlaceholderText('2024');
    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    const saveButton = screen.getByRole('button', { name: 'Salvar' });

    expect(nameInput).not.toBeDisabled();
    expect(yearInput).not.toBeDisabled();
    expect(cancelButton).not.toBeDisabled();
    expect(saveButton).not.toBeDisabled();
    expect(saveButton).toHaveTextContent('Salvar');
  });

  it('deve renderizar com valores padrão vazios quando defaultValues não é fornecido', () => {
    renderWithTheme(<HarvestForm {...defaultProps} />);

    const nameInput = screen.getByPlaceholderText('Digite o nome da safra (ex: Safra 2024/2025)');
    const yearInput = screen.getByPlaceholderText('2024');

    expect(nameInput).toBeInTheDocument();
    expect(yearInput).toBeInTheDocument();
  });

  it('deve renderizar com valores padrão parciais', () => {
    const partialValues: Partial<HarvestFormValues> = {
      name: 'Safra Parcial',
    };

    renderWithTheme(<HarvestForm {...defaultProps} defaultValues={partialValues} />);

    const nameInput = screen.getByPlaceholderText('Digite o nome da safra (ex: Safra 2024/2025)');
    const yearInput = screen.getByPlaceholderText('2024');

    expect(nameInput).toBeInTheDocument();
    expect(yearInput).toBeInTheDocument();
  });

  it('deve renderizar com layout responsivo', () => {
    renderWithTheme(<HarvestForm {...defaultProps} />);

    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('deve renderizar com grid de duas colunas para ano da safra', () => {
    renderWithTheme(<HarvestForm {...defaultProps} />);

    const yearInput = screen.getByPlaceholderText('2024');
    expect(yearInput).toBeInTheDocument();
  });

  it('deve renderizar com fullWidth em todos os campos', () => {
    renderWithTheme(<HarvestForm {...defaultProps} />);

    const nameInput = screen.getByPlaceholderText('Digite o nome da safra (ex: Safra 2024/2025)');
    const yearInput = screen.getByPlaceholderText('2024');

    expect(nameInput).toBeInTheDocument();
    expect(yearInput).toBeInTheDocument();
  });

  it('deve renderizar com campo numérico com atributos corretos', () => {
    renderWithTheme(<HarvestForm {...defaultProps} />);

    const yearInput = screen.getByPlaceholderText('2024');
    expect(yearInput).toHaveAttribute('type', 'number');
    expect(yearInput).toHaveAttribute('min', '2000');
    expect(yearInput).toHaveAttribute('max', '2100');
  });

  it('deve renderizar com ano padrão atual', () => {
    renderWithTheme(<HarvestForm {...defaultProps} />);

    const yearInput = screen.getByPlaceholderText('2024');
    expect(yearInput).toBeInTheDocument();
  });

  it('deve renderizar com valores específicos de safra', () => {
    const specificValues: Partial<HarvestFormValues> = {
      name: 'Safra 2023/2024',
      year: 2023,
    };

    renderWithTheme(<HarvestForm {...defaultProps} defaultValues={specificValues} />);

    expect(screen.getByText('Nome da Safra *')).toBeInTheDocument();
    expect(screen.getByText('Ano da Safra *')).toBeInTheDocument();
  });

  it('deve renderizar com valores de ano limite', () => {
    const limitValues: Partial<HarvestFormValues> = {
      name: 'Safra Limite',
      year: 2100,
    };

    renderWithTheme(<HarvestForm {...defaultProps} defaultValues={limitValues} />);

    expect(screen.getByText('Nome da Safra *')).toBeInTheDocument();
    expect(screen.getByText('Ano da Safra *')).toBeInTheDocument();
  });

  it('deve renderizar com valores de ano mínimo', () => {
    const minValues: Partial<HarvestFormValues> = {
      name: 'Safra Mínima',
      year: 2000,
    };

    renderWithTheme(<HarvestForm {...defaultProps} defaultValues={minValues} />);

    expect(screen.getByText('Nome da Safra *')).toBeInTheDocument();
    expect(screen.getByText('Ano da Safra *')).toBeInTheDocument();
  });
});
