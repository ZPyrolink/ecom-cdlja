import { Component } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { ColorItemComponent } from '../color-item/color-item.component';
import { PriceFilterComponent } from './price-filter/price-filter.component';
import { ColorEnum } from '../../enums/color-enum';
import { ItemComponent } from '../item/item.component';
import { SizeEnum } from '../../enums/size-enum';
import { GenderEnum } from '../../enums/gender-enum';

type FilterType = 'color' | 'size' | 'price' | 'gender';

@Component({
  selector: 'jhi-filters-bar',
  standalone: true,
  imports: [NgIf, ColorItemComponent, PriceFilterComponent, ItemComponent, NgClass],
  templateUrl: './filters-bar.component.html',
  styleUrl: './filters-bar.component.scss',
})
export class FiltersBarComponent {
  showColorFilter: string | undefined;
  selections: Record<FilterType, any> = {
    color: [],
    size: [],
    price: { min: 0, max: 100 },
    gender: [],
  };
  protected readonly Object = Object;
  protected readonly ColorEnum = ColorEnum;
  protected readonly SizeEnum = SizeEnum;
  protected readonly GenderEnum = GenderEnum;

  onFilter(filterType: FilterType): void {
    if (this.showColorFilter === filterType) {
      this.showColorFilter = undefined;
    } else {
      this.showColorFilter = filterType;
    }
  }

  onOptionClick(option: string): void {
    // eslint-disable-next-line no-console
    console.log('Option sélectionnée:', option);
  }

  updateSelection(filterType: FilterType, selection: any): void {
    this.selections[filterType] = selection;
  }
}
