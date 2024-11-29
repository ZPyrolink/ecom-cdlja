import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IUser } from '../user.model';
import { IConnectionRequest } from '../../connection-request/connection-request.model';
import { ISigninRequest } from '../../signin-request/signin-request.model';
import { TokenResult } from '../../../component/login/login.component';
import { tap } from 'rxjs/operators';

export type EntityResponseType = HttpResponse<IUser>;
export type EntityArrayResponseType = HttpResponse<IUser[]>;

@Injectable({ providedIn: 'root' })
export class UserService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api');

  login(payload: IConnectionRequest): Observable<TokenResult> {
    return this.http.post<TokenResult>(`${this.resourceUrl}/authenticate`, payload).pipe(
      tap((res: TokenResult) => {
        window.sessionStorage['id_storage'] = res.id_token; // Stocker le token comme effet secondaire
      }),
    );
  }

  register(payload: ISigninRequest): Observable<TokenResult> {
    return this.http.post<TokenResult>(`${this.resourceUrl}/client/signin`, payload);
  }
}
