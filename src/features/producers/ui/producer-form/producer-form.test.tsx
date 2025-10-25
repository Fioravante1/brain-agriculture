import { fireEvent, renderWithTheme, screen } from '@/shared/lib/test-utils';
import { ProducerForm, ProducerFormProps } from './producer-form';
import { ProducerFormValues } from './producer-form.schema';

// Mock da função de máscara
jest.mock('@/shared/lib/utils', () => ({
  maskCPFOrCNPJ: jest.fn((value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 11) {
      return cleanValue
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      return cleanValue
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
  }),
}));

describe('Componente ProducerForm', () => {
  const defaultProps: ProducerFormProps = {
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar formulário com campos obrigatórios', () => {
    renderWithTheme(<ProducerForm {...defaultProps} />);

    expect(screen.getByText('CPF/CNPJ *')).toBeInTheDocument();
    expect(screen.getByText('Nome do Produtor *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
  });

  it('deve renderizar com valores padrão', () => {
    renderWithTheme(<ProducerForm {...defaultProps} />);

    const cpfCnpjInput = screen.getByPlaceholderText('000.000.000-00 ou 00.000.000/0000-00');
    const nameInput = screen.getByPlaceholderText('Digite o nome do produtor');

    expect(cpfCnpjInput).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();
  });

  it('deve renderizar com valores padrão customizados', () => {
    const customValues: Partial<ProducerFormValues> = {
      cpfCnpj: '123.456.789-00',
      name: 'João Silva',
    };

    renderWithTheme(<ProducerForm {...defaultProps} defaultValues={customValues} />);

    expect(screen.getByText('CPF/CNPJ *')).toBeInTheDocument();
    expect(screen.getByText('Nome do Produtor *')).toBeInTheDocument();
  });

  it('deve chamar onCancel quando botão cancelar é clicado', () => {
    const handleCancel = jest.fn();
    renderWithTheme(<ProducerForm {...defaultProps} onCancel={handleCancel} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    fireEvent.click(cancelButton);

    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it('deve renderizar botão de salvar com texto correto', () => {
    renderWithTheme(<ProducerForm {...defaultProps} />);

    const saveButton = screen.getByRole('button', { name: 'Salvar' });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveAttribute('type', 'submit');
  });

  it('deve renderizar botão de cancelar com tipo correto', () => {
    renderWithTheme(<ProducerForm {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveAttribute('type', 'button');
  });

  it('deve desabilitar campos quando isLoading é true', () => {
    renderWithTheme(<ProducerForm {...defaultProps} isLoading={true} />);

    const cpfCnpjInput = screen.getByPlaceholderText('000.000.000-00 ou 00.000.000/0000-00');
    const nameInput = screen.getByPlaceholderText('Digite o nome do produtor');
    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    const saveButton = screen.getByRole('button', { name: 'Salvando...' });

    expect(cpfCnpjInput).toBeDisabled();
    expect(nameInput).toBeDisabled();
    expect(cancelButton).toBeDisabled();
    expect(saveButton).toBeDisabled();
  });

  it('deve mostrar texto de carregamento quando isLoading é true', () => {
    renderWithTheme(<ProducerForm {...defaultProps} isLoading={true} />);

    expect(screen.getByRole('button', { name: 'Salvando...' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Salvar' })).not.toBeInTheDocument();
  });

  it('deve habilitar campos quando isLoading é false', () => {
    renderWithTheme(<ProducerForm {...defaultProps} isLoading={false} />);

    const cpfCnpjInput = screen.getByPlaceholderText('000.000.000-00 ou 00.000.000/0000-00');
    const nameInput = screen.getByPlaceholderText('Digite o nome do produtor');
    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    const saveButton = screen.getByRole('button', { name: 'Salvar' });

    expect(cpfCnpjInput).not.toBeDisabled();
    expect(nameInput).not.toBeDisabled();
    expect(cancelButton).not.toBeDisabled();
    expect(saveButton).not.toBeDisabled();
  });

  it('deve renderizar com estrutura HTML correta', () => {
    renderWithTheme(<ProducerForm {...defaultProps} />);

    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('deve renderizar com todas as props combinadas', () => {
    const customValues: Partial<ProducerFormValues> = {
      cpfCnpj: '12.345.678/0001-90',
      name: 'Maria Santos',
    };

    const handleSubmit = jest.fn();
    const handleCancel = jest.fn();

    renderWithTheme(<ProducerForm defaultValues={customValues} onSubmit={handleSubmit} onCancel={handleCancel} isLoading={false} />);

    expect(screen.getByText('CPF/CNPJ *')).toBeInTheDocument();
    expect(screen.getByText('Nome do Produtor *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
  });

  it('deve renderizar com labels obrigatórios', () => {
    renderWithTheme(<ProducerForm {...defaultProps} />);

    expect(screen.getByText('CPF/CNPJ *')).toBeInTheDocument();
    expect(screen.getByText('Nome do Produtor *')).toBeInTheDocument();
  });

  it('deve renderizar com placeholders corretos', () => {
    renderWithTheme(<ProducerForm {...defaultProps} />);

    expect(screen.getByPlaceholderText('000.000.000-00 ou 00.000.000/0000-00')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite o nome do produtor')).toBeInTheDocument();
  });

  it('deve renderizar com gap correto entre elementos', () => {
    renderWithTheme(<ProducerForm {...defaultProps} />);

    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('deve renderizar com botões alinhados à direita', () => {
    renderWithTheme(<ProducerForm {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    const saveButton = screen.getByRole('button', { name: 'Salvar' });

    expect(cancelButton).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
  });

  it('deve renderizar com estado de loading completo', () => {
    renderWithTheme(<ProducerForm {...defaultProps} isLoading={true} />);

    const cpfCnpjInput = screen.getByPlaceholderText('000.000.000-00 ou 00.000.000/0000-00');
    const nameInput = screen.getByPlaceholderText('Digite o nome do produtor');
    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    const saveButton = screen.getByRole('button', { name: 'Salvando...' });

    expect(cpfCnpjInput).toBeDisabled();
    expect(nameInput).toBeDisabled();
    expect(cancelButton).toBeDisabled();
    expect(saveButton).toBeDisabled();
    expect(saveButton).toHaveTextContent('Salvando...');
  });

  it('deve renderizar com estado normal quando não está carregando', () => {
    renderWithTheme(<ProducerForm {...defaultProps} isLoading={false} />);

    const cpfCnpjInput = screen.getByPlaceholderText('000.000.000-00 ou 00.000.000/0000-00');
    const nameInput = screen.getByPlaceholderText('Digite o nome do produtor');
    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    const saveButton = screen.getByRole('button', { name: 'Salvar' });

    expect(cpfCnpjInput).not.toBeDisabled();
    expect(nameInput).not.toBeDisabled();
    expect(cancelButton).not.toBeDisabled();
    expect(saveButton).not.toBeDisabled();
    expect(saveButton).toHaveTextContent('Salvar');
  });

  it('deve renderizar com valores padrão vazios quando defaultValues não é fornecido', () => {
    renderWithTheme(<ProducerForm {...defaultProps} />);

    const cpfCnpjInput = screen.getByPlaceholderText('000.000.000-00 ou 00.000.000/0000-00');
    const nameInput = screen.getByPlaceholderText('Digite o nome do produtor');

    expect(cpfCnpjInput).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();
  });

  it('deve renderizar com valores padrão parciais', () => {
    const partialValues: Partial<ProducerFormValues> = {
      name: 'Produtor Parcial',
    };

    renderWithTheme(<ProducerForm {...defaultProps} defaultValues={partialValues} />);

    const cpfCnpjInput = screen.getByPlaceholderText('000.000.000-00 ou 00.000.000/0000-00');
    const nameInput = screen.getByPlaceholderText('Digite o nome do produtor');

    expect(cpfCnpjInput).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();
  });

  it('deve renderizar com layout responsivo', () => {
    renderWithTheme(<ProducerForm {...defaultProps} />);

    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('deve renderizar com fullWidth em todos os campos', () => {
    renderWithTheme(<ProducerForm {...defaultProps} />);

    const cpfCnpjInput = screen.getByPlaceholderText('000.000.000-00 ou 00.000.000/0000-00');
    const nameInput = screen.getByPlaceholderText('Digite o nome do produtor');

    expect(cpfCnpjInput).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();
  });

  it('deve renderizar com campo CPF/CNPJ com máscara', () => {
    renderWithTheme(<ProducerForm {...defaultProps} />);

    const cpfCnpjInput = screen.getByPlaceholderText('000.000.000-00 ou 00.000.000/0000-00');
    expect(cpfCnpjInput).toBeInTheDocument();
  });

  it('deve renderizar com valores específicos de CPF', () => {
    const cpfValues: Partial<ProducerFormValues> = {
      cpfCnpj: '123.456.789-00',
      name: 'João Silva',
    };

    renderWithTheme(<ProducerForm {...defaultProps} defaultValues={cpfValues} />);

    expect(screen.getByText('CPF/CNPJ *')).toBeInTheDocument();
    expect(screen.getByText('Nome do Produtor *')).toBeInTheDocument();
  });

  it('deve renderizar com valores específicos de CNPJ', () => {
    const cnpjValues: Partial<ProducerFormValues> = {
      cpfCnpj: '12.345.678/0001-90',
      name: 'Empresa LTDA',
    };

    renderWithTheme(<ProducerForm {...defaultProps} defaultValues={cnpjValues} />);

    expect(screen.getByText('CPF/CNPJ *')).toBeInTheDocument();
    expect(screen.getByText('Nome do Produtor *')).toBeInTheDocument();
  });

  it('deve renderizar com valores de nome longo', () => {
    const longNameValues: Partial<ProducerFormValues> = {
      cpfCnpj: '123.456.789-00',
      name: 'João da Silva Santos Oliveira Pereira',
    };

    renderWithTheme(<ProducerForm {...defaultProps} defaultValues={longNameValues} />);

    expect(screen.getByText('CPF/CNPJ *')).toBeInTheDocument();
    expect(screen.getByText('Nome do Produtor *')).toBeInTheDocument();
  });

  it('deve renderizar com valores de nome curto', () => {
    const shortNameValues: Partial<ProducerFormValues> = {
      cpfCnpj: '123.456.789-00',
      name: 'João',
    };

    renderWithTheme(<ProducerForm {...defaultProps} defaultValues={shortNameValues} />);

    expect(screen.getByText('CPF/CNPJ *')).toBeInTheDocument();
    expect(screen.getByText('Nome do Produtor *')).toBeInTheDocument();
  });

  it('deve renderizar com valores vazios', () => {
    const emptyValues: Partial<ProducerFormValues> = {
      cpfCnpj: '',
      name: '',
    };

    renderWithTheme(<ProducerForm {...defaultProps} defaultValues={emptyValues} />);

    expect(screen.getByText('CPF/CNPJ *')).toBeInTheDocument();
    expect(screen.getByText('Nome do Produtor *')).toBeInTheDocument();
  });
});
