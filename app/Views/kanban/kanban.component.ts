import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { CdkDragDrop, transferArrayItem } from "@angular/cdk/drag-drop";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import intlTelInput from 'intl-tel-input';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { forkJoin } from "rxjs";
import { Campus } from "src/app/models/campus.model";
import { Course } from "src/app/models/course.model";
import { FeePayOption } from "src/app/models/fee-pay-option.model";
import { Intake } from "src/app/models/intake.model";
import { SocialPreference } from "src/app/models/social-preference.model";
import { User } from "src/app/Models/user.model";
import { ApplicationService } from "src/app/services/application.service";
import { CampusService } from "src/app/services/campus.service";
import { CoursesService } from "src/app/services/courses.service";
import { EmittService } from "src/app/Services/emitt.service";
import { FeePayByService } from "src/app/Services/feepayby.service";
import { IntakeService } from "src/app/services/intake.service";
import { KanbanService } from "src/app/Services/kanban.service";
import { SocialreferenceService } from "src/app/services/socialreference.service";
import { ToastrServiceService } from "src/app/Services/toastr-service.service";
import { UserManagement } from "src/app/Services/user-management.service";
import * as moment from "moment";
import { DocumentService } from "src/app/Services/document.service";
import { AlertServiceService } from "src/app/Services/alert-service.service";
import { SessionStorageService } from "src/app/Services/session-storage.service";
import { UserInquiryService } from "src/app/services/user-inquiry.service";
import { FileValidationService } from "src/app/Services/file-validation.service";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { AccountService } from "src/app/Services/account.service";
import { CountryCategoryService } from "src/app/Services/country-category.service";
import { Country } from "src/app/Models/country.model";
import { DatetimeService } from "src/app/Services/datetime.service";
import dayjs from "dayjs";

@Component({
  selector: "app-kanban",
  templateUrl: "./kanban.component.html",
  styleUrls: ["./kanban.component.sass"],
})
export class KanbanComponent implements OnInit {
  selected: any;

  userid: any = 0;
  faPlus = faPlus;
  faCalendarAlt = faCalendarAlt;
  ApplicationStatus = [];
  inProgress = [];
  receive = [];
  seen = [];
  accepted = [];
  rejected = [];
  onHold = [];
  stagesWithApplication = [];
  courses: Array<Course> = [];
  intakes: Array<Intake> = [];
  campuses: Array<Campus> = [];
  feePayOptions: Array<FeePayOption> = [];
  SocialPreferences: Array<SocialPreference> = [];
  RMs: Array<User> = [];
  Agents: Array<User> = [];
  applicationStatus = 0;
  application: any;
  archiveApplicationId = 0;
  archiveStatus = 0;
  archiveStatuses = [];
  storeApplicationId = 0;
  headerCampusId: number = 0;
  headerIntakeId: number = 0;
  headerName: string = "";
  SelectedCourse: any;

  totalInprogress: number = 0;
  totalReceived: number = 0;
  totalAccepted: number = 0;
  totalRejected: number = 0;
  totalSeen: number = 0;

  newInprogresssCount: number = 0;
  newReceiveCount: number = 0;
  newApproveCount: number = 0;
  newRejecteCount: number = 0;
  newSeenCount: number = 0;

  inprogressApplication = [];
  receiveApplication = [];
  approveApplication = [];
  rejectApplication = [];
  seenApplication = [];

  applicationStages = [];
  documentList = [];
  selectedDocumentList: Array<number> = [];
  isFileUpload = true;
  isResonShow = false;
  isShowDocReq = false;
  applicationComments = [];
  applicationNotes = [];
  applicationIntakes: Array<Intake> = [];
  ChangeManageby = [];
  agents = [];
  regionalmanager = [];
  subadmins = [];
  skipInprogressData = 0;
  skipReceiveData = 0;
  skipApproveData = 0;
  skipRejectData = 0;
  skipSeenData = 0;
  requestFrom = "application";
  AssigedUserGroupDetail: [];
  inquiryAssignedToId: any;
  countryId: any;
  applicationDocument = [];
  applications = [];
  StageId: number;
  CampusId: number;
  IntakeId: number;
  Course: any;
  Stage: any;
  AppliedStartDate: any;
  AppliedEndDate: any;
  AssignedTo: any;
  DateStartRange: any;
  StartDate: any;
  EndDate: any;
  DateEndRange: any;
  Agent: any;
  RM: number[];
  AssignBy: any;
  Country: any;
  Source: any;
  ApplicantName: any;
  Search: any;
  Skip: any;
  Take: any;
  RequestType: any;

  @ViewChild("ApplicationStatusChange") applicationStatusModal: ElementRef;
  @ViewChild("DocumentRequestModal") documentRequestModal: ElementRef;
  @ViewChild("ChageStatusDocNote") ChageStatusDocNote: ElementRef;

