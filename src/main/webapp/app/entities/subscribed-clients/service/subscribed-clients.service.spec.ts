import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ISubscribedClients } from '../subscribed-clients.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../subscribed-clients.test-samples';

import { RestSubscribedClients, SubscribedClientsService } from './subscribed-clients.service';

const requireRestSample: RestSubscribedClients = {
  ...sampleWithRequiredData,
  birthday: sampleWithRequiredData.birthday?.format(DATE_FORMAT),
};

describe('SubscribedClients Service', () => {
  let service: SubscribedClientsService;
  let httpMock: HttpTestingController;
  let expectedResult: ISubscribedClients | ISubscribedClients[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(SubscribedClientsService);
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

    it('should create a SubscribedClients', () => {
      const subscribedClients = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(subscribedClients).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SubscribedClients', () => {
      const subscribedClients = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(subscribedClients).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SubscribedClients', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SubscribedClients', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SubscribedClients', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSubscribedClientsToCollectionIfMissing', () => {
      it('should add a SubscribedClients to an empty array', () => {
        const subscribedClients: ISubscribedClients = sampleWithRequiredData;
        expectedResult = service.addSubscribedClientsToCollectionIfMissing([], subscribedClients);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(subscribedClients);
      });

      it('should not add a SubscribedClients to an array that contains it', () => {
        const subscribedClients: ISubscribedClients = sampleWithRequiredData;
        const subscribedClientsCollection: ISubscribedClients[] = [
          {
            ...subscribedClients,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSubscribedClientsToCollectionIfMissing(subscribedClientsCollection, subscribedClients);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SubscribedClients to an array that doesn't contain it", () => {
        const subscribedClients: ISubscribedClients = sampleWithRequiredData;
        const subscribedClientsCollection: ISubscribedClients[] = [sampleWithPartialData];
        expectedResult = service.addSubscribedClientsToCollectionIfMissing(subscribedClientsCollection, subscribedClients);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(subscribedClients);
      });

      it('should add only unique SubscribedClients to an array', () => {
        const subscribedClientsArray: ISubscribedClients[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const subscribedClientsCollection: ISubscribedClients[] = [sampleWithRequiredData];
        expectedResult = service.addSubscribedClientsToCollectionIfMissing(subscribedClientsCollection, ...subscribedClientsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const subscribedClients: ISubscribedClients = sampleWithRequiredData;
        const subscribedClients2: ISubscribedClients = sampleWithPartialData;
        expectedResult = service.addSubscribedClientsToCollectionIfMissing([], subscribedClients, subscribedClients2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(subscribedClients);
        expect(expectedResult).toContain(subscribedClients2);
      });

      it('should accept null and undefined values', () => {
        const subscribedClients: ISubscribedClients = sampleWithRequiredData;
        expectedResult = service.addSubscribedClientsToCollectionIfMissing([], null, subscribedClients, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(subscribedClients);
      });

      it('should return initial array if no SubscribedClients is added', () => {
        const subscribedClientsCollection: ISubscribedClients[] = [sampleWithRequiredData];
        expectedResult = service.addSubscribedClientsToCollectionIfMissing(subscribedClientsCollection, undefined, null);
        expect(expectedResult).toEqual(subscribedClientsCollection);
      });
    });

    describe('compareSubscribedClients', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSubscribedClients(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSubscribedClients(entity1, entity2);
        const compareResult2 = service.compareSubscribedClients(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSubscribedClients(entity1, entity2);
        const compareResult2 = service.compareSubscribedClients(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSubscribedClients(entity1, entity2);
        const compareResult2 = service.compareSubscribedClients(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
