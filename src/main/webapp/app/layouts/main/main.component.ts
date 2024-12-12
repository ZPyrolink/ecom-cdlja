import { Component, inject, OnInit, Renderer2, RendererFactory2 } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import dayjs from 'dayjs/esm';

import { AccountService } from 'app/core/auth/account.service';
import { AppPageTitleStrategy } from 'app/app-page-title-strategy';
import PageRibbonComponent from '../profiles/page-ribbon.component';
import FooterComponent from '../footer/footer.component';
import NavbarComponent from '../navbar/navbar.component';
import FilterMenuComponent from '../../component/filter-menu/filtrer-menu.component';
import { NgClass, NgIf } from '@angular/common';
import ArrowComponent from '../../component/arrow/arrow.component';

@Component({
  standalone: true,
  selector: 'jhi-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  providers: [AppPageTitleStrategy],
  imports: [RouterOutlet, FooterComponent, NavbarComponent, PageRibbonComponent, FilterMenuComponent, NgIf, ArrowComponent, NgClass],
})
export default class MainComponent implements OnInit {
  isVisible = false;
  private renderer: Renderer2;

  private router = inject(Router);
  private appPageTitleStrategy = inject(AppPageTitleStrategy);
  private accountService = inject(AccountService);
  private translateService = inject(TranslateService);
  private rootRenderer = inject(RendererFactory2);

  constructor() {
    this.renderer = this.rootRenderer.createRenderer(document.querySelector('html'), null);
  }

  ngOnInit(): void {
    this.accountService.identity().subscribe();

    this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
      this.appPageTitleStrategy.updateTitle(this.router.routerState.snapshot);
      dayjs.locale(langChangeEvent.lang);
      this.renderer.setAttribute(document.querySelector('html'), 'lang', langChangeEvent.lang);
    });
  }

  onVisibilityChange(visible: boolean): void {
    this.isVisible = visible;
  }
}
