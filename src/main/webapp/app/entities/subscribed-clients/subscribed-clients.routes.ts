import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import SubscribedClientsResolve from './route/subscribed-clients-routing-resolve.service';

const subscribedClientsRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/subscribed-clients.component').then(m => m.SubscribedClientsComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/subscribed-clients-detail.component').then(m => m.SubscribedClientsDetailComponent),
    resolve: {
      subscribedClients: SubscribedClientsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/subscribed-clients-update.component').then(m => m.SubscribedClientsUpdateComponent),
    resolve: {
      subscribedClients: SubscribedClientsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/subscribed-clients-update.component').then(m => m.SubscribedClientsUpdateComponent),
    resolve: {
      subscribedClients: SubscribedClientsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default subscribedClientsRoute;
