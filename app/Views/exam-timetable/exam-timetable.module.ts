import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamTimetableRoutingModule } from './exam-timetable-routing.module';
import { ExamTimetableComponent } from './component/exam-timetable/exam-timetable.component';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { ExaminationComponent } from './component/examination/examination.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatInputModule } from '@angular/material/input';
import {
  NgxMatDatetimePickerModule, 
  NgxMatNativeDateModule, 
  NgxMatTimepickerModule 
} from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
@NgModule({
  declarations: [
    ExamTimetableComponent,
    ExaminationComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ExamTimetableRoutingModule,
    NgMultiSelectDropDownModule.forRoot(),
    DataTablesModule,
    NgbModule,
    NgSelectModule,
    MatDatepickerModule,
    MatInputModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatSlideToggleModule,
    MatTooltipModule
  ]
})
export class ExamTimetableModule { }
