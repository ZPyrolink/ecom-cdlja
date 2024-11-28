import { Component } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';
import { NgForOf, NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'jhi-basket',
  standalone: true,
  imports: [PaginationComponent, NgForOf, FaIconComponent, NgIf],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss',
})
export default class BasketComponent {
  totalPages = 1;
  currentPage = 1;
  products = [
    {
      name: 'Brassiere',
      theme: 'Minecraft',
      size: 'Small',
      color: 'Rose',
      price: 20,
      quantity: 1,
      image: 'content/images/exemple.png',
    },
    {
      name: 'Brassiere',
      theme: 'Minecraft',
      size: 'Small',
      color: 'Rose',
      price: 20,
      quantity: 1,
      image: 'content/images/exemple.png',
    },
    {
      name: 'Brassiere',
      theme: 'Minecraft',
      size: 'Small',
      color: 'Rose',
      price: 20,
      quantity: 1,
      image: 'content/images/exemple.png',
    },
    {
      name: 'Brassiere',
      size: 'Small',
      color: 'Rose',
      price: 20,
      quantity: 1,
      image: 'content/images/exemple.png',
    },
    {
      name: 'Brassiere',
      size: 'Small',
      color: 'Rose',
      price: 20,
      quantity: 1,
      image: 'content/images/exemple.png',
    },
    {
      name: 'Brassiere',
      size: 'Small',
      color: 'Rose',
      price: 20,
      quantity: 1,
      image: 'content/images/exemple.png',
    },
  ];
  deliveryPrice = 5.99;
  totalPrice = 10;

  totalOrderPrice(): any {
    return this.deliveryPrice;
  }

  increaseQuantity(product: any): void {
    product.quantity++;
  }

  decreaseQuantity(product: any): void {
    if (product.quantity > 1) {
      product.quantity--;
    }
  }

  editProduct(product: any): void {
    alert(`Modifier le produit : ${product.name}`);
  }

  onPageChange(page: number): void {
    // eslint-disable-next-line no-console
    console.log('Data for page', page);
  }

  submitOrder(): void {
    alert('Commande soumise avec succès !');
  }
}
