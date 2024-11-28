import { ComponentFixture, TestBed } from '@angular/core/testing';

import ListingProductComponent from './listing-product.component';

describe('ListingProductComponent', () => {
  let component: ListingProductComponent;
  let fixture: ComponentFixture<ListingProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingProductComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListingProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
