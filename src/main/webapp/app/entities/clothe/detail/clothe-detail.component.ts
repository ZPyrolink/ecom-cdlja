import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IClothe } from '../clothe.model';

@Component({
  standalone: true,
  selector: 'jhi-clothe-detail',
  templateUrl: './clothe-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ClotheDetailComponent {
  clothe = input<IClothe | null>(null);

  previousState(): void {
    window.history.back();
  }
}
