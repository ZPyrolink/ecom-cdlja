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
  @Input() totalPages = 1;
  @Input() currentPage = 1;
  @Output() pageChanged = new EventEmitter<number>();
  get middlePages(): number[] {
    const range = 2;
    const pages = [];

    // Calculer la plage des pages à afficher
    const startPage = Math.max(2, this.currentPage - range);
    const endPage = this.totalPages - 1;

    // Si la plage commence avant la première page, ajuster la plage
    if (startPage < endPage) {
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  }
  get showLeftDots(): boolean {
    return this.currentPage > 3;
  }

  get showRightDots(): boolean {
    return this.currentPage < this.totalPages - 2;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChanged.emit(page);
    }
  }
}
