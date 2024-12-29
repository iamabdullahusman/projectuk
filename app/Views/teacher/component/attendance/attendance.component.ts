import {
  AfterContentChecked,
  AfterContentInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import dayjs from "dayjs";
import moment from "moment";
import { AttendanceSheet } from "src/app/Models/attendance-sheet.model";
import { SubjectManage } from "src/app/Models/subject-manage.model";
import { DatetimeService } from "src/app/Services/datetime.service";
import { SubjectService } from "src/app/Services/subject.service";
import { TimetableService } from "src/app/Services/timetable.service";
import { SessionStorageService } from "src/app/services/session-storage.service";
import { ToastrServiceService } from "src/app/services/toastr-service.service";
@Component({
  selector: "app-attendance",
  templateUrl: "./attendance.component.html",
  styleUrls: ["./attendance.component.sass"],
})
export class AttendanceComponent
  implements OnInit, OnChanges, AfterContentChecked
{
  @Input() teacherId = 0;
  @Input() readonly = false;
  @Input() nestedView = false;
  filterForm: FormGroup;
  attendanceSheets: Array<AttendanceSheet> = [];
  dtOptions: DataTables.Settings = {};
  timetableSlotId = 0;
  subjectList: Array<SubjectManage> = [];
  selectedSubject?: number = undefined;
  selectedAttendanceId?: number = undefined;
  isPageLoaded = false;
  selectDate?: { startDate: Date; endDate: Date } | undefined = undefined;
  isEditable: { [key: number]: boolean } = {};
  input = {
    size: 10,
    index: 1,
    startDate: undefined,
    endDate: undefined,
    subjectId: undefined,
    teacherId: this.teacherId,
  };
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private timetableService: TimetableService,
    private subjectService: SubjectService,
    private toast: ToastrServiceService,
    private activeRoute: ActivatedRoute,
    private sessionStorage: SessionStorageService,
    private datetimeService:DatetimeService
  ) {
    this.activeRoute.queryParams.subscribe((params) => {
      console.log("queryParams",params);
      if (params["subjectId"]) {
        this.selectedSubject = parseInt(params["subjectId"]);
      }
      if (params["day"]) {
        const weekDays = moment.weekdays();
        const weekNumber = weekDays.findIndex(
          (m) => m.toLocaleLowerCase() === params["day"].toLocaleLowerCase()
        );
        this.selectDate = {
          startDate: dayjs().startOf("week").set("day", weekNumber).toDate(),
          endDate: dayjs().startOf("week").set("day", weekNumber).toDate(),
        };
      }
    });
    this.buildForm();
  }
  ngAfterContentChecked(): void {
    if (
      this.selectedSubject &&
      this.subjectList.length > 0 &&
      !this.isPageLoaded
    ) {
      this.isPageLoaded = true;
      setTimeout(() => {
        this.filterForm.get("subject").setValue(this.selectedSubject);
      }, 500);
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["teacherId"]) {
      this.input.teacherId = this.teacherId;
    }
  }

  ngOnInit(): void {
    this.loadAttendanceSheet();
    this.loadSubject();
  }
  
  loadSubject() {
    const payload = {
      index: 0,
      size: 0,
    };
    this.input = {
      ...this.input
    };
    console.log("loadSubject",this.input);
    // this.subjectService.getAllSubjectManagement(payload).subscribe(
    this.timetableService.GetAllTimeTableSlotByTeacherId(this.input).subscribe(
      (res) => {
        console.log("GetAllTimeTableSlotByTeacherId",res);
        if (res.status) {
          this.subjectList = res.data.records.map(record => record.subjectManagement);
          console.log("res.data.records",res.data.records);
          console.log("this.subjectList",this.subjectList);
           if (this.selectedSubject)
             this.filterForm.get("subject").setValue(this.selectedSubject);
        } else this.toast.ErrorToastr(res.message);
      },
      (err: any) => this.handleApiError(err)
    );
  }

  loadAttendanceSheet() {
    const filter = this.filterForm.getRawValue();
    this.input = {
      ...this.input,
      startDate: this.datetimeService.setWriteOffset(dayjs(filter.dates.startDate).toDate()),
      endDate: this.datetimeService.setWriteOffset(dayjs(filter.dates.endDate).toDate()),
      subjectId: filter.subject,
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
        this.input.size = dataTablesParameters.length;
        this.input.index =
          dataTablesParameters.start / dataTablesParameters.length;
        this.input.index++;
        this.timetableService.showLoader();
        this.timetableService
          .GetAttendanceSheetByTeacherId(this.input)
          .subscribe(
            (res: any) => {
              console.log("loadAttendanceSheet",res);
              if (res.status) {
                this.attendanceSheets = res.data.records;
                this.setEditAttendance();
              } else this.toast.ErrorToastr(res.message);
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
        { data: "", orderable: false },
        { data: "", orderable: false },
        { data: "", orderable: false },
      ],
      autoWidth: false,
    };
  }

  buildForm() {
    this.filterForm = this.fb.group({
      dates: [null, Validators.required],
      subject: [null, Validators.required],
    });
    if (!this.selectDate)
      this.filterForm.get("dates").setValue({
        startDate: dayjs().startOf("week"),
        endDate: dayjs().startOf("week").add(6, "days"),
      });
    else this.filterForm.get("dates").setValue(this.selectDate);
    this.filterForm.valueChanges.subscribe((res) => {
      console.log("buildForm",res);
      if (res.subject) {
        this.input = {
          ...this.input,
          startDate: this.datetimeService.setWriteOffset(dayjs(res.dates.startDate).toDate()),
          endDate: this.datetimeService.setWriteOffset(dayjs(res.dates.endDate).toDate()),
          subjectId: res.subject,
        };
        $(".table").DataTable().ajax.reload();
      }
    });
  }
  handleApiError(err: any) {
    if (err.status == 401) {
      this.router.navigate(["/"]);
    } else {
      this.toast.ErrorToastr("Something went wrong");
    }
    this.timetableService.hideLoader();
  }

  attendanceView(id: number) {
    this.selectedAttendanceId = id;
  }
  onCloseAttendanceView() {
    this.selectedAttendanceId = undefined;
  }

  setEditAttendance() {
    const isTeacher = this.sessionStorage.getUserType() === "8";
    this.attendanceSheets.forEach((attendance) => {
      if (!this.isEditable[attendance.attendanceSheetId]) {
        this.isEditable[attendance.attendanceSheetId] = isTeacher
          ? dayjs().startOf("date").isBefore(attendance.startDateTime)
          : true;
      }
    });
  }
}
