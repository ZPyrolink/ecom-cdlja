import { Component } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { ColorFilterComponent } from './color-filter/color-filter.component';
import { SizeFilterComponent } from './size-filter/size-filter.component';
import { PriceFilterComponent } from './price-filter/price-filter.component';
import { GenderFilterComponent } from './gender-filter/gender-filter.component';

@Component({
  selector: 'jhi-filters-bar',
  standalone: true,
  imports: [NgForOf, NgIf, ColorFilterComponent, SizeFilterComponent, PriceFilterComponent, GenderFilterComponent],
  templateUrl: './filters-bar.component.html',
  styleUrl: './filters-bar.component.scss',
})
export class FiltersBarComponent {
  showColorFilter: string | undefined = undefined;

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
