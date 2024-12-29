import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardCardComponent } from './onboard-card.component';

describe('OnboardCardComponent', () => {
  let component: OnboardCardComponent;
  let fixture: ComponentFixture<OnboardCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
