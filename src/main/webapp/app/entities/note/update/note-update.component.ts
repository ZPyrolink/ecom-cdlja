import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NoteType } from 'app/entities/enumerations/note-type.model';
import { INote } from '../note.model';
import { NoteService } from '../service/note.service';
import { NoteFormGroup, NoteFormService } from './note-form.service';

@Component({
  standalone: true,
  selector: 'jhi-note-update',
  templateUrl: './note-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class NoteUpdateComponent implements OnInit {
  isSaving = false;
  note: INote | null = null;
  noteTypeValues = Object.keys(NoteType);

  protected noteService = inject(NoteService);
  protected noteFormService = inject(NoteFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: NoteFormGroup = this.noteFormService.createNoteFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ note }) => {
      this.note = note;
      if (note) {
        this.updateForm(note);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const note = this.noteFormService.getNote(this.editForm);
    if (note.id !== null) {
      this.subscribeToSaveResponse(this.noteService.update(note));
    } else {
      this.subscribeToSaveResponse(this.noteService.create(note));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INote>>): void {
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

  protected updateForm(note: INote): void {
    this.note = note;
    this.noteFormService.resetForm(this.editForm, note);
  }
}
