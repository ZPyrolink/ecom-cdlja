import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCcApplePay } from '@fortawesome/free-brands-svg-icons';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'jhi-payement',
  standalone: true,
  imports: [DecimalPipe, FaIconComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './payement.component.html',
  styleUrl: './payement.component.scss',
})
export default class PayementComponent {
  static MAX_CARD_NB_SIZE = 16;
  static CARD_NB_GROUP_SIZE = 4;

  price = 0;

  private cardNumControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(PayementComponent.MAX_CARD_NB_SIZE)],
  });
  // eslint-disable-next-line @typescript-eslint/member-ordering
  payementForm = new FormGroup({
    type: new FormControl('residence', { validators: [Validators.required] }),
    firstName: new FormControl('', { validators: [Validators.required] }),
    lastName: new FormControl('', { validators: [Validators.required] }),
    cardNum: this.cardNumControl,
  });

  // eslint-disable-next-line @typescript-eslint/member-ordering
  protected readonly faCcApplePay = faCcApplePay;

  constructor() {
    this.cardNumControl.valueChanges.subscribe((val: string) => {
      val = this.formatCardNum(val);
      this.cardNumControl.setValue(val, { emitEvent: false });
    });
  }

  pay(): void {
    window.console.log('payed');
  }

  formatCardNum(cardNumber: string): string {
    const tmp = cardNumber.replace(/[^0-9]+/g, '');

    if (tmp.length > PayementComponent.MAX_CARD_NB_SIZE) {
      return this.formatCardNum(tmp.substring(0, PayementComponent.MAX_CARD_NB_SIZE));
    }

    const regexp = `(.{1,${PayementComponent.CARD_NB_GROUP_SIZE}})`;
    const matches = tmp.match(new RegExp(regexp, 'g')) ?? [tmp];
    return matches.join(' ');
  }
}
