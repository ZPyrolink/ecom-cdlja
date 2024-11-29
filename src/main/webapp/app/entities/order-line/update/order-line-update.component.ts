import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IOrder } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';
import { IStock } from 'app/entities/stock/stock.model';
import { StockService } from 'app/entities/stock/service/stock.service';
import { OrderLineService } from '../service/order-line.service';
import { IOrderLine } from '../order-line.model';
import { OrderLineFormGroup, OrderLineFormService } from './order-line-form.service';

@Component({
  standalone: true,
  selector: 'jhi-order-line-update',
  templateUrl: './order-line-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class OrderLineUpdateComponent implements OnInit {
  isSaving = false;
  orderLine: IOrderLine | null = null;

  ordersSharedCollection: IOrder[] = [];
  stocksSharedCollection: IStock[] = [];

  protected orderLineService = inject(OrderLineService);
  protected orderLineFormService = inject(OrderLineFormService);
  protected orderService = inject(OrderService);
  protected stockService = inject(StockService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: OrderLineFormGroup = this.orderLineFormService.createOrderLineFormGroup();

  compareOrder = (o1: IOrder | null, o2: IOrder | null): boolean => this.orderService.compareOrder(o1, o2);

  compareStock = (o1: IStock | null, o2: IStock | null): boolean => this.stockService.compareStock(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orderLine }) => {
      this.orderLine = orderLine;
      if (orderLine) {
        this.updateForm(orderLine);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const orderLine = this.orderLineFormService.getOrderLine(this.editForm);
    if (orderLine.id !== null) {
      this.subscribeToSaveResponse(this.orderLineService.update(orderLine));
    } else {
      this.subscribeToSaveResponse(this.orderLineService.create(orderLine));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrderLine>>): void {
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

  protected updateForm(orderLine: IOrderLine): void {
    this.orderLine = orderLine;
    this.orderLineFormService.resetForm(this.editForm, orderLine);

    this.ordersSharedCollection = this.orderService.addOrderToCollectionIfMissing<IOrder>(this.ordersSharedCollection, orderLine.order);
    this.stocksSharedCollection = this.stockService.addStockToCollectionIfMissing<IStock>(this.stocksSharedCollection, orderLine.stock);
  }

  protected loadRelationshipsOptions(): void {
    this.orderService
      .query()
      .pipe(map((res: HttpResponse<IOrder[]>) => res.body ?? []))
      .pipe(map((orders: IOrder[]) => this.orderService.addOrderToCollectionIfMissing<IOrder>(orders, this.orderLine?.order)))
      .subscribe((orders: IOrder[]) => (this.ordersSharedCollection = orders));

    this.stockService
      .query()
      .pipe(map((res: HttpResponse<IStock[]>) => res.body ?? []))
      .pipe(map((stocks: IStock[]) => this.stockService.addStockToCollectionIfMissing<IStock>(stocks, this.orderLine?.stock)))
      .subscribe((stocks: IStock[]) => (this.stocksSharedCollection = stocks));
  }
}
