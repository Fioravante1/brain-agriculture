import { FARMS_TABLE_COLUMNS } from './farms-table-columns.config';

describe('FARMS_TABLE_COLUMNS', () => {
  it('deve ter estrutura correta das colunas', () => {
    expect(FARMS_TABLE_COLUMNS).toHaveLength(7);

    expect(FARMS_TABLE_COLUMNS[0]).toHaveProperty('key', 'name');
    expect(FARMS_TABLE_COLUMNS[0]).toHaveProperty('header', 'Nome da Fazenda');
    expect(FARMS_TABLE_COLUMNS[0]).toHaveProperty('width', '25%');

    expect(FARMS_TABLE_COLUMNS[1]).toHaveProperty('key', 'producer');
    expect(FARMS_TABLE_COLUMNS[1]).toHaveProperty('header', 'Produtor');
    expect(FARMS_TABLE_COLUMNS[1]).toHaveProperty('width', '20%');
    expect(FARMS_TABLE_COLUMNS[1]).toHaveProperty('render');

    expect(FARMS_TABLE_COLUMNS[2]).toHaveProperty('key', 'location');
    expect(FARMS_TABLE_COLUMNS[2]).toHaveProperty('header', 'Localização');
    expect(FARMS_TABLE_COLUMNS[2]).toHaveProperty('width', '15%');
    expect(FARMS_TABLE_COLUMNS[2]).toHaveProperty('render');

    expect(FARMS_TABLE_COLUMNS[3]).toHaveProperty('key', 'totalArea');
    expect(FARMS_TABLE_COLUMNS[3]).toHaveProperty('header', 'Área Total');
    expect(FARMS_TABLE_COLUMNS[3]).toHaveProperty('width', '12%');
    expect(FARMS_TABLE_COLUMNS[3]).toHaveProperty('render');

    expect(FARMS_TABLE_COLUMNS[4]).toHaveProperty('key', 'arableArea');
    expect(FARMS_TABLE_COLUMNS[4]).toHaveProperty('header', 'Área Agricultável');
    expect(FARMS_TABLE_COLUMNS[4]).toHaveProperty('width', '12%');
    expect(FARMS_TABLE_COLUMNS[4]).toHaveProperty('render');

    expect(FARMS_TABLE_COLUMNS[5]).toHaveProperty('key', 'vegetationArea');
    expect(FARMS_TABLE_COLUMNS[5]).toHaveProperty('header', 'Área Vegetação');
    expect(FARMS_TABLE_COLUMNS[5]).toHaveProperty('width', '12%');
    expect(FARMS_TABLE_COLUMNS[5]).toHaveProperty('render');

    expect(FARMS_TABLE_COLUMNS[6]).toHaveProperty('key', 'actions');
    expect(FARMS_TABLE_COLUMNS[6]).toHaveProperty('header', 'Ações');
    expect(FARMS_TABLE_COLUMNS[6]).toHaveProperty('width', '4%');
    expect(FARMS_TABLE_COLUMNS[6]).toHaveProperty('render');
  });

  it('deve renderizar nome do produtor corretamente', () => {
    const farm = {
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

    const result = FARMS_TABLE_COLUMNS[1].render!(farm);
    expect(result).toBe('João Silva');
  });

  it('deve renderizar localização corretamente', () => {
    const farm = {
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

    const result = FARMS_TABLE_COLUMNS[2].render!(farm);
    expect(result).toBe('São Paulo/SP');
  });

  it('deve renderizar área total corretamente', () => {
    const farm = {
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

    const result = FARMS_TABLE_COLUMNS[3].render!(farm);
    expect(result).toBe('100 ha');
  });

  it('deve renderizar área agricultável corretamente', () => {
    const farm = {
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

    const result = FARMS_TABLE_COLUMNS[4].render!(farm);
    expect(result).toBe('80 ha');
  });

  it('deve renderizar área de vegetação corretamente', () => {
    const farm = {
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

    const result = FARMS_TABLE_COLUMNS[5].render!(farm);
    expect(result).toBe('20 ha');
  });

  it('deve renderizar ações corretamente', () => {
    const farm = {
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

    const result = FARMS_TABLE_COLUMNS[6].render!(farm);
    expect(result).toBe('Fazenda São João');
  });

  it('deve lidar com produtor undefined', () => {
    const farm = {
      id: '1',
      producerId: '1',
      name: 'Fazenda São João',
      city: 'São Paulo',
      state: 'SP',
      totalArea: 100,
      arableArea: 80,
      vegetationArea: 20,
      farmCrops: [],
      producer: undefined as unknown as { id: string; name: string; cpfCnpj: string },
    };

    expect(() => FARMS_TABLE_COLUMNS[1].render!(farm)).toThrow();
  });

  it('deve lidar com produtor null', () => {
    const farm = {
      id: '1',
      producerId: '1',
      name: 'Fazenda São João',
      city: 'São Paulo',
      state: 'SP',
      totalArea: 100,
      arableArea: 80,
      vegetationArea: 20,
      farmCrops: [],
      producer: null as unknown as { id: string; name: string; cpfCnpj: string },
    };

    expect(() => FARMS_TABLE_COLUMNS[1].render!(farm)).toThrow();
  });

  it('deve lidar com cidade undefined', () => {
    const farm = {
      id: '1',
      producerId: '1',
      name: 'Fazenda São João',
      city: undefined as unknown as string,
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

    const result = FARMS_TABLE_COLUMNS[2].render!(farm);
    expect(result).toBe('undefined/SP');
  });

  it('deve lidar com estado undefined', () => {
    const farm = {
      id: '1',
      producerId: '1',
      name: 'Fazenda São João',
      city: 'São Paulo',
      state: undefined as unknown as string,
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

    const result = FARMS_TABLE_COLUMNS[2].render!(farm);
    expect(result).toBe('São Paulo/undefined');
  });

  it('deve lidar com área total undefined', () => {
    const farm = {
      id: '1',
      producerId: '1',
      name: 'Fazenda São João',
      city: 'São Paulo',
      state: 'SP',
      totalArea: undefined as unknown as number,
      arableArea: 80,
      vegetationArea: 20,
      farmCrops: [],
      producer: {
        id: '1',
        name: 'João Silva',
        cpfCnpj: '12345678901',
      },
    };

    const result = FARMS_TABLE_COLUMNS[3].render!(farm);
    expect(result).toBe('NaN ha');
  });

  it('deve lidar com área agricultável undefined', () => {
    const farm = {
      id: '1',
      producerId: '1',
      name: 'Fazenda São João',
      city: 'São Paulo',
      state: 'SP',
      totalArea: 100,
      arableArea: undefined as unknown as number,
      vegetationArea: 20,
      farmCrops: [],
      producer: {
        id: '1',
        name: 'João Silva',
        cpfCnpj: '12345678901',
      },
    };

    const result = FARMS_TABLE_COLUMNS[4].render!(farm);
    expect(result).toBe('NaN ha');
  });

  it('deve lidar com área de vegetação undefined', () => {
    const farm = {
      id: '1',
      producerId: '1',
      name: 'Fazenda São João',
      city: 'São Paulo',
      state: 'SP',
      totalArea: 100,
      arableArea: 80,
      vegetationArea: undefined as unknown as number,
      farmCrops: [],
      producer: {
        id: '1',
        name: 'João Silva',
        cpfCnpj: '12345678901',
      },
    };

    const result = FARMS_TABLE_COLUMNS[5].render!(farm);
    expect(result).toBe('NaN ha');
  });

  it('deve renderizar diferentes produtores', () => {
    const producers = ['João Silva', 'Maria Santos', 'Pedro Costa'];

    producers.forEach(producerName => {
      const farm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda Teste',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
        farmCrops: [],
        producer: {
          id: '1',
          name: producerName,
          cpfCnpj: '12345678901',
        },
      };

      const result = FARMS_TABLE_COLUMNS[1].render!(farm);
      expect(result).toBe(producerName);
    });
  });

  it('deve renderizar diferentes localizações', () => {
    const locations = [
      { city: 'São Paulo', state: 'SP' },
      { city: 'Rio de Janeiro', state: 'RJ' },
      { city: 'Belo Horizonte', state: 'MG' },
    ];

    locations.forEach(location => {
      const farm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda Teste',
        city: location.city,
        state: location.state,
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

      const result = FARMS_TABLE_COLUMNS[2].render!(farm);
      expect(result).toBe(`${location.city}/${location.state}`);
    });
  });

  it('deve renderizar diferentes áreas', () => {
    const areas = [100, 200, 500, 1000];

    areas.forEach(area => {
      const farm = {
        id: '1',
        producerId: '1',
        name: 'Fazenda Teste',
        city: 'São Paulo',
        state: 'SP',
        totalArea: area,
        arableArea: area * 0.8,
        vegetationArea: area * 0.2,
        farmCrops: [],
        producer: {
          id: '1',
          name: 'João Silva',
          cpfCnpj: '12345678901',
        },
      };

      const totalAreaResult = FARMS_TABLE_COLUMNS[3].render!(farm);
      const arableAreaResult = FARMS_TABLE_COLUMNS[4].render!(farm);
      const vegetationAreaResult = FARMS_TABLE_COLUMNS[5].render!(farm);

      expect(totalAreaResult).toBe(`${area.toLocaleString('pt-BR')} ha`);
      expect(arableAreaResult).toBe(`${(area * 0.8).toLocaleString('pt-BR')} ha`);
      expect(vegetationAreaResult).toBe(`${(area * 0.2).toLocaleString('pt-BR')} ha`);
    });
  });

  it('deve ter propriedades corretas para cada coluna', () => {
    FARMS_TABLE_COLUMNS.forEach(column => {
      expect(column).toHaveProperty('key');
      expect(column).toHaveProperty('header');
      expect(column).toHaveProperty('width');

      if (column.render) {
        expect(typeof column.render).toBe('function');
      }
    });
  });

  it('deve ter larguras que somam 100%', () => {
    const totalWidth = FARMS_TABLE_COLUMNS.reduce((sum, column) => {
      const width = parseInt(column.width.replace('%', ''));
      return sum + width;
    }, 0);

    expect(totalWidth).toBe(100);
  });

  it('deve ter chaves únicas', () => {
    const keys = FARMS_TABLE_COLUMNS.map(column => column.key);
    const uniqueKeys = [...new Set(keys)];

    expect(keys).toHaveLength(uniqueKeys.length);
  });

  it('deve ter headers não vazios', () => {
    FARMS_TABLE_COLUMNS.forEach(column => {
      expect(column.header).toBeTruthy();
      expect(column.header.length).toBeGreaterThan(0);
    });
  });

  it('deve ter larguras válidas', () => {
    FARMS_TABLE_COLUMNS.forEach(column => {
      expect(column.width).toMatch(/^\d+%$/);
      const width = parseInt(column.width.replace('%', ''));
      expect(width).toBeGreaterThan(0);
      expect(width).toBeLessThanOrEqual(100);
    });
  });

  it('deve ter coluna de nome sem função render', () => {
    const nameColumn = FARMS_TABLE_COLUMNS[0];
    expect(nameColumn.key).toBe('name');
    expect(nameColumn.render).toBeUndefined();
  });

  it('deve ter colunas com função render', () => {
    const columnsWithRender = FARMS_TABLE_COLUMNS.filter(column => column.render);
    expect(columnsWithRender).toHaveLength(6);

    columnsWithRender.forEach(column => {
      expect(typeof column.render).toBe('function');
    });
  });

  it('deve ter estrutura de dados correta', () => {
    FARMS_TABLE_COLUMNS.forEach(column => {
      expect(column).toMatchObject({
        key: expect.any(String),
        header: expect.any(String),
        width: expect.stringMatching(/^\d+%$/),
      });
    });
  });
});
