import { NewUser } from '../../admin/user-management/user-management.model';
import { NewSubscribedClients } from '../subscribed-clients/subscribed-clients.model';

export interface ISigninRequest {
  managedUser: NewUser;
  subscribedClient: NewSubscribedClients;
}
