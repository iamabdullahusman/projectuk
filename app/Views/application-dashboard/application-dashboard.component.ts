import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { ApplicationForm } from 'src/app/models/application-form.model';
import { Getstagerecords } from 'src/app/Models/getstagerecords.model';
import { Campus } from 'src/app/models/campus.model';
import { Course } from 'src/app/models/course.model';
import { FeePayOption } from 'src/app/models/fee-pay-option.model';
import { Intake } from 'src/app/models/intake.model';
import { SocialPreference } from 'src/app/models/social-preference.model';
import { ApplicationService } from 'src/app/services/application.service';
import { CampusService } from 'src/app/services/campus.service';
import { CoursesService } from 'src/app/services/courses.service';
import { IntakeService } from 'src/app/services/intake.service';
import { ToastrServiceService } from 'src/app/services/toastr-service.service';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FileContent } from 'src/app/Models/file-content.model';
import { SocialreferenceService } from 'src/app/services/socialreference.service';
import { FeePayByService } from 'src/app/Services/feepayby.service';
import { EmittService } from 'src/app/Services/emitt.service';


@Component({
  selector: 'app-application-dashboard',
  templateUrl: './application-dashboard.component.html',
  styleUrls: ['./application-dashboard.component.sass']
})
export class ApplicationDashboardComponent implements OnInit {
  modalTitle = "";
  faAngleUp = faAngleUp;
  faAngleDown = faAngleDown;
  isSubmitted: boolean = false;
  isView: boolean = false;
  studentApplications: Array<ApplicationForm> = [];
  stageRecords: Array<Getstagerecords> = [];
  courses: Array<Course> = [];
  intakes: Array<Intake> = [];
  campuses: Array<Campus> = [];
  feePayOptions: Array<FeePayOption> = [];
  SocialPreferences: Array<SocialPreference> = [];
  application?: ApplicationForm = new ApplicationForm();

  Applicationform: FormGroup = new FormGroup({
    applicationSource: new FormControl(),
    applicationStatus: new FormControl(),
    visaTypeDetail: new FormControl(),
    visaType: new FormControl(),
    hasVisa: new FormControl(),
    medicalConditionDetail: new FormControl(),
    hasExistMedicalCondition: new FormControl(),
    socialRefrenceTypeDetails: new FormControl(),
    socialRefrenceType: new FormControl(),
    feePaybyDetail: new FormControl(),
    feePayby: new FormControl(),
    schoolCompletionYear: new FormControl(),
    secondarySchoolName: new FormControl(),
    lastSchoolQualification: new FormControl(),
    suggestedUniversity: new FormControl(),
    studyLocation: new FormControl(),
    courseName: new FormControl(),
    intake: new FormControl(),
    dateOfStudy: new FormControl(),
    parentEmail: new FormControl(),
    parentPhoneNo: new FormControl(),
    parentLastName: new FormControl(),
    parentFirstName: new FormControl(),
    applicationId: new FormControl(),
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl(),
    phoneNo: new FormControl(),
    dateOfBirth: new FormControl(),
    nationality: new FormControl(),
    countryOfResident: new FormControl(),
    adress: new FormControl(),
    applicationStatusName: new FormControl(),
  });

  inprogressId: number = 0;
  receivedId: number = 0;
  acceptedId: number = 0;
  rejectedId: number = 0;
  stageId: number = 2;
  totalInprogress: number = 0;
  totalReceived: number = 0;
  totalAccepted: number = 0;
  totalRejected: number = 0;
  qualification: FileContent;
  passport: FileContent;
  ieltsCert: FileContent;

