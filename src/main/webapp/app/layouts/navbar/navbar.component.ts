import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import SharedModule from 'app/shared/shared.module';
import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';
import ActiveMenuDirective from './active-menu.directive';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [RouterModule, SharedModule, HasAnyAuthorityDirective, ActiveMenuDirective, FormsModule],
})
export default class NavbarComponent {
  searchQuery = '';

  onSearch(): void {
    // eslint-disable-next-line no-console
    console.log('Recherche :', this.searchQuery);
    // TODO envoyer la requete au back
  }
}