  applicationStatusForm: FormGroup = new FormGroup({
    contentId: new FormControl(),
    statusId: new FormControl(),
    comment: new FormControl(),
  });
  documentForm: FormGroup = new FormGroup({
    documentName: new FormControl(),
    documentDescription: new FormControl(),
    documentType: new FormControl(),
    documentTypeId: new FormControl(),
    sampleDocumentUrl: new FormControl(),
    sampleDocumentName: new FormControl(),
    formOrLetter: new FormControl(),
    formOrLetterName: new FormControl(),
    documentTypeName: new FormControl(),
    documentCategory: new FormControl(),
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
  commentForm: FormGroup = new FormGroup({
    applicationId: new FormControl(),
    comment: new FormControl(),
  });
  noteForm: FormGroup = new FormGroup({
    applicationId: new FormControl(),
    note: new FormControl(),
  });

  constructor(
    private accountService: AccountService,
    private iServices: IntakeService,
    private cServices: CampusService,
    private kanbanService: KanbanService,
    private modalService: NgbModal,
    private toastr: ToastrServiceService,
    private applicationService: ApplicationService,
    private formBuilder: FormBuilder,
    private intakeService: IntakeService,
    private courseService: CoursesService,
    private route: Router,
    private socialReferanceService: SocialreferenceService,
    private emitService: EmittService,
    private documentService: DocumentService,
    private alerts: AlertServiceService,
    private sessionService: SessionStorageService,
    private fileValid: FileValidationService,
    private dateTimeService:DatetimeService
  ) {
    this.documentForm = formBuilder.group({
      documentName: ["", Validators.required],
      documentTypeId: ["0"],
      documentType: ["", [Validators.required]],
      documentDescription: ["", Validators.required],
      sampleDocumentUrl: [""],
      formOrLetter: [""],
      formOrLetterName: [""],
      documentCategory: [null, Validators.required],
    });
    this.applicationStatusForm = formBuilder.group({
      contentId: [null, [Validators.required]],
      statusId: [null, [Validators.required]],
      comment: [""],
    });
    this.commentForm = formBuilder.group({
      applicationId: [null, [Validators.required]],
      comment: [null, [Validators.required]],
    });
    this.noteForm = formBuilder.group({
      applicationId: [null, [Validators.required]],
      note: [null, [Validators.required]],
    });

    emitService.getapplicationChange().subscribe((res) => {
      if (this.requestFrom == res) this.loadData();
    });
    emitService.onChangeAddApplicationbtnHideShow(true);
    emitService.getapplicationStatusChange().subscribe((res) => {
      this.applicationStatusForm.reset();
      this.isFileUpload = res.isFileUpload;
      this.applicationStatusForm.get("contentId").setValue(res.appid);
      if (this.modalService.hasOpenModals() == true) {
        this.modalService.dismissAll();
      }
      this.modalService.open(this.applicationStatusModal, {
        ariaLabelledBy: "modal-basic-title",
        backdrop: false,
      });
    });
    emitService.GetCampusIntakeChange().subscribe((res) => {
      this.headerCampusId = res.campusId;
      this.headerIntakeId = res.intakeId;
    });
    emitService.getapplicationChange().subscribe((res) => {
      if (this.requestFrom == res) this.loadData();
    });
  }

  get f() {
    return this.applicationStatusForm.controls;
  }

  ngOnInit(): void {
    this.userid = this.sessionService.getuserID();
    this.loadCampus();
    this.loadData();
    this.loadForm();
    this.headerFilter();
    this.loadAndRMSStatus();

    this.inquiryAssignedToId = [];
    // Promise. resolve().then(()=>{
    //   console.log(" Foorter compnent");
      
    //     const inputElement = document.querySelector("#phone5656565")as HTMLInputElement ;
    //     console.log("inputElement:", inputElement);
  
    //     if (inputElement) {
    //       console.log("into the function")
    //       intlTelInput(inputElement, {
    //         initialCountry: 'us',
    //         separateDialCode: true,
    //         utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js'
    //       });
    //     } else {
    //       console.error("Input element with ID 'phone5656565' not found.");
    //     }})
  }
  ufpSources: Array<SocialPreference> = [];
  countryListt: any;
  inquirySourceId: any;
  groupByFn = (item) => item.userTypeName;
  selectedAccounts = [1];
  groupValueFn = (_: string, children: any[]) => ({
    name: children[0].userTypeName,
  });

  headerFilter() {
    this.emitService.GetCampusIntakeChange().subscribe((res) => {
      this.headerCampusId = res.campusId;
      this.headerIntakeId = res.intakeId;
      this.headerName = res.name;
      this.loadData();
    });
  }
  nationalitydata: Array<Country> = [];
  coutryofresidentdata: Array<Country> = [];

  loadCampus() {
    $("#loader").show();
    let paginationInput = {
      index: 0,
      size: 0,
    };
    var getIntakes = this.iServices.getAllIntake(paginationInput);
    var getCampuses = this.cServices.getAllCampaus(paginationInput);
    let socialPreferenceData =
      this.socialReferanceService.getAllSocialRef(paginationInput);
    let nationality = this.accountService.getCountries();
    forkJoin([
      getIntakes,
      getCampuses,
      socialPreferenceData,
      nationality,
    ]).subscribe((result) => {
      if (result[0]) {
        if (result[0].status) {
          this.intakes = result[0].data.records;
        } else {
          this.toastr.ErrorToastr(result[0].message);
        }
      }
      if (result[1]) {
        if (result[1].status) {
          this.campuses = result[1].data.records;
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
      }
      if (result[2]) {
        if (result[2].status) {
          this.ufpSources = result[2].data.records;
        } else {
          this.toastr.ErrorToastr(result[3].message);
        }
      }
      if (result[3]) {
        if (result[3].status) {
          this.nationalitydata = result[3].data;
          this.coutryofresidentdata = result[3].data;
        } else {
          this.toastr.ErrorToastr(result[3].message);
        }
      }
    });
  }

  assignedTo = "";
  loadForm() {
    let paginationModal = {
      index: 0,
      size: 0,
    };
    $("#loader").show();
    let managedata = this.applicationService.GetManageUser();
    let coursesData = this.courseService.getAllCourses(paginationModal);
    forkJoin([managedata, coursesData]).subscribe(
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
            this.assignedTo = result[0].data.filter(
              (m) => m.userTypeId == 1 || m.userTypeId == 2
            );
            this.agents = result[0].data.filter((m) => m.userTypeId == 4);
            this.RMs = result[0].data.filter((m) => m.userTypeId == 3);
          } else {
            this.toastr.ErrorToastr(result[0].message);
          }
        }
        if (result[1]) {
          if (result[1].status) {
            this.courses = result[1].data.records;
          } else {
            this.toastr.ErrorToastr(result[1].message);
          }
        }

        $("#loader").hide();
      },
      (err: any) => {
        $("#loader").hide();
        if (err.status == 401) {
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
      }
    );
  }

  loadData() {
    this.headerCampusId =
      this.headerCampusId == 0
        ? parseInt(this.sessionService.getCampusId())
        : this.headerCampusId;
    this.headerIntakeId =
      this.headerIntakeId == 0
        ? parseInt(this.sessionService.getIntakeId())
        : this.headerIntakeId;
    var inputData = JSON.parse(JSON.stringify(this.filterForm.getRawValue()));
    $("#loader").show();
    this.skipInprogressData = 0;
    let AppliedDatestartDate = null;
    let AppliedDateendDate = null;
    var inputData = JSON.parse(JSON.stringify(this.filterForm.getRawValue()));
    if (inputData.AppliedDate == null) AppliedDatestartDate = null;
    else AppliedDatestartDate = this.dateTimeService.setWriteOffset(dayjs(inputData.AppliedDate.startDate).toDate());
    if (inputData.AppliedDate == null) AppliedDateendDate = null;
    else AppliedDateendDate = this.dateTimeService.setWriteOffset(dayjs(inputData.AppliedDate.startDate).toDate());

    var input = {
      ...inputData,
      StageId: 1,
      CampusId: parseInt(this.sessionService.getCampusId()),
      IntakeId: parseInt(this.sessionService.getIntakeId()),
      AppliedStartDate: AppliedDatestartDate,
      AppliedEndDate: AppliedDateendDate,
      Skip: null,
      Take: 10,
      RequestType: 0,
    };
    var inprogessRequest = this.kanbanService.getApplicationByStage(input);
    //var intakestatus = this.applicationService.ChangeIntake(input);
    var statuses = this.kanbanService.getStagesByPerent({ id: 1 });
    let paginationModal = {
      campusId: parseInt(this.sessionService.getCampusId()),
      intakeId: parseInt(this.sessionService.getIntakeId()),
      index: 0,
      size: 0,
      stageId: 1,
    };

    forkJoin(statuses, inprogessRequest).subscribe((result) => {
      if (result[0]) {
        if (result[0].status) {
          this.ApplicationStatus = result[0].data.subStages;
          this.archiveStatuses = result[0].data.subStages.filter(
            (m) =>
              m.stageName.toLowerCase() != "received" &&
              m.stageName.toLowerCase() != "new" &&
              m.stageName.toLowerCase() != "inprogress" &&
              m.stageName.toLowerCase() != "seen"
          );
        } else {
          this.toastr.ErrorToastr(result[0].message);
        }
      }
      if (result[1]) {
        if (result[1].status) {
          this.skipApproveData = 10;
          this.skipInprogressData = 10;
          this.skipReceiveData = 10;
          this.skipRejectData = 10;
          this.skipSeenData = 10;
          this.applications = result[1].data;
          this.setApplications();
        } else {
          this.toastr.ErrorToastr(result[1].message);
        }
      }

      $("#loader").hide();
    });
  }

  setApplications() {
    this.inprogressApplication = this.applications.find(
      (m) => m.stageId == 2
    ).applications;
    this.receiveApplication = this.applications.find(
      (m) => m.stageId == 3
    ).applications;
    this.approveApplication = this.applications.find(
      (m) => m.stageId == 4
    ).applications;
    this.rejectApplication = this.applications.find(
      (m) => m.stageId == 5
    ).applications;
    this.seenApplication = this.applications.find(
      (m) => m.stageId == 79
    ).applications;
    this.totalAccepted = this.applications.find(
      (x) => x.stageName == "Received"
    ).applicationCount;
    // OKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK
    this.totalInprogress = this.applications.find( 
      (x) => x.stageName == "InProgress"
    ).applicationCount;
    this.totalReceived = this.applications.find(
      (x) => x.stageName == "New"
    ).applicationCount;
    this.totalRejected = this.applications.find(
      (x) => x.stageName == "Rejected"
    ).applicationCount;
    this.totalSeen = this.applications.find(
      (x) => x.stageName == "Seen"
    ).applicationCount;
    //  okkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
    this.newInprogresssCount = this.applications.find(
      (m) => m.stageId == 2
    ).newApplicationCount;
    this.newReceiveCount = this.applications.find(
      (m) => m.stageId == 3
    ).newApplicationCount;
    this.newApproveCount = this.applications.find(
      (m) => m.stageId == 4
    ).newApplicationCount;
    this.newRejecteCount = this.applications.find(
      (m) => m.stageId == 5
    ).newApplicationCount;
    this.newSeenCount = this.applications.find(
      (m) => m.stageId == 79
    ).newApplicationCount;
  }

  dropOnApprove(content, event: CdkDragDrop<string[]>, dropContainer: any) {
    var application = JSON.parse(
      JSON.stringify(event.previousContainer.data[event.previousIndex])
    );
    if (event.previousContainer !== event.container) {
      this.applicationStatusForm.reset();
      this.applicationStatusForm
        .get("contentId")
        .setValue(application.applicationId);
      this.applicationStatusForm
        .get("comment")
        .addValidators(Validators.required);
      this.alerts
        .ComfirmAlert("Do you want to request document ?", "Yes", "No")
        .then((res) => {
          $("#loader").show();

          if (res.isConfirmed) {
            $("#loader").hide();
            this.openMasterModal(application.applicationId);
          } else {
            //var input = JSON.parse(JSON.stringify(this.applicationStatusForm.getRawValue()));
            var input = {
              contentId: application.applicationId,
              statusId: 4,
            };
            this.applicationService
              .ChangeApplicationStatusToReceived(input)
              .subscribe(
                (res) => {
                  $("#loader").show();
                  if (res.status) {
                    this.loadData();
                    this.toastr.SuccessToastr(
                      "Application has been approved successfully."
                    );
                    this.modalService.dismissAll();
                    this.archiveApplicationId = 0;
                    this.archiveStatus = 0;
                  } else {
                    this.toastr.ErrorToastr(res.message);
                  }
                  $("#loader").hide();
                },
                (err: any) => {
                  this.toastr.ErrorToastr("Something went wrong");
                  $("#loader").hide();
                }
              );
          }
        });
    }
  }

  drop(event: CdkDragDrop<string[]>, dropContainer: any) {
    $("#loader").show();
    var application = JSON.parse(
      JSON.stringify(event.previousContainer.data[event.previousIndex])
    );
    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      var input = {
        contentId: application.applicationId,
        statusId: dropContainer,
        comment: "",
        // note:""
      };

      this.applicationService.changeApplicationStatus(input).subscribe(
        (res) => {
          if (res.status) {
            this.loadData();
            this.toastr.SuccessToastr(
              "Application status has been change successfully."
            );
          } else {
            $("#loader").hide();
            this.toastr.ErrorToastr(res.message);
          }
        },
        (err: any) => {
          $("#loader").hide();
          this.toastr.ErrorToastr("Something went wrong");
        }
      );
    }
  }
  getApplication(content: any, id: any) {
    let input = {
      id: id,
      page: this.requestFrom,
      action: "view",
    };
    this.emitService.onchangeApplicationId(input);
    this.emitService.changeApplicationParentstatus(1);
  }

