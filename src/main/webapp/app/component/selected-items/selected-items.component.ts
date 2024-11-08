import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'jhi-selected-items',
  standalone: true,
  imports: [],
  templateUrl: './selected-items.component.html',
  styleUrl: './selected-items.component.scss',
})
export class SelectedItemsComponent {
  @Input() selectedItems: string[] = [];
  @Output() removeItem = new EventEmitter<string>();

  onRemoveItem(item: string): void {
    this.removeItem.emit(item);
  }
}
