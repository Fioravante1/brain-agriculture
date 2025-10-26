import { NextRequest } from 'next/server';
import { GET, DELETE } from './route';
import { prisma } from '@/shared/lib/database/prisma';

jest.mock('@/shared/lib/database/prisma', () => ({
  prisma: {
    farmCrop: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: jest.fn().mockResolvedValue(data),
      status: init?.status || 200,
    })),
  },
}));

describe('API Route /api/farm-crops/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/farm-crops/[id]', () => {
    it('deve retornar associação por ID com sucesso', async () => {
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

      (prisma.farmCrop.findUnique as jest.Mock).mockResolvedValue(mockFarmCrop);

      const params = Promise.resolve({ id: '1' });
      const response = await GET({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        data: mockFarmCrop,
      });
      expect(prisma.farmCrop.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
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

    it('deve retornar erro 404 quando associação não é encontrada', async () => {
      (prisma.farmCrop.findUnique as jest.Mock).mockResolvedValue(null);

      const params = Promise.resolve({ id: '999' });
      const response = await GET({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({
        success: false,
        error: 'Associação não encontrada',
        message: 'Nenhuma associação encontrada com este ID',
      });
      expect(prisma.farmCrop.findUnique).toHaveBeenCalledWith({
        where: { id: '999' },
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

    it('deve lidar com erro do banco de dados', async () => {
      const error = new Error('Erro de conexão com o banco');
      (prisma.farmCrop.findUnique as jest.Mock).mockRejectedValue(error);

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
      (prisma.farmCrop.findUnique as jest.Mock).mockRejectedValue('Erro desconhecido');

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

    it('deve funcionar com diferentes IDs', async () => {
      const mockFarmCrop = {
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
      };

      (prisma.farmCrop.findUnique as jest.Mock).mockResolvedValue(mockFarmCrop);

      const params = Promise.resolve({ id: '2' });
      const response = await GET({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(mockFarmCrop);
      expect(prisma.farmCrop.findUnique).toHaveBeenCalledWith({
        where: { id: '2' },
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

    it('deve incluir relacionamentos corretos', async () => {
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

      (prisma.farmCrop.findUnique as jest.Mock).mockResolvedValue(mockFarmCrop);

      const params = Promise.resolve({ id: '1' });
      await GET({} as NextRequest, { params });

      expect(prisma.farmCrop.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
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

  describe('DELETE /api/farm-crops/[id]', () => {
    it('deve deletar associação com sucesso', async () => {
      (prisma.farmCrop.delete as jest.Mock).mockResolvedValue({});

      const params = Promise.resolve({ id: '1' });
      const response = await DELETE({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        success: true,
        message: 'Associação deletada com sucesso',
      });
      expect(prisma.farmCrop.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('deve lidar com erro do banco de dados', async () => {
      const error = new Error('Erro de conexão com o banco');
      (prisma.farmCrop.delete as jest.Mock).mockRejectedValue(error);

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

    it('deve lidar com erro desconhecido', async () => {
      (prisma.farmCrop.delete as jest.Mock).mockRejectedValue('Erro desconhecido');

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

    it('deve funcionar com diferentes IDs', async () => {
      (prisma.farmCrop.delete as jest.Mock).mockResolvedValue({});

      const params = Promise.resolve({ id: '999' });
      const response = await DELETE({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(prisma.farmCrop.delete).toHaveBeenCalledWith({
        where: { id: '999' },
      });
    });

    it('deve lidar com erro quando associação não existe', async () => {
      const error = new Error('Record to delete does not exist');
      (prisma.farmCrop.delete as jest.Mock).mockRejectedValue(error);

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

    it('deve usar where clause correta', async () => {
      (prisma.farmCrop.delete as jest.Mock).mockResolvedValue({});

      const params = Promise.resolve({ id: 'test-id' });
      await DELETE({} as NextRequest, { params });

      expect(prisma.farmCrop.delete).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
    });
  });

  describe('integração', () => {
    it('deve funcionar com múltiplas operações', async () => {
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

      // GET
      (prisma.farmCrop.findUnique as jest.Mock).mockResolvedValue(mockFarmCrop);
      const getParams = Promise.resolve({ id: '1' });
      const getResponse = await GET({} as NextRequest, { params: getParams });
      expect(getResponse.status).toBe(200);

      // DELETE
      (prisma.farmCrop.delete as jest.Mock).mockResolvedValue({});
      const deleteParams = Promise.resolve({ id: '1' });
      const deleteResponse = await DELETE({} as NextRequest, { params: deleteParams });
      expect(deleteResponse.status).toBe(200);

      expect(prisma.farmCrop.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.farmCrop.delete).toHaveBeenCalledTimes(1);
    });

    it('deve manter consistência entre operações', async () => {
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

      (prisma.farmCrop.findUnique as jest.Mock).mockResolvedValue(mockFarmCrop);
      (prisma.farmCrop.delete as jest.Mock).mockResolvedValue({});

      const params = Promise.resolve({ id: '1' });

      const getResponse = await GET({} as NextRequest, { params });
      const getData = await getResponse.json();

      const deleteResponse = await DELETE({} as NextRequest, { params });
      const deleteData = await deleteResponse.json();

      expect(getData.success).toBe(true);
      expect(deleteData.success).toBe(true);
      expect(getData.data).toEqual(mockFarmCrop);
      expect(deleteData.message).toBe('Associação deletada com sucesso');
    });

    it('deve lidar com erros em sequência', async () => {
      const error = new Error('Erro de conexão com o banco');
      (prisma.farmCrop.findUnique as jest.Mock).mockRejectedValue(error);
      (prisma.farmCrop.delete as jest.Mock).mockRejectedValue(error);

      const params = Promise.resolve({ id: '1' });

      const getResponse = await GET({} as NextRequest, { params });
      const getData = await getResponse.json();

      const deleteResponse = await DELETE({} as NextRequest, { params });
      const deleteData = await deleteResponse.json();

      expect(getResponse.status).toBe(500);
      expect(deleteResponse.status).toBe(500);
      expect(getData.error).toBe('Erro interno do servidor');
      expect(deleteData.error).toBe('Erro interno do servidor');
    });
  });
});
