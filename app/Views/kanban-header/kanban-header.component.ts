import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-kanban-header",
  templateUrl: "./kanban-header.component.html",
  styleUrls: ["./kanban-header.component.sass"],
})
export class KanbanHeaderComponent {
  @Input() titleHeader = "";
  @Input() headerClass = "";
  @Input() total = 0;
  @Input() newCount = 0;
  @Input() tooltip = "";
  @Input() newTextClass="";
}
