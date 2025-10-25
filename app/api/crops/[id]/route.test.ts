import { NextRequest } from 'next/server';
import { GET, PUT, DELETE } from './route';
import { prisma } from '@/shared/lib/database/prisma';

// Mock do Prisma
jest.mock('@/shared/lib/database/prisma', () => ({
  prisma: {
    crop: {
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

describe('API Route /api/crops/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/crops/[id]', () => {
    it('deve retornar cultura por ID com sucesso', async () => {
      const mockCrop = {
        id: '1',
        name: 'Soja',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      (prisma.crop.findUnique as jest.Mock).mockResolvedValue(mockCrop);

      const params = Promise.resolve({ id: '1' });
      const response = await GET({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: mockCrop,
      });
      expect(prisma.crop.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('deve retornar erro 404 quando cultura não é encontrada', async () => {
      (prisma.crop.findUnique as jest.Mock).mockResolvedValue(null);

      const params = Promise.resolve({ id: '999' });
      const response = await GET({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({
        success: false,
        error: 'Cultura não encontrada',
        message: 'Nenhuma cultura encontrada com este ID',
      });
    });

    it('deve lidar com erro do banco de dados', async () => {
      const error = new Error('Erro de conexão com o banco');
      (prisma.crop.findUnique as jest.Mock).mockRejectedValue(error);

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
      (prisma.crop.findUnique as jest.Mock).mockRejectedValue('Erro desconhecido');

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
      const mockCrop = {
        id: '1',
        name: 'Soja',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      (prisma.crop.findUnique as jest.Mock).mockResolvedValue(mockCrop);

      const params = Promise.resolve({ id: '1' });
      const response = await GET({} as NextRequest, { params });
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
      const mockCrop = {
        id: '1',
        name: 'Soja',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      (prisma.crop.findUnique as jest.Mock).mockResolvedValue(mockCrop);

      const params = Promise.resolve({ id: '1' });
      const response = await GET({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(typeof data.data.id).toBe('string');
      expect(typeof data.data.name).toBe('string');
      expect(data.data.createdAt).toBeInstanceOf(Date);
      expect(data.data.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('PUT /api/crops/[id]', () => {
    it('deve atualizar cultura com sucesso', async () => {
      const requestBody = {
        name: 'Soja Transgênica',
      };

      const updatedCrop = {
        id: '1',
        name: 'Soja Transgênica',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };

      (prisma.crop.update as jest.Mock).mockResolvedValue(updatedCrop);

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: updatedCrop,
      });
      expect(prisma.crop.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          name: 'Soja Transgênica',
        },
      });
    });

    it('deve atualizar cultura com nome válido', async () => {
      const requestBody = {
        name: 'Café Especial',
      };

      const updatedCrop = {
        id: '2',
        name: 'Café Especial',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-03'),
      };

      (prisma.crop.update as jest.Mock).mockResolvedValue(updatedCrop);

      const params = Promise.resolve({ id: '2' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Café Especial');
    });

    it('deve retornar erro de validação quando nome está vazio', async () => {
      const requestBody = {
        name: '',
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
        message: 'Nome da cultura é obrigatório',
      });
    });

    it('deve retornar erro de validação quando nome é muito longo', async () => {
      const requestBody = {
        name: 'A'.repeat(101), // 101 caracteres
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

    it('deve retornar erro de validação quando nome está ausente', async () => {
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

    it('deve retornar erro de validação quando nome é undefined', async () => {
      const requestBody = {
        name: undefined,
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

    it('deve retornar erro de validação quando nome não é string', async () => {
      const requestBody = {
        name: 123,
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

    it('deve aceitar nome com caracteres especiais', async () => {
      const requestBody = {
        name: 'Café & Chá',
      };

      const updatedCrop = {
        id: '3',
        name: 'Café & Chá',
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-04'),
      };

      (prisma.crop.update as jest.Mock).mockResolvedValue(updatedCrop);

      const params = Promise.resolve({ id: '3' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Café & Chá');
    });

    it('deve aceitar nome com acentos', async () => {
      const requestBody = {
        name: 'Açaí',
      };

      const updatedCrop = {
        id: '4',
        name: 'Açaí',
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-05'),
      };

      (prisma.crop.update as jest.Mock).mockResolvedValue(updatedCrop);

      const params = Promise.resolve({ id: '4' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Açaí');
    });

    it('deve aceitar nome com números', async () => {
      const requestBody = {
        name: 'Cultura 2024',
      };

      const updatedCrop = {
        id: '5',
        name: 'Cultura 2024',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-06'),
      };

      (prisma.crop.update as jest.Mock).mockResolvedValue(updatedCrop);

      const params = Promise.resolve({ id: '5' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Cultura 2024');
    });

    it('deve aceitar nome com espaços', async () => {
      const requestBody = {
        name: 'Cana de Açúcar para Etanol',
      };

      const updatedCrop = {
        id: '6',
        name: 'Cana de Açúcar para Etanol',
        createdAt: new Date('2024-01-06'),
        updatedAt: new Date('2024-01-07'),
      };

      (prisma.crop.update as jest.Mock).mockResolvedValue(updatedCrop);

      const params = Promise.resolve({ id: '6' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Cana de Açúcar para Etanol');
    });

    it('deve aceitar nome com exatamente 100 caracteres', async () => {
      const requestBody = {
        name: 'A'.repeat(100), // Exatamente 100 caracteres
      };

      const updatedCrop = {
        id: '7',
        name: 'A'.repeat(100),
        createdAt: new Date('2024-01-07'),
        updatedAt: new Date('2024-01-08'),
      };

      (prisma.crop.update as jest.Mock).mockResolvedValue(updatedCrop);

      const params = Promise.resolve({ id: '7' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('A'.repeat(100));
    });

    it('deve lidar com erro do banco de dados na atualização', async () => {
      const requestBody = {
        name: 'Café',
      };

      const error = new Error('Erro de conexão com o banco');
      (prisma.crop.update as jest.Mock).mockRejectedValue(error);

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
        name: 'Café',
      };

      (prisma.crop.update as jest.Mock).mockRejectedValue('Erro desconhecido');

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
        name: 'Café',
      };

      const updatedCrop = {
        id: '8',
        name: 'Café',
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-09'),
      };

      (prisma.crop.update as jest.Mock).mockResolvedValue(updatedCrop);

      const params = Promise.resolve({ id: '8' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
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

    it('deve validar tipos de dados corretos na atualização', async () => {
      const requestBody = {
        name: 'Café',
      };

      const updatedCrop = {
        id: '9',
        name: 'Café',
        createdAt: new Date('2024-01-09'),
        updatedAt: new Date('2024-01-10'),
      };

      (prisma.crop.update as jest.Mock).mockResolvedValue(updatedCrop);

      const params = Promise.resolve({ id: '9' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(typeof data.data.id).toBe('string');
      expect(typeof data.data.name).toBe('string');
      expect(data.data.createdAt).toBeInstanceOf(Date);
      expect(data.data.updatedAt).toBeInstanceOf(Date);
    });

    it('deve atualizar cultura com dados mínimos válidos', async () => {
      const requestBody = {
        name: 'A',
      };

      const updatedCrop = {
        id: '10',
        name: 'A',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-11'),
      };

      (prisma.crop.update as jest.Mock).mockResolvedValue(updatedCrop);

      const params = Promise.resolve({ id: '10' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('A');
    });

    it('deve lidar com múltiplos erros de validação', async () => {
      const requestBody = {
        name: '',
        invalidField: 'test',
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
      expect(data.issues).toHaveLength(1); // Apenas o campo name é validado
    });

    it('deve atualizar cultura com nome contendo hífen', async () => {
      const requestBody = {
        name: 'Cana-de-açúcar',
      };

      const updatedCrop = {
        id: '11',
        name: 'Cana-de-açúcar',
        createdAt: new Date('2024-01-11'),
        updatedAt: new Date('2024-01-12'),
      };

      (prisma.crop.update as jest.Mock).mockResolvedValue(updatedCrop);

      const params = Promise.resolve({ id: '11' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Cana-de-açúcar');
    });

    it('deve atualizar cultura com nome contendo parênteses', async () => {
      const requestBody = {
        name: 'Soja (Transgênica)',
      };

      const updatedCrop = {
        id: '12',
        name: 'Soja (Transgênica)',
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-13'),
      };

      (prisma.crop.update as jest.Mock).mockResolvedValue(updatedCrop);

      const params = Promise.resolve({ id: '12' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Soja (Transgênica)');
    });
  });

  describe('DELETE /api/crops/[id]', () => {
    it('deve deletar cultura com sucesso', async () => {
      (prisma.crop.delete as jest.Mock).mockResolvedValue(undefined);

      const params = Promise.resolve({ id: '1' });
      const response = await DELETE({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        message: 'Cultura deletada com sucesso',
      });
      expect(prisma.crop.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('deve deletar cultura existente', async () => {
      (prisma.crop.delete as jest.Mock).mockResolvedValue(undefined);

      const params = Promise.resolve({ id: '2' });
      const response = await DELETE({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Cultura deletada com sucesso');
    });

    it('deve lidar com erro do banco de dados na exclusão', async () => {
      const error = new Error('Erro de conexão com o banco');
      (prisma.crop.delete as jest.Mock).mockRejectedValue(error);

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
      (prisma.crop.delete as jest.Mock).mockRejectedValue('Erro desconhecido');

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
      (prisma.crop.delete as jest.Mock).mockResolvedValue(undefined);

      const params = Promise.resolve({ id: '3' });
      const response = await DELETE({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('message');
      expect(typeof data.success).toBe('boolean');
      expect(typeof data.message).toBe('string');
    });

    it('deve deletar cultura com ID válido', async () => {
      (prisma.crop.delete as jest.Mock).mockResolvedValue(undefined);

      const params = Promise.resolve({ id: '4' });
      const response = await DELETE({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(prisma.crop.delete).toHaveBeenCalledWith({
        where: { id: '4' },
      });
    });

    it('deve lidar com erro de constraint de chave estrangeira', async () => {
      const error = new Error('Foreign key constraint failed');
      (prisma.crop.delete as jest.Mock).mockRejectedValue(error);

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
      (prisma.crop.delete as jest.Mock).mockRejectedValue(error);

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
        name: 'Café',
        invalidField: 'should be ignored',
        anotherInvalidField: 123,
      };

      const updatedCrop = {
        id: '13',
        name: 'Café',
        createdAt: new Date('2024-01-13'),
        updatedAt: new Date('2024-01-14'),
      };

      (prisma.crop.update as jest.Mock).mockResolvedValue(updatedCrop);

      const params = Promise.resolve({ id: '13' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Café');
      expect(prisma.crop.update).toHaveBeenCalledWith({
        where: { id: '13' },
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

      const updatedCrop = {
        id: '14',
        name: 'Café',
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-15'),
      };

      (prisma.crop.update as jest.Mock).mockResolvedValue(updatedCrop);

      const params = Promise.resolve({ id: '14' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Café');
      expect(prisma.crop.update).toHaveBeenCalledWith({
        where: { id: '14' },
        data: {
          name: 'Café',
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
      };

      const updatedCrop = {
        id: '15',
        name: '   ',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-16'),
      };

      (prisma.crop.update as jest.Mock).mockResolvedValue(updatedCrop);

      const params = Promise.resolve({ id: '15' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('   ');
    });

    it('deve lidar com nome contendo quebras de linha no PUT', async () => {
      const requestBody = {
        name: 'Café\nChá',
      };

      const updatedCrop = {
        id: '16',
        name: 'Café\nChá',
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-17'),
      };

      (prisma.crop.update as jest.Mock).mockResolvedValue(updatedCrop);

      const params = Promise.resolve({ id: '16' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Café\nChá');
    });

    it('deve lidar com nome contendo tabs no PUT', async () => {
      const requestBody = {
        name: 'Café\tChá',
      };

      const updatedCrop = {
        id: '17',
        name: 'Café\tChá',
        createdAt: new Date('2024-01-17'),
        updatedAt: new Date('2024-01-18'),
      };

      (prisma.crop.update as jest.Mock).mockResolvedValue(updatedCrop);

      const params = Promise.resolve({ id: '17' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.name).toBe('Café\tChá');
    });

    it('deve lidar com ID inválido no GET', async () => {
      (prisma.crop.findUnique as jest.Mock).mockResolvedValue(null);

      const params = Promise.resolve({ id: 'invalid-id' });
      const response = await GET({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({
        success: false,
        error: 'Cultura não encontrada',
        message: 'Nenhuma cultura encontrada com este ID',
      });
    });

    it('deve lidar com ID vazio no GET', async () => {
      (prisma.crop.findUnique as jest.Mock).mockResolvedValue(null);

      const params = Promise.resolve({ id: '' });
      const response = await GET({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({
        success: false,
        error: 'Cultura não encontrada',
        message: 'Nenhuma cultura encontrada com este ID',
      });
    });

    it('deve lidar com ID vazio no PUT', async () => {
      const requestBody = {
        name: 'Café',
      };

      (prisma.crop.update as jest.Mock).mockResolvedValue(undefined);

      const params = Promise.resolve({ id: '' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('deve lidar com ID vazio no DELETE', async () => {
      (prisma.crop.delete as jest.Mock).mockResolvedValue(undefined);

      const params = Promise.resolve({ id: '' });
      const response = await DELETE({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });
});
