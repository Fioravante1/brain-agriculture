# 📊 Diagramas - Brain Agriculture

Visualizações da arquitetura e processos do projeto usando **Mermaid**.

## 👀 Como Visualizar os Diagramas

Os diagramas deste documento são escritos em **Mermaid**, uma linguagem de diagramas baseada em texto.

### Opção 1: GitHub (Recomendado)

O GitHub renderiza diagramas Mermaid automaticamente. Basta visualizar este arquivo no GitHub.

### Opção 2: VS Code

Instale a extensão **Markdown Preview Mermaid Support**:

1. Abra o VS Code
2. Vá em Extensions (Ctrl+Shift+X)
3. Busque por "Markdown Preview Mermaid Support"
4. Instale e recarregue
5. Abra este arquivo e use Preview (Ctrl+Shift+V)

### Opção 3: Online

Copie o código Mermaid e cole em:

- https://mermaid.live/ (Editor oficial)
- https://mermaid.ink/ (Gerador de imagens)

### Opção 4: Outras IDEs

- **IntelliJ/WebStorm**: Plugin "Mermaid"
- **Obsidian**: Suporte nativo
- **Notion**: Suporte nativo

---

## 🏗️ Arquitetura FSD

### Camadas e Fluxo de Dependências

```mermaid
graph TB
    subgraph "App Layer"
        APP[App Router<br/>pages & routes]
    end

    subgraph "Page Compositions"
        PAGES[Páginas Compostas<br/>CropsListPage, DashboardPage]
    end

    subgraph "Features"
        FEATURES[Funcionalidades de Negócio<br/>Forms, Hooks de Página]
    end

    subgraph "Widgets"
        WIDGETS[Componentes Complexos<br/>StatCard, PieChartCard]
    end

    subgraph "Entities"
        ENTITIES[Lógica de Domínio<br/>Producer, Farm, Crop, Harvest]
    end

    subgraph "Shared"
        SHARED[UI Base & Utils<br/>Button, Input, Toast, Theme]
    end

    APP --> PAGES
    PAGES --> FEATURES
    PAGES --> WIDGETS
    FEATURES --> ENTITIES
    FEATURES --> SHARED
    WIDGETS --> ENTITIES
    WIDGETS --> SHARED
    ENTITIES --> SHARED

    style APP fill:#e1f5ff
    style PAGES fill:#fff4e6
    style FEATURES fill:#e8f5e9
    style WIDGETS fill:#f3e5f5
    style ENTITIES fill:#fce4ec
    style SHARED fill:#f5f5f5
```

**Regra principal:** Camadas superiores podem importar das inferiores, mas **nunca o contrário**.

---

## 🗄️ Diagrama de Banco de Dados

### Modelo Entidade-Relacionamento

```mermaid
erDiagram
    Producer ||--o{ Farm : "possui"
    Farm ||--o{ FarmCrop : "tem"
    Crop ||--o{ FarmCrop : "plantado em"
    Harvest ||--o{ FarmCrop : "colhido em"

    Producer {
        string id PK
        string cpfCnpj UK
        string name
        datetime createdAt
        datetime updatedAt
    }

    Farm {
        string id PK
        string producerId FK
        string name
        string city
        string state
        float totalArea
        float arableArea
        float vegetationArea
        datetime createdAt
        datetime updatedAt
    }

    Crop {
        string id PK
        string name UK
        datetime createdAt
        datetime updatedAt
    }

    Harvest {
        string id PK
        string name UK
        int year
        datetime createdAt
        datetime updatedAt
    }

    FarmCrop {
        string id PK
        string farmId FK
        string cropId FK
        string harvestId FK
        datetime createdAt
        datetime updatedAt
    }
```

**Relacionamentos:**

- Um **Produtor** pode ter várias **Fazendas**
- Uma **Fazenda** pode plantar várias **Culturas** em diferentes **Safras**
- A tabela **FarmCrop** faz o relacionamento N:N:N

**Validações:**

- `arableArea + vegetationArea ≤ totalArea` (Fazenda)
- `cpfCnpj` deve ser único (Produtor)
- `name` deve ser único (Crop e Harvest)
- Constraint único: `[farmId, harvestId, cropId]` (FarmCrop)

