import { IOrder } from 'app/entities/order/order.model';
import { IClothe } from 'app/entities/clothe/clothe.model';

export interface ISubscribedClients {
  id: number;
  email?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  basket?: IOrder | null;
  favorises?: IClothe[] | null;
}

export type NewSubscribedClients = Omit<ISubscribedClients, 'id'> & { id: null };
