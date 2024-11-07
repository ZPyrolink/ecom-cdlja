import { Component } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { ClothesTypeEnum } from '../../enums/clothes-type-enum';

@Component({
  selector: 'jhi-filter-menu',
  standalone: true,
  imports: [NgIf, NgForOf],
  templateUrl: './filter-menu.component.html',
  styleUrl: './filter-menu.component.scss',
})
export default class FilterMenuComponent {
  typesOfClothes = Object.values(ClothesTypeEnum);
}
