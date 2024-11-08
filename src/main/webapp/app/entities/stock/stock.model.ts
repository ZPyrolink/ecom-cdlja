import { IClothe } from 'app/entities/clothe/clothe.model';
import { Color } from 'app/entities/enumerations/color.model';
import { Size } from 'app/entities/enumerations/size.model';

export interface IStock {
  id: number;
  color?: keyof typeof Color | null;
  size?: keyof typeof Size | null;
  quantity?: number | null;
  clothe?: IClothe | null;
}

export type NewStock = Omit<IStock, 'id'> & { id: null };
