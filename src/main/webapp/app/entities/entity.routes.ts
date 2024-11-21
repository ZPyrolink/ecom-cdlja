import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'weebSportApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'clothe',
    data: { pageTitle: 'weebSportApp.clothe.home.title' },
    loadChildren: () => import('./clothe/clothe.routes'),
  },
  {
    path: 'stock',
    data: { pageTitle: 'weebSportApp.stock.home.title' },
    loadChildren: () => import('./stock/stock.routes'),
  },
  {
    path: 'order-line',
    data: { pageTitle: 'weebSportApp.orderLine.home.title' },
    loadChildren: () => import('./order-line/order-line.routes'),
  },
  {
    path: 'order',
    data: { pageTitle: 'weebSportApp.order.home.title' },
    loadChildren: () => import('./order/order.routes'),
  },
  {
    path: 'subscribed-clients',
    data: { pageTitle: 'weebSportApp.subscribedClients.home.title' },
    loadChildren: () => import('./subscribed-clients/subscribed-clients.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
