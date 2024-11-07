import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrerMenuComponent } from './filtrer-menu.component';

describe('FiltrerMenuComponent', () => {
  let component: FiltrerMenuComponent;
  let fixture: ComponentFixture<FiltrerMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrerMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FiltrerMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
