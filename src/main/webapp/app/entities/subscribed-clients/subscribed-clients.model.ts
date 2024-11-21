import dayjs from 'dayjs/esm';
import { IOrder } from 'app/entities/order/order.model';
import { IClothe } from 'app/entities/clothe/clothe.model';

export interface ISubscribedClients {
  id: number;
  lastname?: string | null;
  firstname?: string | null;
  birthday?: dayjs.Dayjs | null;
  email?: string | null;
  passworld?: string | null;
  address?: string | null;
  bankCard?: string | null;
  phone?: string | null;
  points?: number | null;
  basket?: IOrder | null;
  favorises?: IClothe[] | null;
}

export type NewSubscribedClients = Omit<ISubscribedClients, 'id'> & { id: null };
