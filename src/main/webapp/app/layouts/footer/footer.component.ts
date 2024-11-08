import { Component } from '@angular/core';
import SharedModule from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { TranslateDirective } from 'app/shared/language';

@Component({
  selector: 'jhi-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  imports: [SharedModule, RouterModule, NgOptimizedImage, TranslateDirective],
})
export default class FooterComponent {}
