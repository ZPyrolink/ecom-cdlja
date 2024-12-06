import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOrder, NewOrder } from '../order.model';

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

  query(req?: any): Observable<HttpResponse<IOrder>> | undefined {
    const token = window.sessionStorage['id_storage'];
    // TODO changer
    // if (!token) {
    // window.console.log('Token vide');
    //  return;
    // } else {
    const options = createRequestOption(req);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<IOrder>(this.resourceUrl, { params: options, headers, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    const token = window.sessionStorage['id_storage'];
    const options = createRequestOption();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`api/basket/${id}`, {
      params: options,
      headers,
      observe: 'response',
      responseType: 'text',
    });
  }

  add(id: number): Observable<object> {
    const token = window.sessionStorage['id_storage'];
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = createRequestOption();
    const body = { id };
    return this.http.post(`api/basket/${id}`, body, {
      params: options,
      headers,
      observe: 'response',
      responseType: 'text',
    });
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
