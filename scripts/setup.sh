#!/bin/bash

# Brain Agriculture - Setup Script
# Este script configura o ambiente de desenvolvimento

set -e

# Obter o diretório do script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Mudar para o diretório raiz do projeto
cd "$PROJECT_ROOT"

echo "🌾 Brain Agriculture - Setup Script"
echo "===================================="
echo ""

# Função para verificar se um comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar Docker
if command_exists docker; then
    echo "✅ Docker encontrado: $(docker --version)"
else
    echo "❌ Docker não encontrado. Por favor, instale o Docker."
    exit 1
fi

# Verificar Docker Compose
if command_exists docker-compose; then
    echo "✅ Docker Compose encontrado: $(docker-compose --version)"
elif docker compose version >/dev/null 2>&1; then
    echo "✅ Docker Compose (plugin) encontrado"
    DOCKER_COMPOSE="docker compose"
else
    echo "❌ Docker Compose não encontrado. Por favor, instale o Docker Compose."
    exit 1
fi

# Definir comando do Docker Compose
DOCKER_COMPOSE=${DOCKER_COMPOSE:-docker-compose}

echo ""
echo "📋 Escolha o modo de execução:"
echo "1) Produção (build otimizado)"
echo "2) Desenvolvimento"
read -p "Opção (1 ou 2): " mode

case $mode in
    1)
        echo ""
        echo "🚀 Iniciando em modo PRODUÇÃO..."
        $DOCKER_COMPOSE up --build
        ;;
    2)
        echo ""
        echo "🔧 Iniciando em modo DESENVOLVIMENTO..."
        $DOCKER_COMPOSE -f docker-compose.dev.yml up --build
        ;;
    *)
        echo "❌ Opção inválida"
        exit 1
        ;;
esac
