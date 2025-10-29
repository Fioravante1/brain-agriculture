# 🌾 Brain Agriculture

<div align="center">

Sistema completo de gerenciamento de produtores rurais desenvolvido com **Next.js**, **TypeScript** e **PostgreSQL**.

[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Tests-1493%20passing-success)](#-testes)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](./docs/quick-start.md)
[![API](https://img.shields.io/badge/API-OpenAPI-green)](./docs/api-reference.md)
[![CI Pipeline](https://github.com/fioravante1/brain-agriculture/actions/workflows/ci.yml/badge.svg)](https://github.com/fioravante1/brain-agriculture/actions/workflows/ci.yml)

[📚 Documentação](./docs/) • [🔌 API](./docs/api-reference.md) • [🏗️ Arquitetura](./docs/architecture.md)

</div>

---

## 📋 Sobre o Projeto

Sistema para gestão de produtores rurais, suas fazendas, culturas e safras. Desenvolvido seguindo **Feature-Sliced Design (FSD)** com foco em arquitetura limpa, código de qualidade e boas práticas de desenvolvimento.

---

## 🏗️ Arquitetura

O projeto utiliza **Feature-Sliced Design (FSD)**, uma arquitetura modular que organiza o código em camadas:

- **🎯 App Layer** - Rotas e configuração global do Next.js
- **📦 Entities** - Lógica de domínio (Producer, Farm, Crop, Harvest)
- **⚡ Features** - Funcionalidades de negócio (Forms, Dashboard)
- **📄 Page Compositions** - Composição de páginas
- **🧩 Widgets** - Componentes complexos reutilizáveis
- **🔧 Shared** - UI base, utils, theme, contexts

**Benefícios:**

- ✅ Separação clara de responsabilidades
- ✅ Baixo acoplamento entre módulos
- ✅ Alta testabilidade (1493 testes)
- ✅ Fácil manutenção e escalabilidade

📖 **[Documentação completa →](./docs/architecture.md)** | **[Ver diagramas →](./docs/diagrams.md)**

---

## 📐 Regras de Negócio

### Validações de Produtores

- CPF deve ter 11 dígitos válidos
- CNPJ deve ter 14 dígitos válidos
- Nome é obrigatório

### Validações de Fazendas

- **Soma das áreas:** `areaAgricultavel + areaVegetacao ≤ areaTotal`
- Todas as áreas devem ser valores positivos
- Cidade e Estado são obrigatórios
- Cada fazenda pertence a um produtor

### Culturas e Safras

- Fazendas podem ter múltiplas culturas
- Cada cultura está associada a uma safra específica
- Culturas disponíveis: Soja, Milho, Algodão, Café, Cana de Açúcar

### Dashboard

- Estatísticas calculadas em tempo real
- Gráficos por estado, cultura e uso do solo
- Totais de fazendas, hectares e produtores

📖 **[Ver regras detalhadas →](./docs/test-requirements.md)**

---

## ✨ Funcionalidades

- ✅ **CRUD Completo** - Produtores, Fazendas, Culturas e Safras
- ✅ **Dashboard Analítico** - Gráficos e estatísticas em tempo real
- ✅ **Validações** - Frontend e Backend com feedback em tempo real
- ✅ **API REST** - Endpoints documentados com OpenAPI/Swagger
- ✅ **Sistema de Notificações** - Toast messages e diálogos de confirmação
- ✅ **Responsividade** - Interface adaptável a diferentes dispositivos

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

## 🏗️ Stack Tecnológica

### Core

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Prisma ORM** + **PostgreSQL**
- **Styled Components** + **React Query** + **React Hook Form + Zod**

---

## 📁 Estrutura

```
brain-agriculture/
├── app/              # Next.js App Router + API Routes
├── src/
│   ├── entities/    # 📦 Lógica de domínio (Producer, Farm, Crop)
│   ├── features/    # ⚡ Funcionalidades de negócio
│   ├── page-compositions/  # 📄 Composição de páginas
│   ├── widgets/     # 🧩 Componentes complexos
│   └── shared/      # 🔧 UI, utils, contexts
├── prisma/          # Schema do banco
├── docs/            # 📚 Documentação
└── scripts/         # Scripts de setup
```

📖 **[Estrutura detalhada e padrões →](./docs/architecture.md)**

---

## 🔌 API

API REST documentada com OpenAPI 3.0:

**Recursos disponíveis:**

- Produtores (CRUD)
- Fazendas (CRUD)
- Culturas (CRUD)
- Safras (CRUD)
- Associações Fazenda-Cultura (CRUD)
- Dashboard (Estatísticas)

```bash
# Acessar Swagger UI
http://localhost:3000/api-docs
```

📖 **[Documentação da API →](./docs/api-reference.md)** | **[OpenAPI Spec →](./public/openapi.yaml)** | **[Swagger UI →](http://localhost:3000/api-docs)**

---

## 📚 Documentação

| Documento                                        | Descrição                                  |
| ------------------------------------------------ | ------------------------------------------ |
| **[🚀 Quick Start](./docs/quick-start.md)**      | Guia rápido de instalação e configuração   |
| **[🏗️ Arquitetura](./docs/architecture.md)**     | Feature-Sliced Design e padrões do projeto |
| **[📊 Diagramas](./docs/diagrams.md)**           | Visualizações Mermaid da arquitetura       |
| **[🔌 API Reference](./docs/api-reference.md)**  | Documentação completa da API REST          |
| **[📋 Requisitos](./docs/test-requirements.md)** | Especificação e regras de negócio          |
| **[🤝 Contribuindo](./docs/contributing.md)**    | Guia para contribuidores                   |

**Recursos adicionais:**

- [OpenAPI Spec](./public/openapi.yaml) - Especificação OpenAPI 3.0
- [Swagger UI](http://localhost:3000/api-docs) - Interface interativa da API

---

## 👨‍💻 Autor

**Fioravante Chiozzi**

- GitHub: [Fioravante1](https://github.com/Fioravante1)
- LinkedIn: [Fioravante Chiozzi](https://www.linkedin.com/in/fioravantechiozzi/)

---
