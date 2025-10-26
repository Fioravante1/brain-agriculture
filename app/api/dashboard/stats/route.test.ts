import { GET } from './route';
import { prisma } from '@/shared/lib/database/prisma';

// Mock do Prisma
jest.mock('@/shared/lib/database/prisma', () => ({
  prisma: {
    farm: {
      findMany: jest.fn(),
    },
    farmCrop: {
      findMany: jest.fn(),
    },
  },
}));

// Mock do Next.js server
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: jest.fn().mockResolvedValue(data),
      status: init?.status || 200,
    })),
  },
}));

describe('API Route /api/dashboard/stats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/dashboard/stats', () => {
    it('deve retornar estatísticas do dashboard com sucesso', async () => {
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
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          producer: {
            id: '1',
            cpfCnpj: '12345678901',
            name: 'João Silva',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
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
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          producer: {
            id: '2',
            cpfCnpj: '12345678000195',
            name: 'Maria Santos',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
        {
          id: '3',
          producerId: '3',
          name: 'Fazenda Boa Vista',
          city: 'Belo Horizonte',
          state: 'MG',
          totalArea: 300,
          arableArea: 200,
          vegetationArea: 100,
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          producer: {
            id: '3',
            cpfCnpj: '98765432100',
            name: 'Pedro Oliveira',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
      ];

      const mockFarmCrops = [
        {
          id: '1',
          farmId: '1',
          cropId: '1',
          harvestId: '1',
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          crop: {
            id: '1',
            name: 'Soja',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
        {
          id: '2',
          farmId: '2',
          cropId: '2',
          harvestId: '2',
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          crop: {
            id: '2',
            name: 'Milho',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
        {
          id: '3',
          farmId: '3',
          cropId: '1',
          harvestId: '3',
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          crop: {
            id: '1',
            name: 'Soja',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
      ];

      (prisma.farm.findMany as jest.Mock).mockResolvedValue(mockFarms);
      (prisma.farmCrop.findMany as jest.Mock).mockResolvedValue(mockFarmCrops);

      const response = await GET();

      expect(response.status).toBe(200);

      const responseData = await response.json();
      expect(responseData).toEqual({
        success: true,
        data: {
          totalFarms: 3,
          totalHectares: 600,
          farmsByState: [
            { name: 'SP', value: 1 },
            { name: 'RJ', value: 1 },
            { name: 'MG', value: 1 },
          ],
          farmsByCrop: [
            { name: 'Soja', value: 2 },
            { name: 'Milho', value: 1 },
          ],
          landUse: [
            { name: 'Área Agricultável', value: 430 },
            { name: 'Vegetação', value: 170 },
          ],
        },
      });
    });

    it('deve retornar estatísticas com dados vazios', async () => {
      (prisma.farm.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.farmCrop.findMany as jest.Mock).mockResolvedValue([]);

      const response = await GET();

      expect(response.status).toBe(200);

      const responseData = await response.json();
      expect(responseData).toEqual({
        success: true,
        data: {
          totalFarms: 0,
          totalHectares: 0,
          farmsByState: [],
          farmsByCrop: [],
          landUse: [
            { name: 'Área Agricultável', value: 0 },
            { name: 'Vegetação', value: 0 },
          ],
        },
      });
    });

    it('deve retornar estatísticas com fazendas de mesmo estado', async () => {
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
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          producer: {
            id: '1',
            cpfCnpj: '12345678901',
            name: 'João Silva',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
        {
          id: '2',
          producerId: '2',
          name: 'Fazenda Santa Maria',
          city: 'São Paulo',
          state: 'SP',
          totalArea: 200,
          arableArea: 150,
          vegetationArea: 50,
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          producer: {
            id: '2',
            cpfCnpj: '12345678000195',
            name: 'Maria Santos',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
      ];

      const mockFarmCrops = [
        {
          id: '1',
          farmId: '1',
          cropId: '1',
          harvestId: '1',
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          crop: {
            id: '1',
            name: 'Soja',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
        {
          id: '2',
          farmId: '2',
          cropId: '1',
          harvestId: '2',
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          crop: {
            id: '1',
            name: 'Soja',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
      ];

      (prisma.farm.findMany as jest.Mock).mockResolvedValue(mockFarms);
      (prisma.farmCrop.findMany as jest.Mock).mockResolvedValue(mockFarmCrops);

      const response = await GET();

      expect(response.status).toBe(200);

      const responseData = await response.json();
      expect(responseData).toEqual({
        success: true,
        data: {
          totalFarms: 2,
          totalHectares: 300,
          farmsByState: [{ name: 'SP', value: 2 }],
          farmsByCrop: [{ name: 'Soja', value: 2 }],
          landUse: [
            { name: 'Área Agricultável', value: 230 },
            { name: 'Vegetação', value: 70 },
          ],
        },
      });
    });

    it('deve retornar estatísticas com culturas diferentes', async () => {
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
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          producer: {
            id: '1',
            cpfCnpj: '12345678901',
            name: 'João Silva',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
      ];

      const mockFarmCrops = [
        {
          id: '1',
          farmId: '1',
          cropId: '1',
          harvestId: '1',
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          crop: {
            id: '1',
            name: 'Soja',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
        {
          id: '2',
          farmId: '1',
          cropId: '2',
          harvestId: '2',
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          crop: {
            id: '2',
            name: 'Milho',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
        {
          id: '3',
          farmId: '1',
          cropId: '3',
          harvestId: '3',
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          crop: {
            id: '3',
            name: 'Algodão',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
      ];

      (prisma.farm.findMany as jest.Mock).mockResolvedValue(mockFarms);
      (prisma.farmCrop.findMany as jest.Mock).mockResolvedValue(mockFarmCrops);

      const response = await GET();

      expect(response.status).toBe(200);

      const responseData = await response.json();
      expect(responseData).toEqual({
        success: true,
        data: {
          totalFarms: 1,
          totalHectares: 100,
          farmsByState: [{ name: 'SP', value: 1 }],
          farmsByCrop: [
            { name: 'Soja', value: 1 },
            { name: 'Milho', value: 1 },
            { name: 'Algodão', value: 1 },
          ],
          landUse: [
            { name: 'Área Agricultável', value: 80 },
            { name: 'Vegetação', value: 20 },
          ],
        },
      });
    });

    it('deve retornar estatísticas com áreas grandes', async () => {
      const mockFarms = [
        {
          id: '1',
          producerId: '1',
          name: 'Fazenda Grande',
          city: 'São Paulo',
          state: 'SP',
          totalArea: 10000,
          arableArea: 8000,
          vegetationArea: 2000,
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          producer: {
            id: '1',
            cpfCnpj: '12345678901',
            name: 'João Silva',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
        {
          id: '2',
          producerId: '2',
          name: 'Fazenda Gigante',
          city: 'Rio de Janeiro',
          state: 'RJ',
          totalArea: 50000,
          arableArea: 40000,
          vegetationArea: 10000,
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          producer: {
            id: '2',
            cpfCnpj: '12345678000195',
            name: 'Maria Santos',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
      ];

      const mockFarmCrops = [
        {
          id: '1',
          farmId: '1',
          cropId: '1',
          harvestId: '1',
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          crop: {
            id: '1',
            name: 'Soja',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
        {
          id: '2',
          farmId: '2',
          cropId: '2',
          harvestId: '2',
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          crop: {
            id: '2',
            name: 'Milho',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
      ];

      (prisma.farm.findMany as jest.Mock).mockResolvedValue(mockFarms);
      (prisma.farmCrop.findMany as jest.Mock).mockResolvedValue(mockFarmCrops);

      const response = await GET();

      expect(response.status).toBe(200);

      const responseData = await response.json();
      expect(responseData).toEqual({
        success: true,
        data: {
          totalFarms: 2,
          totalHectares: 60000,
          farmsByState: [
            { name: 'SP', value: 1 },
            { name: 'RJ', value: 1 },
          ],
          farmsByCrop: [
            { name: 'Soja', value: 1 },
            { name: 'Milho', value: 1 },
          ],
          landUse: [
            { name: 'Área Agricultável', value: 48000 },
            { name: 'Vegetação', value: 12000 },
          ],
        },
      });
    });

    it('deve retornar erro quando prisma.farm.findMany falha', async () => {
      (prisma.farm.findMany as jest.Mock).mockRejectedValue(new Error('Database connection failed'));
      (prisma.farmCrop.findMany as jest.Mock).mockResolvedValue([]);

      const response = await GET();

      expect(response.status).toBe(500);

      const responseData = await response.json();
      expect(responseData).toEqual({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Database connection failed',
      });
    });

    it('deve retornar erro quando prisma.farmCrop.findMany falha', async () => {
      (prisma.farm.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.farmCrop.findMany as jest.Mock).mockRejectedValue(new Error('Database connection failed'));

      const response = await GET();

      expect(response.status).toBe(500);

      const responseData = await response.json();
      expect(responseData).toEqual({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Database connection failed',
      });
    });

    it('deve retornar erro quando ambos os prisma calls falham', async () => {
      (prisma.farm.findMany as jest.Mock).mockRejectedValue(new Error('Database connection failed'));
      (prisma.farmCrop.findMany as jest.Mock).mockRejectedValue(new Error('Database connection failed'));

      const response = await GET();

      expect(response.status).toBe(500);

      const responseData = await response.json();
      expect(responseData).toEqual({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Database connection failed',
      });
    });

    it('deve retornar erro genérico quando erro não é Error instance', async () => {
      (prisma.farm.findMany as jest.Mock).mockRejectedValue('String error');
      (prisma.farmCrop.findMany as jest.Mock).mockResolvedValue([]);

      const response = await GET();

      expect(response.status).toBe(500);

      const responseData = await response.json();
      expect(responseData).toEqual({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro desconhecido',
      });
    });

    it('deve retornar erro quando Promise.all falha', async () => {
      (prisma.farm.findMany as jest.Mock).mockRejectedValue(new Error('Promise.all failed'));
      (prisma.farmCrop.findMany as jest.Mock).mockResolvedValue([]);

      const response = await GET();

      expect(response.status).toBe(500);

      const responseData = await response.json();
      expect(responseData).toEqual({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Promise.all failed',
      });
    });

    it('deve retornar estatísticas com fazendas sem farmCrops', async () => {
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
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          producer: {
            id: '1',
            cpfCnpj: '12345678901',
            name: 'João Silva',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
      ];

      (prisma.farm.findMany as jest.Mock).mockResolvedValue(mockFarms);
      (prisma.farmCrop.findMany as jest.Mock).mockResolvedValue([]);

      const response = await GET();

      expect(response.status).toBe(200);

      const responseData = await response.json();
      expect(responseData).toEqual({
        success: true,
        data: {
          totalFarms: 1,
          totalHectares: 100,
          farmsByState: [{ name: 'SP', value: 1 }],
          farmsByCrop: [],
          landUse: [
            { name: 'Área Agricultável', value: 80 },
            { name: 'Vegetação', value: 20 },
          ],
        },
      });
    });

    it('deve retornar estatísticas com farmCrops sem fazendas', async () => {
      const mockFarmCrops = [
        {
          id: '1',
          farmId: '1',
          cropId: '1',
          harvestId: '1',
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          crop: {
            id: '1',
            name: 'Soja',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
      ];

      (prisma.farm.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.farmCrop.findMany as jest.Mock).mockResolvedValue(mockFarmCrops);

      const response = await GET();

      expect(response.status).toBe(200);

      const responseData = await response.json();
      expect(responseData).toEqual({
        success: true,
        data: {
          totalFarms: 0,
          totalHectares: 0,
          farmsByState: [],
          farmsByCrop: [{ name: 'Soja', value: 1 }],
          landUse: [
            { name: 'Área Agricultável', value: 0 },
            { name: 'Vegetação', value: 0 },
          ],
        },
      });
    });

    it('deve retornar estatísticas com dados complexos', async () => {
      const mockFarms = [
        {
          id: '1',
          producerId: '1',
          name: 'Fazenda São João',
          city: 'São Paulo',
          state: 'SP',
          totalArea: 1000,
          arableArea: 800,
          vegetationArea: 200,
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          producer: {
            id: '1',
            cpfCnpj: '12345678901',
            name: 'João Silva',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
        {
          id: '2',
          producerId: '2',
          name: 'Fazenda Santa Maria',
          city: 'Rio de Janeiro',
          state: 'RJ',
          totalArea: 2000,
          arableArea: 1500,
          vegetationArea: 500,
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          producer: {
            id: '2',
            cpfCnpj: '12345678000195',
            name: 'Maria Santos',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
        {
          id: '3',
          producerId: '3',
          name: 'Fazenda Boa Vista',
          city: 'Belo Horizonte',
          state: 'MG',
          totalArea: 3000,
          arableArea: 2000,
          vegetationArea: 1000,
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          producer: {
            id: '3',
            cpfCnpj: '98765432100',
            name: 'Pedro Oliveira',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
      ];

      const mockFarmCrops = [
        {
          id: '1',
          farmId: '1',
          cropId: '1',
          harvestId: '1',
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          crop: {
            id: '1',
            name: 'Soja',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
        {
          id: '2',
          farmId: '2',
          cropId: '2',
          harvestId: '2',
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          crop: {
            id: '2',
            name: 'Milho',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
        {
          id: '3',
          farmId: '3',
          cropId: '1',
          harvestId: '3',
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          crop: {
            id: '1',
            name: 'Soja',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
        {
          id: '4',
          farmId: '3',
          cropId: '3',
          harvestId: '4',
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          crop: {
            id: '3',
            name: 'Algodão',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
      ];

      (prisma.farm.findMany as jest.Mock).mockResolvedValue(mockFarms);
      (prisma.farmCrop.findMany as jest.Mock).mockResolvedValue(mockFarmCrops);

      const response = await GET();

      expect(response.status).toBe(200);

      const responseData = await response.json();
      expect(responseData).toEqual({
        success: true,
        data: {
          totalFarms: 3,
          totalHectares: 6000,
          farmsByState: [
            { name: 'SP', value: 1 },
            { name: 'RJ', value: 1 },
            { name: 'MG', value: 1 },
          ],
          farmsByCrop: [
            { name: 'Soja', value: 2 },
            { name: 'Milho', value: 1 },
            { name: 'Algodão', value: 1 },
          ],
          landUse: [
            { name: 'Área Agricultável', value: 4300 },
            { name: 'Vegetação', value: 1700 },
          ],
        },
      });
    });

    it('deve retornar estatísticas com fazendas de mesmo estado e culturas', async () => {
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
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          producer: {
            id: '1',
            cpfCnpj: '12345678901',
            name: 'João Silva',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
        {
          id: '2',
          producerId: '2',
          name: 'Fazenda Santa Maria',
          city: 'São Paulo',
          state: 'SP',
          totalArea: 200,
          arableArea: 150,
          vegetationArea: 50,
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          producer: {
            id: '2',
            cpfCnpj: '12345678000195',
            name: 'Maria Santos',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
        {
          id: '3',
          producerId: '3',
          name: 'Fazenda Boa Vista',
          city: 'São Paulo',
          state: 'SP',
          totalArea: 300,
          arableArea: 200,
          vegetationArea: 100,
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          producer: {
            id: '3',
            cpfCnpj: '98765432100',
            name: 'Pedro Oliveira',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
      ];

      const mockFarmCrops = [
        {
          id: '1',
          farmId: '1',
          cropId: '1',
          harvestId: '1',
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          crop: {
            id: '1',
            name: 'Soja',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
        {
          id: '2',
          farmId: '2',
          cropId: '1',
          harvestId: '2',
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          crop: {
            id: '1',
            name: 'Soja',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
        {
          id: '3',
          farmId: '3',
          cropId: '1',
          harvestId: '3',
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
          updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          crop: {
            id: '1',
            name: 'Soja',
            createdAt: new Date('2021-01-01T00:00:00.000Z'),
            updatedAt: new Date('2021-01-01T00:00:00.000Z'),
          },
        },
      ];

      (prisma.farm.findMany as jest.Mock).mockResolvedValue(mockFarms);
      (prisma.farmCrop.findMany as jest.Mock).mockResolvedValue(mockFarmCrops);

      const response = await GET();

      expect(response.status).toBe(200);

      const responseData = await response.json();
      expect(responseData).toEqual({
        success: true,
        data: {
          totalFarms: 3,
          totalHectares: 600,
          farmsByState: [{ name: 'SP', value: 3 }],
          farmsByCrop: [{ name: 'Soja', value: 3 }],
          landUse: [
            { name: 'Área Agricultável', value: 430 },
            { name: 'Vegetação', value: 170 },
          ],
        },
      });
    });
  });
});
