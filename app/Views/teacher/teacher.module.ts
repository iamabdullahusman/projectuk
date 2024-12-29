import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TeacherRoutingModule } from "./teacher-routing.module";
import { TeacherComponent } from "./component/teacher/teacher.component";
import { AddTeacherComponent } from "./component/add-teacher/add-teacher.component";
import { ViewTeacherComponent } from "./component/view-teacher/view-teacher.component";
import { DataTablesModule } from "angular-datatables";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { MatTabsModule } from "@angular/material/tabs";
import { TeacherDetailsComponent } from "./component/teacher-details/teacher-details.component";
import { TeacherItemComponent } from "./component/teacher-item/teacher-item.component";
import { NgBootstrapFormValidationModule } from "ng-bootstrap-form-validation";
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { TimetableComponent } from './component/timetable/timetable.component';
import { SubjectComponent } from './component/subject/subject.component';
import { AttendanceComponent } from './component/attendance/attendance.component';
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
import { AttendanceFormComponent } from './component/attendance-form/attendance-form.component';
import { ViewAttendanceComponent } from './component/view-attendance/view-attendance.component';
import { NewsAndAnnouncementModule } from "../news-and-announcement/news-and-announcement.module";

import { ProtalDeatilsComponent } from './component/protal-deatils/protal-deatils.component';
import { PortalTimetableComponent } from './component/portal-timetable/portal-timetable.component';
import { PortalSubjectComponent } from './component/portal-subject/portal-subject.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TeacherRoutingModule,
    DataTablesModule,
    NgSelectModule,
    MatTabsModule,
    NgBootstrapFormValidationModule.forRoot(),
    NgxDaterangepickerMd.forRoot(),
    NewsAndAnnouncementModule
  ],
  declarations: [
    TeacherComponent,
    AddTeacherComponent,
    ViewTeacherComponent,
    TeacherDetailsComponent,
    TeacherItemComponent,
    DashboardComponent,
    TimetableComponent,
    SubjectComponent,
    AttendanceComponent,
    AttendanceFormComponent,
    ViewAttendanceComponent,
    ProtalDeatilsComponent,
    PortalTimetableComponent,
    PortalSubjectComponent,
  ],
  exports: [],
})
export class TeacherModule {}
