import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from '../../../core/config/application-config.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/clothes/category/search');

  search(search: string): Observable<{ animeThemes: string[]; videogameThemes: string[] }> {
    const url = `${this.resourceUrl}?search=${encodeURIComponent(search)}`;
    return this.http.get<{ animeThemes: string[]; videogameThemes: string[] }>(url).pipe(
      map(response => ({
        animeThemes: response.animeThemes,
        videogameThemes: response.videogameThemes,
      })),
    );
  }
}
