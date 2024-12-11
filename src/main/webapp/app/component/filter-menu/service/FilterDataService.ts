import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Color } from '../../../entities/enumerations/color.model';

@Injectable({
  providedIn: 'root',
})
export class FilterDataService {
  private clothesSubject = new BehaviorSubject<string[]>([]);
  private themesSubject = new BehaviorSubject<string[]>([]);
  private searchQuerySubject = new BehaviorSubject<string>('');
  private sizeSubject = new BehaviorSubject<string[]>([]);
  private colorSubject = new BehaviorSubject<string[]>([]);
  private genderSubject = new BehaviorSubject<string[]>([]);
  private priceSubject = new BehaviorSubject<{ min: number; max: number }>({ min: 0, max: 100 });
  private sortSubject = new BehaviorSubject<string>('asc');

  setClothes(clothes: string[]): void {
    this.clothesSubject.next(clothes);
    window.console.log('clothe type', clothes);
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

  setSearchQuery(query: string): void {
    this.searchQuerySubject.next(query);
  }

  getSearchQuery(): Observable<string> {
    return this.searchQuerySubject.asObservable();
  }

  setSize(size: string[]): void {
    this.sizeSubject.next(size);
  }

  getSize(): Observable<string[]> {
    return this.sizeSubject.asObservable();
  }

  setColor(color: Color[]): void {
    this.colorSubject.next(color);
  }

  getColor(): Observable<string[]> {
    return this.colorSubject.asObservable();
  }

  setGender(gender: string[]): void {
    this.genderSubject.next(gender);
  }

  getGender(): Observable<string[]> {
    return this.genderSubject.asObservable();
  }

  setPrice(price: { min: number; max: number }): void {
    this.priceSubject.next(price);
  }

  getPrice(): Observable<{ min: number; max: number }> {
    return this.priceSubject.asObservable();
  }

  setSort(sort: string): void {
    this.sortSubject.next(sort);
  }

  getSort(): Observable<string> {
    return this.sortSubject.asObservable();
  }

  getFiltered(): { filters: Record<string, any>; search: string; sort: string } {
    const filters = {
      size: this.sizeSubject.getValue(),
      couleur: this.convertToEnumKeysColor(this.colorSubject.getValue()),
      price: this.priceSubject.getValue(),
      gender: this.convertToEnumKeysGender(this.genderSubject.getValue()),
      theme: this.themesSubject.getValue(),
      type: this.convertToEnumKeys(this.clothesSubject.getValue()),
    };

    const search = this.searchQuerySubject.getValue();
    const sort = this.sortSubject.getValue();

    return { filters, search, sort };
  }

  convertToEnumKeys(clothes: string[]): string[] {
    return clothes.map(clothe => {
      switch (clothe) {
        case 'Jogging':
          return 'JOGGER';
        case 'Tee-shirt':
          return 'TEESHIRT';
        case 'Brassière':
          return 'BRA';
        case 'Legging':
          return 'LEGGING';
        case 'Short':
          return 'SHORT';
        case 'Pull':
          return 'SWEAT';
        default:
          return '';
      }
    });
  }

  convertToEnumKeysColor(colors: string[]): string[] {
    return colors.map(color => {
      switch (color) {
        case 'Vert':
          return 'GREEN';
        case 'Noir':
          return 'BLACK';
        case 'Bleu':
          return 'BLUE';
        case 'Rouge':
          return 'RED';
        case 'Rose':
          return 'PINK';
        case 'Beige':
          return 'BEIGE';
        case 'Blanc':
          return 'WHITE';
        case 'Orange':
          return 'ORANGE';
        case 'Marron':
          return 'BROWN';
        case 'Gris':
          return 'GRAY';
        case 'Jaune':
          return 'YELLOW';
        case 'Violet':
          return 'PURPLE';
        default:
          return '';
      }
    });
  }

  convertToEnumKeysGender(genders: string[]): string[] {
    return genders.map(gender => {
      switch (gender) {
        case 'Homme':
          return 'MAN';
        case 'Femme':
          return 'WOMAN';
        case 'Unisex':
          return 'UNISEX';
        case 'Enfant':
          return 'CHILD';
        default:
          return '';
      }
    });
  }
}
