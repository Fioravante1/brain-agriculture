import { Producer } from '@/entities/producer';
import { formatCPFOrCNPJ } from '@/shared/lib/utils';

export const PRODUCERS_TABLE_COLUMNS = [
  {
    key: 'name',
    header: 'Nome',
    width: '30%',
  },
  {
    key: 'cpfCnpj',
    header: 'CPF/CNPJ',
    width: '20%',
    render: (producer: Producer) => formatCPFOrCNPJ(producer.cpfCnpj),
  },
  {
    key: 'farms',
    header: 'Nº de Fazendas',
    width: '20%',
    render: (producer: Producer) => producer.farms.length,
  },
  {
    key: 'totalArea',
    header: 'Área Total (ha)',
    width: '15%',
    render: (producer: Producer) => {
      const total = producer.farms.reduce((sum, farm) => sum + farm.totalArea, 0);
      return total.toLocaleString('pt-BR');
    },
  },
];
