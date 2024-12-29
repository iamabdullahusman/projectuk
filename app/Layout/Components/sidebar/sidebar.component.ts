import { Component, HostListener, OnInit } from "@angular/core";
import { ThemeOptions } from "../../../theme-options";
import { select } from "@angular-redux/store";
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { SessionStorageService } from "src/app/services/session-storage.service";
import { IntakeService } from "src/app/services/intake.service";
import { Intake } from "src/app/models/intake.model";

import { environment } from "src/environments/environment";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
})
export class SidebarComponent implements OnInit {
  public extraParameter: any;
  userType: any = "";
  constructor(
    public globals: ThemeOptions,
    private activatedRoute: ActivatedRoute,
    private sessionStorage: SessionStorageService,
    private intakeService: IntakeService
  ) {}

  @select("config") public config$: Observable<any>;

  public config: PerfectScrollbarConfigInterface = {};
  private newInnerWidth: number;

  private AdminAndSettings: boolean;

  private innerWidth: number;
  activeId = "dashboards";
  intakes: Array<Intake> = [];
  toggleSidebar() {
    this.globals.toggleSidebar = !this.globals.toggleSidebar;
    this.globals.sidebarHover = !this.globals.toggleSidebar;
  }

  sidebarHover() {
    this.globals.sidebarHover = !this.globals.sidebarHover;
  }

  sidebarHoverMouseOut() {
    this.globals.sidebarHover = false;
  }

  sidebarHoverMouseIn() {
    this.globals.sidebarHover = true;
  }

  ngOnInit() {
    setTimeout(() => {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth < 1200) {
        this.globals.toggleSidebar = true;
      }
    });

    this.AdminAndSettings = environment.admin_settings;
    this.extraParameter =
      this.activatedRoute.snapshot.firstChild.routeConfig.path;
    this.GetSession();
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.newInnerWidth = event.target.innerWidth;

    if (this.newInnerWidth < 1200) {
      this.globals.toggleSidebar = true;
    } else {
      this.globals.toggleSidebar = false;
    }
  }

  GetSession(): any {
    this.userType = this.sessionStorage.getUserType();
  }

  // loadIntake(){
  //   input=
  // }
}
