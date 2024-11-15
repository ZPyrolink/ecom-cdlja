import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'jhi-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export default class ProductComponent implements OnInit {
  productId = 0;
  selectedImage = 'https://lh3.googleusercontent.com/d/1QPYJR65rtJeeYaaWoQ7aKVOB8a1BYsu9';
  imageUrls = [
    'https://lh3.googleusercontent.com/d/1QPYJR65rtJeeYaaWoQ7aKVOB8a1BYsu9',
    'https://lh3.googleusercontent.com/d/1i3VRotXQqgZgPKMVLd2O7Gtpw5SOFV0K',
    'https://lh3.googleusercontent.com/d/1lJ5HkOfO89OIBEiFZdPpi4HdScaqCush',
    'https://lh3.googleusercontent.com/d/1i3VRotXQqgZgPKMVLd2O7Gtpw5SOFV0K',
  ];
  productName = 'Product';
  productPrice = 25;
  productDescription = 'This is a product description';
  productSelectedColor = 'red';
  productColors = ['red', 'blue', 'green', 'yellow'];
  productSelectedSize = 'S';
  productSizes = ['S', 'M', 'L', 'XL'];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productId = Number(params.get('id'));
      window.console.log('Product id:', this.productId);
    });
  }

  changeImage(imageUrl: string): void {
    window.console.log('Change image');
    this.selectedImage = imageUrl;
  }

  selectColor(color: string): void {
    this.productSelectedColor = color;
  }

  selectSize(size: string): void {
    this.productSelectedSize = size;
  }

  addToBasket(): void {
    window.console.log('Add to basket');
  }
}
