# 📚 Documentação da API - Brain Agriculture

API REST completa para gerenciamento de produtores rurais, fazendas, culturas e safras.

📊 **[Ver fluxos visuais →](./diagrams.md#-fluxo-de-dados-na-aplicação)** - Diagramas de sequência e fluxos

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Início Rápido](#-início-rápido)
- [Endpoints](#-endpoints)
- [Estrutura de Resposta](#-estrutura-de-resposta)
- [Validação](#-validação)
- [Códigos de Status](#-códigos-de-status)
- [Exemplos](#-exemplos)
- [Tratamento de Erros](#️-tratamento-de-erros)

## 🌟 Visão Geral

API RESTful construída com **Next.js 15 API Routes**, **TypeScript** e **Prisma ORM**.

**Recursos disponíveis:**

- ✅ CRUD completo de Produtores (com validação CPF/CNPJ)
- ✅ CRUD completo de Fazendas (com validação de áreas)
- ✅ CRUD completo de Culturas
- ✅ CRUD completo de Safras
- ✅ CRUD completo de Associações Fazenda-Cultura-Safra
- ✅ Estatísticas do Dashboard
- ✅ Health Check

**Base URL:** `http://localhost:3000/api`

## 🚀 Início Rápido

### Documentação Interativa

Acesse o **Swagger UI** local:

```
http://localhost:3000/api-docs
```

### Especificação OpenAPI

- **Arquivo**: [`public/openapi.yaml`](../../public/openapi.yaml)
- **Versão**: OpenAPI 3.0.3

## 🔗 Endpoints

### Produtores

| Método   | Endpoint              | Descrição                                |
| -------- | --------------------- | ---------------------------------------- |
| `GET`    | `/api/producers`      | Lista todos os produtores (com fazendas) |
| `POST`   | `/api/producers`      | Cria novo produtor                       |
| `PUT`    | `/api/producers/[id]` | Atualiza produtor                        |
| `DELETE` | `/api/producers/[id]` | Deleta produtor                          |

### Fazendas

| Método   | Endpoint          | Descrição                                         |
| -------- | ----------------- | ------------------------------------------------- |
| `GET`    | `/api/farms`      | Lista todas as fazendas (com produtor e culturas) |
| `POST`   | `/api/farms`      | Cria nova fazenda                                 |
| `PUT`    | `/api/farms/[id]` | Atualiza fazenda                                  |
| `DELETE` | `/api/farms/[id]` | Deleta fazenda                                    |

### Culturas

| Método   | Endpoint          | Descrição               |
| -------- | ----------------- | ----------------------- |
| `GET`    | `/api/crops`      | Lista todas as culturas |
| `POST`   | `/api/crops`      | Cria nova cultura       |
| `PUT`    | `/api/crops/[id]` | Atualiza cultura        |
| `DELETE` | `/api/crops/[id]` | Deleta cultura          |

### Safras

| Método   | Endpoint             | Descrição             |
| -------- | -------------------- | --------------------- |
| `GET`    | `/api/harvests`      | Lista todas as safras |
| `POST`   | `/api/harvests`      | Cria nova safra       |
| `PUT`    | `/api/harvests/[id]` | Atualiza safra        |
| `DELETE` | `/api/harvests/[id]` | Deleta safra          |

### Associações Fazenda-Cultura-Safra

| Método   | Endpoint               | Descrição                                           |
| -------- | ---------------------- | --------------------------------------------------- |
| `GET`    | `/api/farm-crops`      | Lista todas as associações (com dados relacionados) |
| `POST`   | `/api/farm-crops`      | Cria nova associação                                |
| `PUT`    | `/api/farm-crops/[id]` | Atualiza associação                                 |
| `DELETE` | `/api/farm-crops/[id]` | Deleta associação                                   |

### Dashboard

| Método | Endpoint               | Descrição                         |
| ------ | ---------------------- | --------------------------------- |
| `GET`  | `/api/dashboard/stats` | Estatísticas agregadas do sistema |

### Health Check

| Método | Endpoint      | Descrição           |
| ------ | ------------- | ------------------- |
| `GET`  | `/api/health` | Status da aplicação |

## 📦 Estrutura de Resposta

### Sucesso

Todas as respostas de sucesso seguem o padrão:

```typescript
{
  success: true,
  data: T,           // Dados retornados
  count?: number     // Quantidade (apenas em listagens)
}
```

### Erro

```typescript
{
  success: false,
  error: string,     // Tipo do erro
  message: string,   // Descrição do erro
  details?: Array    // Detalhes de validação (opcional)
}
```

## ✅ Validação

A API utiliza **Zod** para validação de dados.

### Produtores

```typescript
{
  cpfCnpj: string,  // Obrigatório, único
  name: string      // Obrigatório
}
```

**Regras:**

- CPF/CNPJ não pode estar duplicado
- Nome não pode ser vazio

### Fazendas

```typescript
{
  producerId: string,      // Obrigatório, deve existir
  name: string,            // Obrigatório
  city: string,            // Obrigatório
  state: string,           // Obrigatório (sigla UF)
  totalArea: number,       // Obrigatório, positivo
  arableArea: number,      // Obrigatório, positivo
  vegetationArea: number   // Obrigatório, positivo
}
```

**Regras:**

- `arableArea + vegetationArea ≤ totalArea`
- Todas as áreas devem ser números positivos
- ProducerId deve referenciar um produtor existente

### Culturas

```typescript
{
  name: string; // Obrigatório, único
}
```

### Safras

```typescript
{
  year: string; // Obrigatório, único (ex: "2023")
}
```

### Associações

```typescript
{
  farmId: string,     // Obrigatório, deve existir
  cropId: string,     // Obrigatório, deve existir
  harvestId: string   // Obrigatório, deve existir
}
```

## 📊 Códigos de Status

| Código | Descrição             | Uso                               |
| ------ | --------------------- | --------------------------------- |
| `200`  | OK                    | Operação realizada com sucesso    |
| `201`  | Created               | Recurso criado com sucesso        |
| `400`  | Bad Request           | Dados inválidos ou malformados    |
| `404`  | Not Found             | Recurso não encontrado            |
| `409`  | Conflict              | Conflito (ex: CPF/CNPJ duplicado) |
| `500`  | Internal Server Error | Erro interno do servidor          |

## 💡 Exemplos

### 1. Listar Produtores

**Request:**

```bash
GET /api/producers
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "cpfCnpj": "12345678901",
      "name": "João Silva",
      "farms": [
        {
          "id": "1",
          "name": "Fazenda São José",
          "city": "São Paulo",
          "state": "SP",
          "totalArea": 100,
          "arableArea": 80,
          "vegetationArea": 20,
          "farmCrops": [...]
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

### 2. Criar Produtor

**Request:**

```bash
POST /api/producers
Content-Type: application/json

{
  "cpfCnpj": "12345678901",
  "name": "João Silva"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "1",
    "cpfCnpj": "12345678901",
    "name": "João Silva",
    "farms": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Criar Fazenda

**Request:**

```bash
POST /api/farms
Content-Type: application/json

{
  "producerId": "1",
  "name": "Fazenda São José",
  "city": "São Paulo",
  "state": "SP",
  "totalArea": 100,
  "arableArea": 80,
  "vegetationArea": 20
}
```

### 4. Dashboard Stats

**Request:**

```bash
GET /api/dashboard/stats
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalFarms": 5,
    "totalHectares": 1500,
    "farmsByState": [
      { "name": "SP", "value": 3 },
      { "name": "MG", "value": 2 }
    ],
    "farmsByCrop": [
      { "name": "Soja", "value": 4 },
      { "name": "Milho", "value": 2 }
    ],
    "landUse": [
      { "name": "Área Agricultável", "value": 1200 },
      { "name": "Vegetação", "value": 300 }
    ]
  }
}
```

### 5. Criar Associação

**Request:**

```bash
POST /api/farm-crops
Content-Type: application/json

{
  "farmId": "1",
  "cropId": "1",
  "harvestId": "1"
}
```

## ⚠️ Tratamento de Erros

### 400 - Bad Request (Validação)

```json
{
  "success": false,
  "error": "Dados inválidos",
  "message": "Verifique os dados enviados",
  "details": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["name"],
      "message": "Nome é obrigatório"
    }
  ]
}
```

### 409 - Conflict (Duplicado)

```json
{
  "success": false,
  "error": "CPF/CNPJ já cadastrado",
  "message": "Já existe um produtor com este CPF/CNPJ"
}
```

### 404 - Not Found

```json
{
  "success": false,
  "error": "Produtor não encontrado",
  "message": "Nenhum produtor encontrado com este ID"
}
```

### 500 - Internal Server Error

```json
{
  "success": false,
  "error": "Erro interno do servidor",
  "message": "Erro ao processar a requisição"
}
```

## 🛠️ Ferramentas

### Testando a API

**Swagger UI** (Recomendado)

```
http://localhost:3000/api-docs
```

**Outras opções:**

- Postman / Insomnia
- curl / HTTPie
- VS Code REST Client

### Formato de Dados

- **Datas**: ISO 8601 (UTC)
- **IDs**: Strings (UUIDs ou números como string)
- **Números**: Decimais com até 2 casas (áreas)

## 📚 Recursos

- **[Especificação OpenAPI](../../public/openapi.yaml)** - Spec completa
- **[Swagger UI Local](http://localhost:3000/api-docs)** - Documentação interativa
- **[Testes da API](../../app/api/)** - Exemplos de uso nos testes