  constructor(private formBuilder: FormBuilder, private applicationService: ApplicationService, private toastr: ToastrServiceService, private route: Router, private modalService: NgbModal, private campusService: CampusService, private intakeService: IntakeService, private courseService: CoursesService, private feepayService: FeePayByService, private socialReferanceService: SocialreferenceService, private emittService: EmittService) {
    this.Applicationform = formBuilder.group({
      applicationSource: [''],
      applicationStatus: [''],
      visaTypeDetail: [''],
      visaType: [''],
      hasVisa: [''],
      medicalConditionDetail: [''],
      hasExistMedicalCondition: ['', [Validators.required]],
      socialRefrenceTypeDetails: [''],
      socialRefrenceType: [''],
      feePaybyDetail: [''],
      feePayby: ['', [Validators.required]],
      schoolCompletionYear: ['', [Validators.required]],
      secondarySchoolName: ['', [Validators.required]],
      lastSchoolQualification: ['', [Validators.required]],
      suggestedUniversity: [''],
      studyLocation: ['', [Validators.required]],
      courseName: ['', [Validators.required]],
      intake: ['', [Validators.required]],
      dateOfStudy: ['', [Validators.required]],
      parentEmail: ['', [Validators.required, Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}")]],
      parentPhoneNo: ['', [Validators.required, Validators.pattern("[0-9]{10,12}")]],
      parentLastName: ['', [Validators.required]],
      parentFirstName: ['', [Validators.required]],
      applicationId: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}")]],
      phoneNo: ['', [Validators.required, Validators.pattern("[0-9]{10,12}")]],
      dateOfBirth: ['', [Validators.required]],
      nationality: ['', [Validators.required]],
      countryOfResident: ['', [Validators.required]],
      adress: ['', [Validators.required]],
    })

    emittService.onChangeAddApplicationbtnHideShow(true);
  }

  ngOnInit(): void {
    this.getStageRecord();
    this.loadStudentApplication();
    this.loadForm();
  }

  get f() {
    return this.Applicationform.controls;
  }

  getStageRecord() {
    $('#loader').show();
    let paginationModal = {
      index: 0,
      size: 0,
      stageId: 1
    };

    this.applicationService.getStageCount(paginationModal).subscribe(res => {
      if (res.status) {
        this.stageRecords = res.data;
        this.stageId = this.stageRecords.find(x => x.stageName == 'InProgress').stageId;
        this.inprogressId = this.stageRecords.find(x => x.stageName == 'InProgress').stageId;
        this.receivedId = this.stageRecords.find(x => x.stageName == 'Received').stageId;
        this.acceptedId = this.stageRecords.find(x => x.stageName == 'Accepted').stageId;
        this.rejectedId = this.stageRecords.find(x => x.stageName == 'Rejected').stageId;

        this.totalAccepted = this.stageRecords.find(x => x.stageName == 'Accepted').contentCount;
        this.totalInprogress = this.stageRecords.find(x => x.stageName == 'InProgress').contentCount;
        this.totalReceived = this.stageRecords.find(x => x.stageName == 'Received').contentCount;
        this.totalRejected = this.stageRecords.find(x => x.stageName == 'Rejected').contentCount;
        // $('#loader').hide();
      }
      else {
        this.toastr.ErrorToastr("Something went wrong");

      }
      $('#loader').hide();
    })
    $('#loader').hide();

  }

  getStageRecorId(Id) {
    this.stageId = Id;
    this.loadStudentApplication();
  }


  loadStudentApplication() {
    $('#loader').show();
    let input = {
      size: 15,
      index: 1,
      stageId: this.stageId
    }
    this.applicationService.getAllApplication(input).subscribe(res => {

      if (res.status) {
        this.studentApplications = res.data.records;
      }
      else {
        // $('#loader').hide();
        this.toastr.ErrorToastr("Something went wrong");
      }
      $('#loader').hide();
    }, (err: any) => {
      //$('#loader').hide();
      if (err.status == 401) {
        this.route.navigate(['/'])
      }
      else {
        this.toastr.ErrorToastr("Something went wrong");
      }
      $('#loader').hide();
    });

  }

