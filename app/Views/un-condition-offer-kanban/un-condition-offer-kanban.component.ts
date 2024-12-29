import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { forkJoin } from "rxjs";
import { Campus } from "src/app/models/campus.model";
import { Course } from "src/app/models/course.model";
import { FeePayOption } from "src/app/models/fee-pay-option.model";
import { Intake } from "src/app/models/intake.model";
import { SocialPreference } from "src/app/models/social-preference.model";
import { User } from "src/app/models/user.model";
import { ApplicationService } from "src/app/services/application.service";
import { CampusService } from "src/app/services/campus.service";
import { CoursesService } from "src/app/services/courses.service";
import { EmittService } from "src/app/Services/emitt.service";
import { FeePayByService } from "src/app/Services/feepayby.service";
import { IntakeService } from "src/app/services/intake.service";
import { KanbanService } from "src/app/Services/kanban.service";
import { SocialreferenceService } from "src/app/services/socialreference.service";
import { ToastrServiceService } from "src/app/services/toastr-service.service";
import { UserManagement } from "src/app/services/user-management.service";
import * as moment from "moment";
import { DocumentService } from "src/app/Services/document.service";
import { AlertServiceService } from "src/app/services/alert-service.service";
import { SessionStorageService } from "src/app/services/session-storage.service";
import { UserInquiryService } from "src/app/services/user-inquiry.service";
import { ApplicationOfferService } from "src/app/Services/application-offer.service";
import { OfferStatus } from "src/app/Models/offer-status.model";
import { OnboardService } from "src/app/Services/onboard.service";
import { VisaService } from "src/app/Services/visa.service";
import { AccountService } from "src/app/Services/account.service";
import { Country } from "src/app/Models/country.model";
import dayjs from "dayjs";
import { DatetimeService } from "src/app/Services/datetime.service";

@Component({
  selector: "app-un-condition-offer-kanban",
  templateUrl: "./un-condition-offer-kanban.component.html",
  styleUrls: ["./un-condition-offer-kanban.component.sass"],
})
export class UnConditionOfferKanbanComponent implements OnInit {
  userid: any = 0;
  faCalendarAlt = faCalendarAlt;
  ApplicationStatus = [];

  inProgress = [];
  receive = [];
  accepted = [];
  rejected = [];
  onHold = [];
  stagesWithApplication = [];
  courses: Array<Course> = [];
  intakes: Array<Intake> = [];
  campuses: Array<Campus> = [];
  archiveStatuses = [];
  feePayOptions: Array<FeePayOption> = [];
  SocialPreferences: Array<SocialPreference> = [];
  RMs: Array<User> = [];
  Agents: Array<User> = [];
  applicationStatus = 0;
  application: any;
  archiveApplicationId = 0;
  archiveStatus = 0;
  applications: any;

  headerCampusId: number = 0;
  headerIntakeId: number = 0;
  headerName: string = "";

  totalInprogress: number = 0;
  totaldecline: number = 0;
  totalAccepted: number = 0;
  totalarchive: number = 0;
  totaldefer: number = 0;
  totalReadyForOffer: number = 0;
  totalRatifyOffer: number = 0;

  newdeferCount: number = 0;
  newInprogresssCount: number = 0;
  newReceiveCount: number = 0;
  newdeclineCount: number = 0;
  newarchiveCount: number = 0;
  newReadyForOfferCount: number = 0;
  newRatifyOfferCount: number = 0;

  inprogressOffer = [];
  receiveOffer = [];
  declineOffer = [];
  deferOffer = [];
  readyForOffer = [];
  ratifyOffer = [];
  archivedOffer = [];
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

  inquiryAssignedToId: any;
  courseslist: Array<Course> = [];
  countries: Array<Country> = [];
  sources: Array<SocialPreference> = [];
  SelectedCourse: 0;
  agents = [];
  regionalmanager = [];
  subadmins = [];
  offerStatuss: OfferStatus;

