import { NextRequest } from 'next/server';
import { GET, POST } from './route';
import { prisma } from '@/shared/lib/database/prisma';

// Mock do Prisma
jest.mock('@/shared/lib/database/prisma', () => ({
  prisma: {
    farmCrop: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock do NextRequest
const createMockRequest = (body: Record<string, unknown>, url = 'http://localhost:3000/api/farm-crops') =>
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

describe('API Route /api/farm-crops', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/farm-crops', () => {
    it('deve retornar lista de associações com sucesso', async () => {
      const mockFarmCrops = [
        {
          id: '1',
          farmId: '1',
          cropId: '1',
          harvestId: '1',
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          farm: {
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
          },
          crop: {
            id: '1',
            name: 'Soja',
          },
          harvest: {
            id: '1',
            name: 'Safra 2021',
            year: 2021,
          },
        },
        {
          id: '2',
          farmId: '2',
          cropId: '2',
          harvestId: '2',
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          farm: {
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
          },
          crop: {
            id: '2',
            name: 'Milho',
          },
          harvest: {
            id: '2',
            name: 'Safra 2022',
            year: 2022,
          },
        },
      ];

      (prisma.farmCrop.findMany as jest.Mock).mockResolvedValue(mockFarmCrops);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: mockFarmCrops,
        count: 2,
      });
      expect(prisma.farmCrop.findMany).toHaveBeenCalledWith({
        include: {
          farm: {
            include: {
              producer: true,
            },
          },
          crop: true,
          harvest: true,
        },
        orderBy: [
          {
            farm: {
              name: 'asc',
            },
          },
          {
            crop: {
              name: 'asc',
            },
          },
          {
            harvest: {
              year: 'desc',
            },
          },
        ],
      });
    });

    it('deve retornar lista vazia quando não há associações', async () => {
      (prisma.farmCrop.findMany as jest.Mock).mockResolvedValue([]);

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
      (prisma.farmCrop.findMany as jest.Mock).mockRejectedValue(error);

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
      (prisma.farmCrop.findMany as jest.Mock).mockRejectedValue('Erro desconhecido');

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro desconhecido',
      });
    });

    it('deve usar ordenação correta', async () => {
      (prisma.farmCrop.findMany as jest.Mock).mockResolvedValue([]);

      await GET();

      expect(prisma.farmCrop.findMany).toHaveBeenCalledWith({
        include: {
          farm: {
            include: {
              producer: true,
            },
          },
          crop: true,
          harvest: true,
        },
        orderBy: [
          {
            farm: {
              name: 'asc',
            },
          },
          {
            crop: {
              name: 'asc',
            },
          },
          {
            harvest: {
              year: 'desc',
            },
          },
        ],
      });
    });
  });

  describe('POST /api/farm-crops', () => {
    const validData = {
      farmId: '1',
      cropId: '1',
      harvestId: '1',
    };

    const mockFarmCrop = {
      id: '1',
      farmId: '1',
      cropId: '1',
      harvestId: '1',
      createdAt: new Date('2021-01-01T00:00:00.000Z'),
      updatedAt: new Date('2021-01-01T00:00:00.000Z'),
      farm: {
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
      },
      crop: {
        id: '1',
        name: 'Soja',
      },
      harvest: {
        id: '1',
        name: 'Safra 2021',
        year: 2021,
      },
    };

    it('deve criar associação com sucesso', async () => {
      (prisma.farmCrop.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.farmCrop.create as jest.Mock).mockResolvedValue(mockFarmCrop);

      const request = createMockRequest(validData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: mockFarmCrop,
      });
      expect(prisma.farmCrop.findFirst).toHaveBeenCalledWith({
        where: {
          farmId: validData.farmId,
          cropId: validData.cropId,
          harvestId: validData.harvestId,
        },
      });
      expect(prisma.farmCrop.create).toHaveBeenCalledWith({
        data: validData,
        include: {
          farm: {
            include: {
              producer: true,
            },
          },
          crop: true,
          harvest: true,
        },
      });
    });

    it('deve retornar erro quando associação já existe', async () => {
      (prisma.farmCrop.findFirst as jest.Mock).mockResolvedValue(mockFarmCrop);

      const request = createMockRequest(validData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data).toEqual({
        success: false,
        error: 'Associação já existe',
        message: 'Esta combinação de fazenda, cultura e safra já está cadastrada',
      });
      expect(prisma.farmCrop.create).not.toHaveBeenCalled();
    });

    it('deve retornar erro de validação quando farmId está vazio', async () => {
      const invalidData = {
        farmId: '',
        cropId: '1',
        harvestId: '1',
      };

      const request = createMockRequest(invalidData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Dados inválidos');
      expect(data.issues).toBeDefined();
      expect(data.issues[0].path).toEqual(['farmId']);
      expect(data.issues[0].message).toBe('ID da fazenda é obrigatório');
    });

    it('deve retornar erro de validação quando cropId está vazio', async () => {
      const invalidData = {
        farmId: '1',
        cropId: '',
        harvestId: '1',
      };

      const request = createMockRequest(invalidData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Dados inválidos');
      expect(data.issues).toBeDefined();
      expect(data.issues[0].path).toEqual(['cropId']);
      expect(data.issues[0].message).toBe('ID da cultura é obrigatório');
    });

    it('deve retornar erro de validação quando harvestId está vazio', async () => {
      const invalidData = {
        farmId: '1',
        cropId: '1',
        harvestId: '',
      };

      const request = createMockRequest(invalidData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Dados inválidos');
      expect(data.issues).toBeDefined();
      expect(data.issues[0].path).toEqual(['harvestId']);
      expect(data.issues[0].message).toBe('ID da safra é obrigatório');
    });

    it('deve retornar erro de validação quando dados estão ausentes', async () => {
      const invalidData = {};

      const request = createMockRequest(invalidData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Dados inválidos');
      expect(data.issues).toBeDefined();
      expect(data.issues).toHaveLength(3);
    });

    it('deve retornar erro de validação quando dados são null', async () => {
      const invalidData = {
        farmId: null,
        cropId: null,
        harvestId: null,
      };

      const request = createMockRequest(invalidData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Dados inválidos');
      expect(data.issues).toBeDefined();
    });

    it('deve retornar erro de validação quando dados são undefined', async () => {
      const invalidData = {
        farmId: undefined,
        cropId: undefined,
        harvestId: undefined,
      };

      const request = createMockRequest(invalidData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Dados inválidos');
      expect(data.issues).toBeDefined();
    });

    it('deve lidar com erro do banco de dados na criação', async () => {
      const error = new Error('Erro de conexão com o banco');
      (prisma.farmCrop.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.farmCrop.create as jest.Mock).mockRejectedValue(error);

      const request = createMockRequest(validData);
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
      (prisma.farmCrop.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.farmCrop.create as jest.Mock).mockRejectedValue('Erro desconhecido');

      const request = createMockRequest(validData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro desconhecido',
      });
    });

    it('deve lidar com erro do banco na verificação de existência', async () => {
      const error = new Error('Erro de conexão com o banco');
      (prisma.farmCrop.findFirst as jest.Mock).mockRejectedValue(error);

      const request = createMockRequest(validData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro de conexão com o banco',
      });
      expect(prisma.farmCrop.create).not.toHaveBeenCalled();
    });

    it('deve funcionar com diferentes dados válidos', async () => {
      const differentData = {
        farmId: '2',
        cropId: '3',
        harvestId: '4',
      };

      (prisma.farmCrop.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.farmCrop.create as jest.Mock).mockResolvedValue(mockFarmCrop);

      const request = createMockRequest(differentData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(prisma.farmCrop.findFirst).toHaveBeenCalledWith({
        where: {
          farmId: differentData.farmId,
          cropId: differentData.cropId,
          harvestId: differentData.harvestId,
        },
      });
      expect(prisma.farmCrop.create).toHaveBeenCalledWith({
        data: differentData,
        include: {
          farm: {
            include: {
              producer: true,
            },
          },
          crop: true,
          harvest: true,
        },
      });
    });

    it('deve incluir relacionamentos corretos na criação', async () => {
      (prisma.farmCrop.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.farmCrop.create as jest.Mock).mockResolvedValue(mockFarmCrop);

      const request = createMockRequest(validData);
      await POST(request);

      expect(prisma.farmCrop.create).toHaveBeenCalledWith({
        data: validData,
        include: {
          farm: {
            include: {
              producer: true,
            },
          },
          crop: true,
          harvest: true,
        },
      });
    });
  });

  describe('integração', () => {
    it('deve funcionar com múltiplas operações', async () => {
      const mockFarmCrops = [
        {
          id: '1',
          farmId: '1',
          cropId: '1',
          harvestId: '1',
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          farm: {
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
          },
          crop: {
            id: '1',
            name: 'Soja',
          },
          harvest: {
            id: '1',
            name: 'Safra 2021',
            year: 2021,
          },
        },
      ];

      const mockFarmCrop = mockFarmCrops[0];
      const validData = {
        farmId: '1',
        cropId: '1',
        harvestId: '1',
      };

      // GET
      (prisma.farmCrop.findMany as jest.Mock).mockResolvedValue(mockFarmCrops);
      const getResponse = await GET();
      expect(getResponse.status).toBe(200);

      // POST
      (prisma.farmCrop.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.farmCrop.create as jest.Mock).mockResolvedValue(mockFarmCrop);

      const postRequest = createMockRequest(validData);
      const postResponse = await POST(postRequest);
      expect(postResponse.status).toBe(200);

      expect(prisma.farmCrop.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.farmCrop.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.farmCrop.create).toHaveBeenCalledTimes(1);
    });

    it('deve manter consistência entre operações', async () => {
      const mockFarmCrops = [
        {
          id: '1',
          farmId: '1',
          cropId: '1',
          harvestId: '1',
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          farm: {
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
          },
          crop: {
            id: '1',
            name: 'Soja',
          },
          harvest: {
            id: '1',
            name: 'Safra 2021',
            year: 2021,
          },
        },
      ];

      const mockFarmCrop = mockFarmCrops[0];
      const validData = {
        farmId: '1',
        cropId: '1',
        harvestId: '1',
      };

      (prisma.farmCrop.findMany as jest.Mock).mockResolvedValue(mockFarmCrops);
      (prisma.farmCrop.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.farmCrop.create as jest.Mock).mockResolvedValue(mockFarmCrop);

      const getResponse = await GET();
      const getData = await getResponse.json();

      const postRequest = createMockRequest(validData);
      const postResponse = await POST(postRequest);
      const postData = await postResponse.json();

      expect(getData.success).toBe(true);
      expect(postData.success).toBe(true);
      expect(getData.count).toBe(1);
      expect(postData.data).toEqual(mockFarmCrop);
    });
  });
});
