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
  currentPage = 1; // Page courante
  clothes: IClothe[] = []; // Tableau des stocks à afficher

  constructor(private service: ClotheService) {}

  ngOnInit(): void {
    this.service.query().subscribe(next => {
      this.clothes = next.body ?? [];
      // eslint-disable-next-line no-console
      console.log('lalal', this.clothes);
    });
  }
}
