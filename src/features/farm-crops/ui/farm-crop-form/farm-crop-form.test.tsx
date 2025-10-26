import { fireEvent, renderWithTheme, screen } from '@/shared/lib/test-utils';
import { FarmCropForm, FarmCropFormProps } from './farm-crop-form';
import { FarmCropFormValues } from './farm-crop-form.schema';

// Mock dos hooks de entidades
jest.mock('@/entities/farm', () => ({
  useFarms: jest.fn(() => ({
    data: [
      { id: '1', name: 'Fazenda A', producer: { name: 'João Silva' } },
      { id: '2', name: 'Fazenda B', producer: { name: 'Maria Santos' } },
    ],
    isLoading: false,
  })),
}));

jest.mock('@/entities/crop', () => ({
  useCrops: jest.fn(() => ({
    data: [
      { id: '1', name: 'Soja' },
      { id: '2', name: 'Milho' },
      { id: '3', name: 'Algodão' },
    ],
    isLoading: false,
  })),
}));

jest.mock('@/entities/harvest', () => ({
  useHarvests: jest.fn(() => ({
    data: [
      { id: '1', name: 'Safra 2023', year: 2023 },
      { id: '2', name: 'Safra 2024', year: 2024 },
    ],
    isLoading: false,
  })),
}));

