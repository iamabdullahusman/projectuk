import { CdkDragDrop, transferArrayItem } from "@angular/cdk/drag-drop";
import { Component, Input, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Campus } from "src/app/models/campus.model";
import { Course } from "src/app/models/course.model";

import { ApplicationService } from "src/app/services/application.service";
import { CampusService } from "src/app/services/campus.service";
import { CoursesService } from "src/app/services/courses.service";
import { DocumentService } from "src/app/Services/document.service";
import { EmittService } from "src/app/Services/emitt.service";
import { KanbanService } from "src/app/Services/kanban.service";
import { SessionStorageService } from "src/app/services/session-storage.service";
import { ToastrServiceService } from "src/app/services/toastr-service.service";
import { UserInquiryService } from "src/app/services/user-inquiry.service";
import { forkJoin } from "rxjs";
import { UserManagement } from "src/app/services/user-management.service";

import { AccountService } from "src/app/Services/account.service";
import { Country } from "src/app/Models/country.model";
import { SocialreferenceService } from "src/app/services/socialreference.service";
import { SocialPreference } from "src/app/models/social-preference.model";
import { DatetimeService } from "src/app/Services/datetime.service";
import dayjs from "dayjs";

@Component({
  selector: "app-document-dashboard",
  templateUrl: "./document-dashboard.component.html",
  styleUrls: ["./document-dashboard.component.sass"],
})
export class DocumentDashboardComponent implements OnInit {
  // header inputs
  headerCampusId: number = 0;
  headerIntakeId: number = 0;
  search: string = "";
  userType: any;
  archiveApplicationId = 0;
  archiveStatus = 0;
  archiveStatuses = [];
  dashbaordData: any = [];
  applicationComments = [];
  applicationNotes = [];
  applicationStages = [];
  ChangeManageby = [];
  regionalmanager = [];
  subadmins = [];
  headerName: string = "";
  skipInprogressData = 0;
  skipReceiveData = 0;
  skipApproveData = 0;
  skipRejectData = 0;
  inquiryAssignedToId: any;
  // FilterList = [];
  // SelectedFilter: any;
  courses: Array<Course> = [];
  campuses: Array<Campus> = [];
  countries: Array<Country> = [];
  sources: Array<SocialPreference> = [];
  assignedTo = [];
  RMs: [];
  agents = [];
  commentForm: FormGroup = new FormGroup({
    applicationId: new FormControl(),
    comment: new FormControl(),
  });
  noteForm: FormGroup = new FormGroup({
    applicationId: new FormControl(),
    note: new FormControl(),
  });

  applicationStatusForm: FormGroup = new FormGroup({
    contentId: new FormControl(),
    statusId: new FormControl(),
    comment: new FormControl(),
  });

