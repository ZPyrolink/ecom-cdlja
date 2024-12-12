import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ApplicationConfigService } from '../../../core/config/application-config.service';
import { Observable } from 'rxjs';
import { createRequestOption } from '../../../core/request/request-util';

@Injectable({ providedIn: 'root' })
export class AnimeService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/clothes/category/anime');

  query(req?: any): Observable<HttpResponse<string[]>> {
    const options = createRequestOption(req);
    return this.http.get<string[]>(this.resourceUrl, { params: options, observe: 'response' });
  }
}
