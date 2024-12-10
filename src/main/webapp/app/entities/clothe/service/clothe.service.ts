import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
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

  query(req?: any): Observable<PaginatedResponse<IClothe>> {
    let filtresRes;
    this.filterDataService.getFilters().subscribe(filters => {
      filtresRes = filters;
    });
    const params = this.createRequestParams(req, filtresRes);
    window.console.log('Params de la requête:', filtresRes);

    // Envoyer la requête HTTP avec les paramètres
    return this.http.post<PaginatedResponse<IClothe>>(`${this.resourceUrl}/filters`, filtresRes, { params: req, observe: 'response' }).pipe(
      map(response => {
        window.console.log('Réponse de la requête:', response.body);
        if (response.body) {
          return response.body; // Retourner les données de la réponse si présentes
        } else {
          // Retourner un objet vide avec la structure de PaginatedResponse si la réponse est nulle
          return {
            content: [],
            totalElements: 0,
            totalPages: 0,
            size: 0,
            number: 0,
            numberOfElements: 0,
            first: true,
            last: true,
          } as PaginatedResponse<IClothe>;
        }
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

  private createRequestParams(req: any, filters: any): HttpParams {
    let params = new HttpParams();

    // Ajoutez les filtres à la requête
    if (filters.search) {
      params = params.set('search', filters.search);
    }
    if (filters.size && filters.size.length > 0) {
      params = params.set('size', filters.size.join(','));
    }
    if (filters.color && filters.color.length > 0) {
      params = params.set('color', filters.color.join(','));
    }
    if (filters.price) {
      params = params.set('priceMin', filters.price.min.toString()).set('priceMax', filters.price.max.toString());
    }
    if (filters.gender && filters.gender.length > 0) {
      params = params.set('gender', filters.gender.join(','));
    }
    if (filters.videogame && filters.videogame.length > 0) {
      params = params.set('videogame', filters.videogame.join(','));
    }
    if (filters.anime && filters.anime.length > 0) {
      params = params.set('anime', filters.anime.join(','));
    }

    // Ajoutez d'autres paramètres (par exemple, tri, pagination) à la requête
    if (req?.sort) {
      params = params.set('sort', req.sort);
    }
    if (req?.page) {
      params = params.set('page', req.page.toString());
    }
    if (req?.size) {
      params = params.set('size', req.size.toString());
    }

    return params;
  }
}
