import { RouterModule, Routes } from '@angular/router';
import { errorRoute } from './layouts/error/error.route';
import { NgModule } from '@angular/core';
import { Authority } from './config/authority.constants';
import { UserRouteAccessService } from './core/auth/user-route-access.service';

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
    loadComponent: () => import('./login/login.component'),
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
  {
    path: 'product/:id',
    loadComponent: () => import('./component/product/product.component'),
    title: 'WeebSport',
  },
  {
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
    path: '',
    loadChildren: () => import(`./entities/entity.routes`),
  },
  ...errorRoute,
];

export default routes;

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
