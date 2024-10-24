import { Component, OnInit } from '@angular/core';
import { INote } from '../../entities/note/note.model';
import { ActivatedRoute } from '@angular/router';
import { NoteService } from '../../entities/note/service/note.service';
import { ILine } from '../../entities/line/line.model';
import { map } from 'rxjs/operators';
import { LineService } from '../../entities/line/service/line.service';

@Component({
  selector: 'jhi-note',
  standalone: true,
  imports: [],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss',
})
export class NoteComponent implements OnInit {
  note: INote | null = null;
  lines: ILine[] | null = null;

  constructor(
    private route: ActivatedRoute,
    private noteService: NoteService,
    private lineService: LineService,
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(map(params => params['id'] as number)).subscribe(id => {
      this.noteService.find(id).subscribe(note => (this.note = note.body));
      this.lineService.ofNote(id).subscribe(lines => (this.lines = lines.body));
    });
  }
}
