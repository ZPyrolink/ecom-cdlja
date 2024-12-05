import dayjs from 'dayjs/esm';

import { IOrder, NewOrder } from './order.model';

export const sampleWithRequiredData: IOrder = {
  id: 31707,
};

export const sampleWithPartialData: IOrder = {
  id: 17528,
  status: 'BASKET',
  amount: 26534.69,
};

export const sampleWithFullData: IOrder = {
  id: 24815,
  status: 'PAID',
  date: dayjs('2024-11-07'),
  amount: 6929.34,
  meanOfPayment: 'CB',
};

export const sampleWithNewData: NewOrder = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
