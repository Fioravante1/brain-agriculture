import { farmCropApi } from './farm-crop.api';
import { FarmCrop, FarmCropFormData } from '../model';

// Mock do fetch global
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('farmCropApi', () => {
  const mockFarmCrop: FarmCrop = {
    id: '1',
    farmId: '1',
    cropId: '1',
    harvestId: '1',
    createdAt: new Date('2021-01-01T00:00:00.000Z'),
    updatedAt: new Date('2021-01-01T00:00:00.000Z'),
    farm: {
      id: '1',
      name: 'Fazenda São João',
      producer: {
        id: '1',
        name: 'João Silva',
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

  const mockFarmCrops: FarmCrop[] = [
    mockFarmCrop,
    {
      id: '2',
      farmId: '2',
      cropId: '2',
      harvestId: '2',
      createdAt: new Date('2021-01-01T00:00:00.000Z'),
      updatedAt: new Date('2021-01-01T00:00:00.000Z'),
      farm: {
        id: '2',
        name: 'Fazenda Santa Maria',
        producer: {
          id: '2',
          name: 'Maria Santos',
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

  const mockFormData: FarmCropFormData = {
    farmId: '1',
    cropId: '1',
    harvestId: '1',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('deve retornar lista de associações com sucesso', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          success: true,
          data: mockFarmCrops,
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await farmCropApi.getAll();

      expect(mockFetch).toHaveBeenCalledWith('/api/farm-crops');
      expect(result).toEqual(mockFarmCrops);
    });

    it('deve lançar erro quando response não é ok', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(farmCropApi.getAll()).rejects.toThrow('Erro ao buscar associações');
    });

    it('deve lançar erro quando success é false', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          success: false,
          message: 'Erro interno do servidor',
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(farmCropApi.getAll()).rejects.toThrow('Erro interno do servidor');
    });

    it('deve lançar erro quando data é undefined', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          success: true,
          data: undefined,
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(farmCropApi.getAll()).rejects.toThrow('Erro ao buscar associações');
    });

    it('deve lançar erro padrão quando message é undefined', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          success: false,
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(farmCropApi.getAll()).rejects.toThrow('Erro ao buscar associações');
    });
  });

  describe('getById', () => {
    it('deve retornar associação por ID com sucesso', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          success: true,
          data: mockFarmCrop,
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await farmCropApi.getById('1');

      expect(mockFetch).toHaveBeenCalledWith('/api/farm-crops/1');
      expect(result).toEqual(mockFarmCrop);
    });

    it('deve retornar null quando status é 404', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await farmCropApi.getById('999');

      expect(mockFetch).toHaveBeenCalledWith('/api/farm-crops/999');
      expect(result).toBeNull();
    });

    it('deve lançar erro quando response não é ok e status não é 404', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(farmCropApi.getById('1')).rejects.toThrow('Erro ao buscar associação');
    });

    it('deve lançar erro quando success é false', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          success: false,
          message: 'Associação não encontrada',
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(farmCropApi.getById('1')).rejects.toThrow('Associação não encontrada');
    });

    it('deve lançar erro quando data é undefined', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          success: true,
          data: undefined,
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(farmCropApi.getById('1')).rejects.toThrow('Erro ao buscar associação');
    });

    it('deve lançar erro padrão quando message é undefined', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          success: false,
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(farmCropApi.getById('1')).rejects.toThrow('Erro ao buscar associação');
    });
  });

  describe('create', () => {
    it('deve criar associação com sucesso', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          success: true,
          data: mockFarmCrop,
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await farmCropApi.create(mockFormData);

      expect(mockFetch).toHaveBeenCalledWith('/api/farm-crops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockFormData),
      });
      expect(result).toEqual(mockFarmCrop);
    });

    it('deve lançar erro quando success é false', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          success: false,
          message: 'Erro de validação',
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(farmCropApi.create(mockFormData)).rejects.toThrow('Erro de validação');
    });

    it('deve lançar erro quando data é undefined', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          success: true,
          data: undefined,
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(farmCropApi.create(mockFormData)).rejects.toThrow('Erro ao criar associação');
    });

    it('deve lançar erro padrão quando message é undefined', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          success: false,
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(farmCropApi.create(mockFormData)).rejects.toThrow('Erro ao criar associação');
    });

    it('deve enviar dados corretos no body', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          success: true,
          data: mockFarmCrop,
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await farmCropApi.create(mockFormData);

      expect(mockFetch).toHaveBeenCalledWith('/api/farm-crops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockFormData),
      });
    });

    it('deve funcionar com diferentes dados de formulário', async () => {
      const differentFormData: FarmCropFormData = {
        farmId: '2',
        cropId: '3',
        harvestId: '4',
      };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          success: true,
          data: mockFarmCrop,
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await farmCropApi.create(differentFormData);

      expect(mockFetch).toHaveBeenCalledWith('/api/farm-crops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(differentFormData),
      });
    });
  });

  describe('delete', () => {
    it('deve deletar associação com sucesso', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          success: true,
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await farmCropApi.delete('1');

      expect(mockFetch).toHaveBeenCalledWith('/api/farm-crops/1', {
        method: 'DELETE',
      });
    });

    it('deve lançar erro quando success é false', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          success: false,
          message: 'Erro ao deletar associação',
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(farmCropApi.delete('1')).rejects.toThrow('Erro ao deletar associação');
    });

    it('deve lançar erro padrão quando message é undefined', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          success: false,
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(farmCropApi.delete('1')).rejects.toThrow('Erro ao deletar associação');
    });

    it('deve funcionar com diferentes IDs', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          success: true,
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await farmCropApi.delete('999');

      expect(mockFetch).toHaveBeenCalledWith('/api/farm-crops/999', {
        method: 'DELETE',
      });
    });
  });

  describe('integração', () => {
    it('deve fazer chamadas para URLs corretas', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          success: true,
          data: mockFarmCrop,
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await farmCropApi.getAll();
      await farmCropApi.getById('1');
      await farmCropApi.create(mockFormData);
      await farmCropApi.delete('1');

      expect(mockFetch).toHaveBeenCalledWith('/api/farm-crops');
      expect(mockFetch).toHaveBeenCalledWith('/api/farm-crops/1');
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/farm-crops',
        expect.objectContaining({
          method: 'POST',
        }),
      );
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/farm-crops/1',
        expect.objectContaining({
          method: 'DELETE',
        }),
      );
    });

    it('deve usar métodos HTTP corretos', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          success: true,
          data: mockFarmCrop,
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await farmCropApi.getAll();
      await farmCropApi.getById('1');
      await farmCropApi.create(mockFormData);
      await farmCropApi.delete('1');

      expect(mockFetch).toHaveBeenNthCalledWith(1, '/api/farm-crops');
      expect(mockFetch).toHaveBeenNthCalledWith(2, '/api/farm-crops/1');
      expect(mockFetch).toHaveBeenNthCalledWith(
        3,
        '/api/farm-crops',
        expect.objectContaining({
          method: 'POST',
        }),
      );
      expect(mockFetch).toHaveBeenNthCalledWith(
        4,
        '/api/farm-crops/1',
        expect.objectContaining({
          method: 'DELETE',
        }),
      );
    });

    it('deve usar headers corretos para POST', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          success: true,
          data: mockFarmCrop,
        }),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await farmCropApi.create(mockFormData);

      expect(mockFetch).toHaveBeenCalledWith('/api/farm-crops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockFormData),
      });
    });
  });

  describe('tratamento de erros', () => {
    it('deve tratar erro de rede', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(farmCropApi.getAll()).rejects.toThrow('Network error');
    });

    it('deve tratar erro de parsing JSON', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(farmCropApi.getAll()).rejects.toThrow('Invalid JSON');
    });

    it('deve tratar diferentes tipos de erro de resposta', async () => {
      const errorCases = [
        { status: 400, expectedError: 'Erro ao buscar associações' },
        { status: 401, expectedError: 'Erro ao buscar associações' },
        { status: 403, expectedError: 'Erro ao buscar associações' },
        { status: 500, expectedError: 'Erro ao buscar associações' },
      ];

      for (const errorCase of errorCases) {
        const mockResponse = {
          ok: false,
          status: errorCase.status,
        };

        mockFetch.mockResolvedValue(mockResponse);

        await expect(farmCropApi.getAll()).rejects.toThrow(errorCase.expectedError);
      }
    });
  });
});
