#!/bin/bash

# Script para copiar os binaries do Prisma para o build standalone

echo "📦 Copiando binários do Prisma..."

# Criar diretório de destino
mkdir -p .next/standalone/node_modules/.prisma/client
mkdir -p .next/standalone/node_modules/@prisma/client

# Copiar arquivos do .prisma/client
if [ -d "node_modules/.prisma/client" ]; then
  echo "📋 Copiando .prisma/client..."
  cp -r node_modules/.prisma/client/* .next/standalone/node_modules/.prisma/client/ 2>/dev/null || true
fi

# Copiar arquivos do @prisma/client
if [ -d "node_modules/@prisma/client" ]; then
  echo "📋 Copiando @prisma/client..."
  cp -r node_modules/@prisma/client/* .next/standalone/node_modules/@prisma/client/ 2>/dev/null || true
fi

# Encontrar e copiar o binary específico
BINARY_PATH=$(find node_modules/.prisma/client -name "libquery_engine-rhel-openssl-3.0.x.so.node" 2>/dev/null)
if [ -n "$BINARY_PATH" ]; then
  echo "📦 Copiando query engine..."
  cp "$BINARY_PATH" .next/standalone/node_modules/.prisma/client/
fi

echo "✅ Binários do Prisma copiados com sucesso!"

