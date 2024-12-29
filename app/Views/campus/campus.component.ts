import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Campus } from 'src/app/models/campus.model';
import { Course } from 'src/app/models/course.model';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { CampusService } from 'src/app/services/campus.service';
import { CoursesService } from 'src/app/services/courses.service';
import { ToastrServiceService } from 'src/app/services/toastr-service.service';
import { AccountService } from 'src/app/Services/account.service';
import { Country } from 'src/app/Models/country.model';
import { City } from 'src/app/Models/city.model';
import { forkJoin } from 'rxjs';
import { EmittService } from 'src/app/Services/emitt.service';
import { IntakeService } from 'src/app/services/intake.service';
import { Intake } from 'src/app/models/intake.model';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-campus',
  templateUrl: './campus.component.html',
  styleUrls: ['./campus.component.sass']
})
export class CampusComponent implements OnInit {
  isSubmitted: boolean = false;
  modalTitle = 'Add Campus';
  nrSelect: string = '';
  countries: Array<Country> = [];
  cities: Array<City> = [];
  selectedCourse: Array<number> = [];
  currentDate = new Date();
  courses: Array<Course> = [];
  intakes: Array<Intake> = [];
  dtOptions: DataTables.Settings = {};
  campusForm: FormGroup = new FormGroup({
    campusName: new FormControl(),
    campusId: new FormControl(),
    countryId: new FormControl(),
    cityId: new FormControl(),
    // course: new FormArray([])
  });
  isView = false;
  campuses: Array<Campus> = [];
  campus?: Campus;
  constructor(private modalService: NgbModal, private campusService: CampusService, private courseServive: CoursesService, private formBuilder: FormBuilder, private router: Router, private alerts: AlertServiceService, private toastr: ToastrServiceService, private account: AccountService, private emittService: EmittService, private intakeService: IntakeService) {
    this.campusForm = formBuilder.group({
      campusName: ['', [Validators.required,this.noWhitespaceValidator]],
      campusId: ['0'],
      countryId: ['', Validators.required],
      cityId: ['', Validators.required],
      // course: formBuilder.array([], [Validators.required])
    })
    emittService.onChangeAddApplicationbtnHideShow(false);
  }

  public noWhitespaceValidator(control: FormControl) {
    return (control.value || '').trim().length? null : { 'whitespace': true };
  }
  
  
  ngOnInit(): void {
    this.loadForm();
    this.loadCampus();
  }
  get f() {
    return this.campusForm.controls;
  }

