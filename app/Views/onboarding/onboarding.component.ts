import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { UserInquiryService } from "src/app/services/user-inquiry.service";
import { Router } from "@angular/router";
import { ToastrServiceService } from "src/app/Services/toastr-service.service";
import { EmittService } from "src/app/Services/emitt.service";
import { OnboardService } from "src/app/Services/onboard.service";
import { SessionStorageService } from "src/app/Services/session-storage.service";
import { CdkDragDrop } from "@angular/cdk/drag-drop";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { Course } from "src/app/models/course.model";
import { AccountService } from "src/app/Services/account.service";
import { ApplicationService } from "src/app/services/application.service";
import { CoursesService } from "src/app/services/courses.service";
import { forkJoin } from "rxjs";
import { SocialreferenceService } from "src/app/services/socialreference.service";
import { SocialPreference } from "src/app/models/social-preference.model";
import { DatetimeService } from "src/app/Services/datetime.service";
import dayjs from "dayjs";
@Component({
  selector: "app-onboarding",
  templateUrl: "./onboarding.component.html",
  styleUrls: ["./onboarding.component.sass"],
})
export class OnboardingComponent implements OnInit {
  courses: Array<Course> = [];
  assignedTo = [];
  RMs: [];
  agents = [];
  SelectedCourse: 0;
  isData = false;
  birthdatedata: any;
  headerCampusId: number = 0;
  headerIntakeId: number = 0;
  search: string = "";
  ChangeManageby = [];
  arrivalairport = [];
  application: any;
  inquiryAssignedToId: any;
  requestFrom = "studentOnboard";
  headerName: any;
  aditionalHideShow = false;
  aditionalTransShow = false;
  readyForWelcomeKitData: any = [];
  welcomeKitData: any = [];
  airportData: any = [];
  campusData: any = [];
  documentData: any = [];
  archiveData: any = [];
  skipReadyForWelcomeKit = 0;
  skipWelcomeKit = 0;
  skipAirportArrive = 0;
  skipCampusArrive = 0;
  skipDocument = 0;
  skipArchived = 0;
  selectApplictions = [];
  ReadyForWelcomeKitApplication = [];
  issubmitted = false;
  countries = [];
  departCities = [];
  arrivalCities = [];
  userType: any;
  applicationStatusForm: FormGroup = new FormGroup({
    contentId: new FormControl(),
    statusId: new FormControl(),
    arrivalDate: new FormControl(),
    arrivalTime: new FormControl(),
  });

