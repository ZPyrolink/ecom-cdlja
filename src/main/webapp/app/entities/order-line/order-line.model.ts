import { IStock } from 'app/entities/stock/stock.model';

export interface IOrderLine {
  id: number;
  quantity?: number | null;
  amountline?: number;
  stockDTO?: IStock;
}

export type NewOrderLine = Omit<IOrderLine, 'id'> & { id: null };
