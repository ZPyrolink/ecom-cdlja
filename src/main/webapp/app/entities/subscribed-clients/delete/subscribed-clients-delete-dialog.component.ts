import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ISubscribedClients } from '../subscribed-clients.model';
import { SubscribedClientsService } from '../service/subscribed-clients.service';

@Component({
  standalone: true,
  templateUrl: './subscribed-clients-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class SubscribedClientsDeleteDialogComponent {
  subscribedClients?: ISubscribedClients;

  protected subscribedClientsService = inject(SubscribedClientsService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.subscribedClientsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