---

## 🔄 Fluxo de Dados na Aplicação

### Arquitetura de Fluxo (Frontend → Backend)

```mermaid
graph LR
    subgraph "Frontend"
        UI[Componente UI<br/>ProducerForm]
        HOOK[Hook de Página<br/>useProducersListPage]
        ENTITY[Entity Hook<br/>useCreateProducer]
        API[API Client<br/>createProducer]
    end

    subgraph "Backend"
        ROUTE[API Route<br/>/api/producers]
        VALID[Validação<br/>Zod Schema]
        PRISMA[Prisma ORM]
        DB[(PostgreSQL)]
    end

    UI -->|submit| HOOK
    HOOK -->|mutate| ENTITY
    ENTITY -->|fetch| API
    API -->|POST| ROUTE
    ROUTE -->|validate| VALID
    VALID -->|query| PRISMA
    PRISMA -->|SQL| DB

    DB -->|result| PRISMA
    PRISMA -->|data| VALID
    VALID -->|response| ROUTE
    ROUTE -->|JSON| API
    API -->|update cache| ENTITY
    ENTITY -->|onSuccess| HOOK
    HOOK -->|showToast| UI

    style UI fill:#e3f2fd
    style HOOK fill:#f3e5f5
    style ENTITY fill:#e8f5e9
    style API fill:#fff3e0
    style ROUTE fill:#fce4ec
    style DB fill:#ffebee
```

---

## 📝 Fluxo de CRUD

### Ciclo Completo: Criar, Atualizar e Deletar

```mermaid
sequenceDiagram
    participant User as 👤 Usuário
    participant Page as Página
    participant Hook as Hook
    participant Entity as Entity Hook
    participant API as API Route
    participant DB as Database

    Note over User,DB: Criar Novo Registro

    User->>Page: Clica "Nova Cultura"
    Page->>Page: Abre Modal
    User->>Page: Preenche formulário
    User->>Page: Clica "Salvar"
    Page->>Hook: handleSubmit(data)
    Hook->>Entity: createCrop.mutate(data)
    Entity->>API: POST /api/crops
    API->>API: Valida com Zod
    API->>DB: INSERT INTO crops
    DB-->>API: Novo registro
    API-->>Entity: { success: true, data }
    Entity->>Entity: Invalida cache
    Entity-->>Hook: onSuccess()
    Hook->>Page: Fecha modal
    Hook->>Page: showToast("Sucesso!")
    Page-->>User: Exibe notificação

    Note over User,DB: Deletar Registro

    User->>Page: Clica "Excluir"
    Page->>Hook: handleDelete(id)
    Hook->>Hook: Abre ConfirmDialog
    User->>Hook: Confirma exclusão
    Hook->>Entity: deleteCrop.mutate(id)
    Entity->>API: DELETE /api/crops/[id]
    API->>DB: DELETE FROM crops
    DB-->>API: OK
    API-->>Entity: { success: true }
    Entity->>Entity: Remove do cache
    Entity-->>Hook: onSuccess()
    Hook->>Page: showToast("Excluído!")
    Page-->>User: Atualiza tabela
```

---

## 📊 Dashboard - Agregação de Dados

### Fluxo de Estatísticas

```mermaid
graph TB
    subgraph "Frontend"
        DASH[DashboardPage]
        HOOK[useDashboardStats]
        WIDGETS[Widgets]
        STAT[StatCard]
        PIE[PieChartCard]
    end

    subgraph "Backend"
        API[/api/dashboard/stats]
        AGG[Agregações]
    end

    subgraph "Database"
        PROD[(Producers)]
        FARM[(Farms)]
        CROP[(Crops)]
        HARV[(Harvests)]
        FC[(FarmCrops)]
    end

    DASH -->|usa| HOOK
    HOOK -->|fetch| API

    API -->|consulta| FARM
    API -->|consulta| FC

    API -->|agrega| AGG
    AGG -->|totalFarms| API
    AGG -->|totalHectares| API
    AGG -->|farmsByState| API
    AGG -->|farmsByCrop| API
    AGG -->|landUse| API

    API -->|retorna stats| HOOK

    HOOK -->|data| WIDGETS
    WIDGETS -->|totalFarms| STAT
    WIDGETS -->|farmsByState| PIE
    WIDGETS -->|farmsByCrop| PIE

    style DASH fill:#e3f2fd
    style API fill:#fff3e0
    style AGG fill:#f3e5f5
    style PROD fill:#ffebee
    style FARM fill:#ffebee
    style CROP fill:#ffebee
```

