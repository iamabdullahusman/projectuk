import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Campus } from 'src/app/models/campus.model';
import { Course } from 'src/app/models/course.model';
import { AlertServiceService } from 'src/app/Services/alert-service.service';
import { CampusService } from 'src/app/services/campus.service';
import { CoursesService } from 'src/app/services/courses.service';
import { ToastrServiceService } from 'src/app/Services/toastr-service.service';
import { AccountService } from 'src/app/Services/account.service';
import { Country } from 'src/app/Models/country.model';
import { City } from 'src/app/Models/city.model';
import { forkJoin } from 'rxjs';
import { EmittService } from 'src/app/Services/emitt.service';
import { IntakeService } from 'src/app/services/intake.service';
import { Intake } from 'src/app/models/intake.model';
import { formatDate } from '@angular/common';
import { UnivercityService } from 'src/app/Services/univercity.service';
import { FileValidationService } from 'src/app/Services/file-validation.service';
import { AppConfig } from 'src/app/appconfig';
import { ApplicationOfferService } from 'src/app/Services/application-offer.service';

@Component({
  selector: 'app-university-course-detail',
  templateUrl: './university-course-detail.component.html',
  styleUrls: ['./university-course-detail.component.sass']
})
export class UniversityCourseDetailComponent implements OnInit {
dtOptions: DataTables.Settings = {};
  UniversityCourseList: any = [];
   AddUniversityCourse: FormGroup = new FormGroup({
    CourseId: new FormControl(),
    CourseName: new FormControl(),
    Id: new FormControl(),
    UniversityId: new FormControl(),
    EntryRequirements: new FormControl(),
    ProgressionInfo: new FormControl(),
    Notes: new FormControl(),
    Date: new FormControl(),
    // course: new FormArray([])
  });
  constructor(private modalService: NgbModal,private fileValid: FileValidationService,private offerService: ApplicationOfferService, private appConfig: AppConfig, private campusService: CampusService,private Univercity : UnivercityService, private courseServive: CoursesService, private formBuilder: FormBuilder, private router: Router, private alerts: AlertServiceService, private toastr: ToastrServiceService, private account: AccountService, private emittService: EmittService, private intakeService: IntakeService) {
this.AddUniversityCourse = formBuilder.group({
      CourseId: [0],
      Id: [0],
      UniversityId: ['', Validators.required],
      CourseName: ['', Validators.required],
      ProgressionInfo: [''],
      Notes: [''],
      EntryRequirements: [''],
      Date: [''],
    })
  }
baseurl : any = this.appConfig.baseServiceUrl;
  ngOnInit(): void {
    this.LoadData();
    this.courseget();
  }

  get f() {
    return this.AddUniversityCourse.controls;
  }
title:any;
CourseData:any;
universitylist:any;
courseget(){
   this.offerService.getCourse().subscribe(res => {
      if (res.status) {
        this.CourseData = res.data;
      }
      else {
        this.toastr.ErrorToastr("Something went wrong");
      }
      $("#loader").hide();
    });
    this.Univercity.getUniversityList().subscribe(res => {
      if (res.status) {
        this.universitylist = res.data;
      }
      else {
        this.toastr.ErrorToastr("Something went wrong");
      }
      $("#loader").hide();
    });
}
  ActiveDeActive(Id:any,status:any){
    if(status)
      this.title = "Deactivate"
    else
      this.title = "Deactivate"

 this.alerts.ComfirmAlert("Do you want to "+this.title+" this University Course?", "Yes", "No").then(res => {
      if (res.isConfirmed) {
        let model ={
          Id : Id,
          Status : status
        }
        this.Univercity.ActDeacUniversityCourse(model).subscribe(res => {
        if (res.status) {
          this.modalService.dismissAll();
           this.toastr.SuccessToastr("Successfully Updated.");
          $(".table").DataTable().ajax.reload();
           $('#loader').hide();
        }
        else {
          this.toastr.ErrorToastr("University is not added.");
        }
      })
    }
    })
  }
   LoadData() {
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
        this.UniversityCourseList = [];
        input.size = dataTablesParameters.length;
        input.index = dataTablesParameters.start / dataTablesParameters.length;
        input.search = dataTablesParameters.search.value;
        input.orderByDirection = dataTablesParameters.order[0].dir;
        input.orderBy = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
        input.index++;
        this.Univercity.GetUniversitycourse(input).subscribe(res => {

          if (res.status) {
            this.UniversityCourseList = res.data.records;
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
      columns: [{ data: 'universityName', orderable: true }, { data: 'courseName', orderable: true }, { data: 'entryRequirements', orderable: true },{ data: 'date', orderable: true }],
      autoWidth: false
    }
  }
isSubmitted:any = false;
IsSaveUniversitycourse :any = false;
  openModal(content: any, id: any = 0, isView: any = false) {
    this.isedits = false;
    this.AddUniversityCourse.reset();
    this.AddnewdateCountList = [];
    this.isSubmitted = false;
    this.AddUniversityCourse.get('CourseId')?.enable();
    this.AddUniversityCourse.get('Date')?.enable();
    this.AddUniversityCourse.get('EntryRequirements')?.enable();
    this.AddUniversityCourse.get('Notes')?.enable();
    this.AddUniversityCourse.get('ProgressionInfo')?.enable();
    this.AddUniversityCourse.get('UniversityId')?.enable();
    this.AddUniversityCourse.get('CourseName')?.enable();
    $("#SaveUniversitycourse").prop('disabled', false);
    this.IsSaveUniversitycourse = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: false, size: 'xl' });
  }

