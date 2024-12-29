import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasComponent } from './cas.component';

describe('CasComponent', () => {
  let component: CasComponent;
  let fixture: ComponentFixture<CasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
