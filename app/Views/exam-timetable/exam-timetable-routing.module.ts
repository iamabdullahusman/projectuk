import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamTimetableComponent } from './component/exam-timetable/exam-timetable.component';
import { BaseLayoutComponent } from 'src/app/Layout/base-layout/base-layout.component';
import { ExaminationComponent } from './component/examination/examination.component';

const routes: Routes = [
  {
    path: "exam-timetable",
    component: BaseLayoutComponent,
    children: [
      {
        path: "",
        component: ExamTimetableComponent
      },
      {
        path: ":id",
        component: ExaminationComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamTimetableRoutingModule { }
