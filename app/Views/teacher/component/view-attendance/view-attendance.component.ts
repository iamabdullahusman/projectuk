import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import { Router } from "@angular/router";
import { AttendanceSheet } from "src/app/Models/attendance-sheet.model";
import { AttendanceStudent } from "src/app/Models/attendance-student.model";
import { TimetableService } from "src/app/Services/timetable.service";
import { ToastrServiceService } from "src/app/services/toastr-service.service";

@Component({
  selector: "app-view-attendance",
  templateUrl: "./view-attendance.component.html",
  styleUrls: ["./view-attendance.component.sass"],
})
export class ViewAttendanceComponent implements OnChanges {
  @Input() attendanceSheetId = 0;
  @Output() closeView = new EventEmitter<void>();

  presentStudents: Array<AttendanceStudent> = [];
  absenceStudents: Array<AttendanceStudent> = [];
  attendance: AttendanceSheet;
  attendanceInPercentage = "";
  constructor(
    private toast: ToastrServiceService,
    private router: Router,
    private timetableService: TimetableService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["attendanceSheetId"]) {
      this.loadAttendance();
    }
  }

  loadAttendance() {
    const payload = {
      attendanceSheetId: this.attendanceSheetId,
      index: 0,
      size: 0,
    };
    this.timetableService
      .GetAttendanceManagementByAttendanceSheetId(payload)
      .subscribe(
        (res) => {
          if (res.status) {
            this.presentStudents = (
              res.data.records as Array<AttendanceStudent>
            ).filter(
              (m) =>
                m.attendanceType?.toLowerCase() === "p" ||
                m.attendanceType?.toLowerCase() === "l"
            );
            this.absenceStudents = (
              res.data.records as Array<AttendanceStudent>
            ).filter(
              (m) =>
                m.attendanceType?.toLowerCase() === "a" ||
                m.attendanceType?.toLowerCase() === "e"
            );
            const totalAttendance = res.data.records.length;
            const attendanceInPR =
              (this.presentStudents.length / totalAttendance) * 100;
            this.attendanceInPercentage = attendanceInPR + "%";
            if (res.data.records.length > 0)
              this.attendance = res.data.records[0].attendanceSheet;
          } else this.toast.ErrorToastr(res.message);
        },
        (err: any) => this.handleApiError(err)
      );
  }

  handleApiError(err: any) {
    if (err.status == 401) {
      this.router.navigate(["/"]);
    } else {
      this.toast.ErrorToastr("Something went wrong");
    }
    this.timetableService.hideLoader();
  }

  close() {
    this.closeView.next();
  }
}
