import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardKanbanHeaderComponent } from './dashboard-kanban-header.component';

describe('DashboardKanbanHeaderComponent', () => {
  let component: DashboardKanbanHeaderComponent;
  let fixture: ComponentFixture<DashboardKanbanHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardKanbanHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardKanbanHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
