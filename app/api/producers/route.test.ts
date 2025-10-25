import { NextRequest } from 'next/server';
import { GET, POST } from './route';
import { prisma } from '@/shared/lib/database/prisma';

// Mock do Prisma
jest.mock('@/shared/lib/database/prisma', () => ({
  prisma: {
    producer: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock do NextRequest
const createMockRequest = (body: Record<string, unknown>) =>
  ({
    json: jest.fn().mockResolvedValue(body),
  } as unknown as NextRequest);

// Mock do Next.js server
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: jest.fn().mockResolvedValue(data),
      status: init?.status || 200,
    })),
  },
}));

describe('API Route /api/producers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/producers', () => {
    it('deve retornar lista de produtores com sucesso', async () => {
      const mockProducers = [
        {
          id: '1',
          cpfCnpj: '123.456.789-09',
          name: 'João Silva',
          farms: [
            {
              id: '1',
              name: 'Fazenda A',
              producerId: '1',
              city: 'São Paulo',
              state: 'SP',
              totalArea: 100,
              arableArea: 80,
              vegetationArea: 20,
              farmCrops: [
                {
                  id: '1',
                  farmId: '1',
                  cropId: '1',
                  harvestId: '1',
                  crop: { id: '1', name: 'Soja' },
                  harvest: { id: '1', name: 'Safra 2024', year: 2024 },
                },
              ],
            },
          ],
        },
        {
          id: '2',
          cpfCnpj: '98.765.432/0001-10',
          name: 'Agropecuária Santos Ltda',
          farms: [],
        },
      ];

      (prisma.producer.findMany as jest.Mock).mockResolvedValue(mockProducers);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: mockProducers,
        count: 2,
      });
      expect(prisma.producer.findMany).toHaveBeenCalledWith({
        include: {
          farms: {
            include: {
              farmCrops: {
                include: {
                  crop: true,
                  harvest: true,
                },
              },
            },
          },
        },
      });
    });

    it('deve retornar lista vazia quando não há produtores', async () => {
      (prisma.producer.findMany as jest.Mock).mockResolvedValue([]);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: [],
        count: 0,
      });
    });

    it('deve lidar com erro do banco de dados', async () => {
      const error = new Error('Erro de conexão com o banco');
      (prisma.producer.findMany as jest.Mock).mockRejectedValue(error);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro de conexão com o banco',
      });
    });

    it('deve lidar com erro desconhecido', async () => {
      (prisma.producer.findMany as jest.Mock).mockRejectedValue('Erro desconhecido');

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro desconhecido',
      });
    });
  });

  describe('POST /api/producers', () => {
    it('deve criar produtor com sucesso', async () => {
      const requestBody = {
        cpfCnpj: '123.456.789-09',
        name: 'João Silva',
      };

      const mockCreatedProducer = {
        id: '1',
        cpfCnpj: '123.456.789-09',
        name: 'João Silva',
        farms: [],
      };

      (prisma.producer.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.producer.create as jest.Mock).mockResolvedValue(mockCreatedProducer);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual({
        success: true,
        data: mockCreatedProducer,
        message: 'Produtor criado com sucesso',
      });
      expect(prisma.producer.findUnique).toHaveBeenCalledWith({
        where: { cpfCnpj: '123.456.789-09' },
      });
      expect(prisma.producer.create).toHaveBeenCalledWith({
        data: {
          cpfCnpj: '123.456.789-09',
          name: 'João Silva',
        },
        include: {
          farms: {
            include: {
              farmCrops: {
                include: {
                  crop: true,
                  harvest: true,
                },
              },
            },
          },
        },
      });
    });

    it('deve retornar erro quando CPF/CNPJ já existe', async () => {
      const requestBody = {
        cpfCnpj: '123.456.789-09',
        name: 'João Silva',
      };

      const existingProducer = {
        id: '1',
        cpfCnpj: '123.456.789-09',
        name: 'João Silva Existente',
      };

      (prisma.producer.findUnique as jest.Mock).mockResolvedValue(existingProducer);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data).toEqual({
        success: false,
        error: 'CPF/CNPJ já cadastrado',
        message: 'Já existe um produtor com este CPF/CNPJ',
      });
      expect(prisma.producer.create).not.toHaveBeenCalled();
    });

    it('deve retornar erro de validação quando CPF/CNPJ está vazio', async () => {
      const requestBody = {
        cpfCnpj: '',
        name: 'João Silva',
      };

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        success: false,
        error: 'Dados inválidos',
        message: 'Verifique os dados enviados',
        details: expect.any(Array),
      });
      expect(data.details).toHaveLength(1);
      expect(data.details[0]).toMatchObject({
        path: ['cpfCnpj'],
        message: 'CPF/CNPJ é obrigatório',
      });
    });

    it('deve retornar erro de validação quando nome está vazio', async () => {
      const requestBody = {
        cpfCnpj: '123.456.789-09',
        name: '',
      };

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        success: false,
        error: 'Dados inválidos',
        message: 'Verifique os dados enviados',
        details: expect.any(Array),
      });
      expect(data.details).toHaveLength(1);
      expect(data.details[0]).toMatchObject({
        path: ['name'],
        message: 'Nome é obrigatório',
      });
    });

    it('deve retornar erro de validação quando ambos os campos estão vazios', async () => {
      const requestBody = {
        cpfCnpj: '',
        name: '',
      };

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        success: false,
        error: 'Dados inválidos',
        message: 'Verifique os dados enviados',
        details: expect.any(Array),
      });
      expect(data.details).toHaveLength(2);
    });

    it('deve retornar erro de validação quando campos estão ausentes', async () => {
      const requestBody = {};

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        success: false,
        error: 'Dados inválidos',
        message: 'Verifique os dados enviados',
        details: expect.any(Array),
      });
      expect(data.details).toHaveLength(2);
    });

    it('deve lidar com erro do banco de dados na criação', async () => {
      const requestBody = {
        cpfCnpj: '123.456.789-09',
        name: 'João Silva',
      };

      const error = new Error('Erro de conexão com o banco');
      (prisma.producer.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.producer.create as jest.Mock).mockRejectedValue(error);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro de conexão com o banco',
      });
    });

    it('deve lidar com erro desconhecido na criação', async () => {
      const requestBody = {
        cpfCnpj: '123.456.789-09',
        name: 'João Silva',
      };

      (prisma.producer.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.producer.create as jest.Mock).mockRejectedValue('Erro desconhecido');

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro desconhecido',
      });
    });

    it('deve lidar com erro do banco de dados na verificação de CPF/CNPJ', async () => {
      const requestBody = {
        cpfCnpj: '123.456.789-09',
        name: 'João Silva',
      };

      const error = new Error('Erro de conexão com o banco');
      (prisma.producer.findUnique as jest.Mock).mockRejectedValue(error);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro de conexão com o banco',
      });
    });

    it('deve criar produtor com dados válidos incluindo relacionamentos', async () => {
      const requestBody = {
        cpfCnpj: '98.765.432/0001-10',
        name: 'Agropecuária Santos Ltda',
      };

      const mockCreatedProducer = {
        id: '2',
        cpfCnpj: '98.765.432/0001-10',
        name: 'Agropecuária Santos Ltda',
        farms: [
          {
            id: '1',
            name: 'Fazenda A',
            producerId: '2',
            city: 'São Paulo',
            state: 'SP',
            totalArea: 100,
            arableArea: 80,
            vegetationArea: 20,
            farmCrops: [
              {
                id: '1',
                farmId: '1',
                cropId: '1',
                harvestId: '1',
                crop: { id: '1', name: 'Soja' },
                harvest: { id: '1', name: 'Safra 2024', year: 2024 },
              },
            ],
          },
        ],
      };

      (prisma.producer.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.producer.create as jest.Mock).mockResolvedValue(mockCreatedProducer);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual({
        success: true,
        data: mockCreatedProducer,
        message: 'Produtor criado com sucesso',
      });
    });

    it('deve validar tipos de dados corretos', async () => {
      const requestBody = {
        cpfCnpj: '123.456.789-09',
        name: 'João Silva',
      };

      const mockCreatedProducer = {
        id: '1',
        cpfCnpj: '123.456.789-09',
        name: 'João Silva',
        farms: [],
      };

      (prisma.producer.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.producer.create as jest.Mock).mockResolvedValue(mockCreatedProducer);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(typeof data.data.cpfCnpj).toBe('string');
      expect(typeof data.data.name).toBe('string');
      expect(Array.isArray(data.data.farms)).toBe(true);
    });

    it('deve incluir relacionamentos completos na resposta', async () => {
      const requestBody = {
        cpfCnpj: '123.456.789-09',
        name: 'João Silva',
      };

      const mockCreatedProducer = {
        id: '1',
        cpfCnpj: '123.456.789-09',
        name: 'João Silva',
        farms: [
          {
            id: '1',
            name: 'Fazenda A',
            producerId: '1',
            city: 'São Paulo',
            state: 'SP',
            totalArea: 100,
            arableArea: 80,
            vegetationArea: 20,
            farmCrops: [
              {
                id: '1',
                farmId: '1',
                cropId: '1',
                harvestId: '1',
                crop: { id: '1', name: 'Soja' },
                harvest: { id: '1', name: 'Safra 2024', year: 2024 },
              },
            ],
          },
        ],
      };

      (prisma.producer.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.producer.create as jest.Mock).mockResolvedValue(mockCreatedProducer);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.data.farms[0]).toHaveProperty('farmCrops');
      expect(data.data.farms[0].farmCrops[0]).toHaveProperty('crop');
      expect(data.data.farms[0].farmCrops[0]).toHaveProperty('harvest');
    });
  });
});