  applicationStatusForm: FormGroup = new FormGroup({
    contentId: new FormControl(),
    statusId: new FormControl(),
    comment: new FormControl(),
  });
  requestFrom = "offer";
  offerType = 1;
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
  constructor(
    private OfferService: ApplicationOfferService,
    private kanbanService: KanbanService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private accountService: AccountService,
    private toastr: ToastrServiceService,
    private applicationService: ApplicationService,
    private formBuilder: FormBuilder,
    private campusService: CampusService,
    private intakeService: IntakeService,
    private courseService: CoursesService,
    private feepayService: FeePayByService,
    private socialReferanceService: SocialreferenceService,
    private userService: UserManagement,
    private emitService: EmittService,
    private documentService: DocumentService,
    private alerts: AlertServiceService,
    private sessionService: SessionStorageService,
    private inquiryServices: UserInquiryService,
    private visaService: VisaService,
    private offerService: ApplicationOfferService,
    private onboardService: OnboardService,
    private dateTimeService:DatetimeService
  ) {
    this.applicationStatusForm = formBuilder.group({
      contentId: [null, [Validators.required]],
      statusId: [null, [Validators.required]],
      comment: [""],
    });
    emitService.getapplicationChange().subscribe((res) => {
      if (this.requestFrom == res) this.loadData();
    });
    emitService.onChangeAddApplicationbtnHideShow(false);
    this.route.queryParams.subscribe((param) => {
      if (param["offerType"]) {
        this.offerType =
          param["offerType"] === "conditional" ? 1 : 2;
          this.loadData();
      }
    });
  }

