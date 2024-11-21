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
  totalPages = 1; // Nombre total de pages
  currentPage = 1; // Page courante
  stocks: IStock[] = []; // Tableau des stocks à afficher

  constructor(private service: StockService) {}

  ngOnInit(): void {
    this.loadPage(this.currentPage); // Charger la première page
  }

  // Charger les produits pour une page spécifique
  loadPage(page: number): void {
    const req = {
      page: page - 1, // Les API paginent souvent à partir de 0
      size: 10, // La taille de la page, tu peux l'ajuster
    };

    this.service.query(req).subscribe(response => {
      this.stocks = response.body ?? [];
      if (response.body) {
        this.totalPages = response.body.length > 0 ? Math.ceil(response.body.length / 10) : 1;
      }
    });
  }

  // Gérer le changement de page
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadPage(page); // Recharger la page
    }
  }
}
