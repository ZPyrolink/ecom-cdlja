import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'jhi-selected-items',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './selected-items.component.html',
  styleUrl: './selected-items.component.scss',
})
export default class SelectedItemsComponent {
  @Input() selectedItems: string[] = [];
  @Output() removeItem = new EventEmitter<string>();

  onRemoveItem(item: string): void {
    this.removeItem.emit(item);
  }
}
