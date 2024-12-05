import { TestBed } from '@angular/core/testing';
import ListingProductComponent from './listing-product.component';
import { HttpClientModule } from '@angular/common/http';
import { ClotheService } from '../../entities/clothe/service/clothe.service';

describe('ListingProductComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule, // Import du HttpClientModule pour le service HTTP
        ListingProductComponent, // Ajout du composant standalone ici
      ],
      providers: [ClotheService], // Fournir votre service si nécessaire
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ListingProductComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
