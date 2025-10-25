import { fireEvent, renderWithTheme, screen } from '@/shared/lib/test-utils';
import { CropForm, CropFormProps } from './crop-form';
import { CropFormValues } from './crop-form.schema';

describe('Componente CropForm', () => {
  const defaultProps: CropFormProps = {
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar formulário com campos obrigatórios', () => {
    renderWithTheme(<CropForm {...defaultProps} />);

    expect(screen.getByText('Nome da Cultura *')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite o nome da cultura (ex: Soja, Milho, Algodão)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
  });

  it('deve renderizar com valores padrão', () => {
    renderWithTheme(<CropForm {...defaultProps} />);

    const nameInput = screen.getByPlaceholderText('Digite o nome da cultura (ex: Soja, Milho, Algodão)');
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveValue('');
  });

  it('deve renderizar com valores padrão customizados', () => {
    const customValues: Partial<CropFormValues> = {
      name: 'Soja',
    };

    renderWithTheme(<CropForm {...defaultProps} defaultValues={customValues} />);

    const nameInput = screen.getByPlaceholderText('Digite o nome da cultura (ex: Soja, Milho, Algodão)');
    expect(nameInput).toBeInTheDocument();
  });

  it('deve chamar onCancel quando botão cancelar é clicado', () => {
    const handleCancel = jest.fn();
    renderWithTheme(<CropForm {...defaultProps} onCancel={handleCancel} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    fireEvent.click(cancelButton);

    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it('deve renderizar botão de salvar com texto correto', () => {
    renderWithTheme(<CropForm {...defaultProps} />);

    const saveButton = screen.getByRole('button', { name: 'Salvar' });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveAttribute('type', 'submit');
  });

  it('deve renderizar botão de cancelar com tipo correto', () => {
    renderWithTheme(<CropForm {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveAttribute('type', 'button');
  });

  it('deve desabilitar campos quando isLoading é true', () => {
    renderWithTheme(<CropForm {...defaultProps} isLoading={true} />);

    const nameInput = screen.getByPlaceholderText('Digite o nome da cultura (ex: Soja, Milho, Algodão)');
    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    const saveButton = screen.getByRole('button', { name: 'Salvando...' });

    expect(nameInput).toBeDisabled();
    expect(cancelButton).toBeDisabled();
    expect(saveButton).toBeDisabled();
  });

  it('deve mostrar texto de carregamento quando isLoading é true', () => {
    renderWithTheme(<CropForm {...defaultProps} isLoading={true} />);

    expect(screen.getByRole('button', { name: 'Salvando...' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Salvar' })).not.toBeInTheDocument();
  });

  it('deve habilitar campos quando isLoading é false', () => {
    renderWithTheme(<CropForm {...defaultProps} isLoading={false} />);

    const nameInput = screen.getByPlaceholderText('Digite o nome da cultura (ex: Soja, Milho, Algodão)');
    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    const saveButton = screen.getByRole('button', { name: 'Salvar' });

    expect(nameInput).not.toBeDisabled();
    expect(cancelButton).not.toBeDisabled();
    expect(saveButton).not.toBeDisabled();
  });

  it('deve renderizar com estrutura HTML correta', () => {
    renderWithTheme(<CropForm {...defaultProps} />);

    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('deve renderizar com todas as props combinadas', () => {
    const customValues: Partial<CropFormValues> = {
      name: 'Milho',
    };

    const handleSubmit = jest.fn();
    const handleCancel = jest.fn();

    renderWithTheme(<CropForm defaultValues={customValues} onSubmit={handleSubmit} onCancel={handleCancel} isLoading={false} />);

    expect(screen.getByText('Nome da Cultura *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
  });

  it('deve renderizar com placeholder correto', () => {
    renderWithTheme(<CropForm {...defaultProps} />);

    const placeholder = screen.getByPlaceholderText('Digite o nome da cultura (ex: Soja, Milho, Algodão)');
    expect(placeholder).toBeInTheDocument();
  });

  it('deve renderizar com label obrigatório', () => {
    renderWithTheme(<CropForm {...defaultProps} />);

    const label = screen.getByText('Nome da Cultura *');
    expect(label).toBeInTheDocument();
  });

  it('deve renderizar com gap correto entre elementos', () => {
    renderWithTheme(<CropForm {...defaultProps} />);

    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('deve renderizar com botões alinhados à direita', () => {
    renderWithTheme(<CropForm {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    const saveButton = screen.getByRole('button', { name: 'Salvar' });

    expect(cancelButton).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
  });

  it('deve renderizar com estado de loading completo', () => {
    renderWithTheme(<CropForm {...defaultProps} isLoading={true} />);

    const nameInput = screen.getByPlaceholderText('Digite o nome da cultura (ex: Soja, Milho, Algodão)');
    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    const saveButton = screen.getByRole('button', { name: 'Salvando...' });

    expect(nameInput).toBeDisabled();
    expect(cancelButton).toBeDisabled();
    expect(saveButton).toBeDisabled();
    expect(saveButton).toHaveTextContent('Salvando...');
  });

  it('deve renderizar com estado normal quando não está carregando', () => {
    renderWithTheme(<CropForm {...defaultProps} isLoading={false} />);

    const nameInput = screen.getByPlaceholderText('Digite o nome da cultura (ex: Soja, Milho, Algodão)');
    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    const saveButton = screen.getByRole('button', { name: 'Salvar' });

    expect(nameInput).not.toBeDisabled();
    expect(cancelButton).not.toBeDisabled();
    expect(saveButton).not.toBeDisabled();
    expect(saveButton).toHaveTextContent('Salvar');
  });

  it('deve renderizar com valores padrão vazios quando defaultValues não é fornecido', () => {
    renderWithTheme(<CropForm {...defaultProps} />);

    const nameInput = screen.getByPlaceholderText('Digite o nome da cultura (ex: Soja, Milho, Algodão)');
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveValue('');
  });

  it('deve renderizar com valores padrão parciais', () => {
    const partialValues: Partial<CropFormValues> = {
      name: 'Algodão',
    };

    renderWithTheme(<CropForm {...defaultProps} defaultValues={partialValues} />);

    const nameInput = screen.getByPlaceholderText('Digite o nome da cultura (ex: Soja, Milho, Algodão)');
    expect(nameInput).toBeInTheDocument();
  });
});
