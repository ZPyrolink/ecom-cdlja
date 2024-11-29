import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IClothe } from 'app/entities/clothe/clothe.model';
import { ClotheService } from 'app/entities/clothe/service/clothe.service';
import { StockService } from '../service/stock.service';
import { IStock } from '../stock.model';
import { StockFormService } from './stock-form.service';

import { StockUpdateComponent } from './stock-update.component';

describe('Stock Management Update Component', () => {
  let comp: StockUpdateComponent;
  let fixture: ComponentFixture<StockUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let stockFormService: StockFormService;
  let stockService: StockService;
  let clotheService: ClotheService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StockUpdateComponent],
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
      .overrideTemplate(StockUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StockUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    stockFormService = TestBed.inject(StockFormService);
    stockService = TestBed.inject(StockService);
    clotheService = TestBed.inject(ClotheService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Clothe query and add missing value', () => {
      const stock: IStock = { id: 456 };
      const clothe: IClothe = { id: 16705 };
      stock.clothe = clothe;

      const clotheCollection: IClothe[] = [{ id: 30932 }];
      jest.spyOn(clotheService, 'query').mockReturnValue(of(new HttpResponse({ body: clotheCollection })));
      const additionalClothes = [clothe];
      const expectedCollection: IClothe[] = [...additionalClothes, ...clotheCollection];
      jest.spyOn(clotheService, 'addClotheToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ stock });
      comp.ngOnInit();

      expect(clotheService.query).toHaveBeenCalled();
      expect(clotheService.addClotheToCollectionIfMissing).toHaveBeenCalledWith(
        clotheCollection,
        ...additionalClothes.map(expect.objectContaining),
      );
      expect(comp.clothesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const stock: IStock = { id: 456 };
      const clothe: IClothe = { id: 22387 };
      stock.clothe = clothe;

      activatedRoute.data = of({ stock });
      comp.ngOnInit();

      expect(comp.clothesSharedCollection).toContain(clothe);
      expect(comp.stock).toEqual(stock);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStock>>();
      const stock = { id: 123 };
      jest.spyOn(stockFormService, 'getStock').mockReturnValue(stock);
      jest.spyOn(stockService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stock });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: stock }));
      saveSubject.complete();

      // THEN
      expect(stockFormService.getStock).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(stockService.update).toHaveBeenCalledWith(expect.objectContaining(stock));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStock>>();
      const stock = { id: 123 };
      jest.spyOn(stockFormService, 'getStock').mockReturnValue({ id: null });
      jest.spyOn(stockService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stock: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: stock }));
      saveSubject.complete();

      // THEN
      expect(stockFormService.getStock).toHaveBeenCalled();
      expect(stockService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStock>>();
      const stock = { id: 123 };
      jest.spyOn(stockService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stock });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(stockService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
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
