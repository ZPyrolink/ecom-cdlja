import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { LANGUAGES } from 'app/config/language.constants';
import { IUser } from '../user-management.model';
import { UserManagementService } from '../service/user-management.service';

const userTemplate = {} as IUser;

const newUser: IUser = {
  langKey: 'en',
  activated: true,
} as IUser;

@Component({
  standalone: true,
  selector: 'jhi-user-mgmt-update',
  templateUrl: './user-management-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export default class UserManagementUpdateComponent implements OnInit {
  languages = LANGUAGES;
  authorities = signal<string[]>([]);
  isSaving = signal(false);

  fb = inject(FormBuilder);

  editForm = this.fb.group({
    id: [userTemplate.id],
    login: [
      userTemplate.login,
      [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$'),
      ],
    ],
    email: [userTemplate.email, [Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    password: [userTemplate.password, [Validators.minLength(4), Validators.maxLength(254)]],
    firstName: [userTemplate.firstName, [Validators.maxLength(50)]],
    lastName: [userTemplate.lastName, [Validators.maxLength(50)]],
    langKey: [userTemplate.langKey],
    activated: [userTemplate.activated],
    authorities: [userTemplate.authorities ?? []],
  });

  private userService = inject(UserManagementService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.data.subscribe(({ user }) => {
      if (user) {
        this.editForm.reset(user);
      } else {
        this.editForm.reset(newUser);
      }
    });
    this.userService.authorities().subscribe(authorities => this.authorities.set(authorities));
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const formValue = this.editForm.getRawValue();
    const user: IUser = {
      id: formValue.id,
      login: formValue.login ?? undefined,
      email: formValue.email ?? undefined,
      password: formValue.password ?? undefined,
      firstName: formValue.firstName ?? null,
      lastName: formValue.lastName ?? null,
      langKey: formValue.langKey!,
      activated: formValue.activated!,
      authorities: formValue.authorities ?? [],
    };
    if (user.id !== null) {
      this.userService.update(user).subscribe({
        next: () => this.onSaveSuccess(),
        error: () => this.onSaveError(),
      });
    } else {
      this.userService.create(user).subscribe({
        next: () => this.onSaveSuccess(),
        error: () => this.onSaveError(),
      });
    }
  }

  private onSaveSuccess(): void {
    this.isSaving.set(false);
    this.previousState();
  }

  private onSaveError(): void {
    this.isSaving.set(false);
  }
}
