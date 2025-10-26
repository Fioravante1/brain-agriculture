import { NextRequest } from 'next/server';
import { GET, PUT, DELETE } from './route';
import { prisma } from '@/shared/lib/database/prisma';

// Mock do Prisma
jest.mock('@/shared/lib/database/prisma', () => ({
  prisma: {
    harvest: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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

describe('API Route /api/harvests/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/harvests/[id]', () => {
    it('deve retornar safra por ID com sucesso', async () => {
      const mockHarvest = {
        id: '1',
        name: 'Safra 2023',
        year: 2023,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      };

      (prisma.harvest.findUnique as jest.Mock).mockResolvedValue(mockHarvest);

      const params = Promise.resolve({ id: '1' });
      const response = await GET({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: mockHarvest,
      });
      expect(prisma.harvest.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('deve retornar erro 404 quando safra não é encontrada', async () => {
      (prisma.harvest.findUnique as jest.Mock).mockResolvedValue(null);

      const params = Promise.resolve({ id: '999' });
      const response = await GET({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({
        success: false,
        error: 'Safra não encontrada',
        message: 'Nenhuma safra encontrada com este ID',
      });
    });

    it('deve lidar com erro do banco de dados', async () => {
      const error = new Error('Erro de conexão com o banco');
      (prisma.harvest.findUnique as jest.Mock).mockRejectedValue(error);

      const params = Promise.resolve({ id: '1' });
      const response = await GET({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro de conexão com o banco',
      });
    });

    it('deve lidar com erro desconhecido', async () => {
      (prisma.harvest.findUnique as jest.Mock).mockRejectedValue('Erro desconhecido');

      const params = Promise.resolve({ id: '1' });
      const response = await GET({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro desconhecido',
      });
    });

    it('deve retornar estrutura de dados correta', async () => {
      const mockHarvest = {
        id: '1',
        name: 'Safra 2023',
        year: 2023,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      };

      (prisma.harvest.findUnique as jest.Mock).mockResolvedValue(mockHarvest);

      const params = Promise.resolve({ id: '1' });
      const response = await GET({} as NextRequest, { params });
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
      const mockHarvest = {
        id: '1',
        name: 'Safra 2023',
        year: 2023,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      };

      (prisma.harvest.findUnique as jest.Mock).mockResolvedValue(mockHarvest);

      const params = Promise.resolve({ id: '1' });
      const response = await GET({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(typeof data.data.id).toBe('string');
      expect(typeof data.data.name).toBe('string');
      expect(typeof data.data.year).toBe('number');
      expect(data.data.createdAt).toBeInstanceOf(Date);
      expect(data.data.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('PUT /api/harvests/[id]', () => {
    it('deve atualizar safra com sucesso', async () => {
      const requestBody = {
        name: 'Safra 2023 Atualizada',
        year: 2023,
      };

      const updatedHarvest = {
        id: '1',
        name: 'Safra 2023 Atualizada',
        year: 2023,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      };

      (prisma.harvest.update as jest.Mock).mockResolvedValue(updatedHarvest);

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: updatedHarvest,
      });
      expect(prisma.harvest.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          name: 'Safra 2023 Atualizada',
          year: 2023,
        },
      });
    });

    it('deve atualizar safra com dados válidos', async () => {
      const requestBody = {
        name: 'Safra de Soja 2024',
        year: 2024,
      };

      const updatedHarvest = {
        id: '2',
        name: 'Safra de Soja 2024',
        year: 2024,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-03'),
      };

      (prisma.harvest.update as jest.Mock).mockResolvedValue(updatedHarvest);

      const params = Promise.resolve({ id: '2' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
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

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
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

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
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

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
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

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
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

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
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

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
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

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
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

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
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

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
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

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
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

      const updatedHarvest = {
        id: '3',
        name: 'Safra 2024 & Colheita',
        year: 2024,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-04'),
      };

      (prisma.harvest.update as jest.Mock).mockResolvedValue(updatedHarvest);

      const params = Promise.resolve({ id: '3' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Safra 2024 & Colheita');
    });

    it('deve aceitar nome com acentos', async () => {
      const requestBody = {
        name: 'Safra de Açaí',
        year: 2024,
      };

      const updatedHarvest = {
        id: '4',
        name: 'Safra de Açaí',
        year: 2024,
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-05'),
      };

      (prisma.harvest.update as jest.Mock).mockResolvedValue(updatedHarvest);

      const params = Promise.resolve({ id: '4' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Safra de Açaí');
    });

    it('deve aceitar nome com números', async () => {
      const requestBody = {
        name: 'Safra 2024',
        year: 2024,
      };

      const updatedHarvest = {
        id: '5',
        name: 'Safra 2024',
        year: 2024,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-06'),
      };

      (prisma.harvest.update as jest.Mock).mockResolvedValue(updatedHarvest);

      const params = Promise.resolve({ id: '5' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Safra 2024');
    });

    it('deve aceitar nome com espaços', async () => {
      const requestBody = {
        name: 'Safra de Soja e Milho',
        year: 2024,
      };

      const updatedHarvest = {
        id: '6',
        name: 'Safra de Soja e Milho',
        year: 2024,
        createdAt: new Date('2024-01-06'),
        updatedAt: new Date('2024-01-07'),
      };

      (prisma.harvest.update as jest.Mock).mockResolvedValue(updatedHarvest);

      const params = Promise.resolve({ id: '6' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Safra de Soja e Milho');
    });

    it('deve aceitar nome com exatamente 100 caracteres', async () => {
      const requestBody = {
        name: 'A'.repeat(100), // Exatamente 100 caracteres
        year: 2024,
      };

      const updatedHarvest = {
        id: '7',
        name: 'A'.repeat(100),
        year: 2024,
        createdAt: new Date('2024-01-07'),
        updatedAt: new Date('2024-01-08'),
      };

      (prisma.harvest.update as jest.Mock).mockResolvedValue(updatedHarvest);

      const params = Promise.resolve({ id: '7' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('A'.repeat(100));
    });

    it('deve aceitar ano com valor mínimo (2000)', async () => {
      const requestBody = {
        name: 'Safra 2000',
        year: 2000,
      };

      const updatedHarvest = {
        id: '8',
        name: 'Safra 2000',
        year: 2000,
        createdAt: new Date('2000-01-01'),
        updatedAt: new Date('2000-01-02'),
      };

      (prisma.harvest.update as jest.Mock).mockResolvedValue(updatedHarvest);

      const params = Promise.resolve({ id: '8' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.year).toBe(2000);
    });

    it('deve aceitar ano com valor máximo (2100)', async () => {
      const requestBody = {
        name: 'Safra 2100',
        year: 2100,
      };

      const updatedHarvest = {
        id: '9',
        name: 'Safra 2100',
        year: 2100,
        createdAt: new Date('2100-01-01'),
        updatedAt: new Date('2100-01-02'),
      };

      (prisma.harvest.update as jest.Mock).mockResolvedValue(updatedHarvest);

      const params = Promise.resolve({ id: '9' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.year).toBe(2100);
    });

    it('deve lidar com erro do banco de dados na atualização', async () => {
      const requestBody = {
        name: 'Safra 2024',
        year: 2024,
      };

      const error = new Error('Erro de conexão com o banco');
      (prisma.harvest.update as jest.Mock).mockRejectedValue(error);

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro de conexão com o banco',
      });
    });

    it('deve lidar com erro desconhecido na atualização', async () => {
      const requestBody = {
        name: 'Safra 2024',
        year: 2024,
      };

      (prisma.harvest.update as jest.Mock).mockRejectedValue('Erro desconhecido');

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro desconhecido',
      });
    });

    it('deve retornar estrutura de dados correta na atualização', async () => {
      const requestBody = {
        name: 'Safra 2024',
        year: 2024,
      };

      const updatedHarvest = {
        id: '10',
        name: 'Safra 2024',
        year: 2024,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-11'),
      };

      (prisma.harvest.update as jest.Mock).mockResolvedValue(updatedHarvest);

      const params = Promise.resolve({ id: '10' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
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

    it('deve validar tipos de dados corretos na atualização', async () => {
      const requestBody = {
        name: 'Safra 2024',
        year: 2024,
      };

      const updatedHarvest = {
        id: '11',
        name: 'Safra 2024',
        year: 2024,
        createdAt: new Date('2024-01-11'),
        updatedAt: new Date('2024-01-12'),
      };

      (prisma.harvest.update as jest.Mock).mockResolvedValue(updatedHarvest);

      const params = Promise.resolve({ id: '11' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(typeof data.data.id).toBe('string');
      expect(typeof data.data.name).toBe('string');
      expect(typeof data.data.year).toBe('number');
      expect(data.data.createdAt).toBeInstanceOf(Date);
      expect(data.data.updatedAt).toBeInstanceOf(Date);
    });

    it('deve atualizar safra com dados mínimos válidos', async () => {
      const requestBody = {
        name: 'A',
        year: 2000,
      };

      const updatedHarvest = {
        id: '12',
        name: 'A',
        year: 2000,
        createdAt: new Date('2000-01-01'),
        updatedAt: new Date('2000-01-02'),
      };

      (prisma.harvest.update as jest.Mock).mockResolvedValue(updatedHarvest);

      const params = Promise.resolve({ id: '12' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
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

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        success: false,
        error: 'Dados inválidos',
        issues: expect.any(Array),
      });
      expect(data.issues).toHaveLength(2);
    });

    it('deve atualizar safra com nome contendo hífen', async () => {
      const requestBody = {
        name: 'Safra-de-soja',
        year: 2024,
      };

      const updatedHarvest = {
        id: '13',
        name: 'Safra-de-soja',
        year: 2024,
        createdAt: new Date('2024-01-13'),
        updatedAt: new Date('2024-01-14'),
      };

      (prisma.harvest.update as jest.Mock).mockResolvedValue(updatedHarvest);

      const params = Promise.resolve({ id: '13' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Safra-de-soja');
    });

    it('deve atualizar safra com nome contendo parênteses', async () => {
      const requestBody = {
        name: 'Safra (Transgênica)',
        year: 2024,
      };

      const updatedHarvest = {
        id: '14',
        name: 'Safra (Transgênica)',
        year: 2024,
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-15'),
      };

      (prisma.harvest.update as jest.Mock).mockResolvedValue(updatedHarvest);

      const params = Promise.resolve({ id: '14' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Safra (Transgênica)');
    });
  });

  describe('DELETE /api/harvests/[id]', () => {
    it('deve deletar safra com sucesso', async () => {
      (prisma.harvest.delete as jest.Mock).mockResolvedValue(undefined);

      const params = Promise.resolve({ id: '1' });
      const response = await DELETE({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        message: 'Safra deletada com sucesso',
      });
      expect(prisma.harvest.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('deve deletar safra existente', async () => {
      (prisma.harvest.delete as jest.Mock).mockResolvedValue(undefined);

      const params = Promise.resolve({ id: '2' });
      const response = await DELETE({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Safra deletada com sucesso');
    });

    it('deve lidar com erro do banco de dados na exclusão', async () => {
      const error = new Error('Erro de conexão com o banco');
      (prisma.harvest.delete as jest.Mock).mockRejectedValue(error);

      const params = Promise.resolve({ id: '1' });
      const response = await DELETE({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro de conexão com o banco',
      });
    });

    it('deve lidar com erro desconhecido na exclusão', async () => {
      (prisma.harvest.delete as jest.Mock).mockRejectedValue('Erro desconhecido');

      const params = Promise.resolve({ id: '1' });
      const response = await DELETE({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro desconhecido',
      });
    });

    it('deve retornar estrutura de dados correta na exclusão', async () => {
      (prisma.harvest.delete as jest.Mock).mockResolvedValue(undefined);

      const params = Promise.resolve({ id: '3' });
      const response = await DELETE({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('message');
      expect(typeof data.success).toBe('boolean');
      expect(typeof data.message).toBe('string');
    });

    it('deve deletar safra com ID válido', async () => {
      (prisma.harvest.delete as jest.Mock).mockResolvedValue(undefined);

      const params = Promise.resolve({ id: '4' });
      const response = await DELETE({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(prisma.harvest.delete).toHaveBeenCalledWith({
        where: { id: '4' },
      });
    });

    it('deve lidar com erro de constraint de chave estrangeira', async () => {
      const error = new Error('Foreign key constraint failed');
      (prisma.harvest.delete as jest.Mock).mockRejectedValue(error);

      const params = Promise.resolve({ id: '5' });
      const response = await DELETE({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Foreign key constraint failed',
      });
    });

    it('deve lidar com erro de registro não encontrado', async () => {
      const error = new Error('Record to delete does not exist');
      (prisma.harvest.delete as jest.Mock).mockRejectedValue(error);

      const params = Promise.resolve({ id: '999' });
      const response = await DELETE({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Record to delete does not exist',
      });
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

      const updatedHarvest = {
        id: '15',
        name: 'Safra 2024',
        year: 2024,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-16'),
      };

      (prisma.harvest.update as jest.Mock).mockResolvedValue(updatedHarvest);

      const params = Promise.resolve({ id: '15' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Safra 2024');
      expect(data.data.year).toBe(2024);
      expect(prisma.harvest.update).toHaveBeenCalledWith({
        where: { id: '15' },
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

      const updatedHarvest = {
        id: '16',
        name: 'Safra 2024',
        year: 2024,
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-17'),
      };

      (prisma.harvest.update as jest.Mock).mockResolvedValue(updatedHarvest);

      const params = Promise.resolve({ id: '16' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Safra 2024');
      expect(data.data.year).toBe(2024);
      expect(prisma.harvest.update).toHaveBeenCalledWith({
        where: { id: '16' },
        data: {
          name: 'Safra 2024',
          year: 2024,
        },
      });
    });
  });

  describe('Cenários de Edge Cases', () => {
    it('deve lidar com request body vazio no PUT', async () => {
      const requestBody = {};

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        success: false,
        error: 'Dados inválidos',
        issues: expect.any(Array),
      });
    });

    it('deve lidar com request body null no PUT', async () => {
      const requestBody = null as unknown as Record<string, unknown>;

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        success: false,
        error: 'Dados inválidos',
        issues: expect.any(Array),
      });
    });

    it('deve lidar com request body undefined no PUT', async () => {
      const requestBody = undefined as unknown as Record<string, unknown>;

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        success: false,
        error: 'Dados inválidos',
        issues: expect.any(Array),
      });
    });

    it('deve lidar com nome contendo apenas espaços no PUT', async () => {
      const requestBody = {
        name: '   ',
        year: 2024,
      };

      const updatedHarvest = {
        id: '17',
        name: '   ',
        year: 2024,
        createdAt: new Date('2024-01-17'),
        updatedAt: new Date('2024-01-18'),
      };

      (prisma.harvest.update as jest.Mock).mockResolvedValue(updatedHarvest);

      const params = Promise.resolve({ id: '17' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('   ');
    });

    it('deve lidar com nome contendo quebras de linha no PUT', async () => {
      const requestBody = {
        name: 'Safra\n2024',
        year: 2024,
      };

      const updatedHarvest = {
        id: '18',
        name: 'Safra\n2024',
        year: 2024,
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-19'),
      };

      (prisma.harvest.update as jest.Mock).mockResolvedValue(updatedHarvest);

      const params = Promise.resolve({ id: '18' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Safra\n2024');
    });

    it('deve lidar com nome contendo tabs no PUT', async () => {
      const requestBody = {
        name: 'Safra\t2024',
        year: 2024,
      };

      const updatedHarvest = {
        id: '19',
        name: 'Safra\t2024',
        year: 2024,
        createdAt: new Date('2024-01-19'),
        updatedAt: new Date('2024-01-20'),
      };

      (prisma.harvest.update as jest.Mock).mockResolvedValue(updatedHarvest);

      const params = Promise.resolve({ id: '19' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Safra\t2024');
    });

    it('deve lidar com ano decimal no PUT', async () => {
      const requestBody = {
        name: 'Safra 2024',
        year: 2024.5,
      };

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
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

    it('deve lidar com ano negativo no PUT', async () => {
      const requestBody = {
        name: 'Safra 2024',
        year: -2024,
      };

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
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

    it('deve lidar com ID inválido no GET', async () => {
      (prisma.harvest.findUnique as jest.Mock).mockResolvedValue(null);

      const params = Promise.resolve({ id: 'invalid-id' });
      const response = await GET({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({
        success: false,
        error: 'Safra não encontrada',
        message: 'Nenhuma safra encontrada com este ID',
      });
    });

    it('deve lidar com ID vazio no GET', async () => {
      (prisma.harvest.findUnique as jest.Mock).mockResolvedValue(null);

      const params = Promise.resolve({ id: '' });
      const response = await GET({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({
        success: false,
        error: 'Safra não encontrada',
        message: 'Nenhuma safra encontrada com este ID',
      });
    });

    it('deve lidar com ID vazio no PUT', async () => {
      const requestBody = {
        name: 'Safra 2024',
        year: 2024,
      };

      (prisma.harvest.update as jest.Mock).mockResolvedValue(undefined);

      const params = Promise.resolve({ id: '' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('deve lidar com ID vazio no DELETE', async () => {
      (prisma.harvest.delete as jest.Mock).mockResolvedValue(undefined);

      const params = Promise.resolve({ id: '' });
      const response = await DELETE({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });
});
