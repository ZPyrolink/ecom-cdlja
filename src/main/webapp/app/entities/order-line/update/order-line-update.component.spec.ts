import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IOrder } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';
import { IStock } from 'app/entities/stock/stock.model';
import { StockService } from 'app/entities/stock/service/stock.service';
import { IOrderLine } from '../order-line.model';
import { OrderLineService } from '../service/order-line.service';
import { OrderLineFormService } from './order-line-form.service';

import { OrderLineUpdateComponent } from './order-line-update.component';

describe('OrderLine Management Update Component', () => {
  let comp: OrderLineUpdateComponent;
  let fixture: ComponentFixture<OrderLineUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let orderLineFormService: OrderLineFormService;
  let orderLineService: OrderLineService;
  let orderService: OrderService;
  let stockService: StockService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrderLineUpdateComponent],
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
      .overrideTemplate(OrderLineUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrderLineUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    orderLineFormService = TestBed.inject(OrderLineFormService);
    orderLineService = TestBed.inject(OrderLineService);
    orderService = TestBed.inject(OrderService);
    stockService = TestBed.inject(StockService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Order query and add missing value', () => {
      const orderLine: IOrderLine = { id: 456 };
      const order: IOrder = { id: 11697 };
      orderLine.order = order;

      const orderCollection: IOrder[] = [{ id: 30619 }];
      jest.spyOn(orderService, 'query').mockReturnValue(of(new HttpResponse({ body: orderCollection })));
      const additionalOrders = [order];
      const expectedCollection: IOrder[] = [...additionalOrders, ...orderCollection];
      jest.spyOn(orderService, 'addOrderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ orderLine });
      comp.ngOnInit();

      expect(orderService.query).toHaveBeenCalled();
      expect(orderService.addOrderToCollectionIfMissing).toHaveBeenCalledWith(
        orderCollection,
        ...additionalOrders.map(expect.objectContaining),
      );
      expect(comp.ordersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Stock query and add missing value', () => {
      const orderLine: IOrderLine = { id: 456 };
      const stock: IStock = { id: 12025 };
      orderLine.stock = stock;

      const stockCollection: IStock[] = [{ id: 4536 }];
      jest.spyOn(stockService, 'query').mockReturnValue(of(new HttpResponse({ body: stockCollection })));
      const additionalStocks = [stock];
      const expectedCollection: IStock[] = [...additionalStocks, ...stockCollection];
      jest.spyOn(stockService, 'addStockToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ orderLine });
      comp.ngOnInit();

      expect(stockService.query).toHaveBeenCalled();
      expect(stockService.addStockToCollectionIfMissing).toHaveBeenCalledWith(
        stockCollection,
        ...additionalStocks.map(expect.objectContaining),
      );
      expect(comp.stocksSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const orderLine: IOrderLine = { id: 456 };
      const order: IOrder = { id: 11955 };
      orderLine.order = order;
      const stock: IStock = { id: 9200 };
      orderLine.stock = stock;

      activatedRoute.data = of({ orderLine });
      comp.ngOnInit();

      expect(comp.ordersSharedCollection).toContain(order);
      expect(comp.stocksSharedCollection).toContain(stock);
      expect(comp.orderLine).toEqual(orderLine);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrderLine>>();
      const orderLine = { id: 123 };
      jest.spyOn(orderLineFormService, 'getOrderLine').mockReturnValue(orderLine);
      jest.spyOn(orderLineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orderLine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: orderLine }));
      saveSubject.complete();

      // THEN
      expect(orderLineFormService.getOrderLine).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(orderLineService.update).toHaveBeenCalledWith(expect.objectContaining(orderLine));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrderLine>>();
      const orderLine = { id: 123 };
      jest.spyOn(orderLineFormService, 'getOrderLine').mockReturnValue({ id: null });
      jest.spyOn(orderLineService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orderLine: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: orderLine }));
      saveSubject.complete();

      // THEN
      expect(orderLineFormService.getOrderLine).toHaveBeenCalled();
      expect(orderLineService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrderLine>>();
      const orderLine = { id: 123 };
      jest.spyOn(orderLineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orderLine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(orderLineService.update).toHaveBeenCalled();
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

    describe('compareStock', () => {
      it('Should forward to stockService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(stockService, 'compareStock');
        comp.compareStock(entity, entity2);
        expect(stockService.compareStock).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
