import { Component, Input } from "@angular/core";

@Component({
  selector: "app-kanban-card",
  templateUrl: "./kanban-card.component.html",
  styleUrls: ["./kanban-card.component.sass"],
})
export class KanbanCardComponent {
  @Input() application: any;
  @Input() displayDateLabel = "";
  @Input() isShowStage = false;
  @Input() cardClass = "";
  @Input() newTextClass = "";
  @Input() isShowFooter = false;
  @Input() footerClass = "";
  @Input() isArchive =false;
  @Input() footerText= "";
  @Input() pendingWaitingDoc = 0;
  @Input() isDraggable = true;
}
