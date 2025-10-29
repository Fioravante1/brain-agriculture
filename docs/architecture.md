# Feature-Sliced Design - Arquitetura do Projeto Brain Agriculture

> **Arquitetura:** Feature-Sliced Design (FSD) **Status:** ✅ Implementado conforme padrões FSD

📊 **[Ver diagramas visuais →](./diagrams.md)** - Fluxos, arquitetura e processos ilustrados

---

## Índice

- [O que é Feature-Sliced Design](#o-que-é-feature-sliced-design)
- [Por que FSD no Brain Agriculture](#por-que-fsd-no-brain-agriculture)
- [Estrutura de Camadas](#estrutura-de-camadas)
- [Hierarquia de Dependências](#hierarquia-de-dependências)
- [Segmentos (Segments)](#segmentos-segments)
- [Public API](#public-api)
- [Guia de Desenvolvimento](#guia-de-desenvolvimento)
- [Integração com Next.js](#integração-com-nextjs)
- [Decisões Técnicas](#decisões-técnicas)
- [Exemplos Práticos](#exemplos-práticos)
- [Recursos](#recursos)

---

## O que é Feature-Sliced Design?

**Feature-Sliced Design (FSD)** é uma metodologia arquitetural para organização de código frontend que visa:

- 📦 **Modularidade**: Código organizado em módulos independentes
- 🔄 **Reutilização**: Componentes e lógica facilmente reutilizáveis
- 📈 **Escalabilidade**: Fácil adicionar novas funcionalidades
- 🧪 **Testabilidade**: Módulos isolados são mais fáceis de testar
- 👥 **Onboarding**: Estrutura clara facilita a entrada de novos devs
- 🎯 **Previsibilidade**: Sempre sabe onde encontrar ou adicionar código

### Princípios Fundamentais

1. **Separação por camadas** (layers) - hierarquia clara de responsabilidades
2. **Dependências unidirecionais** (top-down) - fluxo previsível
3. **Baixo acoplamento** entre módulos - mudanças isoladas
4. **Alta coesão** dentro de módulos - código relacionado junto
5. **Public API explícita** para cada módulo - encapsulamento

---

## Por que FSD no Brain Agriculture?

### Problemas que o FSD Resolve

❌ **Sem FSD (estrutura tradicional):**

```
src/
├── components/
│   ├── Button.tsx
│   ├── ProducerForm.tsx
│   ├── Dashboard.tsx
│   └── ...
├── utils/
│   ├── validators.ts
│   ├── formatters.ts
│   └── ...
├── hooks/
│   ├── useProducers.ts
│   └── ...
└── pages/
    ├── dashboard.tsx
    └── producers.tsx
```

Problemas:

- Difícil encontrar onde está a lógica de produtores
- Componentes genéricos misturados com componentes de negócio
- Utils sem organização clara
- Mudanças em validators.ts podem afetar toda aplicação
- Difícil reutilizar lógica entre features

✅ **Com FSD:**

```
src/
├── entities/
│   └── producer/         # Tudo sobre Producer em um lugar
│       ├── model/
│       ├── api/
│       ├── hooks/
│       └── index.ts
├── features/
│   ├── producers/        # Funcionalidades de produtores
│   │   └── ui/producer-form/
│   └── dashboard/        # Funcionalidades do dashboard
│       └── hooks/
├── widgets/
│   └── dashboard/        # Widgets reutilizáveis
│       ├── stat-card/
│       └── pie-chart-card/
└── shared/
    ├── ui/               # Componentes genéricos
    │   ├── button/
    │   └── input/
    └── lib/utils/        # Utils organizados
        ├── validate-cpf-cnpj/
        ├── format/
        └── masks/
```

Benefícios:

- Fácil encontrar: tudo sobre Producer está em `entities/producer/`
- Componentes organizados por nível de abstração
- Utils organizados por contexto com testes co-localizados
- Mudanças isoladas: mexer em Producer não afeta Farm
- Reutilização natural: Public APIs bem definidas

### Benefícios Específicos no Brain Agriculture

- **Domínios claros**: Producer, Farm, Crop, Harvest são entidades bem definidas
- **Isolamento de features**: Dashboard e Producers são features independentes
- **Reutilização de componentes**: StatCard e PieChartCard usados em múltiplas páginas
- **Validações específicas**: CPF/CNPJ validation isolada e testável
- **Fácil adicionar novos domínios**: Basta seguir o padrão estabelecido

---

## Estrutura de Camadas

O FSD organiza o código em **7 camadas hierárquicas**. No Brain Agriculture, usamos 5 delas:

```
┌─────────────────────────────────────┐
│   app/        (Aplicação)           │  ← Rotas Next.js, providers globais
├─────────────────────────────────────┤
│   pages/      (Páginas)             │  ← Composição de páginas completas
├─────────────────────────────────────┤
│   widgets/    (Widgets)             │  ← Blocos grandes e reutilizáveis
├─────────────────────────────────────┤
│   features/   (Funcionalidades)     │  ← Lógica de negócio e features
├─────────────────────────────────────┤
│   entities/   (Entidades)           │  ← Modelos de domínio (Producer, Farm, etc)
├─────────────────────────────────────┤
│   shared/     (Compartilhado)       │  ← Código genérico reutilizável
└─────────────────────────────────────┘
```

### 1. App (Aplicação)

**Propósito:** Configuração global da aplicação e rotas Next.js.

**Responsabilidades:**

- Configuração de rotas (Next.js App Router)
- Providers globais (React Query, Theme Provider)
- Layout raiz da aplicação
- Styled Components SSR Registry

**Estrutura no Projeto:**

```
app/
├── dashboard/
│   └── page.tsx        # Rota /dashboard
├── producers/
│   └── page.tsx        # Rota /producers
├── layout.tsx          # Layout raiz com providers
└── providers/
    └── styled-components-registry.tsx
```

**Exemplo - Layout raiz:**

```typescript
// app/layout.tsx
import { AppProviders } from '@/shared/lib/providers';
import StyledComponentsRegistry from './providers/styled-components-registry';

export default function RootLayout({ children }) {
  return (
    <html lang='pt-BR'>
      <body>
        <StyledComponentsRegistry>
          <AppProviders>{children}</AppProviders>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
```

**Características:**

- Sem slices (apenas configuração)
- Pode importar de todas as camadas
- Nenhuma camada importa de app
- Rotas são meras re-exportações de pages/

### 2. Pages (Páginas)

**Propósito:** Composição de páginas completas a partir de widgets, features e entities.

**Responsabilidades:**

- Compor a UI da página usando widgets e features
- Lógica específica da página (se não for reutilizada)
- Carregamento de dados da página
- Estados locais da página

**Estrutura no Projeto:**

```
src/page-compositions/
├── dashboard/
│   ├── ui/
│   │   └── dashboard-page.tsx
│   └── index.ts
└── producers/
    ├── ui/
    │   └── producers-list-page.tsx
    └── index.ts
```

**Exemplo - Dashboard Page:**

```typescript
// pages/dashboard/ui/dashboard-page.tsx
'use client';

import { useProducers } from '@/entities/producer';
import { useDashboardStats } from '@/features/dashboard';
import { StatCard, PieChartCard } from '@/widgets/dashboard';

export function DashboardPage() {
  const { data: producers, isLoading } = useProducers();
  const stats = useDashboardStats(producers);

  if (isLoading) return <LoadingContainer>Carregando dados...</LoadingContainer>;

  return (
    <PageContainer>
      <PageHeader>
        <Title>Dashboard</Title>
      </PageHeader>

      <StatsGrid>
        <StatCard title='Total de Fazendas' value={formatNumber(stats.totalFarms)} />
        <StatCard title='Total de Hectares' value={formatHectares(stats.totalHectares)} />
      </StatsGrid>

      <ChartsGrid>
        <PieChartCard title='Fazendas por Estado' data={stats.farmsByState} />
        <PieChartCard title='Culturas Plantadas' data={stats.farmsByCrop} />
        <PieChartCard title='Uso do Solo' data={stats.landUse} />
      </ChartsGrid>
    </PageContainer>
  );
}
```

**Características:**

- Organizada por domínios (slices)
- Compõe widgets, features e entities
- Pode ter lógica específica da página
- "Pages first" - mantenha código aqui se não for reutilizado

**Quando usar:**

- Página completa específica de uma rota
- Lógica que só é usada nesta página
- Composição de múltiplos widgets/features

### 3. Widgets

**Propósito:** Blocos grandes e independentes de UI reutilizáveis em múltiplas páginas.

**Responsabilidades:**

- Componentes complexos reutilizáveis
- UI auto-contida com lógica própria
- Exibição de dados sem regras de negócio

**Estrutura no Projeto:**

```
src/widgets/
└── dashboard/
    ├── stat-card/
    │   ├── stat-card.tsx
    │   └── index.ts
    ├── pie-chart-card/
    │   ├── pie-chart-card.tsx
    │   └── index.ts
    └── index.ts
```

**Exemplo - StatCard Widget:**

```typescript
// widgets/dashboard/stat-card/stat-card.tsx
export interface StatCardProps {
  title: string;
  value: string | number;
}

export function StatCard({ title, value }: StatCardProps) {
  return (
    <CardContainer>
      <Title>{title}</Title>
      <Value>{value}</Value>
    </CardContainer>
  );
}
```

**Exemplo - PieChartCard Widget:**

```typescript
// widgets/dashboard/pie-chart-card/pie-chart-card.tsx
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

export interface PieChartData {
  name: string;
  value: number;
  [key: string]: string | number;  // Index signature para Recharts
}

export function PieChartCard({ title, data }: PieChartCardProps) {
  return (
    <CardContainer>
      <Title>{title}</Title>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" label={...} />
        </PieChart>
      </ResponsiveContainer>
    </CardContainer>
  );
}
```

**Características:**

- Reutilizável em múltiplas páginas
- Auto-contido (não depende de contexto externo)
- Recebe dados via props
- Pode usar features e entities

**Quando usar:**

- Componente grande usado em múltiplas páginas
- Bloco de UI independente e reutilizável
- Visualização de dados complexa

**Quando NÃO usar:**

- Se usado em apenas uma página → use pages
- Se é apenas lógica sem UI → use features
- Se é componente genérico sem contexto → use shared

### 4. Features (Funcionalidades)

**Propósito:** Lógica de negócio e funcionalidades específicas do produto.

**Responsabilidades:**

- Hooks de lógica de negócio
- Formulários com regras de validação
- Transformações de dados específicas
- Componentes com lógica de negócio

**Estrutura no Projeto:**

```
src/features/
├── producers/
│   ├── ui/
│   │   └── producer-form/
│   │       ├── producer-form.tsx
│   │       ├── producer-form.schema.ts
│   │       └── index.ts
│   └── index.ts
└── dashboard/
    ├── hooks/
    │   └── use-dashboard-stats.hook.ts
    └── index.ts
```

**Exemplo - Producer Form Feature:**

```typescript
// features/producers/ui/producer-form/producer-form.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { producerFormSchema } from './producer-form.schema';
import { Input, Button } from '@/shared/ui';
import { maskCPFOrCNPJ } from '@/shared/lib/utils';

export function ProducerForm({ onSubmit, defaultValues }: ProducerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(producerFormSchema),
    defaultValues,
  });

  // Lógica de negócio do formulário
  // Validações específicas
  // Máscaras e formatações

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

**Exemplo - Dashboard Stats Hook:**

```typescript
// features/dashboard/hooks/use-dashboard-stats.hook.ts
import { useMemo } from 'react';
import { Producer } from '@/entities/producer';

export function useDashboardStats(producers: Producer[] = []) {
  return useMemo(() => {
    // Lógica de cálculo de estatísticas
    const totalFarms = producers.reduce((sum, p) => sum + p.farms.length, 0);
    const farmsByState = calculateFarmsByState(producers);
    const farmsByCrop = calculateFarmsByCrop(producers);
    const landUse = calculateLandUse(producers);

    return { totalFarms, farmsByState, farmsByCrop, landUse };
  }, [producers]);
}
```

**Características:**

- Contém lógica de negócio específica
- Pode ter UI (formulários, componentes específicos)
- Usa entities e shared
- Sempre tem Public API

**Quando usar:**

- Formulários com validações de negócio
- Hooks que combinam múltiplas entities
- Transformações de dados específicas do domínio
- Lógica que será reutilizada em múltiplas páginas

### 5. Entities (Entidades)

**Propósito:** Modelos de domínio que representam conceitos do negócio.

**O que são Entities?**

Entities representam os **conceitos centrais do negócio** - Producer, Farm, Crop, Harvest - com os quais o sistema trabalha.

**Responsabilidades:**

- 📦 **Model**: Interfaces e tipos TypeScript
- 🔧 **API**: Funções de requisição (CRUD com localStorage)
- 🎯 **Hooks**: React Query hooks para gerenciamento de estado
- 📊 **Lib**: Mocks, validações, transformações

**Estrutura no Projeto:**

```
src/entities/
├── producer/
│   ├── model/
│   │   └── producer.model.ts
│   ├── api/
│   │   └── producer.api.ts
│   ├── hooks/
│   │   └── use-producer.hook.ts
│   ├── lib/
│   │   └── mocks/
│   │       └── producer.mock.ts
│   └── index.ts
├── farm/
│   ├── model/
│   │   └── farm.model.ts
│   ├── lib/
│   │   └── mocks/
│   │       └── farm.mock.ts
│   └── index.ts
├── crop/
│   ├── model/
│   │   └── crop.model.ts
│   └── lib/
│       └── mocks/
│           └── crop.mock.ts
└── harvest/
    ├── model/
    │   └── harvest.model.ts
    └── lib/
        └── mocks/
            └── harvest.mock.ts
```

**Exemplo - Producer Entity:**

```typescript
// entities/producer/model/producer.model.ts
import { Farm } from '@/entities/farm';

export interface Producer {
  id: string;
  cpfCnpj: string;
  name: string;
  farms: Farm[];
}

export interface ProducerFormData {
  cpfCnpj: string;
  name: string;
  farms: Farm[];
}
```

```typescript
// entities/producer/api/producer.api.ts
import { localStorage } from '@/shared/lib/storage';
import { PRODUCERS_MOCK } from '../lib/mocks';

const STORAGE_KEY = 'producers';

export const producerApi = {
  getAll: async (): Promise<Producer[]> => {
    await delay(500); // Simula rede
    const stored = localStorage.get<Producer[]>(STORAGE_KEY);
    return stored || PRODUCERS_MOCK;
  },

  create: async (data: ProducerFormData): Promise<Producer> => {
    const producers = await producerApi.getAll();
    const newProducer = { id: uuid(), ...data };
    const updated = [...producers, newProducer];
    localStorage.set(STORAGE_KEY, updated);
    return newProducer;
  },

  update: async (id: string, data: ProducerFormData): Promise<Producer> => {
    // Lógica de atualização
  },

  delete: async (id: string): Promise<void> => {
    // Lógica de exclusão
  },
};
```

```typescript
// entities/producer/hooks/use-producer.hook.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { producerApi } from '../api/producer.api';

export const producerKeys = {
  all: ['producers'] as const,
  lists: () => [...producerKeys.all, 'list'] as const,
  details: () => [...producerKeys.all, 'detail'] as const,
  detail: (id: string) => [...producerKeys.details(), id] as const,
};

export function useProducers() {
  return useQuery({
    queryKey: producerKeys.lists(),
    queryFn: () => producerApi.getAll(),
  });
}

export interface UseCreateProducerOptions {
  onSuccess?: (data: Producer) => void;
  onError?: (error: Error) => void;
}

export function useCreateProducer(options?: UseCreateProducerOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProducerFormData) => producerApi.create(data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: producerKeys.lists() });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}
```

**Características:**

- Representa conceitos do mundo real
- Contém apenas CRUD básico
- Hooks React Query para cache e sincronização
- Reutilizável em múltiplas features
- Sempre tem Public API

**Quando usar:**

- ✅ Conceito central do negócio (Producer, Farm, Crop)
- ✅ Modelo de dados compartilhado
- ✅ CRUD básico sem lógica complexa
- ✅ Entidade com identidade própria

**Quando NÃO usar:**

- ❌ Lógica de negócio complexa → use features
- ❌ Componentes genéricos → use shared
- ❌ Fluxos que combinam entidades → use features

### 6. Shared (Compartilhado)

**Propósito:** Código genérico reutilizável, **sem lógica de negócio**.

**Responsabilidades:**

- Componentes de UI genéricos (Button, Input, Card)
- Hooks reutilizáveis (useModal, useDebounce)
- Utilitários puros (formatação, validação)
- Configurações globais (theme, providers)
- Tipos genéricos compartilhados

**Estrutura no Projeto:**

```
src/shared/
├── ui/
│   ├── button/
│   │   ├── button.tsx
│   │   └── index.ts
│   ├── input/
│   │   ├── input.tsx
│   │   └── index.ts
│   ├── card/
│   ├── select/
│   ├── table/
│   └── modal/
├── lib/
│   ├── theme/
│   │   └── theme.ts
│   ├── providers/
│   │   ├── app-providers.tsx
│   │   ├── query-provider.tsx
│   │   └── theme-provider.tsx
│   ├── storage/
│   │   └── local-storage.ts
│   └── utils/
│       ├── validate-cpf-cnpj/
│       │   ├── validate-cpf-cnpj.ts
│       │   ├── validate-cpf-cnpj.test.ts
│       │   └── index.ts
│       ├── format/
│       │   ├── format.ts
│       │   ├── format.test.ts
│       │   └── index.ts
│       └── masks/
│           ├── masks.ts
│           ├── masks.test.ts
│           └── index.ts
└── index.ts
```

**Exemplo - Button Component:**

```typescript
// shared/ui/button/button.tsx
import styled from 'styled-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  // ... outros props
}

// Uso de transient props ($) para evitar warnings do React
export function Button({ variant = 'primary', size = 'md', fullWidth = false, ...props }: ButtonProps) {
  return <StyledButton $variant={variant} $size={size} $fullWidth={fullWidth} {...props} />;
}
```

**Exemplo - CPF/CNPJ Validation:**

```typescript
// shared/lib/utils/validate-cpf-cnpj/validate-cpf-cnpj.ts
export function validateCPF(cpf: string): boolean {
  const cleanCPF = removeNonNumeric(cpf);

  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1+$/.test(cleanCPF)) return false;

  // Algoritmo de validação de CPF
  // ...

  return true;
}

export function validateCNPJ(cnpj: string): boolean {
  // Algoritmo de validação de CNPJ
  // ...
}

export function validateCPFOrCNPJ(value: string): boolean {
  const clean = removeNonNumeric(value);
  return clean.length === 11 ? validateCPF(value) : validateCNPJ(value);
}
```

**Exemplo - Theme Configuration:**

```typescript
// shared/lib/theme/theme.ts
export const theme = {
  colors: {
    primary: '#2E7D32', // Verde agricultura
    secondary: '#4CAF50',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    // ...
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  typography: {
    fontSize: {
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
    },
    // ...
  },
  // ...
};
```

**Características:**

- Sem slices (apenas segments)
- **Sem lógica de negócio**
- Altamente reutilizável
- Não importa de outras camadas
- Cada util tem seus testes co-localizados

**Quando usar:**

- Componentes UI genéricos (Button, Input, Modal)
- Utilitários puros (formatação, validação, máscaras)
- Hooks sem lógica de negócio (useDebounce, useLocalStorage)
- Configurações globais (theme, API clients)

**Quando NÃO usar:**

- ❌ Lógica de negócio → use features ou entities
- ❌ Componentes específicos de domínio → use widgets ou features
- ❌ Hooks que usam entidades → use features ou entities

---

## Hierarquia de Dependências

### Regra de Ouro

> **Uma camada só pode importar de camadas ABAIXO dela**

```
app       → pages, widgets, features, entities, shared
pages     → widgets, features, entities, shared
widgets   → features, entities, shared
features  → entities, shared
entities  → shared
shared    → (nada - camada base)
```

### Fluxo Visual

```
        ┌─────────┐
        │   app   │ ← pode importar de TODAS as camadas
        └────┬────┘
             │
        ┌────▼────┐
        │  pages  │ ← pode importar de widgets, features, entities, shared
        └────┬────┘
             │
        ┌────▼────┐
        │ widgets │ ← pode importar de features, entities, shared
        └────┬────┘
             │
        ┌────▼────┐
        │features │ ← pode importar de entities, shared
        └────┬────┘
             │
        ┌────▼────┐
        │entities │ ← pode importar APENAS de shared
        └────┬────┘
             │
        ┌────▼────┐
        │ shared  │ ← NÃO importa de ninguém (camada base)
        └─────────┘
```

### Imports Permitidos ✅

```typescript
// ✅ Page importando de widgets, features, entities
import { StatCard, PieChartCard } from '@/widgets/dashboard';
import { useDashboardStats } from '@/features/dashboard';
import { useProducers } from '@/entities/producer';

// ✅ Widget importando de features, entities
import { useProducers } from '@/entities/producer';
import { Button } from '@/shared/ui';

// ✅ Feature importando de entities, shared
import { Producer } from '@/entities/producer';
import { validateCPFOrCNPJ } from '@/shared/lib/utils';

// ✅ Entity importando de shared
import { localStorage } from '@/shared/lib/storage';

// ✅ App importando de pages
import { DashboardPage } from '@/page-compositions/dashboard';
```

### Imports Proibidos ❌

```typescript
// ❌ Feature importando de page
import { DashboardPage } from '@/page-compositions/dashboard'; // NUNCA!

// ❌ Feature importando de widget
import { StatCard } from '@/widgets/dashboard'; // NUNCA!

// ❌ Shared importando de entity
import { Producer } from '@/entities/producer'; // NUNCA!

// ❌ Entity importando de feature
import { useDashboardStats } from '@/features/dashboard'; // NUNCA!

// ❌ Widgets importando de pages
import { DashboardPage } from '@/page-compositions/dashboard'; // NUNCA!
```

### Por que essa hierarquia?

1. **Evita dependências circulares**: Fluxo unidirecional impossibilita ciclos
2. **Facilita testes**: Camadas inferiores são independentes, fáceis de testar
3. **Permite reutilização**: Camadas inferiores são mais genéricas
4. **Melhora manutenibilidade**: Mudanças fluem de cima para baixo
5. **Previsibilidade**: Sempre sabe onde buscar dependências

---

## Segmentos (Segments)

Dentro de cada camada, o código é organizado em **segmentos padrão**:

### Segmentos Padrão

| Segmento       | Descrição                      | Obrigatório | Exemplo                |
| -------------- | ------------------------------ | ----------- | ---------------------- |
| **`ui/`**      | Componentes React              | Não         | producer-form.tsx      |
| **`api/`**     | Integrações com backend        | Não         | producer.api.ts        |
| **`model/`**   | Tipos e modelos de dados       | Não         | producer.model.ts      |
| **`hooks/`**   | React hooks                    | Não         | use-producer.hook.ts   |
| **`lib/`**     | Utilitários, mocks, validações | Não         | mocks/producer.mock.ts |
| **`config/`**  | Configurações                  | Não         | query-config.ts        |
| **`index.ts`** | Public API                     | ✅ **SIM**  | Sempre obrigatório     |

### Exemplo Completo - Entity Producer

```
entities/producer/
├── model/
│   └── producer.model.ts           # Interfaces TypeScript
├── api/
│   └── producer.api.ts             # CRUD com localStorage
├── hooks/
│   └── use-producer.hook.ts        # React Query hooks
├── lib/
│   └── mocks/
│       └── producer.mock.ts        # Dados mockados
└── index.ts                        # ✅ Public API (OBRIGATÓRIO)
```

### Exemplo Completo - Feature Producer Form

```
features/producers/
├── ui/
│   └── producer-form/
│       ├── producer-form.tsx       # Componente do formulário
│       ├── producer-form.schema.ts # Schema Zod de validação
│       └── index.ts                # Public API do componente
└── index.ts                        # ✅ Public API da feature
```

### Exemplo Completo - Shared Utils

```
shared/lib/utils/
├── validate-cpf-cnpj/
│   ├── validate-cpf-cnpj.ts        # Funções de validação
│   ├── validate-cpf-cnpj.test.ts   # Testes co-localizados
│   └── index.ts                    # Public API
├── format/
│   ├── format.ts
│   ├── format.test.ts
│   └── index.ts
└── masks/
    ├── masks.ts
    ├── masks.test.ts
    └── index.ts
```

---

## Public API

**Toda feature/widget/entity/shared util DEVE ter uma Public API** (`index.ts`):

### Por que Public API?

1. **Encapsulamento**: Controla o que é exposto para fora do módulo
2. **Refatoração segura**: Pode mudar internals sem quebrar imports externos
3. **Descoberta**: Fácil ver o que a feature oferece
4. **Imports limpos**: Imports curtos e semânticos
5. **Manutenção**: Facilita identificar dependências

### Exemplo - Entity Producer

```typescript
// entities/producer/index.ts
// Public API da entidade Producer

// Models
export * from './model/producer.model';

// API
export * from './api/producer.api';

// Hooks
export * from './hooks/use-producer.hook';

// Mocks (opcional, para testes)
export * from './lib/mocks/producer.mock';
```

### Exemplo - Feature Dashboard

```typescript
// features/dashboard/index.ts
// Public API da feature Dashboard

// Hooks
export * from './hooks/use-dashboard-stats.hook';
```

### Exemplo - Widget StatCard

```typescript
// widgets/dashboard/stat-card/index.ts
// Public API do widget StatCard

export * from './stat-card';
```

### Exemplo - Shared Utils

```typescript
// shared/lib/utils/validate-cpf-cnpj/index.ts
// Public API do módulo de validação

export * from './validate-cpf-cnpj';
```

### Usando Public API

```typescript
// ✅ BOM: Import via Public API
import { useProducers, useCreateProducer, Producer } from '@/entities/producer';
import { useDashboardStats } from '@/features/dashboard';
import { StatCard, PieChartCard } from '@/widgets/dashboard';
import { validateCPFOrCNPJ, formatCPFOrCNPJ, maskCPFOrCNPJ } from '@/shared/lib/utils';

// ❌ EVITAR: Import direto (quebra encapsulamento)
import { useProducers } from '@/entities/producer/hooks/use-producer.hook';
import { validateCPF } from '@/shared/lib/utils/validate-cpf-cnpj/validate-cpf-cnpj';
```

---

## Guia de Desenvolvimento

### Criando uma Nova Entity

#### 1. Crie a Estrutura de Pastas

```bash
mkdir -p src/entities/new-entity/{model,api,hooks,lib/mocks}
```

#### 2. Crie o Model

```typescript
// entities/new-entity/model/new-entity.model.ts
export interface NewEntity {
  id: string;
  name: string;
  // ... outros campos
}

export interface NewEntityFormData {
  name: string;
  // ... campos do formulário
}
```

#### 3. Crie a API

```typescript
// entities/new-entity/api/new-entity.api.ts
import { localStorage } from '@/shared/lib/storage';
import { NewEntity, NewEntityFormData } from '../model/new-entity.model';

const STORAGE_KEY = 'new-entities';

export const newEntityApi = {
  getAll: async (): Promise<NewEntity[]> => {
    await delay(500);
    return localStorage.get<NewEntity[]>(STORAGE_KEY) || [];
  },

  create: async (data: NewEntityFormData): Promise<NewEntity> => {
    const entities = await newEntityApi.getAll();
    const newEntity = { id: uuid(), ...data };
    localStorage.set(STORAGE_KEY, [...entities, newEntity]);
    return newEntity;
  },

  // ... outros métodos CRUD
};
```

#### 4. Crie os Hooks React Query

```typescript
// entities/new-entity/hooks/use-new-entity.hook.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newEntityApi } from '../api/new-entity.api';

export const newEntityKeys = {
  all: ['new-entities'] as const,
  lists: () => [...newEntityKeys.all, 'list'] as const,
  detail: (id: string) => [...newEntityKeys.all, 'detail', id] as const,
};

export function useNewEntities() {
  return useQuery({
    queryKey: newEntityKeys.lists(),
    queryFn: () => newEntityApi.getAll(),
  });
}

export interface UseCreateNewEntityOptions {
  onSuccess?: (data: NewEntity) => void;
  onError?: (error: Error) => void;
}

export function useCreateNewEntity(options?: UseCreateNewEntityOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NewEntityFormData) => newEntityApi.create(data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: newEntityKeys.lists() });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}
```

#### 5. Crie a Public API

```typescript
// entities/new-entity/index.ts
export * from './model/new-entity.model';
export * from './api/new-entity.api';
export * from './hooks/use-new-entity.hook';
```

### Criando uma Nova Feature

#### 1. Identifique se é Feature ou Entity

**Use Entity se:**

- É um conceito central do negócio (Producer, Farm, etc)
- Precisa apenas de CRUD básico
- Será usado em múltiplas features

**Use Feature se:**

- Combina múltiplas entities
- Tem lógica de negócio complexa
- Tem regras de validação específicas
- É um formulário com regras complexas

#### 2. Crie a Estrutura

```bash
mkdir -p src/features/new-feature/{ui,hooks,lib}
```

#### 3. Crie o Hook (se necessário)

```typescript
// features/new-feature/hooks/use-new-feature.hook.ts
import { useMemo } from 'react';
import { useEntity1, useEntity2 } from '@/entities/...';

export function useNewFeature() {
  const { data: entity1 } = useEntity1();
  const { data: entity2 } = useEntity2();

  return useMemo(() => {
    // Lógica que combina múltiplas entities
    // Transformações complexas
    // Cálculos de negócio

    return {
      /* resultado */
    };
  }, [entity1, entity2]);
}
```

#### 4. Crie o Componente UI (se necessário)

```typescript
// features/new-feature/ui/new-feature-form/new-feature-form.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newFeatureSchema } from './new-feature-form.schema';

export function NewFeatureForm({ onSubmit }: NewFeatureFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(newFeatureSchema),
  });

  return <form onSubmit={handleSubmit(onSubmit)}>{/* Formulário com lógica de negócio */}</form>;
}
```

#### 5. Crie a Public API

```typescript
// features/new-feature/index.ts
export * from './hooks/use-new-feature.hook';
export * from './ui/new-feature-form';
```

### Criando um Novo Widget

#### 1. Crie a Estrutura

```bash
mkdir -p src/widgets/new-widget/new-widget-component
```

#### 2. Crie o Componente

```typescript
// widgets/new-widget/new-widget-component/new-widget-component.tsx
export interface NewWidgetProps {
  data: any;
  // ... props necessárias
}

export function NewWidgetComponent({ data }: NewWidgetProps) {
  return <Container>{/* UI do widget */}</Container>;
}
```

#### 3. Crie a Public API

```typescript
// widgets/new-widget/new-widget-component/index.ts
export * from './new-widget-component';

// widgets/new-widget/index.ts
export * from './new-widget-component';
```

### Criando um Novo Shared Util

#### 1. Crie a Estrutura

```bash
mkdir -p src/shared/lib/utils/new-util
```

#### 2. Crie a Implementação

```typescript
// shared/lib/utils/new-util/new-util.ts
export function newUtilFunction(value: string): string {
  // Implementação pura, sem lógica de negócio
  return value.trim();
}
```

#### 3. Crie os Testes Co-localizados

```typescript
// shared/lib/utils/new-util/new-util.test.ts
import { newUtilFunction } from './new-util';

describe('newUtilFunction', () => {
  it('should trim whitespace', () => {
    expect(newUtilFunction('  hello  ')).toBe('hello');
  });
});
```

#### 4. Crie a Public API

```typescript
// shared/lib/utils/new-util/index.ts
export * from './new-util';
```

### Boas Práticas

#### ✅ Sim

- **Use TypeScript**: Evite `any`, use tipos estritos
- **Crie Public APIs**: Sempre tenha `index.ts` exportando
- **Use callbacks em mutations**: Para separar lógica de dados e UI
- **Co-localize testes**: Teste ao lado do código
- **Siga a hierarquia**: Respeite as dependências entre camadas
- **Organize por contexto**: Agrupe código relacionado
- **Use transient props**: Prefixe props styled-components com `$`
- **Documente decisões**: Comente código complexo

#### ❌ Não

- **Não use `any`**: Sempre tipar adequadamente
- **Não importe de camadas superiores**: Respeite a hierarquia
- **Não coloque lógica de negócio em shared**: Shared é genérico
- **Não pule Public API**: Sempre exporte via `index.ts`
- **Não crie dependências circulares**: Siga o fluxo unidirecional
- **Não misture responsabilidades**: Cada camada tem seu papel
- **Não ignore testes**: Teste código crítico

---

## Integração com Next.js

### Next.js App Router e FSD

O Next.js tem sua própria estrutura de rotas (`app/`), que **convive harmoniosamente** com FSD:

```
projeto/
├── app/                  # Next.js App Router (ROTAS)
│   ├── dashboard/
│   │   └── page.tsx      → re-exporta de src/page-compositions/
│   ├── producers/
│   │   └── page.tsx      → re-exporta de src/page-compositions/
│   └── layout.tsx        # Providers globais
│
├── src/
│   ├── pages/            # FSD Pages (COMPOSIÇÃO)
│   │   ├── dashboard/
│   │   │   └── ui/dashboard-page.tsx
│   │   └── producers/
│   │       └── ui/producers-list-page.tsx
│   │
│   ├── widgets/          # FSD Widgets (BLOCOS REUTILIZÁVEIS)
│   ├── features/         # FSD Features (LÓGICA)
│   ├── entities/         # FSD Entities (DOMÍNIO)
│   └── shared/           # FSD Shared (GENÉRICO)
│
└── pages/                # Pasta vazia (previne conflito)
    └── README.md
```

### Separação de Responsabilidades

| Camada                   | Responsabilidade        | Exemplo                     |
| ------------------------ | ----------------------- | --------------------------- |
| `app/`                   | Define rotas do Next.js | `/dashboard`, `/producers`  |
| `src/page-compositions/` | Compõe páginas (FSD)    | Monta dashboard com widgets |
| `src/widgets/`           | Blocos reutilizáveis    | StatCard, PieChartCard      |
| `src/features/`          | Lógica de negócio       | useDashboardStats           |
| `src/entities/`          | Modelos de domínio      | Producer, Farm              |
| `src/shared/`            | Código genérico         | Button, validateCPF         |

### Exemplo - Rota Dashboard

**1. Rota Next.js** (apenas re-exporta):

```typescript
// app/dashboard/page.tsx
export { DashboardPage as default } from '@/page-compositions/dashboard';
```

**2. Page FSD** (composição e lógica):

```typescript
// src/page-compositions/dashboard/ui/dashboard-page.tsx
'use client';

import { useProducers } from '@/entities/producer';
import { useDashboardStats } from '@/features/dashboard';
import { StatCard, PieChartCard } from '@/widgets/dashboard';

export function DashboardPage() {
  const { data: producers, isLoading } = useProducers();
  const stats = useDashboardStats(producers);

  return (
    <PageContainer>
      <StatsGrid>
        <StatCard title='Total de Fazendas' value={stats.totalFarms} />
        <StatCard title='Total de Hectares' value={stats.totalHectares} />
      </StatsGrid>

      <ChartsGrid>
        <PieChartCard title='Fazendas por Estado' data={stats.farmsByState} />
        <PieChartCard title='Culturas Plantadas' data={stats.farmsByCrop} />
        <PieChartCard title='Uso do Solo' data={stats.landUse} />
      </ChartsGrid>
    </PageContainer>
  );
}
```

**3. Public API** (FSD):

```typescript
// src/page-compositions/dashboard/index.ts
export * from './ui';
```

### Prevenir Conflitos com Pages Router

O Next.js pode confundir `src/page-compositions/` com o antigo Pages Router. Solução:

**Criar pasta vazia `/pages` na raiz:**

```
pages/
└── README.md   # "Esta pasta previne conflito entre Next.js Pages Router e FSD pages/"
```

Isso força o Next.js a usar apenas `/app` para rotas.

### Layout Raiz com Providers

```typescript
// app/layout.tsx
import type { Metadata } from 'next';
import { AppProviders } from '@/shared/lib/providers';
import StyledComponentsRegistry from './providers/styled-components-registry';

export const metadata: Metadata = {
  title: 'Brain Agriculture',
  description: 'Sistema de Gestão de Produtores Rurais',
};

export default function RootLayout({ children }: { children: React.Node }) {
  return (
    <html lang='pt-BR'>
      <body>
        <StyledComponentsRegistry>
          <AppProviders>{children}</AppProviders>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
```

### Providers Globais (Shared)

```typescript
// src/shared/lib/providers/app-providers.tsx
'use client';

import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';

export function AppProviders({ children }) {
  return (
    <QueryProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryProvider>
  );
}
```

---

## Decisões Técnicas

### 1. React Query em vez de Redux

**Por quê:**

- ✅ Melhor isolamento de features (cada entity tem seus hooks)
- ✅ Cache automático e sincronização
- ✅ Menos boilerplate
- ✅ DevTools poderosas
- ✅ Callbacks para separar dados de UI
- ✅ Invalidação de queries simplificada

**Exemplo:**

```typescript
// Sem callbacks (ruim - hook conhece useRouter)
export function useCreateProducer() {
  const router = useRouter();
  return useMutation({
    mutationFn: producerApi.create,
    onSuccess: () => router.push('/producers'), // Hook acoplado à navegação
  });
}

// Com callbacks (bom - hook reutilizável)
export function useCreateProducer(options?: UseCreateProducerOptions) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: producerApi.create,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: producerKeys.lists() });
      options?.onSuccess?.(data); // Componente decide o que fazer
    },
  });
}

