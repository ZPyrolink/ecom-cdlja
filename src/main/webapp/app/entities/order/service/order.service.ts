import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOrder, NewOrder } from '../order.model';
import { IOrderLine } from '../../order-line/order-line.model';
import { IStock } from '../../stock/stock.model';

export type PartialUpdateOrder = Partial<IOrder> & Pick<IOrder, 'id'>;

type RestOf<T extends IOrder | NewOrder> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestOrder = RestOf<IOrder>;

export type NewRestOrder = RestOf<NewOrder>;

export type PartialUpdateRestOrder = RestOf<PartialUpdateOrder>;

export type EntityResponseType = HttpResponse<IOrder>;
export type EntityArrayResponseType = HttpResponse<IOrder[]>;

@Injectable({ providedIn: 'root' })
export class OrderService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/client/basket');

  create(order: NewOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(order);
    return this.http.post<RestOrder>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(order: IOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(order);
    return this.http
      .put<RestOrder>(`${this.resourceUrl}/${this.getOrderIdentifier(order)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(order: PartialUpdateOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(order);
    return this.http
      .patch<RestOrder>(`${this.resourceUrl}/${this.getOrderIdentifier(order)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<IOrder> | undefined {
    const token = window.sessionStorage['id_storage'];
    if (!token) {
      const basket = window.sessionStorage['basket'];
      const order = basket ? (JSON.parse(basket) as IOrder) : undefined;
      return order ? of(order) : undefined;
    } else {
      const options = createRequestOption(req);
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<IOrder>(this.resourceUrl, { params: options, headers, observe: 'response' }).pipe(
        map(response => response.body as IOrder), // On extrait le corps de la réponse
      );
    }
  }

  delete(stock: IStock, quantity: number): Observable<HttpResponse<{}>> | undefined {
    const token = window.sessionStorage['id_storage'];
    if (!token) {
      this.deleteClotheToOrder(stock, quantity);
      window.console.log('Token vide');
      return;
    } else {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const body = { quantite: quantity };
      return this.http.delete(`api/basket/${stock.id}`, {
        headers,
        body,
        observe: 'response',
        responseType: 'text',
      });
    }
  }

  add(stock: IStock): Observable<object> | undefined {
    const token = window.sessionStorage['id_storage'];
    if (!token) {
      this.addClotheToOrder(stock);
      window.console.log('Token vide');
      return;
    } else {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const options = createRequestOption();
      return this.http.post(`api/basket/${stock.id}`, {
        params: options,
        headers,
        observe: 'response',
        responseType: 'text',
      });
    }
  }

  addClotheToOrder(stock: IStock): void {
    const existingOrder = window.sessionStorage.getItem('basket'); // Utilise getItem pour lire sessionStorage
    let order: IOrder;

    if (existingOrder) {
      try {
        order = JSON.parse(existingOrder) as IOrder;
        window.console.log(order);
        order.orderLines = order.orderLines ?? [];
      } catch (error) {
        console.error('Erreur lors du parsing du panier :', error);
        order = { id: Date.now(), status: 'BASKET', date: dayjs(), orderLines: [], amount: 0 } as IOrder;
      }
    } else {
      order = {
        id: Date.now(),
        status: 'BASKET',
        date: dayjs(),
        orderLines: [],
        amount: 0,
      } as IOrder;
    }

    const existingOrderLine = order.orderLines?.find(
      line => line.stockDTO?.id === stock.id && line.stockDTO.color === stock.color && line.stockDTO.size === stock.size,
    );

    if (existingOrderLine) {
      existingOrderLine.quantity = (existingOrderLine.quantity ?? 0) + 1;
      existingOrderLine.amountline = (existingOrderLine.quantity ?? 0) * (stock.clotheDTO?.price ?? 0);
    } else {
      const orderLine: IOrderLine = {
        id: Date.now(),
        quantity: 1,
        amountline: stock.clotheDTO?.price ?? 0,
        stockDTO: stock,
      };
      window.console.log('laaaaaaaaaaaaaaa', stock);
      order.orderLines?.push(orderLine);
    }

    order.amount = order.orderLines?.reduce((total, line) => total + (line.amountline ?? 0), 0);
    window.sessionStorage.setItem('basket', JSON.stringify(order));
    window.console.log('Panier mis à jour :', order);
  }
  deleteClotheToOrder(stock: IStock, quantity: number): void {
    const existingOrder = window.sessionStorage.getItem('basket');
    let order: IOrder;

    if (existingOrder) {
      try {
        order = JSON.parse(existingOrder) as IOrder;
        window.console.log(order);
        order.orderLines = order.orderLines ?? [];
      } catch (error) {
        console.error('Erreur lors du parsing du panier :', error);
        order = { id: Date.now(), status: 'BASKET', date: dayjs(), orderLines: [], amount: 0 } as IOrder;
      }
      const existingOrderLine = order.orderLines?.find(
        line => line.stockDTO?.id === stock.id && line.stockDTO.color === stock.color && line.stockDTO.size === stock.size,
      );

      if (existingOrderLine) {
        const newQuantity = (existingOrderLine.quantity ?? 0) - quantity;

        if (newQuantity <= 0) {
          order.orderLines = order.orderLines?.filter(
            line => line.stockDTO?.id !== stock.id || line.stockDTO.color !== stock.color || line.stockDTO.size !== stock.size,
          );
        } else {
          existingOrderLine.quantity = (existingOrderLine.quantity ?? 0) - quantity;
          existingOrderLine.amountline = (existingOrderLine.amountline ?? 0) - quantity * (stock.clotheDTO?.price ?? 0);
        }
      }

      order.amount = (order.amount ?? 0) - (stock.clotheDTO?.price ?? 0) * quantity;
      window.sessionStorage.setItem('basket', JSON.stringify(order));
    }
  }
  validateBasket(id: number): Observable<object> {
    return this.http.post(`${this.resourceUrl}/validate/${id}`, { observe: 'response' });
  }

  getOrderIdentifier(order: Pick<IOrder, 'id'>): number {
    return order.id;
  }

  compareOrder(o1: Pick<IOrder, 'id'> | null, o2: Pick<IOrder, 'id'> | null): boolean {
    return o1 && o2 ? this.getOrderIdentifier(o1) === this.getOrderIdentifier(o2) : o1 === o2;
  }

  addOrderToCollectionIfMissing<Type extends Pick<IOrder, 'id'>>(
    orderCollection: Type[],
    ...ordersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const orders: Type[] = ordersToCheck.filter(isPresent);
    if (orders.length > 0) {
      const orderCollectionIdentifiers = orderCollection.map(orderItem => this.getOrderIdentifier(orderItem));
      const ordersToAdd = orders.filter(orderItem => {
        const orderIdentifier = this.getOrderIdentifier(orderItem);
        if (orderCollectionIdentifiers.includes(orderIdentifier)) {
          return false;
        }
        orderCollectionIdentifiers.push(orderIdentifier);
        return true;
      });
      return [...ordersToAdd, ...orderCollection];
    }
    return orderCollection;
  }

  protected convertDateFromClient<T extends IOrder | NewOrder | PartialUpdateOrder>(order: T): RestOf<T> {
    return {
      ...order,
      date: order.date?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restOrder: RestOrder): IOrder {
    return {
      ...restOrder,
      date: restOrder.date ? dayjs(restOrder.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestOrder>): HttpResponse<IOrder> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestOrder[]>): HttpResponse<IOrder[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
