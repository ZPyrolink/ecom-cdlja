import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { ColorItemComponent } from '../color-item/color-item.component';
import { PriceFilterComponent } from './price-filter/price-filter.component';
import { ColorEnum } from '../../enums/color-enum';
import { ItemComponent } from '../item/item.component';
import { SizeEnum } from '../../enums/size-enum';
import { GenderEnum } from '../../enums/gender-enum';
import { FilterDataService } from '../filter-menu/service/FilterDataService';

type FilterType = 'color' | 'size' | 'price' | 'gender';

@Component({
  selector: 'jhi-filters-bar',
  standalone: true,
  imports: [NgIf, ColorItemComponent, PriceFilterComponent, ItemComponent, NgClass],
  templateUrl: './filters-bar.component.html',
  styleUrl: './filters-bar.component.scss',
})
export class FiltersBarComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<Record<string, any>>();
  showColorFilter: string | undefined;
  selections = {
    color: [],
    size: [],
    price: { min: 0, max: 100 },
    gender: [],
    sort: '',
  };
  protected readonly Object = Object;
  protected readonly ColorEnum = ColorEnum;
  protected readonly SizeEnum = SizeEnum;
  protected readonly GenderEnum = GenderEnum;

  constructor(private filterService: FilterDataService) {}
  ngOnInit(): void {
    this.loadSelectionsFromSessionStorage();
  }

  onFilter(filterType: FilterType): void {
    if (this.showColorFilter === filterType) {
      this.showColorFilter = undefined;
    } else {
      this.showColorFilter = filterType;
    }
  }

  onOptionClick(option: string): void {
    window.sessionStorage['sort'] = option;
    this.selections['sort'] = option;
    this.filtersChanged.emit(this.selections);
    this.filterService.setSort(option);
  }

  updateSelection(filterType: FilterType, selection: any): void {
    this.selections[filterType] = selection;
    if (filterType === 'color') {
      this.filterService.setColor(this.selections[filterType]);
    }
    if (filterType === 'size') {
      this.filterService.setSize(this.selections[filterType]);
    }
    if (filterType === 'gender') {
      this.filterService.setGender(this.selections[filterType]);
    }
    this.saveSelectionToSessionStorage(filterType, selection);
    this.filtersChanged.emit(this.selections);
  }

  private saveSelectionToSessionStorage(filterType: FilterType, selection: any): void {
    window.sessionStorage[`filters.${filterType}`] = JSON.stringify(selection);
  }

  private loadSelectionsFromSessionStorage(): void {
    (Object.keys(this.selections) as FilterType[]).forEach(filterType => {
      const storedSelection = window.sessionStorage[`filters.${filterType}`];
      if (storedSelection) {
        this.selections[filterType] = JSON.parse(storedSelection);
      }
    });
  }
}
