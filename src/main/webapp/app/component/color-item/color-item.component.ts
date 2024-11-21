import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() multiSelect = true;
  @Output() selectedColor = new EventEmitter<string[]>();

  private selectedColors: string[] = [];

  toggleColor(color: string): void {
    if (!this.multiSelect) {
      this.selectedColors = [color];
    } else {
      const index = this.selectedColors.indexOf(color);
      if (index === -1) {
        this.selectedColors.push(color);
      } else {
        this.selectedColors.splice(index, 1);
      }
    }
    this.selectedColor.emit(this.selectedColors);
  }

  isSelected(color: string): boolean {
    return this.selectedColors.includes(color);
  }
}
