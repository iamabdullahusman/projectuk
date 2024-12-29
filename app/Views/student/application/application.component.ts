import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import moment from "moment";
import { ApplicationService } from "src/app/services/application.service";
import { SessionStorageService } from "src/app/services/session-storage.service";
import { ToastrServiceService } from "src/app/services/toastr-service.service";

@Component({
  selector: "app-application",
  templateUrl: "./application.component.html",
  styleUrls: ["./application.component.sass"],
})
export class ApplicationComponent implements OnInit {
  application: any;
  userType: any;
  studentName: any;
  permissionMessageImage = false;
  constructor(
    private applicationService: ApplicationService,
    private sessionService: SessionStorageService,
    private toastr: ToastrServiceService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  get applicationName() {
    return this.application.firstName + " " + this.application.lastName;
  }
  loadData() {
    $("#loader").show();
    var application = {
      ApplicationId: 0,
    };
    this.userType = parseInt(this.sessionService.getUserType());
    if (this.userType > 5 || this.userType == 4) {
      application.ApplicationId = parseInt(
        this.sessionService.getUserApplicationId()
      );
      this.studentName = this.sessionService.GetSessionForApplicationname();
      var userPermission = this.sessionService.getpermission();
      if (userPermission == "true") {
        this.applicationService.getApplication(application).subscribe(
          (res) => {
            if (res.status) {
              this.application = res.data;
              this.application.dateOfBirth = moment(
                this.application.dateOfBirth
              ).format("DD/MM/YYYY");
            }
            $("#loader").hide();
          },
          (err: any) => {
            if (err.status == 401) {
              this.route.navigate(["/"]);
            } else {
              this.toastr.ErrorToastr("Something went wrong");
            }
            $("#loader").hide();
          }
        );
      } else {
        this.permissionMessageImage = true;
        $("#loader").hide();
      }
    } else {
      this.applicationService.getApplication(application).subscribe(
        (res) => {
          if (res.status) {
            this.application = res.data;
            this.application.dateOfBirth = moment(
              this.application.dateOfBirth
            ).format("DD/MM/YYYY");
          }
          $("#loader").hide();
        },
        (err: any) => {
          if (err.status == 401) {
            this.route.navigate(["/"]);
          } else {
            this.toastr.ErrorToastr("Something went wrong");
          }
          $("#loader").hide();
        }
      );
    }
  }
}
