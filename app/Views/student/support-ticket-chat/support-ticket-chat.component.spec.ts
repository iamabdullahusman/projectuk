import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportTicketChatComponent } from './support-ticket-chat.component';

describe('SupportTicketChatComponent', () => {
  let component: SupportTicketChatComponent;
  let fixture: ComponentFixture<SupportTicketChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportTicketChatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportTicketChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
