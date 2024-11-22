import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'jhi-checkbox-list',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './checkbox-list.component.html',
  styleUrl: './checkbox-list.component.scss',
})
export default class CheckboxListComponent {
  @Input() items: string[] = [];
  @Input() selectedItems: string[] = [];
  @Output() toggleSelection = new EventEmitter<string>();

  onToggleSelection(type: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.toggleSelection.emit(type);
    checkbox.checked = this.selectedItems.includes(type);
  }
}
