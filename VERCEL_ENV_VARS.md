# 🚀 Variáveis de Ambiente para Vercel

## ✅ Variáveis Necessárias

Adicione estas variáveis na Vercel (Settings > Environment Variables):

### 1. DATABASE_URL (OBRIGATÓRIA)

```
Valor: postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
Ambiente: Production, Preview, Development
```

**Como obter:**

1. Acesse https://neon.tech
2. Crie uma conta grátis
3. Crie um novo projeto (database)
4. Copie a connection string do dashboard

---

### 2. NODE_ENV (RECOMENDADA)

```
Valor: production
Ambiente: Production, Preview
```

---

### 3. NEXT_TELEMETRY_DISABLED (OPCIONAL)

```
Valor: 1
Ambiente: Production, Preview, Development
```

---

## 📋 Configuração Rápida na Vercel

### 1. Importar Projeto

- GitHub > Repositório: `Fioravante1/brain-agriculture`
- Branch: `main`

### 2. Framework Preset

- Next.js (detectado automaticamente)
- Root Directory: `./`

### 3. Build Settings

```bash
Build Command: yarn build
Install Command: yarn install (ou deixe padrão)
```

### 4. Environment Variables

Adicione apenas:

- `DATABASE_URL` = sua connection string do Neon
- `NODE_ENV` = `production`

### 5. Deploy

- Clique em "Deploy"
- Aguarde o build completar

### 6. Popular Banco de Dados (DEPOIS do primeiro deploy)

```bash
# Na Vercel, abra o terminal do deployment ou use localmente:
export DATABASE_URL="sua-connection-string"
yarn prisma db push
yarn prisma db seed
```

---

## 🎯 Resumo das Variáveis

| Variável                  | Valor                     | Obrigatória    | Onde Adicionar                            |
| ------------------------- | ------------------------- | -------------- | ----------------------------------------- |
| `DATABASE_URL`            | Connection string do Neon | ✅ Sim         | Vercel > Settings > Environment Variables |
| `NODE_ENV`                | `production`              | ⚠️ Recomendada | Vercel > Settings > Environment Variables |
| `NEXT_TELEMETRY_DISABLED` | `1`                       | ❌ Opcional    | Vercel > Settings > Environment Variables |

---

## ⚡ Quick Start

1. **Criar banco no Neon:** https://neon.tech
2. **Copiar connection string** do Neon
3. **Conectar repositório** na Vercel
4. **Adicionar variáveis** acima na Vercel
5. **Deploy!**
6. **Popular banco:** `yarn prisma db push && yarn prisma db seed`
