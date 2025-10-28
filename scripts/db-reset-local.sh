#!/bin/bash

# Script para resetar o banco de dados LOCAL (Docker)
# Este script NÃO afeta o banco de produção (Neon)

set -e

echo "🗄️  Brain Agriculture - Reset do Banco Local"
echo "============================================="
echo ""

# Verificar se o Docker está rodando
if ! docker ps | grep -q brain-agriculture-db; then
    echo "❌ Container PostgreSQL não está rodando!"
    echo ""
    echo "Inicie o banco de dados primeiro:"
    echo "  docker compose up -d postgres"
    echo ""
    exit 1
fi

echo "✅ Container PostgreSQL encontrado"
echo ""

# Confirmar com o usuário
echo "⚠️  ATENÇÃO: Este script vai APAGAR todos os dados do banco LOCAL!"
echo ""
read -p "Tem certeza? (digite 'sim' para confirmar): " confirmacao

if [ "$confirmacao" != "sim" ]; then
    echo "❌ Operação cancelada"
    exit 0
fi

echo ""
echo "🗑️  Resetando banco de dados local..."
echo ""

# Usar variável de ambiente temporária para conectar no banco local
export DATABASE_URL="postgresql://postgres:password@localhost:5432/brain_agriculture"

# Executar o reset
npx tsx prisma/reset-seed.ts

echo ""
echo "✅ Banco de dados local resetado com sucesso!"
echo ""
echo "📊 Acesse o banco:"
echo "  - Prisma Studio: yarn db:studio"
echo "  - DBeaver: localhost:5432, user: postgres, password: password"
echo ""
