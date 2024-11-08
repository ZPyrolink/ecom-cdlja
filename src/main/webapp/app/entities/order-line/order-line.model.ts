import { IOrder } from 'app/entities/order/order.model';
import { IStock } from 'app/entities/stock/stock.model';

export interface IOrderLine {
  id: number;
  quantity?: number | null;
  amountline?: number | null;
  order?: IOrder | null;
  stock?: IStock | null;
}

export type NewOrderLine = Omit<IOrderLine, 'id'> & { id: null };
