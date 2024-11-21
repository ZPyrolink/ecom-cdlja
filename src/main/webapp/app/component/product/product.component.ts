import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ColorEnum } from '../../enums/color-enum';
import { ColorItemComponent } from '../color-item/color-item.component';
import { SizeItemComponent } from '../size-item/size-item.component';
import { SizeEnum } from '../../enums/size-enum';

@Component({
  selector: 'jhi-product',
  standalone: true,
  imports: [CommonModule, ColorItemComponent, SizeItemComponent, NgOptimizedImage],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export default class ProductComponent implements OnInit {
  productId = 0;
  selectedImage = 'https://ecom-cdlja-pictures.s3.eu-north-1.amazonaws.com/ecom1.jpeg';
  imageUrls = [
    'https://ecom-cdlja-pictures.s3.eu-north-1.amazonaws.com/ecom1.jpeg',
    'https://ecom-cdlja-pictures.s3.eu-north-1.amazonaws.com/ecom2.jpeg',
    'https://ecom-cdlja-pictures.s3.eu-north-1.amazonaws.com/ecom3.jpeg',
    'https://ecom-cdlja-pictures.s3.eu-north-1.amazonaws.com/ecom4.jpeg',
  ];
  productName = 'Product';
  productPrice = 25;
  productDescription = 'This is a product description';
  productSelectedColor = '';
  productColors = [ColorEnum.Beige, ColorEnum.Noir, ColorEnum.Blanc, ColorEnum.Bleu];
  productSelectedSize: SizeEnum | undefined = undefined;
  productSizes = [SizeEnum.S, SizeEnum.M, SizeEnum.L, SizeEnum.XL];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productId = Number(params.get('id'));
      window.console.log('Product id:', this.productId);
    });
  }

  addToBasket(): void {
    window.console.log('Add to basket');
  }

  changeImage(imageUrl: string): void {
    window.console.log('Change image');
    this.selectedImage = imageUrl;
  }

  isColorSelected(color: string): boolean {
    return this.productSelectedColor === color;
  }

  isSizeSelected(size: SizeEnum): boolean {
    return this.productSelectedSize === size;
  }

  selectColor(selectedColor: string): void {
    this.productSelectedColor = selectedColor;
  }

  selectSize(selectedSize: SizeEnum): void {
    this.productSelectedSize = selectedSize;
  }
}
