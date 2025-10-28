# 🎯 ONDE EXECUTAR OS COMANDOS PARA POPULAR O BANCO

## ⚠️ IMPORTANTE: Você vai usar o SEU TERMINAL LOCAL!

A Vercel **NÃO tem terminal SSH**. Você executa os comandos no seu computador.

---

## 📍 Onde Você Está Agora

Olhe para o **seu terminal** (onde você está rodando este projeto):

```bash
# Este é o diretório atual:
/home/fioravante-chiozzi/projetos-pessoais/brain-agriculture
```

**É AQUI que você vai executar os comandos!** ✅

---

## 🚀 Passo a Passo (SUPER SIMPLES)

### 1️⃣ Obter a DATABASE_URL da Vercel

1. Acesse: https://vercel.com/dashboard
2. Clique no projeto: **brain-agriculture**
3. Vá em: **Settings** (no menu lateral)
4. Clique em: **Environment Variables**
5. Copie o valor de `DATABASE_URL`

### 2️⃣ Voltar para o Terminal LOCAL

Agora volte para o seu terminal (aquele que você usa para desenvolver). Você deve estar em:

```bash
/home/fioravante-chiozzi/projetos-pessoais/brain-agriculture
```

### 3️⃣ Executar o Script

Execute este comando (substitua pela DATABASE_URL copiada):

```bash
./popular-banco-producao.sh "postgresql://user:pass@host:port/db?sslmode=require"
```

**OU** execute os comandos manualmente:

```bash
# 1. Configure a conexão
export DATABASE_URL="postgresql://user:pass@host:port/db?sslmode=require"

# 2. Aplique o schema
yarn prisma db push

# 3. Popule o banco
yarn db:seed

# 4. (Opcional) Veja os dados
yarn prisma studio
```

---

## 🎨 Exemplo Visual

```
┌─────────────────────────────────────────┐
│  VERCEL DASHBOARD                       │
│  ┌───────────────────────────────────┐  │
│  │ Settings > Environment Variables  │  │
│  │                                   │  │
│  │ DATABASE_URL                      │  │
│  │ postgresql://user:pass@...        │  │
│  │ 👆 COPIE ESTE VALOR!              │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
           ⬇️
┌─────────────────────────────────────────┐
│  SEU TERMINAL LOCAL (Seu Computador)    │
│  ┌───────────────────────────────────┐  │
│  │ $ ./popular-banco-producao.sh \   │  │
│  │   "postgresql://user:pass@..."   │  │
│  │                                   │  │
│  │ ✅ BANCO POPULADO!                │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## ❓ FAQ

### "Não consigo encontrar o terminal na Vercel"
✅ **Correto!** A Vercel não tem terminal SSH. Use o seu terminal local.

### "Onde fica meu terminal local?"
✅ **Este aqui mesmo!** O mesmo terminal que você usa para:
- `yarn dev`
- `yarn test`
- `git commit`

### "Preciso instalar algo?"
❌ **Não!** Você já tem tudo instalado. Só precisa da DATABASE_URL da Vercel.

### "Posso testar antes de popular em produção?"
✅ **Sim!** Popule o banco local primeiro:
```bash
yarn db:reset:local
```

---

## 🎯 Resumo Ultra-Rápido

1. **Vercel Dashboard** → Settings → Environment Variables → Copie DATABASE_URL
2. **Seu Terminal Local** → Execute:
   ```bash
   export DATABASE_URL="cole-aqui"
   yarn prisma db push
   yarn db:seed
   ```
3. **Pronto!** ✅

---

## 💡 Dica

Se você quer usar o script que criei, execute:

```bash
./popular-banco-producao.sh "sua-database-url"
```

Ele faz tudo automaticamente! 🚀

