import { Crop } from '@/entities/crop';

export const CROPS_TABLE_COLUMNS = [
  {
    key: 'name',
    header: 'Nome da Cultura',
    width: '80%',
  },
  {
    key: 'actions',
    header: 'Ações',
    width: '20%',
    render: (crop: Crop) => crop.name, // Será substituído pelo componente
  },
];
