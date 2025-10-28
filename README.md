# 🌾 Brain Agriculture

<div align="center">

Sistema completo de gerenciamento de produtores rurais desenvolvido com **Next.js**, **TypeScript** e **PostgreSQL**.

[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Tests-1465%20passing-success)](./docs/project/status.md) [![Docker](https://img.shields.io/badge/Docker-Ready-blue)](./docs/setup/docker.md)
[![API](https://img.shields.io/badge/API-OpenAPI-green)](./docs/api/openapi.yaml)
[![CI Pipeline](https://github.com/fioravante1/brain-agriculture/actions/workflows/ci.yml/badge.svg)](https://github.com/fioravante1/brain-agriculture/actions/workflows/ci.yml)
[![Deploy to Vercel](https://github.com/fioravante1/brain-agriculture/actions/workflows/deploy-vercel.yml/badge.svg)](https://github.com/fioravante1/brain-agriculture/actions/workflows/deploy-vercel.yml)

[Documentação](./docs/) • [API](./docs/api/) • [Arquitetura](./docs/architecture/)

</div>

---

## 📋 Sobre o Projeto

O Brain Agriculture é um sistema para gestão de produtores rurais, suas fazendas, culturas e safras. Desenvolvido como teste técnico, o projeto demonstra boas práticas de
desenvolvimento, arquitetura limpa e código de qualidade.

### ✨ Funcionalidades

- ✅ **Gestão de Produtores** - CRUD completo com validação CPF/CNPJ
- ✅ **Gestão de Fazendas** - Controle de áreas (total, agricultável, vegetação)
- ✅ **Culturas e Safras** - Registro de plantios por safra
- ✅ **Dashboard Analítico** - Gráficos e estatísticas em tempo real
- ✅ **API REST** - Endpoints documentados com OpenAPI
- ✅ **Validações de Negócio** - Regras aplicadas no backend e frontend

📖 **[Ver requisitos completos →](./docs/test-requirements.md)**

---

## 🚀 Início Rápido

### Com Docker (Recomendado)

**Opção A - Script Automatizado** (mais fácil):

```bash
# 1. Clone o repositório
git clone <repository-url>
cd brain-agriculture

# 2. Execute o setup
./scripts/setup.sh

# ✅ Pronto! Acesse http://localhost:3000
```

**Opção B - Manual**:

```bash
# 1. Clone o repositório
git clone <repository-url>
cd brain-agriculture

# 2. Inicie tudo (aplicação + banco de dados)
docker compose up --build

# ✅ Pronto! Acesse http://localhost:3000
```

### Sem Docker

```bash
# 1. Instale as dependências
yarn install

# 2. Configure o banco de dados
cp env.local.example .env.local
# Edite .env.local com suas credenciais

# 3. Configure o Prisma
yarn db:push
yarn db:seed

# 4. Inicie o projeto
yarn dev
```

📖 **[Guia completo de instalação →](./docs/quick-start.md)**

---

## 🏗️ Tecnologias

### Frontend

- **Next.js 16** - Framework React com SSR
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Styled Components** - CSS-in-JS
- **React Query** - Gerenciamento de estado servidor
- **React Hook Form + Zod** - Formulários e validação
- **Recharts** - Gráficos e visualizações

### Backend

- **Next.js API Routes** - API REST
- **Prisma ORM** - ORM TypeScript-first
- **PostgreSQL** - Banco de dados relacional
- **Zod** - Validação de schemas

### DevOps & Qualidade

- **Docker + Docker Compose** - Containerização
- **Jest** - Testes unitários
- **React Testing Library** - Testes de componentes
- **ESLint** - Linting
- **GitHub Actions** - CI/CD Pipeline
- **Vercel** - Deploy automático

📖 **[Ver arquitetura completa →](./docs/architecture/fsd.md)**

---

## 📁 Estrutura do Projeto

```
brain-agriculture/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes (Backend)
│   ├── dashboard/         # Página do Dashboard
│   └── producers/         # Página de Produtores
├── src/
│   ├── entities/          # Entidades de negócio (Producer, Farm, Crop)
│   ├── features/          # Funcionalidades (Dashboard, Forms)
│   ├── pages/             # Páginas compostas (FSD)
│   ├── widgets/           # Componentes complexos reutilizáveis
│   └── shared/            # UI, utils, theme
├── prisma/                # Schema e seeds do banco
├── docs/                  # 📚 Documentação completa
└── docker-compose.yml     # Docker setup
```

**Arquitetura**: [Feature-Sliced Design (FSD)](./docs/architecture/fsd.md)

---

## 🗄️ Banco de Dados

### Estrutura

- **producers** - Produtores rurais (CPF/CNPJ, nome)
- **farms** - Fazendas (áreas, localização)
- **crops** - Culturas (Soja, Milho, Café, etc.)
- **harvests** - Safras (2021, 2022, 2023)
- **farm_crops** - Relacionamento fazenda-cultura-safra

### Ferramentas

```bash
# Prisma Studio (Interface web)
yarn db:studio

# DBeaver / pgAdmin
# Host: localhost:5432
# Database: brain_agriculture
# User: postgres / Password: password
```

📖 **[Guia do banco de dados →](./docs/setup/database.md)**

---

## 🔌 API

### Endpoints Principais

```bash
# Produtores
GET    /api/producers
POST   /api/producers
PUT    /api/producers/[id]
DELETE /api/producers/[id]

# Fazendas
GET    /api/farms
POST   /api/farms
PUT    /api/farms/[id]
DELETE /api/farms/[id]

# Dashboard
GET    /api/dashboard/stats

# Culturas & Safras
GET    /api/crops
GET    /api/harvests
```

### Exemplo de Uso

```typescript
// Buscar produtores
const response = await fetch('/api/producers');
const { data, count } = await response.json();

// Criar fazenda
await fetch('/api/farms', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    producerId: 'xxx',
    name: 'Fazenda Exemplo',
    city: 'São Paulo',
    state: 'SP',
    totalArea: 1000,
    arableArea: 800,
    vegetationArea: 200,
  }),
});
```

📖 **[Documentação completa da API →](./docs/api/)** | **[OpenAPI Spec →](./docs/api/openapi.yaml)**

---

### Executar Testes

```bash
# Todos os testes
yarn test

# Com cobertura
yarn test:coverage

# Modo watch
yarn test:watch
```

---

### 🏗️ Arquitetura

| Documento                                               | Descrição              |
| ------------------------------------------------------- | ---------------------- |
| **[Feature-Sliced Design](./docs/architecture/fsd.md)** | Arquitetura do projeto |
| **[Diagramas](./docs/architecture/diagrams/)**          | Diagramas visuais      |

### 🔌 API & Integrações

| Documento                                      | Descrição            |
| ---------------------------------------------- | -------------------- |
| **[Referência da API](./docs/api/)**           | Endpoints e exemplos |
| **[OpenAPI/Swagger](./docs/api/openapi.yaml)** | Spec completa        |

### 🤝 Contribuição

| Documento                                                  | Descrição       |
| ---------------------------------------------------------- | --------------- |
| **[Guia de Contribuição](./docs/project/contributing.md)** | Como contribuir |

---

## 🐳 Docker

### Comandos Principais

```bash
# Iniciar (produção)
docker compose up --build

# Iniciar (desenvolvimento com hot reload)
docker compose -f docker-compose.dev.yml up

# Parar
docker compose down

# Ver logs
docker compose logs -f

# Resetar banco
docker compose down -v
docker compose up --build
```

📖 **[Guia completo de Docker →](./docs/setup/docker.md)**

---

## 📊 Scripts Disponíveis

```bash
# Desenvolvimento
yarn dev              # Servidor de desenvolvimento
yarn build            # Build de produção
yarn start            # Servidor de produção
yarn lint             # Linter

# Banco de Dados
yarn db:generate      # Gera Prisma client
yarn db:push          # Aplica schema ao banco
yarn db:seed          # Popula dados (se vazio)
yarn db:reset         # ⚠️ Apaga e repopula
yarn db:studio        # Prisma Studio

# Testes
yarn test             # Todos os testes
yarn test:watch       # Modo watch
yarn test:coverage    # Com cobertura
```

---

## ❓ Precisa de Ajuda?

### Recursos Rápidos

- 📖 **[Documentação Completa](./docs/)** - Central de docs

---

## 📝 Licença

Este projeto foi desenvolvido como parte de um teste técnico.

---

## 👨‍💻 Autor

**Fioravante Chiozzi**

- GitHub: [Fioravante1](https://github.com/Fioravante1)
- LinkedIn: [Fioravante Chiozzi](https://www.linkedin.com/in/fioravantechiozzi/)

---
