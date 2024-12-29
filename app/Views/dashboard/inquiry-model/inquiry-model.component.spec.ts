import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryModelComponent } from './inquiry-model.component';

describe('InquiryModelComponent', () => {
  let component: InquiryModelComponent;
  let fixture: ComponentFixture<InquiryModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InquiryModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InquiryModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
