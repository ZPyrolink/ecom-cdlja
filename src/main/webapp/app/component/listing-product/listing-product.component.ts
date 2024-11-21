import { Component } from '@angular/core';
import SharedModule from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { FiltersBarComponent } from '../filters-bar/filters-bar.component';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'jhi-listing-product',
  standalone: true,
  templateUrl: './listing-product.component.html',
  styleUrl: './listing-product.component.scss',
  imports: [SharedModule, RouterModule, FiltersBarComponent, PaginationComponent],
})
export default class ListingProductComponent {
  totalPages = 5;
  currentPage = 1;
  onPageChange(page: number): void {
    this.currentPage = page;
  }
}
