import { Component, OnInit } from '@angular/core';
import { NewNote } from '../../entities/note/note.model';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { NoteService, PartialUpdateNote } from '../../entities/note/service/note.service';
import { FormsModule } from '@angular/forms';
import { NoteType } from '../../entities/enumerations/note-type.model';
import { KeyValuePipe } from '@angular/common';
import { EntityResponseType } from '../../entities/user/service/user.service';

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

  protected readonly NoteType = NoteType;

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: NoteService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.pipe(map(params => params['id'] as number)).subscribe(id => {
      if (id) {
        this.service.find(id).subscribe(value => (this.note = value.body!));
      }
    });
  }

  submit(): void {
    const nav = (_: EntityResponseType): void => {
      this.router.navigate(['poc']);
    };

    if (this.note.id == null) {
      window.console.log('Creating');
      this.service.create(this.note).subscribe(nav);
    } else {
      window.console.log('Updating');
      this.service.partialUpdate(this.note).subscribe(nav);
    }
  }
}