  viewdata(content: any, id: any = 0){
    this.AddUniversityCourse.reset();
    this.isSubmitted = false;
    this.AddnewdateCountList = [];
    let data = this.UniversityCourseList.find(A => A.id == id);
     this.AddnewdateCountList = data.dateList;
    this.AddUniversityCourse.get('Date')?.setValue(data.date);
    this.AddUniversityCourse.get('EntryRequirements')?.setValue(data.entryRequirements);
    this.AddUniversityCourse.get('Notes')?.setValue(data.notes);
    this.AddUniversityCourse.get('CourseName')?.setValue(data.courseName);
    this.AddUniversityCourse.get('ProgressionInfo')?.setValue(data.progressionInfo);
    this.AddUniversityCourse.get('UniversityId')?.setValue(data.universityId);
    this.AddUniversityCourse.get('CourseId')?.setValue(data.courseId);
    this.AddUniversityCourse.get('CourseId')?.disable();
    this.AddUniversityCourse.get('Date')?.disable();
    this.AddUniversityCourse.get('EntryRequirements')?.disable();
    this.AddUniversityCourse.get('Notes')?.disable();
    this.AddUniversityCourse.get('ProgressionInfo')?.disable();
    this.AddUniversityCourse.get('CourseName')?.disable();
    this.AddUniversityCourse.get('UniversityId')?.disable();
    $("#SaveUniversitycourse").prop('disabled', true);
     this.IsSaveUniversitycourse = true;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: false, size: 'xl' });
  }
isedits :any;
   EditData(content: any, id: any = 0){
    this.AddUniversityCourse.reset();
    this.isSubmitted = false;
    this.AddnewdateCountList = [];
    this.isedits = true;
    let data = this.UniversityCourseList.find(A => A.id == id);
    this.AddnewdateCountList = data.dateList;
    this.AddUniversityCourse.get('Date')?.setValue(data.date);
    this.AddUniversityCourse.get('Id')?.setValue(data.id);
    this.AddUniversityCourse.get('EntryRequirements')?.setValue(data.entryRequirements);
    this.AddUniversityCourse.get('Notes')?.setValue(data.notes);
    this.AddUniversityCourse.get('CourseName')?.setValue(data.courseName);
    this.AddUniversityCourse.get('ProgressionInfo')?.setValue(data.progressionInfo);
    this.AddUniversityCourse.get('UniversityId')?.setValue(data.universityId);
    this.AddUniversityCourse.get('CourseId')?.setValue(data.courseId);
    this.AddUniversityCourse.get('CourseId')?.enable();
    this.AddUniversityCourse.get('Date')?.enable();
    this.AddUniversityCourse.get('CourseName')?.enable();
    this.AddUniversityCourse.get('EntryRequirements')?.enable();
    this.AddUniversityCourse.get('Notes')?.enable();
    this.AddUniversityCourse.get('ProgressionInfo')?.enable();
    this.AddUniversityCourse.get('UniversityId')?.enable();
     $("#SaveUniversitycourse").prop('disabled', false);
    this.IsSaveUniversitycourse = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: false, size: 'xl' });
  }
  AddnewdateCountList :any = ['default'];
  AddnewdateCount :any = 0;
AddDate(){
this.AddnewdateCountList.push(
 this.AddnewdateCount + 1
)
}

RemoveDate(id:any){
$("#maindaterow"+id+"").remove()
}

SaveUniversityCourse(){
 this.isSubmitted = true;
    if (this.AddUniversityCourse.valid) {
      $('#loader').show();
      var formVal = JSON.parse(JSON.stringify(this.AddUniversityCourse.getRawValue()));
      if(formVal.Id == null)
      formVal.Id = 0;
       if(formVal.ProgressionInfo == null)
      formVal.ProgressionInfo = "";
       if(formVal.Notes == null)
      formVal.Notes = "";
       if(formVal.EntryRequirements == null)
      formVal.EntryRequirements = "";
       if(formVal.CourseId == null)
      formVal.CourseId = 0;
      let datearry = [];
      let i = 1;
      this.AddnewdateCountList.forEach(element => {
        datearry.push($("#Extradate"+i+"").val())
        i = i + 1;
      });
      formVal.Date = datearry;
      this.Univercity.AddUniversityCourse(formVal).subscribe(res => {
        if (res.status) {
          this.modalService.dismissAll();
          this.AddnewdateCountList = [];
           this.toastr.SuccessToastr("Successfully Updated.");
          $(".table").DataTable().ajax.reload();
           $('#loader').hide();
        }
        else {
          this.toastr.ErrorToastr("University is not added.");
        }
        $('#loader').hide();
      }, (err: any) => {
        $('#loader').hide();
        this.toastr.ErrorToastr("Something missing");
      })
    }

}

}
