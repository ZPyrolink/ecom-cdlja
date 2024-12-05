import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IClothe } from '../clothe.model';
import { ClotheService } from '../service/clothe.service';

@Component({
  standalone: true,
  templateUrl: './clothe-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ClotheDeleteDialogComponent {
  clothe?: IClothe;

  protected clotheService = inject(ClotheService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.clotheService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
