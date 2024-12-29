import { select } from '@angular-redux/store';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Observable } from 'rxjs';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { ThemeOptions } from 'src/app/theme-options';

@Component({
  selector: 'app-teacher-sidebar',
  templateUrl: './teacher-sidebar.component.html',
  styleUrls: ['./teacher-sidebar.component.sass']
})
export class TeacherSidebarComponent implements OnInit {
  public extraParameter: any;
  userType: any = '';
  constructor(public globals: ThemeOptions, private activatedRoute: ActivatedRoute) {

  }

  @select('config') public config$: Observable<any>;

  public config: PerfectScrollbarConfigInterface = {};
//  activeId = 'dashboards';


  ngOnInit() {
    this.extraParameter = this.activatedRoute.snapshot.firstChild.routeConfig.path;
  }

}
