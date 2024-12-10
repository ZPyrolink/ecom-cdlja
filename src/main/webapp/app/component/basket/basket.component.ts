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
        window.console.log('testtttttttttt', this.order?.orderLines);
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
      this.service.add(clothe.stockDTO.id)?.subscribe({
        next() {
          window.location.reload();
        },
        error(error) {
          window.console.error('Erreur lors de la requête:', error);
        },
      });
    }
  }

  decreaseQuantity(clothe: IOrderLine): void {
    if (clothe.stockDTO?.id) {
      this.service.delete(clothe.stockDTO.id, 1)?.subscribe({
        next() {
          window.location.reload();
        },
        error(error) {
          window.console.error('Erreur lors de la requête:', error);
        },
      });
    }
  }

  delete(clothe: IOrderLine): void {
    if (clothe.stockDTO?.id && clothe.quantity) {
      this.service.delete(clothe.stockDTO.id, clothe.quantity)?.subscribe({
        next() {
          window.location.reload();
        },
        error(error) {
          // TODO ajouter erreur si stock manquant
          window.console.error('Erreur lors de la requête:', error);
        },
      });
    }
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
          this.router.navigate(['/pay']);
        },
        error(error) {
          // TODO afficher article plus en stock
          console.error('Erreur lors de la validation du panier :', error);
        },
      });
    }
  }
}
