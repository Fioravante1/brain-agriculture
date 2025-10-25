import { NextRequest } from 'next/server';
import { GET, PUT, DELETE } from './route';
import { prisma } from '@/shared/lib/database/prisma';

// Mock do Prisma
jest.mock('@/shared/lib/database/prisma', () => ({
  prisma: {
    producer: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
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

describe('API Route /api/producers/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/producers/[id]', () => {
    it('deve retornar produtor por ID com sucesso', async () => {
      const mockProducer = {
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

      (prisma.producer.findUnique as jest.Mock).mockResolvedValue(mockProducer);

      const params = Promise.resolve({ id: '1' });
      const response = await GET({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: mockProducer,
      });
      expect(prisma.producer.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
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

    it('deve retornar erro 404 quando produtor não é encontrado', async () => {
      (prisma.producer.findUnique as jest.Mock).mockResolvedValue(null);

      const params = Promise.resolve({ id: '999' });
      const response = await GET({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({
        success: false,
        error: 'Produtor não encontrado',
        message: 'Nenhum produtor encontrado com este ID',
      });
    });

    it('deve lidar com erro do banco de dados', async () => {
      const error = new Error('Erro de conexão com o banco');
      (prisma.producer.findUnique as jest.Mock).mockRejectedValue(error);

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
      (prisma.producer.findUnique as jest.Mock).mockRejectedValue('Erro desconhecido');

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

  describe('PUT /api/producers/[id]', () => {
    it('deve atualizar produtor com sucesso', async () => {
      const requestBody = {
        cpfCnpj: '123.456.789-09',
        name: 'João Silva Atualizado',
      };

      const existingProducer = {
        id: '1',
        cpfCnpj: '123.456.789-09',
        name: 'João Silva',
      };

      const updatedProducer = {
        id: '1',
        cpfCnpj: '123.456.789-09',
        name: 'João Silva Atualizado',
        farms: [],
      };

      (prisma.producer.findUnique as jest.Mock).mockResolvedValue(existingProducer);
      (prisma.producer.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.producer.update as jest.Mock).mockResolvedValue(updatedProducer);

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: updatedProducer,
        message: 'Produtor atualizado com sucesso',
      });
      expect(prisma.producer.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(prisma.producer.findFirst).toHaveBeenCalledWith({
        where: { cpfCnpj: '123.456.789-09', id: { not: '1' } },
      });
      expect(prisma.producer.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          cpfCnpj: '123.456.789-09',
          name: 'João Silva Atualizado',
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

    it('deve retornar erro 404 quando produtor não é encontrado', async () => {
      const requestBody = {
        cpfCnpj: '123.456.789-09',
        name: 'João Silva',
      };

      (prisma.producer.findUnique as jest.Mock).mockResolvedValue(null);

      const params = Promise.resolve({ id: '999' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({
        success: false,
        error: 'Produtor não encontrado',
        message: 'Nenhum produtor encontrado com este ID',
      });
      expect(prisma.producer.update).not.toHaveBeenCalled();
    });

    it('deve retornar erro 409 quando CPF/CNPJ já existe em outro produtor', async () => {
      const requestBody = {
        cpfCnpj: '123.456.789-09',
        name: 'João Silva',
      };

      const existingProducer = {
        id: '1',
        cpfCnpj: '123.456.789-09',
        name: 'João Silva',
      };

      const duplicateProducer = {
        id: '2',
        cpfCnpj: '123.456.789-09',
        name: 'Outro Produtor',
      };

      (prisma.producer.findUnique as jest.Mock).mockResolvedValue(existingProducer);
      (prisma.producer.findFirst as jest.Mock).mockResolvedValue(duplicateProducer);

      const params = Promise.resolve({ id: '1' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data).toEqual({
        success: false,
        error: 'CPF/CNPJ já cadastrado',
        message: 'Já existe outro produtor com este CPF/CNPJ',
      });
      expect(prisma.producer.update).not.toHaveBeenCalled();
    });

    it('deve retornar erro de validação quando CPF/CNPJ está vazio', async () => {
      const requestBody = {
        cpfCnpj: '',
        name: 'João Silva',
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
        path: ['cpfCnpj'],
        message: 'CPF/CNPJ é obrigatório',
      });
    });

    it('deve retornar erro de validação quando nome está vazio', async () => {
      const requestBody = {
        cpfCnpj: '123.456.789-09',
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
      expect(data.details).toHaveLength(2);
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
      expect(data.details).toHaveLength(2);
    });

    it('deve lidar com erro do banco de dados na atualização', async () => {
      const requestBody = {
        cpfCnpj: '123.456.789-09',
        name: 'João Silva',
      };

      const existingProducer = {
        id: '1',
        cpfCnpj: '123.456.789-09',
        name: 'João Silva',
      };

      const error = new Error('Erro de conexão com o banco');
      (prisma.producer.findUnique as jest.Mock).mockResolvedValue(existingProducer);
      (prisma.producer.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.producer.update as jest.Mock).mockRejectedValue(error);

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
        cpfCnpj: '123.456.789-09',
        name: 'João Silva',
      };

      const existingProducer = {
        id: '1',
        cpfCnpj: '123.456.789-09',
        name: 'João Silva',
      };

      (prisma.producer.findUnique as jest.Mock).mockResolvedValue(existingProducer);
      (prisma.producer.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.producer.update as jest.Mock).mockRejectedValue('Erro desconhecido');

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

    it('deve atualizar produtor com dados válidos incluindo relacionamentos', async () => {
      const requestBody = {
        cpfCnpj: '98.765.432/0001-10',
        name: 'Agropecuária Santos Ltda Atualizada',
      };

      const existingProducer = {
        id: '2',
        cpfCnpj: '98.765.432/0001-10',
        name: 'Agropecuária Santos Ltda',
      };

      const updatedProducer = {
        id: '2',
        cpfCnpj: '98.765.432/0001-10',
        name: 'Agropecuária Santos Ltda Atualizada',
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

      (prisma.producer.findUnique as jest.Mock).mockResolvedValue(existingProducer);
      (prisma.producer.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.producer.update as jest.Mock).mockResolvedValue(updatedProducer);

      const params = Promise.resolve({ id: '2' });
      const request = createMockRequest(requestBody);
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: updatedProducer,
        message: 'Produtor atualizado com sucesso',
      });
    });
  });

  describe('DELETE /api/producers/[id]', () => {
    it('deve deletar produtor com sucesso', async () => {
      const existingProducer = {
        id: '1',
        cpfCnpj: '123.456.789-09',
        name: 'João Silva',
      };

      (prisma.producer.findUnique as jest.Mock).mockResolvedValue(existingProducer);
      (prisma.producer.delete as jest.Mock).mockResolvedValue(existingProducer);

      const params = Promise.resolve({ id: '1' });
      const response = await DELETE({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        message: 'Produtor deletado com sucesso',
      });
      expect(prisma.producer.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(prisma.producer.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('deve retornar erro 404 quando produtor não é encontrado', async () => {
      (prisma.producer.findUnique as jest.Mock).mockResolvedValue(null);

      const params = Promise.resolve({ id: '999' });
      const response = await DELETE({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({
        success: false,
        error: 'Produtor não encontrado',
        message: 'Nenhum produtor encontrado com este ID',
      });
      expect(prisma.producer.delete).not.toHaveBeenCalled();
    });

    it('deve lidar com erro do banco de dados na exclusão', async () => {
      const existingProducer = {
        id: '1',
        cpfCnpj: '123.456.789-09',
        name: 'João Silva',
      };

      const error = new Error('Erro de conexão com o banco');
      (prisma.producer.findUnique as jest.Mock).mockResolvedValue(existingProducer);
      (prisma.producer.delete as jest.Mock).mockRejectedValue(error);

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
      const existingProducer = {
        id: '1',
        cpfCnpj: '123.456.789-09',
        name: 'João Silva',
      };

      (prisma.producer.findUnique as jest.Mock).mockResolvedValue(existingProducer);
      (prisma.producer.delete as jest.Mock).mockRejectedValue('Erro desconhecido');

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
      (prisma.producer.findUnique as jest.Mock).mockRejectedValue(error);

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
