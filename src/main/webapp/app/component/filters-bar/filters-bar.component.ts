import { Component } from '@angular/core';

@Component({
  selector: 'jhi-filters-bar',
  standalone: true,
  imports: [],
  templateUrl: './filters-bar.component.html',
  styleUrl: './filters-bar.component.scss',
})
export class FiltersBarComponent {
  onFilter(filterType: string): void {
    // eslint-disable-next-line no-console
    console.log(`Filtre sélectionné : ${filterType}`);
  }

  onOptionClick(option: string): void {
    // eslint-disable-next-line no-console
    console.log('Option sélectionnée:', option);
  }
}
