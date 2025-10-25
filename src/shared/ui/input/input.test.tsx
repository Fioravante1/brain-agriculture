import { createRef } from 'react';
import { renderWithTheme, screen, fireEvent } from '../../lib/test-utils';
import { Input } from './input';

describe('Componente Input', () => {
  it('deve renderizar com props padrão', () => {
    renderWithTheme(<Input />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('deve renderizar com label quando fornecido', () => {
    renderWithTheme(<Input label='Nome do usuário' />);

    const label = screen.getByText('Nome do usuário');
    const input = screen.getByRole('textbox');

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(label.tagName).toBe('LABEL');
  });

  it('deve renderizar sem label quando não fornecido', () => {
    renderWithTheme(<Input />);

    const input = screen.getByRole('textbox');
    const label = screen.queryByRole('label');

    expect(input).toBeInTheDocument();
    expect(label).not.toBeInTheDocument();
  });

  it('deve renderizar com erro quando fornecido', () => {
    renderWithTheme(<Input error='Campo obrigatório' />);

    const input = screen.getByRole('textbox');
    const error = screen.getByText('Campo obrigatório');

    expect(input).toBeInTheDocument();
    expect(error).toBeInTheDocument();
  });

  it('deve renderizar sem erro quando não fornecido', () => {
    renderWithTheme(<Input />);

    const input = screen.getByRole('textbox');
    const error = screen.queryByText(/erro/i);

    expect(input).toBeInTheDocument();
    expect(error).not.toBeInTheDocument();
  });

  it('deve renderizar com fullWidth quando true', () => {
    renderWithTheme(<Input fullWidth />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('deve renderizar com placeholder', () => {
    renderWithTheme(<Input placeholder='Digite seu nome' />);

    const input = screen.getByPlaceholderText('Digite seu nome');
    expect(input).toBeInTheDocument();
  });

  it('deve renderizar com valor inicial', () => {
    renderWithTheme(<Input defaultValue='Valor inicial' />);

    const input = screen.getByDisplayValue('Valor inicial');
    expect(input).toBeInTheDocument();
  });

  it('deve estar desabilitado quando disabled é true', () => {
    renderWithTheme(<Input disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('deve chamar onChange handler quando valor muda', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'novo valor' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: 'novo valor' }),
      }),
    );
  });

  it('deve chamar onFocus handler quando focado', () => {
    const handleFocus = jest.fn();
    renderWithTheme(<Input onFocus={handleFocus} />);

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);

    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onBlur handler quando perde foco', () => {
    const handleBlur = jest.fn();
    renderWithTheme(<Input onBlur={handleBlur} />);

    const input = screen.getByRole('textbox');
    fireEvent.blur(input);

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('deve aceitar atributos HTML padrão', () => {
    renderWithTheme(<Input type='email' name='email' required data-testid='email-input' />);

    const input = screen.getByTestId('email-input');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('name', 'email');
    expect(input).toBeRequired();
  });

  it('deve renderizar com todas as props combinadas', () => {
    renderWithTheme(<Input label='Email' placeholder='Digite seu email' error='Email inválido' fullWidth required type='email' />);

    const label = screen.getByText('Email');
    const input = screen.getByRole('textbox');
    const error = screen.getByText('Email inválido');

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(error).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'Digite seu email');
    expect(input).toBeRequired();
  });

  it('deve funcionar com forwardRef', () => {
    const ref = createRef<HTMLInputElement>();
    renderWithTheme(<Input ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toBeInTheDocument();
  });

  it('deve ter displayName correto', () => {
    expect(Input.displayName).toBe('Input');
  });

  it('deve renderizar com diferentes tipos de input', () => {
    const { rerender } = renderWithTheme(<Input type='text' />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');

    rerender(<Input type='password' />);
    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password');

    rerender(<Input type='number' />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number');
  });
});
