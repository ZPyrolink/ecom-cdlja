import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'jhi-pagination',
  standalone: true,
  imports: [NgIf, NgForOf],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  @Input() totalPages = 1; // Total des pages (ex: 10)
  @Input() currentPage = 0; // Page actuelle (0-indexé)
  @Output() pageChanged = new EventEmitter<number>(); // Événement pour notifier le changement de page

  /**
   * Calcul des pages intermédiaires.
   */
  get middlePages(): number[] {
    const range = 1; // Nombre de pages avant et après la page actuelle
    const startPage = Math.max(2, this.currentPage + 1 - range); // Limite basse (exclut "1")
    const endPage = Math.min(this.totalPages - 1, this.currentPage + 1 + range); // Limite haute (exclut "totalPages")

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  /**
   * Affiche les points de suspension à gauche.
   */
  get showLeftDots(): boolean {
    return this.currentPage > 2; // Afficher "..." si la page actuelle est au-delà de la 3e (1-indexé)
  }

  /**
   * Affiche les points de suspension à droite.
   */
  get showRightDots(): boolean {
    return this.currentPage < this.totalPages - 3; // Afficher "..." si on est avant l'avant-dernière page
  }

  /**
   * Changer la page et émettre un événement.
   * @param page - Numéro de la page (1-indexé)
   */
  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages && page !== this.currentPage + 1) {
      this.pageChanged.emit(page - 1); // Convertir vers 0-indexé
    }
  }
}
