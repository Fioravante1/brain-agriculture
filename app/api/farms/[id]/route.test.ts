import { NextRequest } from 'next/server';
import { GET, PUT, DELETE } from './route';
import { prisma } from '@/shared/lib/database/prisma';

// Mock do Prisma
jest.mock('@/shared/lib/database/prisma', () => ({
  prisma: {
    farm: {
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

describe('API Route /api/farms/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/farms/[id]', () => {
    it('deve retornar fazenda por ID com sucesso', async () => {
      const mockFarm = {
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
      };

      (prisma.farm.findUnique as jest.Mock).mockResolvedValue(mockFarm);

      const params = Promise.resolve({ id: '1' });
      const response = await GET({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: mockFarm,
      });
      expect(prisma.farm.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
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

    it('deve retornar erro 404 quando fazenda não é encontrada', async () => {
      (prisma.farm.findUnique as jest.Mock).mockResolvedValue(null);

      const params = Promise.resolve({ id: '999' });
      const response = await GET({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({
        success: false,
        error: 'Fazenda não encontrada',
        message: 'Nenhuma fazenda encontrada com este ID',
      });
    });

    it('deve lidar com erro do banco de dados', async () => {
      const error = new Error('Erro de conexão com o banco');
      (prisma.farm.findUnique as jest.Mock).mockRejectedValue(error);

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
      (prisma.farm.findUnique as jest.Mock).mockRejectedValue('Erro desconhecido');

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
  });

  describe('PUT /api/farms/[id]', () => {
    it('deve atualizar fazenda com sucesso', async () => {
      const requestBody = {
        producerId: '1',
        name: 'Fazenda São João Atualizada',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 150,
        arableArea: 120,
        vegetationArea: 30,
      };

      const existingFarm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      const updatedFarm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda São João Atualizada',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 150,
        arableArea: 120,
        vegetationArea: 30,
        producer: {
          id: '1',
          name: 'João Silva',
          cpfCnpj: '12345678901',
        },
        farmCrops: [],
      };

      (prisma.farm.findUnique as jest.Mock).mockResolvedValue(existingFarm);
      (prisma.farm.update as jest.Mock).mockResolvedValue(updatedFarm);

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: updatedFarm,
        message: 'Fazenda atualizada com sucesso',
      });
      expect(prisma.farm.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(prisma.farm.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          producerId: '1',
          name: 'Fazenda São João Atualizada',
          city: 'São Paulo',
          state: 'SP',
          totalArea: 150,
          arableArea: 120,
          vegetationArea: 30,
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

    it('deve retornar erro 404 quando fazenda não é encontrada', async () => {
      const requestBody = {
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      (prisma.farm.findUnique as jest.Mock).mockResolvedValue(null);

      const params = Promise.resolve({ id: '999' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({
        success: false,
        error: 'Fazenda não encontrada',
        message: 'Nenhuma fazenda encontrada com este ID',
      });
      expect(prisma.farm.update).not.toHaveBeenCalled();
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

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
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

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
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

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
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

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
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

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
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

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
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

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
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

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
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

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
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

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
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

    it('deve lidar com erro do banco de dados na atualização', async () => {
      const requestBody = {
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      const existingFarm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      const error = new Error('Erro de conexão com o banco');
      (prisma.farm.findUnique as jest.Mock).mockResolvedValue(existingFarm);
      (prisma.farm.update as jest.Mock).mockRejectedValue(error);

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
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      const existingFarm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      (prisma.farm.findUnique as jest.Mock).mockResolvedValue(existingFarm);
      (prisma.farm.update as jest.Mock).mockRejectedValue('Erro desconhecido');

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

    it('deve atualizar fazenda com dados válidos incluindo relacionamentos', async () => {
      const requestBody = {
        producerId: '2',
        name: 'Fazenda Santa Maria Atualizada',
        city: 'Rio de Janeiro',
        state: 'RJ',
        totalArea: 200,
        arableArea: 150,
        vegetationArea: 50,
      };

      const existingFarm = {
        id: '2',
        producerId: '2',
        name: 'Fazenda Santa Maria',
        city: 'Rio de Janeiro',
        state: 'RJ',
        totalArea: 200,
        arableArea: 150,
        vegetationArea: 50,
      };

      const updatedFarm = {
        id: '2',
        producerId: '2',
        name: 'Fazenda Santa Maria Atualizada',
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

      (prisma.farm.findUnique as jest.Mock).mockResolvedValue(existingFarm);
      (prisma.farm.update as jest.Mock).mockResolvedValue(updatedFarm);

      const params = Promise.resolve({ id: '2' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: updatedFarm,
        message: 'Fazenda atualizada com sucesso',
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

      const existingFarm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      const updatedFarm = {
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
      };

      (prisma.farm.findUnique as jest.Mock).mockResolvedValue(existingFarm);
      (prisma.farm.update as jest.Mock).mockResolvedValue(updatedFarm);

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
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

      const existingFarm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      const updatedFarm = {
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
      };

      (prisma.farm.findUnique as jest.Mock).mockResolvedValue(existingFarm);
      (prisma.farm.update as jest.Mock).mockResolvedValue(updatedFarm);

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveProperty('producer');
      expect(data.data).toHaveProperty('farmCrops');
      expect(data.data.farmCrops[0]).toHaveProperty('crop');
      expect(data.data.farmCrops[0]).toHaveProperty('harvest');
    });
  });

  describe('DELETE /api/farms/[id]', () => {
    it('deve deletar fazenda com sucesso', async () => {
      const existingFarm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      (prisma.farm.findUnique as jest.Mock).mockResolvedValue(existingFarm);
      (prisma.farm.delete as jest.Mock).mockResolvedValue(existingFarm);

      const params = Promise.resolve({ id: '1' });
      const response = await DELETE({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        message: 'Fazenda deletada com sucesso',
      });
      expect(prisma.farm.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(prisma.farm.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('deve retornar erro 404 quando fazenda não é encontrada', async () => {
      (prisma.farm.findUnique as jest.Mock).mockResolvedValue(null);

      const params = Promise.resolve({ id: '999' });
      const response = await DELETE({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({
        success: false,
        error: 'Fazenda não encontrada',
        message: 'Nenhuma fazenda encontrada com este ID',
      });
      expect(prisma.farm.delete).not.toHaveBeenCalled();
    });

    it('deve lidar com erro do banco de dados na exclusão', async () => {
      const existingFarm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      const error = new Error('Erro de conexão com o banco');
      (prisma.farm.findUnique as jest.Mock).mockResolvedValue(existingFarm);
      (prisma.farm.delete as jest.Mock).mockRejectedValue(error);

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
      const existingFarm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      (prisma.farm.findUnique as jest.Mock).mockResolvedValue(existingFarm);
      (prisma.farm.delete as jest.Mock).mockRejectedValue('Erro desconhecido');

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

    it('deve lidar com erro do banco de dados na verificação de existência', async () => {
      const error = new Error('Erro de conexão com o banco');
      (prisma.farm.findUnique as jest.Mock).mockRejectedValue(error);

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
  });
});
