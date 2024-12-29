import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, MinLengthValidator, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AngularEditorConfig } from '@kolkov/angular-editor';
import moment, { min } from 'moment';

import { forkJoin } from 'rxjs';
import { CampusService } from 'src/app/services/campus.service';
import { CoursesService } from 'src/app/services/courses.service';
import { FeesService } from 'src/app/Services/fees.service';
import { IntakeService } from 'src/app/services/intake.service';
import { ToastrServiceService } from 'src/app/services/toastr-service.service';

@Component({
  selector: 'app-fee-model',
  templateUrl: './fee-model.component.html',
  styleUrls: ['./fee-model.component.sass']
})
export class FeeModelComponent implements OnInit {

  intakes = [];
  campuses = [];
  courses = [];
  isView = false;
  actualTotalFee: number = 0;
  grossFee: number = 0;
  feeError: boolean = false;
  installmentError: Array<boolean> = [];
  installmentFlag: boolean = false;
  installmentErr: boolean = false;
  remainingInstallment: number = 0;
  intakeCourseCampusErr: boolean = false;
  minmunInstallment = [];
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial'
  };
  FeeForm: FormGroup = new FormGroup({
    feeId: new FormControl(),
    intakeId: new FormControl(),
    courseId: new FormControl(),
    campusId: new FormControl(),
    standardFee: new FormControl(),
    registrationFee: new FormControl(),
    practicalFee: new FormControl(),
    materialFee: new FormControl(),
    presessional: new FormControl(),
    examFee: new FormControl(),
    othersFee: new FormControl(),
    scholarship: new FormControl(),
    totalFee: new FormControl(),
    depositAmount: new FormControl(),
    reservationFee: new FormControl(),
    totalInstallments: new FormControl(),
    notes: new FormControl(),
    installments: new FormArray([])
  });
  setMax: any;

  constructor(private router: Router, private arouter: ActivatedRoute, private FeeServices: FeesService, private toastr: ToastrServiceService, private formBuilder: FormBuilder, private CampusServices: CampusService, private CourseServices: CoursesService, private IntakeServices: IntakeService) {
    this.FeeForm = formBuilder.group({
      feeId: [0],
      intakeId: [null, [Validators.required, Validators.pattern(/(^[0-9]*$)/)]],
      courseId: [null, [Validators.required, Validators.pattern(/(^[0-9]*$)/)]],
      campusId: [null, [Validators.required, Validators.pattern(/(^[0-9]*$)/)]],
      standardFee: [null, [Validators.required, Validators.pattern(/(^[0-9]*$)/)]],
      registrationFee: [null, [Validators.required, Validators.pattern(/(^[0-9]*$)/)]],
      practicalFee: [null, [Validators.required, Validators.pattern(/(^[0-9]*$)/)]],
      materialFee: [null, [Validators.required, Validators.pattern(/(^[0-9]*$)/)]],
      presessional: [null, [Validators.required, Validators.pattern(/(^[0-9]*$)/)]],
      examFee: [null, [Validators.required, Validators.pattern(/(^[0-9]*$)/)]],
      othersFee: [null, [Validators.required, Validators.pattern(/(^[0-9]*$)/)]],
      scholarship: [null, [Validators.pattern(/(^[0-9]*$)/)]],
      totalFee: [null, [Validators.required, Validators.pattern(/(^[0-9]*$)/)]],
      depositAmount: [null, [Validators.required, Validators.pattern(/(^[0-9]*$)/)]],
      reservationFee: [null],
      totalInstallments: [1, [Validators.required, Validators.pattern(/(^[0-9]*$)/)]],
      notes: [null],
      // installments: new FormArray([this.getInstallmentForm()], Validators.minLength(1))
      installments: new FormArray([])
    })
  }

  // setting all the dropdown values
  ngOnInit(): void {
    // (<FormArray>this.FeeForm.get('installments')).push(this.getInstallmentForm());
    let paginationModal = {
      index: 0,
      size: 0
    };
    $('#loader').show();
    let coursesData = this.CourseServices.getAllCourses(paginationModal);
    let campusData = this.CampusServices.getAllCampaus(paginationModal);
    let intakeData = this.IntakeServices.getAllIntake(paginationModal);
    forkJoin([coursesData, campusData, intakeData]).subscribe(result => {
      $('#loader').hide();
      if (result[0]) {
        if (result[0].status) {
          this.courses = result[0].data.records;
        }
        else {
          this.toastr.ErrorToastr(result[0].message);
        }
      }
      if (result[1]) {
        if (result[1].status) {
          this.campuses = result[1].data.records;
        }
        else {
          this.toastr.ErrorToastr(result[1].message);
        }
      }
      if (result[2]) {
        if (result[2].status) {
          this.intakes = result[2].data.records;
          this.intakes.forEach(element => {
            element.intakeName = element.intakeName + ' - ' + moment(element.startDate + 'Z').format('YYYY') + ' (Academic Year ' + element.yearOfStudy +')'
          });
        }
        else {
          this.toastr.ErrorToastr(result[2].message);
        }
      }
    }, (err: any) => {
      $('#loader').hide();
      if (err.status == 401) {
        this.router.navigate(['/'])
      }
      else {
        this.toastr.ErrorToastr("Something went wrong");
      }
    })

    this.setFeeFormValue();
  }

  setFeeFormValue() {
    if (this.arouter.snapshot.url[0].path == "AddFee") {
      this.actualTotalFee = 0;
      this.grossFee = 0;
      (<FormArray>this.FeeForm.get('installments')).push(this.getInstallmentForm());
      this.FeeForm.get("installments").setValidators(Validators.minLength(1));
    } else {
      $('#loader').show();
      var input = {
        FeeId: parseInt(this.arouter.snapshot.params.Id)
      }
      this.FeeServices.getFeeById(input).subscribe(res => {
        if (res.status) {
          $('#loader').hide();
          this.FeeForm.get('feeId')?.setValue(res.data.feeId);
          this.FeeForm.get('intakeId')?.setValue(res.data.intakeId);
          this.FeeForm.get('courseId')?.setValue(res.data.courseId);
          this.FeeForm.get('campusId')?.setValue(res.data.campusId);
          this.FeeForm.get('standardFee')?.setValue(res.data.standardFee);
          this.FeeForm.get('registrationFee')?.setValue(res.data.registrationFee);
          this.FeeForm.get('practicalFee')?.setValue(res.data.practicalFee);
          this.FeeForm.get('materialFee')?.setValue(res.data.materialFee);
          this.FeeForm.get('presessional')?.setValue(res.data.presessional);
          this.FeeForm.get('examFee')?.setValue(res.data.examFee);
          this.FeeForm.get('othersFee')?.setValue(res.data.othersFee);
          this.FeeForm.get('scholarship')?.setValue(res.data.scholarship);
          this.FeeForm.get('totalFee')?.setValue(res.data.totalFee);
          this.FeeForm.get('depositAmount')?.setValue(res.data.depositAmount);
          this.FeeForm.get('reservationFee')?.setValue(res.data.reservationFee);
          this.FeeForm.get('totalInstallments')?.setValue(res.data.totalInstallments);
          this.FeeForm.get('notes')?.setValue(res.data.notes);
          this.actualTotalFee = res.data.totalFee;
          this.grossFee = res.data.totalFee - res.data.depositAmount;
          var RoleIds: FormArray = this.FeeForm.get('installments') as FormArray;
          res.data.installments.forEach(ele => {
            RoleIds.controls.push(this.formBuilder.group({
              installmentID: [ele.installmentID],
              installmentDue: [new DatePipe('en-US').transform(ele.installmentDue, 'yyyy-MM-dd'), Validators.required],
              installmentAmount: [ele.installmentAmount, [Validators.required, Validators.pattern(/(^0$)|(^[1-9]\d{0,8}$)/), Validators.min(1)]]
            }));
          });
          this.FeeForm.get('installments').updateValueAndValidity();
          if (this.arouter.snapshot.url[0].path == 'ViewFee') {
            this.FeeForm.disable();
            this.isView = true;
          }
          else {
            this.isView = false;
          }
          this.config.editable = !this.isView
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
          //this.toastr.ErrorToastr("Something went wrong");
          $('#loader').hide();
        }
      })
    }
  }

  get f() {
    return this.FeeForm.controls;
  }

  saveFee() {
    if (this.FeeForm.valid) {
      var formVal = JSON.parse(JSON.stringify(this.FeeForm.getRawValue()));
      if (formVal.reservationFee == null || formVal.reservationFee == "") {
        formVal.reservationFee = 0;
      }
      this.FeeServices.saveFee(formVal).subscribe(res => {
        if (res.status) {
          this.toastr.SuccessToastr("Fee module is submitted successfully.");
          this.FeeForm.reset();
          this.actualTotalFee = 0;
          this.grossFee = 0;
          this.router.navigate(['/Fee'], { replaceUrl: true });
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

  // for checking the sum of all types of fee should be equal to total fee
  Sum() {
    var con = this.FeeForm.value;
    this.actualTotalFee = parseInt(con.standardFee == null ? 0 : con.standardFee) + parseInt(con.registrationFee == null ? 0 : con.registrationFee) + parseInt(con.practicalFee == null ? 0 : con.practicalFee) + parseInt(con.materialFee == null ? 0 : con.materialFee) + parseInt(con.presessional == null ? 0 : con.presessional) + parseInt(con.examFee == null ? 0 : con.examFee) + parseInt(con.othersFee == null ? 0 : con.othersFee) - parseInt(con.scholarship == null ? 0 : con.scholarship);
    if (this.actualTotalFee != parseInt(con.totalFee))
      this.feeError = true;
    else
      this.feeError = false;
  }

  // to set the remaining amount of installment by default
  setInstallment(i: number) {
    if (this.feeError == false) {
      if ((<FormArray>this.FeeForm.get('installments')).length == 1) {
        this.installmentControls[i].get('installmentAmount').setValue(this.actualTotalFee - parseInt(this.FeeForm.value.depositAmount == null ? 0 : this.FeeForm.value.depositAmount));
      } else {
        var totalAmt: number = 0;
        this.installmentControls.forEach(element => {
          totalAmt += parseInt(element.get('installmentAmount').value == null ? 0 : element.get('installmentAmount').value);
        });
        if (totalAmt < this.grossFee) {
          this.installmentControls[i].get('installmentAmount').setValue(this.actualTotalFee - parseInt(this.FeeForm.value.depositAmount == null ? 0 : this.FeeForm.value.depositAmount) - totalAmt);
        }
      }
    }
  }

  // for getting the fee after subtracting the deposit from total fee
  setGrossFee() {
    if (this.actualTotalFee == this.FeeForm.value.totalFee) {
      if (this.actualTotalFee <= this.FeeForm.value.depositAmount) {
        this.FeeForm.get('depositAmount')?.setErrors({ 'depositError': true });
      } else {
        if (this.FeeForm.get("depositAmount").hasError("required")) {
          this.FeeForm.get('depositAmount')?.setErrors({ 'depositError': false });
        } else {
          this.FeeForm.get('depositAmount')?.setErrors(null);
        }
      }
      this.grossFee = this.actualTotalFee - parseInt(this.FeeForm.value.depositAmount == null ? 0 : this.FeeForm.value.depositAmount);
    }
  }

  // formgroup structure of installment ==> used in adding the installmentForm in installments formArray
  getInstallmentForm(): FormGroup {
    return this.formBuilder.group({
      installmentID: [0],
      installmentDue: [null, [Validators.required]],
      installmentAmount: [null, [Validators.required, Validators.pattern(/(^0$)|(^[1-9]\d{0,8}$)/), Validators.min(1)]]
    });
  }

  checkInstallment(i: number) {
    var totalInstallment = 0;
    this.installmentControls.forEach(element => {
      totalInstallment += parseInt(element.get('installmentAmount').value == null ? 0 : element.get('installmentAmount').value);
    });
    this.installmentError.length = this.installmentControls.length;
    if (totalInstallment > this.grossFee) {
      for (let k = 0; k < this.installmentError.length; k++) {
        if (i == k) {
          this.installmentError[k] = true;
          this.installmentFlag = true;
        } else {
          this.installmentError[k] = false;
          this.installmentFlag = false;
        }
      }
    } else {
      if (totalInstallment != this.grossFee) {
        this.installmentErr = true;
        this.remainingInstallment = this.grossFee - totalInstallment;
      } else {
        this.installmentErr = false;
        this.remainingInstallment = 0;
      }
      this.installmentError[i] = false;
      this.installmentFlag = false;
    }
  }

  // for adding the installmentForm in installments formArray
  addInstallment() {
    this.minmunInstallment = [];
    (this.FeeForm.controls['installments'] as FormArray).clear();
    var total = (this.FeeForm.value.totalInstallments == null ? 0 : parseInt(this.FeeForm.value.totalInstallments));
    var installmentAmt = this.grossFee / total;

    for (let i = 0; i < total; i++) {
      (<FormArray>this.FeeForm.get('installments')).push(this.getInstallmentForm());
      this.installmentControls[i].get('installmentAmount').setValue(installmentAmt);
      this.minmunInstallment.push(moment().format("YYYY-MM-DD"));
    }
  }

  // for removing the installmentForm from installments formArray
  removeInstallment(i: number) {
    if ((<FormArray>this.FeeForm.get('installments')).length > 1) {
      (<FormArray>this.FeeForm.get('installments')).removeAt(i);
      this.FeeForm.controls['totalInstallments'].setValue((<FormArray>this.FeeForm.get('installments')).length);
    }
  }

  // for getting the installmentControl ==> used in html file for getting the controll of installments for validation
  get installmentControls() {
    return (<FormArray>this.FeeForm.get('installments')).controls;
  }

  // for navigating page back to Fee-dashboard
  closeFee() {
    this.router.navigate(['/Fee'], { replaceUrl: true });
  }

  FeeAvailable() {
    var Input = {
      intakeId: (this.FeeForm.value.intakeId == null ? 0 : this.FeeForm.value.intakeId),
      courseId: (this.FeeForm.value.courseId == null ? 0 : this.FeeForm.value.courseId),
      campusId: (this.FeeForm.value.campusId == null ? 0 : this.FeeForm.value.campusId)
    }

    this.FeeServices.IsFeeAvailable(Input).subscribe(res => {
      if (res.status) {
        if (res.data) {
          this.intakeCourseCampusErr = true;
        } else {
          this.intakeCourseCampusErr = false;
        }
      }
    }, (err: any) => {
      this.toastr.ErrorToastr("Something missing");
    })
  }
  setMinimumInstallmentValues(id) {
    if (id < this.minmunInstallment.length) {
      this.minmunInstallment[id + 1] = (<FormArray>this.FeeForm.get('installments')).value[id].installmentDue
    }
  }

  getCourseByCampus() {
    // alert("course")
    $("#loader").show();
    this.f['courseId'].setValue(null);
    this.f['intakeId'].setValue(null);
    let input = {
      campusId: this.f['campusId'].value
    }
    this.CourseServices.getCoursesByCampus(input).subscribe(res => {
      if (res.status) {
        this.courses = res.data.records;
      }
      else {
        this.toastr.ErrorToastr(res.message);
      }
      $("#loader").hide();
    }, (err: any) => {
      $("#loader").hide();
      this.toastr.ErrorToastr("Something went wrong");
      console.log(err);
    })
  }

  getIntakeByCampusCourse() {
    // alert("intake")
    $("#loader").show();
    this.f['intakeId'].setValue(null);
    let input = {
      campusId: this.f['campusId'].value,
      courseId: this.f['courseId'].value
    }
    this.IntakeServices.getIntakesByCampusCourse(input).subscribe(res => {
      if (res.status) {
        this.intakes = res.data.records;
        this.intakes.forEach(element => {
          element.intakeName = element.intakeName + ' - ' + moment(element.endDate + 'Z').format('YYYY')
        });
      }
      else {
        this.toastr.ErrorToastr(res.message);
      }
      $("#loader").hide();
    }, (err: any) => {
      $("#loader").hide();
      this.toastr.ErrorToastr("Something went wrong");
      console.log(err);
    })

    let input1 = {
      Id: this.f['courseId'].value
    }
    this.CourseServices.getCourseById(input1).subscribe(res => {
      if (res.status) {
        this.setMax = moment(res.data.endDate).format("YYYY-MM-DD");
      }
      else {
        this.toastr.ErrorToastr(res.message);
      }
      $("#loader").hide();
    }, (err: any) => {
      $("#loader").hide();
      this.toastr.ErrorToastr("Something went wrong");
      console.log(err);
    })
  }

duemaxdate : any;
maxduedate : any;
  changedata() {
    let intake = this.f['intakeId'].value;
    let data = this.intakes.find(m => m.intakeId == intake);
    // this.duemaxdate = data.endDate;
    this.duemaxdate = new Date(data.endDate);
    var month = this.duemaxdate.getMonth().toString().length
    if(month == 1)
      if (this.duemaxdate.getMonth() <= 12)
      month = "0" + (this.duemaxdate.getMonth() + 1);
      else
        month = "0" + (this.duemaxdate.getMonth());
      else
      month = (this.duemaxdate.getMonth() + 1)
    if (this.duemaxdate.getMonth() == "00")
      month = "01";
    var date = this.duemaxdate.getDay().toString().length
    if (date == 1)
      if (this.duemaxdate.getMonth() > 1)
      date = "0" + (this.duemaxdate.getDay() - 1 );
      else
        date = "0" + (this.duemaxdate.getDay());
    if (this.duemaxdate.getDay() == "00")
      date = "01";
     else
      date = "0" + (this.duemaxdate.getDay() - 1);
    this.maxduedate = this.duemaxdate.getFullYear() + "-" + month + "-" + date
  }
}
