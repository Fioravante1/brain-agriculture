import { v4 as uuidv4 } from 'uuid';
import { Harvest } from '../../model';

export const HARVESTS_MOCK: Harvest[] = [
  {
    id: uuidv4(),
    year: 2021,
    name: 'Safra 2021',
    createdAt: new Date('2021-01-01'),
    updatedAt: new Date('2021-01-01'),
  },
  {
    id: uuidv4(),
    year: 2022,
    name: 'Safra 2022',
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2022-01-01'),
  },
  {
    id: uuidv4(),
    year: 2023,
    name: 'Safra 2023',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: uuidv4(),
    year: 2024,
    name: 'Safra 2024',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];
