import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'jhi-price-filter',
  standalone: true,
  imports: [FormsModule, NgStyle],
  templateUrl: './price-filter.component.html',
  styleUrl: './price-filter.component.scss',
})
export class PriceFilterComponent {
  minValue = 0;
  maxValue = 100;

  updateMin(event: Event): void {
    const target = event.target as HTMLInputElement;
    const min = parseInt(target.value, 10);
    this.minValue = Math.min(min, this.maxValue - 1); // Assure que minValue reste inférieur à maxValue
  }

  updateMax(event: Event): void {
    const target = event.target as HTMLInputElement;
    const max = parseInt(target.value, 10);
    this.maxValue = Math.max(max, this.minValue + 1); // Assure que maxValue reste supérieur à minValue
  }
}