  arrivalDataForm: FormGroup = new FormGroup({
    AirportId: new FormControl(),
    ApplicationId: new FormControl(),
    AirlineName: new FormControl(),
    FlightNumber: new FormControl(),
    DepartureLocation: new FormControl(),
    ArrivalLocation: new FormControl(),
    ArrivalDate: new FormControl(),
    ArrivalTime: new FormControl(),
    Age: new FormControl(),
    CollegeResident: new FormControl(),
    BoardingStudent: new FormControl(),
    AccommodationAddress: new FormControl(),
    Londontravel: new FormControl(),
    TravelHubCollection: new FormControl(),
    AdditionalPassengers: new FormControl(),
    TotalAditionalPassengers: new FormControl(),
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
  @ViewChild("ApplicationStatusChange") applicationStatusModal: ElementRef;
  @ViewChild("SendWelcomeKitModal") SendWelcomeKitModal: ElementRef;
  @ViewChild("ArrivalFormModal") ArrivalFormModal: ElementRef;
  SetDate: any;
  constructor(
    private router: Router,
    private toastr: ToastrServiceService,
    private socialReferanceService: SocialreferenceService,
    private courseService: CoursesService,
    private emitService: EmittService,
    private inquiryServices: UserInquiryService,
    private onboardService: OnboardService,
    private sessionService: SessionStorageService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private applicationService: ApplicationService,
    private dateTimeService: DatetimeService
  ) {
    this.userType = sessionService.getUserType();
    emitService.onChangeAddApplicationbtnHideShow(false);
    this.filterForm = formBuilder.group({
      Course: [],
      Stage: [],
      AppliedDate: [null],
      AssignedTo: [],
      Date: [null],
      Agent: [],
      RM: [],
      Country: [],
      Source: [],
      ApplicantName: [null],
    });
    emitService.GetCampusIntakeChange().subscribe((res) => {
      this.headerCampusId = res.campusId;
      this.headerIntakeId = res.intakeId;
      this.search = res.name;
    });
    emitService.getapplicationChange().subscribe((res) => {
      if (this.requestFrom == res) this.loadData();
    });
    this.applicationStatusForm = formBuilder.group({
      contentId: [null, [Validators.required]],
      statusId: [null, [Validators.required]],
      arrivalDate: [null, [Validators.required]],
      arrivalTime: [null, [Validators.required]],
    });
    this.arrivalDataForm = formBuilder.group(
      {
        AirportId: [0, [Validators.required]],
        ApplicationId: [0, [Validators.required]],
        AirlineName: ["", [Validators.required]],
        FlightNumber: [
          "",
          [Validators.required, Validators.pattern(/(^[A-Z0-9]{4,}$)/), Validators.maxLength(10)],
        ],
        DepartureLocation: [null, [Validators.required]],
        DepartureCountry: [null, [Validators.required]],
        ArrivalCountry: [null, [Validators.required]],
        ArrivalLocation: [null, [Validators.required]],
        ArrivalDate: ["", [Validators.required]],
        ArrivalTime: ["", [Validators.required]],
        Age: ["", [Validators.required]],
        CollegeResident: [""],
        BoardingStudent: ["", [Validators.required]],
        AccommodationAddress: ["", [Validators.required]],
        Londontravel: [""],
        TravelHubCollection: [null],
        AdditionalPassengers: [null],
        TotalAditionalPassengers: [null],
      },
      (err: any) => {
        if (err.status == 401) {
          this.router.navigate(["/"]);
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
      }
    );
  }
  
  dropdownList: any;
  dropdownSettings: any;
  sources: Array<SocialPreference> = [];

  ngOnInit(): void {
    this.loadCountry();
    this.airportNameList();
    this.SetDate = moment().format("YYYY-MM-DD");
    this.loadForm();
    this.headerFilter();
    this.loadAndRMSStatus();
    this.arrivalDataForm.get('Londontravel').valueChanges.subscribe((value) => {
      console.log("Londontravel",value);
      this.aditionalTransShow = value !== 'true';
      // If 'No' is selected, submit the form
    // if (value === 'false') {
    //   this.saveArrivaldata(); // Trigger the form submission when 'No' is selected
    // }
    });
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
  archiveStatuses = [];
  applicationStages = [];
  loadAndRMSStatus() {
    console.log("Aplication Stage: ",this.applicationStages);
    this.applicationStages.push({
      stageName: "Ready for welcomekit",
      stageId: 11,
    });
    this.applicationStages.push({
      stageName: "Welcomekit",
      stageId: 1,
    });
    this.applicationStages.push({
      stageName: "Arrival",
      stageId: 2,
    });
    this.applicationStages.push({
      stageName: "Campus Request",
      stageId: 3,
    });
    this.applicationStages.push({
      stageName: "Campus Accept",
      stageId: 4,
    });
    this.applicationStages.push({
      stageName: "Campus Reject",
      stageId: 5,
    });
    this.applicationStages.push({
      stageName: "Campus Reschesdule",
      stageId: 6,
    });
    this.applicationStages.push({
      stageName: "Documatation",
      stageId: 7,
    });
    this.applicationStages.push({
      stageName: "On-Hold",
      stageId: 61,
    });
    this.applicationStages.push({
      stageName: "Rejected",
      stageId: 60,
    });
    this.applicationStages.push({
      stageName: "Withdrawn",
      stageId: 59,
    });
    this.applicationStages.push({
      stageName: "Expired",
      stageId: 47,
    });
  }

  getApplication(id: any) {
    let input = {
      id: id,
      page: this.requestFrom,
      action: "view",
    };
    this.emitService.onchangeApplicationId(input);
    this.emitService.changeApplicationParentstatus(1);
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
    this.skipWelcomeKit = 0;
    var forminput = this.filterForm.getRawValue();
    let AppliedDatestartDate = null;
    let AppliedDateendDate = null;
    if (forminput.AppliedDate == null) AppliedDatestartDate = null;
    else
      AppliedDatestartDate = this.dateTimeService.setWriteOffset(
        dayjs(forminput.AppliedDate.startDate).toDate()
      );
    if (forminput.AppliedDate == null) AppliedDateendDate = null;
    else
      AppliedDateendDate = this.dateTimeService.setWriteOffset(
        dayjs(forminput.AppliedDate.startDate).toDate()
      );

    $("#loader").show();
    let input = {
      ...forminput,
      appliedStartDate: AppliedDatestartDate,
      appliedEndDate: AppliedDateendDate,
      campusId: parseInt(this.sessionService.getCampusId()),
      intakeId: parseInt(this.sessionService.getIntakeId()),
      skip: this.skipWelcomeKit,
      take: 10,
    };
    this.onboardService.getOnboardApplications(input).subscribe(
      (res) => {
        if (res.status) {
          this.skipReadyForWelcomeKit = 10;
          this.skipWelcomeKit = 10;
          this.skipAirportArrive = 10;
          this.skipArchived = 10;
          this.skipCampusArrive = 10;
          this.skipDocument = 10;
          this.welcomeKitData = res.data.welcomeKit;
          this.readyForWelcomeKitData = res.data.readyForWelcomeKit;
          this.airportData = res.data.airportArrival;
          this.campusData = res.data.campusArrival;
          this.documentData = res.data.documentation;
          this.archiveData = res.data.archived;
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
        this.toastr.ErrorToastr(result.message);
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
    this.emitService.GetCampusIntakeChange().subscribe((res) => {
      this.headerCampusId = res.campusId;
      this.headerIntakeId = res.intakeId;
      this.headerName = res.name;
      this.search = res.name;
      this.loadData();
    });
  }

  dropOnCampus(event: CdkDragDrop<any>, dropContainer: any) {
    $("#loader").show();


  //Abdullah's Code  
    const draggedItem = event.previousContainer.data[event.previousIndex];
 
  // Check if dragged item is undefined or null
  if (!draggedItem) {
    $("#loader").hide();
    this.toastr.ErrorToastr("Sorry! You have pending documents to approve");
    return;
  }
 
  // Convert the dragged item to a JSON string and then parse it
  var application = JSON.parse(JSON.stringify(draggedItem));



    // var application = JSON.parse(
    //   JSON.stringify(event.previousContainer.data[event.previousIndex])
    // );
    if (event.previousContainer != event.container) {
      if (
        application.isVisaStudent == null ||
        application.isVisaStudent == false ||
        (application.isVisaStudent && application.applicationStatus == 2)
      ) {
        this.applicationStatusForm.reset();
        this.applicationStatusForm
          .get("contentId")
          .setValue(application.applicationId);
        this.applicationStatusForm.get("statusId").setValue(dropContainer);
        this.modalService.open(this.applicationStatusModal, {
          ariaLabelledBy: "modal-basic-title",
          size: "lg",
          backdrop: false,
        });
        $("#loader").hide();
      } else {
        $("#loader").hide();
        this.toastr.ErrorToastr(
          "This application does not fill airport arrival form"
        );
      }
    }
  }

  ChangeApplicationStatus() {
    $("#loader").show();
    var input = JSON.parse(
      JSON.stringify(this.applicationStatusForm.getRawValue())
    );

    this.onboardService.changeStatus(input).subscribe(
      (res) => {
        if (res.status) {
          this.loadData();
          this.toastr.SuccessToastr("Application status has been changed successfully.");
          this.modalService.dismissAll();
          this.applicationStatusForm.reset();
        } else {
          this.toastr.ErrorToastr(res.message);
        }
        $("#loader").hide();
      },
      (err: any) => {
        this.toastr.ErrorToastr("Something went wrong");
      }
    );
  }

  get f() {
    return this.applicationStatusForm.controls;
  }
  get fArrival() {
    return this.arrivalDataForm.controls;
  }

  sendWelcomeKit() {
    this.selectApplictions = [];
    this.issubmitted = false;
    this.ReadyForWelcomeKitApplication =
      this.readyForWelcomeKitData.readyForWelcomeKit.map((m) => ({
        name: m.lastName + " " + m.firstName,
        applicationId: m.applicationId,
      }));
    this.modalService.open(this.SendWelcomeKitModal, {
      ariaLabelledBy: "modal-basic-title",
    });
  }

  isCall = false;
  ScrollHandeler(event, requestType) {
    if (event.deltaY > 0 && !this.isCall) {
      if (
        requestType == 1 &&
        this.welcomeKitData.applicationCount > this.skipWelcomeKit
      ) {
        this.isCall = true;
        let input = {
          campusId: parseInt(this.sessionService.getCampusId()),
          intakeId: parseInt(this.sessionService.getIntakeId()),
          search: this.headerName,
          assignBy: this.inquiryAssignedToId,
          skip: this.skipWelcomeKit,
          take: 2,
        };
        this.onboardService
          .GetWelcomeKitOnScrollData(input)
          .subscribe((res) => {
            this.isCall = false;
            if (res.status) {
              this.skipWelcomeKit += 2;
              this.welcomeKitData.welcomeKit =
                this.welcomeKitData.welcomeKit.concat(res.data);
            }
          });
      }
      if (
        requestType == 2 &&
        this.airportData.applicationCount > this.skipAirportArrive
      ) {
        this.isCall = true;
        let input = {
          campusId: parseInt(this.sessionService.getCampusId()),
          intakeId: parseInt(this.sessionService.getIntakeId()),
          search: this.headerName,
          assignBy: this.inquiryAssignedToId,
          skip: this.skipAirportArrive,
          take: 2,
        };
        this.onboardService
          .GetAirportArrivalOnScrollData(input)
          .subscribe((res) => {
            this.isCall = false;
            if (res.status) {
              this.skipAirportArrive += 2;
              this.airportData.airportArrival =
                this.airportData.airportArrival.concat(res.data);
            }
          });
      }
      if (
        requestType == 3 &&
        this.campusData.applicationCount > this.skipCampusArrive
      ) {
        this.isCall = true;
        let input = {
          campusId: parseInt(this.sessionService.getCampusId()),
          intakeId: parseInt(this.sessionService.getIntakeId()),
          search: this.headerName,
          assignBy: this.inquiryAssignedToId,
          skip: this.skipCampusArrive,
          take: 2,
        };
        this.onboardService
          .GetCampusArrivalOnScrollData(input)
          .subscribe((res) => {
            this.isCall = false;
            if (res.status) {
              this.skipCampusArrive += 2;
              this.campusData.campusArrival =
                this.campusData.campusArrival.concat(res.data);
            }
          });
      }
      if (
        requestType == 4 &&
        this.documentData.applicationCount > this.skipDocument
      ) {
        this.isCall = true;
        let input = {
          campusId: parseInt(this.sessionService.getCampusId()),
          intakeId: parseInt(this.sessionService.getIntakeId()),
          search: this.headerName,
          assignBy: this.inquiryAssignedToId,
          skip: this.skipDocument,
          take: 2,
        };
        this.onboardService.GetDocumentOnScrollData(input).subscribe((res) => {
          this.isCall = false;
          if (res.status) {
            this.skipDocument += 2;
            this.documentData.documentation =
              this.documentData.documentation.concat(res.data);
          }
        });
      }
      if (
        requestType == 5 &&
        this.archiveData.applicationCount > this.skipArchived
      ) {
        this.isCall = true;
        let input = {
          campusId: parseInt(this.sessionService.getCampusId()),
          intakeId: parseInt(this.sessionService.getIntakeId()),
          search: this.headerName,
          assignBy: this.inquiryAssignedToId,
          skip: this.skipArchived,
          take: 2,
        };
        this.onboardService.GetArchiveOnScrollData(input).subscribe((res) => {
          this.isCall = false;
          if (res.status) {
            this.skipArchived += 2;
            this.archiveData.archived = this.archiveData.archived.concat(
              res.data
            );
          }
        });
      }
      if (
        requestType == 6 &&
        this.readyForWelcomeKitData.applicationCount >
          this.skipReadyForWelcomeKit
      ) {
        this.isCall = true;
        let input = {
          campusId: parseInt(this.sessionService.getCampusId()),
          intakeId: parseInt(this.sessionService.getIntakeId()),
          search: this.headerName,
          assignBy: this.inquiryAssignedToId,
          skip: this.skipReadyForWelcomeKit,
          take: 2,
        };
        this.onboardService
          .getReadyForWelcomeKitOnScroll(input)
          .subscribe((res) => {
            this.isCall = false;
            if (res.status) {
              this.skipReadyForWelcomeKit += 2;
              this.readyForWelcomeKitData.readyForWelcomeKit =
                this.readyForWelcomeKitData.readyForWelcomeKit.concat(res.data);
            }
          });
      }
    }
  }
  onSelectAll() {
    this.selectApplictions = [];
    this.selectApplictions = this.ReadyForWelcomeKitApplication.map(
      (m) => m.applicationId
    );
  }

  sendWelcomeKitRequest() {
    this.issubmitted = true;
    if (this.selectApplictions.length > 0) {
      let input = {
        applicationIds: this.selectApplictions,
      };
      $("#loader").show();
      this.onboardService.sendWelcomeKit(input).subscribe(
        (res) => {
          if (res.status) {
            this.modalService.dismissAll();
            this.toastr.SuccessToastr(res.data);
            this.loadData();
          } else {
            this.toastr.ErrorToastr(res.message);
          }
          $("#loader").hide();
        },
        (err: any) => {
          this.toastr.ErrorToastr("Something went wrong");
        }
      );
    }
  }
  dropOnArrval(event) {

    var application = JSON.parse(
      JSON.stringify(event.previousContainer.data[event.previousIndex])
    );
    this.getBirthDate(application.applicationId);
    this.arrivalDataForm
      .get("ApplicationId")
      .setValue(application.applicationId);
    this.modalService.open(this.ArrivalFormModal, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
    });
  }




  loadCountry() {
    $("#loader").show();
    this.accountService.getCountries().subscribe(
      (res) => {
        if (res.status) {
          this.countries = res.data;
          $("#loader").hide();
          this.loadData();
        }
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
  location(CInput: any, isDepart: boolean) {
    if (CInput) {
      $("#loader").show();
      let input = {
        Id: CInput,
      };
      this.accountService.getCitiesByCountryId(input).subscribe(
        (res) => {
          if (res.status) {
            if (isDepart) this.departCities = res.data;
            else this.arrivalCities = res.data;
            if (!this.isData) this.loadData();
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
  }

  saveArrivaldata() {
    if (this.arrivalDataForm.valid) {
      $("#loader").show();
      var formVal = JSON.parse(
        JSON.stringify(this.arrivalDataForm.getRawValue())
      );
      if (typeof formVal.CollegeResident !== "boolean")
        formVal.CollegeResident = this.convertToBoolean(
          formVal.CollegeResident
        );
      if (typeof formVal.BoardingStudent !== "boolean")
        formVal.BoardingStudent = this.convertToBoolean(
          formVal.BoardingStudent
        );
      if (typeof formVal.Londontravel !== "boolean")
        formVal.Londontravel = this.convertToBoolean(formVal.Londontravel);
      if (formVal.TotalAditionalPassengers == "")
        formVal.TotalAditionalPassengers = null;
      this.onboardService.addAirportArrivalData(formVal).subscribe(
        (res) => {
          console.log("Save arrival data",res);
          if (res.status) {
            this.toastr.SuccessToastr("Arrival form submitted successfully.");
            this.arrivalDataForm.reset();
            this.loadData();
            this.modalService.dismissAll();
          } else {
            console.log("Error in Obboarding Arrival");
            this.toastr.ErrorToastr("Arrival form is not submitted.");
          }
          $("#loader").hide();
        },
        (err: any) => {
          this.toastr.ErrorToastr("Something missing");
          $("#loader").hide();
        }
      );
    }
  }

  birthdateCount(e: any) {
    var birthdate = new Date(this.birthdatedata);
    var currentYear = new Date(e.target.value);
    var finalAge = currentYear.getTime() - birthdate.getTime();
    this.arrivalDataForm
      .get("Age")
      .setValue((finalAge / 31536000000).toFixed(0));
  }
  getBirthDate(applicationId: any) {
    $("#loader").show();
    let application = {
      Id: applicationId,
    };
    this.applicationService.getApplicationById(application).subscribe(
      (res) => {
        if (res.status) this.birthdatedata = res.data.dateOfBirth;
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
  airportNameList() {
    $("#loader").show();
    let input = {
      Id: 0,
    };
    this.onboardService.getAirportByLocationId().subscribe(
      (res) => {
        if (res.status) this.arrivalairport = res.data;
        else {
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
  aditionalPassengers(e: any) {
    if (e == true) {
      this.aditionalHideShow = true;
      this.arrivalDataForm
        .get("TotalAditionalPassengers")
        .addValidators([Validators.required]);
    } else {
      this.aditionalHideShow = false;
      this.arrivalDataForm.get("TotalAditionalPassengers").setValue("");
      this.arrivalDataForm.get("TotalAditionalPassengers").clearValidators();
      this.arrivalDataForm
        .get("TotalAditionalPassengers")
        .updateValueAndValidity();
    }
  }
  convertToBoolean(input: any) {
    if (input == "true") {
      return true;
    } else if (input == "false") {
      return false;
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
