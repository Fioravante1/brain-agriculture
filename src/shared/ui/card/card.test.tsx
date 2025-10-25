import { renderWithTheme, screen } from '../../lib/test-utils';
import { Card } from './card';

describe('Componente Card', () => {
  it('deve renderizar com props padrão', () => {
    renderWithTheme(<Card>Conteúdo do card</Card>);

    const card = screen.getByText('Conteúdo do card');
    expect(card).toBeInTheDocument();
  });

  it('deve renderizar com título quando fornecido', () => {
    renderWithTheme(<Card title='Título do Card'>Conteúdo do card</Card>);

    const title = screen.getByText('Título do Card');
    const content = screen.getByText('Conteúdo do card');

    expect(title).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    expect(title.tagName).toBe('H3');
  });

  it('deve renderizar sem título quando não fornecido', () => {
    renderWithTheme(<Card>Conteúdo do card</Card>);

    const content = screen.getByText('Conteúdo do card');
    const title = screen.queryByRole('heading');

    expect(content).toBeInTheDocument();
    expect(title).not.toBeInTheDocument();
  });

  it('deve renderizar com diferentes tamanhos de padding', () => {
    const { rerender } = renderWithTheme(<Card padding='sm'>Small padding</Card>);
    expect(screen.getByText('Small padding')).toBeInTheDocument();

    rerender(<Card padding='md'>Medium padding</Card>);
    expect(screen.getByText('Medium padding')).toBeInTheDocument();

    rerender(<Card padding='lg'>Large padding</Card>);
    expect(screen.getByText('Large padding')).toBeInTheDocument();
  });

  it('deve usar padding médio como padrão', () => {
    renderWithTheme(<Card>Conteúdo padrão</Card>);

    const content = screen.getByText('Conteúdo padrão');
    expect(content).toBeInTheDocument();
  });

  it('deve renderizar com shadow quando shadow é true', () => {
    renderWithTheme(<Card shadow={true}>Card com shadow</Card>);

    const content = screen.getByText('Card com shadow');
    expect(content).toBeInTheDocument();
  });

  it('deve renderizar sem shadow quando shadow é false', () => {
    renderWithTheme(<Card shadow={false}>Card sem shadow</Card>);

    const content = screen.getByText('Card sem shadow');
    expect(content).toBeInTheDocument();
  });

  it('deve usar shadow como padrão quando não especificado', () => {
    renderWithTheme(<Card>Card padrão</Card>);

    const content = screen.getByText('Card padrão');
    expect(content).toBeInTheDocument();
  });

  it('deve renderizar children corretamente', () => {
    renderWithTheme(
      <Card>
        <div>Elemento 1</div>
        <span>Elemento 2</span>
        <p>Elemento 3</p>
      </Card>,
    );

    expect(screen.getByText('Elemento 1')).toBeInTheDocument();
    expect(screen.getByText('Elemento 2')).toBeInTheDocument();
    expect(screen.getByText('Elemento 3')).toBeInTheDocument();
  });

  it('deve renderizar com título e conteúdo complexo', () => {
    renderWithTheme(
      <Card title='Card Complexo'>
        <div>
          <h4>Subtítulo</h4>
          <p>Parágrafo de conteúdo</p>
          <button>Botão</button>
        </div>
      </Card>,
    );

    expect(screen.getByText('Card Complexo')).toBeInTheDocument();
    expect(screen.getByText('Subtítulo')).toBeInTheDocument();
    expect(screen.getByText('Parágrafo de conteúdo')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('deve renderizar com todas as props combinadas', () => {
    renderWithTheme(
      <Card title='Card Completo' padding='lg' shadow={false}>
        Conteúdo completo
      </Card>,
    );

    const title = screen.getByText('Card Completo');
    const content = screen.getByText('Conteúdo completo');

    expect(title).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });
});