  filterForm: FormGroup = new FormGroup({
    Course: new FormControl(),
    Stage: new FormControl(),
    AppliedDate: new FormControl(),
    AssignedTo: new FormControl(),
    DateRange: new FormControl(),
    Agent: new FormControl(),
    RM: new FormControl(),
    Country: new FormControl(),
    Source: new FormControl(),
    ApplicantName: new FormControl(),
  });
  AppliedDate: any;
  DateRange: any;
  application: any;
  requestFrom = "document";
  constructor(
    private formBuilder: FormBuilder,
    private documentService: DocumentService,
    private router: Router,
    private toastr: ToastrServiceService,
    private applicationService: ApplicationService,
    private kanbanService: KanbanService,
    private modalService: NgbModal,
    private emittService: EmittService,
    private userService: UserManagement,
    private sessionService: SessionStorageService,
    private inquiryServices: UserInquiryService,
    private courseService: CoursesService,
    private campusService: CampusService,
    private accountService: AccountService,
    private socialReferanceService: SocialreferenceService,
    private dateTimeService: DatetimeService
  ) {
    this.userType = sessionService.getUserType();
    emittService.onChangeAddApplicationbtnHideShow(false);
    emittService.GetCampusIntakeChange().subscribe((res) => {
      this.headerCampusId = res.campusId;
      this.headerIntakeId = res.intakeId;
      this.search = res.name;
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
    this.filterForm = formBuilder.group({
      Course: null,
      Stage: null,
      AppliedDate: null,
      AssignedTo: null,
      Date: null,
      Agent: null,
      RM: null,
      Country: null,
      Source: null,
      ApplicantName: null,
    });
    emittService.getapplicationChange().subscribe((res) => {
      if (this.requestFrom == res) this.loadData();
    });
  }

  ngOnInit(): void {
    this.loadForm();
    this.loadData();
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
    // let campusData = this.campusService.getAllCampaus(paginationModal);
    // let RMData = this.userService.getUsersByType(RMInputs);
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

  loadForm() {
    $("#loader").show();
    let managedata = this.applicationService.GetManageUser();
    managedata.subscribe((result) => {
      if (result.status) {
        this.ChangeManageby = result.data;
        this.ChangeManageby.unshift({
          name: "All",
          userId: 0,
          userTypeId: 0,
          userTypeName: "All",
        });
        this.RMs = result.data.filter((m) => m.userTypeId == 3);
        this.agents = result.data.filter((m) => m.userTypeId == 4);
        this.assignedTo = result.data.filter(
          (m) => m.userTypeId == 1 || m.userTypeId == 2
        );
      } else {
        this.toastr.ErrorToastr("Something went wrong");
      }
      $("#loader").hide();
    });
  }
  groupByFn = (item) => item.userTypeName;
  selectedAccounts = [1];
  groupValueFn = (_: string, children: any[]) => ({
    name: children[0].userTypeName,
  });

  headerFilter() {
    this.emittService.GetCampusIntakeChange().subscribe((res) => {
      this.headerCampusId = res.campusId;
      this.headerIntakeId = res.intakeId;
      this.headerName = res.name;
      this.search = res.name;
      this.loadData();
    });
  }
  get f() {
    return this.applicationStatusForm.controls;
  }
  loadAndRMSStatus() {
    $("#loader").show();
    this.kanbanService.getStagesByPerent({ id: 8 }).subscribe(
      (result) => {
        if (result.status) {
          this.archiveStatuses = result.data.subStages.filter(
            (m) =>
              m.stageName.toLowerCase() != "received" &&
              m.stageName.toLowerCase() != "accepted"
          );
          this.applicationStages = result.data.subStages;
          this.applicationStages.unshift({
            parentId: 1,
            stageId: 4,
            stageName: "Requested",
          });
          this.applicationStages.push({
            parentId: 23,
            stageId: 47,
            stageName: "Expired",
          });
        }
        $("#loader").hide();
      },
      (err: any) => {
        if (err.status == 401) {
          this.router.navigate(["/"]);
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
        $("#loader").hide();
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
    $("#loader").show();
    this.skipInprogressData = 0;
    var inputData = this.filterForm.getRawValue();
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

    let input = {
      ...inputData,
      campusId: parseInt(this.sessionService.getCampusId()),
      intakeId: parseInt(this.sessionService.getIntakeId()),
      skip: this.skipInprogressData,
      take: 10,
      appliedStartDate: AppliedDatestartDate,
      appliedEndDate: AppliedDateendDate,
      dateStartRange: this.DateRange?.startDate?.$d,
      dateEndRange: this.DateRange?.endDate?.$d,
    };
    this.documentService.getDocumentDashboardData(input).subscribe(
      (res) => {
        if (res.status) {
          this.skipApproveData = 10;
          this.skipInprogressData = 10;
          this.skipReceiveData = 10;
          this.skipRejectData = 10;
          this.dashbaordData = res.data;
        } else {
          this.toastr.ErrorToastr(res.message);
        }
        $("#loader").hide();
      },
      (err: any) => {
        if (err.status == 401) {
          this.router.navigate(["/"]);
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
        $("#loader").hide();
      }
    );
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
      this.getApplication(null, application.applicationId);
    }
  }
  dropOnArchive(content, event: CdkDragDrop<string[]>) {
    $("#loader").show();
    var application = JSON.parse(
      JSON.stringify(event.previousContainer.data[event.previousIndex])
    );
    this.archiveApplicationId = application.applicationId;
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

  updateArchive() {

    var inputData = JSON.parse(
      JSON.stringify(this.applicationStatusForm.getRawValue())
    );
    $("#loader").show();
    var input = {
      contentId: this.archiveApplicationId,
      statusId: inputData.statusId,
      comment: inputData.comment,
    };
    this.applicationService.changeApplicationStatus(input).subscribe(
      (res) => {
        //$("#loader").hide();
        if (res.status) {
          this.loadData();
          this.toastr.SuccessToastr("Application status has been changed successfully.");
          this.modalService.dismissAll();
          this.archiveApplicationId = 0;
          this.archiveStatus = 0;
        } else {
          // $("#loader").hide();
          this.toastr.ErrorToastr(res.message);
        }
        $("#loader").hide();
      },
      (err: any) => {
        // $("#loader").hide();
        this.toastr.ErrorToastr("Something went wrong");
        $("#loader").hide();
      }
    );
  }

  getApplication(content: any, id: any) {
    $("#loader").show();
    let input = {
      id: id,
      page: this.requestFrom,
      action: "view",
      tabIndex: "1",
    };
    $("#loader").hide();
    this.emittService.onchangeApplicationId(input);
    this.emittService.changeApplicationParentstatus(8);
  }
  isCall = false;
  ScrollHandeler(event, requestType) {
    var skipData = 10;
    var isMaxApplication = false;
    if (
      requestType == 1 &&
      this.dashbaordData.totalRequested <= this.skipInprogressData
    )
      isMaxApplication = true;
    if (
      requestType == 2 &&
      this.dashbaordData.totalReceived <= this.skipReceiveData
    )
      isMaxApplication = true;
    if (
      requestType == 3 &&
      this.dashbaordData.totalAccepted <= this.skipApproveData
    )
      isMaxApplication = true;
    if (
      requestType == 4 &&
      this.dashbaordData.totalArchived <= this.skipRejectData
    )
      isMaxApplication = true;
    if (event.deltaY > 0 && !this.isCall && !isMaxApplication) {
      if (requestType == 1) skipData = this.skipInprogressData;
      else if (requestType == 2) skipData = this.skipReceiveData;
      else if (requestType == 3) skipData = this.skipApproveData;
      else skipData = this.skipRejectData;
      // var input = {
      //   campusId: this.headerCampusId,
      //   intakeId: this.headerIntakeId,
      //   search: this.headerName,
      //   stageId: 1,
      //   size: 0,
      //   index: 0,
      //   assignBy: this.inquiryAssignedToId,
      //   skip: skipData,
      //   take: 2,
      //   requestType: requestType
      // }
      var inputData = this.filterForm.getRawValue();
      let input = {
        ...inputData,
        campusId: parseInt(this.sessionService.getCampusId()),
        intakeId: parseInt(this.sessionService.getIntakeId()),
        skip: skipData,
        take: 2,
        appliedStartDate: this.AppliedDate?.startDate?.$d,
        appliedEndDate: this.AppliedDate?.endDate?.$d,
        dateStartRange: this.DateRange?.startDate?.$d,
        dateEndRange: this.DateRange?.endDate?.$d,
        requestType: requestType,
      };
      this.isCall = true;
      this.documentService.DocumentsOnScroll(input).subscribe((res: any) => {
        this.isCall = false;
        if (res.status) {
          if (requestType == 1) {
            this.dashbaordData.requested = this.dashbaordData.requested.concat(
              res.data
            );
            this.skipInprogressData += 2;
          } else if (requestType == 2) {
            this.dashbaordData.received = this.dashbaordData.received.concat(
              res.data
            );
            this.skipReceiveData += 2;
          } else if (requestType == 3) {
            this.dashbaordData.accepted = this.dashbaordData.accepted.concat(
              res.data
            );
            this.skipApproveData += 2;
          } else if (requestType == 4) {
            this.dashbaordData.archived = this.dashbaordData.archived.concat(
              res.data
            );
            this.skipRejectData += 2;
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