  ngOnInit(): void {
    this.userid = this.sessionService.getuserID();
    this.loadForm();
    this.headerFilter();
    this.loadAndRMSStatus();
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
    forkJoin([coursesData, countryData, socialPreferenceData]).subscribe(
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

  groupByFn = (item) => item.userTypeName;
  selectedAccounts = [1];
  groupValueFn = (_: string, children: any[]) => ({
    name: children[0].userTypeName,
  });

  dropOnArchive(content, event: CdkDragDrop<string[]>) {
    //$("#loader").show();
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
  }

  headerFilter() {
    this.emitService.GetCampusIntakeChange().subscribe((res) => {
      this.headerCampusId = res.campusId;
      this.headerIntakeId = res.intakeId;
      this.headerName = res.name;
      this.loadData();
    });
    // $('#loader').hide();
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
        }
        $("#loader").hide();
      },
      (err: any) => {
        $("#loader").hide();
        this.toastr.ErrorToastr("something doing wrong");
      }
    );
  }

  getApplication(content: any, id: any) {
    // $('#loader').show();
    let input = {
      id: id,
      page: this.requestFrom,
      action: "view",
      tabIndex: "4",
    };
    this.emitService.onchangeApplicationId(input);
    this.emitService.changeApplicationParentstatus(1);
    $("#loader").hide();
  }
  assignedTo = [];
  loadForm() {
    $("#loader").show();
    let paginationModal = {
      index: 0,
      size: 0,
    };
    let coursesData = this.courseService.getAllCourses(paginationModal);
    let campusData = this.campusService.getAllCampaus(paginationModal);
    let intakeData = this.intakeService.getAllIntake(paginationModal);
    let FeePayOptionData = this.feepayService.getAllFeePayBy(paginationModal);
    let socialPreferenceData =
      this.socialReferanceService.getAllSocialRef(paginationModal);
    let managedata = this.applicationService.GetManageUser();
    forkJoin([
      coursesData,
      campusData,
      intakeData,
      FeePayOptionData,
      socialPreferenceData,
      managedata,
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
            this.campuses = result[1].data.records;
          } else {
            this.toastr.ErrorToastr(result[1].message);
          }
        }
        if (result[2]) {
          if (result[2].status) {
            this.applicationIntakes = result[2].data.records;
          } else {
            this.toastr.ErrorToastr(result[2].message);
          }
        }
        if (result[3]) {
          if (result[3].status) {
            this.feePayOptions = result[3].data.records;
          } else {
            this.toastr.ErrorToastr(result[3].message);
          }
        }
        if (result[4]) {
          if (result[4].status) {
            this.SocialPreferences = result[4].data.records;
          } else {
            this.toastr.ErrorToastr(result[4].message);
          }
        }
        if (result[5]) {
          if (result[5].status) {
            this.RMs = result[5].data.filter((m) => m.userTypeId == 3);
            this.agents = result[5].data.filter((m) => m.userTypeId == 4);
            this.assignedTo = result[5].data.filter(
              (m) => m.userTypeId == 1 || m.userTypeId == 2
            );
          } else {
            this.toastr.ErrorToastr(result[5].message);
          }
        }
        $("#loader").hide();
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
  }

  skipApproveData: any;
  skipInprogressData: any;
  skipReceiveData: any;
  skipRejectData: any;
  skipreadyToOffer: any;
  skipRatify: any;
  OfferList: any;
  loadData() {
    this.headerCampusId =
      this.headerCampusId == 0
        ? parseInt(this.sessionService.getCampusId())
        : this.headerCampusId;
    this.headerIntakeId =
      this.headerIntakeId == 0
        ? parseInt(this.sessionService.getIntakeId())
        : this.headerIntakeId;

    var statuses = this.kanbanService.getStagesByPerent({ id: 23 });
    this.skipInprogressData = 0;

    var inputData = JSON.parse(JSON.stringify(this.filterForm.getRawValue()));
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

    $("#loader").show();

    let paginationModal = {
      ...inputData,
      campusId: parseInt(this.sessionService.getCampusId()),
      intakeId: parseInt(this.sessionService.getIntakeId()),
      skip: this.skipInprogressData,
      take: 10,
      IsConditionalOffer: this.offerType,
      appliedStartDate: AppliedDatestartDate,
      appliedEndDate: AppliedDateendDate,
    };

    this.OfferService.getDashboardOffer(paginationModal).subscribe(
      (res) => {
        if (res.status) {
          this.skipApproveData = 10;
          this.skipInprogressData = 10;
          this.skipReceiveData = 10;
          this.skipRejectData = 10;
          this.skipRatify = 10;
          this.skipreadyToOffer = 10;
          this.inprogressOffer = [];
          this.receiveOffer = [];
          this.deferOffer = [];
          this.archivedOffer = [];
          this.readyForOffer = [];
          this.ratifyOffer = [];
          this.readyForOffer = res.data.readyForOfferApplications;
          this.ratifyOffer = res.data.ratifyApplications;
          this.inprogressOffer = res.data.pendingApplications;
          this.receiveOffer = res.data.acceptedApplications;
          this.deferOffer = res.data.deferedApplications;
          this.archivedOffer = res.data.archivedApplications;
          this.newInprogresssCount = res.data.totalNewPendingApplications;
          this.newReceiveCount = res.data.totalNewAcceptedApplications;
          this.newdeferCount = res.data.totalNewDeferedApplications;
          this.newarchiveCount = res.data.totalNewArchivedApplications;
          this.newReadyForOfferCount = res.data.totalNewReadyForOffer;
          this.newRatifyOfferCount = res.data.totalNewRatify;
          this.totalInprogress = res.data.totalPendingApplications;
          this.totalAccepted = res.data.totalAcceptedApplications;
          this.totaldefer = res.data.totalDeferedApplications;
          this.totalarchive = res.data.totalArchivedApplications;
          this.totalReadyForOffer = res.data.totalReadyForOffer;
          this.totalRatifyOffer = res.data.totalRatify;
          this.OfferList = res.data;
          // this.dashbaordData = res.data;
        } else {
          this.toastr.ErrorToastr(res.message);
        }
        $("#loader").hide();
      },
      (err: any) => {
        if (err.status == 401) {
          //this.router.navigate(['/'])
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
        $("#loader").hide();
      }
    );
    forkJoin(statuses).subscribe((result) => {
      if (result[0]) {
        if (result[0].status) {
          this.ApplicationStatus = result[0].data.subStages;
          this.archiveStatuses = result[0].data.subStages.filter(
            (m) =>
              m.stageName.toLowerCase() != "pending" &&
              m.stageName.toLowerCase() != "accepted" &&
              m.stageName.toLowerCase() != "defer" &&
              m.stageName.toLowerCase() != "declined" &&
              m.stageName.toLowerCase() != "deferaccepted" &&
              m.stageName.toLowerCase() != "deferrejected"
          );
        } else {
          this.toastr.ErrorToastr(result[0].message);
        }
      }
    });

    // });
  }
  get f() {
    return this.applicationStatusForm.controls;
  }
  isCall = false;

  ScrollHandeler(event, requestType) {
    var skipData = 10;
    var isMaxApplication = false;

    if (
      requestType == 1 &&
      this.OfferList.totalPendingApplications <= this.skipInprogressData
    )
      isMaxApplication = true;
    if (
      requestType == 2 &&
      this.OfferList.totalDeferedApplications <= this.skipReceiveData
    )
      isMaxApplication = true;
    if (
      requestType == 3 &&
      this.OfferList.totalAcceptedApplications <= this.skipApproveData
    )
      isMaxApplication = true;
    if (
      requestType == 4 &&
      this.OfferList.totalArchivedApplications <= this.skipRejectData
    )
      isMaxApplication = true;
    if (
      requestType == 5 &&
      this.OfferList.totalReadyForOffer <= this.skipreadyToOffer
    )
      isMaxApplication = true;
    if (requestType == 6 && this.OfferList.totalRatify <= this.skipRatify)
      isMaxApplication = true;
    if (event.deltaY > 0 && !this.isCall && !isMaxApplication) {
      if (requestType == 1) skipData = this.skipInprogressData;
      else if (requestType == 2) skipData = this.skipReceiveData;
      else if (requestType == 3) skipData = this.skipApproveData;
      else if (requestType == 5) skipData = this.skipreadyToOffer;
      else if (requestType == 6) skipData = this.skipRatify;
      else skipData = this.skipRejectData;

      var inputData = JSON.parse(JSON.stringify(this.filterForm.getRawValue()));
      let AppliedDatestartDate = null;
      let AppliedDateendDate = null;
      if (inputData.AppliedDate == null) AppliedDatestartDate = null;
      else AppliedDatestartDate = inputData.AppliedDate.startDate;
      if (inputData.AppliedDate == null) AppliedDateendDate = null;
      else AppliedDateendDate = inputData.AppliedDate.endDate;

      this.skipInprogressData = 0;
      let paginationModal = {
        ...inputData,
        campusId: this.headerCampusId,
        intakeId: this.headerIntakeId,
        skip: skipData,
        take: 2,
        StageId: 1,
        IsConditionalOffer: this.offerType,
        appliedStartDate: AppliedDatestartDate,
        appliedEndDate: AppliedDateendDate,
      };

      this.isCall = true;
      this.OfferService.getOfferScroll(paginationModal).subscribe(
        (res: any) => {
          this.isCall = false;
          if (res.status) {
            if (requestType == 1) {
              this.inprogressOffer = this.inprogressOffer.concat(res.data);
              this.skipInprogressData += 2;
            } else if (requestType == 2) {
              this.deferOffer = this.deferOffer.concat(res.data);
              this.skipReceiveData += 2;
            } else if (requestType == 3) {
              this.receiveOffer = this.receiveOffer.concat(res.data);
              this.skipApproveData += 2;
            } else if (requestType == 4) {
              this.archivedOffer = this.archivedOffer.concat(res.data);
              this.skipRejectData += 2;
            } else if (requestType == 5) {
              this.readyForOffer = this.readyForOffer.concat(res.data);
              this.skipreadyToOffer += 2;
            } else if (requestType == 6) {
              this.ratifyOffer = this.ratifyOffer.concat(res.data);
              this.skipRatify += 2;
            }
          }
        }
      );
    }
  }

  datePickerChange(e) {
    if (!e.startDate) this.filterForm.get("AppliedDate").reset();
  }

  loadAndRMSStatus() {
    this.applicationStages.push({
      stageName: "Issued",
      stageId: 0,
    });
    this.applicationStages.push({
      stageName: "Declined",
      stageId: 1,
    });
    this.applicationStages.push({
      stageName: "AcceptByStudent",
      stageId: 2,
    });
    this.applicationStages.push({
      stageName: "Defer",
      stageId: 3,
    });
    this.applicationStages.push({
      stageName: "Withdrawn",
      stageId: 4,
    });
    this.applicationStages.push({
      stageName: "On_Hold",
      stageId: 5,
    });
    this.applicationStages.push({
      stageName: "Expired",
      stageId: 6,
    });
    this.applicationStages.push({
      stageName: "DeferAccepted",
      stageId: 7,
    });
    this.applicationStages.push({
      stageName: "DeferRejected",
      stageId: 8,
    });
    this.applicationStages.push({
      stageName: "ContinueWithOffer",
      stageId: 9,
    });
    this.applicationStages.push({
      stageName: "Rejected",
      stageId: 10,
    });
    this.applicationStages.push({
      stageName: "Cancel",
      stageId: 11,
    });
    this.applicationStages.push({
      stageName: "Requested",
      stageId: 12,
    });
    this.applicationStages.push({
      stageName: "deferApprovedByUser",
      stageId: 13,
    });
    this.applicationStages.push({
      stageName: "ReadyForOffer",
      stageId: 14,
    });
    this.applicationStages.push({
      stageName: "Ratify",
      stageId: 15,
    });
  }

  updateOfferArchive() {
    $("#loader").show();
    var input = JSON.parse(
      JSON.stringify(this.applicationStatusForm.getRawValue())
    );
    this.applicationService.changeApplicationOfferStatus(input).subscribe(
      (res) => {
        if (res.status) {
          this.loadData();
          this.toastr.SuccessToastr(
            "Application offer status has been changed."
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
        $("#loader").hide();
        this.toastr.ErrorToastr("Something went wrong");
      }
    );
  }
  isAcceptedOffer(offerName: string): boolean {
    // Check other valid offer names, such as "Conditional Offer", etc.
    const validOffers = ["unconditional offer", "conditional offer", "accepted offer"];
    return validOffers.includes(offerName.toLowerCase());
  }
 
  drop(event: CdkDragDrop<string[]>) {
    // var application = JSON.parse(JSON.stringify(event.previousContainer.data[event.previousIndex]));
    if (event.previousContainer !== event.container) {
      var application = JSON.parse(
        JSON.stringify(event.previousContainer.data[event.previousIndex])
      );
      if (application.offerName.toLowerCase() == "unconditional offer" || this.isAcceptedOffer(application.offerName)) {
        let input = {
          applicationId: application.applicationId,
        };
        this.OfferService.MoveToRatify(input).subscribe(
          (res) => {
            if (res.status) {
              this.toastr.SuccessToastr(res.data);
              this.loadData();
              this.alerts
                .ComfirmAlert("Does this applicant requires visa?", "yes", "No")
                .then((res) => {
                  if (res.isConfirmed) {
                    $("#loader").show();
                    var visainput = {
                      statusId: 1,
                      applicationId: application.applicationId,
                    };
                    var visa = this.visaService.ChangeVisaStatus(visainput);
                    var needVisa = this.applicationService.AddVisaStudentStatus(
                      application.applicationId,
                      true
                    );
                    forkJoin([visa, needVisa]).subscribe(
                      (result) => {
                        if (result[0]) {
                        }
                        if (result[1].data == true)
                          this.toastr.SuccessToastr(
                            "Student’s visa status updated successfully "
                          );
                        else
                          this.toastr.ErrorToastr(
                            "Student’s visa status is not updated "
                          );
                      },
                      (err: any) => {
                        this.toastr.ErrorToastr("Something went wrong");
                        console.log(err);
                      }
                    );
                    $("#loader").hide();
                  } else {
                    let input = {
                      applicationId: application.applicationId,
                    };
                    this.onboardService.ReadyForWelcomeKit(input).subscribe(
                      (res) => {
                        if (res.status) {
                          this.toastr.SuccessToastr(res.data);
                        } else {
                          this.toastr.ErrorToastr(res.message);
                        }
                      },
                      (err: any) => {
                        this.toastr.ErrorToastr("Something went wrong");
                      }
                    );
                  }
                });
            } else {
              this.toastr.ErrorToastr(res.message);
            }
          },
          (err: any) => {
            this.toastr.ErrorToastr("Something went wrong");
          }
        );
      } else {
        this.toastr.ErrorToastr(
          "All conditions are checked then move to ratify status."
        );
      }
    }
  }

  noDrop() {
    // if (isDrop == 0)
    return false;
    // else
    //   return true;
  }

  clearFilterData() {
    this.filterForm.reset();
    this.loadData();
    $("#loader").hide();
  }
}
