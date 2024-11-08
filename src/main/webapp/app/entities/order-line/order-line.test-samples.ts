import { IOrderLine, NewOrderLine } from './order-line.model';

export const sampleWithRequiredData: IOrderLine = {
  id: 9336,
};

export const sampleWithPartialData: IOrderLine = {
  id: 25421,
  quantity: 6408,
};

export const sampleWithFullData: IOrderLine = {
  id: 5968,
  quantity: 7329,
  amountline: 21654.87,
};

export const sampleWithNewData: NewOrderLine = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
