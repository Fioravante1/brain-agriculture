import { farmApi } from './farm.api';
import { Farm, FarmFormData } from '../model';

// Mock do fetch global
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('Farm API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('deve retornar lista de fazendas quando API responde com sucesso', async () => {
      const mockFarms: Farm[] = [
        {
          id: '1',
          producerId: '1',
          name: 'Fazenda São João',
          city: 'São Paulo',
          state: 'SP',
          totalArea: 100,
          arableArea: 80,
          vegetationArea: 20,
          farmCrops: [],
          producer: {
            id: '1',
            name: 'João Silva',
            cpfCnpj: '12345678901',
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
          farmCrops: [],
          producer: {
            id: '2',
            name: 'Maria Santos',
            cpfCnpj: '12345678000195',
          },
        },
      ];

      const mockResponse = {
        success: true,
        data: mockFarms,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await farmApi.getAll();

      expect(mockFetch).toHaveBeenCalledWith('/api/farms');
      expect(result).toEqual(mockFarms);
    });

    it('deve retornar lista de fazendas filtrada por producerId quando fornecido', async () => {
      const mockFarms: Farm[] = [
        {
          id: '1',
          producerId: '1',
          name: 'Fazenda São João',
          city: 'São Paulo',
          state: 'SP',
          totalArea: 100,
          arableArea: 80,
          vegetationArea: 20,
          farmCrops: [],
          producer: {
            id: '1',
            name: 'João Silva',
            cpfCnpj: '12345678901',
          },
        },
      ];

      const mockResponse = {
        success: true,
        data: mockFarms,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await farmApi.getAll('1');

      expect(mockFetch).toHaveBeenCalledWith('/api/farms?producerId=1');
      expect(result).toEqual(mockFarms);
    });

    it('deve lançar erro quando resposta não é ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(farmApi.getAll()).rejects.toThrow('Erro ao buscar fazendas');
    });

    it('deve lançar erro quando API retorna success false', async () => {
      const mockResponse = {
        success: false,
        message: 'Erro interno do servidor',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(farmApi.getAll()).rejects.toThrow('Erro interno do servidor');
    });

    it('deve lançar erro quando data não está presente', async () => {
      const mockResponse = {
        success: true,
        data: null,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(farmApi.getAll()).rejects.toThrow('Erro ao buscar fazendas');
    });

    it('deve lançar erro padrão quando message não está presente', async () => {
      const mockResponse = {
        success: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(farmApi.getAll()).rejects.toThrow('Erro ao buscar fazendas');
    });
  });

  describe('getById', () => {
    it('deve retornar fazenda quando encontrada', async () => {
      const mockFarm: Farm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
        farmCrops: [],
        producer: {
          id: '1',
          name: 'João Silva',
          cpfCnpj: '12345678901',
        },
      };

      const mockResponse = {
        success: true,
        data: mockFarm,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await farmApi.getById('1');

      expect(mockFetch).toHaveBeenCalledWith('/api/farms/1');
      expect(result).toEqual(mockFarm);
    });

    it('deve retornar null quando fazenda não é encontrada (404)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await farmApi.getById('999');

      expect(mockFetch).toHaveBeenCalledWith('/api/farms/999');
      expect(result).toBeNull();
    });

    it('deve lançar erro quando resposta não é ok e não é 404', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(farmApi.getById('1')).rejects.toThrow('Erro ao buscar fazenda');
    });

    it('deve lançar erro quando API retorna success false', async () => {
      const mockResponse = {
        success: false,
        message: 'Fazenda não encontrada',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(farmApi.getById('1')).rejects.toThrow('Fazenda não encontrada');
    });

    it('deve lançar erro quando data não está presente', async () => {
      const mockResponse = {
        success: true,
        data: null,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(farmApi.getById('1')).rejects.toThrow('Erro ao buscar fazenda');
    });
  });

  describe('create', () => {
    it('deve criar fazenda com sucesso', async () => {
      const mockFormData: FarmFormData = {
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      const mockFarm: Farm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
        farmCrops: [],
        producer: {
          id: '1',
          name: 'João Silva',
          cpfCnpj: '12345678901',
        },
      };

      const mockResponse = {
        success: true,
        data: mockFarm,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await farmApi.create(mockFormData);

      expect(mockFetch).toHaveBeenCalledWith('/api/farms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockFormData),
      });
      expect(result).toEqual(mockFarm);
    });

    it('deve lançar erro quando API retorna success false', async () => {
      const mockFormData: FarmFormData = {
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      const mockResponse = {
        success: false,
        message: 'Produtor não encontrado',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(farmApi.create(mockFormData)).rejects.toThrow('Produtor não encontrado');
    });

    it('deve lançar erro quando data não está presente', async () => {
      const mockFormData: FarmFormData = {
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      const mockResponse = {
        success: true,
        data: null,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(farmApi.create(mockFormData)).rejects.toThrow('Erro ao criar fazenda');
    });

    it('deve lançar erro padrão quando message não está presente', async () => {
      const mockFormData: FarmFormData = {
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      const mockResponse = {
        success: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(farmApi.create(mockFormData)).rejects.toThrow('Erro ao criar fazenda');
    });
  });

  describe('update', () => {
    it('deve atualizar fazenda com sucesso', async () => {
      const mockFormData: FarmFormData = {
        producerId: '1',
        name: 'Fazenda São João Atualizada',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 120,
        arableArea: 90,
        vegetationArea: 30,
      };

      const mockFarm: Farm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda São João Atualizada',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 120,
        arableArea: 90,
        vegetationArea: 30,
        farmCrops: [],
        producer: {
          id: '1',
          name: 'João Silva',
          cpfCnpj: '12345678901',
        },
      };

      const mockResponse = {
        success: true,
        data: mockFarm,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await farmApi.update('1', mockFormData);

      expect(mockFetch).toHaveBeenCalledWith('/api/farms/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockFormData),
      });
      expect(result).toEqual(mockFarm);
    });

    it('deve lançar erro quando API retorna success false', async () => {
      const mockFormData: FarmFormData = {
        producerId: '1',
        name: 'Fazenda São João Atualizada',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 120,
        arableArea: 90,
        vegetationArea: 30,
      };

      const mockResponse = {
        success: false,
        message: 'Fazenda não encontrada',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(farmApi.update('999', mockFormData)).rejects.toThrow('Fazenda não encontrada');
    });

    it('deve lançar erro quando data não está presente', async () => {
      const mockFormData: FarmFormData = {
        producerId: '1',
        name: 'Fazenda São João Atualizada',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 120,
        arableArea: 90,
        vegetationArea: 30,
      };

      const mockResponse = {
        success: true,
        data: null,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(farmApi.update('1', mockFormData)).rejects.toThrow('Erro ao atualizar fazenda');
    });

    it('deve lançar erro padrão quando message não está presente', async () => {
      const mockFormData: FarmFormData = {
        producerId: '1',
        name: 'Fazenda São João Atualizada',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 120,
        arableArea: 90,
        vegetationArea: 30,
      };

      const mockResponse = {
        success: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(farmApi.update('1', mockFormData)).rejects.toThrow('Erro ao atualizar fazenda');
    });
  });

  describe('delete', () => {
    it('deve deletar fazenda com sucesso', async () => {
      const mockResponse = {
        success: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await farmApi.delete('1');

      expect(mockFetch).toHaveBeenCalledWith('/api/farms/1', {
        method: 'DELETE',
      });
    });

    it('deve lançar erro quando API retorna success false', async () => {
      const mockResponse = {
        success: false,
        message: 'Fazenda não encontrada',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(farmApi.delete('999')).rejects.toThrow('Fazenda não encontrada');
    });

    it('deve lançar erro padrão quando message não está presente', async () => {
      const mockResponse = {
        success: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(farmApi.delete('1')).rejects.toThrow('Erro ao deletar fazenda');
    });
  });

  describe('Casos de erro de rede', () => {
    it('deve lançar erro quando fetch falha', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(farmApi.getAll()).rejects.toThrow('Network error');
    });

    it('deve lançar erro quando JSON parsing falha', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      await expect(farmApi.getAll()).rejects.toThrow('Invalid JSON');
    });
  });

  describe('Validação de parâmetros', () => {
    it('deve chamar getById com ID correto', async () => {
      const mockFarm: Farm = {
        id: '123',
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
        farmCrops: [],
        producer: {
          id: '1',
          name: 'João Silva',
          cpfCnpj: '12345678901',
        },
      };

      const mockResponse = {
        success: true,
        data: mockFarm,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await farmApi.getById('123');

      expect(mockFetch).toHaveBeenCalledWith('/api/farms/123');
    });

    it('deve chamar update com ID e dados corretos', async () => {
      const mockFormData: FarmFormData = {
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      const mockFarm: Farm = {
        id: '123',
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
        farmCrops: [],
        producer: {
          id: '1',
          name: 'João Silva',
          cpfCnpj: '12345678901',
        },
      };

      const mockResponse = {
        success: true,
        data: mockFarm,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await farmApi.update('123', mockFormData);

      expect(mockFetch).toHaveBeenCalledWith('/api/farms/123', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockFormData),
      });
    });

    it('deve chamar delete com ID correto', async () => {
      const mockResponse = {
        success: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await farmApi.delete('123');

      expect(mockFetch).toHaveBeenCalledWith('/api/farms/123', {
        method: 'DELETE',
      });
    });
  });

  describe('Headers e Content-Type', () => {
    it('deve enviar Content-Type correto em create', async () => {
      const mockFormData: FarmFormData = {
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      const mockFarm: Farm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
        farmCrops: [],
        producer: {
          id: '1',
          name: 'João Silva',
          cpfCnpj: '12345678901',
        },
      };

      const mockResponse = {
        success: true,
        data: mockFarm,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await farmApi.create(mockFormData);

      expect(mockFetch).toHaveBeenCalledWith('/api/farms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockFormData),
      });
    });

    it('deve enviar Content-Type correto em update', async () => {
      const mockFormData: FarmFormData = {
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      };

      const mockFarm: Farm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda São João',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
        farmCrops: [],
        producer: {
          id: '1',
          name: 'João Silva',
          cpfCnpj: '12345678901',
        },
      };

      const mockResponse = {
        success: true,
        data: mockFarm,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await farmApi.update('1', mockFormData);

      expect(mockFetch).toHaveBeenCalledWith('/api/farms/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockFormData),
      });
    });
  });

  describe('Filtros e parâmetros de query', () => {
    it('deve construir URL corretamente com producerId', async () => {
      const mockFarms: Farm[] = [
        {
          id: '1',
          producerId: '1',
          name: 'Fazenda São João',
          city: 'São Paulo',
          state: 'SP',
          totalArea: 100,
          arableArea: 80,
          vegetationArea: 20,
          farmCrops: [],
          producer: {
            id: '1',
            name: 'João Silva',
            cpfCnpj: '12345678901',
          },
        },
      ];

      const mockResponse = {
        success: true,
        data: mockFarms,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await farmApi.getAll('producer-123');

      expect(mockFetch).toHaveBeenCalledWith('/api/farms?producerId=producer-123');
    });

    it('deve construir URL corretamente sem producerId', async () => {
      const mockFarms: Farm[] = [];

      const mockResponse = {
        success: true,
        data: mockFarms,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await farmApi.getAll();

      expect(mockFetch).toHaveBeenCalledWith('/api/farms');
    });
  });
});
