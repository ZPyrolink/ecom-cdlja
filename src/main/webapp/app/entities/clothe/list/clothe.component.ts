import { Component, inject, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, Subscription, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { DEFAULT_SORT_DATA, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { IClothe } from '../clothe.model';
import { ClotheService } from '../service/clothe.service';
import { ClotheDeleteDialogComponent } from '../delete/clothe-delete-dialog.component';
import { HttpResponse } from '@angular/common/http';
import { PaginatedResponse } from '../../../core/request/paginated-response.model';

@Component({
  standalone: true,
  selector: 'jhi-clothe',
  templateUrl: './clothe.component.html',
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
  ],
})
export class ClotheComponent implements OnInit {
  subscription: Subscription | null = null;
  clothes?: IClothe[];
  isLoading = false;

  sortState = sortStateSignal({});

  public router = inject(Router);
  protected clotheService = inject(ClotheService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  trackId = (item: IClothe): number => this.clotheService.getClotheIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (!this.clothes || this.clothes.length === 0) {
            this.load();
          }
        }),
      )
      .subscribe();
  }

  delete(clothe: IClothe): void {
    const modalRef = this.modalService.open(ClotheDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.clothe = clothe;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  load(): void {
    this.queryBackend()?.subscribe({
      next: (res: HttpResponse<PaginatedResponse<IClothe>>) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(event);
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: HttpResponse<PaginatedResponse<IClothe>>): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body?.content);
    this.clothes = this.refineData(dataFromBody);
  }

  protected refineData(data: IClothe[]): IClothe[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: IClothe[] | undefined): IClothe[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<HttpResponse<PaginatedResponse<IClothe>>> | undefined {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.clotheService.query(queryObject)?.pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(sortState: SortState): void {
    const queryParamsObj = {
      sort: this.sortService.buildSortParam(sortState),
    };

    this.ngZone.run(() => {
      this.router.navigate(['./'], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      });
    });
  }
}
