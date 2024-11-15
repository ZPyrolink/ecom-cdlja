import { Component } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { ColorItemComponent } from '../color-item/color-item.component';
import { SizeFilterComponent } from './size-filter/size-filter.component';
import { PriceFilterComponent } from './price-filter/price-filter.component';
import { GenderFilterComponent } from './gender-filter/gender-filter.component';
import { ColorEnum } from '../../enums/color-enum';

@Component({
  selector: 'jhi-filters-bar',
  standalone: true,
  imports: [NgForOf, NgIf, ColorItemComponent, SizeFilterComponent, PriceFilterComponent, GenderFilterComponent],
  templateUrl: './filters-bar.component.html',
  styleUrl: './filters-bar.component.scss',
})
export class FiltersBarComponent {
  showColorFilter: string | undefined = undefined;
  protected readonly Object = Object;
  protected readonly ColorEnum = ColorEnum;

  onFilter(filterType: string): void {
    if (this.showColorFilter === filterType) {
      this.showColorFilter = undefined;
      // eslint-disable-next-line no-console
      console.log('Option sélectionnée:', this.showColorFilter);
    }
    this.showColorFilter = filterType;
  }

  onOptionClick(option: string): void {
    // eslint-disable-next-line no-console
    console.log('Option sélectionnée:', option);
  }
}
