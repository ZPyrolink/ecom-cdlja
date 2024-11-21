import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgForOf } from '@angular/common';

@Component({
  selector: 'jhi-size-item',
  standalone: true,
  imports: [NgForOf, NgClass],
  templateUrl: './size-item.component.html',
  styleUrl: './size-item.component.scss',
})
export class SizeItemComponent {
  @Input() sizes: string[] = [];
  @Input() multiSelect = true;
  @Output() selectedSize = new EventEmitter<string[]>();

  private selectedSizes: string[] = [];

  toggleSize(size: string): void {
    if (!this.multiSelect) {
      this.selectedSizes = [size];
    } else {
      const index = this.selectedSizes.indexOf(size);
      if (index === -1) {
        this.selectedSizes.push(size);
      } else {
        this.selectedSizes.splice(index, 1);
      }
    }
    this.selectedSize.emit(this.selectedSizes);
  }

  isSelected(size: string): boolean {
    return this.selectedSizes.includes(size);
  }
}
