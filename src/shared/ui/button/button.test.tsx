import { renderWithTheme, screen, fireEvent } from '../../lib/test-utils';
import { Button } from './button';

describe('Componente Button', () => {
  it('deve renderizar com props padrão', () => {
    renderWithTheme(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
  });

  it('deve renderizar com diferentes variantes', () => {
    const { rerender } = renderWithTheme(<Button variant='primary'>Primary</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button variant='secondary'>Secondary</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button variant='outline'>Outline</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button variant='danger'>Danger</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('deve renderizar com diferentes tamanhos', () => {
    const { rerender } = renderWithTheme(<Button size='sm'>Small</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button size='md'>Medium</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button size='lg'>Large</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('deve renderizar com fullWidth prop', () => {
    renderWithTheme(<Button fullWidth>Full Width</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('deve estar desabilitado quando disabled prop é true', () => {
    renderWithTheme(<Button disabled>Disabled</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('deve chamar onClick handler quando clicado', () => {
    const handleClick = jest.fn();
    renderWithTheme(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('não deve chamar onClick handler quando desabilitado', () => {
    const handleClick = jest.fn();
    renderWithTheme(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('deve aceitar className customizada', () => {
    renderWithTheme(<Button className='custom-class'>Custom</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('deve aceitar atributos data customizados', () => {
    renderWithTheme(<Button data-testid='custom-button'>Custom</Button>);

    const button = screen.getByTestId('custom-button');
    expect(button).toBeInTheDocument();
  });

  it('deve renderizar children corretamente', () => {
    renderWithTheme(
      <Button>
        <span>Icon</span>
        Text
      </Button>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('IconText');
  });

  it('deve lidar com eventos de teclado', () => {
    const handleKeyDown = jest.fn();
    renderWithTheme(<Button onKeyDown={handleKeyDown}>Keyboard</Button>);

    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter' });

    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });

  it('deve ter atributo type correto', () => {
    renderWithTheme(<Button type='submit'>Submit</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('deve ter atributo type padrão correto', () => {
    renderWithTheme(<Button>Default</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });
});
