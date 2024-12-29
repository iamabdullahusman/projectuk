import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CasService } from "src/app/Services/cas.service";
import { AppConfig } from "src/app/appconfig";
import { AlertServiceService } from "src/app/services/alert-service.service";
import { SessionStorageService } from "src/app/services/session-storage.service";
import { ToastrServiceService } from "src/app/services/toastr-service.service";

@Component({
  selector: "app-cas",
  templateUrl: "./cas.component.html",
  styleUrls: ["./cas.component.sass"],
})
export class CasComponent implements OnInit {
  urlSafe: SafeResourceUrl;

  storeApplicationId: any;
  BaseUrl: any;
  CASData = [];
  @ViewChild("StatusReason") StatusReason: ElementRef;
  userType: any;
  studentName: any;
  permissionMessageImage = false;
  constructor(
    private CasIssue: CasService,
    private toastr: ToastrServiceService,
    private alerts: AlertServiceService,
    private sessionService: SessionStorageService,
    private modalService: NgbModal,
    public sanitizer: DomSanitizer,
    private sessionStorage: SessionStorageService,
    private appConfig: AppConfig
  ) {}

  ngOnInit(): void {
    this.GetSession();
    this.GetCASByApplicationId();
    this.GetLink();
  }
  VisaLinkDataList: any = [];
  GetLink() {
    let Input = {
      ApplicationId: this.storeApplicationId,
    };
    this.CasIssue.GetLinkVisa(Input).subscribe(
      (res) => {
        if (res.status) {
          this.VisaLinkDataList = res.data;
        } else {
          this.toastr.ErrorToastr(res.message);
        }
      },
      (err: any) => {
        this.toastr.ErrorToastr("Something went wrong");
      }
    );
  }

  GetSession(): any {
    this.storeApplicationId = this.sessionStorage.getUserApplicationId();
  }

  GetCASByApplicationId() {
    $("#loader").show();
    this.BaseUrl = this.appConfig.baseServiceUrl;
    let input = {
      applicationId: this.storeApplicationId,
    };
    this.userType = parseInt(this.sessionService.getUserType());
    if (this.userType > 5) {
      input.applicationId = parseInt(
        this.sessionService.getUserApplicationId()
      );
      this.studentName = this.sessionService.GetSessionForApplicationname();
      var userPermission = this.sessionService.getpermission();
      if (userPermission == "true") {
        this.CasIssue.getCAS(input).subscribe((res) => {
          if (res.status) {
            this.CASData = res.data;
            if (res.data != null) {
              this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
                this.BaseUrl + res.data[0]?.file
              );
            }
          } else {
            this.toastr.ErrorToastr("Something went wrong");
          }

          $("#loader").hide();
        });
      } else {
        this.permissionMessageImage = true;
        $("#loader").hide();
      }
    } else {
      this.CasIssue.getCAS(input).subscribe((res) => {
        if (res.status) {
          this.CASData = res.data;
          if (res.data != null) {
            this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.BaseUrl + res.data[0]?.file
            );
          }
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
        $("#loader").hide();
      });
    }
  }
  StoreCasLinkId: any;
  changeStatus(Id: any, Status: any) {
    this.StoreCasLinkId = Id;
    let Input = {
      VisaId: Id,
      Status: 2,
      Reason: "",
    };
    if (Status == 2) {
      this.alerts
        .ComfirmAlert(
          "Please confirm if you have reviewed the draft CAS, and if you are ok to proceed on it. ",
          "Yes, All is good.",
          "Cancel"
        )
        .then((res) => {
          if (res.isConfirmed) {
            this.CasIssue.UpdateStatus(Input).subscribe(
              (res) => {
                if (res.status) {
                  this.toastr.SuccessToastr("Updated Successfully.");
                  this.GetLink();
                } else {
                  this.toastr.ErrorToastr(res.message);
                }
              },
              (err: any) => {
                this.toastr.ErrorToastr("Something went wrong");
              }
            );
          }
        });
    } else {
      this.modalService.open(this.StatusReason, {
        ariaLabelledBy: "modal-basic-title",
        size: "xl",
      });
    }
  }

  changeStatuswithreason(Id: any, Status: any) {
    this.alerts
      .ComfirmAlert(
        "Please confirm if you have reject the draft CAS?",
        "Yes",
        "No"
      )
      .then((res) => {
        if (res.isConfirmed) {
          let Input = {
            VisaId: this.StoreCasLinkId,
            Status: 3,
            Reason: $("#reason").val(),
          };
          console.log("Response of visa is: ", Input.VisaId);
          this.CasIssue.UpdateStatus(Input).subscribe(
            (res) => {
              if (res.status) {
                this.toastr.SuccessToastr("Updated Successfully.");
                this.GetLink();
                this.modalService.dismissAll();
              } else {
                this.toastr.ErrorToastr(res.message);
              }
            },
            (err: any) => {
              this.toastr.ErrorToastr("Something went wrong");
            }
          );
        }
      });
  }

  downloadFile(url: any) {
    var filename = this.getFileName(url);
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    link.setAttribute("type", "hidden");
    link.setAttribute("href", this.appConfig.baseServiceUrl + url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  getFileName(str: any = "/defalut.pdf") {
    return str.substring(str.lastIndexOf("/") + 1);
  }
}
