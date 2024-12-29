import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmissionHeaderComponent } from './addmission-header.component';

describe('AddmissionHeaderComponent', () => {
  let component: AddmissionHeaderComponent;
  let fixture: ComponentFixture<AddmissionHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddmissionHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddmissionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
