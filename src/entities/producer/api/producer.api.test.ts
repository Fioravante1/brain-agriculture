import { producerApi } from './producer.api';
import { Producer, ProducerFormData } from '../model';

// Mock do fetch global
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('Producer API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('deve retornar lista de produtores quando API responde com sucesso', async () => {
      const mockProducers: Producer[] = [
        {
          id: '1',
          name: 'João Silva',
          cpfCnpj: '12345678901',
          farms: [],
        },
        {
          id: '2',
          name: 'Maria Santos',
          cpfCnpj: '12345678000195',
          farms: [],
        },
      ];

      const mockResponse = {
        success: true,
        data: mockProducers,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await producerApi.getAll();

      expect(mockFetch).toHaveBeenCalledWith('/api/producers');
      expect(result).toEqual(mockProducers);
    });

    it('deve lançar erro quando resposta não é ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(producerApi.getAll()).rejects.toThrow('Erro ao buscar produtores');
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

      await expect(producerApi.getAll()).rejects.toThrow('Erro interno do servidor');
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

      await expect(producerApi.getAll()).rejects.toThrow('Erro ao buscar produtores');
    });

    it('deve lançar erro padrão quando message não está presente', async () => {
      const mockResponse = {
        success: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(producerApi.getAll()).rejects.toThrow('Erro ao buscar produtores');
    });
  });

  describe('getById', () => {
    it('deve retornar produtor quando encontrado', async () => {
      const mockProducer: Producer = {
        id: '1',
        name: 'João Silva',
        cpfCnpj: '12345678901',
        farms: [],
      };

      const mockResponse = {
        success: true,
        data: mockProducer,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await producerApi.getById('1');

      expect(mockFetch).toHaveBeenCalledWith('/api/producers/1');
      expect(result).toEqual(mockProducer);
    });

    it('deve retornar null quando produtor não é encontrado (404)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await producerApi.getById('999');

      expect(mockFetch).toHaveBeenCalledWith('/api/producers/999');
      expect(result).toBeNull();
    });

    it('deve lançar erro quando resposta não é ok e não é 404', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(producerApi.getById('1')).rejects.toThrow('Erro ao buscar produtor');
    });

    it('deve lançar erro quando API retorna success false', async () => {
      const mockResponse = {
        success: false,
        message: 'Produtor não encontrado',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(producerApi.getById('1')).rejects.toThrow('Produtor não encontrado');
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

      await expect(producerApi.getById('1')).rejects.toThrow('Erro ao buscar produtor');
    });
  });

  describe('create', () => {
    it('deve criar produtor com sucesso', async () => {
      const mockFormData: ProducerFormData = {
        name: 'João Silva',
        cpfCnpj: '12345678901',
      };

      const mockProducer: Producer = {
        id: '1',
        name: 'João Silva',
        cpfCnpj: '12345678901',
        farms: [],
      };

      const mockResponse = {
        success: true,
        data: mockProducer,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await producerApi.create(mockFormData);

      expect(mockFetch).toHaveBeenCalledWith('/api/producers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockFormData),
      });
      expect(result).toEqual(mockProducer);
    });

    it('deve lançar erro quando API retorna success false', async () => {
      const mockFormData: ProducerFormData = {
        name: 'João Silva',
        cpfCnpj: '12345678901',
      };

      const mockResponse = {
        success: false,
        message: 'CPF/CNPJ já cadastrado',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(producerApi.create(mockFormData)).rejects.toThrow('CPF/CNPJ já cadastrado');
    });

    it('deve lançar erro quando data não está presente', async () => {
      const mockFormData: ProducerFormData = {
        name: 'João Silva',
        cpfCnpj: '12345678901',
      };

      const mockResponse = {
        success: true,
        data: null,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(producerApi.create(mockFormData)).rejects.toThrow('Erro ao criar produtor');
    });

    it('deve lançar erro padrão quando message não está presente', async () => {
      const mockFormData: ProducerFormData = {
        name: 'João Silva',
        cpfCnpj: '12345678901',
      };

      const mockResponse = {
        success: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(producerApi.create(mockFormData)).rejects.toThrow('Erro ao criar produtor');
    });
  });

  describe('update', () => {
    it('deve atualizar produtor com sucesso', async () => {
      const mockFormData: ProducerFormData = {
        name: 'João Silva Atualizado',
        cpfCnpj: '12345678901',
      };

      const mockProducer: Producer = {
        id: '1',
        name: 'João Silva Atualizado',
        cpfCnpj: '12345678901',
        farms: [],
      };

      const mockResponse = {
        success: true,
        data: mockProducer,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await producerApi.update('1', mockFormData);

      expect(mockFetch).toHaveBeenCalledWith('/api/producers/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockFormData),
      });
      expect(result).toEqual(mockProducer);
    });

    it('deve lançar erro quando API retorna success false', async () => {
      const mockFormData: ProducerFormData = {
        name: 'João Silva Atualizado',
        cpfCnpj: '12345678901',
      };

      const mockResponse = {
        success: false,
        message: 'Produtor não encontrado',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(producerApi.update('999', mockFormData)).rejects.toThrow('Produtor não encontrado');
    });

    it('deve lançar erro quando data não está presente', async () => {
      const mockFormData: ProducerFormData = {
        name: 'João Silva Atualizado',
        cpfCnpj: '12345678901',
      };

      const mockResponse = {
        success: true,
        data: null,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(producerApi.update('1', mockFormData)).rejects.toThrow('Erro ao atualizar produtor');
    });

    it('deve lançar erro padrão quando message não está presente', async () => {
      const mockFormData: ProducerFormData = {
        name: 'João Silva Atualizado',
        cpfCnpj: '12345678901',
      };

      const mockResponse = {
        success: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(producerApi.update('1', mockFormData)).rejects.toThrow('Erro ao atualizar produtor');
    });
  });

  describe('delete', () => {
    it('deve deletar produtor com sucesso', async () => {
      const mockResponse = {
        success: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await producerApi.delete('1');

      expect(mockFetch).toHaveBeenCalledWith('/api/producers/1', {
        method: 'DELETE',
      });
    });

    it('deve lançar erro quando API retorna success false', async () => {
      const mockResponse = {
        success: false,
        message: 'Produtor não encontrado',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(producerApi.delete('999')).rejects.toThrow('Produtor não encontrado');
    });

    it('deve lançar erro padrão quando message não está presente', async () => {
      const mockResponse = {
        success: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await expect(producerApi.delete('1')).rejects.toThrow('Erro ao deletar produtor');
    });
  });

  describe('Casos de erro de rede', () => {
    it('deve lançar erro quando fetch falha', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(producerApi.getAll()).rejects.toThrow('Network error');
    });

    it('deve lançar erro quando JSON parsing falha', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      await expect(producerApi.getAll()).rejects.toThrow('Invalid JSON');
    });
  });

  describe('Validação de parâmetros', () => {
    it('deve chamar getById com ID correto', async () => {
      const mockProducer: Producer = {
        id: '123',
        name: 'João Silva',
        cpfCnpj: '12345678901',
        farms: [],
      };

      const mockResponse = {
        success: true,
        data: mockProducer,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await producerApi.getById('123');

      expect(mockFetch).toHaveBeenCalledWith('/api/producers/123');
    });

    it('deve chamar update com ID e dados corretos', async () => {
      const mockFormData: ProducerFormData = {
        name: 'João Silva',
        cpfCnpj: '12345678901',
      };

      const mockProducer: Producer = {
        id: '123',
        name: 'João Silva',
        cpfCnpj: '12345678901',
        farms: [],
      };

      const mockResponse = {
        success: true,
        data: mockProducer,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await producerApi.update('123', mockFormData);

      expect(mockFetch).toHaveBeenCalledWith('/api/producers/123', {
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

      await producerApi.delete('123');

      expect(mockFetch).toHaveBeenCalledWith('/api/producers/123', {
        method: 'DELETE',
      });
    });
  });

  describe('Headers e Content-Type', () => {
    it('deve enviar Content-Type correto em create', async () => {
      const mockFormData: ProducerFormData = {
        name: 'João Silva',
        cpfCnpj: '12345678901',
      };

      const mockProducer: Producer = {
        id: '1',
        name: 'João Silva',
        cpfCnpj: '12345678901',
        farms: [],
      };

      const mockResponse = {
        success: true,
        data: mockProducer,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await producerApi.create(mockFormData);

      expect(mockFetch).toHaveBeenCalledWith('/api/producers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockFormData),
      });
    });

    it('deve enviar Content-Type correto em update', async () => {
      const mockFormData: ProducerFormData = {
        name: 'João Silva',
        cpfCnpj: '12345678901',
      };

      const mockProducer: Producer = {
        id: '1',
        name: 'João Silva',
        cpfCnpj: '12345678901',
        farms: [],
      };

      const mockResponse = {
        success: true,
        data: mockProducer,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await producerApi.update('1', mockFormData);

      expect(mockFetch).toHaveBeenCalledWith('/api/producers/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockFormData),
      });
    });
  });
});
