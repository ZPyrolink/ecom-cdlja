import { IStock, NewStock } from './stock.model';

export const sampleWithRequiredData: IStock = {
  id: 7706,
};

export const sampleWithPartialData: IStock = {
  id: 17890,
};

export const sampleWithFullData: IStock = {
  id: 2726,
  color: 'PINK',
  size: 'TWELVE',
  quantity: 31128,
};

export const sampleWithNewData: NewStock = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
