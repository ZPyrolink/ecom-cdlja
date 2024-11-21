import { Component, OnInit } from '@angular/core';
import SharedModule from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { FiltersBarComponent } from '../filters-bar/filters-bar.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { StockService } from '../../entities/stock/service/stock.service';
import { IStock } from '../../entities/stock/stock.model';

@Component({
  selector: 'jhi-listing-product',
  standalone: true,
  templateUrl: './listing-product.component.html',
  styleUrl: './listing-product.component.scss',
  imports: [SharedModule, RouterModule, FiltersBarComponent, PaginationComponent],
})
export default class ListingProductComponent implements OnInit {
  totalPages = 5;
  currentPage = 1;
  stocks: IStock[] = [];
  constructor(private service: StockService) {}

  ngOnInit(): void {
    this.service.query().subscribe(next => (this.stocks = next.body ?? []));
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }
}