---

## 🎯 Entity - Estrutura Interna

### Organização de uma Entity (Exemplo: Producer)

```mermaid
graph TB
    subgraph "entities/producer"
        INDEX[index.ts<br/>Public API]

        subgraph "api"
            API[producer.api.ts<br/>HTTP Calls]
            APITEST[producer.api.test.ts]
        end

        subgraph "hooks"
            HOOKS[use-producer-service.hook.ts<br/>React Query]
            HOOKTEST[use-producer-service.hook.test.tsx]
        end

        subgraph "model"
            MODEL[producer.model.ts<br/>Types & Interfaces]
        end

        subgraph "lib"
            MOCKS[mocks/producer.mock.ts]
        end

        INDEX --> API
        INDEX --> HOOKS
        INDEX --> MODEL

        HOOKS --> API
        HOOKS --> MODEL

        APITEST -.testa.-> API
        HOOKTEST -.testa.-> HOOKS
    end

    style INDEX fill:#4caf50,color:#fff
    style API fill:#2196f3,color:#fff
    style HOOKS fill:#ff9800,color:#fff
    style MODEL fill:#9c27b0,color:#fff
```

---

## ⚡ Feature - Estrutura Interna

### Organização de uma Feature (Exemplo: Crops)

```mermaid
graph TB
    subgraph "features/crops"
        FINDEX[index.ts<br/>Public API]

        subgraph "hooks"
            PAGEHOOK[use-crops-list-page.hook.ts<br/>Lógica de Página]
            PHTEST[use-crops-list-page.hook.test.tsx]
        end

        subgraph "ui"
            FORM[crop-form.tsx<br/>Formulário]
            SCHEMA[crop-form.schema.ts<br/>Validação Zod]
            FORMTEST[crop-form.test.tsx]
        end

        subgraph "config"
            COLUMNS[crops-table-columns.config.ts]
            COLTEST[crops-table-columns.config.test.ts]
        end

        FINDEX --> PAGEHOOK
        FINDEX --> FORM

        PAGEHOOK -.usa.-> FORM
        FORM --> SCHEMA

        PHTEST -.testa.-> PAGEHOOK
        FORMTEST -.testa.-> FORM
        COLTEST -.testa.-> COLUMNS
    end

    style FINDEX fill:#4caf50,color:#fff
    style PAGEHOOK fill:#ff9800,color:#fff
    style FORM fill:#2196f3,color:#fff
    style SCHEMA fill:#9c27b0,color:#fff
```

---

## 🔄 React Query - Cache e Sincronização

### Gerenciamento de Estado com React Query

```mermaid
graph LR
    subgraph "Componente"
        UI[UI Component]
        DISPLAY[Exibir Dados]
        LOADING[Loading State]
    end

    subgraph "React Query"
        CACHE[Query Cache]
        QUERY[useQuery]
        MUTATION[useMutation]
    end

    subgraph "Backend"
        API[API Routes]
        DB[(Database)]
    end

    UI -->|useProducers| QUERY
    QUERY -->|cached| CACHE
    QUERY -->|stale?| API
    API --> DB
    DB --> API
    API -->|update| CACHE
    CACHE -->|data| DISPLAY

    UI -->|createProducer| MUTATION
    MUTATION -->|POST| API
    API -->|success| MUTATION
    MUTATION -->|invalidate| CACHE
    CACHE -->|refetch| API

    CACHE -.loading.-> LOADING

    style CACHE fill:#4caf50,color:#fff
    style QUERY fill:#2196f3,color:#fff
    style MUTATION fill:#ff9800,color:#fff
```

**Benefícios:**

