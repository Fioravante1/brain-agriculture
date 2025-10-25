import { harvestApi } from './harvest.api';
import { Harvest, HarvestFormData } from '../model';

// Mock do fetch global
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('Harvest API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('deve retornar lista de safras quando API responde com sucesso', async () => {
      const mockHarvests: Harvest[] = [
        {
          id: '1',
          name: 'Safra 2021',
          year: 2021,
          createdAt: new Date('2021-01-01'),
          updatedAt: new Date('2021-01-01'),
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
          name: 'Safra 2023',
          year: 2023,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
      ];

      const mockResponse = {
        success: true,
        data: mockHarvests,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await harvestApi.getAll();

      expect(mockFetch).toHaveBeenCalledWith('/api/harvests');
      expect(result).toEqual(mockHarvests);
    });

    it('deve lançar erro quando resposta não é ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(harvestApi.getAll()).rejects.toThrow('Erro ao buscar safras');
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

      await expect(harvestApi.getAll()).rejects.toThrow('Erro interno do servidor');
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

      await expect(harvestApi.getAll()).rejects.toThrow('Erro ao buscar safras');
    });

    it('deve lançar erro padrão quando message não está presente', async () => {
      const mockResponse = {
        success: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(harvestApi.getAll()).rejects.toThrow('Erro ao buscar safras');
    });
  });

  describe('getById', () => {
    it('deve retornar safra quando encontrada', async () => {
      const mockHarvest: Harvest = {
        id: '1',
        name: 'Safra 2021',
        year: 2021,
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-01'),
      };

      const mockResponse = {
        success: true,
        data: mockHarvest,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await harvestApi.getById('1');

      expect(mockFetch).toHaveBeenCalledWith('/api/harvests/1');
      expect(result).toEqual(mockHarvest);
    });

    it('deve retornar null quando safra não é encontrada (404)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await harvestApi.getById('999');

      expect(mockFetch).toHaveBeenCalledWith('/api/harvests/999');
      expect(result).toBeNull();
    });

    it('deve lançar erro quando resposta não é ok e não é 404', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(harvestApi.getById('1')).rejects.toThrow('Erro ao buscar safra');
    });

    it('deve lançar erro quando API retorna success false', async () => {
      const mockResponse = {
        success: false,
        message: 'Safra não encontrada',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(harvestApi.getById('1')).rejects.toThrow('Safra não encontrada');
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

      await expect(harvestApi.getById('1')).rejects.toThrow('Erro ao buscar safra');
    });
  });

  describe('create', () => {
    it('deve criar safra com sucesso', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2024',
        year: 2024,
      };

      const mockHarvest: Harvest = {
        id: '4',
        name: 'Safra 2024',
        year: 2024,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const mockResponse = {
        success: true,
        data: mockHarvest,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await harvestApi.create(mockFormData);

      expect(mockFetch).toHaveBeenCalledWith('/api/harvests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockFormData),
      });
      expect(result).toEqual(mockHarvest);
    });

    it('deve lançar erro quando API retorna success false', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2024',
        year: 2024,
      };

      const mockResponse = {
        success: false,
        message: 'Nome da safra já existe',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(harvestApi.create(mockFormData)).rejects.toThrow('Nome da safra já existe');
    });

    it('deve lançar erro quando data não está presente', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2024',
        year: 2024,
      };

      const mockResponse = {
        success: true,
        data: null,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(harvestApi.create(mockFormData)).rejects.toThrow('Erro ao criar safra');
    });

    it('deve lançar erro padrão quando message não está presente', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2024',
        year: 2024,
      };

      const mockResponse = {
        success: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(harvestApi.create(mockFormData)).rejects.toThrow('Erro ao criar safra');
    });
  });

  describe('update', () => {
    it('deve atualizar safra com sucesso', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2024 Atualizada',
        year: 2024,
      };

      const mockHarvest: Harvest = {
        id: '4',
        name: 'Safra 2024 Atualizada',
        year: 2024,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };

      const mockResponse = {
        success: true,
        data: mockHarvest,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await harvestApi.update('4', mockFormData);

      expect(mockFetch).toHaveBeenCalledWith('/api/harvests/4', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockFormData),
      });
      expect(result).toEqual(mockHarvest);
    });

    it('deve lançar erro quando API retorna success false', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2024 Atualizada',
        year: 2024,
      };

      const mockResponse = {
        success: false,
        message: 'Safra não encontrada',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(harvestApi.update('999', mockFormData)).rejects.toThrow('Safra não encontrada');
    });

    it('deve lançar erro quando data não está presente', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2024 Atualizada',
        year: 2024,
      };

      const mockResponse = {
        success: true,
        data: null,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(harvestApi.update('4', mockFormData)).rejects.toThrow('Erro ao atualizar safra');
    });

    it('deve lançar erro padrão quando message não está presente', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2024 Atualizada',
        year: 2024,
      };

      const mockResponse = {
        success: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(harvestApi.update('4', mockFormData)).rejects.toThrow('Erro ao atualizar safra');
    });
  });

  describe('delete', () => {
    it('deve deletar safra com sucesso', async () => {
      const mockResponse = {
        success: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await harvestApi.delete('4');

      expect(mockFetch).toHaveBeenCalledWith('/api/harvests/4', {
        method: 'DELETE',
      });
    });

    it('deve lançar erro quando API retorna success false', async () => {
      const mockResponse = {
        success: false,
        message: 'Safra não encontrada',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(harvestApi.delete('999')).rejects.toThrow('Safra não encontrada');
    });

    it('deve lançar erro padrão quando message não está presente', async () => {
      const mockResponse = {
        success: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(harvestApi.delete('4')).rejects.toThrow('Erro ao deletar safra');
    });
  });

  describe('Casos de erro de rede', () => {
    it('deve lançar erro quando fetch falha', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(harvestApi.getAll()).rejects.toThrow('Network error');
    });

    it('deve lançar erro quando JSON parsing falha', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      await expect(harvestApi.getAll()).rejects.toThrow('Invalid JSON');
    });
  });

  describe('Validação de parâmetros', () => {
    it('deve chamar getById com ID correto', async () => {
      const mockHarvest: Harvest = {
        id: '123',
        name: 'Safra 2021',
        year: 2021,
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-01'),
      };

      const mockResponse = {
        success: true,
        data: mockHarvest,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await harvestApi.getById('123');

      expect(mockFetch).toHaveBeenCalledWith('/api/harvests/123');
    });

    it('deve chamar update com ID e dados corretos', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2021',
        year: 2021,
      };

      const mockHarvest: Harvest = {
        id: '123',
        name: 'Safra 2021',
        year: 2021,
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-01'),
      };

      const mockResponse = {
        success: true,
        data: mockHarvest,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await harvestApi.update('123', mockFormData);

      expect(mockFetch).toHaveBeenCalledWith('/api/harvests/123', {
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

      await harvestApi.delete('123');

      expect(mockFetch).toHaveBeenCalledWith('/api/harvests/123', {
        method: 'DELETE',
      });
    });
  });

  describe('Headers e Content-Type', () => {
    it('deve enviar Content-Type correto em create', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2024',
        year: 2024,
      };

      const mockHarvest: Harvest = {
        id: '4',
        name: 'Safra 2024',
        year: 2024,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const mockResponse = {
        success: true,
        data: mockHarvest,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await harvestApi.create(mockFormData);

      expect(mockFetch).toHaveBeenCalledWith('/api/harvests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockFormData),
      });
    });

    it('deve enviar Content-Type correto em update', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2024',
        year: 2024,
      };

      const mockHarvest: Harvest = {
        id: '4',
        name: 'Safra 2024',
        year: 2024,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const mockResponse = {
        success: true,
        data: mockHarvest,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await harvestApi.update('4', mockFormData);

      expect(mockFetch).toHaveBeenCalledWith('/api/harvests/4', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockFormData),
      });
    });
  });

  describe('Estrutura de dados', () => {
    it('deve retornar safras com estrutura correta', async () => {
      const mockHarvests: Harvest[] = [
        {
          id: '1',
          name: 'Safra 2021',
          year: 2021,
          createdAt: new Date('2021-01-01'),
          updatedAt: new Date('2021-01-01'),
        },
        {
          id: '2',
          name: 'Safra 2022',
          year: 2022,
          createdAt: new Date('2022-01-01'),
          updatedAt: new Date('2022-01-01'),
        },
      ];

      const mockResponse = {
        success: true,
        data: mockHarvests,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await harvestApi.getAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('year');
      expect(result[0]).toHaveProperty('createdAt');
      expect(result[0]).toHaveProperty('updatedAt');
      expect(typeof result[0].id).toBe('string');
      expect(typeof result[0].name).toBe('string');
      expect(typeof result[0].year).toBe('number');
      expect(result[0].createdAt).toBeInstanceOf(Date);
      expect(result[0].updatedAt).toBeInstanceOf(Date);
    });

    it('deve enviar dados corretos em create', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2024',
        year: 2024,
      };

      const mockHarvest: Harvest = {
        id: '5',
        name: 'Safra 2024',
        year: 2024,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const mockResponse = {
        success: true,
        data: mockHarvest,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await harvestApi.create(mockFormData);

      expect(mockFetch).toHaveBeenCalledWith('/api/harvests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'Safra 2024', year: 2024 }),
      });
    });

    it('deve enviar dados corretos em update', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2024 Atualizada',
        year: 2024,
      };

      const mockHarvest: Harvest = {
        id: '5',
        name: 'Safra 2024 Atualizada',
        year: 2024,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };

      const mockResponse = {
        success: true,
        data: mockHarvest,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await harvestApi.update('5', mockFormData);

      expect(mockFetch).toHaveBeenCalledWith('/api/harvests/5', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'Safra 2024 Atualizada', year: 2024 }),
      });
    });
  });

  describe('Cenários específicos de safra', () => {
    it('deve lidar com nomes de safra com caracteres especiais', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2024 & Colheita',
        year: 2024,
      };

      const mockHarvest: Harvest = {
        id: '6',
        name: 'Safra 2024 & Colheita',
        year: 2024,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const mockResponse = {
        success: true,
        data: mockHarvest,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await harvestApi.create(mockFormData);

      expect(result.name).toBe('Safra 2024 & Colheita');
      expect(mockFetch).toHaveBeenCalledWith('/api/harvests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'Safra 2024 & Colheita', year: 2024 }),
      });
    });

    it('deve lidar com nomes de safra longos', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2024 - Colheita de Soja e Milho',
        year: 2024,
      };

      const mockHarvest: Harvest = {
        id: '7',
        name: 'Safra 2024 - Colheita de Soja e Milho',
        year: 2024,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const mockResponse = {
        success: true,
        data: mockHarvest,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await harvestApi.create(mockFormData);

      expect(result.name).toBe('Safra 2024 - Colheita de Soja e Milho');
    });

    it('deve lidar com anos diferentes', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra 2025',
        year: 2025,
      };

      const mockHarvest: Harvest = {
        id: '8',
        name: 'Safra 2025',
        year: 2025,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      };

      const mockResponse = {
        success: true,
        data: mockHarvest,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await harvestApi.create(mockFormData);

      expect(result.year).toBe(2025);
    });

    it('deve lidar com lista vazia de safras', async () => {
      const mockResponse = {
        success: true,
        data: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await harvestApi.getAll();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('deve lidar com anos negativos', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra Histórica',
        year: 1990,
      };

      const mockHarvest: Harvest = {
        id: '9',
        name: 'Safra Histórica',
        year: 1990,
        createdAt: new Date('1990-01-01'),
        updatedAt: new Date('1990-01-01'),
      };

      const mockResponse = {
        success: true,
        data: mockHarvest,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await harvestApi.create(mockFormData);

      expect(result.year).toBe(1990);
    });

    it('deve lidar com anos futuros', async () => {
      const mockFormData: HarvestFormData = {
        name: 'Safra Futura',
        year: 2030,
      };

      const mockHarvest: Harvest = {
        id: '10',
        name: 'Safra Futura',
        year: 2030,
        createdAt: new Date('2030-01-01'),
        updatedAt: new Date('2030-01-01'),
      };

      const mockResponse = {
        success: true,
        data: mockHarvest,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await harvestApi.create(mockFormData);

      expect(result.year).toBe(2030);
    });
  });
});
