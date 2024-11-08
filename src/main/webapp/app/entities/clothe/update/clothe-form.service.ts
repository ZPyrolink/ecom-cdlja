import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IClothe, NewClothe } from '../clothe.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IClothe for edit and NewClotheFormGroupInput for create.
 */
type ClotheFormGroupInput = IClothe | PartialWithRequiredKeyOf<NewClothe>;

type ClotheFormDefaults = Pick<NewClothe, 'id' | 'subscribedClients'>;

type ClotheFormGroupContent = {
  id: FormControl<IClothe['id'] | NewClothe['id']>;
  type: FormControl<IClothe['type']>;
  theme: FormControl<IClothe['theme']>;
  gender: FormControl<IClothe['gender']>;
  price: FormControl<IClothe['price']>;
  description: FormControl<IClothe['description']>;
  subscribedClients: FormControl<IClothe['subscribedClients']>;
};

export type ClotheFormGroup = FormGroup<ClotheFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ClotheFormService {
  createClotheFormGroup(clothe: ClotheFormGroupInput = { id: null }): ClotheFormGroup {
    const clotheRawValue = {
      ...this.getFormDefaults(),
      ...clothe,
    };
    return new FormGroup<ClotheFormGroupContent>({
      id: new FormControl(
        { value: clotheRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      type: new FormControl(clotheRawValue.type),
      theme: new FormControl(clotheRawValue.theme),
      gender: new FormControl(clotheRawValue.gender),
      price: new FormControl(clotheRawValue.price),
      description: new FormControl(clotheRawValue.description),
      subscribedClients: new FormControl(clotheRawValue.subscribedClients ?? []),
    });
  }

  getClothe(form: ClotheFormGroup): IClothe | NewClothe {
    return form.getRawValue() as IClothe | NewClothe;
  }

  resetForm(form: ClotheFormGroup, clothe: ClotheFormGroupInput): void {
    const clotheRawValue = { ...this.getFormDefaults(), ...clothe };
    form.reset(
      {
        ...clotheRawValue,
        id: { value: clotheRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ClotheFormDefaults {
    return {
      id: null,
      subscribedClients: [],
    };
  }
}
