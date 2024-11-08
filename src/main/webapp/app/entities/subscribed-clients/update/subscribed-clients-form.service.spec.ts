import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../subscribed-clients.test-samples';

import { SubscribedClientsFormService } from './subscribed-clients-form.service';

describe('SubscribedClients Form Service', () => {
  let service: SubscribedClientsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscribedClientsFormService);
  });

  describe('Service methods', () => {
    describe('createSubscribedClientsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSubscribedClientsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            lastname: expect.any(Object),
            firstname: expect.any(Object),
            birthday: expect.any(Object),
            email: expect.any(Object),
            passworld: expect.any(Object),
            address: expect.any(Object),
            banckCard: expect.any(Object),
            phone: expect.any(Object),
            points: expect.any(Object),
            basket: expect.any(Object),
            favorises: expect.any(Object),
          }),
        );
      });

      it('passing ISubscribedClients should create a new form with FormGroup', () => {
        const formGroup = service.createSubscribedClientsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            lastname: expect.any(Object),
            firstname: expect.any(Object),
            birthday: expect.any(Object),
            email: expect.any(Object),
            passworld: expect.any(Object),
            address: expect.any(Object),
            banckCard: expect.any(Object),
            phone: expect.any(Object),
            points: expect.any(Object),
            basket: expect.any(Object),
            favorises: expect.any(Object),
          }),
        );
      });
    });

    describe('getSubscribedClients', () => {
      it('should return NewSubscribedClients for default SubscribedClients initial value', () => {
        const formGroup = service.createSubscribedClientsFormGroup(sampleWithNewData);

        const subscribedClients = service.getSubscribedClients(formGroup) as any;

        expect(subscribedClients).toMatchObject(sampleWithNewData);
      });

      it('should return NewSubscribedClients for empty SubscribedClients initial value', () => {
        const formGroup = service.createSubscribedClientsFormGroup();

        const subscribedClients = service.getSubscribedClients(formGroup) as any;

        expect(subscribedClients).toMatchObject({});
      });

      it('should return ISubscribedClients', () => {
        const formGroup = service.createSubscribedClientsFormGroup(sampleWithRequiredData);

        const subscribedClients = service.getSubscribedClients(formGroup) as any;

        expect(subscribedClients).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISubscribedClients should not enable id FormControl', () => {
        const formGroup = service.createSubscribedClientsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSubscribedClients should disable id FormControl', () => {
        const formGroup = service.createSubscribedClientsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
