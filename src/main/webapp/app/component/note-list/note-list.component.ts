import { Component, OnInit } from '@angular/core';
import { INote } from '../../entities/note/note.model';
import { NoteService } from '../../entities/note/service/note.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'jhi-note-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.scss',
})
export class NoteListComponent implements OnInit {
  notes: INote[] = [];

  constructor(private service: NoteService) {}

  ngOnInit(): void {
    this.service.query().subscribe(next => (this.notes = next.body ?? []));
  }
}
