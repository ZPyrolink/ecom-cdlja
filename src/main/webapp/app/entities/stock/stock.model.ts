import { IClothe } from 'app/entities/clothe/clothe.model';
import { Color } from 'app/entities/enumerations/color.model';
import { Size } from 'app/entities/enumerations/size.model';

export interface IStock {
  id: number;
  color?: keyof typeof Color;
  size?: keyof typeof Size;
  quantity?: number;
  version?: number;
  clotheDTO?: IClothe;
}

export type NewStock = Omit<IStock, 'id'> & { id: null };
