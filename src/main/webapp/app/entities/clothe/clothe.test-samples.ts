import { IClothe, NewClothe } from './clothe.model';

export const sampleWithRequiredData: IClothe = {
  id: 10677,
};

export const sampleWithPartialData: IClothe = {
  id: 23113,
  type: 'JOGGER',
  theme: 'while oh',
  gender: 'WOMAN',
  price: 30446.64,
};

export const sampleWithFullData: IClothe = {
  id: 7334,
  type: 'JOGGER',
  theme: 'iridescence negative unhappy',
  gender: 'WOMAN',
  price: 8646.86,
  description: 'delightfully geez accompanist',
};

export const sampleWithNewData: NewClothe = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
