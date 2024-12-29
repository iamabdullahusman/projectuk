import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { VisaService } from "src/app/Services/visa.service";
import { CoursesService } from "src/app/services/courses.service";
import { ToastrServiceService } from "src/app/Services/toastr-service.service";
import { EmittService } from "src/app/Services/emitt.service";
import { UserInquiryService } from "src/app/services/user-inquiry.service";
import { ApplicationService } from "src/app/services/application.service";
import { CdkDragDrop, transferArrayItem } from "@angular/cdk/drag-drop";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { FileValidationService } from "src/app/Services/file-validation.service";
import { KanbanService } from "src/app/Services/kanban.service";
import { ThrowStmt } from "@angular/compiler";
import { AccountService } from "src/app/Services/account.service";
import { SocialreferenceService } from "src/app/services/socialreference.service";
import { UserManagement } from "src/app/Services/user-management.service";
import { SessionStorageService } from "src/app/Services/session-storage.service";
import dayjs from "dayjs";
import { DatetimeService } from "src/app/Services/datetime.service";

@Component({
  selector: "app-visa",
  templateUrl: "./visa.component.html",
  styleUrls: ["./visa.component.sass"],
})
export class VisaComponent implements OnInit {
  inPreaparation: any;
  Scheduled: any;
  Refused: any;
  Awaiting: any;
  Granted: any;
  Archieved: any;
  maxDate = dayjs().format("YYYY-MM-DD");
  showMe: boolean = false;
  statuscheck: boolean = false;
  filecheck: boolean = false;
  url: boolean = false;
  archiveStatuses = [];
  visadata: any = {
    visaId: 0,
    applicationId: 0,
    visaStatus: 0,
    visaApplicationUrl: null,
    draftStatus: null,
    reason: null,
    fileUrl: null,
    fileName: null,
    applyDate: null,
    scheculeDate: null,
    grantedAt: null,
    rejectAt: null,
    applicationMaster: null,
    createdBy: null,
    createdDate: null,
    updatedBy: null,
    updatedDate: null,
  };

