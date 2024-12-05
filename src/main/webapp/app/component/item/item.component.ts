import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'jhi-item',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
})
export class ItemComponent {
  @Input() items: string[] = [];
  @Input() multiSelect = true;
  @Output() selectionChange = new EventEmitter<string[]>();
  @Input() selectedItem: string[] = [];
  toggleSize(size: string): void {
    if (!this.multiSelect) {
      this.selectedItem = [size];
      return;
    }
    const index = this.selectedItem.indexOf(size);
    if (index === -1) {
      this.selectedItem.push(size);
    } else {
      this.selectedItem.splice(index, 1);
    }
    this.selectionChange.emit(this.selectedItem);
  }

  isSelected(size: string): boolean {
    return this.selectedItem.includes(size);
  }
}
