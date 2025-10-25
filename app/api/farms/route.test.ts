import { NextRequest } from 'next/server';
import { GET, POST } from './route';
import { prisma } from '@/shared/lib/database/prisma';

// Mock do Prisma
jest.mock('@/shared/lib/database/prisma', () => ({
  prisma: {
    farm: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    producer: {
      findUnique: jest.fn(),
    },
  },
}));

// Mock do NextRequest
const createMockRequest = (body: Record<string, unknown>, url = 'http://localhost:3000/api/farms') =>
  ({
    json: jest.fn().mockResolvedValue(body),
    url,
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

describe('API Route /api/farms', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/farms', () => {
    it('deve retornar lista de fazendas com sucesso', async () => {
      const mockFarms = [
        {
          id: '1',
          producerId: '1',
          name: 'Fazenda São João',
          city: 'São Paulo',
          state: 'SP',
          totalArea: 100,
          arableArea: 80,
          vegetationArea: 20,
          producer: {
            id: '1',
            name: 'João Silva',
            cpfCnpj: '12345678901',
          },
          farmCrops: [
            {
              id: '1',
              farmId: '1',
              harvestId: '1',
              cropId: '1',
              crop: { id: '1', name: 'Soja' },
              harvest: { id: '1', name: 'Safra 2024', year: 2024 },
            },
          ],
        },
        {
          id: '2',
          producerId: '2',
          name: 'Fazenda Santa Maria',
          city: 'Rio de Janeiro',
          state: 'RJ',
          totalArea: 200,
          arableArea: 150,
          vegetationArea: 50,
          producer: {
            id: '2',
            name: 'Maria Santos',
            cpfCnpj: '12345678000195',
          },
          farmCrops: [],
        },
      ];

      (prisma.farm.findMany as jest.Mock).mockResolvedValue(mockFarms);

      const request = createMockRequest({});
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: mockFarms,
        count: 2,
      });
      expect(prisma.farm.findMany).toHaveBeenCalledWith({
        include: {
          producer: true,
          farmCrops: {
            include: {
              crop: true,
              harvest: true,
            },
          },
        },
      });
    });

    it('deve retornar fazendas filtradas por producerId', async () => {
      const mockFarms = [
        {
          id: '1',
          producerId: '1',
          name: 'Fazenda São João',
          city: 'São Paulo',
          state: 'SP',
          totalArea: 100,
          arableArea: 80,
          vegetationArea: 20,
          producer: {
            id: '1',
            name: 'João Silva',
            cpfCnpj: '12345678901',
          },
          farmCrops: [],
        },
      ];

      (prisma.farm.findMany as jest.Mock).mockResolvedValue(mockFarms);

      const request = createMockRequest({}, 'http://localhost:3000/api/farms?producerId=1');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: mockFarms,
        count: 1,
      });
      expect(prisma.farm.findMany).toHaveBeenCalledWith({
        where: { producerId: '1' },
        include: {
          producer: true,
          farmCrops: {
            include: {
              crop: true,
              harvest: true,
            },
          },
        },
      });
    });

    it('deve retornar lista vazia quando não há fazendas', async () => {
      (prisma.farm.findMany as jest.Mock).mockResolvedValue([]);

      const request = createMockRequest({});
      const response = await GET(request);
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
      (prisma.farm.findMany as jest.Mock).mockRejectedValue(error);

      const request = createMockRequest({});
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro de conexão com o banco',
      });
    });

    it('deve lidar com erro desconhecido', async () => {
      (prisma.farm.findMany as jest.Mock).mockRejectedValue('Erro desconhecido');

      const request = createMockRequest({});
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro desconhecido',
      });
    });
  });

  describe('POST /api/farms', () => {
    it('deve criar fazenda com sucesso', async () => {
      const requestBody = {
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      const mockProducer = {
        id: '1',
        name: 'João Silva',
        cpfCnpj: '12345678901',
      };

      const mockCreatedFarm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
        producer: mockProducer,
        farmCrops: [],
      };

      (prisma.producer.findUnique as jest.Mock).mockResolvedValue(mockProducer);
      (prisma.farm.create as jest.Mock).mockResolvedValue(mockCreatedFarm);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual({
        success: true,
        data: mockCreatedFarm,
        message: 'Fazenda criada com sucesso',
      });
      expect(prisma.producer.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(prisma.farm.create).toHaveBeenCalledWith({
        data: {
          producerId: '1',
          name: 'Fazenda São João',
          city: 'São Paulo',
          state: 'SP',
          totalArea: 100,
          arableArea: 80,
          vegetationArea: 20,
        },
        include: {
          producer: true,
          farmCrops: {
            include: {
              crop: true,
              harvest: true,
            },
          },
        },
      });
    });

    it('deve retornar erro quando produtor não existe', async () => {
      const requestBody = {
        producerId: '999',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      (prisma.producer.findUnique as jest.Mock).mockResolvedValue(null);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({
        success: false,
        error: 'Produtor não encontrado',
        message: 'O produtor especificado não existe',
      });
      expect(prisma.farm.create).not.toHaveBeenCalled();
    });

    it('deve retornar erro de validação quando producerId está vazio', async () => {
      const requestBody = {
        producerId: '',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
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
        path: ['producerId'],
        message: 'ID do produtor é obrigatório',
      });
    });

    it('deve retornar erro de validação quando nome está vazio', async () => {
      const requestBody = {
        producerId: '1',
        name: '',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
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
        message: 'Nome da fazenda é obrigatório',
      });
    });

    it('deve retornar erro de validação quando cidade está vazia', async () => {
      const requestBody = {
        producerId: '1',
        name: 'Fazenda São João',
        city: '',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
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
        path: ['city'],
        message: 'Cidade é obrigatória',
      });
    });

    it('deve retornar erro de validação quando estado está vazio', async () => {
      const requestBody = {
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: '',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
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
        path: ['state'],
        message: 'Estado é obrigatório',
      });
    });

    it('deve retornar erro de validação quando área total é negativa', async () => {
      const requestBody = {
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: -100,
        arableArea: 80,
        vegetationArea: 20,
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
      expect(data.details).toHaveLength(2); // Dois erros: positive() e refine()
      expect(data.details[0]).toMatchObject({
        path: ['totalArea'],
        message: 'Área total deve ser positiva',
      });
    });

    it('deve retornar erro de validação quando área agricultável é negativa', async () => {
      const requestBody = {
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: -80,
        vegetationArea: 20,
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
        path: ['arableArea'],
        message: 'Área agricultável não pode ser negativa',
      });
    });

    it('deve retornar erro de validação quando área de vegetação é negativa', async () => {
      const requestBody = {
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: -20,
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
        path: ['vegetationArea'],
        message: 'Área de vegetação não pode ser negativa',
      });
    });

    it('deve retornar erro de validação quando soma das áreas excede área total', async () => {
      const requestBody = {
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 30,
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
        path: ['totalArea'],
        message: 'A soma das áreas agricultável e vegetação não pode exceder a área total',
      });
    });

    it('deve retornar erro de validação quando múltiplos campos estão inválidos', async () => {
      const requestBody = {
        producerId: '',
        name: '',
        city: '',
        state: '',
        totalArea: -100,
        arableArea: -80,
        vegetationArea: -20,
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
      expect(data.details).toHaveLength(7);
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
      expect(data.details).toHaveLength(7);
    });

    it('deve lidar com erro do banco de dados na criação', async () => {
      const requestBody = {
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      const mockProducer = {
        id: '1',
        name: 'João Silva',
        cpfCnpj: '12345678901',
      };

      const error = new Error('Erro de conexão com o banco');
      (prisma.producer.findUnique as jest.Mock).mockResolvedValue(mockProducer);
      (prisma.farm.create as jest.Mock).mockRejectedValue(error);

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
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      const mockProducer = {
        id: '1',
        name: 'João Silva',
        cpfCnpj: '12345678901',
      };

      (prisma.producer.findUnique as jest.Mock).mockResolvedValue(mockProducer);
      (prisma.farm.create as jest.Mock).mockRejectedValue('Erro desconhecido');

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

    it('deve lidar com erro do banco de dados na verificação de produtor', async () => {
      const requestBody = {
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
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

    it('deve criar fazenda com dados válidos incluindo relacionamentos', async () => {
      const requestBody = {
        producerId: '2',
        name: 'Fazenda Santa Maria',
        city: 'Rio de Janeiro',
        state: 'RJ',
        totalArea: 200,
        arableArea: 150,
        vegetationArea: 50,
      };

      const mockProducer = {
        id: '2',
        name: 'Maria Santos',
        cpfCnpj: '12345678000195',
      };

      const mockCreatedFarm = {
        id: '2',
        producerId: '2',
        name: 'Fazenda Santa Maria',
        city: 'Rio de Janeiro',
        state: 'RJ',
        totalArea: 200,
        arableArea: 150,
        vegetationArea: 50,
        producer: mockProducer,
        farmCrops: [
          {
            id: '1',
            farmId: '2',
            harvestId: '1',
            cropId: '1',
            crop: { id: '1', name: 'Soja' },
            harvest: { id: '1', name: 'Safra 2024', year: 2024 },
          },
        ],
      };

      (prisma.producer.findUnique as jest.Mock).mockResolvedValue(mockProducer);
      (prisma.farm.create as jest.Mock).mockResolvedValue(mockCreatedFarm);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual({
        success: true,
        data: mockCreatedFarm,
        message: 'Fazenda criada com sucesso',
      });
    });

    it('deve validar tipos de dados corretos', async () => {
      const requestBody = {
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      const mockProducer = {
        id: '1',
        name: 'João Silva',
        cpfCnpj: '12345678901',
      };

      const mockCreatedFarm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
        producer: mockProducer,
        farmCrops: [],
      };

      (prisma.producer.findUnique as jest.Mock).mockResolvedValue(mockProducer);
      (prisma.farm.create as jest.Mock).mockResolvedValue(mockCreatedFarm);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(typeof data.data.name).toBe('string');
      expect(typeof data.data.city).toBe('string');
      expect(typeof data.data.state).toBe('string');
      expect(typeof data.data.totalArea).toBe('number');
      expect(typeof data.data.arableArea).toBe('number');
      expect(typeof data.data.vegetationArea).toBe('number');
      expect(Array.isArray(data.data.farmCrops)).toBe(true);
    });

    it('deve incluir relacionamentos completos na resposta', async () => {
      const requestBody = {
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      const mockProducer = {
        id: '1',
        name: 'João Silva',
        cpfCnpj: '12345678901',
      };

      const mockCreatedFarm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
        producer: mockProducer,
        farmCrops: [
          {
            id: '1',
            farmId: '1',
            harvestId: '1',
            cropId: '1',
            crop: { id: '1', name: 'Soja' },
            harvest: { id: '1', name: 'Safra 2024', year: 2024 },
          },
        ],
      };

      (prisma.producer.findUnique as jest.Mock).mockResolvedValue(mockProducer);
      (prisma.farm.create as jest.Mock).mockResolvedValue(mockCreatedFarm);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.data).toHaveProperty('producer');
      expect(data.data).toHaveProperty('farmCrops');
      expect(data.data.farmCrops[0]).toHaveProperty('crop');
      expect(data.data.farmCrops[0]).toHaveProperty('harvest');
    });
  });
});
