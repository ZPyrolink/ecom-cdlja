import dayjs from 'dayjs/esm';
import { ISubscribedClients } from 'app/entities/subscribed-clients/subscribed-clients.model';
import { Status } from 'app/entities/enumerations/status.model';
import { MeansOfPayment } from 'app/entities/enumerations/means-of-payment.model';

export interface IOrder {
  id: number;
  status?: keyof typeof Status | null;
  date?: dayjs.Dayjs | null;
  amount?: number | null;
  meanOfPayment?: keyof typeof MeansOfPayment | null;
  client?: ISubscribedClients | null;
}

export type NewOrder = Omit<IOrder, 'id'> & { id: null };
