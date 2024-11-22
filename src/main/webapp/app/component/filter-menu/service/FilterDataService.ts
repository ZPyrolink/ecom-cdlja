import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterDataService {
  private clothesSubject = new BehaviorSubject<string[]>([]);
  private themesSubject = new BehaviorSubject<string[]>([]);

  setClothes(clothes: string[]): void {
    // eslint-disable-next-line no-console
    console.log(clothes);
    this.clothesSubject.next(clothes);
  }

  getClothes(): Observable<string[]> {
    return this.clothesSubject.asObservable();
  }

  setThemes(themes: string[]): void {
    this.themesSubject.next(themes);
  }

  getThemes(): Observable<string[]> {
    return this.themesSubject.asObservable();
  }
}
