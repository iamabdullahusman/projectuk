import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BaseLayoutComponent } from "src/app/Layout/base-layout/base-layout.component";
import { TeacherComponent } from "./component/teacher/teacher.component";
import { AddTeacherComponent } from "./component/add-teacher/add-teacher.component";
import { ViewTeacherComponent } from "./component/view-teacher/view-teacher.component";
import { DashboardComponent } from "./component/dashboard/dashboard.component";
import { AttendanceComponent } from "./component/attendance/attendance.component";
import { AttendanceFormComponent } from "./component/attendance-form/attendance-form.component";
import { TeacherDetailsComponent } from "./component/teacher-details/teacher-details.component";
import { ProtalDeatilsComponent } from "./component/protal-deatils/protal-deatils.component";
import { PortalTimetableComponent } from "./component/portal-timetable/portal-timetable.component";
import { PortalSubjectComponent } from "./component/portal-subject/portal-subject.component";


const routes: Routes = [
  {
    path: "teacher",
    component: BaseLayoutComponent,
    children: [
      {
        path: "",
        component: TeacherComponent,
      },
      {
        path: "add",
        component: AddTeacherComponent,
      },
      {
        path: "edit/:id",
        component: AddTeacherComponent,
      },
      {
        path: "view/:id",
        component: ViewTeacherComponent,
      },
      {
        path:'dashboard',
        component:DashboardComponent
      },
      {
        path:'attendance',
        component:AttendanceComponent
      },
      {
        path:'attendance/:id',
        component:AttendanceFormComponent
      },
      // {
      //   path: 'deatils',
      //   component:TeacherDetailsComponent
      // },
     {
      path:'deatils',
      component:ProtalDeatilsComponent
     },
     {
      path:'timetable',
      component: PortalTimetableComponent
     },
     {
      path:'subject',
      component: PortalSubjectComponent
     }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeacherRoutingModule {}
