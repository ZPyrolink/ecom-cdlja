import { ISubscribedClients } from 'app/entities/subscribed-clients/subscribed-clients.model';
import { Type } from 'app/entities/enumerations/type.model';
import { Gender } from 'app/entities/enumerations/gender.model';

export interface IClothe {
  id: number;
  type?: keyof typeof Type | null;
  theme?: string | null;
  gender?: keyof typeof Gender | null;
  price?: number | null;
  description?: string | null;
  subscribedClients?: ISubscribedClients[] | null;
}

export type NewClothe = Omit<IClothe, 'id'> & { id: null };
