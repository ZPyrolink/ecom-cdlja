import { Component, OnDestroy, OnInit } from '@angular/core';
import SharedModule from '../../shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { FiltersBarComponent } from '../filters-bar/filters-bar.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { IClothe } from '../../entities/clothe/clothe.model';
import { ClotheService } from '../../entities/clothe/service/clothe.service';
import { FilterDataService } from '../filter-menu/service/FilterDataService';
import { Subscription } from 'rxjs';
import { OrderService } from '../../entities/order/service/order.service';
import getClotheTypeLabel from '../../entities/enumerations/type.model';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'jhi-listing-product',
  standalone: true,
  templateUrl: './listing-product.component.html',
  styleUrl: './listing-product.component.scss',
  imports: [SharedModule, RouterModule, FiltersBarComponent, PaginationComponent, NgOptimizedImage],
})
export default class ListingProductComponent implements OnInit, OnDestroy {
  totalPages = 0;
  currentPage = 0;
  clothes: IClothe[] = [];
  selectedItemsClothes: string[] = [];
  selectedItemsThemes: string[] = [];
  protected readonly getClotheTypeLabel = getClotheTypeLabel;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private service: ClotheService,
    private router: Router,
    private serviceFilter: FilterDataService,
    private serviceOrder: OrderService,
  ) {}

  ngOnInit(): void {
    this.loadPage(this.currentPage);
    this.serviceFilter.getThemes().subscribe(themes => {
      this.selectedItemsThemes = themes;
      this.loadPage(this.currentPage);
    });
    this.serviceFilter.getClothes().subscribe(clothes => {
      this.selectedItemsClothes = clothes;
      this.loadPage(this.currentPage);
    });
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadPage(page: number): void {
    this.service.query({ page })?.subscribe(next => {
      this.clothes = next.body?.content ?? [];
      this.totalPages = next.body?.totalPages ?? 1;
      this.currentPage = next.body?.number ?? 0;
    });
  }

  onPageChange(page: number): void {
    if (page !== this.currentPage) {
      this.loadPage(page);
    }
  }
  goToProductDetails(id: number): void {
    this.router.navigate(['/product', id]);
  }
}
