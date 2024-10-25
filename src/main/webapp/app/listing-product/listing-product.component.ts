import { Component } from '@angular/core';
import SharedModule from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'jhi-listing-product',
  standalone: true,
  templateUrl: './listing-product.component.html',
  styleUrl: './listing-product.component.scss',
  imports: [SharedModule, RouterModule],
})
export default class ListingProductComponent {}
