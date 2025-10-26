import { NextRequest } from 'next/server';
import { GET, POST } from './route';
import { prisma } from '@/shared/lib/database/prisma';

// Mock do Prisma
jest.mock('@/shared/lib/database/prisma', () => ({
  prisma: {
    harvest: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock do NextRequest
const createMockRequest = (body: Record<string, unknown>, url = 'http://localhost:3000/api/harvests') =>
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

describe('API Route /api/harvests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/harvests', () => {
    it('deve retornar lista de safras com sucesso', async () => {
      const mockHarvests = [
        {
          id: '1',
          name: 'Safra 2023',
          year: 2023,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
        {
          id: '2',
          name: 'Safra 2022',
          year: 2022,
          createdAt: new Date('2022-01-01'),
          updatedAt: new Date('2022-01-01'),
        },
        {
          id: '3',
          name: 'Safra 2021',
          year: 2021,
          createdAt: new Date('2021-01-01'),
          updatedAt: new Date('2021-01-01'),
        },
      ];

      (prisma.harvest.findMany as jest.Mock).mockResolvedValue(mockHarvests);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: mockHarvests,
        count: 3,
      });
      expect(prisma.harvest.findMany).toHaveBeenCalledWith({
        orderBy: [
          {
            year: 'desc',
          },
          {
            name: 'asc',
          },
        ],
      });
    });

    it('deve retornar lista vazia quando não há safras', async () => {
      (prisma.harvest.findMany as jest.Mock).mockResolvedValue([]);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: [],
        count: 0,
      });
    });

    it('deve ordenar safras por ano decrescente e nome crescente', async () => {
      const mockHarvests = [
        {
          id: '3',
          name: 'Safra 2023',
          year: 2023,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
        {
          id: '2',
          name: 'Safra 2022',
          year: 2022,
          createdAt: new Date('2022-01-01'),
          updatedAt: new Date('2022-01-01'),
        },
        {
          id: '1',
          name: 'Safra 2021',
          year: 2021,
          createdAt: new Date('2021-01-01'),
          updatedAt: new Date('2021-01-01'),
        },
      ];

      (prisma.harvest.findMany as jest.Mock).mockResolvedValue(mockHarvests);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data[0].year).toBe(2023);
      expect(data.data[1].year).toBe(2022);
      expect(data.data[2].year).toBe(2021);
    });

    it('deve lidar com erro do banco de dados', async () => {
      const error = new Error('Erro de conexão com o banco');
      (prisma.harvest.findMany as jest.Mock).mockRejectedValue(error);

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
      (prisma.harvest.findMany as jest.Mock).mockRejectedValue('Erro desconhecido');

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
      const mockHarvests = [
        {
          id: '1',
          name: 'Safra 2023',
          year: 2023,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
      ];

      (prisma.harvest.findMany as jest.Mock).mockResolvedValue(mockHarvests);

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

  describe('POST /api/harvests', () => {
    it('deve criar safra com sucesso', async () => {
      const requestBody = {
        name: 'Safra 2024',
        year: 2024,
      };

      const mockCreatedHarvest = {
        id: '4',
        name: 'Safra 2024',
        year: 2024,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      (prisma.harvest.create as jest.Mock).mockResolvedValue(mockCreatedHarvest);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: mockCreatedHarvest,
      });
      expect(prisma.harvest.create).toHaveBeenCalledWith({
        data: {
          name: 'Safra 2024',
          year: 2024,
        },
      });
    });

    it('deve criar safra com dados válidos', async () => {
      const requestBody = {
        name: 'Safra de Soja 2024',
        year: 2024,
      };

      const mockCreatedHarvest = {
        id: '5',
        name: 'Safra de Soja 2024',
        year: 2024,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
      };

      (prisma.harvest.create as jest.Mock).mockResolvedValue(mockCreatedHarvest);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Safra de Soja 2024');
      expect(data.data.year).toBe(2024);
    });

    it('deve retornar erro de validação quando nome está vazio', async () => {
      const requestBody = {
        name: '',
        year: 2024,
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
        message: 'Nome da safra é obrigatório',
      });
    });

    it('deve retornar erro de validação quando nome é muito longo', async () => {
      const requestBody = {
        name: 'A'.repeat(101), // 101 caracteres
        year: 2024,
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

    it('deve retornar erro de validação quando ano é menor que 2000', async () => {
      const requestBody = {
        name: 'Safra 2024',
        year: 1999,
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
        path: ['year'],
        message: 'Ano deve ser maior que 2000',
      });
    });

    it('deve retornar erro de validação quando ano é maior que 2100', async () => {
      const requestBody = {
        name: 'Safra 2024',
        year: 2101,
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
        path: ['year'],
        message: 'Ano deve ser menor que 2100',
      });
    });

    it('deve retornar erro de validação quando nome está ausente', async () => {
      const requestBody = {
        year: 2024,
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

    it('deve retornar erro de validação quando ano está ausente', async () => {
      const requestBody = {
        name: 'Safra 2024',
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
        path: ['year'],
        message: 'Invalid input: expected number, received undefined',
      });
    });

    it('deve retornar erro de validação quando nome é null', async () => {
      const requestBody = {
        name: null,
        year: 2024,
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

    it('deve retornar erro de validação quando ano é null', async () => {
      const requestBody = {
        name: 'Safra 2024',
        year: null,
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
        path: ['year'],
        message: 'Invalid input: expected number, received null',
      });
    });

    it('deve retornar erro de validação quando nome não é string', async () => {
      const requestBody = {
        name: 123,
        year: 2024,
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

    it('deve retornar erro de validação quando ano não é número', async () => {
      const requestBody = {
        name: 'Safra 2024',
        year: '2024',
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
        path: ['year'],
        message: 'Invalid input: expected number, received string',
      });
    });

    it('deve aceitar nome com caracteres especiais', async () => {
      const requestBody = {
        name: 'Safra 2024 & Colheita',
        year: 2024,
      };

      const mockCreatedHarvest = {
        id: '6',
        name: 'Safra 2024 & Colheita',
        year: 2024,
        createdAt: new Date('2024-01-06'),
        updatedAt: new Date('2024-01-06'),
      };

      (prisma.harvest.create as jest.Mock).mockResolvedValue(mockCreatedHarvest);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Safra 2024 & Colheita');
    });

    it('deve aceitar nome com acentos', async () => {
      const requestBody = {
        name: 'Safra de Açaí',
        year: 2024,
      };

      const mockCreatedHarvest = {
        id: '7',
        name: 'Safra de Açaí',
        year: 2024,
        createdAt: new Date('2024-01-07'),
        updatedAt: new Date('2024-01-07'),
      };

      (prisma.harvest.create as jest.Mock).mockResolvedValue(mockCreatedHarvest);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Safra de Açaí');
    });

    it('deve aceitar nome com números', async () => {
      const requestBody = {
        name: 'Safra 2024',
        year: 2024,
      };

      const mockCreatedHarvest = {
        id: '8',
        name: 'Safra 2024',
        year: 2024,
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-08'),
      };

      (prisma.harvest.create as jest.Mock).mockResolvedValue(mockCreatedHarvest);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Safra 2024');
    });

    it('deve aceitar nome com espaços', async () => {
      const requestBody = {
        name: 'Safra de Soja e Milho',
        year: 2024,
      };

      const mockCreatedHarvest = {
        id: '9',
        name: 'Safra de Soja e Milho',
        year: 2024,
        createdAt: new Date('2024-01-09'),
        updatedAt: new Date('2024-01-09'),
      };

      (prisma.harvest.create as jest.Mock).mockResolvedValue(mockCreatedHarvest);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Safra de Soja e Milho');
    });

    it('deve aceitar nome com exatamente 100 caracteres', async () => {
      const requestBody = {
        name: 'A'.repeat(100), // Exatamente 100 caracteres
        year: 2024,
      };

      const mockCreatedHarvest = {
        id: '10',
        name: 'A'.repeat(100),
        year: 2024,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
      };

      (prisma.harvest.create as jest.Mock).mockResolvedValue(mockCreatedHarvest);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('A'.repeat(100));
    });

    it('deve aceitar ano com valor mínimo (2000)', async () => {
      const requestBody = {
        name: 'Safra 2000',
        year: 2000,
      };

      const mockCreatedHarvest = {
        id: '11',
        name: 'Safra 2000',
        year: 2000,
        createdAt: new Date('2000-01-01'),
        updatedAt: new Date('2000-01-01'),
      };

      (prisma.harvest.create as jest.Mock).mockResolvedValue(mockCreatedHarvest);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.year).toBe(2000);
    });

    it('deve aceitar ano com valor máximo (2100)', async () => {
      const requestBody = {
        name: 'Safra 2100',
        year: 2100,
      };

      const mockCreatedHarvest = {
        id: '12',
        name: 'Safra 2100',
        year: 2100,
        createdAt: new Date('2100-01-01'),
        updatedAt: new Date('2100-01-01'),
      };

      (prisma.harvest.create as jest.Mock).mockResolvedValue(mockCreatedHarvest);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.year).toBe(2100);
    });

    it('deve lidar com erro do banco de dados na criação', async () => {
      const requestBody = {
        name: 'Safra 2024',
        year: 2024,
      };

      const error = new Error('Erro de conexão com o banco');
      (prisma.harvest.create as jest.Mock).mockRejectedValue(error);

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
        name: 'Safra 2024',
        year: 2024,
      };

      (prisma.harvest.create as jest.Mock).mockRejectedValue('Erro desconhecido');

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
        name: 'Safra 2024',
        year: 2024,
      };

      const mockCreatedHarvest = {
        id: '13',
        name: 'Safra 2024',
        year: 2024,
        createdAt: new Date('2024-01-13'),
        updatedAt: new Date('2024-01-13'),
      };

      (prisma.harvest.create as jest.Mock).mockResolvedValue(mockCreatedHarvest);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('data');
      expect(typeof data.success).toBe('boolean');
      expect(data.data).toHaveProperty('id');
      expect(data.data).toHaveProperty('name');
      expect(data.data).toHaveProperty('year');
      expect(data.data).toHaveProperty('createdAt');
      expect(data.data).toHaveProperty('updatedAt');
    });

    it('deve validar tipos de dados corretos', async () => {
      const requestBody = {
        name: 'Safra 2024',
        year: 2024,
      };

      const mockCreatedHarvest = {
        id: '14',
        name: 'Safra 2024',
        year: 2024,
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-14'),
      };

      (prisma.harvest.create as jest.Mock).mockResolvedValue(mockCreatedHarvest);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(typeof data.data.id).toBe('string');
      expect(typeof data.data.name).toBe('string');
      expect(typeof data.data.year).toBe('number');
      expect(data.data.createdAt).toBeInstanceOf(Date);
      expect(data.data.updatedAt).toBeInstanceOf(Date);
    });

    it('deve criar safra com dados mínimos válidos', async () => {
      const requestBody = {
        name: 'A',
        year: 2000,
      };

      const mockCreatedHarvest = {
        id: '15',
        name: 'A',
        year: 2000,
        createdAt: new Date('2000-01-01'),
        updatedAt: new Date('2000-01-01'),
      };

      (prisma.harvest.create as jest.Mock).mockResolvedValue(mockCreatedHarvest);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('A');
      expect(data.data.year).toBe(2000);
    });

    it('deve lidar com múltiplos erros de validação', async () => {
      const requestBody = {
        name: '',
        year: 1999,
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
      expect(data.issues).toHaveLength(2);
    });

    it('deve criar safra com nome contendo hífen', async () => {
      const requestBody = {
        name: 'Safra-de-soja',
        year: 2024,
      };

      const mockCreatedHarvest = {
        id: '16',
        name: 'Safra-de-soja',
        year: 2024,
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-16'),
      };

      (prisma.harvest.create as jest.Mock).mockResolvedValue(mockCreatedHarvest);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Safra-de-soja');
    });

    it('deve criar safra com nome contendo parênteses', async () => {
      const requestBody = {
        name: 'Safra (Transgênica)',
        year: 2024,
      };

      const mockCreatedHarvest = {
        id: '17',
        name: 'Safra (Transgênica)',
        year: 2024,
        createdAt: new Date('2024-01-17'),
        updatedAt: new Date('2024-01-17'),
      };

      (prisma.harvest.create as jest.Mock).mockResolvedValue(mockCreatedHarvest);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Safra (Transgênica)');
    });
  });

  describe('Validação de Schema', () => {
    it('deve aceitar apenas campos válidos no schema', async () => {
      const requestBody = {
        name: 'Safra 2024',
        year: 2024,
        invalidField: 'should be ignored',
        anotherInvalidField: 123,
      };

      const mockCreatedHarvest = {
        id: '18',
        name: 'Safra 2024',
        year: 2024,
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-18'),
      };

      (prisma.harvest.create as jest.Mock).mockResolvedValue(mockCreatedHarvest);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Safra 2024');
      expect(data.data.year).toBe(2024);
      expect(prisma.harvest.create).toHaveBeenCalledWith({
        data: {
          name: 'Safra 2024',
          year: 2024,
        },
      });
    });

    it('deve rejeitar campos extras não definidos no schema', async () => {
      const requestBody = {
        name: 'Safra 2024',
        year: 2024,
        id: 'should-not-be-accepted',
        createdAt: new Date(),
      };

      const mockCreatedHarvest = {
        id: '19',
        name: 'Safra 2024',
        year: 2024,
        createdAt: new Date('2024-01-19'),
        updatedAt: new Date('2024-01-19'),
      };

      (prisma.harvest.create as jest.Mock).mockResolvedValue(mockCreatedHarvest);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Safra 2024');
      expect(data.data.year).toBe(2024);
      expect(prisma.harvest.create).toHaveBeenCalledWith({
        data: {
          name: 'Safra 2024',
          year: 2024,
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
        year: 2024,
      };

      const mockCreatedHarvest = {
        id: '20',
        name: '   ',
        year: 2024,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
      };

      (prisma.harvest.create as jest.Mock).mockResolvedValue(mockCreatedHarvest);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('   ');
    });

    it('deve lidar com nome contendo quebras de linha', async () => {
      const requestBody = {
        name: 'Safra\n2024',
        year: 2024,
      };

      const mockCreatedHarvest = {
        id: '21',
        name: 'Safra\n2024',
        year: 2024,
        createdAt: new Date('2024-01-21'),
        updatedAt: new Date('2024-01-21'),
      };

      (prisma.harvest.create as jest.Mock).mockResolvedValue(mockCreatedHarvest);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Safra\n2024');
    });

    it('deve lidar com nome contendo tabs', async () => {
      const requestBody = {
        name: 'Safra\t2024',
        year: 2024,
      };

      const mockCreatedHarvest = {
        id: '22',
        name: 'Safra\t2024',
        year: 2024,
        createdAt: new Date('2024-01-22'),
        updatedAt: new Date('2024-01-22'),
      };

      (prisma.harvest.create as jest.Mock).mockResolvedValue(mockCreatedHarvest);

      const request = createMockRequest(requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Safra\t2024');
    });

    it('deve lidar com ano decimal', async () => {
      const requestBody = {
        name: 'Safra 2024',
        year: 2024.5,
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
        path: ['year'],
        message: 'Invalid input: expected int, received number',
      });
    });

    it('deve lidar com ano negativo', async () => {
      const requestBody = {
        name: 'Safra 2024',
        year: -2024,
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
        path: ['year'],
        message: 'Ano deve ser maior que 2000',
      });
    });
  });
});
