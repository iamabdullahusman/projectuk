import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrServiceService } from 'src/app/services/toastr-service.service';
import { UfpServService } from 'src/app/services/ufp-serv.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styles: []
})
export class ForgotPasswordComponent implements OnInit {
  public get toastr(): ToastrServiceService {
    return this._toastr;
  }
  public set toastr(value: ToastrServiceService) {
    this._toastr = value;
  }
  isSubmitted: any;
  slideConfig2 = {
    className: 'center',
    centerMode: true,
    infinite: true,
    centerPadding: '0',
    slidesToShow: 1,
    speed: 500,
    dots: true,
  };
  ForgotForm: FormGroup = new FormGroup({
    email: new FormControl(),
  })
  constructor(private router: Router, private formBuilder: FormBuilder, private service: UfpServService, private _toastr: ToastrServiceService) {
    this.ForgotForm = formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z][A-Za-z0-9\.\_]+@[A-Za-z]*.{2}[a-z\.]{2,4}[a-zA-Z]{2,4}$/)]],
    });
  }

  ngOnInit() {
  }

  redirectToLogin(): any {
    this.router.navigate(['/pages/login']);
  }

  get f() {
    return this.ForgotForm.controls;
  }

  UserforgetPassword(): any {
    this.isSubmitted = true;
    if (this.ForgotForm.valid) {
      $('#loader').show();
      var input = JSON.parse(JSON.stringify(this.ForgotForm.getRawValue()));
      let loginRespose = this.service.forgetPassword(input).subscribe(
        resp => {
          if (resp.status) {
            this.toastr.SuccessToastr("Mail Send  ");
            // $('#loader').hide();
            this.router.navigate(['/pages/login']);

          }
          else {
            // $('#loader').hide();
            this.toastr.ErrorToastr(resp.message);
          }
          $('#loader').hide();
        },
        (err: any) => {
          //$('#loader').hide();
          $('#loader').hide();
          console.error(err);
          this.toastr.ErrorToastr("Something went wrong")
        });
    }
  }
}
