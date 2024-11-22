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
  endPage = 0;

  get middlePages(): number[] {
    const range = 2;
    const pages = [];

    const startPage = Math.max(2, this.currentPage - range);
    this.endPage = this.totalPages - 1;

    if (startPage < this.endPage) {
      for (let i = startPage; i < this.endPage; i++) {
        pages.push(i);
      }
    }
    // eslint-disable-next-line no-console
    console.log('oco', this.totalPages);
    return pages;
  }
  get showLeftDots(): boolean {
    return this.currentPage > 3;
  }

  get showRightDots(): boolean {
    return this.currentPage < this.endPage && this.endPage > 3;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChanged.emit(page);
    }
  }
}