// Uso no componente
const createProducer = useCreateProducer({
  onSuccess: () => {
    router.push('/producers');
    showNotification('Produtor criado!', 'success');
  },
});
```

### 2. Hooks em Entities vs Features

**Decisão**: Hooks React Query ficam em **entities**

**Por quê:**

- ✅ Máxima reutilização (qualquer feature pode usar)
- ✅ Evita duplicação de código
- ✅ Centraliza lógica de cache
- ✅ Queries keys consistentes

**Alternativa FSD oficial**: Hooks em features

**No Brain Agriculture**: Hooks em entities é mais simples e eficiente para CRUD básico

### 3. Styled Components com Transient Props

**Problema**: React não reconhece props customizadas

```typescript
// ❌ Ruim - Warning no console
<StyledButton variant='primary' fullWidth>
  Click
</StyledButton>
```

**Solução**: Transient props com prefixo `$`

```typescript
// ✅ Bom - Sem warnings
interface StyledButtonProps {
  $variant: 'primary' | 'secondary';
  $fullWidth: boolean;
}

export function Button({ variant, fullWidth, ...props }) {
  return <StyledButton $variant={variant} $fullWidth={fullWidth} {...props} />;
}
```

### 4. Co-localização de Testes

**Decisão**: Testes ao lado do código

```
validate-cpf-cnpj/
├── validate-cpf-cnpj.ts
├── validate-cpf-cnpj.test.ts  ← Ao lado
└── index.ts
```

**Por quê:**

- ✅ Fácil encontrar testes
- ✅ Testes são parte do módulo
- ✅ Exclusão de testes no tsconfig

### 5. TypeScript Strict Mode

**Decisão**: TypeScript estrito, sem `any`

**Por quê:**

- ✅ Detecta erros em tempo de desenvolvimento
- ✅ Melhor autocomplete e IntelliSense
- ✅ Documentação via tipos
- ✅ Refatoração segura

### 6. Zod para Validação de Formulários

**Decisão**: Zod + React Hook Form

**Por quê:**

- ✅ TypeScript-first (types inferidos)
- ✅ Validação client-side robusta
- ✅ Integração perfeita com React Hook Form
- ✅ Mensagens de erro customizáveis

```typescript
// Schema Zod
export const producerFormSchema = z.object({
  cpfCnpj: z.string().min(1, 'CPF/CNPJ é obrigatório').refine(validateCPFOrCNPJ, 'CPF/CNPJ inválido'),
  name: z.string().min(1, 'Nome é obrigatório'),
});

