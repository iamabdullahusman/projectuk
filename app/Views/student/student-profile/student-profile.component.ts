import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/appconfig';
import { AlertServiceService } from 'src/app/Services/alert-service.service';
import { SessionStorageService } from 'src/app/Services/session-storage.service';
import { StudentProfileService } from 'src/app/Services/student-profile.service';
import { ToastrServiceService } from 'src/app/Services/toastr-service.service';
import * as moment from 'moment';
import { SponsorService } from 'src/app/Services/sponsor.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from 'src/app/Services/account.service';
import { CustomValidationService } from 'src/app/Services/custom-validation.service';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.sass']
})
export class StudentProfileComponent implements OnInit {
  userType: any = '';
  homeArray = [];
  intermArray = [];
  SponsorList = [];
  cityList = [];
  countries = [];
  profileDetail: any;
  isSubmitted = false;
  studentProfileForm: FormGroup = new FormGroup({
    ApplicationId: new FormControl(),
    AddressId: new FormControl(),
    Address: new FormControl(),
    Appartment: new FormControl(),
    // City: new FormControl(),
    State: new FormControl(),
    // Country: new FormControl(),
    PostalCode: new FormControl(),
    IsHome: new FormControl(),
    countryId: new FormControl(),
    cityId: new FormControl()
  });
  studentProfileForm1: FormGroup = new FormGroup({
    ApplicationId: new FormControl(),
    AddressId: new FormControl(),
    Address: new FormControl(),
    Appartment: new FormControl(),
    City: new FormControl(),
    State: new FormControl(),
    Country: new FormControl(),
    PostalCode: new FormControl(),
    IsHome: new FormControl()
  });
  studentProfileForms: FormGroup = new FormGroup({
    ApplicationId: new FormControl(),
    AddressId: new FormControl(),
    FirstName: new FormControl(),
    LastName: new FormControl(),
    Email: new FormControl(),
    ContectNumber: new FormControl()
  });
  parentPermissionForm: FormGroup = new FormGroup({
    Ispermission: new FormControl(),
    UpdatedDate: new FormControl()
  });

  SponsorRequestForm: FormGroup = new FormGroup({
    sponcerId: new FormControl(),
    applicationId: new FormControl(),
    sponcerName: new FormControl(),
    authorizedPersonName: new FormControl(),
    countryId: new FormControl(),
    cityId: new FormControl(),
    contactDetail: new FormControl(),
    emailId: new FormControl(),
    postalCode: new FormControl(),
    address: new FormControl(),
    isVerifry: new FormControl()
  });

  changePasswordForm: FormGroup = new FormGroup({
    oldPassword: new FormControl(),
    newPassword: new FormControl(),
    confirmPassword: new FormControl()
  });

