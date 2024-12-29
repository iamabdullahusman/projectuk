import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Intake } from 'src/app/models/intake.model';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { EmittService } from 'src/app/Services/emitt.service';
import { IntakeService } from 'src/app/services/intake.service';
import { ToastrServiceService } from 'src/app/services/toastr-service.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, } from '@angular/material/core';
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: 'app-intake',
  templateUrl: './intake.component.html',
  styleUrls: ['./intake.component.sass'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class IntakeComponent implements OnInit {
  // @ViewChild('dp1') datePicker: MatDatepicker<Date>;
  isSubmitted: boolean = false;
  modalTitle = 'Add Intake';
  dtOptions: DataTables.Settings = {};
  intakeForm: FormGroup = new FormGroup({
    intakeDate: new FormControl(),
    intakeId: new FormControl(),
    startDate: new FormControl(),
    endDate: new FormControl(),
    startYear: new FormControl(moment()),
    endYear: new FormControl(moment())
  });

  minEndYear = moment().add(1, "years");
  intakes: Array<Intake> = [];
  intake?: Intake;
  IntakeMonthData = [];
  constructor(private modalService: NgbModal, private intakeService: IntakeService, private formBuilder: FormBuilder, private router: Router, private alerts: AlertServiceService, private toastr: ToastrServiceService, private emittService: EmittService) {
    this.intakeForm = formBuilder.group({
      intakeDate: [null, Validators.required],
      intakeId: ['0'],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      startYear: [moment(), Validators.required],
      endYear: [moment().add(1, "years"), Validators.required]
    })

    // yearOfStudy: ['', [Validators.required, Validators.pattern("(?:[0-9]{4})-(?:[0-9]{4})")]]
    emittService.onChangeAddApplicationbtnHideShow(false);
    this.IntakeMonthData.push({
      name: "January"
    });
    this.IntakeMonthData.push({
      name: "September"
    });
  }

  ngOnInit(): void {
    this.loadIntake();
  }


  MinStartDate = (new Date()).getFullYear() + "-01-01";
  MaxStartDate = ((new Date()).getFullYear()) + "-12-31";
  MinEndDate = ((new Date()).getFullYear() + 1) + "-01-01";
  MaxEndDate = ((new Date()).getFullYear() + 1) + "-12-31";

  // changeendyear(){
  //   var endyear = this.f['endYear'].value.year();
  //   this.MaxEndDate = endyear + "-12-31";
  //   this.MinEndDate = endyear + "-01-01";
  // }

  // changestartyear(){
  //   var startyear = this.f['startYear'].value.year();
  //   this.MinStartDate = startyear + "-01-01";
  //   this.MaxStartDate = startyear + "-12-31";
  // }

  get f() {
    return this.intakeForm.controls;
  }

  // closeDP(datepicker: MatDatepicker<Moment>) {
  //   setTimeout(() => {
  //     alert("Called");
  //     datepicker.close()
  //   }, 500)
  // }

  closeDP() {
    location.reload();
  }

  loadIntake() {
    $('#loader').show();

    let input = {
      size: 10,
      index: 1,
      Search: '',
      OrderByDirection: '',
      sortingColumn: 0,
      OrderBy: ''
    }

    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching: true,
      language: {
        infoFiltered: ""
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.intakes = [];
        input.size = dataTablesParameters.length;
        input.index = dataTablesParameters.start / dataTablesParameters.length;
        input.index++;
        input.Search = dataTablesParameters.search.value;
        input.OrderByDirection = dataTablesParameters.order[0].dir;
        input.sortingColumn = dataTablesParameters.order[0].column;
        input.OrderBy = dataTablesParameters.columns[input.sortingColumn].data;
        this.intakeService.getAllIntake(input).subscribe(res => {

          if (res.status) {
            this.intakes = res.data.records;
          }
          else {
            this.toastr.ErrorToastr("Something went wrong");
          }

          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: []
          });
          $('#loader').hide();
        }, (err: any) => {
          $('#loader').hide();
          if (err.status == 401) {
            this.router.navigate(['/'])
          }
          else {
            this.toastr.ErrorToastr("Something went wrong");
          }
        });
      },
      columns: [{ data: '', orderable: true }, { data: 'intakeName', orderable: true }, { data: 'startDate', orderable: true }, { data: 'endDate', orderable: true }],
      autoWidth: false
    }
  }
  openModal(content: any, id: any = 0) {
    this.intakeForm.reset(this.intakeForm.value);
    if (id > 0) {
      this.modalTitle = "Update Intake";
      this.GetIntake(id);
    }
    else {
      this.modalTitle = "Add Intake";
      this.resetIntakeForm();
    }

    this.isSubmitted = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: false });
  }

  GetIntake(id: any) {
    this.intake = this.intakes.find(m => m.intakeId == id);
    this.intakeForm.get('intakeDate')?.setValue(this.intake?.intakeName);
    this.intakeForm.get('startDate')?.setValue(moment(this.intake?.startDate).format("YYYY-MM-DD"));
    this.intakeForm.get('endDate')?.setValue(moment(this.intake?.endDate).format("YYYY-MM-DD"));
    this.intakeForm.get('intakeId')?.setValue(this.intake?.intakeId);
    var year = this.intake?.yearOfStudy.split("-");
    var start = moment();
    start.year(year[0]);
    this.intakeForm.get('startYear')?.setValue(start);
    var end = moment();
    end.year(year[1]);
    this.intakeForm.get('endYear')?.setValue(end);
  }

  setStartYear(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    var ctrlValue = this.f['startYear'].value!;
    ctrlValue.year(normalizedYear.year());
    this.f['startYear'].setValue(ctrlValue);
    this.f['endYear'].setValue(moment(ctrlValue).add(1, "years"));
    this.minEndYear = moment(ctrlValue).add(1, "years");
    this.f['endYear'].addValidators([Validators.min(ctrlValue._d)]);
    this.f['endYear'].updateValueAndValidity();
    datepicker.close();
    var startyear = this.f['startYear'].value.year();
    this.MinStartDate = startyear + "-01-01";
    this.MaxStartDate = startyear + "-12-31";
    var endyear = this.f['endYear'].value.year();
    this.MaxEndDate = endyear + "-12-31";
    this.MinEndDate = endyear + "-01-01";
  }

  setEndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    var ctrlValue = this.f['endYear'].value!;
    // ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.f['endYear'].setValue(ctrlValue);
    datepicker.close();
    var endyear = this.f['endYear'].value.year();
    this.MaxEndDate = endyear + "-12-31";
    this.MinEndDate = endyear + "-01-01";
  }

  resetIntakeForm() {
    this.intakeForm.get('intakeDate')?.setValue(null);
    this.intakeForm.get('intakeId')?.setValue('0');
    this.intakeForm.get('startDate')?.setValue('');
    this.intakeForm.get('endDate')?.setValue('');
    this.intakeForm.get('startYear')?.setValue(moment());
    this.intakeForm.get('endYear')?.setValue(moment().add(1, "years"));
  }

  SaveIntake() {
    this.isSubmitted = true;
    if (this.intakeForm.valid) {
      $('#loader').show();
      var formVal = {
        intakeId: this.f['intakeId'].value,
        intakeDate: this.f['intakeDate'].value,
        startDate: this.f['startDate'].value,
        endDate: this.f['endDate'].value,
        yearOfStudy: this.f['startYear'].value.year() + '-' + this.f['endYear'].value.year(),
      }
      // var formVal = JSON.parse(JSON.stringify(this.intakeForm.getRawValue()));

      formVal.intakeId = parseInt(formVal.intakeId);
      this.intakeService.saveIntake(formVal).subscribe(res => {

        if (res.status) {
          this.modalService.dismissAll();
          if (res.data.intakeId == 0)
            this.toastr.SuccessToastr("Intake added successfully.");
          else
            this.toastr.SuccessToastr("Intake updated successfully.");
          $(".table").DataTable().ajax.reload();
        }
        else {
          this.toastr.ErrorToastr(res.message);
        }
        $('#loader').hide();
      }, (err: any) => {
        $('#loader').hide();
        this.toastr.ErrorToastr("Something missing");
      })
    }
  }

  deleteIntake(id: any) {
    // this.alerts.ComfirmAlert("Do you want to delete Intake?", "Yes", "No").then(res => {
    this.alerts.ComfirmAlert("Do you want to delete Intake?" + "<br>" + "<p style='font-size:20px'>If you delete this intake, all the student of the intake will be removed?</p>", "Yes", "No").then(res => {
      if (res.isConfirmed) {
        $('#loader').show();
        let deleteInput = {
          id: id
        };
        this.intakeService.deleteIntake(deleteInput).subscribe(res => {

          if (res.status) {
            this.toastr.SuccessToastr("Intake deleted successfully.");
            $(".table").DataTable().ajax.reload();
          }
          else {
            this.toastr.ErrorToastr(res.message);
          }
          $('#loader').hide();
        },
          (err: any) => {
            $('#loader').hide();
            if (err.status == 401) {
              this.router.navigate(['/']);
            }
            else {
              this.toastr.ErrorToastr("Something went wrong");
            }
          })
      }
    })
  }

  StartDate: any;
  StartDateOnChange() {
    this.StartDate = moment(this.f['startDate'].value).format("YYYY-MM-DD");
  }
}
