import { Component, Input } from '@angular/core';
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
  selectedSize: string[] = [];
  toggleSize(size: string): void {
    if (!this.multiSelect) {
      this.selectedSize = [size];
      return;
    }
    const index = this.selectedSize.indexOf(size);
    if (index === -1) {
      this.selectedSize.push(size);
    } else {
      this.selectedSize.splice(index, 1);
    }
  }

  isSelected(size: string): boolean {
    return this.selectedSize.includes(size);
  }
}
