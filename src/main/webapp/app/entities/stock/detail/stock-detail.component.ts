import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IStock } from '../stock.model';

@Component({
  standalone: true,
  selector: 'jhi-stock-detail',
  templateUrl: './stock-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class StockDetailComponent {
  stock = input<IStock | null>(null);

  previousState(): void {
    window.history.back();
  }
}
