import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ISubscribedClients } from 'app/entities/subscribed-clients/subscribed-clients.model';
import { SubscribedClientsService } from 'app/entities/subscribed-clients/service/subscribed-clients.service';
import { Type } from 'app/entities/enumerations/type.model';
import { Gender } from 'app/entities/enumerations/gender.model';
import { ClotheService } from '../service/clothe.service';
import { IClothe } from '../clothe.model';
import { ClotheFormGroup, ClotheFormService } from './clothe-form.service';

@Component({
  standalone: true,
  selector: 'jhi-clothe-update',
  templateUrl: './clothe-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ClotheUpdateComponent implements OnInit {
  isSaving = false;
  clothe: IClothe | null = null;
  typeValues = Object.keys(Type);
  genderValues = Object.keys(Gender);

  subscribedClientsSharedCollection: ISubscribedClients[] = [];

  protected clotheService = inject(ClotheService);
  protected clotheFormService = inject(ClotheFormService);
  protected subscribedClientsService = inject(SubscribedClientsService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ClotheFormGroup = this.clotheFormService.createClotheFormGroup();

  compareSubscribedClients = (o1: ISubscribedClients | null, o2: ISubscribedClients | null): boolean =>
    this.subscribedClientsService.compareSubscribedClients(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ clothe }) => {
      this.clothe = clothe;
      if (clothe) {
        this.updateForm(clothe);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const clothe = this.clotheFormService.getClothe(this.editForm);
    if (clothe.id !== null) {
      this.subscribeToSaveResponse(this.clotheService.update(clothe));
    } else {
      this.subscribeToSaveResponse(this.clotheService.create(clothe));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClothe>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(clothe: IClothe): void {
    this.clothe = clothe;
    this.clotheFormService.resetForm(this.editForm, clothe);

    this.subscribedClientsSharedCollection = this.subscribedClientsService.addSubscribedClientsToCollectionIfMissing<ISubscribedClients>(
      this.subscribedClientsSharedCollection,
      ...(clothe.subscribedClients ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.subscribedClientsService
      .query()
      .pipe(map((res: HttpResponse<ISubscribedClients[]>) => res.body ?? []))
      .pipe(
        map((subscribedClients: ISubscribedClients[]) =>
          this.subscribedClientsService.addSubscribedClientsToCollectionIfMissing<ISubscribedClients>(
            subscribedClients,
            ...(this.clothe?.subscribedClients ?? []),
          ),
        ),
      )
      .subscribe((subscribedClients: ISubscribedClients[]) => (this.subscribedClientsSharedCollection = subscribedClients));
  }
}
