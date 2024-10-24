import { Routes } from '@angular/router';

const noteRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('../../component/note-list/note-list.component').then(m => m.NoteListComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('../../component/note/note.component').then(m => m.NoteComponent),
  },
];

export default noteRoute;
