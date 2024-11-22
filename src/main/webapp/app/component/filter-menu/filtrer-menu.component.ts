import { Component, OnInit } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { ClothesTypeEnum } from '../../enums/clothes-type-enum';
import SelectedItemsComponent from '../selected-items/selected-items.component';
import CheckboxListComponent from '../checkbox-list/checkbox-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterDataService } from './service/FilterDataService';

@Component({
  selector: 'jhi-filter-menu',
  standalone: true,
  imports: [NgIf, NgForOf, SelectedItemsComponent, CheckboxListComponent, ReactiveFormsModule, FormsModule, NgClass],
  templateUrl: './filter-menu.component.html',
  styleUrl: './filter-menu.component.scss',
})
export default class FilterMenuComponent implements OnInit {
  typesOfClothes = Object.values(ClothesTypeEnum);
  typesOfGames = [
    'Jeu 1',
    'Jeu 2',
    'Jeu 3',
    'Jeu 4',
    'Jeu 5',
    'Jeu 6',
    'Jeu 7',
    'Jeu 8',
    'Jeu 9',
    'Jeu 10',
    'Jeu 11',
    'Jeu 12',
    'Jeu 13',
    'Jeu 14',
    'Jeu 15',
    'Jeu 16',
    'Jeu 17',
    'Jeu 18',
  ];
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
    'Anime 13',
    'Anime 14',
    'Anime 15',
    'Anime 16',
    'Anime 17',
  ];

  selectedItemsClothes: string[] = [];
  selectedItemsThemes: string[] = [];
  searchQuery = '';

  constructor(private filterDataService: FilterDataService) {}
  ngOnInit(): void {
    this.filterDataService.getThemes().subscribe(themes => {
      this.selectedItemsThemes = themes;
    });
    this.filterDataService.getClothes().subscribe(clothes => {
      this.selectedItemsClothes = clothes;
    });
  }

  toggleSelection(selectedItems: string[], type: string): void {
    const index = selectedItems.indexOf(type);
    if (index === -1) {
      selectedItems.push(type);
    } else {
      selectedItems.splice(index, 1);
    }
    this.updateService(selectedItems);
  }
  removeItem(selectedItems: string[], item: string): void {
    const index = selectedItems.indexOf(item);
    if (index !== -1) {
      selectedItems.splice(index, 1);
    }
    this.updateService(selectedItems);
  }
  updateService(selectedItems: string[]): void {
    if (selectedItems === this.selectedItemsClothes) {
      this.filterDataService.setClothes(this.selectedItemsClothes);
    } else if (selectedItems === this.selectedItemsThemes) {
      this.filterDataService.setThemes(this.selectedItemsThemes);
    }
  }

  onSearch(): void {
    // eslint-disable-next-line no-console
    console.log('Recherche :', this.searchQuery);
  }
}
