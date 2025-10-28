# 📚 Documentação - Brain Agriculture

Central de documentação do projeto Brain Agriculture.

---

## 📖 Documentos Disponíveis

### 🚀 Início Rápido

**[Quick Start](./quick-start.md)**

- Instalação com Docker
- Instalação sem Docker
- Configuração do ambiente
- Primeiro acesso

### 🏗️ Arquitetura

**[Arquitetura do Projeto](./architecture.md)**

- Feature-Sliced Design (FSD)
- Estrutura de pastas e camadas
- Padrões de código
- Convenções de nomenclatura
- Stack tecnológica completa

**[Diagramas Visuais](./diagrams.md)** 📊 _Mermaid_

- Arquitetura FSD com fluxo de dependências
- Modelo de banco de dados (ERD)
- Fluxo de dados da aplicação
- Ciclo completo de CRUD
- Dashboard e agregação de dados
- Sistema de notificações (Toast + ConfirmDialog)

> 💡 **Dica:** Visualize no GitHub ou use a extensão "Markdown Preview Mermaid Support" no VS Code

### 🔌 API

**[API Reference](./api-reference.md)**

- Todos os endpoints disponíveis
- Estrutura de request/response
- Validações e regras
- Exemplos práticos
- Códigos de status HTTP

**Recursos adicionais:**

- [OpenAPI Spec](../public/openapi.yaml) - Especificação OpenAPI 3.0
- [Swagger UI](http://localhost:3000/api-docs) - Interface interativa

### 📐 Requisitos e Regras

**[Requisitos do Teste](./test-requirements.md)**

- Requisitos funcionais
- Regras de negócio detalhadas
- Validações obrigatórias
- Critérios de aceitação

### 🤝 Contribuindo

**[Guia de Contribuição](./contributing.md)**

- Como contribuir com o projeto
- Padrões de código
- Processo de pull request
- Boas práticas

---

## 🔍 Navegação Rápida

### Por Tópico

- **Setup e Instalação** → [Quick Start](./quick-start.md)
- **Entender a arquitetura** → [Arquitetura](./architecture.md) + [Diagramas](./diagrams.md)
- **Usar a API** → [API Reference](./api-reference.md)
- **Ver regras de negócio** → [Requisitos](./test-requirements.md)
- **Contribuir** → [Contribuindo](./contributing.md)

### Recursos Externos

- [README Principal](../README.md) - Visão geral do projeto
- [Schema do Banco](../prisma/schema.prisma) - Estrutura do banco de dados
- [Configuração TypeScript](../tsconfig.json) - Configurações do TS

---

## 💡 Precisa de Ajuda?

Se não encontrou o que procura:

1. Verifique o [README principal](../README.md)
2. Acesse o [Swagger UI](http://localhost:3000/api-docs) para testar a API
3. Consulte os testes em `app/api/**/*.test.ts` para exemplos de uso

---
