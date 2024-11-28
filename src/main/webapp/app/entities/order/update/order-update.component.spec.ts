import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ISubscribedClients } from 'app/entities/subscribed-clients/subscribed-clients.model';
import { SubscribedClientsService } from 'app/entities/subscribed-clients/service/subscribed-clients.service';
import { OrderService } from '../service/order.service';
import { IOrder } from '../order.model';
import { OrderFormService } from './order-form.service';

import { OrderUpdateComponent } from './order-update.component';

describe('Order Management Update Component', () => {
  let comp: OrderUpdateComponent;
  let fixture: ComponentFixture<OrderUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let orderFormService: OrderFormService;
  let orderService: OrderService;
  let subscribedClientsService: SubscribedClientsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrderUpdateComponent],
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
      .overrideTemplate(OrderUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrderUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    orderFormService = TestBed.inject(OrderFormService);
    orderService = TestBed.inject(OrderService);
    subscribedClientsService = TestBed.inject(SubscribedClientsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call SubscribedClients query and add missing value', () => {
      const order: IOrder = { id: 456 };
      const client: ISubscribedClients = { id: 26099 };
      order.client = client;

      const subscribedClientsCollection: ISubscribedClients[] = [{ id: 18567 }];
      jest.spyOn(subscribedClientsService, 'query').mockReturnValue(of(new HttpResponse({ body: subscribedClientsCollection })));
      const additionalSubscribedClients = [client];
      const expectedCollection: ISubscribedClients[] = [...additionalSubscribedClients, ...subscribedClientsCollection];
      jest.spyOn(subscribedClientsService, 'addSubscribedClientsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ order });
      comp.ngOnInit();

      expect(subscribedClientsService.query).toHaveBeenCalled();
      expect(subscribedClientsService.addSubscribedClientsToCollectionIfMissing).toHaveBeenCalledWith(
        subscribedClientsCollection,
        ...additionalSubscribedClients.map(expect.objectContaining),
      );
      expect(comp.subscribedClientsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const order: IOrder = { id: 456 };
      const client: ISubscribedClients = { id: 20630 };
      order.client = client;

      activatedRoute.data = of({ order });
      comp.ngOnInit();

      expect(comp.subscribedClientsSharedCollection).toContain(client);
      expect(comp.order).toEqual(order);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrder>>();
      const order = { id: 123 };
      jest.spyOn(orderFormService, 'getOrder').mockReturnValue(order);
      jest.spyOn(orderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ order });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: order }));
      saveSubject.complete();

      // THEN
      expect(orderFormService.getOrder).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(orderService.update).toHaveBeenCalledWith(expect.objectContaining(order));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrder>>();
      const order = { id: 123 };
      jest.spyOn(orderFormService, 'getOrder').mockReturnValue({ id: null });
      jest.spyOn(orderService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ order: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: order }));
      saveSubject.complete();

      // THEN
      expect(orderFormService.getOrder).toHaveBeenCalled();
      expect(orderService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrder>>();
      const order = { id: 123 };
      jest.spyOn(orderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ order });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(orderService.update).toHaveBeenCalled();
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
