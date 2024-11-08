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
  typesOfGames = ['Jeu 1', 'Jeu 2', 'Jeu 3', 'Jeu 4', 'Jeu 5', 'Jeu 6', 'Jeu 7', 'Jeu 8', 'Jeu 9', 'Jeu 10', 'Jeu 11', 'Jeu 12'];
  typesOfAnime = [
    'Anime 1',
    'Anime 2',
    'Anime 3',
    'Anime 4',
    'Anime 5',
    'Anime 6',
    'Anime 7',
    'Anime 8',
    'Anime 9',
    'Anime 10',
    'Anime 11',
    'Anime 12',
  ];

  selectedItemsClothes: string[] = [];
  selectedItemsThemes: string[] = []; // Partagé entre typesOfGames et typesOfAnime

  toggleSelection(selectedItems: string[], type: string): void {
    const index = selectedItems.indexOf(type);
    if (index === -1) {
      selectedItems.push(type);
    } else {
      selectedItems.splice(index, 1);
    }
  }

  removeItem(selectedItems: string[], item: string): void {
    const index = selectedItems.indexOf(item);
    if (index !== -1) {
      selectedItems.splice(index, 1);
    }
  }
}
