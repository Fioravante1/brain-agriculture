import { FarmCrop } from '@/entities/farm-crop';

export const FARM_CROPS_TABLE_COLUMNS = [
  {
    key: 'farm',
    header: 'Fazenda',
    width: '25%',
    render: (farmCrop: FarmCrop) => farmCrop.farm.name,
  },
  {
    key: 'producer',
    header: 'Produtor',
    width: '20%',
    render: (farmCrop: FarmCrop) => farmCrop.farm.producer.name,
  },
  {
    key: 'crop',
    header: 'Cultura',
    width: '20%',
    render: (farmCrop: FarmCrop) => farmCrop.crop.name,
  },
  {
    key: 'harvest',
    header: 'Safra',
    width: '20%',
    render: (farmCrop: FarmCrop) => `${farmCrop.harvest.name} (${farmCrop.harvest.year})`,
  },
  {
    key: 'createdAt',
    header: 'Criada em',
    width: '10%',
    render: (farmCrop: FarmCrop) => new Date(farmCrop.createdAt).toLocaleDateString('pt-BR'),
  },
  {
    key: 'actions',
    header: 'Ações',
    width: '5%',
    render: (farmCrop: FarmCrop) => farmCrop.farm.name, // Será substituído pelo componente
  },
];
