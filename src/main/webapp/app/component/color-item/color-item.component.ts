import { Component, Input } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'jhi-color-item',
  standalone: true,
  imports: [NgForOf, NgIf],
  templateUrl: './color-item.component.html',
  styleUrl: './color-item.component.scss',
})
export class ColorItemComponent {
  @Input() colors: { name: string; image: string }[] = [];
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
