import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type ClientWhithAdminDTO = {
  subscribedClient: {
    address: string;
    phoneNumber: string;
  };
  adminUserDTO: {
    firstName: string;
    lastName: string;
    email: string;
  };
  panier: {
    amount: number;
  };
};

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);

  getClient(): Observable<ClientWhithAdminDTO> {
    return this.http.get<ClientWhithAdminDTO>('api/client');
  }
}