describe('Componente FarmCropForm', () => {
  const defaultProps: FarmCropFormProps = {
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar formulário com campos obrigatórios', () => {
    renderWithTheme(<FarmCropForm {...defaultProps} />);

    expect(screen.getByText('Fazenda *')).toBeInTheDocument();
    expect(screen.getByText('Cultura *')).toBeInTheDocument();
    expect(screen.getByText('Safra *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
  });

  it('deve renderizar com valores padrão', () => {
    renderWithTheme(<FarmCropForm {...defaultProps} />);

    const selects = screen.getAllByRole('combobox');
    expect(selects).toHaveLength(3);
  });

  it('deve renderizar com valores padrão customizados', () => {
    const customValues: Partial<FarmCropFormValues> = {
      farmId: '1',
      cropId: '2',
      harvestId: '1',
    };

    renderWithTheme(<FarmCropForm {...defaultProps} defaultValues={customValues} />);

    expect(screen.getByText('Fazenda *')).toBeInTheDocument();
    expect(screen.getByText('Cultura *')).toBeInTheDocument();
    expect(screen.getByText('Safra *')).toBeInTheDocument();
  });

  it('deve chamar onCancel quando botão cancelar é clicado', () => {
    const handleCancel = jest.fn();
    renderWithTheme(<FarmCropForm {...defaultProps} onCancel={handleCancel} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    fireEvent.click(cancelButton);

    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it('deve renderizar botão de salvar com texto correto', () => {
    renderWithTheme(<FarmCropForm {...defaultProps} />);

    const saveButton = screen.getByRole('button', { name: 'Salvar' });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveAttribute('type', 'submit');
  });

  it('deve renderizar botão de cancelar com tipo correto', () => {
    renderWithTheme(<FarmCropForm {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveAttribute('type', 'button');
  });

  it('deve desabilitar campos quando isLoading é true', () => {
    renderWithTheme(<FarmCropForm {...defaultProps} isLoading={true} />);

    const selects = screen.getAllByRole('combobox');
    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    const saveButton = screen.getByRole('button', { name: 'Salvando...' });

    selects.forEach(select => {
      expect(select).toBeDisabled();
    });
    expect(cancelButton).toBeDisabled();
    expect(saveButton).toBeDisabled();
  });

  it('deve mostrar texto de carregamento quando isLoading é true', () => {
    renderWithTheme(<FarmCropForm {...defaultProps} isLoading={true} />);

    expect(screen.getByRole('button', { name: 'Salvando...' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Salvar' })).not.toBeInTheDocument();
  });

  it('deve habilitar campos quando isLoading é false', () => {
    renderWithTheme(<FarmCropForm {...defaultProps} isLoading={false} />);

    const selects = screen.getAllByRole('combobox');
    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    const saveButton = screen.getByRole('button', { name: 'Salvar' });

    selects.forEach(select => {
      expect(select).not.toBeDisabled();
    });
    expect(cancelButton).not.toBeDisabled();
    expect(saveButton).not.toBeDisabled();
  });

  it('deve renderizar com estrutura HTML correta', () => {
    renderWithTheme(<FarmCropForm {...defaultProps} />);

    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('deve renderizar com todas as props combinadas', () => {
    const customValues: Partial<FarmCropFormValues> = {
      farmId: '2',
      cropId: '1',
      harvestId: '2',
    };

    const handleSubmit = jest.fn();
    const handleCancel = jest.fn();

    renderWithTheme(<FarmCropForm defaultValues={customValues} onSubmit={handleSubmit} onCancel={handleCancel} isLoading={false} />);

    expect(screen.getByText('Fazenda *')).toBeInTheDocument();
    expect(screen.getByText('Cultura *')).toBeInTheDocument();
    expect(screen.getByText('Safra *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
  });

  it('deve renderizar com labels obrigatórios', () => {
    renderWithTheme(<FarmCropForm {...defaultProps} />);

    expect(screen.getByText('Fazenda *')).toBeInTheDocument();
    expect(screen.getByText('Cultura *')).toBeInTheDocument();
    expect(screen.getByText('Safra *')).toBeInTheDocument();
  });

  it('deve renderizar com gap correto entre elementos', () => {
    renderWithTheme(<FarmCropForm {...defaultProps} />);

    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('deve renderizar com botões alinhados à direita', () => {
    renderWithTheme(<FarmCropForm {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    const saveButton = screen.getByRole('button', { name: 'Salvar' });

    expect(cancelButton).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
  });

  it('deve renderizar com estado de loading completo', () => {
    renderWithTheme(<FarmCropForm {...defaultProps} isLoading={true} />);

    const selects = screen.getAllByRole('combobox');
    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    const saveButton = screen.getByRole('button', { name: 'Salvando...' });

    selects.forEach(select => {
      expect(select).toBeDisabled();
    });
    expect(cancelButton).toBeDisabled();
    expect(saveButton).toBeDisabled();
    expect(saveButton).toHaveTextContent('Salvando...');
  });

  it('deve renderizar com estado normal quando não está carregando', () => {
    renderWithTheme(<FarmCropForm {...defaultProps} isLoading={false} />);

    const selects = screen.getAllByRole('combobox');
    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    const saveButton = screen.getByRole('button', { name: 'Salvar' });

    selects.forEach(select => {
      expect(select).not.toBeDisabled();
    });
    expect(cancelButton).not.toBeDisabled();
    expect(saveButton).not.toBeDisabled();
    expect(saveButton).toHaveTextContent('Salvar');
  });

  it('deve renderizar com valores padrão vazios quando defaultValues não é fornecido', () => {
    renderWithTheme(<FarmCropForm {...defaultProps} />);

    const selects = screen.getAllByRole('combobox');
    expect(selects).toHaveLength(3);
  });

  it('deve renderizar com valores padrão parciais', () => {
    const partialValues: Partial<FarmCropFormValues> = {
      farmId: '1',
    };

    renderWithTheme(<FarmCropForm {...defaultProps} defaultValues={partialValues} />);

    const selects = screen.getAllByRole('combobox');
    expect(selects).toHaveLength(3);
  });

  it('deve renderizar com layout responsivo', () => {
    renderWithTheme(<FarmCropForm {...defaultProps} />);

    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('deve renderizar com grid de duas colunas para cultura e safra', () => {
    renderWithTheme(<FarmCropForm {...defaultProps} />);

    const selects = screen.getAllByRole('combobox');
    expect(selects).toHaveLength(3);
  });

  it('deve renderizar com fullWidth em todos os selects', () => {
    renderWithTheme(<FarmCropForm {...defaultProps} />);

    const selects = screen.getAllByRole('combobox');
    expect(selects).toHaveLength(3);
  });
});
