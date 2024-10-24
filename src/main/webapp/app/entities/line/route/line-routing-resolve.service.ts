import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILine } from '../line.model';
import { LineService } from '../service/line.service';

const lineResolve = (route: ActivatedRouteSnapshot): Observable<null | ILine> => {
  const id = route.params.id;
  if (id) {
    return inject(LineService)
      .find(id)
      .pipe(
        mergeMap((line: HttpResponse<ILine>) => {
          if (line.body) {
            return of(line.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default lineResolve;
