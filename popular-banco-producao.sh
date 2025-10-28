#!/bin/bash

# ==================================================
# 🗄️ Script para Popular Banco de Dados na Vercel
# ==================================================
# 
# INSTRUÇÕES:
# 1. Copie a DATABASE_URL da Vercel (Settings > Environment Variables)
# 2. Execute: ./popular-banco-producao.sh "sua-database-url"
# 
# ==================================================

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=================================================="
echo "🗄️  POPULAR BANCO DE DADOS - PRODUÇÃO"
echo "=================================================="
echo ""

# Verificar se foi passado o argumento
if [ -z "$1" ]; then
    echo -e "${RED}❌ ERRO: Você precisa passar a DATABASE_URL${NC}"
    echo ""
    echo "Como usar:"
    echo "  ./popular-banco-producao.sh 'postgresql://...'"
    echo ""
    echo "Como obter a DATABASE_URL:"
    echo "  1. Acesse: https://vercel.com/dashboard"
    echo "  2. Selecione o projeto: brain-agriculture"
    echo "  3. Vá em: Settings > Environment Variables"
    echo "  4. Copie o valor de DATABASE_URL"
    echo ""
    exit 1
fi

export DATABASE_URL="$1"

echo -e "${YELLOW}⏳ Verificando conexão...${NC}"
echo ""

# Verificar se consegue conectar
npx prisma db status 2>/dev/null

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao conectar no banco de dados${NC}"
    echo "Verifique se a DATABASE_URL está correta"
    exit 1
fi

echo -e "${GREEN}✅ Conectado ao banco!${NC}"
echo ""

echo -e "${YELLOW}⏳ Gerando cliente Prisma...${NC}"
yarn prisma generate

echo -e "${YELLOW}⏳ Aplicando schema ao banco...${NC}"
yarn prisma db push --accept-data-loss

echo -e "${YELLOW}⏳ Populando banco com dados...${NC}"
yarn db:seed

echo ""
echo -e "${GREEN}=================================================="
echo "✅ BANCO POPULADO COM SUCESSO!"
echo "==================================================${NC}"
echo ""
echo "🎉 Aplicação disponível em: https://brain-agriculture.vercel.app"
echo ""
echo "💡 Para ver os dados: yarn prisma studio"

