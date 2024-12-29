import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import moment from "moment";
import { forkJoin } from "rxjs";
import { ApplicationService } from "src/app/services/application.service";
import { CampusService } from "src/app/services/campus.service";
import { SessionStorageService } from "src/app/services/session-storage.service";
import { ToastrServiceService } from "src/app/services/toastr-service.service";

@Component({
  selector: "app-campus-arrival",
  templateUrl: "./campus-arrival.component.html",
  styleUrls: ["./campus-arrival.component.sass"],
})
export class CampusArrivalComponent implements OnInit {
  CampusArrivalform: FormGroup = new FormGroup({
    contentId: new FormControl(),
    campusId: new FormControl(),
    arrivalDate: new FormControl(),
    arrivalTime: new FormControl(),
    statusId: new FormControl(),
    updatedBy: new FormControl(),
  });
  history: any;
  SetDate = moment().format("YYYY-MM-DD");
  userType: any;
  studentName: any;
  permissionMessageImage = false;
  historydata: any;
  latestCampus: any;
  applicationdata: any;
  campusRequest: any;
  campusAccept: any;
  campusReject: any;
  constructor(
    private sessionStorage: SessionStorageService,
    private formBuilder: FormBuilder,
    private CampusServices: CampusService,
    private toastr: ToastrServiceService,
    private applicationService: ApplicationService
  ) {
    this.CampusArrivalform = formBuilder.group({
      contentId: [""],
      campusId: [1],
      arrivalDate: ["", [Validators.required, this.dateValidator]],
      arrivalTime: ["", Validators.required],
      statusId: [0],
      updatedBy: [""],
    });
  }

  contentId: any;
  ApplicationId: any;
  UserId: any;
  user: any;
  ngOnInit(): void {
    this.CampusArrivalform.get("statusId").setValue(3);
    this.loadform();
  }
  get f() {
    return this.CampusArrivalform.controls;
  }

  dateValidator(control: AbstractControl): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the current date's time to midnight