  applicationId: any;
  @ViewChild("SponsorDetails") SponsorDetails: ElementRef;
  constructor(private formBuilder: FormBuilder, private ProfileService: StudentProfileService, private session: SessionStorageService, private toastr: ToastrServiceService, private sessionStorage: SessionStorageService, private alerts: AlertServiceService, private router: Router, private appConfig: AppConfig, private domSanitizer: DomSanitizer, private SponsorService: SponsorService, private modalService: NgbModal, private accountService: AccountService, private customValidator: CustomValidationService) {
    this.studentProfileForm = formBuilder.group({
      ApplicationId: [0, [Validators.required]],
      AddressId: [0, [Validators.required]],
      Address: ['', [Validators.required]],
      Appartment: ['', [Validators.required]],
      cityId: [null, [Validators.required]],
      State: ['', [Validators.required]],
      countryId: [null, [Validators.required]],
      PostalCode: ['', [Validators.required]],
      IsHome: [true, [Validators.required]],
    });
    this.applicationId = parseInt(this.session.getUserApplicationId());
    this.studentProfileForm1 = formBuilder.group({
      ApplicationId: [0, [Validators.required]],
      AddressId: [0, [Validators.required]],
      Address: ['', [Validators.required]],
      Appartment: ['', [Validators.required]],
      cityId: [0, [Validators.required]],
      State: ['', [Validators.required]],
      countryId: [0, [Validators.required]],
      PostalCode: ['', [Validators.required]],
      IsHome: [false, [Validators.required]],
    });
    this.studentProfileForms = formBuilder.group({
      ApplicationId: [0, [Validators.required]],
      AddressId: [0, [Validators.required]],
      FirstName: ['', [Validators.required]],
      LastName: ['', [Validators.required]],
      Email: ['', [Validators.required]],
      ContectNumber: ['', [Validators.required]],
    });
    this.parentPermissionForm = formBuilder.group({
      Ispermission: [null, [Validators.required]],
      UpdatedDate: ['', [Validators.required]],
    });
    this.SponsorRequestForm = formBuilder.group({
      sponcerId: [null, [Validators.required]],
      applicationId: [null, [Validators.required]],
      sponcerName: [''],
      authorizedPersonName: ['', [Validators.required]],
      countryId: [null, [Validators.required]],
      cityId: [null, [Validators.required]],
      contactDetail: ['', [Validators.required, Validators.pattern("[0-9]{10,12}")]],
      emailId: ['', [Validators.required, Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}")]],
      postalCode: ['', [Validators.required, Validators.pattern("[A-Za-z0-9]{5,}")]],
      address: ['', [Validators.required]],
      isVerifry: [false, [Validators.required]]
    });

    this.changePasswordForm = formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@#$!%*?&]{8,}$/)]],
      newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@#$!%*?&]{8,}$/)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@#$!%*?&]{8,}$/)]]
    },
      {
        validator: this.customValidator.MatchPassword('newPassword', 'confirmPassword'),
      });
  }
  get f() {
    return this.studentProfileForm.controls;
  }
  get f1() {
    return this.studentProfileForm1.controls;
  }
  get srf() {
    return this.SponsorRequestForm.controls;
  }

  get fcp() {
    return this.changePasswordForm.controls;
  }

  GetUserType(): any {
    this.userType = this.sessionStorage.getUserType();
  }
  ngOnInit(): void {
    // this.getStudentProfileDetails();
    this.GetUserType();
    if (this.userType == 5) {
      this.getStudentProfileDetails();
      this.loadCountry();
    }
  }

  getStudentProfileDetails() {
    $("#loader").show();
    let input = {
      ApplicationId: this.applicationId
    }
    this.ProfileService.getStudentsProfileData(input).subscribe(res => {
      if (res.status) {
        if (res.data) {
          $("#loader").hide();
          this.studentProfileForms.get("FirstName").setValue(res.data.firstName);
          this.studentProfileForms.get("LastName").setValue(res.data.lastName);
          this.studentProfileForms.get("Email").setValue(res.data.email);
          this.studentProfileForms.get("ContectNumber").setValue(res.data.contactNumber);
          this.profileDetail = res.data;
        }
        let permissions = res.data.permission[0];
        if (permissions) {
          if (permissions.isPermission == true) {
            this.parentPermissionForm.get("Ispermission").setValue(true);
          }
          this.parentPermissionForm.get("UpdatedDate").setValue(moment(permissions.updatedDate).format("YYYY-MM-DD"));
        }
        let home = res.data.addresses.find(x => x.isHome == true);
        if (home) {
          // if (res.data.addresses.find(x => x.isHome == true)) {
          this.studentProfileForm.get("Address").setValue(home.address1);
          this.studentProfileForm.get("Appartment").setValue(home.address2);
          this.studentProfileForm.get("cityId").setValue(home.cityId);
          this.studentProfileForm.get("State").setValue(home.state);
          this.studentProfileForm.get("countryId").setValue(home.countryId);
          this.studentProfileForm.get("PostalCode").setValue(home.postalCode);
          this.studentProfileForm.get("AddressId").setValue(home.addressId);
          this.location(home.countryId);
        }
        // if (res.data.addresses.find(x => x.isHome == false)) {
        let interm = res.data.addresses.find(x => x.isHome == false);
        if (interm) {
          this.studentProfileForm1.get("Address").setValue(interm.address1);
          this.studentProfileForm1.get("Appartment").setValue(interm.address2);
          this.studentProfileForm1.get("cityId").setValue(interm.cityId);
          this.studentProfileForm1.get("State").setValue(interm.state);
          this.studentProfileForm1.get("countryId").setValue(interm.countryId);
          this.studentProfileForm1.get("PostalCode").setValue(interm.postalCode);
          this.studentProfileForm1.get("AddressId").setValue(interm.addressId);
        }

      }
      else {
        this.toastr.ErrorToastr(res.message);
      }
      $("#loader").hide();
    }, (err: any) => {
      if (err.status == 401) {
        this.router.navigate(['/'])
      }
      else {
        this.toastr.ErrorToastr("Something went wrong");
      }
      $("#loader").hide();
    })
  }

  savedata() {
    $("#homeAddressId").click();
    // this.isSubmitted = true;

    this.homeArray = [];
    if (this.studentProfileForm.valid && this.studentProfileForm1.valid) {
      var formVal = JSON.parse(JSON.stringify(this.studentProfileForm.getRawValue()));
      var formVal1 = JSON.parse(JSON.stringify(this.studentProfileForm1.getRawValue()));

      this.homeArray.push(formVal);
      this.homeArray.push(formVal1);
      this.ProfileService.saveStudentProfileById(this.homeArray).subscribe(res => {
        if (res.status) {
          this.toastr.SuccessToastr("Student profile submitted successfully.");
          // this.studentProfileForm.reset();
          // this.studentProfileForm1.reset();
          this.getStudentProfileDetails();
        }
        else {
          this.toastr.ErrorToastr("Student profile is not submitted.");
        }
        $("#loader").hide();
      })
    }
    else{
      this.toastr.ErrorToastr("Something went wrong");
    }
  }

  checkSameHome(e: any) {
    if (e.target.checked) {
      this.studentProfileForm1.setValue(this.studentProfileForm.getRawValue());
      this.studentProfileForm1.get("IsHome").setValue(false);
      // this.studentProfileForm1.disable();
    } else {
      this.studentProfileForm1.reset();
    }
  }


  givepermission(e: any) {

    var formVal1 = JSON.parse(JSON.stringify(this.parentPermissionForm.getRawValue()));
    var permissiondatafalse = {
      ApplicationId: this.applicationId,
      UserRoles: [{
        IsPermission: formVal1.Ispermission,
        UserType: 6,
      }],
    }
    if (formVal1.Ispermission != true) {
      this.alerts.ComfirmAlert("Do you want to remove permission?", "Yes", "No").then(res => {
        if (res.isConfirmed) {

          this.ProfileService.addParentSponcerPermissions(permissiondatafalse).subscribe(res => {
            // this.parentPermissionForm.get("IsPermission").setValue(!formVal1.Ispermission);
            //  this.parentPermissionForm.reset();

          });
        } else {
          this.parentPermissionForm.get("Ispermission").setValue(!formVal1.Ispermission);
          // this.parentPermissionForm.reset();
          this.parentPermissionForm.get("Ispermission").setValue(true);
        }
      });
    } else {
      this.alerts.ComfirmAlert("Your parent can view your profile?", "Yes", "No").then(res => {
        if (res.isConfirmed) {
          this.ProfileService.addParentSponcerPermissions(permissiondatafalse).subscribe(res => {
            //   this.parentPermissionForm.reset();
            this.parentPermissionForm.get("Ispermission").setValue(true);
          });
        }
        else {
          this.parentPermissionForm.get("Ispermission").setValue(formVal1.Ispermission);
          //   this.parentPermissionForm.reset();
          this.parentPermissionForm.get("Ispermission").setValue(false);

        }
      });
    }
  }

  OpenSponsor() {
    if (this.SponsorList.length == 0) {
      this.getSponsorList();
      this.loadCountry();
    }
    this.SponsorRequestForm.get("applicationId").setValue(parseInt(this.sessionStorage.getUserApplicationId()));
    this.SponsorRequestForm.get("isVerifry").setValue(false);
    this.modalService.open(this.SponsorDetails, { ariaLabelledBy: 'modal-basic-title', size: 'lg', backdrop: false });
  }

  getSponsorList() {
    this.SponsorService.GetAllSponsor().subscribe(res => {
      //this.resetsponcerform();
      if (res.status) {
        $('#loader').hide();
        this.SponsorList = res.data;
        this.SponsorList.push({
          sponcerId: 0,
          sponcerName: 'Other'
        })
      }
      else {
        this.toastr.ErrorToastr(res.message);
        $('#loader').hide();
      }

    }, (err: any) => {
      $('#loader').hide();
      if (err.status == 401) {
        this.router.navigate(['/']);
      }
      else {
        this.toastr.ErrorToastr("Something went wrong");
        $('#loader').hide();
      }
    })
  }

  GetSponcer(id: any) {
    if (id != 0 && id) {
      $('#loader').show();
      var input = {
        SponcerId: id
      }
      this.SponsorService.getSponcerBYId(input).subscribe(res => {

        if (res.status) {
          $('#loader').hide();
          this.SponsorRequestForm.get("address").setValue(res.data.address);
          this.SponsorRequestForm.get("countryId").setValue(res.data.countryId);
          this.SponsorRequestForm.get("contactDetail").setValue(res.data.contactDetail);
          this.SponsorRequestForm.get("postalCode").setValue(res.data.postalCode);
          this.SponsorRequestForm.get("emailId").setValue(res.data.emailId);
          this.SponsorRequestForm.get("sponcerName").setValue(res.data.sponcerName);
          this.SponsorRequestForm.get("authorizedPersonName").setValue(res.data.authorizedPersonName);
          this.location(res.data.countryId)
          this.SponsorRequestForm.get("cityId").setValue(res.data.cityId);
        }
        else {
          this.toastr.ErrorToastr(res.message);
          $('#loader').hide();
        }

      }, (err: any) => {
        $('#loader').hide();
        if (err.status == 401) {
          this.router.navigate(['/']);
        }
        else {
          this.toastr.ErrorToastr("Something went wrong");
          $('#loader').hide();
        }
      })
    }
    else {
      this.SponsorRequestForm.get("address").reset();
      this.SponsorRequestForm.get("cityId").reset();
      this.SponsorRequestForm.get("countryId").reset();
      this.SponsorRequestForm.get("contactDetail").reset();
      this.SponsorRequestForm.get("postalCode").reset();
      this.SponsorRequestForm.get("emailId").reset();
      this.SponsorRequestForm.get("sponcerName").reset();
      this.SponsorRequestForm.get("authorizedPersonName").reset();
    }
  }

  location(CInput: any) {
    if (CInput) {
      $("#loader").show();
      let input = {
        Id: CInput
      }
      this.accountService.getCitiesByCountryId(input).subscribe(res => {
        if (res.status) {
          this.cityList = res.data;
        }
        else {
          this.toastr.ErrorToastr(res.message);
        }
        $("#loader").hide();
      }, (err: any) => {
        if (err.status == 401) {
          this.router.navigate(['/'])
        }
        else {
          this.toastr.ErrorToastr("Something went wrong");
        }
        $("#loader").hide();
      })
    }
  }
  loadCountry() {
    $("#loader").show();
    this.accountService.getCountries().subscribe(res => {
      if (res.status) {
        this.countries = res.data;
        $("#loader").hide();

      }
    }, (err: any) => {
      if (err.status == 401) {
        this.router.navigate(['/'])
      }
      else {
        this.toastr.ErrorToastr("Something went wrong");
      }
      $("#loader").hide();
    });
  }
  SponsorRequest() {
    if (this.SponsorRequestForm.valid) {
      var input = this.SponsorRequestForm.getRawValue();
      this.SponsorService.SponsorRequest(input).subscribe(res => {

        if (res.status) {
          $('#loader').hide();
          this.toastr.SuccessToastr(res.data);
          this.ngOnInit()
          this.modalService.dismissAll();
        }
        else {
          this.toastr.ErrorToastr(res.message);
          $('#loader').hide();
        }

      }, (err: any) => {
        $('#loader').hide();
        if (err.status == 401) {
          this.router.navigate(['/']);
        }
        else {
          this.toastr.ErrorToastr("Something went wrong");
          $('#loader').hide();
        }
      })
    }
  }

  changePassword() {
    this.isSubmitted = true;
    if (this.changePasswordForm.valid) {
    if(this.fcp.oldPassword.value == this.fcp.newPassword.value){
      this.toastr.ErrorToastr("Old Password And New Password are same");
    }else{
    if (this.changePasswordForm.valid) {
      var Input = {
        OldPassword: this.fcp.oldPassword.value,
        NewPassword: this.fcp.newPassword.value
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
  }
}
