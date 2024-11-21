import { Component } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'jhi-basket',
  standalone: true,
  imports: [PaginationComponent, NgForOf],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss',
})
export default class BasketComponent {
  products = {
    name: 'Brassiere',
    size: 'Small',
    color: 'Rose',
    price: 20,
    quantity: 1,
    image: 'https://via.placeholder.com/150',
  };
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

  submitOrder(): void {
    alert('Commande soumise avec succès !');
  }
}
