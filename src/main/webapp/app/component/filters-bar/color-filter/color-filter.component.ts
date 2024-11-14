import { Component } from '@angular/core';
import { NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { ColorEnum } from '../../../enums/color-enum';

@Component({
  selector: 'jhi-color-filter',
  standalone: true,
  imports: [NgForOf, NgIf],
  templateUrl: './color-filter.component.html',
  styleUrl: './color-filter.component.scss',
})
export class ColorFilterComponent {
  colors = Object.values(ColorEnum);
  selectedColors: string[] = [];

  toggleColor(color: string): void {
    const index = this.selectedColors.indexOf(color);
    if (index === -1) {
      this.selectedColors.push(color);
    } else {
      this.selectedColors.splice(index, 1);
    }
  }

  isSelected(color: string): boolean {
    return this.selectedColors.includes(color);
  }
}
