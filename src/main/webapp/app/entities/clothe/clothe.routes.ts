import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import ClotheResolve from './route/clothe-routing-resolve.service';

const clotheRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/clothe.component').then(m => m.ClotheComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/clothe-detail.component').then(m => m.ClotheDetailComponent),
    resolve: {
      clothe: ClotheResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/clothe-update.component').then(m => m.ClotheUpdateComponent),
    resolve: {
      clothe: ClotheResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/clothe-update.component').then(m => m.ClotheUpdateComponent),
    resolve: {
      clothe: ClotheResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default clotheRoute;
