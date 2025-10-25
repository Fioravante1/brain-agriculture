import { v4 as uuidv4 } from 'uuid';
import { Crop, CropType } from '../../model';

export const CROPS_MOCK: Crop[] = [
  {
    id: uuidv4(),
    name: CropType.SOJA,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: uuidv4(),
    name: CropType.MILHO,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: uuidv4(),
    name: CropType.ALGODAO,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
  {
    id: uuidv4(),
    name: CropType.CAFE,
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04'),
  },
  {
    id: uuidv4(),
    name: CropType.CANA_DE_ACUCAR,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
];
