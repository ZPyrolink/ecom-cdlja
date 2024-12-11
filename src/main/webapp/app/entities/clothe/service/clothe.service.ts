import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IClothe, NewClothe } from '../clothe.model';
import { PaginatedResponse } from '../../../core/request/paginated-response.model';
import { FilterDataService } from '../../../component/filter-menu/service/FilterDataService';
import { map } from 'rxjs/operators';

export type PartialUpdateClothe = Partial<IClothe> & Pick<IClothe, 'id'>;

export type EntityResponseType = HttpResponse<IClothe>;
export type EntityArrayResponseType = HttpResponse<IClothe[]>;

@Injectable({ providedIn: 'root' })
export class ClotheService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/clothes');
  constructor(private filterDataService: FilterDataService) {}
  create(clothe: NewClothe): Observable<EntityResponseType> {
    return this.http.post<IClothe>(this.resourceUrl, clothe, { observe: 'response' });
  }

  update(clothe: IClothe): Observable<EntityResponseType> {
    return this.http.put<IClothe>(`${this.resourceUrl}/${this.getClotheIdentifier(clothe)}`, clothe, { observe: 'response' });
  }

  partialUpdate(clothe: PartialUpdateClothe): Observable<EntityResponseType> {
    return this.http.patch<IClothe>(`${this.resourceUrl}/${this.getClotheIdentifier(clothe)}`, clothe, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IClothe>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<PaginatedResponse<IClothe>>> | undefined {
    const filteredData = this.filterDataService.getFiltered();
    window.console.log('filtre', filteredData);
    const body = {
      params: req,
      ...filteredData,
    };
    return this.http.post<PaginatedResponse<IClothe>>(`${this.resourceUrl}/filters`, body, { params: req, observe: 'response' }).pipe(
      map(response => {
        window.console.log('Réponse de la requête:', response);
        return response;
      }),
    );
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getClotheIdentifier(clothe: Pick<IClothe, 'id'>): number {
    return clothe.id;
  }

  compareClothe(o1: Pick<IClothe, 'id'> | null, o2: Pick<IClothe, 'id'> | null): boolean {
    return o1 && o2 ? this.getClotheIdentifier(o1) === this.getClotheIdentifier(o2) : o1 === o2;
  }

  addClotheToCollectionIfMissing<Type extends Pick<IClothe, 'id'>>(
    clotheCollection: Type[],
    ...clothesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const clothes: Type[] = clothesToCheck.filter(isPresent);
    if (clothes.length > 0) {
      const clotheCollectionIdentifiers = clotheCollection.map(clotheItem => this.getClotheIdentifier(clotheItem));
      const clothesToAdd = clothes.filter(clotheItem => {
        const clotheIdentifier = this.getClotheIdentifier(clotheItem);
        if (clotheCollectionIdentifiers.includes(clotheIdentifier)) {
          return false;
        }
        clotheCollectionIdentifiers.push(clotheIdentifier);
        return true;
      });
      return [...clothesToAdd, ...clotheCollection];
    }
    return clotheCollection;
  }
}
