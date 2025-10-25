import { cropApi } from './crop.api';
import { Crop, CropFormData } from '../model';

// Mock do fetch global
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('Crop API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('deve retornar lista de culturas quando API responde com sucesso', async () => {
      const mockCrops: Crop[] = [
        {
          id: '1',
          name: 'Soja',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: '2',
          name: 'Milho',
          createdAt: new Date('2024-01-02'),
          updatedAt: new Date('2024-01-02'),
        },
        {
          id: '3',
          name: 'Algodão',
          createdAt: new Date('2024-01-03'),
          updatedAt: new Date('2024-01-03'),
        },
      ];

      const mockResponse = {
        success: true,
        data: mockCrops,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await cropApi.getAll();

      expect(mockFetch).toHaveBeenCalledWith('/api/crops');
      expect(result).toEqual(mockCrops);
    });

    it('deve lançar erro quando resposta não é ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(cropApi.getAll()).rejects.toThrow('Erro ao buscar culturas');
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

      await expect(cropApi.getAll()).rejects.toThrow('Erro interno do servidor');
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

      await expect(cropApi.getAll()).rejects.toThrow('Erro ao buscar culturas');
    });

    it('deve lançar erro padrão quando message não está presente', async () => {
      const mockResponse = {
        success: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(cropApi.getAll()).rejects.toThrow('Erro ao buscar culturas');
    });
  });

  describe('getById', () => {
    it('deve retornar cultura quando encontrada', async () => {
      const mockCrop: Crop = {
        id: '1',
        name: 'Soja',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const mockResponse = {
        success: true,
        data: mockCrop,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await cropApi.getById('1');

      expect(mockFetch).toHaveBeenCalledWith('/api/crops/1');
      expect(result).toEqual(mockCrop);
    });

    it('deve retornar null quando cultura não é encontrada (404)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await cropApi.getById('999');

      expect(mockFetch).toHaveBeenCalledWith('/api/crops/999');
      expect(result).toBeNull();
    });

    it('deve lançar erro quando resposta não é ok e não é 404', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(cropApi.getById('1')).rejects.toThrow('Erro ao buscar cultura');
    });

    it('deve lançar erro quando API retorna success false', async () => {
      const mockResponse = {
        success: false,
        message: 'Cultura não encontrada',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(cropApi.getById('1')).rejects.toThrow('Cultura não encontrada');
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

      await expect(cropApi.getById('1')).rejects.toThrow('Erro ao buscar cultura');
    });
  });

  describe('create', () => {
    it('deve criar cultura com sucesso', async () => {
      const mockFormData: CropFormData = {
        name: 'Café',
      };

      const mockCrop: Crop = {
        id: '4',
        name: 'Café',
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04'),
      };

      const mockResponse = {
        success: true,
        data: mockCrop,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await cropApi.create(mockFormData);

      expect(mockFetch).toHaveBeenCalledWith('/api/crops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockFormData),
      });
      expect(result).toEqual(mockCrop);
    });

    it('deve lançar erro quando API retorna success false', async () => {
      const mockFormData: CropFormData = {
        name: 'Café',
      };

      const mockResponse = {
        success: false,
        message: 'Nome da cultura já existe',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(cropApi.create(mockFormData)).rejects.toThrow('Nome da cultura já existe');
    });

    it('deve lançar erro quando data não está presente', async () => {
      const mockFormData: CropFormData = {
        name: 'Café',
      };

      const mockResponse = {
        success: true,
        data: null,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(cropApi.create(mockFormData)).rejects.toThrow('Erro ao criar cultura');
    });

    it('deve lançar erro padrão quando message não está presente', async () => {
      const mockFormData: CropFormData = {
        name: 'Café',
      };

      const mockResponse = {
        success: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(cropApi.create(mockFormData)).rejects.toThrow('Erro ao criar cultura');
    });
  });

  describe('update', () => {
    it('deve atualizar cultura com sucesso', async () => {
      const mockFormData: CropFormData = {
        name: 'Café Especial',
      };

      const mockCrop: Crop = {
        id: '4',
        name: 'Café Especial',
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-05'),
      };

      const mockResponse = {
        success: true,
        data: mockCrop,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await cropApi.update('4', mockFormData);

      expect(mockFetch).toHaveBeenCalledWith('/api/crops/4', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockFormData),
      });
      expect(result).toEqual(mockCrop);
    });

    it('deve lançar erro quando API retorna success false', async () => {
      const mockFormData: CropFormData = {
        name: 'Café Especial',
      };

      const mockResponse = {
        success: false,
        message: 'Cultura não encontrada',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(cropApi.update('999', mockFormData)).rejects.toThrow('Cultura não encontrada');
    });

    it('deve lançar erro quando data não está presente', async () => {
      const mockFormData: CropFormData = {
        name: 'Café Especial',
      };

      const mockResponse = {
        success: true,
        data: null,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(cropApi.update('4', mockFormData)).rejects.toThrow('Erro ao atualizar cultura');
    });

    it('deve lançar erro padrão quando message não está presente', async () => {
      const mockFormData: CropFormData = {
        name: 'Café Especial',
      };

      const mockResponse = {
        success: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(cropApi.update('4', mockFormData)).rejects.toThrow('Erro ao atualizar cultura');
    });
  });

  describe('delete', () => {
    it('deve deletar cultura com sucesso', async () => {
      const mockResponse = {
        success: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await cropApi.delete('4');

      expect(mockFetch).toHaveBeenCalledWith('/api/crops/4', {
        method: 'DELETE',
      });
    });

    it('deve lançar erro quando API retorna success false', async () => {
      const mockResponse = {
        success: false,
        message: 'Cultura não encontrada',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(cropApi.delete('999')).rejects.toThrow('Cultura não encontrada');
    });

    it('deve lançar erro padrão quando message não está presente', async () => {
      const mockResponse = {
        success: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(cropApi.delete('4')).rejects.toThrow('Erro ao deletar cultura');
    });
  });

  describe('Casos de erro de rede', () => {
    it('deve lançar erro quando fetch falha', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(cropApi.getAll()).rejects.toThrow('Network error');
    });

    it('deve lançar erro quando JSON parsing falha', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      await expect(cropApi.getAll()).rejects.toThrow('Invalid JSON');
    });
  });

  describe('Validação de parâmetros', () => {
    it('deve chamar getById com ID correto', async () => {
      const mockCrop: Crop = {
        id: '123',
        name: 'Soja',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const mockResponse = {
        success: true,
        data: mockCrop,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await cropApi.getById('123');

      expect(mockFetch).toHaveBeenCalledWith('/api/crops/123');
    });

    it('deve chamar update com ID e dados corretos', async () => {
      const mockFormData: CropFormData = {
        name: 'Soja',
      };

      const mockCrop: Crop = {
        id: '123',
        name: 'Soja',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const mockResponse = {
        success: true,
        data: mockCrop,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await cropApi.update('123', mockFormData);

      expect(mockFetch).toHaveBeenCalledWith('/api/crops/123', {
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

      await cropApi.delete('123');

      expect(mockFetch).toHaveBeenCalledWith('/api/crops/123', {
        method: 'DELETE',
      });
    });
  });

  describe('Headers e Content-Type', () => {
    it('deve enviar Content-Type correto em create', async () => {
      const mockFormData: CropFormData = {
        name: 'Café',
      };

      const mockCrop: Crop = {
        id: '4',
        name: 'Café',
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04'),
      };

      const mockResponse = {
        success: true,
        data: mockCrop,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await cropApi.create(mockFormData);

      expect(mockFetch).toHaveBeenCalledWith('/api/crops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockFormData),
      });
    });

    it('deve enviar Content-Type correto em update', async () => {
      const mockFormData: CropFormData = {
        name: 'Café',
      };

      const mockCrop: Crop = {
        id: '4',
        name: 'Café',
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04'),
      };

      const mockResponse = {
        success: true,
        data: mockCrop,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await cropApi.update('4', mockFormData);

      expect(mockFetch).toHaveBeenCalledWith('/api/crops/4', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockFormData),
      });
    });
  });

  describe('Estrutura de dados', () => {
    it('deve retornar culturas com estrutura correta', async () => {
      const mockCrops: Crop[] = [
        {
          id: '1',
          name: 'Soja',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: '2',
          name: 'Milho',
          createdAt: new Date('2024-01-02'),
          updatedAt: new Date('2024-01-02'),
        },
      ];

      const mockResponse = {
        success: true,
        data: mockCrops,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await cropApi.getAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('createdAt');
      expect(result[0]).toHaveProperty('updatedAt');
      expect(typeof result[0].id).toBe('string');
      expect(typeof result[0].name).toBe('string');
      expect(result[0].createdAt).toBeInstanceOf(Date);
      expect(result[0].updatedAt).toBeInstanceOf(Date);
    });

    it('deve enviar dados corretos em create', async () => {
      const mockFormData: CropFormData = {
        name: 'Cana de Açúcar',
      };

      const mockCrop: Crop = {
        id: '5',
        name: 'Cana de Açúcar',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
      };

      const mockResponse = {
        success: true,
        data: mockCrop,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await cropApi.create(mockFormData);

      expect(mockFetch).toHaveBeenCalledWith('/api/crops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'Cana de Açúcar' }),
      });
    });

    it('deve enviar dados corretos em update', async () => {
      const mockFormData: CropFormData = {
        name: 'Cana de Açúcar Atualizada',
      };

      const mockCrop: Crop = {
        id: '5',
        name: 'Cana de Açúcar Atualizada',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-06'),
      };

      const mockResponse = {
        success: true,
        data: mockCrop,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await cropApi.update('5', mockFormData);

      expect(mockFetch).toHaveBeenCalledWith('/api/crops/5', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'Cana de Açúcar Atualizada' }),
      });
    });
  });

  describe('Cenários específicos de cultura', () => {
    it('deve lidar com nomes de cultura com caracteres especiais', async () => {
      const mockFormData: CropFormData = {
        name: 'Café & Chá',
      };

      const mockCrop: Crop = {
        id: '6',
        name: 'Café & Chá',
        createdAt: new Date('2024-01-06'),
        updatedAt: new Date('2024-01-06'),
      };

      const mockResponse = {
        success: true,
        data: mockCrop,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await cropApi.create(mockFormData);

      expect(result.name).toBe('Café & Chá');
      expect(mockFetch).toHaveBeenCalledWith('/api/crops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'Café & Chá' }),
      });
    });

    it('deve lidar com nomes de cultura longos', async () => {
      const mockFormData: CropFormData = {
        name: 'Cana de Açúcar para Produção de Etanol',
      };

      const mockCrop: Crop = {
        id: '7',
        name: 'Cana de Açúcar para Produção de Etanol',
        createdAt: new Date('2024-01-07'),
        updatedAt: new Date('2024-01-07'),
      };

      const mockResponse = {
        success: true,
        data: mockCrop,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await cropApi.create(mockFormData);

      expect(result.name).toBe('Cana de Açúcar para Produção de Etanol');
    });

    it('deve lidar com lista vazia de culturas', async () => {
      const mockResponse = {
        success: true,
        data: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await cropApi.getAll();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
