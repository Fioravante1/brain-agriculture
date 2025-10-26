import { Harvest } from '@/entities/harvest';

export const HARVESTS_TABLE_COLUMNS = [
  {
    key: 'name',
    header: 'Nome da Safra',
    width: '40%',
  },
  {
    key: 'year',
    header: 'Ano',
    width: '20%',
    render: (harvest: Harvest) => harvest.year.toString(),
  },
  {
    key: 'createdAt',
    header: 'Criada em',
    width: '20%',
    render: (harvest: Harvest) => new Date(harvest.createdAt).toLocaleDateString('pt-BR'),
  },
  {
    key: 'actions',
    header: 'Ações',
    width: '20%',
    render: (harvest: Harvest) => harvest.name, // Será substituído pelo componente
  },
];
