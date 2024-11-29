import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { faCcApplePay } from '@fortawesome/free-brands-svg-icons';
import { RegexpUtils } from '../../utils/regexp';

function validators(required = true, pattern?: RegExp, ...others: ValidatorFn[]): ValidatorFn[] {
  const result: ValidatorFn[] = [];

  if (required) {
    result.push(Validators.required);
  }

  if (pattern) {
    result.push(Validators.pattern(pattern));
  }

  if (others.length > 0) {
    result.push(...others);
  }

  return result;
}

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

  protected readonly faCcApplePay = faCcApplePay;

  protected cardNumControl = new FormControl('', {
    nonNullable: true,
    validators: validators(true, RegexpUtils.CARD_NUM),
  });

  protected expirationDateControl = new FormControl('', {
    nonNullable: true,
    validators: validators(true, RegexpUtils.EXPIRATION_DATE, expirationDateValidator),
  });

  protected cryptoControl = new FormControl('', {
    nonNullable: true,
    validators: validators(true, RegexpUtils.CRYPTO),
  });

  protected phoneNumControl = new FormControl('', {
    nonNullable: true,
    validators: validators(true, RegexpUtils.PHONE_NUM),
  });

  protected payementForm = new FormGroup({
    type: new FormControl('residence', { validators: validators() }),
    firstName: new FormControl('', { validators: validators() }),
    lastName: new FormControl('', { validators: validators() }),
    email: new FormControl('', { validators: validators(true, undefined, Validators.email) }),
    country: new FormControl('', { validators: validators() }),
    expirationDate: this.expirationDateControl,
    city: new FormControl('', { validators: validators() }),
    address: new FormControl('', { validators: validators() }),
    phoneNumber: this.phoneNumControl,

    cardName: new FormControl('', { validators: validators(true, RegexpUtils.CARD_NAME) }),
    cardNum: this.cardNumControl,
    crypto: this.cryptoControl,
    postalCode: new FormControl('', { validators: validators(true, RegexpUtils.POSTAL_CODE) }),
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

function expirationDateValidator(control: AbstractControl<string>): ValidationErrors | null {
  const [month, year] = control.value.split('/').map(v => +v);

  const error = { expiredCard: true };

  const today = new Date();
  const currentYear = today.getFullYear() - 2000;

  if (year < currentYear) {
    return error;
  }

  if (year === currentYear && month - 1 < today.getMonth()) {
    return error;
  }

  return null;
}
