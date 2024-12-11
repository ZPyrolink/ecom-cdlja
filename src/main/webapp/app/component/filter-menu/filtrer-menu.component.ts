import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { ClothesTypeEnum } from '../../enums/clothes-type-enum';
import SelectedItemsComponent from '../selected-items/selected-items.component';
import CheckboxListComponent from '../checkbox-list/checkbox-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterDataService } from './service/FilterDataService';
import { VideoGameService } from '../../entities/category/service/videogame.service';
import { AnimeService } from '../../entities/category/service/anime.service';
import { CategoryService } from '../../entities/category/service/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-filter-menu',
  standalone: true,
  imports: [NgIf, NgForOf, SelectedItemsComponent, CheckboxListComponent, ReactiveFormsModule, FormsModule, NgClass],
  templateUrl: './filter-menu.component.html',
  styleUrl: './filter-menu.component.scss',
})
export default class FilterMenuComponent implements OnInit {
  typesOfClothes = Object.values(ClothesTypeEnum);
  typesOfGames: string[] = [];
  typesOfAnime: string[] = [];

  selectedItemsClothes: string[] = [];
  selectedItemsThemes: string[] = [];
  searchQuery = '';

  constructor(
    private filterDataService: FilterDataService,
    private cdr: ChangeDetectorRef,
    private videoGameService: VideoGameService,
    private animeService: AnimeService,
    private categoryService: CategoryService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.filterDataService.getThemes().subscribe(themes => {
      this.selectedItemsThemes = themes;
      this.cdr.detectChanges();
    });
    this.filterDataService.getClothes().subscribe((clothes: string[]) => {
      this.selectedItemsClothes = clothes;
      this.cdr.detectChanges();
    });

    this.videoGameService.query().subscribe(response => {
      this.typesOfGames = response.body ?? [];
    });
    this.animeService.query().subscribe(response => {
      this.typesOfAnime = response.body ?? [];
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
      window.sessionStorage['filters.type'] = this.selectedItemsClothes;
    } else if (selectedItems === this.selectedItemsThemes) {
      this.filterDataService.setThemes(this.selectedItemsThemes);
      window.sessionStorage['filters.videogame'] = this.selectedItemsThemes;
      window.sessionStorage['filters.anime'] = this.selectedItemsThemes;
    }
    if (window.location.pathname !== '') {
      this.router.navigate(['']);
    }
  }

  onSearch(): void {
    this.categoryService.search(this.searchQuery).subscribe({
      next: data => {
        this.typesOfAnime = data.animeThemes;
        this.typesOfGames = data.videogameThemes;
      },
      error(err) {
        console.error('Erreur lors de la recherche :', err);
      },
    });
    // eslint-disable-next-line no-console
    console.log('Recherche :', this.searchQuery);
  }
}
