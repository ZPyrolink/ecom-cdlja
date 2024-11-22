import { Component, OnInit } from '@angular/core';
import SharedModule from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { FiltersBarComponent } from '../filters-bar/filters-bar.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { IClothe } from '../../entities/clothe/clothe.model';
import { ClotheService } from '../../entities/clothe/service/clothe.service';

@Component({
  selector: 'jhi-listing-product',
  standalone: true,
  templateUrl: './listing-product.component.html',
  styleUrl: './listing-product.component.scss',
  imports: [SharedModule, RouterModule, FiltersBarComponent, PaginationComponent],
})
export default class ListingProductComponent implements OnInit {
  totalPages = 1;
  currentPage = 1;
  clothes: IClothe[] = []; // Tableau des stocks à afficher

  constructor(private service: ClotheService) {}

  ngOnInit(): void {
    this.loadPage(this.currentPage);
  }

  loadPage(page: number): void {
    this.service.query({ page }).subscribe(next => {
      this.clothes = next.body?.content ?? [];
      this.totalPages = next.body?.totalPages ?? 1;
      this.currentPage = next.body?.number ?? 1;
      // eslint-disable-next-line no-console
      console.log('Data for page', page, next);
    });
  }

  onPageChange(page: number): void {
    if (page !== this.currentPage) {
      this.loadPage(page);
    }
  }
}
