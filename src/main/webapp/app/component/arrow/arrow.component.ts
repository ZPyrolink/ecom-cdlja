import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location, NgIf } from '@angular/common';

@Component({
  selector: 'jhi-arrow',
  standalone: true,
  imports: [NgIf],
  templateUrl: './arrow.component.html',
  styleUrl: './arrow.component.scss',
})
export default class ArrowComponent {
  isHomePage = false;
  constructor(
    private location: Location,
    private router: Router,
  ) {
    // TODO changer la route de listing product
    this.router.events.subscribe(() => {
      this.isHomePage = this.router.url === '';
    });
  }
  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['']);
    }
  }
}
