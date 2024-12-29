import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import dayjs from "dayjs";
import { forkJoin } from "rxjs";
import { AccountService } from "src/app/Services/account.service";
import { TeacherService } from "src/app/Services/teacher.service";
import { ToastrServiceService } from "src/app/services/toastr-service.service";

@Component({
  selector: "app-add-teacher",
  templateUrl: "./add-teacher.component.html",
  styleUrls: ["./add-teacher.component.sass"],
})
export class AddTeacherComponent implements OnInit {
  pageTitle = "";
  teacherForm: FormGroup;
  countryData = [];
  addressCities = [];
  addressFirstEmergencyCities = [];
  addressSecondEmergencyCities = [];
  teacherId: number;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrServiceService,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private teacherService: TeacherService,
    private router: Router
  ) {
    this.buildForm();
    route.params.subscribe((params) => {
      if (params["id"]) {
        this.teacherId = parseInt(params["id"]);
        this.patchData();
        this.tf["teacherId"].setValue(params["id"]);
        this.pageTitle = "Update Teacher";
      } else {
        this.tf["teacherId"].setValue(0);
        this.pageTitle = "Add Teacher";
      }
    });
  }

  ngOnInit(): void {
    // this.loadCountryAndCity();
  }

  buildForm() {
    this.teacherForm = this.fb.group({
      teacherId: [0],
      name: ["", Validators.required],
      surname: ["", Validators.required],
      mobileNumber: [
        "",
        [Validators.required, Validators.pattern("[0-9]{10,12}")],
      ],
      homeNumber: ["", Validators.pattern("[0-9]{10,12}")],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}"),
        ],
      ],
      dateOfBirth: [""],
      address: [""],
      // state: [""],
      // city: [null],
      // country: [null],
      // pinCode: ["", Validators.pattern("[A-Za-z0-9]{5,}")],
      emergencyContactName1: [""],
      emergencyNumber1: ["", Validators.pattern("[0-9]{10,12}")],
      emergencyAddress1: [""],
      // firstEmergencyState: [""],
      // firstEmergencyCity: [null],
      // firstEmergencyCountry: [null],
      // firstEmergencyPinCode: ["", Validators.pattern("[A-Za-z0-9]{5,}")],
      emergencyContactName2: [""],
      emergencyNumber2: ["", Validators.pattern("[0-9]{10,12}")],
      emergencyAddress2: [""],
      // secondEmergencyState: [""],
      // secondEmergencyCity: [null],
      // secondEmergencyCountry: [null],
      // secondEmergencyPinCode: ["", Validators.pattern("[A-Za-z0-9]{5,}")],
      cvFile: [""],
    });

    // this.teacherForm.get("country").valueChanges.subscribe((res) => {
    //   this.teacherService.showLoader();
    //   this.accountService.getCitiesByCountryId({ id: res }).subscribe(
    //     (res) => {
    //       if (res.status) this.addressCities = res.data;
    //       else this.toast.ErrorToastr(res.message);
    //       this.teacherService.hideLoader();
    //     },
    //     (err: any) => this.handleApiError(err)
    //   );
    // });
    // this.teacherForm
    //   .get("firstEmergencyCountry")
    //   .valueChanges.subscribe((res) => {
    //     this.teacherService.showLoader();
    //     this.accountService.getCitiesByCountryId({ id: res }).subscribe(
    //       (res) => {
    //         if (res.status) this.addressFirstEmergencyCities = res.data;
    //         else this.toast.ErrorToastr(res.message);
    //         this.teacherService.hideLoader();
    //       },
    //       (err: any) => this.handleApiError(err)
    //     );
    //   });
    // this.teacherForm
    //   .get("secondEmergencyCountry")
    //   .valueChanges.subscribe((res) => {
    //     this.teacherService.showLoader();
    //     this.accountService.getCitiesByCountryId({ id: res }).subscribe(
    //       (res) => {
    //         if (res.status) this.addressSecondEmergencyCities = res.data;
    //         else this.toast.ErrorToastr(res.message);
    //         this.teacherService.hideLoader();
    //       },
    //       (err: any) => this.handleApiError(err)
    //     );
    //   });
  }

  get tf() {
    return this.teacherForm.controls;
  }

  loadCountryAndCity() {
    this.teacherService.showLoader();
    let countryApi = this.accountService.getCountries();
    forkJoin([countryApi]).subscribe(
      (result) => {
        if (result[0]) {
          if (result[0].status) this.countryData = result[0].data;
          else this.toast.ErrorToastr(result[0].message);
        }
        this.teacherService.hideLoader();
      },
      (err: any) => this.handleApiError(err)
    );
    this.accountService.getCountries().subscribe(
      (res) => {},
      (err: any) => this.handleApiError(err)
    );
  }

  patchData() {
    this.teacherService.showLoader();
    this.teacherService.getTeacherById(this.teacherId).subscribe(
      (res) => {
        if (res.status) {
          this.teacherForm.patchValue(res.data);
          this.tf['dateOfBirth'].setValue(dayjs(res.data.dateOfBirth).format('YYYY-MM-DD'))
          this.tf['email'].disable();
        } else this.toast.ErrorToastr(res.message);
        this.teacherService.hideLoader();
      },
      (err: any) => this.handleApiError(err)
    );
  }

  saveTeacher() {
    this.teacherForm.markAllAsTouched();
    if (this.teacherForm.valid) {
      let payload = this.teacherForm.getRawValue();
      this.teacherService.showLoader();
      if(payload.teacherId==0){
      this.teacherService.createTeacher(payload).subscribe(
        (m) => {
          if (m.status) {
            this.toast.SuccessToastr(m.message);
            this.router.navigate(["/teacher"]);
          } else this.toast.ErrorToastr(m.message);
          this.teacherService.hideLoader();
        },
        (err: any) => this.handleApiError(err)
      );
      }
      else{
        this.teacherService.updateTeacher(payload).subscribe(
          (m) => {
            if (m.status) {
              this.toast.SuccessToastr(m.message);
              this.router.navigate(["/teacher"]);
            } else this.toast.ErrorToastr(m.message);
            this.teacherService.hideLoader();
          },
          (err: any) => this.handleApiError(err)
        );
      }
    }
  }

  onFileChoose(event: any) {
    const files = event.target.files;
    if (files) {
      this.teacherForm.get("cvFile").setValue(files[0]);
    }
  }

  handleApiError(err: any) {
    if (err.status == 401) {
      this.router.navigate(["/"]);
    } else {
      this.toast.ErrorToastr("Something went wrong");
    }
    this.teacherService.hideLoader();
  }

  back(){
    this.router.navigate(['/teacher'])
  }
}
