import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IClothe } from '../clothe.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../clothe.test-samples';

import { ClotheService } from './clothe.service';

const requireRestSample: IClothe = {
  ...sampleWithRequiredData,
};

describe('Clothe Service', () => {
  let service: ClotheService;
  let httpMock: HttpTestingController;
  let expectedResult: IClothe | IClothe[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(ClotheService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Clothe', () => {
      const clothe = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(clothe).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Clothe', () => {
      const clothe = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(clothe).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Clothe', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should delete a Clothe', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addClotheToCollectionIfMissing', () => {
      it('should add a Clothe to an empty array', () => {
        const clothe: IClothe = sampleWithRequiredData;
        expectedResult = service.addClotheToCollectionIfMissing([], clothe);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(clothe);
      });

      it('should not add a Clothe to an array that contains it', () => {
        const clothe: IClothe = sampleWithRequiredData;
        const clotheCollection: IClothe[] = [
          {
            ...clothe,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addClotheToCollectionIfMissing(clotheCollection, clothe);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Clothe to an array that doesn't contain it", () => {
        const clothe: IClothe = sampleWithRequiredData;
        const clotheCollection: IClothe[] = [sampleWithPartialData];
        expectedResult = service.addClotheToCollectionIfMissing(clotheCollection, clothe);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(clothe);
      });

      it('should add only unique Clothe to an array', () => {
        const clotheArray: IClothe[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const clotheCollection: IClothe[] = [sampleWithRequiredData];
        expectedResult = service.addClotheToCollectionIfMissing(clotheCollection, ...clotheArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const clothe: IClothe = sampleWithRequiredData;
        const clothe2: IClothe = sampleWithPartialData;
        expectedResult = service.addClotheToCollectionIfMissing([], clothe, clothe2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(clothe);
        expect(expectedResult).toContain(clothe2);
      });

      it('should accept null and undefined values', () => {
        const clothe: IClothe = sampleWithRequiredData;
        expectedResult = service.addClotheToCollectionIfMissing([], null, clothe, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(clothe);
      });

      it('should return initial array if no Clothe is added', () => {
        const clotheCollection: IClothe[] = [sampleWithRequiredData];
        expectedResult = service.addClotheToCollectionIfMissing(clotheCollection, undefined, null);
        expect(expectedResult).toEqual(clotheCollection);
      });
    });

    describe('compareClothe', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareClothe(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareClothe(entity1, entity2);
        const compareResult2 = service.compareClothe(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareClothe(entity1, entity2);
        const compareResult2 = service.compareClothe(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareClothe(entity1, entity2);
        const compareResult2 = service.compareClothe(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
