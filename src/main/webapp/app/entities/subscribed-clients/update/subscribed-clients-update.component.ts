import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IOrder } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';
import { IClothe } from 'app/entities/clothe/clothe.model';
import { ClotheService } from 'app/entities/clothe/service/clothe.service';
import { SubscribedClientsService } from '../service/subscribed-clients.service';
import { ISubscribedClients } from '../subscribed-clients.model';
import { SubscribedClientsFormGroup, SubscribedClientsFormService } from './subscribed-clients-form.service';

@Component({
  standalone: true,
  selector: 'jhi-subscribed-clients-update',
  templateUrl: './subscribed-clients-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class SubscribedClientsUpdateComponent implements OnInit {
  isSaving = false;
  subscribedClients: ISubscribedClients | null = null;

  basketsCollection: IOrder[] = [];
  clothesSharedCollection: IClothe[] = [];

  protected subscribedClientsService = inject(SubscribedClientsService);
  protected subscribedClientsFormService = inject(SubscribedClientsFormService);
  protected orderService = inject(OrderService);
  protected clotheService = inject(ClotheService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: SubscribedClientsFormGroup = this.subscribedClientsFormService.createSubscribedClientsFormGroup();

  compareOrder = (o1: IOrder | null, o2: IOrder | null): boolean => this.orderService.compareOrder(o1, o2);

  compareClothe = (o1: IClothe | null, o2: IClothe | null): boolean => this.clotheService.compareClothe(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ subscribedClients }) => {
      this.subscribedClients = subscribedClients;
      if (subscribedClients) {
        this.updateForm(subscribedClients);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const subscribedClients = this.subscribedClientsFormService.getSubscribedClients(this.editForm);
    if (subscribedClients.id !== null) {
      this.subscribeToSaveResponse(this.subscribedClientsService.update(subscribedClients));
    } else {
      this.subscribeToSaveResponse(this.subscribedClientsService.create(subscribedClients));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISubscribedClients>>): void {
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

  protected updateForm(subscribedClients: ISubscribedClients): void {
    this.subscribedClients = subscribedClients;
    this.subscribedClientsFormService.resetForm(this.editForm, subscribedClients);

    this.basketsCollection = this.orderService.addOrderToCollectionIfMissing<IOrder>(this.basketsCollection, subscribedClients.basket);
    this.clothesSharedCollection = this.clotheService.addClotheToCollectionIfMissing<IClothe>(
      this.clothesSharedCollection,
      ...(subscribedClients.favorises ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.orderService
      .query({ filter: 'subscribedclients-is-null' })
      .pipe(map((res: HttpResponse<IOrder[]>) => res.body ?? []))
      .pipe(map((orders: IOrder[]) => this.orderService.addOrderToCollectionIfMissing<IOrder>(orders, this.subscribedClients?.basket)))
      .subscribe((orders: IOrder[]) => (this.basketsCollection = orders));

    this.clotheService
      .query()
      .pipe(map((res: HttpResponse<IClothe[]>) => res.body ?? []))
      .pipe(
        map((clothes: IClothe[]) =>
          this.clotheService.addClotheToCollectionIfMissing<IClothe>(clothes, ...(this.subscribedClients?.favorises ?? [])),
        ),
      )
      .subscribe((clothes: IClothe[]) => (this.clothesSharedCollection = clothes));
  }
}
