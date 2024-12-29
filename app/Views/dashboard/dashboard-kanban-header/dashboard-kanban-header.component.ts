import { Component, Input } from "@angular/core";
import { DashboardStatus } from "../dashboard-status";

@Component({
  selector: "app-dashboard-kanban-header",
  templateUrl: "./dashboard-kanban-header.component.html",
  styleUrls: ["./dashboard-kanban-header.component.sass"],
})
export class DashboardKanbanHeaderComponent {
  @Input() routeLink = "";
  @Input() mainClass = "";
  @Input() stageName = "";
  @Input() applicationCount = 0;
  @Input() statuses: Array<DashboardStatus> = [];
  @Input() linkClass = "";
  @Input() icon = "";
  @Input() newTextClass = "";
  @Input() newCount = 0;
  @Input() queryParams: string | undefined = undefined;
}
