import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISubscribedClients } from '../subscribed-clients.model';
import { SubscribedClientsService } from '../service/subscribed-clients.service';

const subscribedClientsResolve = (route: ActivatedRouteSnapshot): Observable<null | ISubscribedClients> => {
  const id = route.params.id;
  if (id) {
    return inject(SubscribedClientsService)
      .find(id)
      .pipe(
        mergeMap((subscribedClients: HttpResponse<ISubscribedClients>) => {
          if (subscribedClients.body) {
            return of(subscribedClients.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default subscribedClientsResolve;
