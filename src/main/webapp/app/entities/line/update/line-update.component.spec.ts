import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { INote } from 'app/entities/note/note.model';
import { NoteService } from 'app/entities/note/service/note.service';
import { LineService } from '../service/line.service';
import { ILine } from '../line.model';
import { LineFormService } from './line-form.service';

import { LineUpdateComponent } from './line-update.component';

describe('Line Management Update Component', () => {
  let comp: LineUpdateComponent;
  let fixture: ComponentFixture<LineUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let lineFormService: LineFormService;
  let lineService: LineService;
  let noteService: NoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LineUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(LineUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LineUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    lineFormService = TestBed.inject(LineFormService);
    lineService = TestBed.inject(LineService);
    noteService = TestBed.inject(NoteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Note query and add missing value', () => {
      const line: ILine = { id: 456 };
      const note: INote = { id: 11439 };
      line.note = note;

      const noteCollection: INote[] = [{ id: 14681 }];
      jest.spyOn(noteService, 'query').mockReturnValue(of(new HttpResponse({ body: noteCollection })));
      const additionalNotes = [note];
      const expectedCollection: INote[] = [...additionalNotes, ...noteCollection];
      jest.spyOn(noteService, 'addNoteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ line });
      comp.ngOnInit();

      expect(noteService.query).toHaveBeenCalled();
      expect(noteService.addNoteToCollectionIfMissing).toHaveBeenCalledWith(
        noteCollection,
        ...additionalNotes.map(expect.objectContaining),
      );
      expect(comp.notesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const line: ILine = { id: 456 };
      const note: INote = { id: 4959 };
      line.note = note;

      activatedRoute.data = of({ line });
      comp.ngOnInit();

      expect(comp.notesSharedCollection).toContain(note);
      expect(comp.line).toEqual(line);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILine>>();
      const line = { id: 123 };
      jest.spyOn(lineFormService, 'getLine').mockReturnValue(line);
      jest.spyOn(lineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ line });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: line }));
      saveSubject.complete();

      // THEN
      expect(lineFormService.getLine).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(lineService.update).toHaveBeenCalledWith(expect.objectContaining(line));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILine>>();
      const line = { id: 123 };
      jest.spyOn(lineFormService, 'getLine').mockReturnValue({ id: null });
      jest.spyOn(lineService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ line: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: line }));
      saveSubject.complete();

      // THEN
      expect(lineFormService.getLine).toHaveBeenCalled();
      expect(lineService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILine>>();
      const line = { id: 123 };
      jest.spyOn(lineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ line });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(lineService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareNote', () => {
      it('Should forward to noteService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(noteService, 'compareNote');
        comp.compareNote(entity, entity2);
        expect(noteService.compareNote).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
