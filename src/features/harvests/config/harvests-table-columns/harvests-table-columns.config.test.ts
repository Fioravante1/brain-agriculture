import { HARVESTS_TABLE_COLUMNS } from './harvests-table-columns.config';
import { formatDateUTC } from '@/shared/lib/utils/format';

describe('HARVESTS_TABLE_COLUMNS', () => {
  it('deve ter estrutura correta das colunas', () => {
    expect(HARVESTS_TABLE_COLUMNS).toHaveLength(4);

    expect(HARVESTS_TABLE_COLUMNS[0]).toHaveProperty('key', 'name');
    expect(HARVESTS_TABLE_COLUMNS[0]).toHaveProperty('header', 'Nome da Safra');
    expect(HARVESTS_TABLE_COLUMNS[0]).toHaveProperty('width', '40%');

    expect(HARVESTS_TABLE_COLUMNS[1]).toHaveProperty('key', 'year');
    expect(HARVESTS_TABLE_COLUMNS[1]).toHaveProperty('header', 'Ano');
    expect(HARVESTS_TABLE_COLUMNS[1]).toHaveProperty('width', '20%');
    expect(HARVESTS_TABLE_COLUMNS[1]).toHaveProperty('render');

    expect(HARVESTS_TABLE_COLUMNS[2]).toHaveProperty('key', 'createdAt');
    expect(HARVESTS_TABLE_COLUMNS[2]).toHaveProperty('header', 'Criada em');
    expect(HARVESTS_TABLE_COLUMNS[2]).toHaveProperty('width', '20%');
    expect(HARVESTS_TABLE_COLUMNS[2]).toHaveProperty('render');

    expect(HARVESTS_TABLE_COLUMNS[3]).toHaveProperty('key', 'actions');
    expect(HARVESTS_TABLE_COLUMNS[3]).toHaveProperty('header', 'Ações');
    expect(HARVESTS_TABLE_COLUMNS[3]).toHaveProperty('width', '20%');
    expect(HARVESTS_TABLE_COLUMNS[3]).toHaveProperty('render');
  });

  it('deve renderizar ano corretamente', () => {
    const harvest = {
      id: '1',
      name: 'Safra 2021',
      year: 2021,
      createdAt: new Date('2021-01-01T00:00:00.000Z'),
      updatedAt: new Date('2021-01-01T00:00:00.000Z'),
    };

    const result = HARVESTS_TABLE_COLUMNS[1].render!(harvest);
    expect(result).toBe('2021');
  });

  it('deve renderizar data de criação corretamente', () => {
    const harvest = {
      id: '1',
      name: 'Safra 2021',
      year: 2021,
      createdAt: new Date('2021-01-01T00:00:00.000Z'), // UTC explícito
      updatedAt: new Date('2021-01-01T00:00:00.000Z'),
    };

    const result = HARVESTS_TABLE_COLUMNS[2].render!(harvest);
    expect(result).toBe('01/01/2021');
  });

  it('deve renderizar ações corretamente', () => {
    const harvest = {
      id: '1',
      name: 'Safra 2021',
      year: 2021,
      createdAt: new Date('2021-01-01T00:00:00.000Z'),
      updatedAt: new Date('2021-01-01T00:00:00.000Z'),
    };

    const result = HARVESTS_TABLE_COLUMNS[3].render!(harvest);
    expect(result).toBe('Safra 2021');
  });

  it('deve lidar com ano undefined', () => {
    const harvest = {
      id: '1',
      name: 'Safra 2021',
      year: undefined as unknown as number,
      createdAt: new Date('2021-01-01T00:00:00.000Z'),
      updatedAt: new Date('2021-01-01T00:00:00.000Z'),
    };

    expect(() => HARVESTS_TABLE_COLUMNS[1].render!(harvest)).toThrow();
  });

  it('deve lidar com ano null', () => {
    const harvest = {
      id: '1',
      name: 'Safra 2021',
      year: null as unknown as number,
      createdAt: new Date('2021-01-01T00:00:00.000Z'),
      updatedAt: new Date('2021-01-01T00:00:00.000Z'),
    };

    expect(() => HARVESTS_TABLE_COLUMNS[1].render!(harvest)).toThrow();
  });

  it('deve lidar com createdAt undefined', () => {
    const harvest = {
      id: '1',
      name: 'Safra 2021',
      year: 2021,
      createdAt: undefined as unknown as Date,
      updatedAt: new Date('2021-01-01T00:00:00.000Z'),
    };

    const result = HARVESTS_TABLE_COLUMNS[2].render!(harvest);
    expect(result).toBe('Invalid Date');
  });

  it('deve lidar com createdAt null', () => {
    const harvest = {
      id: '1',
      name: 'Safra 2021',
      year: 2021,
      createdAt: null as unknown as Date,
      updatedAt: new Date('2021-01-01T00:00:00.000Z'),
    };

    const result = HARVESTS_TABLE_COLUMNS[2].render!(harvest);
    expect(result).toBe('01/01/1970'); // Epoch em UTC
  });

  it('deve renderizar diferentes anos', () => {
    const years = [2020, 2021, 2022, 2023, 2024];

    years.forEach(year => {
      const harvest = {
        id: '1',
        name: 'Safra 2021',
        year,
        createdAt: new Date('2021-01-01T00:00:00.000Z'),
        updatedAt: new Date('2021-01-01T00:00:00.000Z'),
      };

      const result = HARVESTS_TABLE_COLUMNS[1].render!(harvest);
      expect(result).toBe(year.toString());
    });
  });

  it('deve renderizar diferentes datas de criação', () => {
    const dates = [
      new Date('2020-01-01T00:00:00.000Z'),
      new Date('2021-06-15T00:00:00.000Z'),
      new Date('2022-12-31T00:00:00.000Z'),
    ];

    dates.forEach(date => {
      const harvest = {
        id: '1',
        name: 'Safra 2021',
        year: 2021,
        createdAt: date,
        updatedAt: new Date('2021-01-01T00:00:00.000Z'),
      };

      const result = HARVESTS_TABLE_COLUMNS[2].render!(harvest);
      expect(result).toBe(formatDateUTC(date));
    });
  });

  it('deve ter propriedades corretas para cada coluna', () => {
    HARVESTS_TABLE_COLUMNS.forEach(column => {
      expect(column).toHaveProperty('key');
      expect(column).toHaveProperty('header');
      expect(column).toHaveProperty('width');

      if (column.render) {
        expect(typeof column.render).toBe('function');
      }
    });
  });

  it('deve ter larguras que somam 100%', () => {
    const totalWidth = HARVESTS_TABLE_COLUMNS.reduce((sum, column) => {
      const width = parseInt(column.width.replace('%', ''));
      return sum + width;
    }, 0);

    expect(totalWidth).toBe(100);
  });

  it('deve ter chaves únicas', () => {
    const keys = HARVESTS_TABLE_COLUMNS.map(column => column.key);
    const uniqueKeys = [...new Set(keys)];

    expect(keys).toHaveLength(uniqueKeys.length);
  });

  it('deve ter headers não vazios', () => {
    HARVESTS_TABLE_COLUMNS.forEach(column => {
      expect(column.header).toBeTruthy();
      expect(column.header.length).toBeGreaterThan(0);
    });
  });

  it('deve ter larguras válidas', () => {
    HARVESTS_TABLE_COLUMNS.forEach(column => {
      expect(column.width).toMatch(/^\d+%$/);
      const width = parseInt(column.width.replace('%', ''));
      expect(width).toBeGreaterThan(0);
      expect(width).toBeLessThanOrEqual(100);
    });
  });

  it('deve ter coluna de nome sem função render', () => {
    const nameColumn = HARVESTS_TABLE_COLUMNS[0];
    expect(nameColumn.key).toBe('name');
    expect(nameColumn.render).toBeUndefined();
  });

  it('deve ter colunas com função render', () => {
    const columnsWithRender = HARVESTS_TABLE_COLUMNS.filter(column => column.render);
    expect(columnsWithRender).toHaveLength(3);

    columnsWithRender.forEach(column => {
      expect(typeof column.render).toBe('function');
    });
  });

  it('deve ter estrutura de dados correta', () => {
    HARVESTS_TABLE_COLUMNS.forEach(column => {
      expect(column).toMatchObject({
        key: expect.any(String),
        header: expect.any(String),
        width: expect.stringMatching(/^\d+%$/),
      });
    });
  });
});
