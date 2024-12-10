import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
  private videogameSubject = new BehaviorSubject<string[]>([]);
  private animeSubject = new BehaviorSubject<string[]>([]);

  setClothes(clothes: string[]): void {
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

  setColor(color: string[]): void {
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

  setVideogame(videogame: string[]): void {
    this.videogameSubject.next(videogame);
  }

  getVideogame(): Observable<string[]> {
    return this.videogameSubject.asObservable();
  }

  setAnime(anime: string[]): void {
    this.animeSubject.next(anime);
  }

  getAnime(): Observable<string[]> {
    return this.animeSubject.asObservable();
  }
}
