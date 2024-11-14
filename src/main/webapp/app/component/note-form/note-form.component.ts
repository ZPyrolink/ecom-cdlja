import { Component, OnInit } from '@angular/core';
import { NewNote } from '../../entities/note/note.model';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { NoteService, PartialUpdateNote } from '../../entities/note/service/note.service';
import { FormsModule } from '@angular/forms';
import { NoteType } from '../../entities/enumerations/note-type.model';
import { KeyValuePipe } from '@angular/common';
import { EntityResponseType } from '../../entities/user/service/user.service';
import { NewLine } from '../../entities/line/line.model';
import { LineService, PartialUpdateLine } from '../../entities/line/service/line.service';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'jhi-note-form',
  standalone: true,
  imports: [FormsModule, KeyValuePipe],
  templateUrl: './note-form.component.html',
  styleUrl: './note-form.component.scss',
})
export class NoteFormComponent implements OnInit {
  note: NewNote | PartialUpdateNote = {
    id: null,
    name: '',
    type: null,
  };

  content: (NewLine | PartialUpdateLine)[] = [];

  protected readonly NoteType = NoteType;

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: NoteService,
    private lineService: LineService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.pipe(map(params => params['id'] as number)).subscribe(id => {
      if (id) {
        this.service.find(id).subscribe(value => (this.note = value.body!));
        this.lineService.ofNote(id).subscribe(value => (this.content = value.body!));
      }
    });
  }

  submit(): void {
    const nav = (_: EntityResponseType): void => {
      this.router.navigate(['poc']);
    };

    const observables: Observable<EntityResponseType>[] = [];

    if (this.note.id == null) {
      window.console.log('Creating');
      observables.push(this.service.create(this.note));
    } else {
      window.console.log('Updating');
      observables.push(this.service.partialUpdate(this.note));
    }

    for (const line of this.content) {
      if (line.id == null) {
        observables.push(this.lineService.create(line));
      } else {
        observables.push(this.lineService.partialUpdate(line));
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    forkJoin(observables).subscribe(() => this.router.navigate(['poc']));
  }
}
