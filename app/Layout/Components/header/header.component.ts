import { Component, HostBinding, OnInit } from "@angular/core";
import { select } from "@angular-redux/store";
import { empty, Observable } from "rxjs";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { ThemeOptions } from "../../../theme-options";
import { SessionStorageService } from "src/app/services/session-storage.service";
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit {
  public isShowSearch: any;
  faEllipsisV = faEllipsisV;
  search: string = "";
  constructor(
    public globals: ThemeOptions,
    private localService: SessionStorageService
  ) {}

  ngOnInit(): void {}

  @HostBinding("class.isActive")
  get isActiveAsGetter() {
    return this.isActive;
  }

  isActive: boolean;

  @select("config") public config$: Observable<any>;

  toggleSidebarMobile() {
    this.globals.toggleSidebarMobile = !this.globals.toggleSidebarMobile;
  }

  toggleHeaderMobile() {
    this.globals.toggleHeaderMobile = !this.globals.toggleHeaderMobile;
  }

  get userType() {
    return this.localService.getUserType();
  }
}
