# 🖥️ Como Usar o Terminal da Vercel

## 📍 Onde Encontrar o Terminal

### Opção 1: Via Dashboard da Vercel (Mais Fácil)

1. **Acesse o Dashboard:**

   - Vá em: https://vercel.com/dashboard
   - Selecione seu projeto `brain-agriculture`

2. **Abra as Logs:**
   - No deployment atual, clique em **"Logs"** (ao lado de "Deployment", "Resources", "Source")
   - Isso abrirá os logs em tempo real, mas NÃO é um terminal interativo

### Opção 2: Terminal Local + Connection String (RECOMENDADO)

Use seu terminal local (onde você está desenvolvendo):

```bash
# 1. Configure a variável de ambiente com a DATABASE_URL de produção
export DATABASE_URL="postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"

# 2. Execute os comandos do Prisma
yarn prisma db push
yarn prisma db seed

# 3. Verifique se funcionou
yarn prisma studio
```

### Opção 3: Terminal via SSH (Avançado)

A Vercel NÃO oferece terminal SSH padrão. Para tarefas administrativas, use o terminal local.

---

## 🎯 Passo a Passo: Popular Banco de Dados (DEPOIS do Deploy)

### ✅ Melhor Método: Via Terminal Local

```bash
# 1. Pegue a DATABASE_URL da Vercel
# Vercel Dashboard > Settings > Environment Variables
# Copie o valor de DATABASE_URL

# 2. No seu terminal local, configure:
export DATABASE_URL="postgresql://user:pass@host:port/db?sslmode=require"

# 3. Execute o push do schema
yarn prisma db push

# 4. Popule o banco com dados de exemplo
yarn prisma db seed

# 5. (Opcional) Abra o Prisma Studio para verificar
yarn prisma studio
```

### 🔄 Alternativa: Via GitHub Actions (Automático)

Se você quiser automatizar isso no CI/CD, você pode adicionar um workflow:

```yaml
# .github/workflows/deploy-vercel.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      - run: yarn install
      - run: yarn prisma generate
      - run: yarn prisma db push
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

---

## 📝 Comandos Essenciais

### Ver o status do banco:

```bash
yarn prisma db status
```

### Resetar o banco (CUIDADO - apaga tudo):

```bash
yarn db:reset:local
```

### Gerar o cliente Prisma:

```bash
yarn prisma generate
```

### Ver dados no banco:

```bash
yarn prisma studio
```

---

## ⚠️ Importante

1. **Você NÃO precisa de terminal SSH na Vercel**
2. **Use seu terminal local** para tarefas administrativas
3. **A Vercel apenas executa o build** - não é um servidor full
4. **Para popular banco**, use terminal local + DATABASE_URL de produção

---

## 🚀 Quick Commands

```bash
# Configurar conexão
export DATABASE_URL="sua-connection-string"

# Aplicar schema
yarn prisma db push

# Popular dados
yarn db:seed

# Abrir interface visual
yarn db:studio
```
