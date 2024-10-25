import { Component } from '@angular/core';
import SharedModule from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'jhi-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  imports: [SharedModule, RouterModule, NgOptimizedImage],
})
export default class FooterComponent {}