  loadForm() {
    let paginationModal = {
      index: 0,
      size: 0
    };
    $('#loader').show();
    let coursesData = this.courseService.getAllCourses(paginationModal);
    let campusData = this.campusService.getAllCampaus(paginationModal);
    let intakeData = this.intakeService.getAllIntake(paginationModal);
    let FeePayOptionData = this.feepayService.getAllFeePayBy(paginationModal);
    let socialPreferenceData = this.socialReferanceService.getAllSocialRef(paginationModal);
    forkJoin([coursesData, campusData, intakeData, FeePayOptionData, socialPreferenceData]).subscribe(result => {

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
        }
        else {
          this.toastr.ErrorToastr(result[2].message);
        }
      }
      if (result[3]) {
        if (result[3].status) {
          this.feePayOptions = result[3].data.records;
        }
        else {
          this.toastr.ErrorToastr(result[3].message);
        }
      }
      if (result[4]) {
        if (result[4].status) {
          this.SocialPreferences = result[4].data.records;
        }
        else {
          this.toastr.ErrorToastr(result[4].message);
        }
      }
      $('#loader').hide();
    }, (err: any) => {
      $('#loader').hide();
      if (err.status == 401) {
        this.route.navigate(['/'])
      }
      else {
        this.toastr.ErrorToastr("Something went wrong");
      }
      $('#loader').hide();
    })

  }


  openApplication(content: any, id: any, mode: any = 'edit') {
    // $('#loader').show();
    this.isSubmitted = false;
    if (mode != 'edit') {
      this.modalTitle = "Student Application";
      this.isView = true;
      this.disableApplicationForm();
    }
    else {
      this.modalTitle = "Update Student Application";
      this.isView = false;
      this.enableApplicationForm();
    }
    this.getApplication(id);

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: false });
    document.getElementsByClassName("modal-dialog")[0].classList.add("modal-xl");
  }

  resetApplicationForm() {
    this.Applicationform.get("schoolCompletionYear")?.setValue('');
    this.Applicationform.get("secondarySchoolName")?.setValue('');
    this.Applicationform.get("visaTypeDetail")?.setValue('');
    this.Applicationform.get("visaType")?.setValue('');
    this.Applicationform.get("hasVisa")?.setValue('');
    this.Applicationform.get("hasExistMedicalCondition")?.setValue('');
    this.Applicationform.get("medicalConditionDetail")?.setValue('');
    this.Applicationform.get("lastSchoolQualification")?.setValue('');
    this.Applicationform.get("feePayby")?.setValue('');
    this.Applicationform.get("feePaybyDetail")?.setValue('');
    this.Applicationform.get("socialRefrenceType")?.setValue('');
    this.Applicationform.get("socialRefrenceTypeDetails")?.setValue('');
    this.Applicationform.get("studyLocation")?.setValue('');
    this.Applicationform.get("courseName")?.setValue('');
    this.Applicationform.get("intake")?.setValue('');
    this.Applicationform.get("dateOfStudy")?.setValue('');
    this.Applicationform.get("parentEmail")?.setValue('');
    this.Applicationform.get("parentPhoneNo")?.setValue('');
    this.Applicationform.get("parentLastName")?.setValue('');
    this.Applicationform.get("parentFirstName")?.setValue('');
    this.Applicationform.get("applicationId")?.setValue(0);
    this.Applicationform.get("firstName")?.setValue('');
    this.Applicationform.get("lastName")?.setValue('');
    this.Applicationform.get("email")?.setValue('');
    this.Applicationform.get("dateOfBirth")?.setValue('');
    this.Applicationform.get("nationality")?.setValue('');
    this.Applicationform.get("countryOfResident")?.setValue('');
    this.Applicationform.get("adress")?.setValue('');
    this.Applicationform.get("phoneNo")?.setValue('');
    this.Applicationform.get("applicationStatus")?.setValue(0);
    this.Applicationform.get("applicationSource")?.setValue(0);
  }

  SaveApplication() {
    this.isSubmitted = true;
    if (this.Applicationform.valid) {
      $('#loader').show();
      let input = JSON.parse(JSON.stringify(this.Applicationform.getRawValue()));
      input.intake = parseInt(input.intake);
      input.courseName = parseInt(input.courseName);
      input.studyLocation = parseInt(input.studyLocation);
      input.visaType = parseInt(input.visaType);
      input.feePayby = parseInt(input.feePayby);
      input.hasExistMedicalCondition = input.hasExistMedicalCondition == "true" ? true : false;
      input.hasVisa = input.hasVisa == "true" ? true : false;
      this.applicationService.saveApplication(input).subscribe(res => {
        if (res.status) {
          //$("#loader").hide();
          this.toastr.SuccessToastr("Student’s application successfully saved");
          this.modalService.dismissAll();
          this.loadStudentApplication();
        }
        else {
          this.toastr.ErrorToastr("Student's application is not saved");
        }
        $('#loader').hide();
      }, (err: any) => {
        // $('#loader').hide();
        this.toastr.ErrorToastr("Something went wrong");
        $('#loader').hide();
      })

    }
  }

  getApplication(id: any) {
    this.application = this.studentApplications.find(x => x.applicationId == id);
    this.Applicationform.patchValue(JSON.parse(JSON.stringify(this.application)));
  }

  disableApplicationForm() {
    this.Applicationform.get("schoolCompletionYear")?.disable();
    this.Applicationform.get("secondarySchoolName")?.disable();
    this.Applicationform.get("visaTypeDetail")?.disable();
    this.Applicationform.get("visaType")?.disable();
    this.Applicationform.get("hasVisa")?.disable();
    this.Applicationform.get("hasExistMedicalCondition")?.disable();
    this.Applicationform.get("medicalConditionDetail")?.disable();
    this.Applicationform.get("lastSchoolQualification")?.disable();
    this.Applicationform.get("feePayby")?.disable();
    this.Applicationform.get("feePaybyDetail")?.disable();
    this.Applicationform.get("socialRefrenceType")?.disable();
    this.Applicationform.get("socialRefrenceTypeDetails")?.disable();
    this.Applicationform.get("studyLocation")?.disable();
    this.Applicationform.get("courseName")?.disable();
    this.Applicationform.get("intake")?.disable();
    this.Applicationform.get("dateOfStudy")?.disable();
    this.Applicationform.get("parentEmail")?.disable();
    this.Applicationform.get("parentPhoneNo")?.disable();
    this.Applicationform.get("parentLastName")?.disable();
    this.Applicationform.get("parentFirstName")?.disable();
    this.Applicationform.get("applicationId")?.disable();
    this.Applicationform.get("firstName")?.disable();
    this.Applicationform.get("lastName")?.disable();
    this.Applicationform.get("email")?.disable();
    this.Applicationform.get("dateOfBirth")?.disable();
    this.Applicationform.get("nationality")?.disable();
    this.Applicationform.get("countryOfResident")?.disable();
    this.Applicationform.get("adress")?.disable();
    this.Applicationform.get("phoneNo")?.disable();
    this.Applicationform.get("applicationStatus")?.disable();
    this.Applicationform.get("applicationSource")?.disable();
  }

  enableApplicationForm() {
    this.Applicationform.get("schoolCompletionYear")?.enable();
    this.Applicationform.get("secondarySchoolName")?.enable();
    this.Applicationform.get("visaTypeDetail")?.enable();
    this.Applicationform.get("visaType")?.enable();
    this.Applicationform.get("hasVisa")?.enable();
    this.Applicationform.get("hasExistMedicalCondition")?.enable();
    this.Applicationform.get("medicalConditionDetail")?.enable();
    this.Applicationform.get("lastSchoolQualification")?.enable();
    this.Applicationform.get("feePayby")?.enable();
    this.Applicationform.get("feePaybyDetail")?.enable();
    this.Applicationform.get("socialRefrenceType")?.enable();
    this.Applicationform.get("socialRefrenceTypeDetails")?.enable();
    this.Applicationform.get("studyLocation")?.enable();
    this.Applicationform.get("courseName")?.enable();
    this.Applicationform.get("intake")?.enable();
    this.Applicationform.get("dateOfStudy")?.enable();
    this.Applicationform.get("parentEmail")?.enable();
    this.Applicationform.get("parentPhoneNo")?.enable();
    this.Applicationform.get("parentLastName")?.enable();
    this.Applicationform.get("parentFirstName")?.enable();
    this.Applicationform.get("applicationId")?.enable();
    this.Applicationform.get("firstName")?.enable();
    this.Applicationform.get("lastName")?.enable();
    this.Applicationform.get("email")?.enable();
    this.Applicationform.get("dateOfBirth")?.enable();
    this.Applicationform.get("nationality")?.enable();
    this.Applicationform.get("countryOfResident")?.enable();
    this.Applicationform.get("adress")?.enable();
    this.Applicationform.get("phoneNo")?.enable();
    this.Applicationform.get("applicationStatus")?.enable();
    this.Applicationform.get("applicationSource")?.enable();
  }
}
