import { createRef } from 'react';
import { renderWithTheme, screen, fireEvent } from '../../lib/test-utils';
import { Select, SelectOption } from './select';

describe('Componente Select', () => {
  const mockOptions: SelectOption[] = [
    { value: 'option1', label: 'Opção 1' },
    { value: 'option2', label: 'Opção 2' },
    { value: 'option3', label: 'Opção 3' },
  ];

  const defaultProps = {
    options: mockOptions,
  };

  it('deve renderizar com props padrão', () => {
    renderWithTheme(<Select {...defaultProps} />);

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('deve renderizar com label quando fornecido', () => {
    renderWithTheme(<Select {...defaultProps} label='Selecione uma opção' />);

    const label = screen.getByText('Selecione uma opção');
    const select = screen.getByRole('combobox');

    expect(label).toBeInTheDocument();
    expect(select).toBeInTheDocument();
    expect(label.tagName).toBe('LABEL');
  });

  it('deve renderizar sem label quando não fornecido', () => {
    renderWithTheme(<Select {...defaultProps} />);

    const select = screen.getByRole('combobox');
    const label = screen.queryByRole('label');

    expect(select).toBeInTheDocument();
    expect(label).not.toBeInTheDocument();
  });

  it('deve renderizar com erro quando fornecido', () => {
    renderWithTheme(<Select {...defaultProps} error='Campo obrigatório' />);

    const select = screen.getByRole('combobox');
    const error = screen.getByText('Campo obrigatório');

    expect(select).toBeInTheDocument();
    expect(error).toBeInTheDocument();
  });

  it('deve renderizar sem erro quando não fornecido', () => {
    renderWithTheme(<Select {...defaultProps} />);

    const select = screen.getByRole('combobox');
    const error = screen.queryByText(/erro/i);

    expect(select).toBeInTheDocument();
    expect(error).not.toBeInTheDocument();
  });

  it('deve renderizar com fullWidth quando true', () => {
    renderWithTheme(<Select {...defaultProps} fullWidth />);

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('deve renderizar com placeholder quando fornecido', () => {
    renderWithTheme(<Select {...defaultProps} placeholder='Escolha uma opção' />);

    const placeholder = screen.getByText('Escolha uma opção');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveAttribute('disabled');
  });

  it('deve renderizar todas as opções fornecidas', () => {
    renderWithTheme(<Select {...defaultProps} />);

    expect(screen.getByText('Opção 1')).toBeInTheDocument();
    expect(screen.getByText('Opção 2')).toBeInTheDocument();
    expect(screen.getByText('Opção 3')).toBeInTheDocument();
  });

  it('deve renderizar opções com valores corretos', () => {
    renderWithTheme(<Select {...defaultProps} />);

    const option1 = screen.getByText('Opção 1');
    const option2 = screen.getByText('Opção 2');
    const option3 = screen.getByText('Opção 3');

    expect(option1.closest('option')).toHaveAttribute('value', 'option1');
    expect(option2.closest('option')).toHaveAttribute('value', 'option2');
    expect(option3.closest('option')).toHaveAttribute('value', 'option3');
  });

  it('deve estar desabilitado quando disabled é true', () => {
    renderWithTheme(<Select {...defaultProps} disabled />);

    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });

  it('deve chamar onChange handler quando valor muda', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Select {...defaultProps} onChange={handleChange} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'option2' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: 'option2' }),
      }),
    );
  });

  it('deve chamar onFocus handler quando focado', () => {
    const handleFocus = jest.fn();
    renderWithTheme(<Select {...defaultProps} onFocus={handleFocus} />);

    const select = screen.getByRole('combobox');
    fireEvent.focus(select);

    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onBlur handler quando perde foco', () => {
    const handleBlur = jest.fn();
    renderWithTheme(<Select {...defaultProps} onBlur={handleBlur} />);

    const select = screen.getByRole('combobox');
    fireEvent.blur(select);

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('deve aceitar atributos HTML padrão', () => {
    renderWithTheme(<Select {...defaultProps} name='categoria' required data-testid='categoria-select' />);

    const select = screen.getByTestId('categoria-select');
    expect(select).toHaveAttribute('name', 'categoria');
    expect(select).toBeRequired();
  });

  it('deve renderizar com valor inicial', () => {
    renderWithTheme(<Select {...defaultProps} defaultValue='option2' />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('option2');
  });

  it('deve renderizar com todas as props combinadas', () => {
    renderWithTheme(<Select {...defaultProps} label='Categoria' placeholder='Escolha uma categoria' error='Categoria obrigatória' fullWidth required name='categoria' />);

    const label = screen.getByText('Categoria');
    const select = screen.getByRole('combobox');
    const error = screen.getByText('Categoria obrigatória');
    const placeholder = screen.getByText('Escolha uma categoria');

    expect(label).toBeInTheDocument();
    expect(select).toBeInTheDocument();
    expect(error).toBeInTheDocument();
    expect(placeholder).toBeInTheDocument();
    expect(select).toHaveAttribute('name', 'categoria');
    expect(select).toBeRequired();
  });

  it('deve funcionar com forwardRef', () => {
    const ref = createRef<HTMLSelectElement>();
    renderWithTheme(<Select {...defaultProps} ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
    expect(ref.current).toBeInTheDocument();
  });

  it('deve ter displayName correto', () => {
    expect(Select.displayName).toBe('Select');
  });

  it('deve renderizar com opções vazias', () => {
    renderWithTheme(<Select options={[]} />);

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select.children).toHaveLength(0);
  });

  it('deve renderizar com opções de diferentes tipos de valor', () => {
    const mixedOptions: SelectOption[] = [
      { value: 'string', label: 'String Value' },
      { value: 123, label: 'Number Value' },
      { value: 'boolean', label: 'Boolean Value' },
    ];

    renderWithTheme(<Select options={mixedOptions} />);

    expect(screen.getByText('String Value')).toBeInTheDocument();
    expect(screen.getByText('Number Value')).toBeInTheDocument();
    expect(screen.getByText('Boolean Value')).toBeInTheDocument();
  });

  it('deve renderizar placeholder como primeira opção quando fornecido', () => {
    renderWithTheme(<Select {...defaultProps} placeholder='Selecione...' />);

    const select = screen.getByRole('combobox');
    const firstOption = select.children[0];

    expect(firstOption).toHaveTextContent('Selecione...');
    expect(firstOption).toHaveAttribute('disabled');
    expect(firstOption).toHaveAttribute('value', '');
  });

  it('deve permitir seleção de opções', () => {
    renderWithTheme(<Select {...defaultProps} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'option3' } });

    expect(select).toHaveValue('option3');
  });
});
