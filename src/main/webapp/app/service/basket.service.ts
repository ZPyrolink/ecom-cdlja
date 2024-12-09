import { Injectable } from '@angular/core';
import { NewOrder } from '../entities/order/order.model';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  private static readonly EMPTY_BASKET: NewOrder = { id: null };

  getBasket(): NewOrder | undefined {
    const str = sessionStorage.getItem('basket');
    return str ? (JSON.parse(str) as NewOrder) : undefined;
  }

  newBasket(): void {
    sessionStorage['basket'] = JSON.stringify(BasketService.EMPTY_BASKET);
  }
}
