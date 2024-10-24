import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'weebSportApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'note',
    data: { pageTitle: 'weebSportApp.note.home.title' },
    loadChildren: () => import('./note/note.routes'),
  },
  {
    path: 'line',
    data: { pageTitle: 'weebSportApp.line.home.title' },
    loadChildren: () => import('./line/line.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
  {
    path: 'poc',
    data: { pageTitle: 'POC' },
    loadChildren: () => import('./poc/poc.routes'),
  },
];

export default routes;
