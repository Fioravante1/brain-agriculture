import { v4 as uuidv4 } from 'uuid';
import { Producer } from '../../model';
import { FARMS_MOCK } from '../../../farm/lib/mocks';

export const PRODUCERS_MOCK: Producer[] = [
  {
    id: uuidv4(),
    cpfCnpj: '123.456.789-09',
    name: 'João Silva',
    farms: FARMS_MOCK.filter((f) => f.producerId === '1'),
  },
  {
    id: uuidv4(),
    cpfCnpj: '98.765.432/0001-10',
    name: 'Agropecuária Santos Ltda',
    farms: FARMS_MOCK.filter((f) => f.producerId === '2'),
  },
  {
    id: uuidv4(),
    cpfCnpj: '987.654.321-00',
    name: 'Maria Oliveira',
    farms: FARMS_MOCK.filter((f) => f.producerId === '3'),
  },
  {
    id: uuidv4(),
    cpfCnpj: '12.345.678/0001-90',
    name: 'Fazendas Reunidas São Paulo',
    farms: FARMS_MOCK.filter((f) => f.producerId === '4'),
  },
];
