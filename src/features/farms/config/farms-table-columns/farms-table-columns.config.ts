import { Farm } from '@/entities/farm';
import { formatNumber } from '@/shared/lib/utils';

export const FARMS_TABLE_COLUMNS = [
  {
    key: 'name',
    header: 'Nome da Fazenda',
    width: '25%',
  },
  {
    key: 'producer',
    header: 'Produtor',
    width: '20%',
    render: (farm: Farm) => farm.producer.name,
  },
  {
    key: 'location',
    header: 'Localização',
    width: '15%',
    render: (farm: Farm) => `${farm.city}/${farm.state}`,
  },
  {
    key: 'totalArea',
    header: 'Área Total',
    width: '12%',
    render: (farm: Farm) => `${formatNumber(farm.totalArea)} ha`,
  },
  {
    key: 'arableArea',
    header: 'Área Agricultável',
    width: '12%',
    render: (farm: Farm) => `${formatNumber(farm.arableArea)} ha`,
  },
  {
    key: 'vegetationArea',
    header: 'Área Vegetação',
    width: '12%',
    render: (farm: Farm) => `${formatNumber(farm.vegetationArea)} ha`,
  },
  {
    key: 'actions',
    header: 'Ações',
    width: '4%',
    render: (farm: Farm) => farm.name, // Será substituído pelo componente
  },
];
