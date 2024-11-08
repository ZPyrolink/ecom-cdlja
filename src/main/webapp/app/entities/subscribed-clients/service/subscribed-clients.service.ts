import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISubscribedClients, NewSubscribedClients } from '../subscribed-clients.model';

export type PartialUpdateSubscribedClients = Partial<ISubscribedClients> & Pick<ISubscribedClients, 'id'>;

type RestOf<T extends ISubscribedClients | NewSubscribedClients> = Omit<T, 'birthday'> & {
  birthday?: string | null;
};

export type RestSubscribedClients = RestOf<ISubscribedClients>;

export type NewRestSubscribedClients = RestOf<NewSubscribedClients>;

export type PartialUpdateRestSubscribedClients = RestOf<PartialUpdateSubscribedClients>;

export type EntityResponseType = HttpResponse<ISubscribedClients>;
export type EntityArrayResponseType = HttpResponse<ISubscribedClients[]>;

@Injectable({ providedIn: 'root' })
export class SubscribedClientsService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/subscribed-clients');

  create(subscribedClients: NewSubscribedClients): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(subscribedClients);
    return this.http
      .post<RestSubscribedClients>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(subscribedClients: ISubscribedClients): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(subscribedClients);
    return this.http
      .put<RestSubscribedClients>(`${this.resourceUrl}/${this.getSubscribedClientsIdentifier(subscribedClients)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(subscribedClients: PartialUpdateSubscribedClients): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(subscribedClients);
    return this.http
      .patch<RestSubscribedClients>(`${this.resourceUrl}/${this.getSubscribedClientsIdentifier(subscribedClients)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestSubscribedClients>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestSubscribedClients[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSubscribedClientsIdentifier(subscribedClients: Pick<ISubscribedClients, 'id'>): number {
    return subscribedClients.id;
  }

  compareSubscribedClients(o1: Pick<ISubscribedClients, 'id'> | null, o2: Pick<ISubscribedClients, 'id'> | null): boolean {
    return o1 && o2 ? this.getSubscribedClientsIdentifier(o1) === this.getSubscribedClientsIdentifier(o2) : o1 === o2;
  }

  addSubscribedClientsToCollectionIfMissing<Type extends Pick<ISubscribedClients, 'id'>>(
    subscribedClientsCollection: Type[],
    ...subscribedClientsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const subscribedClients: Type[] = subscribedClientsToCheck.filter(isPresent);
    if (subscribedClients.length > 0) {
      const subscribedClientsCollectionIdentifiers = subscribedClientsCollection.map(subscribedClientsItem =>
        this.getSubscribedClientsIdentifier(subscribedClientsItem),
      );
      const subscribedClientsToAdd = subscribedClients.filter(subscribedClientsItem => {
        const subscribedClientsIdentifier = this.getSubscribedClientsIdentifier(subscribedClientsItem);
        if (subscribedClientsCollectionIdentifiers.includes(subscribedClientsIdentifier)) {
          return false;
        }
        subscribedClientsCollectionIdentifiers.push(subscribedClientsIdentifier);
        return true;
      });
      return [...subscribedClientsToAdd, ...subscribedClientsCollection];
    }
    return subscribedClientsCollection;
  }

  protected convertDateFromClient<T extends ISubscribedClients | NewSubscribedClients | PartialUpdateSubscribedClients>(
    subscribedClients: T,
  ): RestOf<T> {
    return {
      ...subscribedClients,
      birthday: subscribedClients.birthday?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restSubscribedClients: RestSubscribedClients): ISubscribedClients {
    return {
      ...restSubscribedClients,
      birthday: restSubscribedClients.birthday ? dayjs(restSubscribedClients.birthday) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestSubscribedClients>): HttpResponse<ISubscribedClients> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestSubscribedClients[]>): HttpResponse<ISubscribedClients[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