  loadCampus() {
    $('#loader').show();

    let input = {
      size: 10,
      index: 1,
      search: '',
      orderBy: '',
      orderByDirection: '',
    }

    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching: true,
      language: {
        infoFiltered: ""
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.campuses = [];
        input.size = dataTablesParameters.length;
        input.index = dataTablesParameters.start / dataTablesParameters.length;
        input.search = dataTablesParameters.search.value;
        input.orderByDirection = dataTablesParameters.order[0].dir;
        input.orderBy = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
        input.index++;
        this.campusService.getAllCampaus(input).subscribe(res => {
          console.log("result", res);
          if (res.status) {
            this.campuses = res.data.records;
          }
          else {
            this.toastr.ErrorToastr("Something went wrong");
          }

          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: []
          });
          $('#loader').hide();
        }, (err: any) => {
          $('#loader').hide();
          if (err.status == 401) {
            this.router.navigate(['/'])
          }
          else {
            this.toastr.ErrorToastr("Something went wrong");
          }
        });
      },
      columns: [{ data: '', orderable: false }, { data: 'campusName', orderable: true }, { data: 'countryName', orderable: true }, { data: 'cityName', orderable: true }],
      autoWidth: false
    }
  }

  loadForm() {
    $('#loader').show();
    let paginationInput = {
      index: 0,
      size: 0
    }
    var courseReq = this.courseServive.getAllCourses(paginationInput);
    var intakeReq = this.intakeService.getAllIntake(paginationInput);
    var countryReq = this.account.getCountries();
    forkJoin([courseReq, intakeReq, countryReq]).subscribe(result => {

      if (result[0]) {
        if (result[0].status) {
          // this.courses = result[0].data.records;
          result[0].data.records.forEach(element => {
            if (formatDate(element.startDate, 'yyyy-MM-dd', 'en_US') > formatDate(this.currentDate, 'yyyy-MM-dd', 'en_US')) {
              this.courses.push(element);
            }
          });
        }
        else {

          this.toastr.ErrorToastr(result[0].message);
        }
      }
      if (result[1]) {
        if (result[1].status) {
          // this.intakes = result[1].data.records;
          result[1].data.records.forEach(element => {
            if (formatDate(element.endDate, 'yyyy-MM-dd', 'en_US') > formatDate(this.currentDate, 'yyyy-MM-dd', 'en_US')) {
              this.intakes.push(element);
            }
          });
          this.courses.forEach(c => {
            c.intakes = [];
            this.intakes.forEach(element => {
              if (formatDate(element.endDate, 'yyyy-MM-dd', 'en_US') < formatDate(c.endDate, 'yyyy-MM-dd', 'en_US')) {
                c.intakes.push(element);
              }
            });
          });
        }
        else {
          this.toastr.ErrorToastr(result[1].message);
        }
      }
      if (result[2]) {
        if (result[2].status) {
          this.countries = result[2].data;
        } else {
          // $('#loader').hide();
          this.toastr.ErrorToastr("Something went wrong");
        }
      }
      $('#loader').hide();
    })
    $('#loader').hide();
  }
  openModal(content: any, id: any = 0, isView: any = false) {
    this.campusForm.reset();
    this.isView = isView;
    if (id > 0) {
      this.modalTitle = 'Update Campus';
      if (isView) {
        this.modalTitle = 'View Campus';
        this.campusForm.disable();
      }
      else
        this.campusForm.enable();
      this.GetCampus(id);
    }
    else {
      this.modalTitle = "Add Campus"
      this.resetCampusForm();
    }
    this.isSubmitted = false;

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: false, size: 'xl' });
  }

  GetCampus(id: any) {
    this.resetCampusForm();
    this.campus = this.campuses.find(m => m.campusId == id);
    // this.getSelectedCourses(this.campus?.courseIntakes);
    this.campusForm.patchValue(JSON.parse(JSON.stringify(this.campus)));
   if(this.cities.length == 0)
    setTimeout(() => {
      this.changeContry(this.campus?.cityId);
    }, 50);
    this.campusForm.get('cityId')?.setValue(this.campus?.cityId);

  }

  resetCampusForm() {
    this.campusForm.get('campusName')?.setValue('');
    this.campusForm.get('countryId')?.setValue('');
    this.campusForm.get('cityId')?.setValue('');
    this.campusForm.get('campusId')?.setValue('0');
    this.selectedCourse = [];
    // var chkCourse = this.campusForm.get("course") as FormArray;
    // chkCourse.clear();
  }

  SaveCampus() {
    this.isSubmitted = true;
    if (this.campusForm.valid) {
      $('#loader').show();
      var formVal = JSON.parse(JSON.stringify(this.campusForm.getRawValue()));

      formVal.campusId = parseInt(formVal.campusId);
      this.campusService.saveCampaus(formVal).subscribe(res => {

        if (res.status) {
          this.modalService.dismissAll();
          if (res.data.campusId == 0)
            this.toastr.SuccessToastr("Campus added successfully.");
          else
            this.toastr.SuccessToastr("Campus updated successfully.");
          $(".table").DataTable().ajax.reload();
        }
        else {
          this.toastr.ErrorToastr("Campus is not added.");
        }
        $('#loader').hide();
      }, (err: any) => {
        $('#loader').hide();
        this.toastr.ErrorToastr("Something missing");
      })
    }
    else {
      if (this.campusForm.get("course").hasError("selectIntake")) {
        setTimeout(() => {
          this.campusForm.get('course').setErrors({ 'selectIntake': true });
        }, 1);
      }
    }
  }

  deleteCampus(id: any) {

    this.alerts.ComfirmAlert("Do you want to delete campus?", "Yes", "No").then(res => {
      if (res.isConfirmed) {
        $("#loader").show();
        let deleteInput = {
          id: id
        };
        this.campusService.deleteCampaus(deleteInput).subscribe(res => {

          if (res.status) {
            this.toastr.SuccessToastr("Campus deleted successfully.");
            $(".table").DataTable().ajax.reload();
          }
          else {

            this.toastr.ErrorToastr(res.message);
          }
          $("#loader").hide();
        },
          (err: any) => {
            $('#loader').hide();
            if (err.status == 401) {
              this.router.navigate(['/']);
            }
            else {
              this.toastr.ErrorToastr("Something went wrong");
            }
          })
      }
    })
  }

  onCourseChecked(e: any) {
    if (e.target.checked) {
      this.selectedCourse.push(parseInt(e.target.value));
      if (!this.isSelectCourseAndIntakeByCourse(e.target.value, true)) {
        this.campusForm.get('course')?.setErrors({ 'selectIntake': true });
      }
    } else {
      this.removeIntakeByCourse(e.target.value);
      let index = this.selectedCourse.findIndex(m => m == e.target.value);
      this.selectedCourse.splice(index, 1);
      if (!this.isSelectCourseAndIntakeByCourse(e.target.value, false)) {
        this.campusForm.get('course')?.setErrors({ 'selectIntake': true });
      }
      else {
        this.campusForm.get('course')?.setErrors(null);
      }
    }
  }
  onIntakeChange(e: any) {
    var chkcourse: FormArray = this.campusForm.get('course') as FormArray;
    var courseIntakeId = e.target.value as string;
    var courseId = parseInt(courseIntakeId.split(",")[0]);
    if (e.target.checked) {
      if (this.selectedCourse.findIndex(m => m == courseId) == -1) {
        this.selectedCourse.push(courseId);
      }
      chkcourse.push(new FormControl(courseIntakeId));
      if (!this.isSelectCourseAndIntake(courseIntakeId, chkcourse)) {
        // this.campusForm.get('course')?.setErrors({ 'selectIntake': false });
        this.campusForm.get('course')?.setErrors(null);
      }
    } else {
      let index = chkcourse.controls.findIndex(m => m.value == e.target.value);
      chkcourse.removeAt(index);
      if (!this.isSelectCourseAndIntake(courseIntakeId, chkcourse)) {
        this.campusForm.get('course')?.setErrors({ 'selectIntake': true });
      }
    }
  }
  // isSelectCourseAndIntake(courseIntakeId:any, chkcourse:FormArray){
  //   var courseId = parseInt(courseIntakeId.split(',')[0])
  //   var courseIds:Array<number>=[];
  //   for(let i=0;i<chkcourse.controls.length;i++)
  //    { if(courseIds.findIndex(m=>m==parseInt(chkcourse.controls[i].value.split(',')[0]))<0)
  //       {
  //         if(this.selectedCourse.findIndex(m=>m == parseInt(chkcourse.controls[i].value.split(',')[0]))<0)
  //           return false;
  //         courseIds.push(parseInt(chkcourse.controls[i].value.split(',')[0]))
  //       }
  //   }
  // }
  isSelectCourseAndIntake(courseIntakeId: any, chkcourse: FormArray) {
    var courseId = parseInt(courseIntakeId.split(',')[0])
    var courseIds: Array<number> = [];
    for (let i = 0; i < chkcourse.controls.length; i++) {
      if (courseIds.findIndex(m => m == parseInt(chkcourse.controls[i].value.split(',')[0])) < 0) {
        if (this.selectedCourse.findIndex(m => m == parseInt(chkcourse.controls[i].value.split(',')[0])) < 0)
          return false;
        courseIds.push(parseInt(chkcourse.controls[i].value.split(',')[0]))
      }
    }
    if (this.selectedCourse.findIndex(m => m == courseId) >= 0) {
      if (this.selectedCourse.length == 1)
        return true;
      else if (this.selectedCourse.length == 1 && chkcourse.controls.length == 0)
        return false
      else {
        for (let i = 0; i < this.selectedCourse.length; i++) {
          if (courseIds.findIndex(m => m == this.selectedCourse[i]) < 0) {
            return false;
          }
        }
        return true;
      }
    }
    else {
      return false;
    }
  }

  getSelectedCourses(courseIntakes: any) {
    courseIntakes.forEach((courseIntake: any) => {
      if (this.selectedCourse.findIndex(m => m == parseInt(courseIntake.split(',')[0])) < 0)
        this.selectedCourse.push(courseIntake.split(',')[0]);
      var chkcourse: FormArray = this.campusForm.get('course') as FormArray;
      chkcourse.push(new FormControl(courseIntake));
    });
  }

  checkedCourse(id: any) {
    return this.selectedCourse.findIndex(m => m == id) >= 0;
  }

  checkhedIntake(courseId: any, intake: any) {
    var chkcourse: FormArray = this.campusForm.get('course') as FormArray;
    return chkcourse.controls.findIndex(m => m.value == (courseId + ',' + intake)) >= 0;
  }
  removeIntakeByCourse(courseId: any) {
    var chkcourse: FormArray = this.campusForm.get('course') as FormArray;
    var IntakeToRemove = chkcourse.controls.filter(x => (x.value as string).split(',')[0] == courseId);
    IntakeToRemove.forEach(element => {
      chkcourse.controls.splice(chkcourse.controls.findIndex(x => x === element), 1)
    });
  }
  isSelectCourseAndIntakeByCourse(id: any, isChecked: any) {
    var chkcourse: FormArray = this.campusForm.get('course') as FormArray;
    var tempCourseIds: Array<number> = [];
    for (var i = 0; i < chkcourse.controls.length; i++) {
      if (tempCourseIds.findIndex(m => m == chkcourse.controls[i].value.split(',')[0]) < 0) {
        tempCourseIds.push(parseInt(chkcourse.controls[i].value.split(',')[0]));
      }
    }
    if (isChecked) {
      return tempCourseIds.findIndex(m => m == parseInt(id)) >= 0;
    }
    else {
      for (var i = 0; i < this.selectedCourse.length; i++) {
        if (tempCourseIds.findIndex(m => m == this.selectedCourse[i]) < 0)
          return false;
      }
    }
    return true;
  }
  changeContry(cityid: any) {
    if(this.campusForm.get('countryId').value){
    $("#loader").show();
    this.campusForm.get('cityId').setValue('');
    let input = {
      id: this.campusForm.get('countryId').value
    }
    this.account.getCitiesByCountryId(input).subscribe(res => {
      if (res.status) {
        this.cities = res.data
        this.campusForm.get('cityId')?.setValue(cityid);
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
  }
}