  headerCampusId: number = 0;
  headerIntakeId: number = 0;
  headername = "";
  name: string = "";
  requestFrom = "visa";
  ChangeManageby = [];
  ArchieveStatus: [];
  ApplicationStatus = [];
  application: any;
  datelabl = "";
  inquiryAssignedToId: any;
  archiveApplicationId = 0;
  StoreApplicatoinId: any;
  skipPrepairation = 0;
  skipSchedule = 0;
  skipAwaiting = 0;
  skipRefused = 0;
  skipResult = 0;
  skipArchive = 0;
  @ViewChild("ChangeVisaStatusModel") changeVisaStatusModel: ElementRef;
  @ViewChild("changeStatus") changeapplicationstatus: ElementRef;
  VisaStatusForm: FormGroup = new FormGroup({
    applicationId: new FormControl(),
    statusdate: new FormControl(),
    reason: new FormControl(),
    statusId: new FormControl(),
    fileContent: new FormControl(),
    applicationUrl: new FormControl(),
  });
  filterForm: FormGroup = new FormGroup({
    Course: new FormControl(),
    Stage: new FormControl(),
    AppliedDate: new FormControl(),
    AssignedTo: new FormControl(),
    Date: new FormControl(),
    Agent: new FormControl(),
    RM: new FormControl(),
    Country: new FormControl(),
    Source: new FormControl(),
    ApplicantName: new FormControl(),
  });
  archiveStatusForm: FormGroup = new FormGroup({
    applicationId: new FormControl(),
    statusId: new FormControl(),
    reason: new FormControl(),
  });
  constructor(
    private kanbanService: KanbanService,
    private formBuilder: FormBuilder,
    private userService: UserManagement,
    private sessionService: SessionStorageService,
    private courseService: CoursesService,
    private accountService: AccountService,
    private socialReferanceService: SocialreferenceService,
    private visaservices: VisaService,
    private courseservices: CoursesService,
    private router: Router,
    private toastr: ToastrServiceService,
    private emitService: EmittService,
    private inquiryServices: UserInquiryService,
    private route: Router,
    private applicationService: ApplicationService,
    private modalService: NgbModal,
    private filevalidation: FileValidationService,
    private dateTimeService: DatetimeService
  ) {
    this.buildForm();
    emitService.onChangeAddApplicationbtnHideShow(false);
    emitService.GetCampusIntakeChange().subscribe((res) => {
      this.headerCampusId = res.campusId;
      this.headerIntakeId = res.intakeId;
      this.headername = res.name;
    });
    emitService.getapplicationChange().subscribe((res) => {
      if (this.requestFrom == res) this.loadData();
    });

    this.archiveStatusForm = formBuilder.group({
      applicationId: [""],
      statusId: [null, [Validators.required]],
      reason: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.loadForm();
    this.headerFilter();
    this.inquiryAssignedToId = 0;
    this.getDroupdowndata();
    this.loadAndRMSStatus();
  }

  buildForm() {
    this.VisaStatusForm = this.formBuilder.group({
      statusdate: [null, [Validators.required]],
      reason: [null, [Validators.required]],
      statusId: [],
      applicationUrl: [""],
      fileContent: [null, [Validators.required]],
      applicationId: [""],
    });
    this.VisaStatusForm.get("statusdate").valueChanges.subscribe((val) => {
      if (dayjs().startOf("date").isBefore(dayjs(val))) {
        this.f["statusdate"].setErrors({ invalidDate: true });
      }
    });
  }
  loadAndRMSStatus() {
    this.applicationStages.push({
      stageName: "Inpreparation",
      stageId: 1,
    });
    this.applicationStages.push({
      stageName: "Awaiting",
      stageId: 2,
    });
    this.applicationStages.push({
      stageName: "Granted",
      stageId: 3,
    });
    this.applicationStages.push({
      stageName: "Refused",
      stageId: 4,
    });
    this.applicationStages.push({
      stageName: "Reapplied",
      stageId: 5,
    });
    this.applicationStages.push({
      stageName: "Archive",
      stageId: 6,
    });
    this.applicationStages.push({
      stageName: "Rejected",
      stageId: 7,
    });
    this.applicationStages.push({
      stageName: "Withdrawn",
      stageId: 8,
    });
    this.applicationStages.push({
      stageName: "OnHold",
      stageId: 9,
    });
  }

  skipInprogressData: any;
  datePickerChange(e) {
    if (!e.startDate) this.filterForm.get("AppliedDate").reset();
  }
  courses: any;
  countries: any;
  sources: any;
  RMs: any;
  Agents: any;
  applicationStages = [];
  getDroupdowndata() {
    this.inquiryAssignedToId = 0;
    let paginationModal = {
      index: 0,
      size: 0,
    };
    let RMInputs = {
      userType: 3,
    };
    $("#loader").show();
    let coursesData = this.courseService.getAllCourses(paginationModal);
    let countryData = this.accountService.getCountries();
    let socialPreferenceData =
      this.socialReferanceService.getAllSocialRef(paginationModal);
    let managedUsers = this.applicationService.GetManageUser();
    forkJoin([
      coursesData,
      countryData,
      socialPreferenceData,
      managedUsers,
    ]).subscribe(
      (result) => {
        $("#loader").hide();

        if (result[0]) {
          if (result[0].status) {
            this.courses = result[0].data.records;
          } else {
            this.toastr.ErrorToastr(result[0].message);
          }
        }
        if (result[1]) {
          if (result[1].status) {
            this.countries = result[1].data;
          } else {
            this.toastr.ErrorToastr(result[1].message);
          }
        }
        if (result[2]) {
          if (result[2].status) {
            this.sources = result[2].data.records;
          } else {
            this.toastr.ErrorToastr(result[2].message);
          }
        }
        if (result[3]) {
          if (result[3].status) {
            this.RMs = result[3].data.filter((m) => m.userTypeId == 3);
            this.agents = result[3].data.filter((m) => m.userTypeId == 4);
            this.assignedTo = result[3].data.filter(
              (m) => m.userTypeId == 1 || m.userTypeId == 2
            );
          } else {
            this.toastr.ErrorToastr(result[3].message);
          }
        }
      },
      (err: any) => {
        $("#loader").hide();
        if (err.status == 401) {
          this.router.navigate(["/"]);
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
      }
    );
    this.courseService.getAllCourses(paginationModal).subscribe((res) => {
      if (res.status) {
        this.courses = res.data.records;
      } else {
        this.toastr.ErrorToastr(res.message);
      }
    });
  }
  agents: any;
  assignedTo: any;
  get f() {
    return this.VisaStatusForm.controls;
  }
  get f1() {
    return this.archiveStatusForm.controls;
  }
  headerFilter() {
    this.emitService.GetCampusIntakeChange().subscribe((res) => {
      this.headerCampusId = res.campusId;
      this.headerIntakeId = res.intakeId;
      this.headername = res.name;
      this.loadData();
    });
  }

  groupByFn = (item) => item.userTypeName;
  selectedAccounts = [1];
  groupValueFn = (_: string, children: any[]) => ({
    name: children[0].userTypeName,
  });

  loadData() {
    this.headerCampusId =
      this.headerCampusId == 0
        ? parseInt(this.sessionService.getCampusId())
        : this.headerCampusId;
    this.headerIntakeId =
      this.headerIntakeId == 0
        ? parseInt(this.sessionService.getIntakeId())
        : this.headerIntakeId;
    this.skipPrepairation = 0;
    $("#loader").show();
    var statuses = this.kanbanService.getStagesByPerent({ id: 14 });
    let AppliedDatestartDate = null;
    let AppliedDateendDate = null;
    var inputData = JSON.parse(JSON.stringify(this.filterForm.getRawValue()));
    if (inputData.AppliedDate == null) AppliedDatestartDate = null;
    else
      AppliedDatestartDate = this.dateTimeService.setWriteOffset(
        dayjs(inputData.AppliedDate.startDate).toDate()
      );
    if (inputData.AppliedDate == null) AppliedDateendDate = null;
    else
      AppliedDateendDate = this.dateTimeService.setWriteOffset(
        dayjs(inputData.AppliedDate.startDate).toDate()
      );
    let paginationModal = {
      ...inputData,
      campusId: parseInt(this.sessionService.getCampusId()),
      intakeId: parseInt(this.sessionService.getIntakeId()),
      skip: this.skipPrepairation,
      take: 10,
      StageId: 14,
      appliedStartDate: AppliedDatestartDate,
      appliedEndDate: AppliedDateendDate,
    };
    var getvisadata = this.visaservices.GetVisa(paginationModal);
    //let VisaDataRequest = this.visaservices.GetVisaDetails(input);
    forkJoin(statuses, getvisadata).subscribe((result) => {
      if (result[0]) {
        if (result[0].status) {
          this.ApplicationStatus = result[0].data;
          this.archiveStatuses = result[0].data.subStages.filter(
            (m) =>
              m.stageName.toLowerCase() != "preparation" &&
              m.stageName.toLowerCase() != "schedule" &&
              m.stageName.toLowerCase() != "awaiting" &&
              m.stageName.toLowerCase() != "granted" &&
              m.stageName.toLowerCase() != "declined" &&
              m.stageName.toLowerCase() != "applying" &&
              m.stageName.toLowerCase() != "reapplied"
          );
        } else {
          this.toastr.ErrorToastr(result[0].message);
        }
      }
      if (result[1]) {
        if (result[1].status) {
          //this.visadata=result[1].data;
          this.skipPrepairation = 10;
          this.skipRefused = 10;
          this.skipAwaiting = 10;
          this.skipArchive = 10;
          this.skipResult = 10;
          this.inPreaparation = result[1].data.find((m) => m.visaStatus == 1);
          // this.Scheduled = result[1].data.find(m => m.visaStatus == 2);
          this.Refused = result[1].data.find((m) => m.visaStatus == 4);
          this.Awaiting = result[1].data.find((m) => m.visaStatus == 2);
          this.Granted = result[1].data.find((m) => m.visaStatus == 3);
          this.Archieved = result[1].data.find((m) => m.visaStatus == 6);
          console.log(this.Awaiting);
        } else {
          this.toastr.ErrorToastr(result[1].message);
        }
      }
      // if (result[2]) {
      //   if (result[2].status) {
      //     this.visadata = result[2].data;
      //     //this.VisaStatusForm.get("passportNumber").setValue(this.visadata?.passportNumber);
      //   }
      //   else {
      //     this.toastr.ErrorToastr(result[1].message);
      //   }

      // }
      $("#loader").hide();
    });
  }
  // visaget(applicationId) {
  //   $('#loader').show();
  //   var VisaDataRequest = this.visaservices.GetVisaDetails({ applicationId: applicationId });
  //   VisaDataRequest.subscribe(result => {
  //     this.visadata = result.data;
  //     this.VisaStatusForm.get('passportNumber')?.setValue(this.visadata?.visaDetail.passportNumber);
  //     $('#loader').hide();
  //   })
  // }

  droponAwaiting(content, event: CdkDragDrop<string[]>, dropContainer: any) {
    this.datelabl = "Submission Date";
    var application = JSON.parse(
      JSON.stringify(event.previousContainer.data[event.previousIndex])
    );
    this.url = application.applicationStatus == 5;
    this.showMe = false;
    this.filecheck = false;
    if (event.previousContainer !== event.container) {
      $("#loader").show();

      var application = JSON.parse(
        JSON.stringify(event.previousContainer.data[event.previousIndex])
      );

      if (event.previousContainer !== event.container) {
        this.VisaStatusForm.reset();
        this.VisaStatusForm.get("statusdate")?.addValidators(
          Validators.required
        );
        this.VisaStatusForm.get("reason")?.clearValidators();
        this.VisaStatusForm.get("reason")?.updateValueAndValidity();
        this.VisaStatusForm.get("fileContent")?.clearValidators();
        this.VisaStatusForm.get("fileContent")?.updateValueAndValidity();
        if (application.applicationStatus === 1)
          this.VisaStatusForm.get("applicationUrl")?.clearValidators();
        else if (application.applicationStatus === 5) {
          this.VisaStatusForm.get("applicationUrl")?.addValidators(
            Validators.required
          );
          this.VisaStatusForm.get("applicationUrl")?.updateValueAndValidity();
        }
        this.VisaStatusForm.get("statusId")?.setValue(2);
        this.VisaStatusForm.get("applicationId")?.setValue(
          application.applicationId
        );
        this.modalService.open(this.changeVisaStatusModel, {
          ariaLabelledBy: "modal-basic-title",
          backdrop: false,
        });
        $("#loader").hide();
      }

      // if (application.applicationStatus == 2) {
      //   var input = {

      //     statusId: 2,
      //     applicationId: application.applicationId,
      //     reason: '',
      //     fileContent: '',
      //     applicationUrl: '',

      //   }
      //   this.visaservices.ChangeVisaStatus(input).subscribe(res => {

      //     if (res.status) {

      //       this.loadData();
      //       this.toastr.SuccessToastr("Visa status has been changed.");
      //     }
      //     else {
      //       $("#loader").hide();
      //       this.toastr.ErrorToastr(res.message);
      //       $('#loader').hide();
      //     }
      //   }, (err: any) => {
      //     $("#loader").hide();
      //     this.toastr.ErrorToastr("Something went wrong");
      //     $('#loader').hide();
      //   })
      // }

      //   else {
      //     $("#loader").hide();
      //     this.toastr.ErrorToastr("Please first you schelued Step Complete than move on Awaiting")
      //   }
      // }
    }
  }
  dropOnRefused(content, event: CdkDragDrop<string[]>, dropContainer: any) {
    this.datelabl = "Refused Date";
    this.showMe = true;
    // this.statuscheck = false;
    this.filecheck = true;

    this.url = false;

    var application = JSON.parse(
      JSON.stringify(event.previousContainer.data[event.previousIndex])
    );

    if (event.previousContainer !== event.container) {
      this.VisaStatusForm.reset();

      //this.visaget(application.applicationId);

      // transferArrayItem(event.previousContainer.data, event.container.data,
      //   event.previousIndex, event.currentIndex)
      this.VisaStatusForm.get("statusdate")?.addValidators(Validators.required);
      this.VisaStatusForm.get("reason")?.addValidators(Validators.required);
      this.VisaStatusForm.get("applicationUrl")?.clearValidators();
      this.VisaStatusForm.get("applicationUrl")?.updateValueAndValidity();
      this.VisaStatusForm.get("fileContent")?.addValidators(
        Validators.required
      );
      // this.VisaStatusForm.get('fileContent')?.updateValueAndValidity();
      // this.VisaStatusForm.get("passportNumber")?.setValue(this.visadata?.passportNumber);
      this.VisaStatusForm.get("statusId")?.setValue(4);
      this.VisaStatusForm.get("applicationId")?.setValue(
        application.applicationId
      );
      this.modalService.open(this.changeVisaStatusModel, {
        ariaLabelledBy: "modal-basic-title",
        backdrop: false,
      });
    }
  }
  droponReapply(event: CdkDragDrop<string[]>, dropContainer: any) {
    var application = JSON.parse(
      JSON.stringify(event.previousContainer.data[event.previousIndex])
    );
    if (event.previousContainer !== event.container) {
      $("#loader").show();
      // if (event.previousIndex === 1) {
      //   this.toastr.ErrorToastr("first you have scheduled status than next status select");
      // }
      var input = {
        statusId: 5,
        applicationId: application.applicationId,
        reason: "",
        fileContent: "",
        applicationUrl: "",
      };
      this.visaservices.ChangeVisaStatus(input).subscribe(
        (res) => {
          if (res.status) {
            this.loadData();
            this.toastr.SuccessToastr("Visa status has been changed.");
          } else {
            $("#loader").hide();
            this.toastr.ErrorToastr(res.message);
            $("#loader").hide();
          }
        },
        (err: any) => {
          $("#loader").hide();
          this.toastr.ErrorToastr("Something went wrong");
          $("#loader").hide();
        }
      );
    }
  }
  // drop(content, event: CdkDragDrop<string[]>, dropContainer: any) {

  //   this.shoMe = false;
  //   this.statuscheck = false;
  //   this.filecheck = false;
  //   //this.passport = true;
  //   this.url = false;
  //   this.datelabl = "Scheduled Date";
  //   var application = JSON.parse(JSON.stringify(event.previousContainer.data[event.previousIndex]));

  //   if (event.previousContainer !== event.container) {
  //     this.VisaStatusForm.reset();

  //     this.visaget(application.applicationId);

  //     // transferArrayItem(event.previousContainer.data, event.container.data,
  //     //   event.previousIndex, event.currentIndex)
  //     this.VisaStatusForm.get('statusdate')?.addValidators(Validators.required);
  //     this.VisaStatusForm.get('passportNumber')?.addValidators([Validators.required, Validators.pattern(/^[0-9a-zA-Z]{9,12}$/)]);
  //     //this.VisaStatusForm.get('applicationUrl')?.addValidators(Validators.required);
  //     this.VisaStatusForm.get('reason')?.clearValidators();
  //     this.VisaStatusForm.get('reason')?.updateValueAndValidity();
  //     this.VisaStatusForm.get('fileContent')?.clearValidators();
  //     this.VisaStatusForm.get('fileContent')?.updateValueAndValidity();
  //     // this.VisaStatusForm.get("passportNumber")?.setValue(this.visadata?.passportNumber);
  //     this.VisaStatusForm.get('statusId')?.setValue(2);
  //     this.VisaStatusForm.get('applicationId')?.setValue(application.applicationId);
  //     this.modalService.open(this.changeVisaStatusModel, { ariaLabelledBy: 'modal-basic-title', backdrop: false });

  //   }
  // }

  // var input = {
  //   applicationId: 0,
  //   statusId: dropContainer,
  //   comment: ""
  // }
  // this.visaservices.ChangeVisaStatus(input).subscribe(res => {
  //   if (res.status) {
  //     this.loadData();
  //     this.toastr.SuccessToastr("Visa status has been changed.");
  //   }
  //   else {
  //     this.toastr.ErrorToastr(res.message);
  //   }
  // }, (err: any) => {
  //   this.toastr.ErrorToastr("Something went wrong");
  // })

  dropOnGranted(content, event: CdkDragDrop<string[]>, dropContainer: any) {
    this.showMe = false;
    this.filecheck = false;

    $("#loader").show();
    var application = JSON.parse(
      JSON.stringify(event.previousContainer.data[event.previousIndex])
    );
    if (event.previousContainer !== event.container) {
      if (application.applicationStatus !== 1) {
        //this.visaget(application.applicationId);
        this.url = false;
        this.datelabl = "Granted Date";

        this.VisaStatusForm.reset();
        this.VisaStatusForm.get("statusdate")?.addValidators(
          Validators.required
        );

        this.VisaStatusForm.get("statusId")?.setValue(3);
        this.VisaStatusForm.get("fileContent")?.clearValidators();
        this.VisaStatusForm.get("fileContent")?.updateValueAndValidity();
        this.VisaStatusForm.get("applicationUrl")?.clearValidators();
        this.VisaStatusForm.get("applicationUrl")?.updateValueAndValidity();
        this.VisaStatusForm.get("reason")?.clearValidators();
        this.VisaStatusForm.get("reason")?.updateValueAndValidity();
        this.VisaStatusForm.updateValueAndValidity();
        this.VisaStatusForm.get("applicationId")?.setValue(
          application.applicationId
        );
        this.modalService.open(this.changeVisaStatusModel, {
          ariaLabelledBy: "modal-basic-title",
          backdrop: false,
        });
        $("#loader").hide();
      } else {
        $("#loader").hide();
        this.toastr.ErrorToastr(
          "First you Complete the Awaiting Step than move to Result"
        );
      }
    }
  }

  // changestatus(event) {
  //   if (event.target.value == '3') {
  //     this.showMe = false;
  //     //this.statuscheck = false;
  //     this.filecheck = false;
  //     this.url = false;
  //     this.datelabl = "Granted Date";

  //     this.VisaStatusForm.get('statusdate')?.addValidators(Validators.required);
  //     // this.VisaStatusForm.get('statusId')?.clearValidators;
  //     //this.VisaStatusForm.get('statusId')?.updateValueAndValidity();
  //     this.VisaStatusForm.get('statusId')?.addValidators(Validators.required);
  //     this.VisaStatusForm.get('reason')?.clearValidators();
  //     this.VisaStatusForm.get('reason')?.updateValueAndValidity();
  //     this.VisaStatusForm.get('fileContent')?.clearValidators();
  //     this.VisaStatusForm.get('fileContent')?.updateValueAndValidity();

  //     this.VisaStatusForm.updateValueAndValidity();

  //   }
  //   else {
  //     this.showMe = true;
  //     //this.statuscheck = true;
  //     this.filecheck = true;
  //     //this.passnumber = false;
  //     this.url = false;
  //     this.datelabl = "Rejected Date";

  //     this.VisaStatusForm.get('statusdate')?.addValidators(Validators.required);
  //     this.VisaStatusForm.get('reason')?.addValidators(Validators.required);
  //     this.VisaStatusForm.get('statusId')?.addValidators(Validators.required);

  //     this.VisaStatusForm.get('fileContent')?.clearValidators();
  //     this.VisaStatusForm.get('fileContent')?.updateValueAndValidity();

  //     this.VisaStatusForm.updateValueAndValidity();

  //   }
  // }
  dropOnArchive(content, event: CdkDragDrop<string[]>, dropContainer: any) {
    $("#loader").show();
    var application = JSON.parse(
      JSON.stringify(event.previousContainer.data[event.previousIndex])
    );
    if (event.previousContainer !== event.container) {
      this.archiveStatusForm.reset();
      this.archiveStatusForm
        .get("applicationId")
        ?.setValue(application.applicationId);
      this.archiveStatusForm
        .get("statusId")
        ?.addValidators(Validators.required);
      this.archiveStatusForm.get("reason")?.addValidators(Validators.required);
      this.modalService.open(this.changeapplicationstatus, {
        ariaLabelledBy: "modal-visa-status",
        backdrop: false,
      });
      $("#loader").hide();
    }
  }
  updateStatus() {
    $("#loader").show();
    var input = JSON.parse(JSON.stringify(this.VisaStatusForm.getRawValue()));
    
    
    let formData = new FormData();
    // Append form fields to the FormData object
    formData.append('ApplicationId', input.applicationId);
    console.log('applicationId',input.applicationId);
    formData.append('applicationUrl', input.applicationUrl);
    formData.append('fileContent', input.fileContent);
    // formData.append('FileName', input.FileName);
    // formData.append('PDF', input.PDF);
    formData.append('statusdate', input.statusdate);
    formData.append('reason', input.reason);
    formData.append('statusId', input.statusId);
    console.log(input.statusId);
    console.log("Input",input);

    this.visaservices.ChangeVisaStatus(formData).subscribe(
      (res) => {
        if (res.status) {
          this.loadData();
          this.toastr.SuccessToastr("Visa Status Change Successfully.");
          this.modalService.dismissAll();
        } else {
          $("#loader").hide();
          this.toastr.ErrorToastr(res.message);
        }
      },
      (err: any) => {
        this.toastr.ErrorToastr("Something went wrong");
        $("#loader").hide();
      }
    );
  }
  archiveStatus: any;
  updateArchive() {
    $("#loader").show();
    var input = JSON.parse(
      JSON.stringify(this.archiveStatusForm.getRawValue())
    );

    this.visaservices.ChangeVisaStatus(input).subscribe(
      (res) => {
        if (res.status) {
          this.loadData();
          this.toastr.SuccessToastr("Visa has been archived successfully.");
          this.modalService.dismissAll();
          this.archiveApplicationId = 0;
          this.archiveStatus = 0;
        } else {
          this.toastr.ErrorToastr(res.message);
          $("#loader").hide();
        }
      },
      (err: any) => {
        this.toastr.ErrorToastr("Something went wrong");
        $("#loader").hide();
      }
    );
  }
  base64FileName: any;
  filevalid: any;
  SelectVisa(event: any) {
    const file = event.target.files[0];
    if (this.filevalidation.checkFileType(event.target.files)) {
      const reader = new FileReader();
      reader.onloadend = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);

      this.base64FileName = file.name;
    } else this.filevalid = false;
  }
  base64File: any;
  _handleReaderLoaded(e: any) {
    let reader = e.target;
    var base64result = reader.result.substr(reader.result.indexOf(",") + 1);
    this.base64File = base64result;
    this.VisaStatusForm.get("fileContent").setValue(this.base64File);
  }

  loadForm() {
    $("#loader").show();
    let paginationModal = {
      index: 0,
      size: 0,
    };
    let managedata = this.inquiryServices.GetAssignedToUsers();
    forkJoin([managedata]).subscribe(
      (result) => {
        if (result[0]) {
          if (result[0].status) {
            
            this.ChangeManageby = result[0].data;
            this.ChangeManageby.unshift({
              name: "All",
              userId: 0,
              userTypeId: 0,
              userTypeName: "All",
            });
          } else {
            this.toastr.ErrorToastr(result[0].message);
          }
          $("#loader").hide();
        }
      },
      (err: any) => {
        $("#loader").hide();
        if (err.status == 401) {
          this.route.navigate(["/"]);
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
      }
    );
  }

  ChangeManage(applicationId, ManageById) {
    $("#loader").show();
    var input = {
      applicationId: applicationId,
      ManageById: ManageById,
    };
    this.applicationService.ChangeManage(input).subscribe(
      (res) => {
        if (res.status) {
          this.toastr.SuccessToastr("Manager has been changed successfully");
          this.application.managedata = this.ChangeManageby.find(
            (m) => m.userId == ManageById
          ).name;

          this.loadData();
        } else {
          this.toastr.ErrorToastr(res.message);
          $("#loader").hide();
        }
      },
      (err: any) => {
        this.toastr.ErrorToastr("something doing wrong");
        $("#loader").hide();
      }
    );
  }

  getVisaDetail(content: any, id: any) {
    let input = {
      id: id,
      page: this.requestFrom,
      action: "view",
      tabIndex: "5",
    };
    this.emitService.onchangeApplicationId(input);
    this.emitService.changeApplicationParentstatus(1);
  }
  Result: any;
  isCall = false;
  ScrollHandeler(event, requestType) {
    var skipData = 10;
    var isMaxApplication = false;
    if (
      requestType == 1 &&
      this.inPreaparation.totalApplications <= this.skipPrepairation
    )
      isMaxApplication = true;
    if (
      requestType == 2 &&
      this.Awaiting.totalApplications <= this.skipAwaiting
    )
      isMaxApplication = true;
    if (requestType == 4 && this.Granted.totalApplications <= this.skipResult)
      isMaxApplication = true;
    if (requestType == 3 && this.Refused.totalApplications <= this.skipRefused)
      isMaxApplication = true;
    if (
      requestType == 5 &&
      this.Archieved.totalApplications <= this.skipArchive
    )
      isMaxApplication = true;
    if (event.deltaY > 0 && !this.isCall && !isMaxApplication) {
      if (requestType == 1) skipData = this.skipPrepairation;
      else if (requestType == 2) skipData = this.skipAwaiting;
      else if (requestType == 3) skipData = this.skipRefused;
      else if (requestType == 4) skipData = this.skipResult;
      else if (requestType == 5) skipData = this.skipArchive;

      var inputData = JSON.parse(JSON.stringify(this.filterForm.getRawValue()));
      let AppliedDatestartDate = null;
      let AppliedDateendDate = null;
      if (inputData.AppliedDate == null) AppliedDatestartDate = null;
      else AppliedDatestartDate = inputData.AppliedDate.startDate;
      if (inputData.AppliedDate == null) AppliedDateendDate = null;
      else AppliedDateendDate = inputData.AppliedDate.endDate;
      let paginationModal = {
        ...inputData,
        campusId: this.headerCampusId,
        intakeId: this.headerIntakeId,
        skip: skipData,
        take: 2,
        appliedStartDate: AppliedDatestartDate,
        appliedEndDate: AppliedDateendDate,
      };

      this.isCall = true;
      this.visaservices
        .GetVisaApplicationOnScroll(paginationModal)
        .subscribe((res: any) => {
          this.isCall = false;
          if (res.status) {
            if (requestType == 1) {
              this.inPreaparation.applications =
                this.inPreaparation.applications.concat(res.data);
              this.skipPrepairation += 2;
            } else if (requestType == 4) {
              this.Granted.applications = this.Granted.applications.concat(
                res.data
              );
              this.skipResult += 2;
            } else if (requestType == 2) {
              this.Awaiting.applications = this.Awaiting.applications.concat(
                res.data
              );
              this.skipAwaiting += 2;
            } else if (requestType == 3) {
              this.Refused.applications = this.Refused.applications.concat(
                res.data
              );
              this.skipRefused += 2;
            } else if (requestType == 5) {
              this.Archieved.applications = this.Archieved.applications.concat(
                res.data
              );
              this.skipArchive += 2;
            }
          }
        });
    }
  }

  clearFilterData() {
    this.filterForm.reset();
    this.loadData();
    $("#loader").hide();
  }
}
