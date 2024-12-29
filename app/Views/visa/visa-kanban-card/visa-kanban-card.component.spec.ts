import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaKanbanCardComponent } from './visa-kanban-card.component';

describe('VisaKanbanCardComponent', () => {
  let component: VisaKanbanCardComponent;
  let fixture: ComponentFixture<VisaKanbanCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisaKanbanCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisaKanbanCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
