import { Component } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { ColorItemComponent } from '../color-item/color-item.component';
import { PriceFilterComponent } from './price-filter/price-filter.component';
import { GenderFilterComponent } from './gender-filter/gender-filter.component';
import { ColorEnum } from '../../enums/color-enum';
import { SizeItemComponent } from '../size-item/size-item.component';
import { SizeEnum } from '../../enums/size-enum';
import { GenderEnum } from '../../enums/gender-enum';

@Component({
  selector: 'jhi-filters-bar',
  standalone: true,
  imports: [NgForOf, NgIf, ColorItemComponent, PriceFilterComponent, GenderFilterComponent, SizeItemComponent, NgClass],
  templateUrl: './filters-bar.component.html',
  styleUrl: './filters-bar.component.scss',
})
export class FiltersBarComponent {
  showColorFilter: string | undefined;
  protected readonly Object = Object;
  protected readonly ColorEnum = ColorEnum;
  protected readonly SizeEnum = SizeEnum;
  protected readonly GenderEnum = GenderEnum;

  onFilter(filterType: string): void {
    // eslint-disable-next-line no-console
    console.log(filterType, '1Option sélectionnée:', this.showColorFilter === filterType);

    if (this.showColorFilter === filterType) {
      this.showColorFilter = undefined;
      // eslint-disable-next-line no-console
      console.log('2Option sélectionnée:', this.showColorFilter);
    } else {
      this.showColorFilter = filterType;
    }
    // eslint-disable-next-line no-console
    console.log('4Option sélectionnée:', this.showColorFilter);
  }

  onOptionClick(option: string): void {
    // eslint-disable-next-line no-console
    console.log('Option sélectionnée:', option);
  }
}
