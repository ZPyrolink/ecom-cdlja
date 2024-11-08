import { Component } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { ClothesTypeEnum } from '../../enums/clothes-type-enum';

@Component({
  selector: 'jhi-filter-menu',
  standalone: true,
  imports: [NgIf, NgForOf],
  templateUrl: './filter-menu.component.html',
  styleUrl: './filter-menu.component.scss',
})
export default class FilterMenuComponent {
  typesOfClothes = Object.values(ClothesTypeEnum);
  selectedItems: string[] = [];

  toggleSelection(type: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedItems.push(type);
    } else {
      this.selectedItems = this.selectedItems.filter(item => item !== type);
    }
  }

  removeItem(item: string): void {
    this.selectedItems = this.selectedItems.filter(selected => selected !== item);
  }
}