- ✅ Cache automático
- ✅ Sincronização em tempo real
- ✅ Loading states gerenciados
- ✅ Retry automático em erros
- ✅ Invalidação otimista

---

## 🎨 Sistema de Notificações

### Toast e ConfirmDialog

```mermaid
graph TB
    subgraph "Contexts"
        TC[ToastContext<br/>Estado Global]
        CC[ConfirmContext<br/>Estado Global]
    end

    subgraph "Componentes UI"
        TOAST[Toast<br/>Notificações]
        CONFIRM[ConfirmDialog<br/>Confirmações]
    end

    subgraph "Hooks"
        UT[useToast]
        UC[useConfirm]
    end

    subgraph "Features"
        PAGE[Página]
        ACTION[Ação do Usuário]
    end

    TC -.provides.-> UT
    CC -.provides.-> UC

    PAGE -->|usa| UT
    PAGE -->|usa| UC

    ACTION -->|showToast| UT
    UT -->|update state| TC
    TC -->|render| TOAST

    ACTION -->|confirm| UC
    UC -->|update state| CC
    CC -->|render| CONFIRM
    CONFIRM -->|onConfirm/onCancel| UC
    UC -->|resolve Promise| ACTION

    style TC fill:#ff9800,color:#fff
    style CC fill:#ff9800,color:#fff
    style TOAST fill:#4caf50,color:#fff
    style CONFIRM fill:#f44336,color:#fff
```

**Fluxo de Confirmação:**

1. Usuário clica em "Excluir"
2. `handleDelete` chama `confirm()` (async)
3. `ConfirmDialog` aparece na tela
4. Usuário confirma ou cancela
5. Promise resolve com `true` ou `false`
6. Ação prossegue baseado na resposta

---

## 📦 Estrutura de Pastas Detalhada

### Organização Completa do Projeto

```mermaid
graph TB
    ROOT[brain-agriculture/]

    subgraph "App Router"
        APP[app/]
        APPAPI[api/]
        PAGES[pages/]
    end

    subgraph "Source"
        SRC[src/]
        ENT[entities/]
        FEAT[features/]
        PAGECOMP[page-compositions/]
        WIDG[widgets/]
        SH[shared/]
    end

    subgraph "Configuração"
        PRISMA[prisma/]
        DOCS[docs/]
        SCRIPTS[scripts/]
        PUBLIC[public/]
    end

    ROOT --> APP
    ROOT --> SRC
    ROOT --> PRISMA
    ROOT --> DOCS
    ROOT --> SCRIPTS
    ROOT --> PUBLIC

    APP --> APPAPI
    APP --> PAGES

    SRC --> ENT
    SRC --> FEAT
    SRC --> PAGECOMP
    SRC --> WIDG
    SRC --> SH

    style ROOT fill:#333,color:#fff
    style APP fill:#2196f3,color:#fff
    style SRC fill:#4caf50,color:#fff
    style PRISMA fill:#9c27b0,color:#fff
    style DOCS fill:#ff9800,color:#fff
```

---

## 🚀 Fluxo Completo: Do Usuário ao Banco

### Exemplo: Criar Novo Produtor

```mermaid
sequenceDiagram
    autonumber

    participant U as 👤 Usuário
    participant P as ProducersListPage
    participant H as useProducersListPage
    participant E as useCreateProducer
    participant A as producer.api.ts
    participant R as POST /api/producers
    participant V as Zod Validation
    participant DB as PostgreSQL
    participant T as Toast

    U->>P: Clica "Novo Produtor"
    P->>P: Abre Modal

    U->>P: Preenche: nome, CPF
    U->>P: Clica "Salvar"

    P->>H: handleSubmit(data)
    H->>E: createProducer.mutate(data)

    Note over E: React Query Mutation

    E->>A: createProducer(data)
    A->>R: fetch('/api/producers', POST)

    R->>V: Valida dados

    alt Dados válidos
        V->>DB: INSERT INTO producers
        DB-->>V: Novo registro
        V-->>R: { success: true, data }
        R-->>A: Response 201
        A-->>E: Producer criado

        Note over E: Invalidate Cache
        E->>E: queryClient.invalidateQueries(['producers'])

        E-->>H: onSuccess()
        H->>P: Fecha modal
        H->>T: showToast("Sucesso!", "success")
        T-->>U: 🎉 Notificação verde

    else Dados inválidos
        V-->>R: { success: false, error }
        R-->>A: Response 400
        A-->>E: Error
        E-->>H: onError(error)
        H->>T: showToast("Erro!", "error")
        T-->>U: ❌ Notificação vermelha
    end
```