  dropOnArchive(content, event: CdkDragDrop<string[]>) {
    $("#loader").show();
    var application = JSON.parse(
      JSON.stringify(event.previousContainer.data[event.previousIndex])
    );
    if (event.previousContainer !== event.container) {
      this.applicationStatusForm.reset();
      this.applicationStatusForm
        .get("contentId")
        .setValue(application.applicationId);
      this.applicationStatusForm
        .get("comment")
        .addValidators(Validators.required);
      this.modalService.open(content, {
        ariaLabelledBy: "modal-basic-title",
        backdrop: false,
      });
      $("#loader").hide();
    }
    $("#loader").hide();
  }
  loadAndRMSStatus() {
    $("#loader").show();
    this.kanbanService.getStagesByPerent({ id: 1 }).subscribe(
      (result) => {
        if (result.status) {
          this.archiveStatuses = result.data.subStages.filter(
            (m) =>
              m.stageName.toLowerCase() != "received" &&
              m.stageName.toLowerCase() != "new" &&
              m.stageName.toLowerCase() != "seen"
          );
          this.applicationStages = result.data.subStages;
        }
        $("#loader").hide();
      },
      (err: any) => {
        if (err.status == 401) {
          this.route.navigate(["/"]);
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
        $("#loader").hide();
      }
    );
  }
  updateArchive() {
    $("#loader").show();
    var input = JSON.parse(
      JSON.stringify(this.applicationStatusForm.getRawValue())
    );
    this.applicationService.changeApplicationStatus(input).subscribe(
      (res) => {
        if (res.status) {
          this.loadData();
          this.toastr.SuccessToastr(
            "Application has been archived successfully."
          );
          this.modalService.dismissAll();
          this.archiveApplicationId = 0;
          this.archiveStatus = 0;
        } else {
          $("#loader").hide();
          this.toastr.ErrorToastr(res.message);
        }
      },
      (err: any) => {
        $("#loader").hide();
        this.toastr.ErrorToastr("Something went wrong");
      }
    );
  }

  // editApplication(id) {
  //   this.modalService.dismissAll();
  //   this.emitService.onchangeApplicationId(id);
  // }
  changeApplicationStatus(applicationId, statusId) {
    $("#loader").show();
    var input = {
      contentId: applicationId,
      statusId: statusId,
      comment: "",
    };
    this.applicationService.changeApplicationStatus(input).subscribe(
      (res) => {
        if (res.status) {
          this.application.applicationStatusName = this.applicationStages.find(
            (m) => m.stageId == statusId
          ).stageName;
          if (statusId == 4) this.openMasterModal(applicationId);
          this.loadData();
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
  //    this.applicationService.ChangeIntake(input).subscribe(res => {
  //     if (res.status) {
  //       this.application.applicationIntakeName = this.applicationIntakes.find(m => m.intakeId == applicationId).stageName
  //       if (statusId == 4)
  //         this.openMasterModal(applicationId);
  //       this.loadData();
  //     }
  //     else {
  //       this.toastr.ErrorToastr(res.message);
  //     }
  //   }, (err: any) => {
  //     this.toastr.ErrorToastr("Something went wrong");
  //   })

  // //}
  ChangeIntake(applicationId, intakeId) {
    var input = {
      applicationId: applicationId,
      intakeId: intakeId,
    };
    this.intakeService.ChangeIntake(input).subscribe(
      (res) => {
        if (res.status) {
          this.toastr.SuccessToastr("Intake changed successfully");
          this.application.intakeData = this.applicationIntakes.find(
            (m) => m.intakeId == intakeId
          ).intakeName;
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
  ChangeManage(applicationId, ManageById) {
    this.storeApplicationId = applicationId;
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
          // this.application.manageagent=this.agents.find(m=>m.userId==ManageById).name
          // // this.application.managedata=this.regionalmanager.find(m=>m.userId==ManageById).name
          // // this.application.managedata=this.subadmins.find(m=>m.userId==ManageById).name

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

  changeRM(applicationId, userid) {
    var input = {
      applicationId: applicationId,
      rmId: userid,
    };
    this.applicationService.ChangeRm(input).subscribe(
      (res) => {
        if (res.status) {
          this.application.regionalManagerDetail.userName = this.RMs.find(
            (m) => m.userId == userid
          ).fullName;
          this.loadData();
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

  fileNameHTML: any;
  fileNameHTMLName: any;
  isformLetterValid: any;
  modalTitle: any;
  isSubmitted: any;
  documentUploadModel: any;
  openDocModal(content: any) {
    this.fileNameHTML = "";
    this.documentForm.reset(this.documentForm.value);
    this.isformLetterValid = true;
    this.modalTitle = "Add Document";
    this.isSubmitted = false;
    this.documentUploadModel = this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      backdrop: false,
    });
    this.resetdocumentForm();
  }

  resetdocumentForm() {
    this.documentForm.get("documentName")?.setValue("");
    this.documentForm.get("documentDescription")?.setValue("");
    this.documentForm.get("documentTypeId")?.setValue("0");
    this.documentForm.get("sampleDocumentUrl")?.setValue("");
  }

  SaveDocUpload() {
    this.isSubmitted = true;
    this.documentForm.get("documentCategory").setValue(2);
    if (this.documentForm.valid) {
      this.alerts
        .ComfirmAlert(
          "Do you want to add this document in document master??",
          "yes",
          "N0"
        )
        .then((res) => {
          if (res.isConfirmed) {
            this.isSubmitted = true;
            if (this.documentForm.valid) {
              $("#loader").show();
              var formVal = JSON.parse(
                JSON.stringify(this.documentForm.getRawValue())
              );
              formVal.documentTypeId = parseInt(formVal.documentTypeId);
              formVal.sampleDocumentName = formVal.sampleDocumentUrl;
              if (this.Storeimage != "") {
                formVal.sampleDocumentUrl = this.Storeimage;
              } else {
                formVal.sampleDocumentUrl = "";
              }

              this.documentService.SaveDocument(formVal).subscribe(
                (res) => {
                  if (res.status) {
                    // this.modalService.dismissAll();
                    this.documentUploadModel.close();
                    this.FilterDoc();
                    if (res.data.documentTypeId == 0) {
                      this.toastr.SuccessToastr(
                        "Document Uploaded successfully"
                      );
                      this.documentForm.get("sampleDocumentUrl")?.setValue("");
                      this.ngOnInit();
                    } else {
                      this.toastr.SuccessToastr(
                        "Document updated successfully"
                      );
                      this.documentForm.get("sampleDocumentUrl")?.setValue("");
                      this.ngOnInit();
                    }
                  } else {
                    $("#loader").hide();
                    this.toastr.ErrorToastr("Document is not added");
                    $("#loader").hide();
                  }
                },
                (err: any) => {
                  $("#loader").hide();
                  this.toastr.ErrorToastr("Something missing");
                }
              );
            }
          } else {
            this.isSubmitted = true;
            if (this.documentForm.valid) {
              $("#loader").show();
              var formVal = JSON.parse(
                JSON.stringify(this.documentForm.getRawValue())
              );
              formVal.documentTypeId = parseInt(formVal.documentTypeId);
              formVal.sampleDocumentName = formVal.sampleDocumentUrl;
              formVal.applicationId = this.storeApplicationId;
              if (this.Storeimage != "") {
                formVal.sampleDocumentUrl = this.Storeimage;
              } else {
                formVal.sampleDocumentUrl = "";
              }

              this.documentService.UserSaveDocument(formVal).subscribe(
                (res) => {
                  if (res.status) {
                    // this.modalService.dismissAll();
                    this.documentUploadModel.close();
                    this.FilterDoc();
                    if (res.data.documentTypeId == 0) {
                      this.toastr.SuccessToastr(
                        "Document Uploaded successfully"
                      );
                      this.documentForm.get("sampleDocumentUrl")?.setValue("");
                      this.ngOnInit();
                    } else {
                      this.toastr.SuccessToastr(
                        "Document updated successfully"
                      );
                      this.documentForm.get("sampleDocumentUrl")?.setValue("");
                      this.ngOnInit();
                    }
                  } else {
                    this.toastr.ErrorToastr("Document is not added");
                    $("#loader").hide();
                  }
                },
                (err: any) => {
                  $("#loader").hide();
                  this.toastr.ErrorToastr("Something missing");
                }
              );
            }
          }
        });
    }
  }

  changeFormLetterDocument(event: any) {
    const files = event.target.files;
    if (this.fileValid.checkFileType(files)) {
      for (var i = 0; i < files.length; i++) {
        const reader = new FileReader();
        let file = files[i];
        this.documentForm.get("formOrLetterName").setValue(file.name);
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.documentForm
            .get("formOrLetter")
            .setValue(reader.result.toString().split(",")[1]);
        };
      }
    } else {
      this.isformLetterValid = false;
    }
  }

  isValidFile: any;
  Storeimage: any;
  changeDocument(event) {
    this.fileNameHTML = "";
    const files = event.target.files;
    if (this.fileValid.checkFileType(files)) {
      for (var i = 0; i < files.length; i++) {
        const reader = new FileReader();
        let file = files[i];
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.Storeimage = reader.result.toString().split(",")[1];
        };
      }
    } else {
      this.isValidFile = false;
    }
  }

  FilterDoc() {
    let getDocument = {
      ApplicationId: this.storeApplicationId,
    };
    this.applicationService
      .getDocumentfilterList(getDocument)
      .subscribe((res) => {
        if (res.status) {
          this.documentList = res.data;
        }
      });
  }

  openMasterModal(applicationId) {
    $("#loader").show();
    let getDocument = {
      ApplicationId: applicationId,
    };
    this.storeApplicationId = applicationId;
    this.archiveApplicationId = applicationId;
    //let getDocumentFilterView = this.applicationService.getDocumentfilterList(getDocument);
    this.applicationService.getDocumentfilterList(getDocument).subscribe(
      (res) => {
        if (res.status) {
          this.documentList = res.data;
          if (this.documentList.length > 0) {
            this.selectedDocumentList = [];
            this.modalService.open(this.documentRequestModal, {
              ariaLabelledBy: "modal-basic-title",
              size: "lg",
              backdrop: false,
            });
          } else {
            var inputData = {
              contentId: this.archiveApplicationId,
              statusId: 4,
              comment: "",
              // note:""
            };
            this.applicationService
              .changeApplicationStatus(inputData)
              .subscribe(
                (res) => {
                  if (res.status) {
                    this.loadData();
                    this.toastr.SuccessToastr(
                      "Application status has been changed successfully."
                    );
                    this.modalService.dismissAll();
                    this.archiveApplicationId = 0;
                    this.archiveStatus = 0;
                  } else {
                    this.toastr.ErrorToastr(res.message);
                    $("#loader").hide();
                  }
                  $("#loader").hide();
                },
                (err: any) => {
                  this.toastr.ErrorToastr("Something went wrong");
                  $("#loader").hide();
                }
              );
          }
        }
        $("#loader").hide();
      },
      (err: any) => {
        this.toastr.ErrorToastr("Something went wrong");
        console.error(err);
        $("#loader").hide();
      }
    );
  }
  DocchangeStatus(applicationId) {
    this.archiveApplicationId = applicationId;
    this.modalService.open(this.ChageStatusDocNote, {
      ariaLabelledBy: "modal-basic-title",
      backdrop: false,
    });
  }

  onChangeDocument(e: any) {
    //this.selectedDocumentList = [];

    if (e.target.checked) {
      this.selectedDocumentList.push(parseInt(e.target.value));
    } else {
      var docid = parseInt(e.target.value);
      this.selectedDocumentList = this.selectedDocumentList.filter(
        (m) => m !== docid
      );
      // var index = this.selectedDocumentList.findIndex(m => m == docid);
      // this.selectedDocumentList = this.selectedDocumentList.slice(index, 1);
    }
  }

  DocumentRequest() {
    this.alerts
      .ComfirmAlert(
        "You have selected " +
          this.selectedDocumentList.length +
          " document. Do you want to select more document?",
        "Request More",
        "Send Request"
      )
      .then((res) => {
        if (!res.isConfirmed) {
          $("#loader").show();
          let input = {
            applicationId: this.archiveApplicationId,
            documentIds: this.selectedDocumentList,
          };

          this.documentService.DocumentRequest(input).subscribe(
            (res) => {
              if (res.status) {
                this.modalService.dismissAll();
                this.selectedDocumentList = [];
                this.toastr.SuccessToastr("Document(s) have been requested.");
              } else {
                this.toastr.ErrorToastr(res.message);
              }
              $("#loader").hide();
            },
            (err: any) => {
              $("#loader").hide();
              this.toastr.ErrorToastr("Something went wrong");
              console.error(err);
            }
          );
          $("#loader").show();
          //var inputStatusChanges = JSON.parse(JSON.stringify(this.applicationStatusForm.getRawValue()));
          var inputData = {
            contentId: this.archiveApplicationId,
            statusId: 4,
            comment: "",
            // note:""
          };

          this.applicationService.changeApplicationStatus(inputData).subscribe(
            (res) => {
              if (res.status) {
                this.loadData();
                this.toastr.SuccessToastr(
                  "Application status has been changed successfully."
                );
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
      });
  }
  get fDoc() {
    return this.documentForm.controls;
  }

  ChangeApplicationStatus() {
    $("#loader").show();
    var input = JSON.parse(
      JSON.stringify(this.applicationStatusForm.getRawValue())
    );
    if (input.statusId == 4) {
      this.applicationService
        .ChangeApplicationStatusToReceived(input)
        .subscribe(
          (res) => {
            $("#loader").show();
            if (res.status) {
              this.loadData();
              this.toastr.SuccessToastr("Application status has been changed successfully.");
              this.modalService.dismissAll();
            } else {
              this.toastr.ErrorToastr(res.message);
            }
            $("#loader").hide();
          },
          (err: any) => {
            this.toastr.ErrorToastr("Something went wrong");
            $("#loader").hide();
          }
        );
    } else {
      this.applicationService.changeApplicationStatus(input).subscribe(
        (res) => {
          if (res.status) {
            this.loadData();
            this.toastr.SuccessToastr("Application status has been changed successfully.");
            this.modalService.dismissAll();
          } else {
            $("#loader").hide();
            this.toastr.ErrorToastr(res.message);
          }
        },
        (err: any) => {
          $("#loader").hide();
          this.toastr.ErrorToastr("Something went wrong");
        }
      );
    }

    if (this.selectedDocumentList.length > 0) {
      let docInput = {
        applicationId: input.contentId,
        documentIds: this.selectedDocumentList,
      };
      $("#loader").show();
      this.documentService.DocumentRequest(docInput).subscribe(
        (res) => {
          if (res.status) {
            this.selectedDocumentList = [];
            this.isShowDocReq = false;
            $("#loader").hide();
          } else {
            $("#loader").hide();
            this.toastr.ErrorToastr(res.message);
          }
        },
        (err: any) => {
          $("#loader").hide();
          this.toastr.ErrorToastr("Something went wrong");
          console.error(err);
        }
      );
    } else {
      // $("#loader").hide();
      this.selectedDocumentList = [];
      this.isShowDocReq = false;
    }
  }

  onchangeStatus(e: any) {
    this.isShowDocReq = false;
    this.selectedDocumentList = [];
    this.isResonShow = false;
    if (e.target.value == 5 || e.target.value == 6 || e.target.value == 7) {
      this.applicationStatusForm
        .get("comment")
        .addValidators(Validators.required);
      this.isResonShow = true;
    } else if (e.target.value == 4) {
      this.applicationStatusForm.get("comment").setValue("");
      this.applicationStatusForm.get("comment").clearValidators();
      this.applicationStatusForm.get("comment").updateValueAndValidity();
      this.isShowDocReq = true;
      if (this.documentList.length == 0) {
        let getDocument = {
          ApplicationId: this.storeApplicationId,
        };
        $("#loader").show();
        //this.storeApplicationId = applicationId;
        this.applicationService.getDocumentfilterList(getDocument).subscribe(
          (res) => {
            if (res.status) {
              this.documentList = res.data.filter((m) => !m.isChecked);
            }
            $("#loader").hide();
          },
          (err: any) => {
            $("#loader").hide();
            this.toastr.ErrorToastr("Something went wrong");
            console.error(err);
          }
        );
      }
    } else {
      this.applicationStatusForm.get("comment").setValue("");
      this.applicationStatusForm.get("comment").clearValidators();
      this.applicationStatusForm.get("comment").updateValueAndValidity();
      this.isResonShow = false;
    }
  }

  addNewComment() {
    $("#loader").show();
    let input = JSON.parse(JSON.stringify(this.commentForm.getRawValue()));
    this.applicationService.AddComment(input).subscribe(
      (res) => {
        if (res.status) {
          this.getAllComments();
          this.commentForm.reset();
          this.commentForm
            .get("applicationId")
            .setValue(this.application.applicationId);
          this.loadData();
        }
        $("#loader").hide();
      },
      (err: any) => {
        $("#loader").hide();
        this.toastr.ErrorToastr("Something went wrong");
        console.error(err);
      }
    );
  }

  getAllComments() {
    let input = {
      Id: this.application.applicationId,
    };
    $("#loader").show();
    this.applicationService.getComments(input).subscribe(
      (res) => {
        if (res.status) {
          this.applicationComments = res.data;
        }
        $("#loader").hide();
      },
      (err: any) => {
        this.toastr.ErrorToastr("Something went wrong");
        console.error(err);
        $("#loader").hide();
      }
    );
  }
  addNewNote() {
    $("#loader").show();
    let input = JSON.parse(JSON.stringify(this.noteForm.getRawValue()));
    this.applicationService.AddNote(input).subscribe(
      (res) => {
        if (res.status) {
          this.getAllNotes();
          this.noteForm.reset();
          this.noteForm
            .get("applicationId")
            .setValue(this.application.applicationId);
          this.loadData();
        }
        $("#loader").hide();
      },
      (err: any) => {
        this.toastr.ErrorToastr("Something went wrong");
        console.error(err);
        $("#loader").hide();
      }
    );
  }
  getAllNotes() {
    let input = {
      Id: this.application.applicationId,
    };
    $("#loader").show();
    this.applicationService.getNotes(input).subscribe(
      (res) => {
        if (res.status) {
          this.applicationNotes = res.data;
        }
        $("#loader").hide();
      },
      (err: any) => {
        this.toastr.ErrorToastr("Something went wrong");
        console.error(err);
        $("#loader").hide();
      }
    );
  }

  getDateFormat(date, format) {
    let today = moment().format(format);
    let yesterday = moment(-1, "days").format(format);
    let tommorrow = moment(1, "days").format(format);
    let nowDate = moment(date).format(format);
    if (today == nowDate) return "Today";
    else if (yesterday == nowDate) return "Yesterday";
    else if (tommorrow == nowDate) return "Tommorrow";
    else return nowDate;
  }

  addNewApplication() {
    console.log("click on button" );
    let input = {
      action: "add",
    };
    this.emitService.onchangeApplicationId(input);
    
  }
  isCall = false;
  ScrollHandeler(event, requestType) {
    var skipData = 10;
    var isMaxApplication = false;
    if (requestType == 1 && this.totalInprogress <= this.skipInprogressData)
      isMaxApplication = true;
    if (requestType == 2 && this.totalReceived <= this.skipReceiveData)
      isMaxApplication = true;
    if (requestType == 3 && this.totalAccepted <= this.skipApproveData)
      isMaxApplication = true;
    if (requestType == 4 && this.totalRejected <= this.skipRejectData)
      isMaxApplication = true;
    if (requestType == 5 && this.totalSeen <= this.skipSeenData)
      isMaxApplication = true;
    if (event.deltaY > 0 && !this.isCall && !isMaxApplication) {
      if (requestType == 1) skipData = this.skipInprogressData;
      else if (requestType == 2) skipData = this.skipReceiveData;
      else if (requestType == 3) skipData = this.skipApproveData;
      else if (requestType == 5) skipData = this.skipSeenData;
      else skipData = this.skipRejectData;
      let AppliedDatestartDate = null;
      let AppliedDateendDate = null;
      var inputData = JSON.parse(JSON.stringify(this.filterForm.getRawValue()));
      if (inputData.AppliedDate == null) AppliedDatestartDate = null;
      else AppliedDatestartDate = inputData.AppliedDate.startDate;
      if (inputData.AppliedDate == null) AppliedDateendDate = null;
      else AppliedDateendDate = inputData.AppliedDate.endDate;
      var input = {
        ...inputData,
        campusId: this.headerCampusId,
        intakeId: this.headerIntakeId,
        AppliedStartDate: AppliedDatestartDate,
        AppliedEndDate: AppliedDateendDate,
        skip: skipData,
        take: 2,
        requestType: requestType,
      };
      this.isCall = true;
      this.kanbanService
        .getApplicationsOnScroll(input)
        .subscribe((res: any) => {
          this.isCall = false;
          if (res.status) {
            if (requestType == 1) {
              this.inprogressApplication = this.inprogressApplication.concat(
                res.data
              );
              this.skipInprogressData += 2;
            } else if (requestType == 2) {
              this.receiveApplication = this.receiveApplication.concat(
                res.data
              );
              this.skipReceiveData += 2;
            } else if (requestType == 3) {
              this.approveApplication = this.approveApplication.concat(
                res.data
              );
              this.skipApproveData += 2;
            } else if (requestType == 4) {
              this.rejectApplication = this.rejectApplication.concat(res.data);
              this.skipRejectData += 2;
            } else if (requestType == 5) {
              this.seenApplication = this.seenApplication.concat(res.data);
              this.skipSeenData += 2;
            }
          }
        });
    }
  }

  datePickerChange(e) {
    if (!e.startDate) this.filterForm.get("AppliedDate").reset();
  }

  clearFilterData() {
    this.filterForm.reset();
    this.loadData();
    $("#loader").hide();
  }
}
