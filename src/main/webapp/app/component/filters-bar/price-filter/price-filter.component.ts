import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() minValue = 0;
  @Input() maxValue = 100;
  @Output() selectionChange = new EventEmitter<{ min: number; max: number }>();

  updateMin(event: Event): void {
    const newValue = Number((event.target as HTMLInputElement).value);
    if (newValue <= this.maxValue) {
      this.minValue = newValue;
      this.emitSelectionChange();
    } else {
      (event.target as HTMLInputElement).value = String(this.minValue);
    }
  }

  updateMax(event: Event): void {
    const newValue = Number((event.target as HTMLInputElement).value);
    if (newValue >= this.minValue) {
      this.maxValue = newValue;
      this.emitSelectionChange();
    } else {
      (event.target as HTMLInputElement).value = String(this.maxValue);
    }
  }
  private emitSelectionChange(): void {
    this.selectionChange.emit({ min: this.minValue, max: this.maxValue });
  }
}
