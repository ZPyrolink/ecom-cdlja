import { Component, OnInit, Type } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';
import { DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { OrderService } from '../../entities/order/service/order.service';
import { IOrder } from '../../entities/order/order.model';
import { IOrderLine } from '../../entities/order-line/order-line.model';
import getClotheTypeLabel from '../../entities/enumerations/type.model';
import getSizeLabel from '../../entities/enumerations/size.model';
import getColorLabel from '../../entities/enumerations/color.model';
import { Router } from '@angular/router';
import { IStock } from '../../entities/stock/stock.model';
import { OrderStateService } from '../../service/OrderStateService';

@Component({
  selector: 'jhi-basket',
  standalone: true,
  imports: [PaginationComponent, NgForOf, NgIf, DecimalPipe],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss',
})
export default class BasketComponent implements OnInit {
  totalPages = 0;
  currentPage = 0;
  clothes: IOrderLine[] | undefined;
  order: IOrder | undefined;

  protected readonly Object = Object;
  protected readonly Type = Type;
  protected readonly getClotheTypeLabel = getClotheTypeLabel;
  protected readonly getSizeLabel = getSizeLabel;
  protected readonly getColorLabel = getColorLabel;

  constructor(
    private service: OrderService,
    private router: Router,
    private orderState: OrderStateService,
  ) {}

  ngOnInit(): void {
    window.console.log('iccccccccccci');
    try {
      this.loadOrders(this.currentPage);
    } catch (e) {
      window.console.error('Erreur lors de la requête:', e);
    }
  }

  loadOrders(page: number): void {
    this.service.query({ page })?.subscribe({
      next: response => {
        this.order = response;
        this.clothes = response.orderLines ?? [];
        this.totalPages = response.totalPages ?? 1;
        this.currentPage = response.number ?? 1;
      },
      error(error) {
        window.console.error('Erreur lors de la requête:', error);
      },
    });
  }

  increaseQuantity(clothe: IOrderLine): void {
    window.console.log(this.order);
    if (clothe.stockDTO?.id) {
      this.service.add(clothe.stockDTO)?.subscribe({
        next: () => {
          this.loadOrders(this.currentPage);
        },
        error(error) {
          console.error('Erreur lors de la requête:', error);
        },
      });
    }
    this.loadOrders(this.currentPage);
    this.orderState.incrementOrderQuantity(1);
  }

  decreaseQuantity(clothe: IOrderLine): void {
    if (clothe.stockDTO?.id) {
      this.service.delete(clothe.stockDTO, 1)?.subscribe({
        next: () => {
          this.loadOrders(this.currentPage);
        },
        error(error) {
          window.console.error('Erreur lors de la requête:', error);
        },
      });
    }
    this.loadOrders(this.currentPage);
    this.orderState.decrementOrderQuantity(1);
  }

  delete(clothe: IOrderLine): void {
    if (clothe.stockDTO?.id && clothe.quantity) {
      this.service.delete(clothe.stockDTO, clothe.quantity)?.subscribe({
        next: () => {
          this.loadOrders(this.currentPage);
        },
      });
    }
    this.loadOrders(this.currentPage);
    this.orderState.decrementOrderQuantity(clothe.quantity ?? 0);
  }

  onPageChange(page: number): void {
    if (page !== this.currentPage) {
      this.loadOrders(page);
    }
  }

  submitOrder(): void {
    if (this.order?.id) {
      this.service.validateBasket(this.order.id).subscribe({
        next: () => {
          this.router.navigate(['pay']);
        },
        error(error) {
          alert("Un des articles n'est plus disponible");
          console.error('Erreur lors de la validation du panier :', error);
        },
      });
    }
  }

  getImageForClothe(clothe: IStock | undefined): string {
    clothe = clothe as IStock;
    const baseUrl = 'https://ecom-cdlja-pictures.s3.eu-north-1.amazonaws.com';
    const baseFileName = 'Image_';
    const imageIndex = 1;
    const color = getColorLabel(clothe.color);

    return `${baseUrl}/${clothe.clotheDTO?.id}/${color}/${baseFileName}${imageIndex}.png`;
  }
}
