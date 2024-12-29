import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UfpServService } from "src/app/Services/ufp-serv.service";
import { Login } from "src/app/Models/login.model";
import { SessionStorageService } from "src/app/Services/session-storage.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrServiceService } from "src/app/Services/toastr-service.service";
import { EmittService } from "src/app/Services/emitt.service";
import { StudentProfileService } from "src/app/Services/student-profile.service";
import { AlertServiceService } from "src/app/Services/alert-service.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styles: [],
  providers: [UfpServService, Login],
})
export class LoginComponent implements OnInit {
  isSubmitted: boolean = false;
  isLoading: boolean = false;
  slideConfig2 = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "0",
    slidesToShow: 1,
    speed: 500,
    dots: true,
  };
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(),
    password: new FormControl(),
  });
  constructor(
    private router: Router,
    private emittService: EmittService,
    private service: UfpServService,
    private loginModel: Login,
    private sessionService: SessionStorageService,
    private formBuilder: FormBuilder,
    private toastr: ToastrServiceService,
    private ProfileService: StudentProfileService,
    private alerts: AlertServiceService
  ) {
    this.loginForm = formBuilder.group({
      email: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z][A-Za-z0-9\.\_]+@[A-Za-z]*.{2}[a-z\.]{2,4}[a-zA-Z]{2,4}$/
          ),
        ],
      ],
      password: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {}
  get f() {
    return this.loginForm.controls;
  }
  IsPermissionArray = [];
  createUser(): any {
    this.isLoading = true; // Disable button
    this.isSubmitted = true;
    if (this.loginForm.valid) {
      $("#loader").show();
      var input = JSON.parse(JSON.stringify(this.loginForm.getRawValue()));
      let loginRespose = this.service.Login(input).subscribe((resp) => {
        
        if (resp.status) {
          console.log("FirstLogin: ", resp.data.firstTimeLogin);
          console.log("Response isReset", resp.data.isReset);
          this.sessionService.saveSession(resp.data);
          if(resp.data.firstTimeLogin == true && resp.data.isReset == false){
            this.router.navigate(["pages/reset-password"], { replaceUrl: true });
          }
          else if (resp.data.isReset == true){

          this.emittService.changePermission();
          
          if (
            resp.data.userType == 5 ||
            resp.data.userType == 6 ||
            resp.data.userType == 7 ||
            resp.data.userType == 4 ||
            resp.data.userType === 8 
          ) {
            var permissiondatatrue = {
              ApplicationId: resp.data.applicationId,
              UserRoles: [
                {
                  IsPermission: true,
                  UserType: 6,
                },
              ],
            };
            var permissiondatafalse = {
              ApplicationId: resp.data.applicationId,
              UserRoles: [
                {
                  IsPermission: false,
                  UserType: 6,
                },
              ],
            };
            var firstLogin = {
              ApplicationId: resp.data.applicationId,
            };
            if (resp.data.userType == 5) {
              this.router.navigate(["student"], { replaceUrl: true });
              this.ProfileService.getFirstLoginData(firstLogin).subscribe(
                (res) => {
                  if (res.data == false) {
                    this.alerts
                      .ComfirmAlert(
                        "Your parent can view your profile?",
                        "Yes",
                        "No"
                      )
                      .then((res) => {
                        if (res.isConfirmed) {
                          this.ProfileService.addParentSponcerPermissions(
                            permissiondatatrue
                          ).subscribe((res) => {});
                        } else {
                          this.ProfileService.addParentSponcerPermissions(
                            permissiondatafalse
                          ).subscribe((res) => {});
                        }
                      });
                  }
                }
              );
            } else if (resp.data.userType == 6) {
              this.router.navigate(["student/parent/dashboard"], { replaceUrl: true });
            } else if (resp.data.userType == 7) {
              this.router.navigate(["student/sponsor/dashboard"], { replaceUrl: true });
            } else if (resp.data.userType == 4) {
              this.router.navigate(["student/agent/dashboard"], { replaceUrl: true });
            } else if (resp.data.userType === 8) {
              this.router.navigate(["/teacher/dashboard"], {
                replaceUrl: true,
              });
            } else {
              this.router.navigate(["/dashboard"], { replaceUrl: true });
            }
          } else {
            if (resp.data.userType == 1 || resp.data.userType == 3) {
              this.router.navigate(["/dashboard"], { replaceUrl: true });
            } else {
              this.toastr.ErrorToastr(resp.message);
            }
          }
          $("#loader").hide();
        
        
        }
        else{
          this.router.navigate(["pages/reset-password"], { replaceUrl: true });
        }
        } 
        
        
        
        else {
          this.isLoading = false;
          this.toastr.ErrorToastr(resp.message);
        }
        $("#loader").hide();

        (err: any) => {
          this.isLoading = false;
          $("#loader").hide();
          console.error(err);
          this.toastr.ErrorToastr("Something went wrong");
        };
      });
    }
    $("#loader").hide();
  }

  redirectTOForgot(): any {
    this.router.navigate(["/pages/recoverpassword"]);
  }
}
