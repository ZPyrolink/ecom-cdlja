import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { SubscribedClientsDetailComponent } from './subscribed-clients-detail.component';

describe('SubscribedClients Management Detail Component', () => {
  let comp: SubscribedClientsDetailComponent;
  let fixture: ComponentFixture<SubscribedClientsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscribedClientsDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./subscribed-clients-detail.component').then(m => m.SubscribedClientsDetailComponent),
              resolve: { subscribedClients: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(SubscribedClientsDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribedClientsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load subscribedClients on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', SubscribedClientsDetailComponent);

      // THEN
      expect(instance.subscribedClients()).toEqual(expect.objectContaining({ id: 123 }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
