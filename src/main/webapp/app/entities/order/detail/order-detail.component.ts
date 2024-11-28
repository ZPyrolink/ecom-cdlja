import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IOrder } from '../order.model';

@Component({
  standalone: true,
  selector: 'jhi-order-detail',
  templateUrl: './order-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class OrderDetailComponent {
  order = input<IOrder | null>(null);

  previousState(): void {
    window.history.back();
  }
}
