import { Component } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'jhi-filter-menu',
  standalone: true,
  imports: [NgIf],
  templateUrl: './filter-menu.component.html',
  styleUrl: './filter-menu.component.scss',
})
export default class FilterMenuComponent {
  isVisible = false;

  toggleVisibility(): void {
    this.isVisible = !this.isVisible;
  }
}
