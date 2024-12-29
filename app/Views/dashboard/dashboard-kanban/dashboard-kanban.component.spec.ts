import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardKanbanComponent } from './dashboard-kanban.component';

describe('DashboardKanbanComponent', () => {
  let component: DashboardKanbanComponent;
  let fixture: ComponentFixture<DashboardKanbanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardKanbanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardKanbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
