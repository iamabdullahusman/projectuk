import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseLayoutComponent } from 'src/app/Layout/base-layout/base-layout.component';
import { TimetableComponent } from './component/timetable/timetable.component';
import { SlotComponent } from './component/slot/slot.component';

const routes: Routes = [
  {
    path: "timetable",
    component: BaseLayoutComponent,
    children: [
      {
        path: "",
        component: TimetableComponent,
      },
      {
        path: "slot/:id",
        component: SlotComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimetableRoutingModule { }
