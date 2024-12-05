import dayjs from 'dayjs/esm';
import { Status } from 'app/entities/enumerations/status.model';
import { MeansOfPayment } from 'app/entities/enumerations/means-of-payment.model';
import { IOrderLine } from '../order-line/order-line.model';

export interface IOrder {
  id: number;
  status?: keyof typeof Status | null;
  bankCard?: string;
  date?: dayjs.Dayjs | null;
  amount?: number | null;
  deliveryAddress?: string;
  meanOfPayment?: keyof typeof MeansOfPayment | null;
  orderLines?: IOrderLine[];
  number?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  first?: boolean;
  last?: boolean;
}

export type NewOrder = Omit<IOrder, 'id'> & { id: null };
