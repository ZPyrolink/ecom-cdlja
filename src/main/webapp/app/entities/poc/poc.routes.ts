import { Routes } from '@angular/router';

const pocRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('../../component/note-list/note-list.component').then(m => m.NoteListComponent),
  },
  {
    path: ':id/view',
    loadComponent: () => import('../../component/note/note.component').then(m => m.NoteComponent),
  },
  {
    path: 'form/note',
    loadComponent: () => import('../../component/note-form/note-form.component').then(m => m.NoteFormComponent),
  },
  {
    path: 'form/note/:id',
    loadComponent: () => import('../../component/note-form/note-form.component').then(m => m.NoteFormComponent),
  },
];

export default pocRoute;
