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

@Component({
  selector: 'app-univercity-detail',
  templateUrl: './univercity-detail.component.html',
  styleUrls: ['./univercity-detail.component.sass']
})
export class UnivercityDetailComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  UnivercityList: any;
   AddUnivercity: FormGroup = new FormGroup({
    Name: new FormControl(),
    Id: new FormControl(),
    Logo: new FormControl(),
    IsLogoShow: new FormControl(),
    location: new FormControl(),
    // course: new FormArray([])
  });
  constructor(private modalService: NgbModal,private fileValid: FileValidationService, private appConfig: AppConfig, private campusService: CampusService,private Univercity : UnivercityService, private courseServive: CoursesService, private formBuilder: FormBuilder, private router: Router, private alerts: AlertServiceService, private toastr: ToastrServiceService, private account: AccountService, private emittService: EmittService, private intakeService: IntakeService) {
this.AddUnivercity = formBuilder.group({
      Name: ['', Validators.required],
      Id: [0],
      Logo: [''],
      location: ['', Validators.required],
      IsLogoShow: [false],
      // course: formBuilder.array([], [Validators.required])
    })
  }
baseurl : any = this.appConfig.baseServiceUrl;
  ngOnInit(): void {
    this.LoadData();
  }
title:any;
  ActiveDeActive(Id:any,status:any){
    if(status)
      this.title = "Deactivate this"
    else
      this.title = "Deactivate this"

 this.alerts.ComfirmAlert("Do you want to "+this.title+" University?", "Yes", "No").then(res => {
      if (res.isConfirmed) {
        let model ={
          Id : Id,
          Status : status
        }
        this.Univercity.ActDeactiveUnivercity(model).subscribe(res => {
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

  get f() {
    return this.AddUnivercity.controls;
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
        this.UnivercityList = [];
        input.size = dataTablesParameters.length;
        input.index = dataTablesParameters.start / dataTablesParameters.length;
        input.search = dataTablesParameters.search.value;
        input.orderByDirection = dataTablesParameters.order[0].dir;
        input.orderBy = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
        input.index++;
        this.Univercity.GetAllUnivercity(input).subscribe(res => {

          if (res.status) {
            this.UnivercityList = res.data.records;
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
      columns: [{ data: '', orderable: true }, { data: 'name', orderable: true }, { data: 'logo', orderable: true }, { data: 'isLogoShow', orderable: true },{ data: 'isLogoShow', orderable: true }],
      autoWidth: false
    }
  }
isSubmitted:any = false;
  openModal(content: any, id: any = 0, isView: any = false) {
    this.AddUnivercity.reset();
    this.Logoname = "";
    this.isSubmitted = false;
    this.IsLogofileVisible = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: false, size: 'xl' });
  }
Logoname:any= ";"
   EditData(content: any, id: any = 0){
    this.AddUnivercity.reset();
    this.isSubmitted = false;
    this.Logoname = "";
    let data = this.UnivercityList.find(A => A.id == id);
    this.AddUnivercity.get('location')?.setValue(data.location);
    // this.AddUnivercity.get('IsLogoShow')?.setValue(data.isLogoShow);
    this.Logoname = data.logo;
    this.AddUnivercity.get('Logo')?.setValue(data.logo);
    this.AddUnivercity.get('Name')?.setValue(data.name);
    this.AddUnivercity.get('Id')?.setValue(data.id);
    // this.AddUnivercity.get('CourseId')?.enable();
    // this.AddUniversityCourse.get('Date')?.enable();
    // this.AddUniversityCourse.get('CourseName')?.enable();
    // this.AddUniversityCourse.get('EntryRequirements')?.enable();
    // this.AddUniversityCourse.get('Notes')?.enable();
    // this.AddUniversityCourse.get('ProgressionInfo')?.enable();
    // this.AddUniversityCourse.get('UniversityId')?.enable();
    //  $("#SaveUniversitycourse").prop('disabled', false);
    // this.IsSaveUniversitycourse = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: false, size: 'xl' });
    if(data.isLogoShow){
    $("#IsLogoShowId").prop( "checked", true );
    this.IsLogofileVisible = true;
    }
    else{
    $("#IsLogoShowId").prop( "checked", false );
    this.IsLogofileVisible = false;
    }
  }
  IsLogofileVisible:any=false;
  IsLogofile(){
if($('#IsLogoShowId').is(":checked")){
  this.IsLogofileVisible = true;
  this.AddUnivercity.get("Logo")?.addValidators(Validators.required);
}else{
  this.IsLogofileVisible = false;
  this.AddUnivercity.get("Logo")?.removeValidators(Validators.required);
}
  }
saveUnivercity(){
 this.isSubmitted = true;
    if (this.AddUnivercity.valid) {
      $('#loader').show();
      var formVal = JSON.parse(JSON.stringify(this.AddUnivercity.getRawValue()));
      if(this.base64File == null || this.base64File == undefined)
      formVal.Logo = "";
      else
      formVal.Logo = this.base64File;
      if(this.base64FileName == null || this.base64FileName == undefined)
      formVal.LogoName = "";
      else
      formVal.LogoName = this.base64FileName;
      // formVal.Id = parseInt(formVal.Id);
      if(formVal.Id == null)
      formVal.Id = 0;
      formVal.IsLogoShow = $('#IsLogoShowId').is(":checked");
      this.Univercity.AddUnivercity(formVal).subscribe(res => {
        if (res.status) {
          this.modalService.dismissAll();
           this.toastr.SuccessToastr("successfullly Updated.");
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
isValidFile:any = false;
base64FileName:any;
base64File:any;
convertFileToBase64(event: any) {
    const files = event.target.files;
    this.Logoname = "";
    if (this.fileValid.checkFileType(files)) {
      this.isValidFile = true;
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
      this.base64FileName = file.name;
    }
    else {
      this.isValidFile = false;
      this.AddUnivercity.get('Logo')?.setValue('');
    }

  }
  _handleReaderLoaded(e: any) {
    let reader = e.target;
    var base64result = reader.result.substr(reader.result.indexOf(',') + 1);
    this.base64File = base64result;
  }
}
