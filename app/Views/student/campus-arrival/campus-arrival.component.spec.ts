import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusArrivalComponent } from './campus-arrival.component';

describe('CampusArrivalComponent', () => {
  let component: CampusArrivalComponent;
  let fixture: ComponentFixture<CampusArrivalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampusArrivalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampusArrivalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
