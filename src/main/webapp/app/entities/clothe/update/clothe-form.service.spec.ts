import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../clothe.test-samples';

import { ClotheFormService } from './clothe-form.service';

describe('Clothe Form Service', () => {
  let service: ClotheFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClotheFormService);
  });

  describe('Service methods', () => {
    describe('createClotheFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createClotheFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
            theme: expect.any(Object),
            gender: expect.any(Object),
            price: expect.any(Object),
            description: expect.any(Object),
            subscribedClients: expect.any(Object),
          }),
        );
      });

      it('passing IClothe should create a new form with FormGroup', () => {
        const formGroup = service.createClotheFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
            theme: expect.any(Object),
            gender: expect.any(Object),
            price: expect.any(Object),
            description: expect.any(Object),
            subscribedClients: expect.any(Object),
          }),
        );
      });
    });

    describe('getClothe', () => {
      it('should return NewClothe for default Clothe initial value', () => {
        const formGroup = service.createClotheFormGroup(sampleWithNewData);

        const clothe = service.getClothe(formGroup) as any;

        expect(clothe).toMatchObject(sampleWithNewData);
      });

      it('should return NewClothe for empty Clothe initial value', () => {
        const formGroup = service.createClotheFormGroup();

        const clothe = service.getClothe(formGroup) as any;

        expect(clothe).toMatchObject({});
      });

      it('should return IClothe', () => {
        const formGroup = service.createClotheFormGroup(sampleWithRequiredData);

        const clothe = service.getClothe(formGroup) as any;

        expect(clothe).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IClothe should not enable id FormControl', () => {
        const formGroup = service.createClotheFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewClothe should disable id FormControl', () => {
        const formGroup = service.createClotheFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
