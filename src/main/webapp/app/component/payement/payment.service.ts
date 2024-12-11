import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewOrder } from '../../entities/order/order.model';
import { MeansOfPayment } from '../../entities/enumerations/means-of-payment.model';

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

export type PaymentDTO =
  | {
      cardNum: string;
      month: number;
      year: number;
      crypto: string;
      basket?: NewOrder;
      meanOfPayement: Exclude<MeansOfPayment, MeansOfPayment.ONLINEPAYMENT>;
    }
  | {
      meanOfPayement: MeansOfPayment.ONLINEPAYMENT;
    };

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);

  getClient(): Observable<ClientWhithAdminDTO> {
    return this.http.get<ClientWhithAdminDTO>('api/client');
  }

  pay(data: PaymentDTO): Observable<string> {
    const headers: HttpHeaders = new HttpHeaders({ 'Accept-Type': 'text/plain' });

    return this.http.post('api/basket/pay', data, { headers, responseType: 'text' });
  }
}
