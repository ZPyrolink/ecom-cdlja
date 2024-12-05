import dayjs from 'dayjs/esm';

import { ISubscribedClients, NewSubscribedClients } from './subscribed-clients.model';

export const sampleWithRequiredData: ISubscribedClients = {
  id: 7431,
};

export const sampleWithPartialData: ISubscribedClients = {
  id: 22740,
  email: 'email.email@email.com',
  phoneNumber: '317.542.0946 x50780',
};

export const sampleWithFullData: ISubscribedClients = {
  id: 27410,
  email: 'Saige.Runte@yahoo.com',
  address: 'despite punctual',
  phoneNumber: '780-425-0607 x827',
  basket: {
    id: 7782,
    status: 'BASKET',
    date: dayjs(),
    amount: 0,
    meanOfPayment: 'CB',
    client: {
      id: 27410,
    },
  },
  favorises: [
    {
      id: 6719,
      type: 'TEESHIRT',
      price: 10,
    },
    {
      id: 6719,
      type: 'SHORT',
      gender: 'MAN',
      price: 25,
      description: 'un short basique pour homme',
    },
  ],
};

export const sampleWithNewData: NewSubscribedClients = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