// Uso no formulário
const { register, handleSubmit } = useForm({
  resolver: zodResolver(producerFormSchema),
});
```

---

## Exemplos Práticos

### Exemplo 1: Listagem de Produtores (CRUD Completo)

**Arquitetura:**

```
Entity (Producer) → Feature (ProducerForm) → Page (ProducersListPage) → App Route
```

**1. Entity - Model:**

```typescript
// entities/producer/model/producer.model.ts
export interface Producer {
  id: string;
  cpfCnpj: string;
  name: string;
  farms: Farm[];
}
```

**2. Entity - API:**

```typescript
// entities/producer/api/producer.api.ts
export const producerApi = {
  getAll: async () => localStorage.get<Producer[]>('producers') || [],
  create: async data => {
    /* ... */
  },
  update: async (id, data) => {
    /* ... */
  },
  delete: async id => {
    /* ... */
  },
};
```

**3. Entity - Hooks:**

```typescript
// entities/producer/hooks/use-producer.hook.ts
export function useProducers() {
  return useQuery({
    queryKey: producerKeys.lists(),
    queryFn: () => producerApi.getAll(),
  });
}

export function useDeleteProducer(options) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => producerApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: producerKeys.lists() });
      options?.onSuccess?.();
    },
  });
}
```

**4. Feature - Form:**

```typescript
// features/producers/ui/producer-form/producer-form.tsx
export function ProducerForm({ onSubmit, defaultValues }: ProducerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(producerFormSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label='CPF/CNPJ'
        {...register('cpfCnpj')}
        error={errors.cpfCnpj?.message}
        onChange={e => setValue('cpfCnpj', maskCPFOrCNPJ(e.target.value))}
      />
      <Input label='Nome' {...register('name')} error={errors.name?.message} />
      <Button type='submit'>Salvar</Button>
    </form>
  );
}
```

**5. Page - Lista:**

```typescript
// pages/producers/ui/producers-list-page.tsx
export function ProducersListPage() {
  const { data: producers, isLoading } = useProducers();
  const deleteProducer = useDeleteProducer({
    onSuccess: () => showNotification('Produtor excluído!'),
  });

  return (
    <Container>
      <Button onClick={() => setModalOpen(true)}>Novo Produtor</Button>
      <Table data={producers} onDelete={id => deleteProducer.mutate(id)} />
      <Modal isOpen={modalOpen}>
        <ProducerForm onSubmit={handleSubmit} />
      </Modal>
    </Container>
  );
}
```

**6. App Route:**

```typescript
// app/producers/page.tsx
export { ProducersListPage as default } from '@/page-compositions/producers';
```

### Exemplo 2: Dashboard com Estatísticas

**Arquitetura:**

```
Entity (Producer) → Feature (useDashboardStats) → Widgets (StatCard, PieChartCard) → Page (DashboardPage)
```

**1. Entity - Hook:**

```typescript
// entities/producer/hooks/use-producer.hook.ts
export function useProducers() {
  return useQuery({
    queryKey: producerKeys.lists(),
    queryFn: () => producerApi.getAll(),
  });
}
```

**2. Feature - Stats Hook:**

```typescript
// features/dashboard/hooks/use-dashboard-stats.hook.ts
export function useDashboardStats(producers: Producer[] = []) {
  return useMemo(() => {
    const totalFarms = producers.reduce((sum, p) => sum + p.farms.length, 0);

    const farmsByState = Array.from(
      producers
        .flatMap(p => p.farms)
        .reduce((map, farm) => {
          map.set(farm.state, (map.get(farm.state) || 0) + 1);
          return map;
        }, new Map<string, number>()),
    ).map(([name, value]) => ({ name, value }));

    return { totalFarms, totalHectares, farmsByState, farmsByCrop, landUse };
  }, [producers]);
}
```

**3. Widget - StatCard:**

```typescript
// widgets/dashboard/stat-card/stat-card.tsx
export function StatCard({ title, value }: StatCardProps) {
  return (
    <Card>
      <Title>{title}</Title>
      <Value>{value}</Value>
    </Card>
  );
}
```

**4. Widget - PieChartCard:**

```typescript
// widgets/dashboard/pie-chart-card/pie-chart-card.tsx
export function PieChartCard({ title, data }: PieChartCardProps) {
  return (
    <Card>
      <Title>{title}</Title>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" label={...} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
```

**5. Page - Dashboard:**

```typescript
// pages/dashboard/ui/dashboard-page.tsx
export function DashboardPage() {
  const { data: producers } = useProducers();
  const stats = useDashboardStats(producers);

  return (
    <Container>
      <StatsGrid>
        <StatCard title='Total de Fazendas' value={stats.totalFarms} />
        <StatCard title='Total de Hectares' value={stats.totalHectares} />
      </StatsGrid>
      <ChartsGrid>
        <PieChartCard title='Fazendas por Estado' data={stats.farmsByState} />
        <PieChartCard title='Culturas Plantadas' data={stats.farmsByCrop} />
      </ChartsGrid>
    </Container>
  );
}
```

### Exemplo 3: Validação de CPF/CNPJ (Shared Util)

**Arquitetura:**

```
Shared Util → Entity (Producer) → Feature (ProducerForm)
```

**1. Shared - Validação:**

```typescript
// shared/lib/utils/validate-cpf-cnpj/validate-cpf-cnpj.ts
export function validateCPF(cpf: string): boolean {
  const cleanCPF = removeNonNumeric(cpf);
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1+$/.test(cleanCPF)) return false;

  // Algoritmo de validação
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== parseInt(cleanCPF.charAt(9))) return false;

  // Segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  return digit === parseInt(cleanCPF.charAt(10));
}

