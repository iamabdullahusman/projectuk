import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectManagementComponent } from './subject-management.component';

describe('SubjectManagementComponent', () => {
  let component: SubjectManagementComponent;
  let fixture: ComponentFixture<SubjectManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubjectManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
