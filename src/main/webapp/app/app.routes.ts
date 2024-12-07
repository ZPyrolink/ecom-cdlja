import { Routes } from '@angular/router';
import { errorRoute } from './layouts/error/error.route';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./component/listing-product/listing-product.component'),
    title: 'WeebSport',
  },
  {
    path: 'home',
    loadComponent: () => import('./component/home/home.component'),
    title: 'WeebSport',
  },
  {
    path: 'login',
    loadComponent: () => import('./component/login/login.component'),
    title: 'WeebSport',
  },
  {
    path: 'basket',
    loadComponent: () => import('./component/basket/basket.component'),
    title: 'WeebSport',
  },
  {
    path: 'setting',
    loadComponent: () => import('./component/setting/setting.component'),
    title: 'WeebSport',
  },
  /*  {
    path: '',
    loadComponent: () => import('./home/home.component'),
    title: 'home.title',
  },
  {
    path: '',
    loadComponent: () => import('./layouts/navbar/navbar.component'),
    outlet: 'navbar',
  },*/
  /* {
    path: 'admin',
    data: {
      authorities: [Authority.ADMIN],
    },
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('./admin/admin.routes'),
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.route'),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component'),
    title: 'login.title',
  },
  {
    path: '',
    loadChildren: () => import(`./entities/entity.routes`),
  },*/
  ...errorRoute,
];

export default routes;
