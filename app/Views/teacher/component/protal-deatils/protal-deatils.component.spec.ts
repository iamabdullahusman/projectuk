import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtalDeatilsComponent } from './protal-deatils.component';

describe('ProtalDeatilsComponent', () => {
  let component: ProtalDeatilsComponent;
  let fixture: ComponentFixture<ProtalDeatilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProtalDeatilsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtalDeatilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
