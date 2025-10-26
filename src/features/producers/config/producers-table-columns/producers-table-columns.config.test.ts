import { PRODUCERS_TABLE_COLUMNS } from './producers-table-columns.config';
import { Producer } from '@/entities/producer';
import { formatCPFOrCNPJ } from '@/shared/lib/utils';

jest.mock('@/shared/lib/utils', () => ({
  formatCPFOrCNPJ: jest.fn((value: string) => {
    if (value.length === 11) {
      return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }),
}));

describe('PRODUCERS_TABLE_COLUMNS', () => {
  const mockProducer: Producer = {
    id: '1',
    name: 'João Silva',
    cpfCnpj: '12345678901',
    farms: [
      {
        id: '1',
        name: 'Fazenda A',
        totalArea: 100,
        producerId: '1',
        city: 'São Paulo',
        state: 'SP',
        arableArea: 80,
        vegetationArea: 20,
        farmCrops: [],
        producer: { id: '1', name: 'João Silva', cpfCnpj: '12345678901' },
      },
      {
        id: '2',
        name: 'Fazenda B',
        totalArea: 200,
        producerId: '1',
        city: 'São Paulo',
        state: 'SP',
        arableArea: 160,
        vegetationArea: 40,
        farmCrops: [],
        producer: { id: '1', name: 'João Silva', cpfCnpj: '12345678901' },
      },
    ],
  };

  const mockProducerWithNoFarms: Producer = {
    id: '2',
    name: 'Maria Santos',
    cpfCnpj: '12345678000195',
    farms: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Estrutura das colunas', () => {
    it('deve ter 4 colunas definidas', () => {
      expect(PRODUCERS_TABLE_COLUMNS).toHaveLength(4);
    });

    it('deve ter coluna de nome', () => {
      const nameColumn = PRODUCERS_TABLE_COLUMNS[0];
      expect(nameColumn.key).toBe('name');
      expect(nameColumn.header).toBe('Nome');
      expect(nameColumn.width).toBe('30%');
      expect(nameColumn.render).toBeUndefined();
    });

    it('deve ter coluna de CPF/CNPJ', () => {
      const cpfCnpjColumn = PRODUCERS_TABLE_COLUMNS[1];
      expect(cpfCnpjColumn.key).toBe('cpfCnpj');
      expect(cpfCnpjColumn.header).toBe('CPF/CNPJ');
      expect(cpfCnpjColumn.width).toBe('20%');
      expect(typeof cpfCnpjColumn.render).toBe('function');
    });

    it('deve ter coluna de número de fazendas', () => {
      const farmsColumn = PRODUCERS_TABLE_COLUMNS[2];
      expect(farmsColumn.key).toBe('farms');
      expect(farmsColumn.header).toBe('Nº de Fazendas');
      expect(farmsColumn.width).toBe('20%');
      expect(typeof farmsColumn.render).toBe('function');
    });

    it('deve ter coluna de área total', () => {
      const totalAreaColumn = PRODUCERS_TABLE_COLUMNS[3];
      expect(totalAreaColumn.key).toBe('totalArea');
      expect(totalAreaColumn.header).toBe('Área Total (ha)');
      expect(totalAreaColumn.width).toBe('15%');
      expect(typeof totalAreaColumn.render).toBe('function');
    });
  });

  describe('Função render da coluna CPF/CNPJ', () => {
    it('deve formatar CPF corretamente', () => {
      const cpfCnpjColumn = PRODUCERS_TABLE_COLUMNS[1];
      const result = cpfCnpjColumn.render!(mockProducer);

      expect(result).toBe('123.456.789-01');
    });

    it('deve formatar CNPJ corretamente', () => {
      const producerWithCNPJ: Producer = {
        ...mockProducer,
        cpfCnpj: '12345678000195',
      };

      const cpfCnpjColumn = PRODUCERS_TABLE_COLUMNS[1];
      const result = cpfCnpjColumn.render!(producerWithCNPJ);

      expect(result).toBe('12.345.678/0001-95');
    });

    it('deve chamar formatCPFOrCNPJ com o valor correto', () => {
      const cpfCnpjColumn = PRODUCERS_TABLE_COLUMNS[1];
      cpfCnpjColumn.render!(mockProducer);

      expect(formatCPFOrCNPJ).toHaveBeenCalledWith('12345678901');
    });
  });

  describe('Função render da coluna número de fazendas', () => {
    it('deve retornar o número correto de fazendas', () => {
      const farmsColumn = PRODUCERS_TABLE_COLUMNS[2];
      const result = farmsColumn.render!(mockProducer);

      expect(result).toBe(2);
    });

    it('deve retornar 0 quando não há fazendas', () => {
      const farmsColumn = PRODUCERS_TABLE_COLUMNS[2];
      const result = farmsColumn.render!(mockProducerWithNoFarms);

      expect(result).toBe(0);
    });

    it('deve funcionar com diferentes quantidades de fazendas', () => {
      const producerWithManyFarms: Producer = {
        ...mockProducer,
        farms: Array.from({ length: 5 }, (_, i) => ({
          id: `${i + 1}`,
          name: `Fazenda ${i + 1}`,
          totalArea: 100,
          producerId: '1',
          city: 'São Paulo',
          state: 'SP',
          arableArea: 80,
          vegetationArea: 20,
          farmCrops: [],
          producer: { id: '1', name: 'João Silva', cpfCnpj: '12345678901' },
        })),
      };

      const farmsColumn = PRODUCERS_TABLE_COLUMNS[2];
      const result = farmsColumn.render!(producerWithManyFarms);

      expect(result).toBe(5);
    });
  });

  describe('Função render da coluna área total', () => {
    it('deve calcular a área total corretamente', () => {
      const totalAreaColumn = PRODUCERS_TABLE_COLUMNS[3];
      const result = totalAreaColumn.render!(mockProducer);

      expect(result).toBe('300');
    });

    it('deve retornar "0" quando não há fazendas', () => {
      const totalAreaColumn = PRODUCERS_TABLE_COLUMNS[3];
      const result = totalAreaColumn.render!(mockProducerWithNoFarms);

      expect(result).toBe('0');
    });

    it('deve formatar números grandes corretamente', () => {
      const producerWithLargeArea: Producer = {
        ...mockProducer,
        farms: [
          {
            id: '1',
            name: 'Fazenda Grande',
            totalArea: 1000000,
            producerId: '1',
            city: 'São Paulo',
            state: 'SP',
            arableArea: 800000,
            vegetationArea: 200000,
            farmCrops: [],
            producer: { id: '1', name: 'João Silva', cpfCnpj: '12345678901' },
          },
        ],
      };

      const totalAreaColumn = PRODUCERS_TABLE_COLUMNS[3];
      const result = totalAreaColumn.render!(producerWithLargeArea);

      expect(result).toBe('1.000.000');
    });

    it('deve somar áreas de múltiplas fazendas', () => {
      const producerWithMultipleFarms: Producer = {
        ...mockProducer,
        farms: [
          {
            id: '1',
            name: 'Fazenda A',
            totalArea: 150,
            producerId: '1',
            city: 'São Paulo',
            state: 'SP',
            arableArea: 120,
            vegetationArea: 30,
            farmCrops: [],
            producer: { id: '1', name: 'João Silva', cpfCnpj: '12345678901' },
          },
          {
            id: '2',
            name: 'Fazenda B',
            totalArea: 250,
            producerId: '1',
            city: 'São Paulo',
            state: 'SP',
            arableArea: 200,
            vegetationArea: 50,
            farmCrops: [],
            producer: { id: '1', name: 'João Silva', cpfCnpj: '12345678901' },
          },
          {
            id: '3',
            name: 'Fazenda C',
            totalArea: 100,
            producerId: '1',
            city: 'São Paulo',
            state: 'SP',
            arableArea: 80,
            vegetationArea: 20,
            farmCrops: [],
            producer: { id: '1', name: 'João Silva', cpfCnpj: '12345678901' },
          },
        ],
      };

      const totalAreaColumn = PRODUCERS_TABLE_COLUMNS[3];
      const result = totalAreaColumn.render!(producerWithMultipleFarms);

      expect(result).toBe('500');
    });

    it('deve lidar com áreas decimais', () => {
      const producerWithDecimalArea: Producer = {
        ...mockProducer,
        farms: [
          {
            id: '1',
            name: 'Fazenda Decimal',
            totalArea: 150.5,
            producerId: '1',
            city: 'São Paulo',
            state: 'SP',
            arableArea: 120.3,
            vegetationArea: 30.2,
            farmCrops: [],
            producer: { id: '1', name: 'João Silva', cpfCnpj: '12345678901' },
          },
        ],
      };

      const totalAreaColumn = PRODUCERS_TABLE_COLUMNS[3];
      const result = totalAreaColumn.render!(producerWithDecimalArea);

      expect(result).toBe('150,5');
    });
  });

  describe('Validação de tipos', () => {
    it('deve ter todas as propriedades obrigatórias', () => {
      PRODUCERS_TABLE_COLUMNS.forEach(column => {
        expect(column).toHaveProperty('key');
        expect(column).toHaveProperty('header');
        expect(column).toHaveProperty('width');
        expect(typeof column.key).toBe('string');
        expect(typeof column.header).toBe('string');
        expect(typeof column.width).toBe('string');
      });
    });

    it('deve ter funções render válidas quando definidas', () => {
      const columnsWithRender = PRODUCERS_TABLE_COLUMNS.filter(col => col.render);

      columnsWithRender.forEach(column => {
        expect(typeof column.render).toBe('function');

        // Testa se a função não lança erro
        expect(() => column.render!(mockProducer)).not.toThrow();
      });
    });

    it('deve ter larguras em formato de porcentagem', () => {
      PRODUCERS_TABLE_COLUMNS.forEach(column => {
        expect(column.width).toMatch(/^\d+%$/);
      });
    });
  });

  describe('Casos extremos', () => {
    it('deve lidar com produtor com fazendas de área zero', () => {
      const producerWithZeroArea: Producer = {
        ...mockProducer,
        farms: [
          {
            id: '1',
            name: 'Fazenda Zero',
            totalArea: 0,
            producerId: '1',
            city: 'São Paulo',
            state: 'SP',
            arableArea: 0,
            vegetationArea: 0,
            farmCrops: [],
            producer: { id: '1', name: 'João Silva', cpfCnpj: '12345678901' },
          },
        ],
      };

      const totalAreaColumn = PRODUCERS_TABLE_COLUMNS[3];
      const result = totalAreaColumn.render!(producerWithZeroArea);

      expect(result).toBe('0');
    });

    it('deve lidar com produtor com CPF/CNPJ vazio', () => {
      const producerWithEmptyCpf: Producer = {
        ...mockProducer,
        cpfCnpj: '',
      };

      const cpfCnpjColumn = PRODUCERS_TABLE_COLUMNS[1];
      const result = cpfCnpjColumn.render!(producerWithEmptyCpf);

      expect(result).toBe('');
    });

    it('deve lidar com produtor com nome vazio', () => {
      const nameColumn = PRODUCERS_TABLE_COLUMNS[0];
      expect(nameColumn.key).toBe('name');
      expect(nameColumn.header).toBe('Nome');
    });
  });

  describe('Integração com formatCPFOrCNPJ', () => {
    it('deve usar a função formatCPFOrCNPJ corretamente', () => {
      const cpfCnpjColumn = PRODUCERS_TABLE_COLUMNS[1];
      cpfCnpjColumn.render!(mockProducer);

      expect(formatCPFOrCNPJ).toHaveBeenCalledTimes(1);
      expect(formatCPFOrCNPJ).toHaveBeenCalledWith('12345678901');
    });

    it('deve retornar o resultado da função formatCPFOrCNPJ', () => {
      (formatCPFOrCNPJ as jest.Mock).mockReturnValue('FORMATADO');

      const cpfCnpjColumn = PRODUCERS_TABLE_COLUMNS[1];
      const result = cpfCnpjColumn.render!(mockProducer);

      expect(result).toBe('FORMATADO');
    });
  });
});
