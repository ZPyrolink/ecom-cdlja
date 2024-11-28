import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IOrder } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';
import { IClothe } from 'app/entities/clothe/clothe.model';
import { ClotheService } from 'app/entities/clothe/service/clothe.service';
import { ISubscribedClients } from '../subscribed-clients.model';
import { SubscribedClientsService } from '../service/subscribed-clients.service';
import { SubscribedClientsFormService } from './subscribed-clients-form.service';

import { SubscribedClientsUpdateComponent } from './subscribed-clients-update.component';

describe('SubscribedClients Management Update Component', () => {
  let comp: SubscribedClientsUpdateComponent;
  let fixture: ComponentFixture<SubscribedClientsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let subscribedClientsFormService: SubscribedClientsFormService;
  let subscribedClientsService: SubscribedClientsService;
  let orderService: OrderService;
  let clotheService: ClotheService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SubscribedClientsUpdateComponent],
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
      .overrideTemplate(SubscribedClientsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SubscribedClientsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    subscribedClientsFormService = TestBed.inject(SubscribedClientsFormService);
    subscribedClientsService = TestBed.inject(SubscribedClientsService);
    orderService = TestBed.inject(OrderService);
    clotheService = TestBed.inject(ClotheService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call basket query and add missing value', () => {
      const subscribedClients: ISubscribedClients = { id: 456 };
      const basket: IOrder = { id: 18991 };
      subscribedClients.basket = basket;

      const basketCollection: IOrder[] = [{ id: 24883 }];
      jest.spyOn(orderService, 'query').mockReturnValue(of(new HttpResponse({ body: basketCollection })));
      const expectedCollection: IOrder[] = [basket, ...basketCollection];
      jest.spyOn(orderService, 'addOrderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ subscribedClients });
      comp.ngOnInit();

      expect(orderService.query).toHaveBeenCalled();
      expect(orderService.addOrderToCollectionIfMissing).toHaveBeenCalledWith(basketCollection, basket);
      expect(comp.basketsCollection).toEqual(expectedCollection);
    });

    it('Should call Clothe query and add missing value', () => {
      const subscribedClients: ISubscribedClients = { id: 456 };
      const favorises: IClothe[] = [{ id: 25098 }];
      subscribedClients.favorises = favorises;

      const clotheCollection: IClothe[] = [{ id: 12727 }];
      jest.spyOn(clotheService, 'query').mockReturnValue(of(new HttpResponse({ body: clotheCollection })));
      const additionalClothes = [...favorises];
      const expectedCollection: IClothe[] = [...additionalClothes, ...clotheCollection];
      jest.spyOn(clotheService, 'addClotheToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ subscribedClients });
      comp.ngOnInit();

      expect(clotheService.query).toHaveBeenCalled();
      expect(clotheService.addClotheToCollectionIfMissing).toHaveBeenCalledWith(
        clotheCollection,
        ...additionalClothes.map(expect.objectContaining),
      );
      expect(comp.clothesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const subscribedClients: ISubscribedClients = { id: 456 };
      const basket: IOrder = { id: 4631 };
      subscribedClients.basket = basket;
      const favoris: IClothe = { id: 25216 };
      subscribedClients.favorises = [favoris];

      activatedRoute.data = of({ subscribedClients });
      comp.ngOnInit();

      expect(comp.basketsCollection).toContain(basket);
      expect(comp.clothesSharedCollection).toContain(favoris);
      expect(comp.subscribedClients).toEqual(subscribedClients);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISubscribedClients>>();
      const subscribedClients = { id: 123 };
      jest.spyOn(subscribedClientsFormService, 'getSubscribedClients').mockReturnValue(subscribedClients);
      jest.spyOn(subscribedClientsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ subscribedClients });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: subscribedClients }));
      saveSubject.complete();

      // THEN
      expect(subscribedClientsFormService.getSubscribedClients).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(subscribedClientsService.update).toHaveBeenCalledWith(expect.objectContaining(subscribedClients));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISubscribedClients>>();
      const subscribedClients = { id: 123 };
      jest.spyOn(subscribedClientsFormService, 'getSubscribedClients').mockReturnValue({ id: null });
      jest.spyOn(subscribedClientsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ subscribedClients: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: subscribedClients }));
      saveSubject.complete();

      // THEN
      expect(subscribedClientsFormService.getSubscribedClients).toHaveBeenCalled();
      expect(subscribedClientsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISubscribedClients>>();
      const subscribedClients = { id: 123 };
      jest.spyOn(subscribedClientsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ subscribedClients });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(subscribedClientsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareOrder', () => {
      it('Should forward to orderService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(orderService, 'compareOrder');
        comp.compareOrder(entity, entity2);
        expect(orderService.compareOrder).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareClothe', () => {
      it('Should forward to clotheService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(clotheService, 'compareClothe');
        comp.compareClothe(entity, entity2);
        expect(clotheService.compareClothe).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
