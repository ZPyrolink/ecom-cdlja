import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import SharedModule from 'app/shared/shared.module';
import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';
import ActiveMenuDirective from './active-menu.directive';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../entities/order/service/order.service';
import { FilterDataService } from '../../component/filter-menu/service/FilterDataService';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [RouterModule, SharedModule, HasAnyAuthorityDirective, ActiveMenuDirective, FormsModule],
})
export default class NavbarComponent implements OnInit {
  searchQuery = '';
  isVisible = false;
  orderQuantity = 0;
  @Output() visibilityChange = new EventEmitter<boolean>();

  constructor(
    private serviceOrder: OrderService,
    private filterDataService: FilterDataService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.searchQuery = window.sessionStorage.getItem('search') ?? '';
    this.serviceOrder.query()?.subscribe({
      next: response => {
        if (response.orderLines) {
          for (const line of response.orderLines) {
            if (line.quantity) {
              this.orderQuantity += line.quantity;
            }
          }
        }
      },
    });
  }

  openPanel(): void {
    this.isVisible = !this.isVisible;
    this.visibilityChange.emit(this.isVisible);
  }

  onSearch(): void {
    window.sessionStorage['search'] = this.searchQuery;
    this.filterDataService.setSearchQuery(this.searchQuery);
    if (window.location.pathname !== '') {
      this.router.navigate(['']);
    }
  }
}
