import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferDocumentComponent } from './offer-document.component';

describe('OfferDocumentComponent', () => {
  let component: OfferDocumentComponent;
  let fixture: ComponentFixture<OfferDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
