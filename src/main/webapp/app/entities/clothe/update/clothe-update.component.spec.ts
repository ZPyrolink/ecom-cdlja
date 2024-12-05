import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ISubscribedClients } from 'app/entities/subscribed-clients/subscribed-clients.model';
import { SubscribedClientsService } from 'app/entities/subscribed-clients/service/subscribed-clients.service';
import { ClotheService } from '../service/clothe.service';
import { IClothe } from '../clothe.model';
import { ClotheFormService } from './clothe-form.service';

import { ClotheUpdateComponent } from './clothe-update.component';

describe('Clothe Management Update Component', () => {
  let comp: ClotheUpdateComponent;
  let fixture: ComponentFixture<ClotheUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let clotheFormService: ClotheFormService;
  let clotheService: ClotheService;
  let subscribedClientsService: SubscribedClientsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClotheUpdateComponent],
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
      .overrideTemplate(ClotheUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClotheUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    clotheFormService = TestBed.inject(ClotheFormService);
    clotheService = TestBed.inject(ClotheService);
    subscribedClientsService = TestBed.inject(SubscribedClientsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call SubscribedClients query and add missing value', () => {
      const clothe: IClothe = { id: 456 };
      const subscribedClients: ISubscribedClients[] = [{ id: 14462 }];
      clothe.subscribedClients = subscribedClients;

      const subscribedClientsCollection: ISubscribedClients[] = [{ id: 29494 }];
      jest.spyOn(subscribedClientsService, 'query').mockReturnValue(of(new HttpResponse({ body: subscribedClientsCollection })));
      const additionalSubscribedClients = [...subscribedClients];
      const expectedCollection: ISubscribedClients[] = [...additionalSubscribedClients, ...subscribedClientsCollection];
      jest.spyOn(subscribedClientsService, 'addSubscribedClientsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ clothe });
      comp.ngOnInit();

      expect(subscribedClientsService.query).toHaveBeenCalled();
      expect(subscribedClientsService.addSubscribedClientsToCollectionIfMissing).toHaveBeenCalledWith(
        subscribedClientsCollection,
        ...additionalSubscribedClients.map(expect.objectContaining),
      );
      expect(comp.subscribedClientsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const clothe: IClothe = { id: 456 };
      const subscribedClients: ISubscribedClients = { id: 20868 };
      clothe.subscribedClients = [subscribedClients];

      activatedRoute.data = of({ clothe });
      comp.ngOnInit();

      expect(comp.subscribedClientsSharedCollection).toContain(subscribedClients);
      expect(comp.clothe).toEqual(clothe);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClothe>>();
      const clothe = { id: 123 };
      jest.spyOn(clotheFormService, 'getClothe').mockReturnValue(clothe);
      jest.spyOn(clotheService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clothe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: clothe }));
      saveSubject.complete();

      // THEN
      expect(clotheFormService.getClothe).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(clotheService.update).toHaveBeenCalledWith(expect.objectContaining(clothe));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClothe>>();
      const clothe = { id: 123 };
      jest.spyOn(clotheFormService, 'getClothe').mockReturnValue({ id: null });
      jest.spyOn(clotheService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clothe: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: clothe }));
      saveSubject.complete();

      // THEN
      expect(clotheFormService.getClothe).toHaveBeenCalled();
      expect(clotheService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClothe>>();
      const clothe = { id: 123 };
      jest.spyOn(clotheService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clothe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(clotheService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareSubscribedClients', () => {
      it('Should forward to subscribedClientsService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(subscribedClientsService, 'compareSubscribedClients');
        comp.compareSubscribedClients(entity, entity2);
        expect(subscribedClientsService.compareSubscribedClients).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
