import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-visa-kanban-card",
  templateUrl: "./visa-kanban-card.component.html",
  styleUrls: ["./visa-kanban-card.component.sass"],
})
export class VisaKanbanCardComponent {
  @Input() newLabelClass = "";
  @Input() cardClass = "";
  @Input() application: any;
  @Input() displayDateLabel='';
}
