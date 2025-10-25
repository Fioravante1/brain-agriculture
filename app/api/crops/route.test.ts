import { NextRequest } from 'next/server';
import { GET, POST } from './route';
import { prisma } from '@/shared/lib/database/prisma';

// Mock do Prisma
jest.mock('@/shared/lib/database/prisma', () => ({
  prisma: {
    crop: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock do NextRequest
const createMockRequest = (body: Record<string, unknown>, url = 'http://localhost:3000/api/crops') =>
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

describe('API Route /api/crops', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/crops', () => {
    it('deve retornar lista de culturas com sucesso', async () => {
      const mockCrops = [
        {
          id: '1',
          name: 'Soja',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: '2',
          name: 'Milho',
          createdAt: new Date('2024-01-02'),
          updatedAt: new Date('2024-01-02'),
        },
        {
          id: '3',
          name: 'Algodão',
          createdAt: new Date('2024-01-03'),
          updatedAt: new Date('2024-01-03'),
        },
      ];

      (prisma.crop.findMany as jest.Mock).mockResolvedValue(mockCrops);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: mockCrops,
        count: 3,
      });
      expect(prisma.crop.findMany).toHaveBeenCalledWith({
        orderBy: {
          name: 'asc',
        },
      });
    });

    it('deve retornar lista vazia quando não há culturas', async () => {
      (prisma.crop.findMany as jest.Mock).mockResolvedValue([]);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: [],
        count: 0,
      });
    });

    it('deve ordenar culturas por nome em ordem alfabética', async () => {
      const mockCrops = [
        {
          id: '3',
          name: 'Algodão',
          createdAt: new Date('2024-01-03'),
          updatedAt: new Date('2024-01-03'),
        },
        {
          id: '2',
          name: 'Milho',
          createdAt: new Date('2024-01-02'),
          updatedAt: new Date('2024-01-02'),
        },
        {
          id: '1',
          name: 'Soja',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ];

      (prisma.crop.findMany as jest.Mock).mockResolvedValue(mockCrops);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data[0].name).toBe('Algodão');
      expect(data.data[1].name).toBe('Milho');
      expect(data.data[2].name).toBe('Soja');
    });

    it('deve lidar com erro do banco de dados', async () => {
      const error = new Error('Erro de conexão com o banco');
      (prisma.crop.findMany as jest.Mock).mockRejectedValue(error);

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
      (prisma.crop.findMany as jest.Mock).mockRejectedValue('Erro desconhecido');

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro desconhecido',
      });
    });

    it('deve retornar estrutura de dados correta', async () => {
      const mockCrops = [
        {
          id: '1',
          name: 'Soja',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ];

      (prisma.crop.findMany as jest.Mock).mockResolvedValue(mockCrops);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('count');
      expect(typeof data.success).toBe('boolean');
      expect(Array.isArray(data.data)).toBe(true);
      expect(typeof data.count).toBe('number');
    });
  });

  describe('POST /api/crops', () => {
    it('deve criar cultura com sucesso', async () => {
      const requestBody = {
        name: 'Café',
      };

      const mockCreatedCrop = {
        id: '4',
        name: 'Café',
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04'),
      };

      (prisma.crop.create as jest.Mock).mockResolvedValue(mockCreatedCrop);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: mockCreatedCrop,
      });
      expect(prisma.crop.create).toHaveBeenCalledWith({
        data: {
          name: 'Café',
        },
      });
    });

    it('deve criar cultura com nome válido', async () => {
      const requestBody = {
        name: 'Cana de Açúcar',
      };

      const mockCreatedCrop = {
        id: '5',
        name: 'Cana de Açúcar',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
      };

      (prisma.crop.create as jest.Mock).mockResolvedValue(mockCreatedCrop);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Cana de Açúcar');
    });

    it('deve retornar erro de validação quando nome está vazio', async () => {
      const requestBody = {
        name: '',
      };

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        success: false,
        error: 'Dados inválidos',
        issues: expect.any(Array),
      });
      expect(data.issues).toHaveLength(1);
      expect(data.issues[0]).toMatchObject({
        path: ['name'],
        message: 'Nome da cultura é obrigatório',
      });
    });

    it('deve retornar erro de validação quando nome é muito longo', async () => {
      const requestBody = {
        name: 'A'.repeat(101), // 101 caracteres
      };

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        success: false,
        error: 'Dados inválidos',
        issues: expect.any(Array),
      });
      expect(data.issues).toHaveLength(1);
      expect(data.issues[0]).toMatchObject({
        path: ['name'],
        message: 'Nome muito longo',
      });
    });

    it('deve retornar erro de validação quando nome está ausente', async () => {
      const requestBody = {};

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        success: false,
        error: 'Dados inválidos',
        issues: expect.any(Array),
      });
      expect(data.issues).toHaveLength(1);
      expect(data.issues[0]).toMatchObject({
        path: ['name'],
        message: 'Invalid input: expected string, received undefined',
      });
    });

    it('deve retornar erro de validação quando nome é null', async () => {
      const requestBody = {
        name: null,
      };

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        success: false,
        error: 'Dados inválidos',
        issues: expect.any(Array),
      });
      expect(data.issues).toHaveLength(1);
      expect(data.issues[0]).toMatchObject({
        path: ['name'],
        message: 'Invalid input: expected string, received null',
      });
    });

    it('deve retornar erro de validação quando nome é undefined', async () => {
      const requestBody = {
        name: undefined,
      };

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        success: false,
        error: 'Dados inválidos',
        issues: expect.any(Array),
      });
      expect(data.issues).toHaveLength(1);
      expect(data.issues[0]).toMatchObject({
        path: ['name'],
        message: 'Invalid input: expected string, received undefined',
      });
    });

    it('deve retornar erro de validação quando nome não é string', async () => {
      const requestBody = {
        name: 123,
      };

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        success: false,
        error: 'Dados inválidos',
        issues: expect.any(Array),
      });
      expect(data.issues).toHaveLength(1);
      expect(data.issues[0]).toMatchObject({
        path: ['name'],
        message: 'Invalid input: expected string, received number',
      });
    });

    it('deve aceitar nome com caracteres especiais', async () => {
      const requestBody = {
        name: 'Café & Chá',
      };

      const mockCreatedCrop = {
        id: '6',
        name: 'Café & Chá',
        createdAt: new Date('2024-01-06'),
        updatedAt: new Date('2024-01-06'),
      };

      (prisma.crop.create as jest.Mock).mockResolvedValue(mockCreatedCrop);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Café & Chá');
    });

    it('deve aceitar nome com acentos', async () => {
      const requestBody = {
        name: 'Açaí',
      };

      const mockCreatedCrop = {
        id: '7',
        name: 'Açaí',
        createdAt: new Date('2024-01-07'),
        updatedAt: new Date('2024-01-07'),
      };

      (prisma.crop.create as jest.Mock).mockResolvedValue(mockCreatedCrop);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Açaí');
    });

    it('deve aceitar nome com números', async () => {
      const requestBody = {
        name: 'Cultura 2024',
      };

      const mockCreatedCrop = {
        id: '8',
        name: 'Cultura 2024',
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-08'),
      };

      (prisma.crop.create as jest.Mock).mockResolvedValue(mockCreatedCrop);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Cultura 2024');
    });

    it('deve aceitar nome com espaços', async () => {
      const requestBody = {
        name: 'Cana de Açúcar para Etanol',
      };

      const mockCreatedCrop = {
        id: '9',
        name: 'Cana de Açúcar para Etanol',
        createdAt: new Date('2024-01-09'),
        updatedAt: new Date('2024-01-09'),
      };

      (prisma.crop.create as jest.Mock).mockResolvedValue(mockCreatedCrop);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Cana de Açúcar para Etanol');
    });

    it('deve aceitar nome com exatamente 100 caracteres', async () => {
      const requestBody = {
        name: 'A'.repeat(100), // Exatamente 100 caracteres
      };

      const mockCreatedCrop = {
        id: '10',
        name: 'A'.repeat(100),
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
      };

      (prisma.crop.create as jest.Mock).mockResolvedValue(mockCreatedCrop);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('A'.repeat(100));
    });

    it('deve lidar com erro do banco de dados na criação', async () => {
      const requestBody = {
        name: 'Café',
      };

      const error = new Error('Erro de conexão com o banco');
      (prisma.crop.create as jest.Mock).mockRejectedValue(error);

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
        name: 'Café',
      };

      (prisma.crop.create as jest.Mock).mockRejectedValue('Erro desconhecido');

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

    it('deve retornar estrutura de dados correta na criação', async () => {
      const requestBody = {
        name: 'Café',
      };

      const mockCreatedCrop = {
        id: '11',
        name: 'Café',
        createdAt: new Date('2024-01-11'),
        updatedAt: new Date('2024-01-11'),
      };

      (prisma.crop.create as jest.Mock).mockResolvedValue(mockCreatedCrop);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('data');
      expect(typeof data.success).toBe('boolean');
      expect(data.data).toHaveProperty('id');
      expect(data.data).toHaveProperty('name');
      expect(data.data).toHaveProperty('createdAt');
      expect(data.data).toHaveProperty('updatedAt');
    });

    it('deve validar tipos de dados corretos', async () => {
      const requestBody = {
        name: 'Café',
      };

      const mockCreatedCrop = {
        id: '12',
        name: 'Café',
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12'),
      };

      (prisma.crop.create as jest.Mock).mockResolvedValue(mockCreatedCrop);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(typeof data.data.id).toBe('string');
      expect(typeof data.data.name).toBe('string');
      expect(data.data.createdAt).toBeInstanceOf(Date);
      expect(data.data.updatedAt).toBeInstanceOf(Date);
    });

    it('deve criar cultura com dados mínimos válidos', async () => {
      const requestBody = {
        name: 'A',
      };

      const mockCreatedCrop = {
        id: '13',
        name: 'A',
        createdAt: new Date('2024-01-13'),
        updatedAt: new Date('2024-01-13'),
      };

      (prisma.crop.create as jest.Mock).mockResolvedValue(mockCreatedCrop);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('A');
    });

    it('deve lidar com múltiplos erros de validação', async () => {
      const requestBody = {
        name: '',
        invalidField: 'test',
      };

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        success: false,
        error: 'Dados inválidos',
        issues: expect.any(Array),
      });
      expect(data.issues).toHaveLength(1); // Apenas o campo name é validado
    });

    it('deve criar cultura com nome contendo hífen', async () => {
      const requestBody = {
        name: 'Cana-de-açúcar',
      };

      const mockCreatedCrop = {
        id: '14',
        name: 'Cana-de-açúcar',
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-14'),
      };

      (prisma.crop.create as jest.Mock).mockResolvedValue(mockCreatedCrop);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Cana-de-açúcar');
    });

    it('deve criar cultura com nome contendo parênteses', async () => {
      const requestBody = {
        name: 'Soja (Transgênica)',
      };

      const mockCreatedCrop = {
        id: '15',
        name: 'Soja (Transgênica)',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      };

      (prisma.crop.create as jest.Mock).mockResolvedValue(mockCreatedCrop);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Soja (Transgênica)');
    });
  });

  describe('Validação de Schema', () => {
    it('deve aceitar apenas campos válidos no schema', async () => {
      const requestBody = {
        name: 'Café',
        invalidField: 'should be ignored',
        anotherInvalidField: 123,
      };

      const mockCreatedCrop = {
        id: '16',
        name: 'Café',
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-16'),
      };

      (prisma.crop.create as jest.Mock).mockResolvedValue(mockCreatedCrop);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Café');
      expect(prisma.crop.create).toHaveBeenCalledWith({
        data: {
          name: 'Café',
        },
      });
    });

    it('deve rejeitar campos extras não definidos no schema', async () => {
      const requestBody = {
        name: 'Café',
        id: 'should-not-be-accepted',
        createdAt: new Date(),
      };

      const mockCreatedCrop = {
        id: '17',
        name: 'Café',
        createdAt: new Date('2024-01-17'),
        updatedAt: new Date('2024-01-17'),
      };

      (prisma.crop.create as jest.Mock).mockResolvedValue(mockCreatedCrop);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Café');
      expect(prisma.crop.create).toHaveBeenCalledWith({
        data: {
          name: 'Café',
        },
      });
    });
  });

  describe('Cenários de Edge Cases', () => {
    it('deve lidar com request body vazio', async () => {
      const requestBody = {};

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        success: false,
        error: 'Dados inválidos',
        issues: expect.any(Array),
      });
    });

    it('deve lidar com request body null', async () => {
      const requestBody = null as unknown as Record<string, unknown>;

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        success: false,
        error: 'Dados inválidos',
        issues: expect.any(Array),
      });
    });

    it('deve lidar com request body undefined', async () => {
      const requestBody = undefined as unknown as Record<string, unknown>;

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        success: false,
        error: 'Dados inválidos',
        issues: expect.any(Array),
      });
    });

    it('deve lidar com nome contendo apenas espaços', async () => {
      const requestBody = {
        name: '   ',
      };

      const mockCreatedCrop = {
        id: '20',
        name: '   ',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
      };

      (prisma.crop.create as jest.Mock).mockResolvedValue(mockCreatedCrop);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('   ');
    });

    it('deve lidar com nome contendo quebras de linha', async () => {
      const requestBody = {
        name: 'Café\nChá',
      };

      const mockCreatedCrop = {
        id: '18',
        name: 'Café\nChá',
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-18'),
      };

      (prisma.crop.create as jest.Mock).mockResolvedValue(mockCreatedCrop);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Café\nChá');
    });

    it('deve lidar com nome contendo tabs', async () => {
      const requestBody = {
        name: 'Café\tChá',
      };

      const mockCreatedCrop = {
        id: '19',
        name: 'Café\tChá',
        createdAt: new Date('2024-01-19'),
        updatedAt: new Date('2024-01-19'),
      };

      (prisma.crop.create as jest.Mock).mockResolvedValue(mockCreatedCrop);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Café\tChá');
    });
  });
});
