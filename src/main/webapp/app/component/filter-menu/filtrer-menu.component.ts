import { Component } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { ClothesTypeEnum } from '../../enums/clothes-type-enum';
import SelectedItemsComponent from '../selected-items/selected-items.component';
import CheckboxListComponent from '../checkbox-list/checkbox-list.component';

@Component({
  selector: 'jhi-filter-menu',
  standalone: true,
  imports: [NgIf, NgForOf, SelectedItemsComponent, CheckboxListComponent],
  templateUrl: './filter-menu.component.html',
  styleUrl: './filter-menu.component.scss',
})
export default class FilterMenuComponent {
  typesOfClothes = Object.values(ClothesTypeEnum);
  selectedItems: string[] = [];

  toggleSelection(type: string): void {
    if (this.selectedItems.includes(type)) {
      this.selectedItems = this.selectedItems.filter(item => item !== type);
    } else {
      this.selectedItems.push(type);
    }
  }

  removeItem(item: string): void {
    this.selectedItems = this.selectedItems.filter(selected => selected !== item);
  }
}
