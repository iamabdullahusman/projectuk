import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalSubjectComponent } from './portal-subject.component';

describe('PortalSubjectComponent', () => {
  let component: PortalSubjectComponent;
  let fixture: ComponentFixture<PortalSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortalSubjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
