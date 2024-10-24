import { AfterViewInit, Component, OnInit } from '@angular/core';
import SharedModule from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'jhi-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [SharedModule, RouterModule],
})
export default class HeaderComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
