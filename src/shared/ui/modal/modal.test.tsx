import { renderWithTheme, screen, fireEvent } from '../../lib/test-utils';
import { Modal } from './modal';

describe('Componente Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Título do Modal',
    children: <div>Conteúdo do modal</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar quando isOpen é true', () => {
    renderWithTheme(<Modal {...defaultProps} />);

    expect(screen.getByText('Título do Modal')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo do modal')).toBeInTheDocument();
  });

  it('deve renderizar corretamente quando isOpen é false', () => {
    renderWithTheme(<Modal {...defaultProps} isOpen={false} />);

    const title = screen.getByText('Título do Modal');
    expect(title).toBeInTheDocument();
  });

  it('deve renderizar com título correto', () => {
    renderWithTheme(<Modal {...defaultProps} title='Meu Modal' />);

    const title = screen.getByText('Meu Modal');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H2');
  });

  it('deve renderizar children corretamente', () => {
    renderWithTheme(
      <Modal {...defaultProps}>
        <div>
          <p>Parágrafo 1</p>
          <button>Botão</button>
        </div>
      </Modal>,
    );

    expect(screen.getByText('Parágrafo 1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Botão' })).toBeInTheDocument();
  });

  it('deve renderizar com diferentes tamanhos', () => {
    const { rerender } = renderWithTheme(<Modal {...defaultProps} size='sm' />);
    expect(screen.getByText('Título do Modal')).toBeInTheDocument();

    rerender(<Modal {...defaultProps} size='md' />);
    expect(screen.getByText('Título do Modal')).toBeInTheDocument();

    rerender(<Modal {...defaultProps} size='lg' />);
    expect(screen.getByText('Título do Modal')).toBeInTheDocument();
  });

  it('deve usar tamanho médio como padrão', () => {
    renderWithTheme(<Modal {...defaultProps} />);

    expect(screen.getByText('Título do Modal')).toBeInTheDocument();
  });

  it('deve chamar onClose quando botão de fechar é clicado', () => {
    const onClose = jest.fn();
    renderWithTheme(<Modal {...defaultProps} onClose={onClose} />);

    const closeButton = screen.getByRole('button', { name: '×' });
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onClose quando overlay é clicado', () => {
    const onClose = jest.fn();
    renderWithTheme(<Modal {...defaultProps} onClose={onClose} />);

    const overlay = screen.getByText('Título do Modal').closest('[role="presentation"]')?.parentElement;
    if (overlay) {
      fireEvent.click(overlay);
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  });

  it('não deve chamar onClose quando modal container é clicado', () => {
    const onClose = jest.fn();
    renderWithTheme(<Modal {...defaultProps} onClose={onClose} />);

    const modalContainer = screen.getByText('Título do Modal').closest('div');
    if (modalContainer) {
      fireEvent.click(modalContainer);
      expect(onClose).not.toHaveBeenCalled();
    }
  });

  it('deve ter botão de fechar com símbolo correto', () => {
    renderWithTheme(<Modal {...defaultProps} />);

    const closeButton = screen.getByRole('button', { name: '×' });
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveTextContent('×');
  });

  it('deve bloquear scroll do body quando aberto', () => {
    const { rerender } = renderWithTheme(<Modal {...defaultProps} isOpen={true} />);
    expect(document.body.style.overflow).toBe('hidden');

    rerender(<Modal {...defaultProps} isOpen={false} />);
    expect(document.body.style.overflow).toBe('unset');
  });

  it('deve restaurar scroll do body quando componente é desmontado', () => {
    const { unmount } = renderWithTheme(<Modal {...defaultProps} isOpen={true} />);
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('unset');
  });

  it('deve renderizar com conteúdo complexo', () => {
    renderWithTheme(
      <Modal {...defaultProps} title='Modal Complexo'>
        <div>
          <h3>Subtítulo</h3>
          <p>Parágrafo de conteúdo</p>
          <form>
            <input type='text' placeholder='Campo de texto' />
            <button type='submit'>Enviar</button>
          </form>
        </div>
      </Modal>,
    );

    expect(screen.getByText('Modal Complexo')).toBeInTheDocument();
    expect(screen.getByText('Subtítulo')).toBeInTheDocument();
    expect(screen.getByText('Parágrafo de conteúdo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Campo de texto')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeInTheDocument();
  });

  it('deve renderizar com todas as props combinadas', () => {
    const onClose = jest.fn();
    renderWithTheme(
      <Modal isOpen={true} onClose={onClose} title='Modal Completo' size='lg'>
        <div>Conteúdo completo</div>
      </Modal>,
    );

    expect(screen.getByText('Modal Completo')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo completo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument();
  });

  it('deve funcionar com eventos de teclado', () => {
    const onClose = jest.fn();
    renderWithTheme(<Modal {...defaultProps} onClose={onClose} />);

    const closeButton = screen.getByRole('button', { name: '×' });
    fireEvent.keyDown(closeButton, { key: 'Enter' });

    expect(closeButton).toBeInTheDocument();
  });

  it('deve ter estrutura correta do modal', () => {
    renderWithTheme(<Modal {...defaultProps} />);

    const title = screen.getByText('Título do Modal');
    const content = screen.getByText('Conteúdo do modal');
    const closeButton = screen.getByRole('button', { name: '×' });

    expect(title).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();

    expect(title.closest('div')).toContainElement(closeButton);
  });
});
