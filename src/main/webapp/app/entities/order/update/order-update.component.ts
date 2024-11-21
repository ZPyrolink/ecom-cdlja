import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ISubscribedClients } from 'app/entities/subscribed-clients/subscribed-clients.model';
import { SubscribedClientsService } from 'app/entities/subscribed-clients/service/subscribed-clients.service';
import { Status } from 'app/entities/enumerations/status.model';
import { MeansOfPayment } from 'app/entities/enumerations/means-of-payment.model';
import { OrderService } from '../service/order.service';
import { IOrder } from '../order.model';
import { OrderFormGroup, OrderFormService } from './order-form.service';

@Component({
  standalone: true,
  selector: 'jhi-order-update',
  templateUrl: './order-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class OrderUpdateComponent implements OnInit {
  isSaving = false;
  order: IOrder | null = null;
  statusValues = Object.keys(Status);
  meansOfPaymentValues = Object.keys(MeansOfPayment);

  subscribedClientsSharedCollection: ISubscribedClients[] = [];

  protected orderService = inject(OrderService);
  protected orderFormService = inject(OrderFormService);
  protected subscribedClientsService = inject(SubscribedClientsService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: OrderFormGroup = this.orderFormService.createOrderFormGroup();

  compareSubscribedClients = (o1: ISubscribedClients | null, o2: ISubscribedClients | null): boolean =>
    this.subscribedClientsService.compareSubscribedClients(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ order }) => {
      this.order = order;
      if (order) {
        this.updateForm(order);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const order = this.orderFormService.getOrder(this.editForm);
    if (order.id !== null) {
      this.subscribeToSaveResponse(this.orderService.update(order));
    } else {
      this.subscribeToSaveResponse(this.orderService.create(order));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrder>>): void {
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

  protected updateForm(order: IOrder): void {
    this.order = order;
    this.orderFormService.resetForm(this.editForm, order);

    this.subscribedClientsSharedCollection = this.subscribedClientsService.addSubscribedClientsToCollectionIfMissing<ISubscribedClients>(
      this.subscribedClientsSharedCollection,
      order.client,
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
            this.order?.client,
          ),
        ),
      )
      .subscribe((subscribedClients: ISubscribedClients[]) => (this.subscribedClientsSharedCollection = subscribedClients));
  }
}
