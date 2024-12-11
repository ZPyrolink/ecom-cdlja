import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { IStock } from '../../entities/stock/stock.model';
import { StockService } from '../../entities/stock/service/stock.service';
import { ClotheService } from '../../entities/clothe/service/clothe.service';
import { Color } from '../../entities/enumerations/color.model';
import { getSizeLabelFromSize, Size } from '../../entities/enumerations/size.model';
import { IClothe } from '../../entities/clothe/clothe.model';
import { OrderService } from '../../entities/order/service/order.service';
import { OrderStateService } from '../../service/OrderStateService';

@Component({
  selector: 'jhi-product',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export default class ProductComponent implements OnInit {
  stock: IStock | null | undefined;
  productId = 0;
  product: IClothe | undefined | null;

  selectedImage = 'https://ecom-cdlja-pictures.s3.eu-north-1.amazonaws.com/ecom1.jpeg';
  imageUrls: string[] = [];

  productName = '';
  productSelectedColor: Color = Color.BLACK;
  productColors: Color[] = [];
  productColorsEnum: { name: string; image: string }[] = [];
  productSelectedSize: Size = Size.M;
  productSizes: Size[] = [];

  protected readonly getSizeLabelFromSize = getSizeLabelFromSize;

  private baseUrl = 'https://ecom-cdlja-pictures.s3.eu-north-1.amazonaws.com';
  private baseFileName = 'Image_';
  private imageIndex = 1;

  constructor(
    private route: ActivatedRoute,
    private stockService: StockService,
    private clotheService: ClotheService,
    private orderService: OrderService,
    private orderState: OrderStateService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productId = Number(params.get('id'));

      this.clotheService.find(this.productId).subscribe({
        next: productResponse => {
          this.product = productResponse.body;
          this.selectColor(this.product?.imageP?.split('/')[4] as string);
          this.productName = (this.product?.theme ?? '') + ' ' + (this.product?.type ?? '');
        },
        error: error => console.error('Erreur lors de la récupération du produit:', error),
      });

      this.clotheService.getColorsOf(this.productId).subscribe({
        next: colorsResponse => {
          this.productColors = colorsResponse.body ?? [];
          this.productColors = this.mapToColorEnumValues(this.productColors);
          window.console.log('All colors : ', this.productColors);
          this.updateColorEnum();
          this.updateSizes();
        },
        error: error => console.error('Erreur lors de la récupération des couleurs:', error),
      });
    });
  }

  // Fonction utilitaire pour mettre à jour les tailles et le stock selon la couleur sélectionnée
  updateSizes(): void {
    this.clotheService.getSizesByColor(this.productId, this.getKeyColorFromValue(this.productSelectedColor)).subscribe({
      next: sizesResponse => {
        this.productSizes = sizesResponse.body ?? [];
        this.productSizes = this.mapToSizeEnumValues(this.productSizes);

        if (this.productSizes.length > 0) {
          // Initialiser `productSelectedSize` avec la taille médiane
          const medianIndex = Math.floor((this.productSizes.length - 1) / 2);
          this.productSelectedSize = this.productSizes[medianIndex];
        }

        window.console.log('Size enum mis à jour:', this.productSizes);
        this.updateStock();
      },
      error(error) {
        console.error('Erreur lors de la récupération des tailles:', error);
      },
    });
  }

  updateStock(): void {
    this.stockService
      .getStockByColorAndSize(
        this.productId,
        this.getKeyColorFromValue(this.productSelectedColor),
        this.getKeySizeFromValue(this.productSelectedSize),
      )
      .subscribe({
        next: stockResponse => {
          this.stock = stockResponse.body;
          this.productName = (this.stock?.clotheDTO?.theme ?? '') + ' ' + (this.stock?.clotheDTO?.type ?? '');
        },
        error(error) {
          console.error('Erreur lors de la récupération du stock:', error);
        },
      });
  }

  changeImage(imageUrl: string): void {
    window.console.log('Change image');
    this.selectedImage = imageUrl;
  }

  isColorSelected(color: string): boolean {
    return this.productSelectedColor === (color as Color);
  }

  isSizeSelected(size: Size): boolean {
    return this.productSelectedSize === size;
  }

  selectColor(selectedColor: string): void {
    this.productSelectedColor = selectedColor as Color;
    this.imageUrls = [];
    this.imageIndex = 1;
    this.loadImages();
    this.updateSizes();
  }

  loadImages(): void {
    const tempImageUrl = this.getImageUrl(this.imageIndex);
    window.console.log('Image Url:', tempImageUrl);
    const img = new Image();
    img.src = tempImageUrl;

    img.onload = () => {
      this.imageUrls.push(tempImageUrl);
      this.imageIndex++;
      this.loadImages();
      if (this.imageIndex === 2) {
        this.changeImage(this.imageUrls[0]);
      }
    };

    img.onerror = () => {
      window.console.log(`No more images found after index ${this.imageIndex - 1}`);
    };
  }

  getImageUrl(index: number): string {
    return `${this.baseUrl}/${this.product!.id}/${this.productSelectedColor}/${this.baseFileName}${index}.png`;
  }

  selectSize(selectedSize: Size): void {
    this.productSelectedSize = selectedSize;
  }

  mapToColorEnumValues(input: string[]): Color[] {
    return input.map(key => Color[key as keyof typeof Color]);
  }

  mapToSizeEnumValues(input: string[]): Size[] {
    return input.map(key => Size[key as keyof typeof Size]);
  }

  getKeyColorFromValue(value: string): keyof typeof Color | undefined {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    const entry = Object.entries(Color).find(([key, val]) => val === value);
    return entry ? (entry[0] as keyof typeof Color) : undefined;
  }

  getKeySizeFromValue(value: string): keyof typeof Size | undefined {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    const entry = Object.entries(Size).find(([key, val]) => val === value);
    return entry ? (entry[0] as keyof typeof Size) : undefined;
  }

  updateColorEnum(): void {
    this.productColorsEnum = this.productColors.map(color => ({
      name: color,
      image: `../../../content/images/colors/${color}.png`,
    }));
    window.console.log('Color enum mis à jour:', this.productColorsEnum);
  }

  addToBasket(): void {
    this.updateStock();
    if (this.stock) {
      window.console.log('stockkkkkkkkkkk', this.stock);
      this.orderService.add(this.stock)?.subscribe();
      this.orderState.incrementOrderQuantity(1);
    }
  }
}
