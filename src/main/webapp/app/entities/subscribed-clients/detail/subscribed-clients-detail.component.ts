import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ISubscribedClients } from '../subscribed-clients.model';

@Component({
  standalone: true,
  selector: 'jhi-subscribed-clients-detail',
  templateUrl: './subscribed-clients-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class SubscribedClientsDetailComponent {
  subscribedClients = input<ISubscribedClients | null>(null);

  previousState(): void {
    window.history.back();
  }
}