export function validateCPFOrCNPJ(value: string): boolean {
  const clean = removeNonNumeric(value);
  return clean.length === 11 ? validateCPF(value) : validateCNPJ(value);
}
```

**2. Shared - Testes:**

```typescript
// shared/lib/utils/validate-cpf-cnpj/validate-cpf-cnpj.test.ts
describe('validateCPF', () => {
  it('should validate correct CPF', () => {
    expect(validateCPF('123.456.789-09')).toBe(true);
  });

  it('should invalidate incorrect CPF', () => {
    expect(validateCPF('123.456.789-00')).toBe(false);
  });
});
```

**3. Feature - Uso no Schema:**

```typescript
// features/producers/ui/producer-form/producer-form.schema.ts
import { validateCPFOrCNPJ } from '@/shared/lib/utils';

export const producerFormSchema = z.object({
  cpfCnpj: z.string().min(1, 'CPF/CNPJ é obrigatório').refine(validateCPFOrCNPJ, 'CPF/CNPJ inválido'),
});
```

---

## Recursos

### Documentação Oficial FSD

- [Feature-Sliced Design](https://feature-sliced.design/) - Site oficial
- [FSD Layers](https://feature-sliced.design/docs/reference/layers) - Referência de camadas
- [FSD with Next.js](https://feature-sliced.design/docs/guides/tech/with-nextjs) - Integração Next.js
- [Public API](https://feature-sliced.design/docs/reference/public-api) - Conceito de Public API

### Tecnologias Utilizadas

- [Next.js 16](https://nextjs.org/) - Framework React
- [React 19](https://react.dev/) - Biblioteca UI
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática
- [React Query](https://tanstack.com/query/latest) - Gerenciamento de estado assíncrono
- [Styled Components](https://styled-components.com/) - CSS-in-JS
- [React Hook Form](https://react-hook-form.com/) - Gerenciamento de formulários
- [Zod](https://zod.dev/) - Validação de schemas
- [Recharts](https://recharts.org/) - Gráficos
- [Jest](https://jestjs.io/) - Testes unitários

### Estrutura do Projeto

```
brain-agriculture/
├── app/                      # Next.js App Router
│   ├── dashboard/
│   ├── producers/
│   └── layout.tsx
│
├── src/
│   ├── entities/             # Entidades de domínio
│   │   ├── producer/
│   │   ├── farm/
│   │   ├── crop/
│   │   └── harvest/
│   │
│   ├── features/             # Funcionalidades de negócio
│   │   ├── producers/
│   │   └── dashboard/
│   │
│   ├── widgets/              # Blocos reutilizáveis
│   │   └── dashboard/
│   │
│   ├── pages/                # Páginas FSD
│   │   ├── dashboard/
│   │   └── producers/
│   │
│   └── shared/               # Código compartilhado
│       ├── ui/
│       └── lib/
│
├── docs/                     # Documentação
│   ├── FSD_ARQUITETURA.md   # Este arquivo
│   └── TESTE_TECNICO.md     # Requisitos
│
└── tests/                    # Testes (configuração)
```

### Cobertura de Testes

```bash
# Executar todos os testes
yarn test

# Executar em modo watch
yarn test:watch

# Gerar relatório de cobertura
yarn test:coverage
```
