import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ILine } from '../line.model';
import { LineService } from '../service/line.service';

@Component({
  standalone: true,
  templateUrl: './line-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class LineDeleteDialogComponent {
  line?: ILine;

  protected lineService = inject(LineService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.lineService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
