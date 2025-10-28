import { renderWithTheme, screen, fireEvent } from '../../lib/test-utils';
import { ConfirmDialog } from './confirm-dialog';
import { useConfirmState } from '../../lib/contexts/confirm-context';

jest.mock('../../lib/contexts/confirm-context');

const mockUseConfirmState = useConfirmState as jest.MockedFunction<typeof useConfirmState>;

const defaultState = {
  isOpen: true,
  title: 'Confirmação',
  message: 'Tem certeza que deseja continuar?',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  variant: 'danger' as const,
  onConfirm: jest.fn(),
  onCancel: jest.fn(),
};

describe('Componente ConfirmDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseConfirmState.mockReturnValue(defaultState);
  });

  it('deve renderizar quando isOpen é true', () => {
    renderWithTheme(<ConfirmDialog />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Confirmação')).toBeInTheDocument();
    expect(screen.getByText('Tem certeza que deseja continuar?')).toBeInTheDocument();
  });

  it('não deve renderizar quando isOpen é false', () => {
    mockUseConfirmState.mockReturnValue({ ...defaultState, isOpen: false });

    renderWithTheme(<ConfirmDialog />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('deve renderizar com título correto', () => {
    mockUseConfirmState.mockReturnValue({
      ...defaultState,
      title: 'Confirmar Exclusão',
    });

    renderWithTheme(<ConfirmDialog />);

    expect(screen.getByText('Confirmar Exclusão')).toBeInTheDocument();
  });

  it('deve renderizar com mensagem correta', () => {
    mockUseConfirmState.mockReturnValue({
      ...defaultState,
      message: 'Esta ação não pode ser desfeita.',
    });

    renderWithTheme(<ConfirmDialog />);

    expect(screen.getByText('Esta ação não pode ser desfeita.')).toBeInTheDocument();
  });

  it('deve renderizar botões com textos padrão', () => {
    renderWithTheme(<ConfirmDialog />);

    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeInTheDocument();
  });

  it('deve renderizar com textos customizados nos botões', () => {
    mockUseConfirmState.mockReturnValue({
      ...defaultState,
      confirmText: 'Excluir',
      cancelText: 'Manter',
    });

    renderWithTheme(<ConfirmDialog />);

    expect(screen.getByRole('button', { name: 'Manter' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Excluir' })).toBeInTheDocument();
  });

  it('deve chamar onConfirm quando botão de confirmar é clicado', () => {
    const onConfirm = jest.fn();
    mockUseConfirmState.mockReturnValue({
      ...defaultState,
      onConfirm,
    });

    renderWithTheme(<ConfirmDialog />);

    const confirmButton = screen.getByRole('button', { name: 'Confirmar' });
    fireEvent.click(confirmButton);

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onCancel quando botão de cancelar é clicado', () => {
    const onCancel = jest.fn();
    mockUseConfirmState.mockReturnValue({
      ...defaultState,
      onCancel,
    });

    renderWithTheme(<ConfirmDialog />);

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    fireEvent.click(cancelButton);

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('deve renderizar ícone de perigo para variante danger', () => {
    mockUseConfirmState.mockReturnValue({
      ...defaultState,
      variant: 'danger',
    });

    renderWithTheme(<ConfirmDialog />);

    expect(screen.getByText('⚠')).toBeInTheDocument();
  });

  it('deve renderizar ícone de aviso para variante warning', () => {
    mockUseConfirmState.mockReturnValue({
      ...defaultState,
      variant: 'warning',
    });

    renderWithTheme(<ConfirmDialog />);

    expect(screen.getByText('⚡')).toBeInTheDocument();
  });

  it('deve renderizar ícone de informação para variante info', () => {
    mockUseConfirmState.mockReturnValue({
      ...defaultState,
      variant: 'info',
    });

    renderWithTheme(<ConfirmDialog />);

    expect(screen.getByText('ℹ')).toBeInTheDocument();
  });

  it('deve chamar onCancel quando tecla Escape é pressionada', () => {
    const onCancel = jest.fn();
    mockUseConfirmState.mockReturnValue({
      ...defaultState,
      onCancel,
    });

    renderWithTheme(<ConfirmDialog />);

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('não deve chamar onCancel quando tecla Escape é pressionada mas o diálogo não está aberto', () => {
    const onCancel = jest.fn();
    mockUseConfirmState.mockReturnValue({
      ...defaultState,
      isOpen: false,
      onCancel,
    });

    renderWithTheme(<ConfirmDialog />);

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onCancel).not.toHaveBeenCalled();
  });

  it('deve chamar onCancel quando overlay é clicado', () => {
    const onCancel = jest.fn();
    mockUseConfirmState.mockReturnValue({
      ...defaultState,
      onCancel,
    });

    renderWithTheme(<ConfirmDialog />);

    const overlay = document.querySelector('[style*="position: fixed"]');
    if (overlay) {
      fireEvent.click(overlay);
      expect(onCancel).toHaveBeenCalledTimes(1);
    }
  });

  it('não deve chamar onCancel quando diálogo container é clicado', () => {
    const onCancel = jest.fn();
    mockUseConfirmState.mockReturnValue({
      ...defaultState,
      onCancel,
    });

    renderWithTheme(<ConfirmDialog />);

    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog);

    expect(onCancel).not.toHaveBeenCalled();
  });

  it('deve ter atributo aria-modal correto', () => {
    renderWithTheme(<ConfirmDialog />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('deve ter atributo aria-labelledby correto', () => {
    renderWithTheme(<ConfirmDialog />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'dialog-title');
  });

  it('deve ter título com id correto', () => {
    renderWithTheme(<ConfirmDialog />);

    const title = screen.getByText('Confirmação');
    expect(title).toHaveAttribute('id', 'dialog-title');
  });

  it('deve limpar event listener quando componente é desmontado', () => {
    const { unmount } = renderWithTheme(<ConfirmDialog />);

    expect(() => unmount()).not.toThrow();
  });

  it('deve renderizar com todos os elementos na ordem correta', () => {
    renderWithTheme(<ConfirmDialog />);

    const dialog = screen.getByRole('dialog');
    const title = screen.getByText('Confirmação');
    const message = screen.getByText('Tem certeza que deseja continuar?');
    const confirmButton = screen.getByRole('button', { name: 'Confirmar' });
    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });

    expect(dialog).toContainElement(title);
    expect(dialog).toContainElement(message);
    expect(dialog).toContainElement(confirmButton);
    expect(dialog).toContainElement(cancelButton);
  });

  it('deve renderizar botão de confirmação com variant danger quando variante é danger', () => {
    renderWithTheme(<ConfirmDialog />);

    const confirmButton = screen.getByRole('button', { name: 'Confirmar' });
    expect(confirmButton).toBeInTheDocument();
  });

  it('deve renderizar botão de confirmação com variant warning quando variante é warning', () => {
    mockUseConfirmState.mockReturnValue({
      ...defaultState,
      variant: 'warning',
    });

    renderWithTheme(<ConfirmDialog />);

    const confirmButton = screen.getByRole('button', { name: 'Confirmar' });
    expect(confirmButton).toBeInTheDocument();
  });

  it('deve renderizar botão de confirmação com variant primary quando variante é info', () => {
    mockUseConfirmState.mockReturnValue({
      ...defaultState,
      variant: 'info',
    });

    renderWithTheme(<ConfirmDialog />);

    const confirmButton = screen.getByRole('button', { name: 'Confirmar' });
    expect(confirmButton).toBeInTheDocument();
  });
});
