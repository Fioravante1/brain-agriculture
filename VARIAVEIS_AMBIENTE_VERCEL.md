# 📋 Variáveis de Ambiente para Deploy na Vercel

## ✅ Variáveis Obrigatórias

### 1. **DATABASE_URL** (Obrigatória)

```
postgresql://user:password@host:port/database?sslmode=require
```

**Descrição:** String de conexão com o banco de dados PostgreSQL

**Para produção na Vercel, você tem duas opções:**

#### Opção A: Neon Database (Recomendado)

1. Acesse: https://neon.tech
2. Crie uma conta grátis
3. Crie um novo projeto (database)
4. Copie a connection string que será algo como:
   ```
   postgresql://user:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

#### Opção B: Vercel Postgres

1. No dashboard da Vercel, vá em "Storage" > "Create Database"
2. Selecione "Postgres"
3. A Vercel criará automaticamente a variável `POSTGRES_PRISMA_URL`
4. Você precisará ajustar para usar `DATABASE_URL` ou criar um alias

---

### 2. **NODE_ENV** (Opcional, mas recomendado)

```
production
```

**Descrição:** Define o ambiente como produção

---

### 3. **NEXT_TELEMETRY_DISABLED** (Opcional)

```
1
```

**Descrição:** Desabilita a telemetria do Next.js (recomendado)

---

## 🚀 Passo a Passo para Configurar na Vercel

### 1️⃣ Conectar o Repositório

- Na interface da Vercel, escolha "Import Git Repository"
- Selecione `brain-agriculture` do GitHub
- Clique em "Import"

### 2️⃣ Configurar Framework Preset

- **Framework Preset:** Next.js (já será detectado automaticamente)
- **Root Directory:** `./` (deixe como padrão)
- **Build Command:** Deixe o padrão (`next build`)
- **Output Directory:** Deixe o padrão (`.next`)

### 3️⃣ Configurar Variáveis de Ambiente

Na seção "Environment Variables", adicione:

| Key                       | Value                                      | Environment                      |
| ------------------------- | ------------------------------------------ | -------------------------------- |
| `DATABASE_URL`            | `postgresql://...` (sua connection string) | Production, Preview, Development |
| `NODE_ENV`                | `production`                               | Production, Preview              |
| `NEXT_TELEMETRY_DISABLED` | `1`                                        | Production, Preview, Development |

### 4️⃣ Configurar Build Settings

Após a primeira configuração, vá em "Settings" > "Build & Development Settings":

**Build Command:** (deixe padrão ou configure)

```bash
yarn build
```

**Install Command:** (deixe padrão)

```bash
yarn install
```

### 5️⃣ Push para o Banco de Dados

Após o primeiro deploy, você precisará rodar as migrations:

**Opção A: Via Vercel Dashboard (Recomendado)**

1. Vá em "Deployments" > clique no deployment mais recente
2. Abra o terminal no deployment
3. Execute:

```bash
yarn prisma db push
yarn prisma db seed
```

**Opção B: Via Local**

1. Configure sua `.env.local` com a DATABASE_URL de produção
2. Execute:

```bash
export DATABASE_URL="sua-string-de-conexao"
yarn prisma db push
yarn prisma db seed
```

---

## 🗄️ Configuração do Banco de Dados

### Para usar Neon (Gratuito e Recomendado):

1. **Criar conta no Neon:**

   - Acesse: https://neon.tech
   - Faça login com GitHub
   - Clique em "Create Project"

2. **Obter connection string:**

   - Após criar o projeto, vá em "Connection Details"
   - Copie a connection string completa
   - Exemplo: `postgresql://user:pass@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require`

3. **Aplicar migrations:**
   ```bash
   # Via linha de comando local
   export DATABASE_URL="sua-connection-string-do-neon"
   yarn prisma db push
   yarn prisma db seed
   ```

---

## 📝 Checklist de Deploy

- [ ] Repositório conectado à Vercel
- [ ] DATABASE_URL configurada (Neon ou Vercel Postgres)
- [ ] NODE_ENV = production configurado
- [ ] NEXT_TELEMETRY_DISABLED = 1 configurado
- [ ] Build Command configurado (`yarn build`)
- [ ] Install Command configurado (`yarn install`)
- [ ] Deploy inicial executado com sucesso
- [ ] Banco de dados populado (migrations e seed)
- [ ] Testes passando (GitHub Actions deve estar verde)

---

## 🔍 Verificação Pós-Deploy

Após o deploy, verifique:

1. **Build log na Vercel:**

   - Deve aparecer "Build Completed"
   - Sem erros de conexão com banco

2. **Aplicação funcionando:**

   - Acesse a URL fornecida pela Vercel
   - Teste as rotas principais:
     - `/dashboard`
     - `/producers`
     - `/farms`
     - `/crops`
     - `/harvests`
     - `/farm-crops`

3. **Logs de erro:**
   - Vercel Dashboard > Deployments > Seu deployment > "Function Logs"
   - Verifique se há erros relacionados ao banco

---

## ⚠️ Importante

1. **Nunca commite a `.env.local`** - Ela está no `.gitignore`
2. **Use sempre HTTPS** nas connection strings de produção
3. **Teste localmente primeiro** antes de fazer deploy
4. **Mantenha backups** do banco de dados
5. **Use variáveis de ambiente diferentes** para Preview e Production se necessário

---

## 🔗 Links Úteis

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Neon Database](https://neon.tech)
- [Prisma Deploy Guide](https://www.prisma.io/docs/guides/deployment)
