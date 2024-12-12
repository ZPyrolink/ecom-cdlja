import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderStateService {
  private orderQuantitySubject = new BehaviorSubject<number>(0);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  orderQuantity$ = this.orderQuantitySubject.asObservable();

  setOrderQuantity(quantity: number): void {
    this.orderQuantitySubject.next(quantity);
  }

  incrementOrderQuantity(amount: number): void {
    const currentQuantity = this.orderQuantitySubject.getValue();
    this.orderQuantitySubject.next(currentQuantity + amount);
  }

  decrementOrderQuantity(amount: number): void {
    const currentQuantity = this.orderQuantitySubject.getValue();
    this.orderQuantitySubject.next(currentQuantity - amount);
  }
}