---

## 🗑️ Fluxo de Exclusão com Confirmação

### Exemplo: Deletar Produtor

```mermaid
sequenceDiagram
    autonumber

    participant U as 👤 Usuário
    participant P as Página
    participant H as Hook
    participant C as ConfirmDialog
    participant E as Entity Hook
    participant API as API Route
    participant DB as Database
    participant T as Toast

    U->>P: Clica "Excluir"
    P->>H: handleDelete(id)

    Note over H,C: Async Confirmation

    H->>C: confirm({ title, message, variant })
    C->>C: Renderiza Dialog
    C-->>U: Mostra confirmação

    alt Usuário confirma
        U->>C: Clica "Sim, excluir"
        C-->>H: resolve(true)

        H->>E: deleteProducer.mutate(id)
        E->>API: DELETE /api/producers/[id]
        API->>DB: DELETE FROM producers
        DB-->>API: OK
        API-->>E: { success: true }

        E->>E: Remove do cache
        E-->>H: onSuccess()
        H->>T: showToast("Excluído!", "success")
        T-->>U: 🎉 Sucesso

    else Usuário cancela
        U->>C: Clica "Cancelar" ou ESC
        C-->>H: resolve(false)
        H->>H: Não faz nada
        Note over H: Operação cancelada
    end
```

---

## 🧪 Estrutura de Testes

### Pirâmide de Testes do Projeto

```mermaid
graph TB
    subgraph "1493 Testes"
        E2E["E2E Tests<br/>(Planejado)<br/>0 testes"]
        INT["Integration Tests<br/>Hooks + API Routes<br/>~400 testes"]
        UNIT["Unit Tests<br/>Components + Utils<br/>~1093 testes"]
    end

    E2E -.-> INT
    INT --> UNIT

    style E2E fill:#f5f5f5
    style INT fill:#4caf50,color:#fff
    style UNIT fill:#2196f3,color:#fff
```

**Cobertura por camada:**

- ✅ **Shared**: 100% (Components, Utils, Contexts)
- ✅ **Entities**: 100% (API, Hooks, Models)
- ✅ **Features**: 100% (Hooks, Forms, Configs)
- ✅ **Page Compositions**: 100% (Páginas)
- ✅ **Widgets**: 100% (StatCard, PieChartCard)
- ✅ **API Routes**: 100% (Todos os endpoints)

---

## 🔐 Validação em Cascata

### Frontend e Backend

```mermaid
graph LR
    subgraph "Frontend Validation"
        FORM[React Hook Form]
        ZOD1[Zod Schema]
        UI[UI Feedback]
    end

    subgraph "Backend Validation"
        API[API Route]
        ZOD2[Zod Schema]
        BIZ[Business Rules]
    end

    subgraph "Database"
        CONST[Constraints]
        DB[(PostgreSQL)]
    end

    FORM -->|validate| ZOD1
    ZOD1 -->|error| UI
    ZOD1 -->|valid| API

    API -->|validate| ZOD2
    ZOD2 -->|check| BIZ
    BIZ -->|query| CONST
    CONST -->|execute| DB

    ZOD2 -.error.-> API
    BIZ -.error.-> API
    CONST -.error.-> DB

    style ZOD1 fill:#4caf50,color:#fff
    style ZOD2 fill:#4caf50,color:#fff
    style BIZ fill:#ff9800,color:#fff
```

**Dupla validação:**

1. **Frontend** - Feedback imediato (UX)
2. **Backend** - Segurança e consistência

---

## 📚 Recursos

- **Documentação FSD**: https://feature-sliced.design/
- **React Query**: https://tanstack.com/query/latest
- **Zod**: https://zod.dev/
- **Prisma**: https://www.prisma.io/docs

---

**[← Voltar para Documentação](./README.md)**
