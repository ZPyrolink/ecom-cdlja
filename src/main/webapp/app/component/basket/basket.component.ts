import { Component, OnInit } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';
import { NgForOf, NgIf } from '@angular/common';
import { OrderService } from '../../entities/order/service/order.service';
import { IClothe } from '../../entities/clothe/clothe.model';

@Component({
  selector: 'jhi-basket',
  standalone: true,
  imports: [PaginationComponent, NgForOf, NgIf],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss',
})
export default class BasketComponent implements OnInit {
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

  totalPages = 0;
  currentPage = 0;
  clothes: IClothe[] = [];
  orders: any[] = [];
  errorMessage = '';

  constructor(private service: OrderService) {}

  ngOnInit(): void {
    this.loadOrders(this.currentPage); // Appeler la méthode dès l'initialisation
  }

  loadOrders(page: number): void {
    this.service.query({ page })?.subscribe({
      next: response => {
        if (response.body) {
          this.orders = response.body.content;
        } else {
          this.orders = []; // Aucun résultat
        }
      },
    });
    window.console.log('iciiiiiiiiiiiiiiiiiiiiii', this.orders);
  }
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
