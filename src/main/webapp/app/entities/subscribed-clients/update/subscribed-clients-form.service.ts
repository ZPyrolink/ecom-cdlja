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
  lastname: FormControl<ISubscribedClients['lastname']>;
  firstname: FormControl<ISubscribedClients['firstname']>;
  birthday: FormControl<ISubscribedClients['birthday']>;
  email: FormControl<ISubscribedClients['email']>;
  passworld: FormControl<ISubscribedClients['passworld']>;
  address: FormControl<ISubscribedClients['address']>;
  bankCard: FormControl<ISubscribedClients['bankCard']>;
  phone: FormControl<ISubscribedClients['phone']>;
  points: FormControl<ISubscribedClients['points']>;
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
      lastname: new FormControl(subscribedClientsRawValue.lastname),
      firstname: new FormControl(subscribedClientsRawValue.firstname),
      birthday: new FormControl(subscribedClientsRawValue.birthday),
      email: new FormControl(subscribedClientsRawValue.email),
      passworld: new FormControl(subscribedClientsRawValue.passworld),
      address: new FormControl(subscribedClientsRawValue.address),
      bankCard: new FormControl(subscribedClientsRawValue.bankCard),
      phone: new FormControl(subscribedClientsRawValue.phone),
      points: new FormControl(subscribedClientsRawValue.points),
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
