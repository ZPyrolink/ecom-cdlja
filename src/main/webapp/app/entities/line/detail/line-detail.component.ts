import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ILine } from '../line.model';

@Component({
  standalone: true,
  selector: 'jhi-line-detail',
  templateUrl: './line-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class LineDetailComponent {
  line = input<ILine | null>(null);

  previousState(): void {
    window.history.back();
  }
}
