import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/Services/account.service';
import { CustomValidationService } from 'src/app/Services/custom-validation.service';
import { ToastrServiceService } from 'src/app/services/toastr-service.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  // styleUrls: ['./profile-page.component.sass']
})
export class ProfilePageComponent implements OnInit {

  changePasswordForm: FormGroup = new FormGroup({
    oldPassword: new FormControl(),
    newPassword: new FormControl(),
    confirmPassword: new FormControl()
  });
  isSubmitted: boolean = false;
  constructor(private formBuilder: FormBuilder, private toastr: ToastrServiceService, private customValidator: CustomValidationService, private accountService: AccountService) {
    this.changePasswordForm = formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@#$!%*?&]{8,}$/)]],
      newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@#$!%*?&]{8,}$/)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@#$!%*?&]{8,}$/)]]
    },
      {
        validator: this.customValidator.MatchPassword('newPassword', 'confirmPassword'),
      });
  }

  ngOnInit(): void {
  }

  get f() {
    return this.changePasswordForm.controls;
  }

  changePassword() {
    this.isSubmitted = true;
    if (this.changePasswordForm.valid) {
      var Input = {
        OldPassword: this.f.oldPassword.value,
        NewPassword: this.f.newPassword.value
      };
      this.accountService.changePassword(Input).subscribe(res => {
        if (res.status) {
          this.toastr.SuccessToastr("Password Changed successfully.");
          this.changePasswordForm.reset();
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
  }
}