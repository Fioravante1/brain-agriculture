import { FARM_CROPS_TABLE_COLUMNS } from './farm-crops-table-columns.config';
import { formatDateUTC } from '@/shared/lib/utils/format';

describe('FARM_CROPS_TABLE_COLUMNS', () => {
  it('deve ter estrutura correta das colunas', () => {
    expect(FARM_CROPS_TABLE_COLUMNS).toHaveLength(6);

    expect(FARM_CROPS_TABLE_COLUMNS[0]).toHaveProperty('key', 'farm');
    expect(FARM_CROPS_TABLE_COLUMNS[0]).toHaveProperty('header', 'Fazenda');
    expect(FARM_CROPS_TABLE_COLUMNS[0]).toHaveProperty('width', '25%');
    expect(FARM_CROPS_TABLE_COLUMNS[0]).toHaveProperty('render');

    expect(FARM_CROPS_TABLE_COLUMNS[1]).toHaveProperty('key', 'producer');
    expect(FARM_CROPS_TABLE_COLUMNS[1]).toHaveProperty('header', 'Produtor');
    expect(FARM_CROPS_TABLE_COLUMNS[1]).toHaveProperty('width', '20%');
    expect(FARM_CROPS_TABLE_COLUMNS[1]).toHaveProperty('render');

    expect(FARM_CROPS_TABLE_COLUMNS[2]).toHaveProperty('key', 'crop');
    expect(FARM_CROPS_TABLE_COLUMNS[2]).toHaveProperty('header', 'Cultura');
    expect(FARM_CROPS_TABLE_COLUMNS[2]).toHaveProperty('width', '20%');
    expect(FARM_CROPS_TABLE_COLUMNS[2]).toHaveProperty('render');

    expect(FARM_CROPS_TABLE_COLUMNS[3]).toHaveProperty('key', 'harvest');
    expect(FARM_CROPS_TABLE_COLUMNS[3]).toHaveProperty('header', 'Safra');
    expect(FARM_CROPS_TABLE_COLUMNS[3]).toHaveProperty('width', '20%');
    expect(FARM_CROPS_TABLE_COLUMNS[3]).toHaveProperty('render');

    expect(FARM_CROPS_TABLE_COLUMNS[4]).toHaveProperty('key', 'createdAt');
    expect(FARM_CROPS_TABLE_COLUMNS[4]).toHaveProperty('header', 'Criada em');
    expect(FARM_CROPS_TABLE_COLUMNS[4]).toHaveProperty('width', '10%');
    expect(FARM_CROPS_TABLE_COLUMNS[4]).toHaveProperty('render');

    expect(FARM_CROPS_TABLE_COLUMNS[5]).toHaveProperty('key', 'actions');
    expect(FARM_CROPS_TABLE_COLUMNS[5]).toHaveProperty('header', 'Ações');
    expect(FARM_CROPS_TABLE_COLUMNS[5]).toHaveProperty('width', '5%');
    expect(FARM_CROPS_TABLE_COLUMNS[5]).toHaveProperty('render');
  });

  it('deve renderizar nome da fazenda corretamente', () => {
    const farmCrop = {
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
        farmCrops: [],
        producer: {
          id: '1',
          name: 'João Silva',
          cpfCnpj: '12345678901',
        },
      },
      crop: {
        id: '1',
        name: 'Soja',
        createdAt: new Date('2021-01-01T00:00:00.000Z'),
        updatedAt: new Date('2021-01-01T00:00:00.000Z'),
      },
      harvest: {
        id: '1',
        name: 'Safra 2021',
        year: 2021,
        createdAt: new Date('2021-01-01T00:00:00.000Z'),
        updatedAt: new Date('2021-01-01T00:00:00.000Z'),
      },
    };

    const result = FARM_CROPS_TABLE_COLUMNS[0].render!(farmCrop);
    expect(result).toBe('Fazenda São João');
  });

  it('deve renderizar nome do produtor corretamente', () => {
    const farmCrop = {
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
        farmCrops: [],
        producer: {
          id: '1',
          name: 'João Silva',
          cpfCnpj: '12345678901',
        },
      },
      crop: {
        id: '1',
        name: 'Soja',
        createdAt: new Date('2021-01-01T00:00:00.000Z'),
        updatedAt: new Date('2021-01-01T00:00:00.000Z'),
      },
      harvest: {
        id: '1',
        name: 'Safra 2021',
        year: 2021,
        createdAt: new Date('2021-01-01T00:00:00.000Z'),
        updatedAt: new Date('2021-01-01T00:00:00.000Z'),
      },
    };

    const result = FARM_CROPS_TABLE_COLUMNS[1].render!(farmCrop);
    expect(result).toBe('João Silva');
  });

  it('deve renderizar nome da cultura corretamente', () => {
    const farmCrop = {
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
        farmCrops: [],
        producer: {
          id: '1',
          name: 'João Silva',
          cpfCnpj: '12345678901',
        },
      },
      crop: {
        id: '1',
        name: 'Soja',
        createdAt: new Date('2021-01-01T00:00:00.000Z'),
        updatedAt: new Date('2021-01-01T00:00:00.000Z'),
      },
      harvest: {
        id: '1',
        name: 'Safra 2021',
        year: 2021,
        createdAt: new Date('2021-01-01T00:00:00.000Z'),
        updatedAt: new Date('2021-01-01T00:00:00.000Z'),
      },
    };

    const result = FARM_CROPS_TABLE_COLUMNS[2].render!(farmCrop);
    expect(result).toBe('Soja');
  });

  it('deve renderizar safra corretamente', () => {
    const farmCrop = {
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
        farmCrops: [],
        producer: {
          id: '1',
          name: 'João Silva',
          cpfCnpj: '12345678901',
        },
      },
      crop: {
        id: '1',
        name: 'Soja',
        createdAt: new Date('2021-01-01T00:00:00.000Z'),
        updatedAt: new Date('2021-01-01T00:00:00.000Z'),
      },
      harvest: {
        id: '1',
        name: 'Safra 2021',
        year: 2021,
        createdAt: new Date('2021-01-01T00:00:00.000Z'),
        updatedAt: new Date('2021-01-01T00:00:00.000Z'),
      },
    };

    const result = FARM_CROPS_TABLE_COLUMNS[3].render!(farmCrop);
    expect(result).toBe('Safra 2021 (2021)');
  });

  it('deve renderizar data de criação corretamente', () => {
    const date = new Date('2021-01-01T00:00:00.000Z');
    const farmCrop = {
      id: '1',
      farmId: '1',
      cropId: '1',
      harvestId: '1',
      createdAt: date,
      updatedAt: date,
      farm: {
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
      crop: {
        id: '1',
        name: 'Soja',
        createdAt: date,
        updatedAt: date,
      },
      harvest: {
        id: '1',
        name: 'Safra 2021',
        year: 2021,
        createdAt: date,
        updatedAt: date,
      },
    };

    const result = FARM_CROPS_TABLE_COLUMNS[4].render!(farmCrop);
    expect(result).toBe(formatDateUTC(date));
  });

  it('deve renderizar ações corretamente', () => {
    const farmCrop = {
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
        farmCrops: [],
        producer: {
          id: '1',
          name: 'João Silva',
          cpfCnpj: '12345678901',
        },
      },
      crop: {
        id: '1',
        name: 'Soja',
        createdAt: new Date('2021-01-01T00:00:00.000Z'),
        updatedAt: new Date('2021-01-01T00:00:00.000Z'),
      },
      harvest: {
        id: '1',
        name: 'Safra 2021',
        year: 2021,
        createdAt: new Date('2021-01-01T00:00:00.000Z'),
        updatedAt: new Date('2021-01-01T00:00:00.000Z'),
      },
    };

    const result = FARM_CROPS_TABLE_COLUMNS[5].render!(farmCrop);
    expect(result).toBe('Fazenda São João');
  });

  it('deve lidar com fazenda undefined', () => {
    const farmCrop = {
      id: '1',
      farmId: '1',
      cropId: '1',
      harvestId: '1',
      createdAt: new Date('2021-01-01T00:00:00.000Z'),
      updatedAt: new Date('2021-01-01T00:00:00.000Z'),
      farm: undefined as unknown as {
        id: string;
        producerId: string;
        name: string;
        city: string;
        state: string;
        totalArea: number;
        arableArea: number;
        vegetationArea: number;
        farmCrops: never[];
        producer: { id: string; name: string; cpfCnpj: string };
      },
      crop: {
        id: '1',
        name: 'Soja',
        createdAt: new Date('2021-01-01T00:00:00.000Z'),
        updatedAt: new Date('2021-01-01T00:00:00.000Z'),
      },
      harvest: {
        id: '1',
        name: 'Safra 2021',
        year: 2021,
        createdAt: new Date('2021-01-01T00:00:00.000Z'),
        updatedAt: new Date('2021-01-01T00:00:00.000Z'),
      },
    };

    expect(() => FARM_CROPS_TABLE_COLUMNS[0].render!(farmCrop)).toThrow();
  });

  it('deve lidar com cultura undefined', () => {
    const farmCrop = {
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
        farmCrops: [],
        producer: {
          id: '1',
          name: 'João Silva',
          cpfCnpj: '12345678901',
        },
      },
      crop: undefined as unknown as { id: string; name: string; createdAt: Date; updatedAt: Date },
      harvest: {
        id: '1',
        name: 'Safra 2021',
        year: 2021,
        createdAt: new Date('2021-01-01T00:00:00.000Z'),
        updatedAt: new Date('2021-01-01T00:00:00.000Z'),
      },
    };

    expect(() => FARM_CROPS_TABLE_COLUMNS[2].render!(farmCrop)).toThrow();
  });

  it('deve lidar com safra undefined', () => {
    const farmCrop = {
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
        farmCrops: [],
        producer: {
          id: '1',
          name: 'João Silva',
          cpfCnpj: '12345678901',
        },
      },
      crop: {
        id: '1',
        name: 'Soja',
        createdAt: new Date('2021-01-01T00:00:00.000Z'),
        updatedAt: new Date('2021-01-01T00:00:00.000Z'),
      },
      harvest: undefined as unknown as { id: string; name: string; year: number; createdAt: Date; updatedAt: Date },
    };

    expect(() => FARM_CROPS_TABLE_COLUMNS[3].render!(farmCrop)).toThrow();
  });

  it('deve renderizar diferentes fazendas', () => {
    const farmNames = ['Fazenda São João', 'Fazenda Santa Maria', 'Fazenda Boa Vista'];

    farmNames.forEach(farmName => {
      const farmCrop = {
        id: '1',
        farmId: '1',
        cropId: '1',
        harvestId: '1',
        createdAt: new Date('2021-01-01T00:00:00.000Z'),
        updatedAt: new Date('2021-01-01T00:00:00.000Z'),
        farm: {
          id: '1',
          producerId: '1',
          name: farmName,
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
        crop: {
          id: '1',
          name: 'Soja',
          createdAt: '2021-01-01T00:00:00.000Z',
          updatedAt: '2021-01-01T00:00:00.000Z',
        },
        harvest: {
          id: '1',
          name: 'Safra 2021',
          year: 2021,
          createdAt: '2021-01-01T00:00:00.000Z',
          updatedAt: '2021-01-01T00:00:00.000Z',
        },
      };

      const result = FARM_CROPS_TABLE_COLUMNS[0].render!(farmCrop);
      expect(result).toBe(farmName);
    });
  });

  it('deve renderizar diferentes culturas', () => {
    const cropNames = ['Soja', 'Milho', 'Algodão'];

    cropNames.forEach(cropName => {
      const farmCrop = {
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
          farmCrops: [],
          producer: {
            id: '1',
            name: 'João Silva',
            cpfCnpj: '12345678901',
          },
        },
        crop: {
          id: '1',
          name: cropName,
          createdAt: '2021-01-01T00:00:00.000Z',
          updatedAt: '2021-01-01T00:00:00.000Z',
        },
        harvest: {
          id: '1',
          name: 'Safra 2021',
          year: 2021,
          createdAt: '2021-01-01T00:00:00.000Z',
          updatedAt: '2021-01-01T00:00:00.000Z',
        },
      };

      const result = FARM_CROPS_TABLE_COLUMNS[2].render!(farmCrop);
      expect(result).toBe(cropName);
    });
  });

  it('deve renderizar diferentes safras', () => {
    const harvests = [
      { name: 'Safra 2021', year: 2021 },
      { name: 'Safra 2022', year: 2022 },
      { name: 'Safra 2023', year: 2023 },
    ];

    harvests.forEach(harvest => {
      const farmCrop = {
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
          farmCrops: [],
          producer: {
            id: '1',
            name: 'João Silva',
            cpfCnpj: '12345678901',
          },
        },
        crop: {
          id: '1',
          name: 'Soja',
          createdAt: '2021-01-01T00:00:00.000Z',
          updatedAt: '2021-01-01T00:00:00.000Z',
        },
        harvest: {
          id: '1',
          name: harvest.name,
          year: harvest.year,
          createdAt: '2021-01-01T00:00:00.000Z',
          updatedAt: '2021-01-01T00:00:00.000Z',
        },
      };

      const result = FARM_CROPS_TABLE_COLUMNS[3].render!(farmCrop);
      expect(result).toBe(`${harvest.name} (${harvest.year})`);
    });
  });

  it('deve ter propriedades corretas para cada coluna', () => {
    FARM_CROPS_TABLE_COLUMNS.forEach(column => {
      expect(column).toHaveProperty('key');
      expect(column).toHaveProperty('header');
      expect(column).toHaveProperty('width');

      if (column.render) {
        expect(typeof column.render).toBe('function');
      }
    });
  });

  it('deve ter larguras que somam 100%', () => {
    const totalWidth = FARM_CROPS_TABLE_COLUMNS.reduce((sum, column) => {
      const width = parseInt(column.width.replace('%', ''));
      return sum + width;
    }, 0);

    expect(totalWidth).toBe(100);
  });

  it('deve ter chaves únicas', () => {
    const keys = FARM_CROPS_TABLE_COLUMNS.map(column => column.key);
    const uniqueKeys = [...new Set(keys)];

    expect(keys).toHaveLength(uniqueKeys.length);
  });

  it('deve ter headers não vazios', () => {
    FARM_CROPS_TABLE_COLUMNS.forEach(column => {
      expect(column.header).toBeTruthy();
      expect(column.header.length).toBeGreaterThan(0);
    });
  });

  it('deve ter larguras válidas', () => {
    FARM_CROPS_TABLE_COLUMNS.forEach(column => {
      expect(column.width).toMatch(/^\d+%$/);
      const width = parseInt(column.width.replace('%', ''));
      expect(width).toBeGreaterThan(0);
      expect(width).toBeLessThanOrEqual(100);
    });
  });

  it('deve ter colunas com função render', () => {
    const columnsWithRender = FARM_CROPS_TABLE_COLUMNS.filter(column => column.render);
    expect(columnsWithRender).toHaveLength(6);

    columnsWithRender.forEach(column => {
      expect(typeof column.render).toBe('function');
    });
  });

  it('deve ter estrutura de dados correta', () => {
    FARM_CROPS_TABLE_COLUMNS.forEach(column => {
      expect(column).toMatchObject({
        key: expect.any(String),
        header: expect.any(String),
        width: expect.stringMatching(/^\d+%$/),
      });
    });
  });
});
