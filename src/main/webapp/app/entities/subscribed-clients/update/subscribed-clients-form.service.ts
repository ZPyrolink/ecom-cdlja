import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ISubscribedClients, NewSubscribedClients } from '../subscribed-clients.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISubscribedClients for edit and NewSubscribedClientsFormGroupInput for create.
 */
type SubscribedClientsFormGroupInput = ISubscribedClients | PartialWithRequiredKeyOf<NewSubscribedClients>;

type SubscribedClientsFormDefaults = Pick<NewSubscribedClients, 'id' | 'favorises'>;

type SubscribedClientsFormGroupContent = {
  id: FormControl<ISubscribedClients['id'] | NewSubscribedClients['id']>;
  email: FormControl<ISubscribedClients['email']>;
  address: FormControl<ISubscribedClients['address']>;
  phoneNumber: FormControl<ISubscribedClients['phoneNumber']>;
  basket: FormControl<ISubscribedClients['basket']>;
  favorises: FormControl<ISubscribedClients['favorises']>;
};

export type SubscribedClientsFormGroup = FormGroup<SubscribedClientsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SubscribedClientsFormService {
  createSubscribedClientsFormGroup(subscribedClients: SubscribedClientsFormGroupInput = { id: null }): SubscribedClientsFormGroup {
    const subscribedClientsRawValue = {
      ...this.getFormDefaults(),
      ...subscribedClients,
    };
    return new FormGroup<SubscribedClientsFormGroupContent>({
      id: new FormControl(
        { value: subscribedClientsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      email: new FormControl(subscribedClientsRawValue.email),
      address: new FormControl(subscribedClientsRawValue.address),
      phoneNumber: new FormControl(subscribedClientsRawValue.phoneNumber),
      basket: new FormControl(subscribedClientsRawValue.basket),
      favorises: new FormControl(subscribedClientsRawValue.favorises ?? []),
    });
  }

  getSubscribedClients(form: SubscribedClientsFormGroup): ISubscribedClients | NewSubscribedClients {
    return form.getRawValue() as ISubscribedClients | NewSubscribedClients;
  }

  resetForm(form: SubscribedClientsFormGroup, subscribedClients: SubscribedClientsFormGroupInput): void {
    const subscribedClientsRawValue = { ...this.getFormDefaults(), ...subscribedClients };
    form.reset(
      {
        ...subscribedClientsRawValue,
        id: { value: subscribedClientsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): SubscribedClientsFormDefaults {
    return {
      id: null,
      favorises: [],
    };
  }
}
