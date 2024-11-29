import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IClothe } from 'app/entities/clothe/clothe.model';
import { ClotheService } from 'app/entities/clothe/service/clothe.service';
import { Color } from 'app/entities/enumerations/color.model';
import { Size } from 'app/entities/enumerations/size.model';
import { StockService } from '../service/stock.service';
import { IStock } from '../stock.model';
import { StockFormGroup, StockFormService } from './stock-form.service';

@Component({
  standalone: true,
  selector: 'jhi-stock-update',
  templateUrl: './stock-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class StockUpdateComponent implements OnInit {
  isSaving = false;
  stock: IStock | null = null;
  colorValues = Object.keys(Color);
  sizeValues = Object.keys(Size);

  clothesSharedCollection: IClothe[] = [];

  protected stockService = inject(StockService);
  protected stockFormService = inject(StockFormService);
  protected clotheService = inject(ClotheService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: StockFormGroup = this.stockFormService.createStockFormGroup();

  compareClothe = (o1: IClothe | null, o2: IClothe | null): boolean => this.clotheService.compareClothe(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ stock }) => {
      this.stock = stock;
      if (stock) {
        this.updateForm(stock);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const stock = this.stockFormService.getStock(this.editForm);
    if (stock.id !== null) {
      this.subscribeToSaveResponse(this.stockService.update(stock));
    } else {
      this.subscribeToSaveResponse(this.stockService.create(stock));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStock>>): void {
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

  protected updateForm(stock: IStock): void {
    this.stock = stock;
    this.stockFormService.resetForm(this.editForm, stock);

    this.clothesSharedCollection = this.clotheService.addClotheToCollectionIfMissing<IClothe>(this.clothesSharedCollection, stock.clothe);
  }

  protected loadRelationshipsOptions(): void {
    this.clotheService
      .query()
      .pipe(map((res: HttpResponse<IClothe[]>) => res.body ?? []))
      .pipe(map((clothes: IClothe[]) => this.clotheService.addClotheToCollectionIfMissing<IClothe>(clothes, this.stock?.clothe)))
      .subscribe((clothes: IClothe[]) => (this.clothesSharedCollection = clothes));
  }
}
