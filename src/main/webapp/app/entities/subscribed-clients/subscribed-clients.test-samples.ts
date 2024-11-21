import dayjs from 'dayjs/esm';

import { ISubscribedClients, NewSubscribedClients } from './subscribed-clients.model';

export const sampleWithRequiredData: ISubscribedClients = {
  id: 7431,
};

export const sampleWithPartialData: ISubscribedClients = {
  id: 22740,
  firstname: 'savour tempting',
  birthday: dayjs('2024-11-06'),
  passworld: 'since',
  phone: '317.542.0946 x50780',
  points: 2797,
};

export const sampleWithFullData: ISubscribedClients = {
  id: 27410,
  lastname: 'cake basic',
  firstname: 'hm pivot into',
  birthday: dayjs('2024-11-07'),
  email: 'Saige.Runte@yahoo.com',
  passworld: 'for midst draft',
  address: 'despite punctual',
  banckCard: 'skeletal yippee',
  phone: '780-425-0607 x827',
  points: 8899,
};

export const sampleWithNewData: NewSubscribedClients = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
