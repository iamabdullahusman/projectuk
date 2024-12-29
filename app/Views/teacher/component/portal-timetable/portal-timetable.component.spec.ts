import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalTimetableComponent } from './portal-timetable.component';

describe('PortalTimetableComponent', () => {
  let component: PortalTimetableComponent;
  let fixture: ComponentFixture<PortalTimetableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortalTimetableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
