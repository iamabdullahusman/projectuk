import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailtemplatestypemasterComponent } from './emailtemplatestypemaster.component';

describe('EmailtemplatestypemasterComponent', () => {
  let component: EmailtemplatestypemasterComponent;
  let fixture: ComponentFixture<EmailtemplatestypemasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailtemplatestypemasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailtemplatestypemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
