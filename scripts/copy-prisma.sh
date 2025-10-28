#!/bin/bash

# Script para copiar os binaries do Prisma para o build standalone

echo "📦 Copiando binários do Prisma..."

# Encontrar o binary target correto
BINARY_PATH=$(find node_modules/.prisma/client -name "libquery_engine-rhel-openssl-3.0.x.so.node" 2>/dev/null)

if [ -z "$BINARY_PATH" ]; then
  echo "⚠️  Binary não encontrado, pulando..."
  exit 0
fi

# Copiar para o local correto no build
mkdir -p .next/standalone/node_modules/.prisma/client
cp "$BINARY_PATH" .next/standalone/node_modules/.prisma/client/

echo "✅ Binary copiado para .next/standalone/node_modules/.prisma/client/"

