import { Harvest } from '@/entities/harvest';
import { formatDateUTC } from '@/shared/lib/utils/format';

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
    render: (harvest: Harvest) => formatDateUTC(harvest.createdAt),
  },
  {
    key: 'actions',
    header: 'Ações',
    width: '20%',
    render: (harvest: Harvest) => harvest.name, // Será substituído pelo componente
  },
];
