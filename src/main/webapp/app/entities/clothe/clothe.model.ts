import { ISubscribedClients } from 'app/entities/subscribed-clients/subscribed-clients.model';
import { Type } from 'app/entities/enumerations/type.model';
import { Gender } from 'app/entities/enumerations/gender.model';

export interface IClothe {
  id: number;
  type?: keyof typeof Type;
  theme?: string;
  gender?: keyof typeof Gender;
  price?: number;
  description?: string;
  subscribedClients?: ISubscribedClients[];
  imageP?: string;
}

export type NewClothe = Omit<IClothe, 'id'> & { id: null };
