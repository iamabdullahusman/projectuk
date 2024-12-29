import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirrportArrivalComponent } from './airrport-arrival.component';

describe('AirrportArrivalComponent', () => {
  let component: AirrportArrivalComponent;
  let fixture: ComponentFixture<AirrportArrivalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AirrportArrivalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AirrportArrivalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
