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
    const newValue = Number((event.target as HTMLInputElement).value);
    if (newValue <= this.maxValue) {
      this.minValue = newValue;
    } else {
      (event.target as HTMLInputElement).value = String(this.minValue);
    }
  }

  updateMax(event: Event): void {
    const newValue = Number((event.target as HTMLInputElement).value);
    if (newValue >= this.minValue) {
      this.maxValue = newValue;
    } else {
      (event.target as HTMLInputElement).value = String(this.maxValue);
    }
  }
}
