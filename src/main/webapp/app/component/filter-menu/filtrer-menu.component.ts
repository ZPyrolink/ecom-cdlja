import { Component } from '@angular/core';

@Component({
  selector: 'jhi-filter-menu',
  standalone: true,
  imports: [],
  templateUrl: './filter-menu.component.html',
  styleUrl: './filter-menu.component.scss',
})
export class FilterMenuComponent {
  isVisible = false;

  toggleVisibility(): void {
    this.isVisible = !this.isVisible;
  }
}
