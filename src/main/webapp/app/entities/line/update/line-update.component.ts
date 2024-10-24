import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { INote } from 'app/entities/note/note.model';
import { NoteService } from 'app/entities/note/service/note.service';
import { ILine } from '../line.model';
import { LineService } from '../service/line.service';
import { LineFormGroup, LineFormService } from './line-form.service';

@Component({
  standalone: true,
  selector: 'jhi-line-update',
  templateUrl: './line-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class LineUpdateComponent implements OnInit {
  isSaving = false;
  line: ILine | null = null;

  notesSharedCollection: INote[] = [];

  protected lineService = inject(LineService);
  protected lineFormService = inject(LineFormService);
  protected noteService = inject(NoteService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: LineFormGroup = this.lineFormService.createLineFormGroup();

  compareNote = (o1: INote | null, o2: INote | null): boolean => this.noteService.compareNote(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ line }) => {
      this.line = line;
      if (line) {
        this.updateForm(line);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const line = this.lineFormService.getLine(this.editForm);
    if (line.id !== null) {
      this.subscribeToSaveResponse(this.lineService.update(line));
    } else {
      this.subscribeToSaveResponse(this.lineService.create(line));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILine>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(line: ILine): void {
    this.line = line;
    this.lineFormService.resetForm(this.editForm, line);

    this.notesSharedCollection = this.noteService.addNoteToCollectionIfMissing<INote>(this.notesSharedCollection, line.note);
  }

  protected loadRelationshipsOptions(): void {
    this.noteService
      .query()
      .pipe(map((res: HttpResponse<INote[]>) => res.body ?? []))
      .pipe(map((notes: INote[]) => this.noteService.addNoteToCollectionIfMissing<INote>(notes, this.line?.note)))
      .subscribe((notes: INote[]) => (this.notesSharedCollection = notes));
  }
}
