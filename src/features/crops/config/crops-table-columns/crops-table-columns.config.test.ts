import { CROPS_TABLE_COLUMNS } from './crops-table-columns.config';
import { Crop } from '@/entities/crop';

describe('CROPS_TABLE_COLUMNS', () => {
  const mockCrop: Crop = {
    id: '1',
    name: 'Soja',
    createdAt: new Date('2021-01-01'),
    updatedAt: new Date('2021-01-01'),
  };

  const mockCropWithLongName: Crop = {
    id: '2',
    name: 'Milho Transgênico Bt11',
    createdAt: new Date('2021-01-01'),
    updatedAt: new Date('2021-01-01'),
  };

  const mockCropWithSpecialChars: Crop = {
    id: '3',
    name: 'Café Arábica (Premium)',
    createdAt: new Date('2021-01-01'),
    updatedAt: new Date('2021-01-01'),
  };

  describe('Estrutura das colunas', () => {
    it('deve ter 2 colunas definidas', () => {
      expect(CROPS_TABLE_COLUMNS).toHaveLength(2);
    });

    it('deve ter coluna de nome', () => {
      const nameColumn = CROPS_TABLE_COLUMNS[0];
      expect(nameColumn.key).toBe('name');
      expect(nameColumn.header).toBe('Nome da Cultura');
      expect(nameColumn.width).toBe('80%');
      expect(nameColumn.render).toBeUndefined();
    });

    it('deve ter coluna de ações', () => {
      const actionsColumn = CROPS_TABLE_COLUMNS[1];
      expect(actionsColumn.key).toBe('actions');
      expect(actionsColumn.header).toBe('Ações');
      expect(actionsColumn.width).toBe('20%');
      expect(typeof actionsColumn.render).toBe('function');
    });
  });

  describe('Função render da coluna ações', () => {
    it('deve retornar o nome da cultura', () => {
      const actionsColumn = CROPS_TABLE_COLUMNS[1];
      const result = actionsColumn.render!(mockCrop);

      expect(result).toBe('Soja');
    });

    it('deve retornar nome com caracteres especiais', () => {
      const actionsColumn = CROPS_TABLE_COLUMNS[1];
      const result = actionsColumn.render!(mockCropWithSpecialChars);

      expect(result).toBe('Café Arábica (Premium)');
    });

    it('deve retornar nome longo', () => {
      const actionsColumn = CROPS_TABLE_COLUMNS[1];
      const result = actionsColumn.render!(mockCropWithLongName);

      expect(result).toBe('Milho Transgênico Bt11');
    });

    it('deve lidar com nome vazio', () => {
      const cropWithEmptyName: Crop = {
        id: '4',
        name: '',
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-01'),
      };

      const actionsColumn = CROPS_TABLE_COLUMNS[1];
      const result = actionsColumn.render!(cropWithEmptyName);

      expect(result).toBe('');
    });

    it('deve lidar com nome contendo apenas espaços', () => {
      const cropWithSpaces: Crop = {
        id: '5',
        name: '   ',
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-01'),
      };

      const actionsColumn = CROPS_TABLE_COLUMNS[1];
      const result = actionsColumn.render!(cropWithSpaces);

      expect(result).toBe('   ');
    });

    it('deve lidar com nome contendo números', () => {
      const cropWithNumbers: Crop = {
        id: '6',
        name: 'Cultura 2024',
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-01'),
      };

      const actionsColumn = CROPS_TABLE_COLUMNS[1];
      const result = actionsColumn.render!(cropWithNumbers);

      expect(result).toBe('Cultura 2024');
    });

    it('deve lidar com nome contendo acentos', () => {
      const cropWithAccents: Crop = {
        id: '7',
        name: 'Açaí da Amazônia',
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-01'),
      };

      const actionsColumn = CROPS_TABLE_COLUMNS[1];
      const result = actionsColumn.render!(cropWithAccents);

      expect(result).toBe('Açaí da Amazônia');
    });

    it('deve lidar com nome contendo hífens', () => {
      const cropWithHyphens: Crop = {
        id: '8',
        name: 'Tomate-Cereja',
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-01'),
      };

      const actionsColumn = CROPS_TABLE_COLUMNS[1];
      const result = actionsColumn.render!(cropWithHyphens);

      expect(result).toBe('Tomate-Cereja');
    });

    it('deve lidar com nome contendo parênteses', () => {
      const cropWithParentheses: Crop = {
        id: '9',
        name: 'Algodão (Branco)',
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-01'),
      };

      const actionsColumn = CROPS_TABLE_COLUMNS[1];
      const result = actionsColumn.render!(cropWithParentheses);

      expect(result).toBe('Algodão (Branco)');
    });

    it('deve lidar com nome contendo aspas', () => {
      const cropWithQuotes: Crop = {
        id: '10',
        name: 'Cultura "Especial"',
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-01'),
      };

      const actionsColumn = CROPS_TABLE_COLUMNS[1];
      const result = actionsColumn.render!(cropWithQuotes);

      expect(result).toBe('Cultura "Especial"');
    });
  });

  describe('Validação de tipos', () => {
    it('deve ter todas as propriedades obrigatórias', () => {
      CROPS_TABLE_COLUMNS.forEach(column => {
        expect(column).toHaveProperty('key');
        expect(column).toHaveProperty('header');
        expect(column).toHaveProperty('width');
        expect(typeof column.key).toBe('string');
        expect(typeof column.header).toBe('string');
        expect(typeof column.width).toBe('string');
      });
    });

    it('deve ter função render válida quando definida', () => {
      const columnsWithRender = CROPS_TABLE_COLUMNS.filter(col => col.render);

      columnsWithRender.forEach(column => {
        expect(typeof column.render).toBe('function');

        // Testa se a função não lança erro
        expect(() => column.render!(mockCrop)).not.toThrow();
      });
    });

    it('deve ter larguras em formato de porcentagem', () => {
      CROPS_TABLE_COLUMNS.forEach(column => {
        expect(column.width).toMatch(/^\d+%$/);
      });
    });

    it('deve ter larguras que somam 100%', () => {
      const totalWidth = CROPS_TABLE_COLUMNS.reduce((sum, column) => {
        const width = parseInt(column.width.replace('%', ''));
        return sum + width;
      }, 0);

      expect(totalWidth).toBe(100);
    });
  });

  describe('Casos extremos', () => {
    it('deve lidar com crop undefined', () => {
      const actionsColumn = CROPS_TABLE_COLUMNS[1];

      expect(() => actionsColumn.render!(undefined as unknown as Crop)).toThrow();
    });

    it('deve lidar com crop null', () => {
      const actionsColumn = CROPS_TABLE_COLUMNS[1];

      expect(() => actionsColumn.render!(null as unknown as Crop)).toThrow();
    });

    it('deve lidar com crop sem propriedade name', () => {
      const cropWithoutName = {
        id: '11',
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-01'),
      } as unknown as Crop;

      const actionsColumn = CROPS_TABLE_COLUMNS[1];
      const result = actionsColumn.render!(cropWithoutName);

      expect(result).toBeUndefined();
    });

    it('deve lidar com crop com name undefined', () => {
      const cropWithUndefinedName: Crop = {
        id: '12',
        name: undefined as unknown as string,
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-01'),
      };

      const actionsColumn = CROPS_TABLE_COLUMNS[1];
      const result = actionsColumn.render!(cropWithUndefinedName);

      expect(result).toBeUndefined();
    });

    it('deve lidar com crop com name null', () => {
      const cropWithNullName: Crop = {
        id: '13',
        name: null as unknown as string,
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-01'),
      };

      const actionsColumn = CROPS_TABLE_COLUMNS[1];
      const result = actionsColumn.render!(cropWithNullName);

      expect(result).toBeNull();
    });
  });

  describe('Integração com tipos TypeScript', () => {
    it('deve aceitar Crop válido', () => {
      const actionsColumn = CROPS_TABLE_COLUMNS[1];

      expect(() => actionsColumn.render!(mockCrop)).not.toThrow();
    });

    it('deve ter tipos corretos para as propriedades', () => {
      CROPS_TABLE_COLUMNS.forEach(column => {
        expect(typeof column.key).toBe('string');
        expect(typeof column.header).toBe('string');
        expect(typeof column.width).toBe('string');

        if (column.render) {
          expect(typeof column.render).toBe('function');
        }
      });
    });
  });

  describe('Estrutura de dados', () => {
    it('deve ter estrutura consistente', () => {
      CROPS_TABLE_COLUMNS.forEach(column => {
        expect(column).toHaveProperty('key');
        expect(column).toHaveProperty('header');
        expect(column).toHaveProperty('width');

        // Verifica se as propriedades não são undefined
        expect(column.key).toBeDefined();
        expect(column.header).toBeDefined();
        expect(column.width).toBeDefined();
      });
    });

    it('deve ter keys únicos', () => {
      const keys = CROPS_TABLE_COLUMNS.map(column => column.key);
      const uniqueKeys = [...new Set(keys)];

      expect(keys).toHaveLength(uniqueKeys.length);
    });

    it('deve ter headers não vazios', () => {
      CROPS_TABLE_COLUMNS.forEach(column => {
        expect(column.header).toBeTruthy();
        expect(column.header.length).toBeGreaterThan(0);
      });
    });

    it('deve ter widths válidas', () => {
      CROPS_TABLE_COLUMNS.forEach(column => {
        const width = parseInt(column.width.replace('%', ''));
        expect(width).toBeGreaterThan(0);
        expect(width).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Cenários de uso real', () => {
    it('deve funcionar com lista de culturas variadas', () => {
      const variedCrops: Crop[] = [
        { id: '1', name: 'Soja', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', name: 'Milho', createdAt: new Date(), updatedAt: new Date() },
        { id: '3', name: 'Café', createdAt: new Date(), updatedAt: new Date() },
        { id: '4', name: 'Algodão', createdAt: new Date(), updatedAt: new Date() },
        { id: '5', name: 'Cana-de-açúcar', createdAt: new Date(), updatedAt: new Date() },
      ];

      const actionsColumn = CROPS_TABLE_COLUMNS[1];

      variedCrops.forEach(crop => {
        const result = actionsColumn.render!(crop);
        expect(result).toBe(crop.name);
        expect(typeof result).toBe('string');
      });
    });

    it('deve manter consistência com diferentes tipos de nome', () => {
      const testCases = [
        'Nome Simples',
        'Nome com Espaços',
        'Nome-com-Hífens',
        'Nome (com Parênteses)',
        'Nome "com Aspas"',
        'Nome com Números 123',
        'Nome com Acentos: Açaí',
        'Nome Muito Longo Que Pode Ser Usado Para Testar Comportamento',
      ];

      const actionsColumn = CROPS_TABLE_COLUMNS[1];

      testCases.forEach((name, index) => {
        const crop: Crop = {
          id: `${index}`,
          name,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = actionsColumn.render!(crop);
        expect(result).toBe(name);
      });
    });
  });
});
