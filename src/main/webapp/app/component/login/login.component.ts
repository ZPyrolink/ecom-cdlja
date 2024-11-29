import { AfterViewInit, Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../core/auth/account.service';
import { Router } from '@angular/router';
import SharedModule from '../../shared/shared.module';
import { UserService } from '../../entities/user/service/user.service';
import { ISigninRequest } from '../../entities/signin-request/signin-request.model';
import { NewSubscribedClients } from '../../entities/subscribed-clients/subscribed-clients.model';
import { NewUser } from '../../admin/user-management/user-management.model';
import { IConnectionRequest } from '../../entities/connection-request/connection-request.model';
import { switchMap } from 'rxjs';

export type TokenResult = { id_token: string };

@Component({
  selector: 'jhi-login',
  standalone: true,
  imports: [ReactiveFormsModule, SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export default class LoginComponent implements OnInit, AfterViewInit {
  username = viewChild.required<ElementRef>('username');

  authenticationError = signal(false);

  loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
    rememberMe: new FormControl(false, { nonNullable: true }),
  });

  subscribeForm = new FormGroup({
    managedUser: new FormGroup({
      login: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
      email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
      firstName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)] }),
      lastName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)] }),
      langKey: new FormControl('en', { nonNullable: true }),
    }),
    subscribedClient: new FormGroup({
      country: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      city: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      phoneNumber: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)] }),
      address: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    }),
  });

  private accountService = inject(AccountService);
  private userService = inject(UserService);
  private router = inject(Router);

  ngOnInit(): void {
    // if already authenticated then navigate to home page
    this.accountService.identity().subscribe(() => {
      if (this.accountService.isAuthenticated()) {
        this.router.navigate(['']);
      }
    });
  }

  ngAfterViewInit(): void {
    this.username().nativeElement.focus();
  }

  login(): void {
    if (this.loginForm.invalid) {
      alert('Veuillez remplir les champs correctement.');
      return;
    }

    const loginPayload = this.loginForm.getRawValue();

    this.userService.login(loginPayload).subscribe({
      next: () => {
        this.authenticationError.set(false);
        if (!this.router.getCurrentNavigation()) {
          // There were no routing during login (eg from navigationToStoredUrl)
          this.router.navigate(['']);
        }
      },
      error: () => {
        this.authenticationError.set(true);
        alert('Email ou mot de passe incorrect.');
      },
    });
  }

  register(): void {
    if (this.subscribeForm.invalid) {
      const errors = Object.keys(this.subscribeForm.controls)
        .filter(key => this.subscribeForm.get(key)!.invalid)
        .join(', ');
      alert(`Les champs suivants sont invalides : ${errors}`);
      return;
    }

    // Récupérer les valeurs des deux formulaires et les combiner
    const managedUser: NewUser = {
      id: null,
      login: this.subscribeForm.value.managedUser!.login,
      email: this.subscribeForm.value.managedUser!.email,
      password: this.subscribeForm.value.managedUser!.password,
      firstName: this.subscribeForm.value.managedUser!.firstName,
      lastName: this.subscribeForm.value.managedUser!.lastName,
      langKey: this.subscribeForm.value.managedUser!.langKey,
    };

    const subscribedClient: NewSubscribedClients = {
      id: null,
      email: this.subscribeForm.value.managedUser!.email,
      phoneNumber: this.subscribeForm.value.subscribedClient!.phoneNumber,
      address: `${this.subscribeForm.value.subscribedClient!.address}, ${this.subscribeForm.value.subscribedClient!.city}, ${this.subscribeForm.value.subscribedClient!.country}`,
    };

    const payload: ISigninRequest = { managedUser, subscribedClient };

    this.userService
      .register(payload)
      .pipe(
        switchMap(() => {
          const loginPayload: IConnectionRequest = {
            username: this.subscribeForm.value.managedUser!.login,
            password: this.subscribeForm.value.managedUser!.password,
            rememberMe: false,
          };

          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return this.userService.login(loginPayload);
        }),
      )
      .subscribe({
        next: () => {
          this.authenticationError.set(false);
          alert('Inscription réussie !');
          if (!this.router.getCurrentNavigation()) {
            // There were no routing during login (eg from navigationToStoredUrl)
            this.router.navigate(['']);
          }
        },
        error: () => {
          this.authenticationError.set(true);
          alert('Erreur lors de la connexion');
        },
      });
  }
}
