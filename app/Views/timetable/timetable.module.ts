import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimetableRoutingModule } from './timetable-routing.module';
import { TimetableComponent } from './component/timetable/timetable.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { NgSelectModule } from '@ng-select/ng-select';
import { SlotComponent } from './component/slot/slot.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    TimetableComponent,
    SlotComponent,

  ],
  imports: [
    CommonModule,
    TimetableRoutingModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgBootstrapFormValidationModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    NgSelectModule,
    MatSlideToggleModule,
    MatTooltipModule
  ]
})
export class TimetableModule { }
