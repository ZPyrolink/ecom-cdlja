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
    this.loadOrders(this.currentPage); // Appeler la méthode dès l'initialisation
  }

  loadOrders(page: number): void {
    this.service.query({ page })?.subscribe({
      next: response => {
        if (response.body) {
          this.order = response.body;
          this.clothes = response.body.orderLines ?? [];
          this.totalPages = response.body.totalPages ?? 1;
          this.currentPage = response.body.number ?? 1;
        } else {
          // TODO gerer si pas connecter et pour supprimer et ajouter quantite
        }
      },
    });
  }

  increaseQuantity(clothe: IOrderLine): void {
    window.console.log(this.order);
    if (clothe.stockDTO?.id) {
      this.service.add(clothe.stockDTO.id).subscribe({
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
      this.service.delete(clothe.stockDTO.id).subscribe({
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
    // TODO ajouter route
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
          console.error('Erreur lors de la validation du panier :', error);
        },
      });
    }
  }
}
