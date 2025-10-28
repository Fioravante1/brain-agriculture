# 🚀 Quick Start - Brain Agriculture

## Opção mais rápida: Docker

### Método 1: Script Automatizado (Recomendado)

```bash
# 1. Clone e entre no projeto
git clone <repository-url>
cd brain-agriculture

# 2. Execute o script de setup
./scripts/setup.sh

# Pronto! Acesse http://localhost:3000
```

### Método 2: Comandos Manuais

```bash
# 1. Clone e entre no projeto
git clone <repository-url>
cd brain-agriculture

# 2. Inicie tudo (aplicação + banco de dados)
docker compose up --build

# Pronto! Acesse http://localhost:3000
```

## O que foi criado?

✅ Aplicação Next.js rodando na porta 3000
✅ Banco PostgreSQL rodando na porta 5432
✅ Banco populado com dados de exemplo
✅ Tudo conectado e funcionando

## Comandos úteis

```bash
# Ver logs
docker compose logs -f

# Parar tudo
docker compose down

# Resetar banco de dados
docker compose down -v && docker compose up -d
```

## Modo desenvolvimento (com hot reload)

```bash
docker compose -f docker-compose.dev.yml up --build
```

## Guias completos

- 📖 [Guia Docker](setup/docker.md) - Guia completo de Docker
- 📖 [Guia do Banco de Dados](setup/database.md) - Setup e configuração
- 📋 [Documentação Completa](README.md) - Índice de toda documentação
- 📋 [README Principal](../README.md) - Visão geral do projeto
