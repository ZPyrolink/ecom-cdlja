import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IUser } from '../user.model';
import { IConnectionRequest } from '../../connection-request/connection-request.model';
import { ISigninRequest } from '../../signin-request/signin-request.model';

export type EntityResponseType = HttpResponse<IUser>;
export type EntityArrayResponseType = HttpResponse<IUser[]>;

@Injectable({ providedIn: 'root' })
export class UserService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('client');

  login(payload: IConnectionRequest): Observable<string> {
    window.console.log(payload);
    return this.http.post<string>(`${this.resourceUrl}/login`, payload);
  }

  register(payload: ISigninRequest): Observable<string> {
    window.console.log(payload);
    return this.http.post<string>(`${this.resourceUrl}/register`, payload);
  }
}
