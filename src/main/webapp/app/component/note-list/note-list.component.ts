import { Component, OnInit } from '@angular/core';
import { INote } from '../../entities/note/note.model';
import { NoteService } from '../../entities/note/service/note.service';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'jhi-note-list',
  standalone: true,
  imports: [RouterLink, FaIconComponent],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.scss',
  providers: [NoteService],
})
export class NoteListComponent implements OnInit {
  notes: INote[] = [];

  constructor(private service: NoteService) {}

  ngOnInit(): void {
    this.service.query().subscribe(next => (this.notes = next.body ?? []));
  }

  remove(note: INote): void {
    this.service.delete(note.id).subscribe();
    this.notes = this.notes.filter(n => n !== note);
  }
}
