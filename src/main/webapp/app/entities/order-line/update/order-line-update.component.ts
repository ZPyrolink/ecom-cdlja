import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IOrder } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';
import { IStock } from 'app/entities/stock/stock.model';
import { StockService } from 'app/entities/stock/service/stock.service';
import { OrderLineService } from '../service/order-line.service';
import { IOrderLine } from '../order-line.model';
import { OrderLineFormService } from './order-line-form.service';

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

  compareOrder = (o1: IOrder | null, o2: IOrder | null): boolean => this.orderService.compareOrder(o1, o2);

  compareStock = (o1: IStock | null, o2: IStock | null): boolean => this.stockService.compareStock(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orderLine }) => {
      this.orderLine = orderLine;
      if (orderLine) {
        this.updateForm(orderLine);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
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
    this.stocksSharedCollection = this.stockService.addStockToCollectionIfMissing<IStock>(this.stocksSharedCollection, orderLine.stockDTO);
  }
}
