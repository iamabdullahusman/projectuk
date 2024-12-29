import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import dayjs from "dayjs";
import { forkJoin } from "rxjs";
import { Term } from "src/app/Models/term";
import { Timetable } from "src/app/Models/timetable.model";
import { CustomValidationService } from "src/app/Services/custom-validation.service";
import { TermService } from "src/app/Services/term.service";
import { TimetableService } from "src/app/Services/timetable.service";
import { IntakeService } from "src/app/services/intake.service";
import { ToastrServiceService } from "src/app/services/toastr-service.service";

@Component({
  selector: "app-timetable",
  templateUrl: "./timetable.component.html",
  styleUrls: ["./timetable.component.sass"],
})
export class TimetableComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  modalTitle = "Add Timetable";
  intakes: any = [];
  terms: Array<Term> = [];
  timetables: Array<Timetable> = [];
  timetableForm: FormGroup;
  termStartMonth = "";
  termEndMonth = "";
  minDate = "";
  maxDate = "";
  @ViewChild("timetableModal") timetableModal: ElementRef;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private timetableService: TimetableService,
    private termService: TermService,
    private intakeService: IntakeService,
    private router: Router,
    private customValidation: CustomValidationService,
    private toastr: ToastrServiceService
  ) {
    this.buildForm();
  }

  months: string[] = [];

  get tf() {
    return this.timetableForm.controls;
  }

  ngOnInit(): void {
    this.loadTimetables();
    this.loadData();
  }

  buildForm() {
    this.timetableForm = this.fb.group(
      {
        timeTableId: [0, [Validators.required]],
        intakeId: [null, Validators.required],
        termId: [null, Validators.required],
        year: [null, Validators.required],
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
      },
      {
        validator: this.customValidation.dateRangeValidation(
          "startDate",
          "endDate"
        ),
      }
    );
    this.timetableForm.get("year").disable();
    this.tf["intakeId"].valueChanges.subscribe((res) => {
      const intake = this.intakes.find((m) => m.intakeId === res);
      if (intake) {
        this.timetableForm.get("year").setValue(intake.yearOfStudy);
        const yearSplit = intake.yearOfStudy.split("-");
        this.minDate = dayjs("01-01-" + yearSplit[0]).format("YYYY-MM-DD");
        this.maxDate = dayjs("12-31-" + yearSplit[1]).format("YYYY-MM-DD");
        this.tf["startDate"].setValue("");
        this.tf["endDate"].setValue("");
      }
    });
    this.tf["termId"].valueChanges.subscribe((res) => {
      const term = this.terms.find((m) => m.termId === res);
      if (term) {
        this.termStartMonth = term.startMonth;
        this.termEndMonth = term.endMonth;
      } else {
        this.termStartMonth = "";
        this.termEndMonth = "";
      }
      this.tf["startDate"].updateValueAndValidity();
      this.tf["endDate"].updateValueAndValidity();
    });

    this.tf["startDate"].valueChanges.subscribe((res) => {
      if (!res && !this.termStartMonth) return;
      if (
        dayjs(res).format("MMMM").toLowerCase() !==
        this.termStartMonth.toLowerCase()
      ) {
        this.tf["startDate"].setErrors({ misMatchMonth: true });
      }
    });
    this.tf["endDate"].valueChanges.subscribe((res) => {
      if (!res && !this.termEndMonth) return;
      if (
        dayjs(res).format("MMMM").toLowerCase() !==
        this.termEndMonth.toLowerCase()
      ) {
        this.tf["endDate"].setErrors({ misMatchMonth: true });
        console.log(this.tf["endDate"].valid);
      }
    });
  }

  loadData() {
    this.timetableService.showLoader();
    const payload = {
      index: 0,
      size: 0,
    };
    const intakeApi = this.intakeService.getAllIntake(payload);
    const termApi = this.termService.getAllTerm({
      ...payload,
      orderByDirection: "asc",
      orderBy: "termName",
    });
    forkJoin([intakeApi, termApi]).subscribe(
      (result) => {
        if (result[0]) {
          if (result[0].status) this.intakes = result[0].data.records;
          else this.toastr.ErrorToastr(result[0].message);
        }
        if (result[1]) {
          if (result[1].status) this.terms = result[1].data.records;
          else this.toastr.ErrorToastr(result[1].message);
        }
        this.timetableService.hideLoader();
      },
      (err: any) => this.handleApiError(err)
    );
  }

  loadTimetables() {
    let input = {
      size: 10,
      index: 1,
      search: "",
      orderBy: "",
      orderByDirection: "",
    };
    this.dtOptions = {
      pagingType: "simple_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching: true,
      language: {
        infoFiltered: "",
      },
      ajax: (dataTablesParameters: any, callback) => {
        input.size = dataTablesParameters.length;
        input.index = dataTablesParameters.start / dataTablesParameters.length;
        input.search = dataTablesParameters.search.value;
        input.orderByDirection = dataTablesParameters.order[0].dir;
        input.orderBy =
          dataTablesParameters.columns[
            dataTablesParameters.order[0].column
          ].data;
        input.index++;
        this.timetableService.showLoader();
        this.timetableService.getAllTimetable(input).subscribe(
          (res: any) => {
            if (res.status) this.timetables = res.data.records;
            else this.toastr.ErrorToastr(res.message);
            callback({
              recordsTotal: res.data.totalCounts,
              recordsFiltered: res.data.totalCounts,
              data: [],
            });
            this.timetableService.hideLoader();
          },
          (err: any) => this.handleApiError(err)
        );
      },
      columns: [
        { data: "intake", orderable: true },
        { data: "term", orderable: true },
        { data: "year", orderable: true },
        { data: "startDate", orderable: true },
        { data: "endDate", orderable: true },
        { data: "", orderable: false },
      ],
      autoWidth: false,
    };
  }
  openModal(content: ElementRef, id: number | undefined = undefined) {
    this.resetForm();
    this.modalTitle = "Add timetable";
    this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      backdrop: false,
    });
  }
  saveTimetable() {
    if (this.timetableForm.valid) {
      let payload = this.timetableForm.getRawValue();
      if (!payload.timeTableId || payload.timeTableId === 0) {
        this.timetableService.showLoader();
        payload = {
          ...payload,
          isValid: true,
          isActive: false,
        };
        this.timetableService.createTimetable(payload).subscribe(
          (res) => {
            if (res.status) {
              this.modalService.dismissAll();
              this.toastr.SuccessToastr(res.message);
              $(".table").DataTable().ajax.reload();
            } else this.toastr.ErrorToastr(res.message);
            this.timetableService.hideLoader();
          },
          (err: any) => this.handleApiError(err)
        );
      } else {
        this.timetableService.showLoader();
        this.timetableService.updateTimetable(payload).subscribe(
          (res) => {
            if (res.status) {
              this.modalService.dismissAll();
              $(".table").DataTable().ajax.reload();
              this.toastr.SuccessToastr(res.message);
            } else this.toastr.ErrorToastr(res.message);
            this.timetableService.hideLoader();
          },
          (err: any) => this.handleApiError(err)
        );
      }
    }
  }

  deleteTimetable(id: number) {
    if (confirm("Do you want to delete this timetable?")) {
      this.timetableService.deleteTimetable(id).subscribe(
        (res) => {
          if (res.status) {
            this.modalService.dismissAll();
            $(".table").DataTable().ajax.reload();
            this.toastr.SuccessToastr(res.message);
          } else this.toastr.ErrorToastr(res.message);
          this.timetableService.hideLoader();
        },
        (err: any) => this.handleApiError(err)
      );
    }
  }

  onUpdateClick(id: number) {
    const timetable = this.timetables.find((m) => m.timeTableId === id);
    if (timetable) {
      this.modalTitle = "Update Timetable";
      this.resetForm();
      this.timetableForm.patchValue(timetable);
      this.tf["startDate"].setValue(
        dayjs(timetable.startDate).format("YYYY-MM-DD")
      );
      this.tf["endDate"].setValue(
        dayjs(timetable.endDate).format("YYYY-MM-DD")
      );
      this.modalService.open(this.timetableModal, {
        ariaLabelledBy: "modal-basic-title",
        backdrop: false,
      });
    }
  }

  handleApiError(err: any) {
    if (err.status == 401) {
      this.router.navigate(["/"]);
    } else {
      this.toastr.ErrorToastr("Something went wrong");
    }
    this.timetableService.hideLoader();
  }

  resetForm() {
    this.timetableForm.reset();
    this.timetableForm.get("timeTableId").setValue(0);
  }
}
