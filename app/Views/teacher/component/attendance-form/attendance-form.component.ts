import { Component, Input } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TimetableService } from "src/app/Services/timetable.service";
import { ToastrServiceService } from "src/app/services/toastr-service.service";
import { Location } from '@angular/common';
@Component({
  selector: "app-attendance-form",
  templateUrl: "./attendance-form.component.html",
  styleUrls: ["./attendance-form.component.sass"],
})
export class AttendanceFormComponent {
  @Input() attendanceId: number;
  dtOptions: DataTables.Settings = {};
  pageTitle = "";
  endDate: Date;
  startDate: Date;
  attendanceForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private activeRouter: ActivatedRoute,
    private timetableService: TimetableService,
    private toast: ToastrServiceService,
    private router: Router,
    private location:Location
  ) {
    this.buildForm();
    activeRouter.params.subscribe((param) => {
      if (param["id"]) {
        this.attendanceId = parseInt(param["id"]);
        this.loadAttendanceManagements();
      }
    });
  }
  loadAttendanceManagements() {
    let input = {
      index: 0,
      size: 10,
      attendanceSheetId: 0,
    };
    this.dtOptions = {
      pagingType: "simple_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching: false,
      ordering: false,
      language: {
        infoFiltered: "",
      },
      ajax: (dataTablesParameters: any, callback) => {
        input.size = dataTablesParameters.length;
        input.index = dataTablesParameters.start / dataTablesParameters.length;
        input.index++;
        input.attendanceSheetId = this.attendanceId;
        this.timetableService
          .GetAttendanceManagementByAttendanceSheetId(input)
          .subscribe(
            (res) => {
              if (res.status) {
                if (res.data.records.length > 0) {
                  this.startDate =
                    res.data.records[0].attendanceSheet.startDateTime;
                  this.endDate =
                    res.data.records[0].attendanceSheet.endDateTime;
                  this.pageTitle =
                    res.data.records[0].attendanceSheet.subject.fullSubjectName;
                }
                (<FormArray>this.attendanceForm.get("attendances")).clear();
                let i = 0;
                res.data.records.forEach((element) => {
                  this.attendanceControls.push(this.addAttendance());
                  if (element.attendanceType === "p") {
                    this.attendanceControls[i].get("comment").disable();
                  }
                  this.attendanceControls[i].patchValue({
                    studentName:
                      element.studentSlotManagement.userMaster.fullName,
                    attendanceManagementId: element.attendanceManagementId,
                    attendanceType: element.attendanceType,
                    comment: element.comment,
                    attendanceSheetId: element.attendanceSheetId,
                    studentSlotManagementId: element.studentSlotManagementId,
                  });
                  i++;
                });
                callback({
                  recordsTotal: res.data.totalCounts,
                  recordsFiltered: res.data.totalCounts,
                  data: [],
                });
              } else this.toast.ErrorToastr(res.message);
            },
            (err: any) => this.handleApiError(err)
          );
      },
      columns: [
        { data: "", orderable: false },
        { data: "", orderable: false },
        { data: "", orderable: false },
      ],
      autoWidth: false,
    };
  }

  buildForm() {
    this.attendanceForm = this.fb.group({
      attendances: new FormArray([]),
    });
  }

  get attendanceControls() {
    return (<FormArray>this.attendanceForm.get("attendances")).controls;
  }

  addAttendance() {
    return this.fb.group({
      attendanceManagementId: [0],
      studentSlotManagementId: [0],
      attendanceSheetId: [0],
      studentName: [""],
      attendanceType: [null, [Validators.required]],
      comment: [""],
    });
  }

  onAttendanceChange(event: any, i: number) {
    if (event.target.value === "p") {
      this.attendanceControls[i].get("comment").disable();
      this.attendanceControls[i].get("comment").setValue("");
      this.attendanceControls[i].get("comment").removeValidators(null);
      this.attendanceControls[i].get("comment").updateValueAndValidity();
    } else {
      this.attendanceControls[i].get("comment").enable();
      this.attendanceControls[i]
        .get("comment")
        .addValidators([Validators.required]);
      this.attendanceControls[i].get("comment").updateValueAndValidity();
    }
  }

  onSubmit(showMessage =false) {
    if (this.isAttendannceFormValid) {
      this.timetableService.showLoader();
      const payload = this.attendanceForm.getRawValue();
      this.timetableService
        .UpdateAttendanceManagementByAttendanceSheetId(payload.attendances)
        .subscribe(
          (res) => {
            if (res.status) this.toast.SuccessToastr(res.message);
            else this.toast.ErrorToastr(res.message);
            this.timetableService.hideLoader();
          },
          (err: any) => this.handleApiError(err)
        );
    }
  }

  get isAttendannceFormValid(){
    let isValid=true;
    if(!this.attendanceForm.valid)
      return false;
    this.attendanceControls.forEach(m=>{
      if(!m.valid){
        isValid= false;
        return
      }
    })
    return isValid;
  }

  handleApiError(err: any) {
    if (err.status == 401) {
      this.router.navigate(["/"]);
    } else {
      this.toast.ErrorToastr("Something went wrong");
    }
    this.timetableService.hideLoader();
  }

  onBack(){
    this.location.back();
  }
}
