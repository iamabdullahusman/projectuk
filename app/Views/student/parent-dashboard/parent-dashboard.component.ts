import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AlertServiceService } from "src/app/services/alert-service.service";
import { ApplicationService } from "src/app/services/application.service";
import { ToastrServiceService } from "src/app/services/toastr-service.service";
import { SessionStorageService } from "src/app/services/session-storage.service";
import { StudentProfileService } from "src/app/Services/student-profile.service";
import { EmittService } from "src/app/Services/emitt.service";

@Component({
  selector: "app-parent-dashboard",
  templateUrl: "./parent-dashboard.component.html",
  styleUrls: ["./parent-dashboard.component.sass"],
})
export class ParentDashboardComponent implements OnInit {
  application: any;
  applicationsList = [];
  permissionmessage = false;
  studentPanel = false;
  applicationId: any;
  constructor(
    private applicationService: ApplicationService,
    private emittService: EmittService,
    private alerts: AlertServiceService,
    private router: Router,
    private ProfileService: StudentProfileService,
    private sessionService: SessionStorageService,
    private toastr: ToastrServiceService,
    private alertService: AlertServiceService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.sessionService.setApplicationId(0);
    this.emittService.changePermission();
  }
  loadData() {
    $("#loader").show();
    this.applicationService.getStudentApplicationData().subscribe(
      (res) => {
        if (res.status) {
          this.applicationsList = res.data;
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

  openApplication(applicationId: any) {
    this.application = this.applicationsList.find(
      (m) => m.applicationId == applicationId
    );
    this.sessionService.saveSessionForApplicationname(
      this.application.lastName + " " + this.application.firstName
    );
    this.sessionService.setApplicationId(applicationId);
    this.emittService.changePermission();
    let application = {
      ApplicationId: applicationId,
      UserType: 6,
    };
    this.ProfileService.getUserPermissionData(application).subscribe((res) => {
      this.router.navigate(["student/myapplication"]);
      this.emittService.callheaderpermition();
      if (res.data == true) {
        this.sessionService.setpermission(res.data);
      }
    });
  }
}
