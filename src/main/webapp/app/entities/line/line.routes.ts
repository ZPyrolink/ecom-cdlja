import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import LineResolve from './route/line-routing-resolve.service';

const lineRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/line.component').then(m => m.LineComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/line-detail.component').then(m => m.LineDetailComponent),
    resolve: {
      line: LineResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/line-update.component').then(m => m.LineUpdateComponent),
    resolve: {
      line: LineResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/line-update.component').then(m => m.LineUpdateComponent),
    resolve: {
      line: LineResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default lineRoute;
