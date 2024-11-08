jest.mock('app/core/auth/account.service');

import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { Router, TitleStrategy } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Component, NgZone } from '@angular/core';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { AccountService } from 'app/core/auth/account.service';

import { AppPageTitleStrategy } from 'app/app-page-title-strategy';
import MainComponent from './main.component';

describe('MainComponent', () => {
  let fixture: ComponentFixture<MainComponent>;
  let mockAccountService: AccountService;
  let ngZone: NgZone;
  let router: Router;
  let document: Document;

  const navigateByUrlFn = (url: string) => () => router.navigateByUrl(url);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), MainComponent],
      providers: [Title, AccountService, { provide: TitleStrategy, useClass: AppPageTitleStrategy }],
    })
      .overrideTemplate(MainComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    mockAccountService = TestBed.inject(AccountService);
    mockAccountService.identity = jest.fn(() => of(null));
    mockAccountService.getAuthenticationState = jest.fn(() => of(null));
    ngZone = TestBed.inject(NgZone);
    router = TestBed.inject(Router);
    document = TestBed.inject(DOCUMENT);
  });

  describe('page title', () => {
    const defaultPageTitle = 'global.title';

    describe('navigation end', () => {
      it('should set page title to default title if pageTitle is missing on routes', fakeAsync(() => {
        // WHEN
        ngZone.run(navigateByUrlFn(''));
        tick();

        // THEN
        expect(document.title).toBe(defaultPageTitle);
      }));
    });
  });
});

@Component({ template: '' })
export class BlankComponent {}
