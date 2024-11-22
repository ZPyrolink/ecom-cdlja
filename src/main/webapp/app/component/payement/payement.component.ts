import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faApplePay, faCcApplePay } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'jhi-payement',
  standalone: true,
  imports: [DecimalPipe, FaIconComponent],
  templateUrl: './payement.component.html',
  styleUrl: './payement.component.scss',
})
export default class PayementComponent {
  price = 0;
  protected readonly faApplePay = faApplePay;
  protected readonly faCcApplePay = faCcApplePay;
}
