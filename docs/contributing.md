# Guia de Contribuição - Brain Agriculture

Obrigado por considerar contribuir com o Brain Agriculture! Este guia fornece informações sobre como contribuir de forma eficaz para o projeto.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Padrões de Código](#padrões-de-código)
- [Processo de Desenvolvimento](#processo-de-desenvolvimento)
- [Testes](#testes)

## 🚀 Como Contribuir

### Primeiros Passos

1. **Fork** o repositório
2. **Clone** seu fork localmente
3. **Crie** uma branch para sua feature
4. **Faça** suas alterações
5. **Teste** suas alterações
6. **Commit** suas alterações
7. **Push** para seu fork
8. **Abra** um Pull Request

## ⚙️ Configuração do Ambiente

### Pré-requisitos

- Node.js 18+
- Yarn 1.22+
- PostgreSQL 14+
- Git

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/brain-agriculture.git
cd brain-agriculture

# Instale dependências
yarn install

# Configure variáveis de ambiente
cp .env.example .env.local

# Configure o banco de dados
yarn prisma generate
yarn prisma db push
yarn prisma db seed

# Execute o projeto
yarn dev
```

### Variáveis de Ambiente

```bash
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/brain_agriculture"

# Next.js
NEXTAUTH_SECRET="seu-secret-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Opcional (para produção)
VERCEL_URL="https://seu-dominio.vercel.app"
```

## 📝 Padrões de Código

### Estrutura do Projeto

```
brain-agriculture/
├── app/                    # Next.js App Router
├── src/
│   ├── pages/              # FSD Pages Layer
│   ├── widgets/            # FSD Widgets Layer
│   ├── features/           # FSD Features Layer
│   ├── entities/           # FSD Entities Layer
│   └── shared/             # FSD Shared Layer
├── docs/                   # Documentação
├── prisma/                 # Schema do banco
```

### Convenções de Nomenclatura

#### Arquivos e Pastas

- **kebab-case** para pastas: `user-profile/`
- **kebab-case** para arquivos: `user-profile.tsx`
- **PascalCase** para componentes: `UserProfile.tsx`
- **camelCase** para utilitários: `formatDate.ts`

#### Variáveis e Funções

- **camelCase** para variáveis: `userName`
- **camelCase** para funções: `getUserData()`
- **PascalCase** para componentes: `UserProfile`
- **UPPER_CASE** para constantes: `API_BASE_URL`

#### Banco de Dados

- **snake_case** para tabelas: `user_profiles`
- **snake_case** para colunas: `created_at`
- **singular** para tabelas: `user` (não `users`)

### TypeScript

```typescript
// ✅ Bom
interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

const getUserProfile = async (id: string): Promise<UserProfile | null> => {
  // implementação
};

// ❌ Ruim
interface userprofile {
  id: string;
  name: string;
  email: string;
  createdat: Date;
}

const getuserprofile = async (id: string) => {
  // implementação
};
```

### React Components

```typescript
// ✅ Bom
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

export function Button({ children, variant = 'primary', size = 'md', disabled = false, onClick }: ButtonProps) {
  return (
    <button className={`btn btn-${variant} btn-${size}`} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

// ❌ Ruim
export function button(props: any) {
  return <button {...props} />;
}
```

### Styled Components

```typescript
// ✅ Bom
const StyledButton = styled.button<{ variant: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;

  ${({ variant }) =>
    variant === 'primary' &&
    `
    background-color: #2E7D32;
    color: white;
  `}

  ${({ variant }) =>
    variant === 'secondary' &&
    `
    background-color: transparent;
    color: #2E7D32;
    border: 1px solid #2E7D32;
  `}
`;

// ❌ Ruim
const Button = styled.button`
  padding: 12px 24px;
  background-color: #2e7d32;
  color: white;
`;
```

## 🔄 Processo de Desenvolvimento

### Git Workflow

```bash
# 1. Criar branch para feature
git checkout -b feature/nova-funcionalidade

# 2. Fazer alterações
# ... código ...

# 3. Adicionar arquivos
git add .

# 4. Commit com mensagem descritiva
git commit -m "feat(producers): adiciona validação de CPF/CNPJ

Implementa validação completa de CPF e CNPJ no formulário de produtores.
Inclui formatação automática e prevenção de duplicatas."

# 5. Push para o fork
git push origin feature/nova-funcionalidade
```

### Conventional Commits

Sempre use o padrão Conventional Commits:

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

#### Tipos de Commit

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação, espaços em branco, etc.
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Tarefas de manutenção, dependências, etc.
- `perf`: Melhoria de performance
- `ci`: Configurações de CI/CD
- `build`: Mudanças no sistema de build
- `revert`: Reversão de commit anterior

#### Exemplos

```bash
# Nova funcionalidade
git commit -m "feat(producers): adiciona validação de CPF/CNPJ"

# Correção de bug
git commit -m "fix(api): corrige erro de validação em endpoint de produtores"

# Documentação
git commit -m "docs(readme): atualiza instruções de instalação"

# Testes
git commit -m "test(producers): adiciona testes para validação de CPF/CNPJ"
```

## 🧪 Testes

### Executando Testes

```bash
# Todos os testes
yarn test

# Testes específicos
yarn test src/entities/producer

# Testes com coverage
yarn test --coverage

# Testes em modo watch
yarn test --watch
```

### Escrevendo Testes

```typescript
// ✅ Bom
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
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
  });

  it('deve validar CPF/CNPJ obrigatório', async () => {
    renderWithTheme(<ProducerForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: 'Salvar' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('CPF/CNPJ é obrigatório')).toBeInTheDocument();
    });
  });
});

// ❌ Ruim
describe('ProducerForm', () => {
  it('should work', () => {
    render(<ProducerForm />);
    expect(true).toBe(true);
  });
});
```

### Padrões de Teste

- **Nomenclatura**: Use português brasileiro
- **Estrutura**: Arrange, Act, Assert
- **Isolamento**: Cada teste deve ser independente
- **Mocks**: Use mocks para dependências externas
- **Cobertura**: Mantenha cobertura acima de 80%
