import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UfpServService } from "src/app/Services/ufp-serv.service";
import { Reset } from "src/app/Models/reset-password-form.model";
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
import { AccountService } from 'src/app/Services/account.service';
import { Location } from '@angular/common';
@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styles: [],
  providers: [UfpServService, Reset, AccountService],
})
export class ResetPasswordComponent implements OnInit {
  isSubmitted: boolean = false;
  slideConfig2 = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "0",
    slidesToShow: 1,
    speed: 500,
    dots: true,
  };
  resetForm: FormGroup = new FormGroup({
    confirmnewpassword: new FormControl(),
    newpassword: new FormControl(),
    oldpassword: new FormControl()
  });
  constructor(
    private location: Location,
    private router: Router,
    private emittService: EmittService,
    private service: UfpServService,
    private changePasswordService: AccountService,
    private resetModel: Reset,
    private sessionService: SessionStorageService,
    private formBuilder: FormBuilder,
    private toastr: ToastrServiceService,
    private ProfileService: StudentProfileService,
    private alerts: AlertServiceService
  ) {
    this.resetForm = formBuilder.group({
      newpassword: ["", [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$=!#%*?&])[A-Za-z\d@#=$!%*?&]{8,}$/)]],
      
      confirmnewpassword: ["", [Validators.required,  Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$=!#%*?&])[A-Za-z\d@#=$!%*?&]{8,}$/)]],
      
      oldpassword: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    history.pushState(null, '', location.href);
    window.onpopstate = () => {
      history.pushState(null, '', location.href);
    };
    const isLoggedIn = !!localStorage.getItem('token');
    if (!isLoggedIn) {
      this.router.navigate(['/pages/login']); // Redirect to login if not authenticated
    }
  }
  get f() {
    return this.resetForm.controls;
  }
  
  IsPermissionArray = [];
  resetPassword(): any {
    console.log("Hello in submitting");
      this.isSubmitted = true;
      if (this.resetForm.valid) {
        console.log("Hello in submitting");
      if(this.f.oldpassword.value == this.f.newpassword.value){
        this.toastr.ErrorToastr("Old Password And New Password are same");
      }
      else{
        
      if (this.resetForm.valid) {
        if(this.f.newpassword.value == this.f.confirmnewpassword.value){
          var Input = {
            OldPassword: this.f.oldpassword.value,
            NewPassword: this.f.newpassword.value
          };
  
          this.changePasswordService.changePassword(Input).subscribe(res => {
            if (res.status) {
              this.toastr.SuccessToastr("Password Changed successfully.");
              this.resetForm.reset();
              this.sessionService.clearSession();
              this.router.navigate(["pages/login"]);
            }
            else {
              this.toastr.ErrorToastr(res.data);
            }
            $("#loader").hide();
          }, (err: any) => {
            this.toastr.ErrorToastr("Something missing");
            $("#loader").hide();
          });
        }
        else{
          this.toastr.ErrorToastr("New Password And Confirm Password are not same");
        }


        
      }
      }
    
    }
    console.log("Errors in submitting");
    $("#loader").hide();
  }

  redirectTOForgot(): any {
    this.sessionService.clearSession();
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(["/pages/recoverpassword"]);
    
  }
}
