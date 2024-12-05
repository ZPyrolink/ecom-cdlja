import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IClothe } from '../clothe.model';
import { ClotheService } from '../service/clothe.service';

const clotheResolve = (route: ActivatedRouteSnapshot): Observable<null | IClothe> => {
  const id = route.params.id;
  if (id) {
    return inject(ClotheService)
      .find(id)
      .pipe(
        mergeMap((clothe: HttpResponse<IClothe>) => {
          if (clothe.body) {
            return of(clothe.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default clotheResolve;
