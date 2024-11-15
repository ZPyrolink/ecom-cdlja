import { Component } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { ColorItemComponent } from '../color-item/color-item.component';
import { PriceFilterComponent } from './price-filter/price-filter.component';
import { GenderFilterComponent } from './gender-filter/gender-filter.component';
import { ColorEnum } from '../../enums/color-enum';
import { SizeItemComponent } from '../size-item/size-item.component';
import { SizeEnum } from '../../enums/size-enum';

@Component({
  selector: 'jhi-filters-bar',
  standalone: true,
  imports: [NgForOf, NgIf, ColorItemComponent, PriceFilterComponent, GenderFilterComponent, SizeItemComponent],
  templateUrl: './filters-bar.component.html',
  styleUrl: './filters-bar.component.scss',
})
export class FiltersBarComponent {
  showColorFilter: string | undefined = undefined;
  protected readonly Object = Object;
  protected readonly ColorEnum = ColorEnum;
  protected readonly SizeEnum = SizeEnum;

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
