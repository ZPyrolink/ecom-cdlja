import { Component, OnInit } from '@angular/core';
import { INote, NewNote } from '../../entities/note/note.model';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { NoteService, PartialUpdateNote } from '../../entities/note/service/note.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NoteType } from '../../entities/enumerations/note-type.model';
import { KeyValuePipe } from '@angular/common';
import { NewLine } from '../../entities/line/line.model';
import { LineService, PartialUpdateLine } from '../../entities/line/service/line.service';
import { forkJoin, Observable } from 'rxjs';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

type NewOrPartialUpdateLine = NewLine | PartialUpdateLine;

@Component({
  selector: 'jhi-note-form',
  standalone: true,
  imports: [FormsModule, KeyValuePipe, FaIconComponent, ReactiveFormsModule],
  templateUrl: './note-form.component.html',
  styleUrl: './note-form.component.scss',
})
export class NoteFormComponent implements OnInit {
  note: NewNote | PartialUpdateNote = {
    id: null,
    name: '',
    type: null,
  };

  noteForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  content: NewOrPartialUpdateLine[] = [];

  showErrors = false;

  protected readonly NoteType = NoteType;

  private removedLines: number[] = [];

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
    this.showErrors = true;

    if (!this.noteForm.valid) return;

    const observables: Observable<any>[] = [];

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

    for (const lineId of this.removedLines) {
      observables.push(this.lineService.delete(lineId));
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    forkJoin(observables).subscribe(() => this.router.navigate(['poc']));
  }

  addNote(): void {
    this.content.push({
      id: null,
      content: '',
      note: this.note as INote,
    });
  }

  removeLine = (line: NewOrPartialUpdateLine): void => {
    this.content.splice(this.content.indexOf(line), 1);

    if (line.id != null) {
      this.removedLines.push(line.id);
    }
  };
}
