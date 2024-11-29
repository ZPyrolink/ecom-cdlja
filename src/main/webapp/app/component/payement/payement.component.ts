import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { faCcApplePay } from '@fortawesome/free-brands-svg-icons';
import RegexpUtils from '../../utils/regexpUtils';
import ValidatorsExt from '../../utils/validatorsExt';

function onValueChanged(control: FormControl, callback: (value: string) => string): void {
  control.valueChanges.subscribe((val: string) => {
    control.setValue(callback(val), { emitEvent: false });
  });
}

@Component({
  selector: 'jhi-payement',
  standalone: true,
  imports: [DecimalPipe, FaIconComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './payement.component.html',
  styleUrl: './payement.component.scss',
})
export default class PayementComponent {
  price = 0;

  test = '';

  get buttonTitle(): string {
    return this.isValid ? '' : 'Certains champs sont invalides';
  }

  get isValid(): boolean {
    return this.payementForm.valid;
  }

  protected readonly faCcApplePay = faCcApplePay;

  protected cardNumControl = new FormControl('', {
    nonNullable: true,
    validators: ValidatorsExt.validators(true, RegexpUtils.CARD_NUM),
  });

  protected expirationDateControl = new FormControl('', {
    nonNullable: true,
    validators: ValidatorsExt.validators(true, RegexpUtils.EXPIRATION_DATE, ValidatorsExt.expirationDateValidator),
  });

  protected cryptoControl = new FormControl('', {
    nonNullable: true,
    validators: ValidatorsExt.validators(true, RegexpUtils.CRYPTO),
  });

  protected phoneNumControl = new FormControl('', {
    nonNullable: true,
    validators: ValidatorsExt.validators(true, RegexpUtils.PHONE_NUM),
  });

  protected payementForm = new FormGroup({
    type: new FormControl('residence', { validators: ValidatorsExt.validators() }),
    firstName: new FormControl('', { validators: ValidatorsExt.validators() }),
    lastName: new FormControl('', { validators: ValidatorsExt.validators() }),
    email: new FormControl('', { validators: ValidatorsExt.validators(true, undefined, Validators.email) }),
    country: new FormControl('', { validators: ValidatorsExt.validators() }),
    expirationDate: this.expirationDateControl,
    city: new FormControl('', { validators: ValidatorsExt.validators() }),
    address: new FormControl('', { validators: ValidatorsExt.validators() }),
    phoneNumber: this.phoneNumControl,

    cardName: new FormControl('', { validators: ValidatorsExt.validators(true, RegexpUtils.CARD_NAME) }),
    cardNum: this.cardNumControl,
    crypto: this.cryptoControl,
    postalCode: new FormControl('', { validators: ValidatorsExt.validators(true, RegexpUtils.POSTAL_CODE) }),
  });

  constructor() {
    onValueChanged(this.cardNumControl, this.groupNumbers(4));
    onValueChanged(this.expirationDateControl, this.keepNumbers);
    onValueChanged(this.cryptoControl, this.keepNumbers);
    onValueChanged(this.phoneNumControl, this.groupNumbers(2));
  }

  pay(): void {
    window.console.log('payed');
  }

  private groupNumbers(groupSize: number, separator = ' '): (v: string) => string {
    return (value: string): string => {
      const tmp = this.keepNumbers(value);
      const regexp = `(.{1,${groupSize}})`;
      const matches = tmp.match(new RegExp(regexp, 'g')) ?? [value];
      return matches.join(separator);
    };
  }

  private keepNumbers(value: string): string {
    return value.replace(/[^0-9/]/g, '');
  }
}