    const isDateValid = selectedDate > today;
    return isDateValid ? null : { invalidDate: control.value };
  }

  GetSession(): any {
    this.ApplicationId = this.sessionStorage.getUserApplicationId();
    this.UserId = this.sessionStorage.GetSessionForApplicationname();
    this.CampusArrivalform.get("contentId").setValue(this.ApplicationId);
  }

  Accept() {
    $("#loader").show();
    var input = {
      historyId: this.latestCampus.historyId,
      contentId: this.applicationdata.applicationId,
      statusId: 4,
    };
    this.CampusServices.addCampusArrivaldata(input).subscribe(
      (res) => {
        if (res.status) {
          this.toastr.SuccessToastr("Accept Successfully");
          this.loadform();
        } else {
          this.toastr.ErrorToastr(res.message);
        }
        $("#loader").hide();
      },
      (err: any) => {
        $("#loader").hide();
        this.toastr.ErrorToastr("Something went wrong");
      }
    );
  }
  SaveCampusArival() {
    if (this.CampusArrivalform.valid) {
      $("#loader").show();

      this.GetSession();
      var input = JSON.parse(
        JSON.stringify(this.CampusArrivalform.getRawValue())
      );
      input.campusId = this.applicationdata.campusData.campusId;
      this.CampusServices.addCampusArrivaldata(input).subscribe(
        (res) => {
          if (res.status) {
            if (res.data.statusId == 3) {
              this.toastr.SuccessToastr("Campus Request Sent Successfully");
            } else {
              this.toastr.SuccessToastr("Campus ReSchedule Successfully");
            }
            this.loadform();
          } else {
            this.toastr.ErrorToastr(res.message);
          }
          $("#loader").hide();
        },
        (err: any) => {
          $("#loader").hide();
          this.toastr.ErrorToastr("Something went wrong");
        }
      );
    }
  }
  reject() {
    $("#loader").show();
    this.GetSession();
    var input = {
      historyId: this.latestCampus.historyId,
      contentId: this.applicationdata.applicationId,
      statusId: 5,
    };
    this.CampusServices.addCampusArrivaldata(input).subscribe(
      (res) => {
        if (res.status) {
          this.loadform();
          this.toastr.SuccessToastr("Rejected SuccessFully");
        } else {
          this.toastr.ErrorToastr(res.message);
        }
        $("#loader").hide();
      },
      (err: any) => {
        this.toastr.ErrorToastr("Something went wrong");
        $("#loader").hide();
      }
    );
  }

  reschedule() {
    $("#loader").show();
    if (
      this.latestCampus.campusStatus == 6 ||
      this.latestCampus.campusStatus == 3
    ) {
      this.CampusArrivalform.get("arrivalDate")?.setValue(
        moment(this.latestCampus?.lastUpdate).format("YYYY-MM-DD")
      );
      this.CampusArrivalform.get("arrivalTime")?.setValue(
        moment(this.latestCampus?.lastUpdate).format("HH:mm")
      );
      this.CampusArrivalform.get("contentId")?.setValue(
        this.applicationdata?.applicationId
      );
      this.CampusArrivalform.get("statusId")?.setValue(6);
    }
    $("#loader").hide();
  }
  GetLatestDate(Data: any) {
    var filteredData: any = [];

    if (Data.find((x) => x.campusStatus == 3)) {
      for (let i = 0; i < Data.length; i++) {
        if (Data[i].campusStatus == 3) {
          filteredData.push(Data[i]);
        }
      }
    } else {
      for (let i = 0; i < Data.length; i++) {
        if (
          Data[i].campusStatus == 4 ||
          Data[i].campusStatus == 6 ||
          Data[i].campusStatus == 5
        ) {
          filteredData.push(Data[i]);
        }
      }
    }
    if (filteredData.length) {
      return filteredData.reduce((m, v, i) =>
        v.updatedDate > m.updatedDate && i ? v : m
      );
    }
  }

  loadform() {
    $("#loader").show();
    this.GetSession();
    this.user = this.UserId;
    var input = {
      applicationId: 0,
    };
    this.userType = parseInt(this.sessionStorage.getUserType());
    if (this.userType > 5) {
      input.applicationId = parseInt(
        this.sessionStorage.getUserApplicationId()
      );
      this.studentName = this.sessionStorage.GetSessionForApplicationname();
      var userPermission = this.sessionStorage.getpermission();
      if (userPermission == "true") {
        let history = this.CampusServices.getCampusHistory(input);
        let application = this.applicationService.getApplication(input);
        forkJoin([history, application]).subscribe((result) => {
          if (result[0]) {
            if (result[0].status) {
              this.historydata = result[0].data;

              if (this.historydata.length > 0) {
                this.latestCampus = this.historydata[0];
              }
              console.log(this.latestCampus);
              this.campusRequest = result[0].data.find(
                (m) => m.campusStatus == 3
              );
              this.campusAccept = result[0].data.find(
                (m) => m.campusStatus == 4
              );
              this.campusReject = result[0].data.find(
                (m) => m.campusStatus == 5
              );
            } else {
              $("#loader").hide();
              this.toastr.ErrorToastr(result[0].message);
            }
          }
          if (result[1]) {
            if (result[1].status) {
              this.applicationdata = result[1].data;
            } else {
              $("#loader").hide();
              this.toastr.ErrorToastr(result[1].message);
            }
          }
          $("#loader").hide();
        });
      } else {
        this.permissionMessageImage = true;
        $("#loader").hide();
      }
    } else {
      let history = this.CampusServices.getCampusHistory(input);
      let application = this.applicationService.getApplication(input);
      forkJoin([history, application]).subscribe((result) => {
        if (result[0]) {
          if (result[0].status) {
            this.historydata = result[0].data;

            if (this.historydata.length > 0) {
              this.latestCampus = this.historydata[0];
            }
            console.log(this.latestCampus);
            this.campusRequest = result[0].data.find(
              (m) => m.campusStatus == 3
            );
            this.campusAccept = result[0].data.find((m) => m.campusStatus == 4);
            this.campusReject = result[0].data.find((m) => m.campusStatus == 5);
          } else {
            $("#loader").hide();
            this.toastr.ErrorToastr(result[0].message);
          }
        }
        if (result[1]) {
          if (result[1].status) {
            this.applicationdata = result[1].data;
          } else {
            $("#loader").hide();
            this.toastr.ErrorToastr(result[1].message);
          }
        }
        $("#loader").hide();
      });
    }
  }
}
