import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { DashboardService } from "src/app/Services/dashboard.service";
import { EmittService } from "src/app/Services/emitt.service";
import { UserInquiryService } from "src/app/services/user-inquiry.service";
import { forkJoin } from "rxjs";
import { ApplicationService } from "src/app/services/application.service";
import { Router } from "@angular/router";
import * as moment from "moment";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { StudentInquiry } from "src/app/models/student-inquiry.model";
import { SessionStorageService } from "src/app/Services/session-storage.service";
import { Enquirystatus } from "src/app/Models/enquirystatus.model";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AlertServiceService } from "src/app/Services/alert-service.service";
import { Country } from "src/app/Models/country.model";
import { Campus } from "src/app/models/campus.model";
import { CampusService } from "src/app/services/campus.service";
import { AccountService } from "src/app/Services/account.service";
import { SocialreferenceService } from "src/app/services/socialreference.service";
import { User } from "src/app/Models/user.model";
import { Course } from "src/app/models/course.model";
import { CoursesService } from "src/app/services/courses.service";
import { KanbanService } from "src/app/Services/kanban.service";
import { DomSanitizer } from "@angular/platform-browser";
import { AppConfig } from "src/app/appconfig";
import { FileValidationService } from "src/app/Services/file-validation.service";
import { ToastrServiceService } from "src/app/Services/toastr-service.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.sass"],
})
export class DashboardComponent implements OnInit {
  filters: any;
  inquiryId = 0;
  isEditInquiry = false;
  InquiryCount: any;
  InProgressCount: any;
  NewCount: any;
  SeenCount: any;
  ReceivedCount: any;
  ConditionalOfferCount: any;
  UnConditionalOfferCount: any;
  DepositPaidCount: any;
  CasCount: any;
  RegisterCount: any;
  RejectedCount: any;
  WithdrawnCount: any;
  OnHoldCount: any;
  inquiryAssignedToId: any;
  userType: number = 0;
  ChangeManageby = [];
  AssigedUserGroupDetail: [];
  campuses: Array<Campus> = [];
  countries: Array<Country> = [];
  inquiryAssignedById: any;
  modalTitle = "Add Enquiry";
  inquiryCampusId: any;
  inquirySourceId: any;
  inquiryCountryId: any;
  inquiryStatusId: any;
  headerName: string = "";
  nationalitydata: Array<Country> = [];
  coutryofresidentdata: Array<Country> = [];
  RMs: Array<User> = [];
  agents = [];
  assignedTo = "";
  applicationStages = [];
  courses: Array<Course> = [];

  hasViewModel: boolean = false;
  isSubmitted: boolean = true;
  inquiries: Array<StudentInquiry> = [];
  enquirystus: Array<Enquirystatus> = [];
  visaData: any = {
    visaId: 0,
    applicationId: 0,
    visaStatus: 0,
    passportNumber: "",
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
  // variables
  headerCampusId: number = 0;
  headerIntakeId: number = 0;
  route: any;
  istabview: boolean = false;
  islistview: boolean = false;
  Listdata: any;
  selectedindex: string = "0";
  Buttons = [];
  ufpSources: [];
  inquirySources: [];
  Sourse = [];
  @ViewChild("inquiryModal") inquiryModal: ElementRef;
  @ViewChild("CASModal") CASModal: ElementRef;
  @ViewChild("VisaModal") VisaModal: ElementRef;
  @ViewChild("EmailInquiryModal") EmailInquiryModal: ElementRef;

  @ViewChild("div") div: ElementRef;

  dtOptions: DataTables.Settings = {};
  dtOptions1: DataTables.Settings = {};
  dtInquiryOptions: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtOptions3: DataTables.Settings = {};
  dtOptions4: DataTables.Settings = {};
  dtOptions5: DataTables.Settings = {};
  dtOptions6: DataTables.Settings = {};
  dtOptions7: DataTables.Settings = {};
  dtOptions8: DataTables.Settings = {};
  dtOptions9: DataTables.Settings = {};
  dtOptions10: DataTables.Settings = {};
  dtOptions11: DataTables.Settings = {};

  form: FormGroup = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    dob: new FormControl(),
    contactNo: new FormControl(),
    email: new FormControl(),
    campusId: new FormControl(),
    countryId: new FormControl(),
    sourceId: new FormControl(),
    inquiryStatus: new FormControl(),
    assignedToId: new FormControl(),
    message: new FormControl(),
    inquiryId: new FormControl(),
    references: new FormControl(),
  });
  CASform: FormGroup = new FormGroup({
    ApplicationId: new FormControl(),
    cas: new FormControl(),
  });
  Visaform: FormGroup = new FormGroup({
    ApplicationId: new FormControl(),
    visa: new FormControl(),
  });
  // constructor
  constructor(
    private toastr: ToastrServiceService,
    private fileValid: FileValidationService,
    private appConfig: AppConfig,
    private domSanitizer: DomSanitizer,
    private socialReferanceService: SocialreferenceService,
    private kanbanService: KanbanService,
    private emitService: EmittService,
    private dashboardService: DashboardService,
    private inquiryServices: UserInquiryService,
    private applicationService: ApplicationService,
    private router: Router,
    private renderer: Renderer2,
    private userInquiryService: UserInquiryService,
    private formBuilder: FormBuilder,
    private sessionUser: SessionStorageService,
    private modalService: NgbModal,
    private courseService: CoursesService,
    private alerts: AlertServiceService,
    private campusService: CampusService,
    private accountService: AccountService,
    private SocialPreferece: SocialreferenceService
  ) {
    $("#loader").show();
    emitService.onChangeAddApplicationbtnHideShow(false);
    emitService.GetCampusIntakeChange().subscribe((res) => {
      this.headerCampusId = res.campusId;
      this.headerIntakeId = res.intakeId;
      this.reloadDatatables();
    });

    this.form = formBuilder.group({
      inquiryId: ["0"],
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      dob: ["", [Validators.required]],
      contactNo: [
        "",
        [Validators.required, Validators.pattern("[0-9]{10,12}")],
      ],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}"),
        ],
      ],
      campusId: ["", [Validators.required]],
      countryId: ["", Validators.required],
      sourceId: ["", Validators.required],
      inquiryStatus: ["", [Validators.required]],
      assignedToId: [""],
      message: [""],
      references: [""],
    });

    this.CASform = formBuilder.group({
      ApplicationId: [""],
      cas: ["", Validators.required],
    });
    this.Visaform = formBuilder.group({
      ApplicationId: [""],
      visa: ["", Validators.required],
    });

    $("#loader").hide();
  }
  archiveStatuses = [];

  ngOnInit(): void {
    this.headerCampusId =
      this.headerCampusId == 0 || this.headerCampusId == null
        ? parseInt(this.sessionUser.getCampusId())
        : this.headerCampusId;
    this.headerIntakeId =
      this.headerIntakeId == 0 || this.headerIntakeId == null
        ? parseInt(this.sessionUser.getIntakeId())
        : this.headerIntakeId;
    this.loadForm();
    this.Register();
    this.cas();
    this.OfferAccept();
    this.UnConditionOffer();
    this.conditionOffer();
    this.OnholdApplications();
    this.NewApplications();
    this.SeenApplications();
    this.WithdrawnApplications();
    this.loadAndRMSStatus();
    this.RejectedApplications();
    this.TableListView();
    this.inquiryDatabind();
    this.changeAsigntoData();
    this.loadButtons();
    this.ReceivedApplications();
    this.userType = parseInt(this.sessionUser.getUserType());
    this.inquiryAssignedById = 0;
    var defaultTab = this.sessionUser.getDashboardTab();
    if (defaultTab != null) {
      this.ListView(defaultTab != "0", defaultTab);
      var input = parseInt(defaultTab);
      input--;
      this.selectedindex = input.toString();
    }
    this.filters = this.filterForm.getRawValue();
  }
  get casdata() {
    return this.CASform.controls;
  }
  get visa() {
    return this.Visaform.controls;
  }
  loadButtons() {
    this.Buttons.push({
      id: 6,
      name: "Created By",
      isChecked: false,
    });
    this.Buttons.push({
      id: 7,
      name: "Updated On",
      isChecked: false,
    });
    this.Buttons.push({
      id: 8,
      name: "Updated By",
      isChecked: false,
    });
    this.Buttons.push({
      id: 9,
      name: "Reference",
      isChecked: false,
    });
    this.Buttons.push({
      id: 10,
      name: "Description",
      isChecked: false,
    });
  }
  loadAndRMSStatus() {
    $("#loader").show();
    this.kanbanService.getStagesByPerent({ id: 0 }).subscribe(
      (result) => {
        if (result.status) {
          this.archiveStatuses = result.data.subStages.filter(
            (m) =>
              m.stageName.toLowerCase() != "received" &&
              m.stageName.toLowerCase() != "accepted"
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
  reloadDatatables() {
    $("#application").DataTable().ajax.reload();
    $("#application1").DataTable().ajax.reload();
    $("#application2").DataTable().ajax.reload();
    $("#application3").DataTable().ajax.reload();
    $("#application9").DataTable().ajax.reload();
    $("#application10").DataTable().ajax.reload();
    $("#application11").DataTable().ajax.reload();
    $("#application8").DataTable().ajax.reload();
    $("#application7").DataTable().ajax.reload();
    $("#application4").DataTable().ajax.reload();
    $("#application5").DataTable().ajax.reload();
    $("#application6").DataTable().ajax.reload();
  }
  loadForm() {
    // $('#loader').show();
    let paginationModal = {
      index: 0,
      size: 0,
    };
    let campusData = this.campusService.getAllCampaus(paginationModal);
    let enquiryStatusData =
      this.userInquiryService.getAllEnquiryStatus(paginationModal);
    let countryData = this.accountService.getCountries();
    let AssignedUser = this.applicationService.GetManageUser();
    let socialPreferenceData =
      this.socialReferanceService.getAllSocialRef(paginationModal);

    let inquirySouces = this.socialReferanceService.getSources();

    let coursesData = this.courseService.getAllCourses(paginationModal);

    forkJoin([
      campusData,
      enquiryStatusData,
      countryData,
      AssignedUser,
      socialPreferenceData,
      inquirySouces,
      coursesData,
    ]).subscribe(
      (result) => {
        if (result[0]) {
          if (result[0].status) {
            this.campuses = result[0].data.records;
          } else {
            this.toastr.ErrorToastr(result[0].message);
          }
        }
        if (result[1]) {
          if (result[1].status) {
            this.enquirystus = result[1].data.records;
          } else {
            this.toastr.ErrorToastr(result[1].message);
          }
        }

        if (result[2]) {
          if (result[2].status) {
            this.countries = result[2].data;
          } else {
            this.toastr.ErrorToastr(result[2].message);
          }
        }
        if (result[3]) {
          if (result[3].status) {
            this.AssigedUserGroupDetail = result[3].data;
            this.assignedTo = result[3].data.filter(
              (m) => m.userTypeId == 1 || m.userTypeId == 2
            );
            this.agents = result[3].data.filter((m) => m.userTypeId == 4);
            this.RMs = result[3].data.filter((m) => m.userTypeId == 3);
          } else {
            this.toastr.ErrorToastr(result[3].message);
          }
        }
        if (result[4]) {
          if (result[4].status) {
            this.ufpSources = result[4].data.records;
          } else {
            this.toastr.ErrorToastr(result[4].message);
          }
        }
        if (result[5]) {
          if (result[5].status) {
            this.inquirySources = result[5].data;
          } else {
            this.toastr.ErrorToastr(result[5].message);
          }
        }
        if (result[6]) {
          if (result[6].status) {
            this.courses = result[6].data.records;
          } else {
            this.toastr.ErrorToastr(result[5].message);
          }
        }
        $("#loader").hide();
      },
      (err: any) => {
        // $('#loader').hide();
        if (err.status == 401) {
          this.router.navigate(["/"]);
        } else {
          this.toastr.ErrorToastr("Something went wrong");
          $("#loader").hide();
        }
      }
    );
  }
  getApplication(id: any) {
    $("#loader").show();
    let input = {
      id: id,
      page: "dashboard",
      action: "view",
    };
    $("#loader").hide();
    this.emitService.onchangeApplicationId(input);
    this.emitService.changeApplicationParentstatus(1);
  }
  clickView(e) {
    this.getApplication(e.target.value);
  }
  OfferAccept() {
    let input = {
      pageSize: 10,
      startFrom: 0,
      searchText: "",
      campusId: this.headerCampusId,
      intakeId: this.headerIntakeId,
      OrderByDirection: "",
      OrderBy: "",
      StatusId: 11,
    };

    this.dtOptions11 = {
      pagingType: "simple_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      responsive: true,
      scrollX: true,
      retrieve: true,
      searching: true,
      order: [4, "desc"],
      language: {
        infoFiltered: "",
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.Listdata = [];
        input.pageSize = dataTablesParameters.length;
        input.startFrom = dataTablesParameters.start;
        input.searchText = dataTablesParameters.search.value;
        input.OrderByDirection = dataTablesParameters.order[0].dir;
        input.OrderBy =
          dataTablesParameters.columns[
            dataTablesParameters.order[0].column
          ].name;
        input.campusId = this.headerCampusId;
        input.intakeId = this.headerIntakeId;
        this.dashboardService.getListView(input).subscribe((res) => {
          this.Listdata = res.data.records;
          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: res.data.records,
          });
          this.DepositPaidCount = res.data.totalCounts;
        });
        $("#loader").hide();
      },
      columns: [
        {
          name: "applicationName",
          data: "applicationName",
          orderable: true,
          searchable: true,
        },

        {
          name: "courseName",
          data: "courseName",
          orderable: true,
          searchable: true,
        },
        {
          name: "intake",
          data: "intake",
          orderable: false,
          searchable: true,
          render: function (data, type, row) {
            if (data) {
              return data + " - " + moment(row["intakeDate"]).format("YYYY");
            } else return "";
          },
        },
        {
          name: "stageName",
          data: "stageName",
          orderable: true,
          searchable: true,
        },

        {
          name: "appliedDate",
          data: "appliedDate",
          orderable: true,
          searchable: true,
          render: function (data, type, row) {
            return moment(data + "Z").format("DD/MM/YY hh:mm A");
          },
        },
        {
          name: "manageBy",
          data: "manageBy",
          orderable: true,
          searchable: true,
        },
        { name: "rm", data: "rm", orderable: true, searchable: true },
        { name: "agent", data: "agent", orderable: true, searchable: true },
        {
          name: "country",
          data: "country",
          orderable: true,
          searchable: true,
        },
        {
          name: "",
          data: "applicationId",
          orderable: false,
          searchable: false,
          render: function (data, type, row) {
            return (
              '<button class="btn-shadow btn btn-warning pointer" onClick="document.getElementById(\'hdnClickView\').value=' +
              data +
              "; document.getElementById('hdnClickView').click()\">View</button>"
            );
          },
        },
      ],
      autoWidth: false,
    };
    $("#loader").hide();
  }
  UnConditionOffer() {
    let input = {
      pageSize: 10,
      startFrom: 0,
      campusId: this.headerCampusId,
      intakeId: this.headerIntakeId,
      searchText: "",
      OrderByDirection: "",
      OrderBy: "",
      StatusId: 10,
      OfferType: 2,
    };

    this.dtOptions10 = {
      pagingType: "simple_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      responsive: true,
      scrollX: true,
      retrieve: true,
      searching: true,
      order: [5, "desc"],
      language: {
        infoFiltered: "",
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.Listdata = [];
        input.pageSize = dataTablesParameters.length;
        input.startFrom = dataTablesParameters.start;
        input.searchText = dataTablesParameters.search.value;
        input.OrderByDirection = dataTablesParameters.order[0].dir;
        input.OrderBy =
          dataTablesParameters.columns[
            dataTablesParameters.order[0].column
          ].name;
        input.campusId = this.headerCampusId;
        input.intakeId = this.headerIntakeId;

        this.dashboardService.getListView1(input).subscribe((res) => {
          this.Listdata = res.data.records;
          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: res.data.records,
          });
          this.UnConditionalOfferCount = res.data.totalCounts;
        });
        $("#loader").hide();
      },
      columns: [
        {
          name: "applicationName",
          data: "applicationName",
          orderable: true,
          searchable: true,
        },

        {
          name: "courseName",
          data: "courseName",
          orderable: true,
          searchable: true,
        },
        {
          name: "intake",
          data: "intake",
          orderable: false,
          searchable: true,
          render: function (data, type, row) {
            if (data) {
              return data + " - " + moment(row["intakeDate"]).format("YYYY");
            } else return "";
          },
        },
        {
          name: "stageName",
          data: "stageName",
          orderable: true,
          searchable: true,
        },

        {
          name: "appliedDate",
          data: "appliedDate",
          orderable: true,
          searchable: true,
          render: function (data, type, row) {
            return moment(data + "Z").format("DD/MM/YY hh:mm A");
          },
        },
        {
          name: "manageBy",
          data: "manageBy",
          orderable: true,
          searchable: true,
        },
        { name: "rm", data: "rm", orderable: true, searchable: true },
        {
          name: "agent",
          data: "agent",
          orderable: true,
          searchable: true,
        },
        {
          name: "country",
          data: "country",
          orderable: true,
          searchable: true,
        },

        //{ name: '', data: '', orderable: false, searchable: false, },
        {
          name: "",
          data: "applicationId",
          orderable: false,
          searchable: false,
          render: function (data, type, row) {
            return (
              '<button class="btn-shadow btn btn-warning pointer" onClick="document.getElementById(\'hdnClickView\').value=' +
              data +
              "; document.getElementById('hdnClickView').click()\">View</button>"
            );
          },
        },
      ],
      autoWidth: false,
    };
    $("#loader").hide();
  }
  conditionOffer() {
    let input = {
      pageSize: 10,
      startFrom: 0,
      campusId: this.headerCampusId,
      intakeId: this.headerIntakeId,
      searchText: "",
      OrderByDirection: "",
      OrderBy: "",
      StatusId: 10,
      OfferType: 1,
    };

    this.dtOptions9 = {
      pagingType: "simple_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      responsive: true,
      scrollX: true,
      retrieve: true,
      searching: true,
      order: [5, "desc"],
      language: {
        infoFiltered: "",
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.Listdata = [];
        input.pageSize = dataTablesParameters.length;
        input.startFrom = dataTablesParameters.start;
        input.searchText = dataTablesParameters.search.value;
        input.OrderByDirection = dataTablesParameters.order[0].dir;
        input.OrderBy =
          dataTablesParameters.columns[
            dataTablesParameters.order[0].column
          ].name;
        input.campusId = this.headerCampusId;
        input.intakeId = this.headerIntakeId;

        this.dashboardService.getListView1(input).subscribe((res) => {
          this.Listdata = res.data.records;
          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: res.data.records,
          });
          this.ConditionalOfferCount = res.data.totalCounts;
        });
        $("#loader").hide();
      },
      columns: [
        {
          name: "applicationName",
          data: "applicationName",
          orderable: true,
          searchable: true,
        },

        {
          name: "courseName",
          data: "courseName",
          orderable: true,
          searchable: true,
        },
        {
          name: "intake",
          data: "intake",
          orderable: false,
          searchable: true,
          render: function (data, type, row) {
            if (data) {
              return data + " - " + moment(row["intakeDate"]).format("YYYY");
            } else return "";
          },
        },
        {
          name: "stageName",
          data: "stageName",
          orderable: true,
          searchable: true,
        },

        {
          name: "appliedDate",
          data: "appliedDate",
          orderable: true,
          searchable: true,
          render: function (data, type, row) {
            return moment(data + "Z").format("DD/MM/YY hh:mm A");
          },
        },
        {
          name: "manageBy",
          data: "manageBy",
          orderable: true,
          searchable: true,
        },
        { name: "rm", data: "rm", orderable: true, searchable: true },
        {
          name: "agent",
          data: "agent",
          orderable: true,
          searchable: true,
        },
        {
          name: "country",
          data: "country",
          orderable: true,
          searchable: true,
        },

        //{ name: '', data: '', orderable: false, searchable: false, },
        {
          name: "",
          data: "applicationId",
          orderable: false,
          searchable: false,
          render: function (data, type, row) {
            return (
              '<button class="btn-shadow btn btn-warning pointer" onClick="document.getElementById(\'hdnClickView\').value=' +
              data +
              "; document.getElementById('hdnClickView').click()\">View</button>"
            );
          },
        },
      ],
      autoWidth: false,
    };
    $("#loader").hide();
  }
  ApplicationId: any;
  // test()
  // {
  //   this.CASform.get["ApplicationId"].setValue(this.ApplicationId)
  //   }

  cas() {
    let input = {
      pageSize: 10,
      startFrom: 0,
      campusId: this.headerCampusId,
      intakeId: this.headerIntakeId,
      searchText: "",
      OrderByDirection: "",
      OrderBy: "",
    };

    this.dtOptions8 = {
      pagingType: "simple_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      responsive: true,
      scrollX: true,
      retrieve: true,
      searching: true,
      order: [5, "desc"],
      language: {
        infoFiltered: "",
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.Listdata = [];
        input.pageSize = dataTablesParameters.length;
        input.startFrom = dataTablesParameters.start;
        input.searchText = dataTablesParameters.search.value;
        input.OrderByDirection = dataTablesParameters.order[0].dir;
        input.OrderBy =
          dataTablesParameters.columns[
            dataTablesParameters.order[0].column
          ].name;
        input.campusId = this.headerCampusId;
        input.intakeId = this.headerIntakeId;
        this.dashboardService.getListView2(input).subscribe((res) => {
          this.Listdata = res.data.records;

          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: res.data.records,
          });
          this.CasCount = res.data.totalCounts;
        });

        $("#loader").hide();
      },
      columns: [
        {
          name: "applicationName",
          data: "applicationName",
          orderable: true,
          searchable: true,
        },

        {
          name: "courseName",
          data: "courseName",
          orderable: true,
          searchable: true,
        },
        {
          name: "intake",
          data: "intake",
          orderable: false,
          searchable: true,
          render: function (data, type, row) {
            if (data) {
              return data + " - " + moment(row["intakeDate"]).format("YYYY");
            } else return "";
          },
        },
        {
          name: "casStatus",
          data: "casStatus",
          orderable: true,
          searchable: true,
          render: function (data, type, row) {
            if (data == 1) {
              return (
                '<button style="font-size:14px" class="btn btn-danger rounded-pill pointer"  onClick="document.getElementById(\'ChangeCAS\').value=' +
                row.applicationId +
                "; document.getElementById('ChangeCAS').click()\">Expired</button>"
              );
            } else if (data == 2) {
              return (
                '<button style="font-size:14px" class="btn btn-success rounded-pill pointer" onClick="document.getElementById(\'ChangeCAS\').value=' +
                row.applicationId +
                "; document.getElementById('ChangeCAS').click()\";>Issued</button>"
              );
            } else if (data == 3) {
              return (
                '<button style="font-size:14px" class="btn btn-success rounded-pill pointer" onClick="document.getElementById(\'ChangeCAS\').value=' +
                row.applicationId +
                "; document.getElementById('ChangeCAS').click()\";test()>Re-Issued</button>"
              );
            } else if (data == 4) {
              return (
                '<button style="font-size:14px" class="btn btn-danger rounded-pill pointer" onClick="document.getElementById(\'ChangeCAS\').value=' +
                row.applicationId +
                "; document.getElementById('ChangeCAS').click()\">Withdraw</button>"
              );
            } else if (data == 5) {
              return (
                '<button style="font-size:14px" class="btn btn-danger rounded-pill pointer" onClick="document.getElementById(\'ChangeCAS\').value=' +
                row.applicationId +
                "; document.getElementById('ChangeCAS').click()\">Reported</button>"
              );
            } else if (data == 6) {
              return (
                '<button style="font-size:14px" class="btn btn-danger rounded-pill pointer" onClick="document.getElementById(\'ChangeCAS\').value=' +
                row.applicationId +
                "; document.getElementById('ChangeCAS').click()\">Visa Refuse</button>"
              );
            } else if (data == 7) {
              return (
                '<button style="font-size:14px" class="btn btn-success rounded-pill pointer" onClick="document.getElementById(\'ChangeCAS\').value=' +
                row.applicationId +
                "; document.getElementById('ChangeCAS').click()\">Visa Granted</button>"
              );
            } else if (data == 8) {
              return (
                '<button style="font-size:14px" class="btn btn-warning rounded-pill pointer" onClick="document.getElementById(\'ChangeCAS\').value=' +
                row.applicationId +
                "; document.getElementById('ChangeCAS').click()\">AssignTo</button>"
              );
            } else if (data == 9) {
              return (
                '<button style="font-size:14px" class="btn btn-warning rounded-pill pointer" onClick="document.getElementById(\'ChangeCAS\').value=' +
                row.applicationId +
                "; document.getElementById('ChangeCAS').click()\">Used</button>"
              );
            } else {
              return "";
            }
          },
        },

        {
          name: "visaStatus",
          data: "visaStatus",
          orderable: true,
          searchable: true,
          render: function (data, type, row) {
            if (data == 1) {
              return '<button class="btn btn-warning rounded-pill pointer" style="font-size:14px">Inpreparation</button>';

              //    return "Inpreparation"
            } else if (data == 2) {
              return '<button class="btn btn-warning rounded-pill pointer" style="font-size:14px">Awaiting</button>';

              // return "Awaiting"
            } else if (data == 3) {
              return '<button class="btn btn-success rounded-pill pointer" style="font-size:14px">Granted</button>';

              //   return "Granted"
            } else if (data == 4) {
              return '<button class="btn btn-success rounded-pill pointer" style="font-size:14px">Refused</button>';

              //    return "Refused"
            } else if (data == 5) {
              return '<button class="btn btn-success rounded-pill pointer" style="font-size:14px">Reapplied</button>';

              //return "Reapplied"
            } else if (data == 6) {
              // return "Archive"
              return '<button class="btn btn-danger rounded-pill pointer" style="font-size:14px">Archive</button>';
            } else if (data == 7) {
              return (
                '<button style="font-size:14px" class="btn btn-danger rounded-pill pointer" onClick="document.getElementById(\'ChangeVisa\').value=' +
                row.applicationId +
                "; document.getElementById('ChangeVisa').click()\">Rejected</button>"
              );
            } else if (data == 8) {
              return (
                '<button style="font-size:14px" class="btn btn-danger rounded-pill pointer" onClick="document.getElementById(\'ChangeVisa\').value=' +
                row.applicationId +
                "; document.getElementById('ChangeVisa').click()\">Withdrawn</button>"
              );
            } else if (data == 9) {
              return (
                '<button style="font-size:14px" class="btn btn-primary rounded-pill pointer" onClick="document.getElementById(\'ChangeVisa\').value=' +
                row.applicationId +
                "; document.getElementById('ChangeVisa').click()\">OnHold</button>"
              );
            } else return "";
          },
        },

        {
          name: "appliedDate",
          data: "appliedDate",
          orderable: true,
          searchable: true,
          render: function (data, type, row) {
            return moment(data + "Z").format("DD/MM/YY hh:mm A");
          },
        },
        {
          name: "manageBy",
          data: "manageBy",
          orderable: true,
          searchable: true,
        },
        { name: "rm", data: "rm", orderable: true, searchable: true },
        {
          name: "agent",
          data: "agent",
          orderable: true,
          searchable: true,
        },
        {
          name: "country",
          data: "country",
          orderable: true,
          searchable: true,
        },

        //{ name: '', data: '', orderable: false, searchable: false, },
        {
          name: "",
          data: "applicationId",
          orderable: false,
          searchable: false,
          render: function (data, type, row) {
            return (
              '<button class="btn-shadow btn btn-warning pointer" onClick="document.getElementById(\'hdnClickView\').value=' +
              data +
              "; document.getElementById('hdnClickView').click()\">View</button>"
            );
          },
        },
      ],
      autoWidth: false,
    };
    $("#loader").hide();
  }
  Register() {
    let input = {
      pageSize: 10,
      startFrom: 0,
      campusId: this.headerCampusId,
      intakeId: this.headerIntakeId,
      searchText: "",
      OrderByDirection: "",
      OrderBy: "",
      StatusId: 8,
    };

    this.dtOptions7 = {
      pagingType: "simple_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      responsive: true,
      scrollX: true,
      retrieve: true,
      searching: true,
      order: [5, "desc"],
      language: {
        infoFiltered: "",
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.Listdata = [];
        input.pageSize = dataTablesParameters.length;
        input.startFrom = dataTablesParameters.start;
        input.searchText = dataTablesParameters.search.value;
        input.OrderByDirection = dataTablesParameters.order[0].dir;
        input.OrderBy =
          dataTablesParameters.columns[
            dataTablesParameters.order[0].column
          ].name;
        input.campusId = this.headerCampusId;
        input.intakeId = this.headerIntakeId;
        this.dashboardService.getListView(input).subscribe((res) => {
          this.Listdata = res.data.records;
          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: res.data.records,
          });
          this.RegisterCount = res.data.totalCounts;
        });
        $("#loader").hide();
      },
      columns: [
        {
          name: "applicationName",
          data: "applicationName",
          orderable: true,
          searchable: true,
        },

        {
          name: "courseName",
          data: "courseName",
          orderable: true,
          searchable: true,
        },
        {
          name: "intake",
          data: "intake",
          orderable: false,
          searchable: true,
          render: function (data, type, row) {
            if (data) {
              return data + " - " + moment(row["intakeDate"]).format("YYYY");
            } else return "";
          },
        },
        {
          name: "stageName",
          data: "stageName",
          orderable: true,
          searchable: true,
        },

        {
          name: "appliedDate",
          data: "appliedDate",
          orderable: true,
          searchable: true,
          render: function (data, type, row) {
            return moment(data + "Z").format("DD/MM/YY hh:mm A");
          },
        },
        {
          name: "manageBy",
          data: "manageBy",
          orderable: true,
          searchable: true,
        },
        { name: "rm", data: "rm", orderable: true, searchable: true },
        {
          name: "agent",
          data: "agent",
          orderable: true,
          searchable: true,
        },
        {
          name: "country",
          data: "country",
          orderable: true,
          searchable: true,
        },

        //{ name: '', data: '', orderable: false, searchable: false, },
        {
          name: "",
          data: "applicationId",
          orderable: false,
          searchable: false,
          render: function (data, type, row) {
            return (
              '<button class="btn-shadow btn btn-warning pointer" onClick="document.getElementById(\'hdnClickView\').value=' +
              data +
              "; document.getElementById('hdnClickView').click()\">View</button>"
            );
          },
        },
      ],
      autoWidth: false,
    };
    $("#loader").hide();
  }
  OnholdApplications() {
    let input = {
      pageSize: 10,
      startFrom: 0,
      campusId: this.headerCampusId,
      intakeId: this.headerIntakeId,
      searchText: "",
      OrderByDirection: "",
      OrderBy: "",
      StatusId: 7,
    };

    this.dtOptions6 = {
      pagingType: "simple_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      responsive: true,
      scrollX: true,
      retrieve: true,
      searching: true,
      order: [5, "desc"],
      language: {
        infoFiltered: "",
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.Listdata = [];
        input.pageSize = dataTablesParameters.length;
        input.startFrom = dataTablesParameters.start;
        input.searchText = dataTablesParameters.search.value;
        input.OrderByDirection = dataTablesParameters.order[0].dir;
        input.OrderBy =
          dataTablesParameters.columns[
            dataTablesParameters.order[0].column
          ].name;
        input.campusId = this.headerCampusId;
        input.intakeId = this.headerIntakeId;
        this.dashboardService.getListView(input).subscribe((res) => {
          this.Listdata = res.data.records;
          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: res.data.records,
          });
          this.OnHoldCount = res.data.totalCounts;
        });
        $("#loader").hide();
      },
      columns: [
        {
          name: "applicationName",
          data: "applicationName",
          orderable: true,
          searchable: true,
        },

        {
          name: "courseName",
          data: "courseName",
          orderable: true,
          searchable: true,
        },
        {
          name: "intake",
          data: "intake",
          orderable: false,
          searchable: true,
          render: function (data, type, row) {
            if (data) {
              return data + " - " + moment(row["intakeDate"]).format("YYYY");
            } else return "";
          },
        },
        {
          name: "stageName",
          data: "stageName",
          orderable: true,
          searchable: true,
        },

        {
          name: "appliedDate",
          data: "appliedDate",
          orderable: true,
          searchable: true,
          render: function (data, type, row) {
            return moment(data + "Z").format("DD/MM/YY hh:mm A");
          },
        },
        {
          name: "manageBy",
          data: "manageBy",
          orderable: true,
          searchable: true,
        },
        { name: "rm", data: "rm", orderable: true, searchable: true },
        {
          name: "agent",
          data: "agent",
          orderable: true,
          searchable: true,
        },
        {
          name: "country",
          data: "country",
          orderable: true,
          searchable: true,
        },

        //{ name: '', data: '', orderable: false, searchable: false, },
        {
          name: "",
          data: "applicationId",
          orderable: false,
          searchable: false,
          render: function (data, type, row) {
            return (
              '<button class="btn-shadow btn btn-warning pointer" onClick="document.getElementById(\'hdnClickView\').value=' +
              data +
              "; document.getElementById('hdnClickView').click()\">View</button>"
            );
          },
        },
      ],
      autoWidth: false,
    };
    $("#loader").hide();
  }
  WithdrawnApplications() {
    let input = {
      pageSize: 10,
      startFrom: 0,
      campusId: this.headerCampusId,
      intakeId: this.headerIntakeId,
      searchText: "",
      OrderByDirection: "",
      OrderBy: "",
      StatusId: 6,
    };

    this.dtOptions5 = {
      pagingType: "simple_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      responsive: true,
      scrollX: true,
      retrieve: true,
      searching: true,
      order: [5, "desc"],
      language: {
        infoFiltered: "",
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.Listdata = [];
        input.pageSize = dataTablesParameters.length;
        input.startFrom = dataTablesParameters.start;
        input.searchText = dataTablesParameters.search.value;
        input.OrderByDirection = dataTablesParameters.order[0].dir;
        input.OrderBy =
          dataTablesParameters.columns[
            dataTablesParameters.order[0].column
          ].name;
        input.campusId = this.headerCampusId;
        input.intakeId = this.headerIntakeId;
        this.dashboardService.getListView(input).subscribe((res) => {
          this.Listdata = res.data.records;
          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: res.data.records,
          });
          this.WithdrawnCount = res.data.totalCounts;
        });
        $("#loader").hide();
      },
      columns: [
        {
          name: "applicationName",
          data: "applicationName",
          orderable: true,
          searchable: true,
        },

        {
          name: "courseName",
          data: "courseName",
          orderable: true,
          searchable: true,
        },
        {
          name: "intake",
          data: "intake",
          orderable: false,
          searchable: true,
          render: function (data, type, row) {
            if (data) {
              return data + " - " + moment(row["intakeDate"]).format("YYYY");
            } else return "";
          },
        },
        {
          name: "stageName",
          data: "stageName",
          orderable: true,
          searchable: true,
        },

        {
          name: "appliedDate",
          data: "appliedDate",
          orderable: true,
          searchable: true,
          render: function (data, type, row) {
            return moment(data + "Z").format("DD/MM/YY hh:mm A");
          },
        },
        {
          name: "manageBy",
          data: "manageBy",
          orderable: true,
          searchable: true,
        },
        { name: "rm", data: "rm", orderable: true, searchable: true },
        {
          name: "agent",
          data: "agent",
          orderable: true,
          searchable: true,
        },
        {
          name: "country",
          data: "country",
          orderable: true,
          searchable: true,
        },

        //{ name: '', data: '', orderable: false, searchable: false, },
        {
          name: "",
          data: "applicationId",
          orderable: false,
          searchable: false,
          render: function (data, type, row) {
            return (
              '<button class="btn-shadow btn btn-warning pointer" onClick="document.getElementById(\'hdnClickView\').value=' +
              data +
              "; document.getElementById('hdnClickView').click()\">View</button>"
            );
          },
        },
      ],
      autoWidth: false,
    };
    $("#loader").hide();
  }
  RejectedApplications() {
    let input = {
      pageSize: 10,
      startFrom: 0,
      campusId: this.headerCampusId,
      intakeId: this.headerIntakeId,
      searchText: "",
      OrderByDirection: "",
      OrderBy: "",
      StatusId: 5,
    };

    this.dtOptions4 = {
      pagingType: "simple_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      responsive: true,
      scrollX: true,
      retrieve: true,
      searching: true,
      order: [5, "desc"],
      language: {
        infoFiltered: "",
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.Listdata = [];
        input.pageSize = dataTablesParameters.length;
        input.startFrom = dataTablesParameters.start;
        input.searchText = dataTablesParameters.search.value;
        input.OrderByDirection = dataTablesParameters.order[0].dir;
        input.OrderBy =
          dataTablesParameters.columns[
            dataTablesParameters.order[0].column
          ].name;
        input.campusId = this.headerCampusId;
        input.intakeId = this.headerIntakeId;
        this.dashboardService.getListView(input).subscribe((res) => {
          this.Listdata = res.data.records;
          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: res.data.records,
          });
          this.RejectedCount = res.data.totalCounts;
        });
        $("#loader").hide();
      },
      columns: [
        {
          name: "applicationName",
          data: "applicationName",
          orderable: true,
          searchable: true,
        },

        {
          name: "courseName",
          data: "courseName",
          orderable: true,
          searchable: true,
        },
        {
          name: "intake",
          data: "intake",
          orderable: false,
          searchable: true,
          render: function (data, type, row) {
            if (data) {
              return data + " - " + moment(row["intakeDate"]).format("YYYY");
            } else return "";
          },
        },
        {
          name: "stageName",
          data: "stageName",
          orderable: true,
          searchable: true,
        },

        {
          name: "appliedDate",
          data: "appliedDate",
          orderable: true,
          searchable: true,
          render: function (data, type, row) {
            return moment(data + "Z").format("DD/MM/YY hh:mm A");
          },
        },
        {
          name: "manageBy",
          data: "manageBy",
          orderable: true,
          searchable: true,
        },
        { name: "rm", data: "rm", orderable: true, searchable: true },
        {
          name: "agent",
          data: "agent",
          orderable: true,
          searchable: true,
        },
        {
          name: "country",
          data: "country",
          orderable: true,
          searchable: true,
        },

        //{ name: '', data: '', orderable: false, searchable: false, },
        {
          name: "",
          data: "applicationId",
          orderable: false,
          searchable: false,
          render: function (data, type, row) {
            return (
              '<button class="btn-shadow btn btn-warning pointer" onClick="document.getElementById(\'hdnClickView\').value=' +
              data +
              "; document.getElementById('hdnClickView').click()\">View</button>"
            );
          },
        },
      ],
      autoWidth: false,
    };
    $("#loader").hide();
  }
  ReceivedApplications() {
    let input = {
      pageSize: 10,
      startFrom: 0,
      campusId: this.headerCampusId,
      intakeId: this.headerIntakeId,
      searchText: "",
      OrderByDirection: "",
      OrderBy: "",
      StatusId: 4,
    };

    this.dtOptions3 = {
      pagingType: "simple_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      responsive: true,
      scrollX: true,
      retrieve: true,
      searching: true,
      order: [5, "desc"],
      language: {
        infoFiltered: "",
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.Listdata = [];
        input.pageSize = dataTablesParameters.length;
        input.startFrom = dataTablesParameters.start;
        input.searchText = dataTablesParameters.search.value;
        input.OrderByDirection = dataTablesParameters.order[0].dir;
        input.OrderBy =
          dataTablesParameters.columns[
            dataTablesParameters.order[0].column
          ].name;
        input.campusId = this.headerCampusId;
        input.intakeId = this.headerIntakeId;
        this.dashboardService.getListView(input).subscribe((res) => {
          this.Listdata = res.data.records;
          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: res.data.records,
          });
          this.ReceivedCount = res.data.totalCounts;
        });
        $("#loader").hide();
      },
      columns: [
        {
          name: "applicationName",
          data: "applicationName",
          orderable: true,
          searchable: true,
        },

        {
          name: "courseName",
          data: "courseName",
          orderable: true,
          searchable: true,
        },
        {
          name: "intake",
          data: "intake",
          orderable: false,
          searchable: true,
          render: function (data, type, row) {
            if (data) {
              return data + " - " + moment(row["intakeDate"]).format("YYYY");
            } else return "";
          },
        },
        {
          name: "stageName",
          data: "stageName",
          orderable: true,
          searchable: false,
          render: function (data, type, row) {
            if (data.toLowerCase() != "application received")
              return "Application Received";
            else return data;
          },
        },

        {
          name: "appliedDate",
          data: "appliedDate",
          orderable: true,
          searchable: true,
          render: function (data, type, row) {
            return moment(data + "Z").format("DD/MM/YY hh:mm A");
          },
        },
        {
          name: "manageBy",
          data: "manageBy",
          orderable: true,
          searchable: true,
        },
        { name: "rm", data: "rm", orderable: true, searchable: true },
        {
          name: "agent",
          data: "agent",
          orderable: true,
          searchable: true,
        },
        {
          name: "country",
          data: "country",
          orderable: true,
          searchable: true,
        },

        //{ name: '', data: '', orderable: false, searchable: false, },
        {
          name: "",
          data: "applicationId",
          orderable: false,
          searchable: false,
          render: function (data, type, row) {
            return (
              '<button class="btn-shadow btn btn-warning pointer" onClick="document.getElementById(\'hdnClickView\').value=' +
              data +
              "; document.getElementById('hdnClickView').click()\">View</button>"
            );
          },
        },
      ],
      autoWidth: false,
    };
    $("#loader").hide();
  }
  NewApplications() {
    let input = {
      pageSize: 10,
      startFrom: 0,
      campusId: this.headerCampusId,
      intakeId: this.headerIntakeId,
      searchText: "",
      OrderByDirection: "",
      OrderBy: "",
      StatusId: 2,
    };

    this.dtOptions1 = {
      pagingType: "simple_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      responsive: true,
      scrollX: true,
      retrieve: true,
      searching: true,
      order: [5, "desc"],
      language: {
        infoFiltered: "",
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.Listdata = [];
        input.pageSize = dataTablesParameters.length;
        input.startFrom = dataTablesParameters.start;
        input.searchText = dataTablesParameters.search.value;
        input.OrderByDirection = dataTablesParameters.order[0].dir;
        input.OrderBy =
          dataTablesParameters.columns[
            dataTablesParameters.order[0].column
          ].name;
        input.campusId = this.headerCampusId;
        input.intakeId = this.headerIntakeId;
        this.dashboardService.getListView(input).subscribe((res) => {
          this.Listdata = res.data.records;
          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: res.data.records,
          });
          this.NewCount = res.data.totalCounts;
        });
        $("#loader").hide();
      },
      columns: [
        {
          name: "applicationName",
          data: "applicationName",
          orderable: true,
          searchable: true,
        },

        {
          name: "courseName",
          data: "courseName",
          orderable: true,
          searchable: true,
        },
        {
          name: "intake",
          data: "intake",
          orderable: false,
          searchable: true,
          render: function (data, type, row) {
            if (data) {
              return data + " - " + moment(row["intakeDate"]).format("YYYY");
            } else return "";
          },
        },
        {
          name: "stageName",
          data: "stageName",
          orderable: true,
          searchable: true,
        },

        {
          name: "appliedDate",
          data: "appliedDate",
          orderable: true,
          searchable: true,
          render: function (data, type, row) {
            return moment(data + "Z").format("DD/MM/YY hh:mm A");
          },
        },
        {
          name: "manageBy",
          data: "manageBy",
          orderable: true,
          searchable: true,
        },
        { name: "rm", data: "rm", orderable: true, searchable: true },
        {
          name: "agent",
          data: "agent",
          orderable: true,
          searchable: true,
        },
        {
          name: "country",
          data: "country",
          orderable: true,
          searchable: true,
        },

        //{ name: '', data: '', orderable: false, searchable: false, },
        {
          name: "",
          data: "applicationId",
          orderable: false,
          searchable: false,
          render: function (data, type, row) {
            return (
              '<button class="btn-shadow btn btn-warning pointer" onClick="document.getElementById(\'hdnClickView\').value=' +
              data +
              "; document.getElementById('hdnClickView').click()\">View</button>"
            );
          },
        },
      ],
      autoWidth: false,
    };
    $("#loader").hide();
  }
  SeenApplications() {
    let input = {
      pageSize: 10,
      startFrom: 0,
      campusId: this.headerCampusId,
      intakeId: this.headerIntakeId,
      searchText: "",
      OrderByDirection: "",
      OrderBy: "",
      StatusId: 3,
    };

    this.dtOptions2 = {
      pagingType: "simple_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      responsive: true,
      scrollX: true,
      retrieve: true,
      searching: true,
      order: [5, "desc"],
      language: {
        infoFiltered: "",
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.Listdata = [];
        input.pageSize = dataTablesParameters.length;
        input.startFrom = dataTablesParameters.start;
        input.searchText = dataTablesParameters.search.value;
        input.OrderByDirection = dataTablesParameters.order[0].dir;
        input.OrderBy =
          dataTablesParameters.columns[
            dataTablesParameters.order[0].column
          ].name;
        input.campusId = this.headerCampusId;
        input.intakeId = this.headerIntakeId;
        this.dashboardService.getListView(input).subscribe((res) => {
          this.Listdata = res.data.records;
          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: res.data.records,
          });
          this.SeenCount = res.data.totalCounts;
        });
        $("#loader").hide();
      },
      columns: [
        {
          name: "applicationName",
          data: "applicationName",
          orderable: true,
          searchable: true,
        },

        {
          name: "courseName",
          data: "courseName",
          orderable: true,
          searchable: true,
        },
        {
          name: "intake",
          data: "intake",
          orderable: false,
          searchable: true,
          render: function (data, type, row) {
            if (data) {
              return data + " - " + moment(row["intakeDate"]).format("YYYY");
            } else return "";
          },
        },
        {
          name: "stageName",
          data: "stageName",
          orderable: true,
          searchable: true,
        },

        {
          name: "appliedDate",
          data: "appliedDate",
          orderable: true,
          searchable: true,
          render: function (data, type, row) {
            return moment(data + "Z").format("DD/MM/YY hh:mm A");
          },
        },
        {
          name: "manageBy",
          data: "manageBy",
          orderable: true,
          searchable: true,
        },
        { name: "rm", data: "rm", orderable: true, searchable: true },
        {
          name: "agent",
          data: "agent",
          orderable: true,
          searchable: true,
        },
        {
          name: "country",
          data: "country",
          orderable: true,
          searchable: true,
        },

        //{ name: '', data: '', orderable: false, searchable: false, },
        {
          name: "",
          data: "applicationId",
          orderable: false,
          searchable: false,
          render: function (data, type, row) {
            return (
              '<button class="btn-shadow btn btn-warning pointer" onClick="document.getElementById(\'hdnClickView\').value=' +
              data +
              "; document.getElementById('hdnClickView').click()\">View</button>"
            );
          },
        },
      ],
      autoWidth: false,
    };
    $("#loader").hide();
  }
  TableListView() {
    let input = {
      pageSize: 10,
      campusId: this.headerCampusId,
      intakeId: this.headerIntakeId,
      startFrom: 0,
      searchText: "",
      OrderByDirection: "",
      OrderBy: "",
      StatusId: 1,
    };

    this.dtOptions = {
      pagingType: "simple_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      responsive: true,
      scrollX: true,
      retrieve: true,
      searching: true,
      order: [5, "desc"],
      language: {
        infoFiltered: "",
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.Listdata = [];
        input.pageSize = dataTablesParameters.length;
        input.startFrom = dataTablesParameters.start;
        input.searchText = dataTablesParameters.search.value;
        input.OrderByDirection = dataTablesParameters.order[0].dir;
        input.OrderBy =
          dataTablesParameters.columns[
            dataTablesParameters.order[0].column
          ].name;
        input.campusId = this.headerCampusId;
        input.intakeId = this.headerIntakeId;
        this.dashboardService.getListView(input).subscribe((res) => {
          this.Listdata = res.data.records;
          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: res.data.records,
          });
          this.InProgressCount = res.data.totalCounts;
        });
        $("#loader").hide();
      },
      columns: [
        {
          name: "applicationName",
          data: "applicationName",
          orderable: true,
          searchable: true,
        },

        {
          name: "courseName",
          data: "courseName",
          orderable: true,
          searchable: true,
        },
        {
          name: "intake",
          data: "intake",
          orderable: false,
          searchable: true,
          render: function (data, type, row) {
            if (data) {
              return data + " - " + moment(row["intakeDate"]).format("YYYY");
            } else return "";
          },
        },
        {
          name: "stageName",
          data: "stageName",
          orderable: true,
          searchable: true,
        },

        {
          name: "appliedDate",
          data: "appliedDate",
          orderable: true,
          searchable: true,
          render: function (data, type, row) {
            return moment(data + "Z").format("DD/MM/YY hh:mm A");
          },
        },
        {
          name: "manageBy",
          data: "manageBy",
          orderable: true,
          searchable: true,
        },
        { name: "rm", data: "rm", orderable: true, searchable: true },
        { name: "agent", data: "agent", orderable: true, searchable: true },
        {
          name: "country",
          data: "country",
          orderable: true,
          searchable: true,
        },

        //{ name: '', data: '', orderable: false, searchable: false, },
        {
          name: "",
          data: "applicationId",
          orderable: false,
          searchable: false,
          render: function (data, type, row) {
            return (
              '<button class="btn-shadow btn btn-warning pointer" onClick="document.getElementById(\'hdnClickView\').value=' +
              data +
              "; document.getElementById('hdnClickView').click()\">View</button>"
            );
          },
        },
      ],
      autoWidth: false,
    };
    $("#loader").hide();
  }

  get f() {
    return this.form.controls;
  }

  ListView(islist: any, tabnumber: string = "1") {
    this.islistview = islist;
    if (islist) {
      this.sessionUser.setDashboardTab(tabnumber);
      $("#application").DataTable().ajax.reload();
    } else {
      this.sessionUser.setDashboardTab("0");
    }
  }
  totalRejected = "";

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
  isValidFile = true;
  emailFile: any;
  emailFileName: any;
  _handleReaderLoaded(e: any) {
    let reader = e.target;
    var base64result = reader.result.substr(reader.result.indexOf(",") + 1);
    this.emailFile = base64result;
  }
  convertFileToBase64(event: any) {
    const files = event.target.files;
    if (this.fileValid.checkEMLFileType(files)) {
      this.isValidFile = true;
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
      this.emailFileName = file.name;
    } else {
      this.isValidFile = false;
    }
  }

  groupByFn = (item) => item.userTypeName;
  selectedAccounts = [1];
  groupValueFn = (_: string, children: any[]) => ({
    name: children[0].userTypeName,
  });

  changeAsigntoData() {
    $("#loader").show();
    let managedata = this.inquiryServices.GetAssignedToUsers();
    forkJoin([managedata]).subscribe((result) => {
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
          this.toastr.ErrorToastr("Something went wrong");
        }
      }
      $("#loader").hide();
    });
    $("#loader").hide();
  }

  ChangeTab(e) {
    this.sessionUser.setDashboardTab(e.index + 1);
    if (e.index == 0) {
      $("#inquiry").DataTable().ajax.reload();
    } else if (e.index == 1) {
      $("#application").DataTable().ajax.reload();
    } else if (e.index == 2) {
      $("#application1").DataTable().ajax.reload();
    } else if (e.index == 3) {
      $("#application2").DataTable().ajax.reload();
    } else if (e.index == 4) {
      $("#application3").DataTable().ajax.reload();
    } else if (e.index == 5) {
      $("#application9").DataTable().ajax.reload();
    } else if (e.index == 6) $("#application10").DataTable().ajax.reload();
    else if (e.index == 7) {
      $("#application11").DataTable().ajax.reload();
    } else if (e.index == 8) {
      $("#application8").DataTable().ajax.reload();
    } else if (e.index == 9) {
      $("#application7").DataTable().ajax.reload();
    } else if (e.index == 10) {
      $("#application4").DataTable().ajax.reload();
    } else if (e.index == 11) {
      $("#application5").DataTable().ajax.reload();
    } else {
      $("#application6").DataTable().ajax.reload();
    }
  }

  inquiryDatabind() {
    $("#loader").show();
    let input = {
      campusId: this.headerCampusId,
      intakeId: this.headerIntakeId,
      Size: 10,
      Index: 1,
      Search: "",
      OrderByDirection: "",
      sortingColumn: 0,
      OrderBy: "",
    };

    this.dtInquiryOptions = {
      pagingType: "simple_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      responsive: true,
      scrollX: true,
      retrieve: true,
      searching: true,
      order: [5, "asc"],
      language: {
        infoFiltered: "",
      },
      ajax: (dataTablesParameters: any, callback) => {
        input.Size = dataTablesParameters.length;
        input.Index = dataTablesParameters.start;
        input.Search = dataTablesParameters.search.value;
        input.OrderByDirection = dataTablesParameters.order[0].dir;
        input.campusId = this.headerCampusId;
        input.intakeId = this.headerIntakeId;
        input.sortingColumn = dataTablesParameters.order[0].column;
        input.OrderBy = dataTablesParameters.columns[input.sortingColumn].name;
        this.userInquiryService.GetAllInquiry(input).subscribe((res) => {
          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: res.data.records,
          });
          this.InquiryCount = res.data.totalCounts;
        });
        $("#loader").hide();
      },
      columns: [
        {
          name: "lastName",
          data: "lastName",
          orderable: true,
          searchable: true,
        },
        {
          name: "firstname",
          data: "firstName",
          orderable: true,
          searchable: true,
        },
        { name: "email", data: "email", orderable: true, searchable: true },
        {
          name: "campusName",
          data: "campusName",
          orderable: true,
          searchable: true,
        },
        {
          name: "statusName",
          data: "statusName",
          orderable: true,
          searchable: true,
          render: function (data, type, row) {
            return (
              '<button class="btn rounded-pill ' +
              row.className +
              '" >' +
              data +
              " </button>"
            );
          },
        },
        {
          name: "createdDate",
          data: "createdDate",
          orderable: true,
          searchable: true,
          render: function (data, type, row) {
            return moment(data + "Z").format("DD/MM/YY hh:mm A");
          },
        },
        {
          name: "created",
          data: "created",
          orderable: true,
          searchable: true,
          visible: false,
        },
        {
          name: "updatedDate",
          data: "updatedDate",
          orderable: true,
          searchable: true,
          visible: false,
          render: function (data, type, row) {
            return moment(data + "Z").format("DD/MM/YY hh:mm A");
          },
        },
        {
          name: "updated",
          data: "updated",
          orderable: true,
          visible: false,
          searchable: true,
        },
        {
          name: "im.[References]",
          data: "references",
          orderable: false,
          visible: false,
          searchable: true,
        },
        {
          name: "message",
          data: "message",
          orderable: true,
          visible: false,
          searchable: true,
        },
        {
          name: "",
          data: "inquiryId",
          orderable: false,
          searchable: false,
          render: function (data, type, row) {
            var htmlButton =
              '<button class="btn-shadow btn btn-success fa fa-pencil  me-2 pointer" title="Edit" onClick="document.getElementById(\'hdnInquiryClickEdit\').value=' +
              data +
              '; document.getElementById(\'hdnInquiryClickEdit\').click()"></button><button class="btn-shadow btn btn-warning me-2 pointer fa fa-eye" title="View" onClick="document.getElementById(\'hdnInquiryClickView\').value=' +
              data +
              '; document.getElementById(\'hdnInquiryClickView\').click()"></button><button class="btn-shadow btn btn-danger pointer me-2 fa fa-trash" title="Delete" onClick="document.getElementById(\'hdnInquiryClickDelete\').value=' +
              data +
              "; document.getElementById('hdnInquiryClickDelete').click()\"></button>";
            if (row.statusName.toLowerCase() != "converted to application")
              htmlButton +=
                '<button class="btn-shadow btn btn-primary ms-2 pointer fa fa-exchange" title="Convert" onClick="document.getElementById(\'hdnInquiryClickConvert\').value=' +
                data +
                "; document.getElementById('hdnInquiryClickConvert').click()\" title='Convert to Application'></button>";
            return htmlButton;
          },
        },
      ],
      autoWidth: false,
    };
    $("#loader").hide();
  }
  clickInquiryEdit(e) {
    this.inquiryId = e.target.value;
    this.isEditInquiry = true;
  }
  clickInquiryView(e) {
    this.inquiryId = e.target.value;
    this.isEditInquiry = false;
  }
  SaveInquiry() {
    // this.isSubmitted = true;
    if (this.form.valid) {
      $("#loader").show();
      let formVal = JSON.stringify(this.form.getRawValue());
      let input = {
        ...JSON.parse(formVal),
        emailFile: this.emailFile,
        emailFileName: this.emailFileName,
      };
      input.sourceId = parseInt(input.sourceId.toString());
      input.campusId = parseInt(input.campusId.toString());
      input.assignedToId = parseInt(
        input.assignedToId == ("" || null) ? "0" : input.assignedToId.toString()
      );
      input.inquiryStatus = parseInt(input.inquiryStatus.toString());
      if (
        input.message == null ||
        input.message == "" ||
        input.message == undefined
      )
        input.message = "";
      this.userInquiryService.AddInquiryFn(input).subscribe(
        (res) => {
          if (res.status) {
            this.modalService.dismissAll();
            if (res.data.inquiryId == 0)
              this.toastr.SuccessToastr("Student inquiry added successfully.");
            else
              this.toastr.SuccessToastr(
                "Student inquiry updated successfully."
              );
            $("#loader").hide();
            this.form.reset(this.form.value);
            this.resetInquiryForm();
            $(".table").DataTable().ajax.reload();
          } else {
            this.toastr.ErrorToastr("Student inquiry is not added.");
            $("#loader").hide();
          }
        },
        (err: any) => {
          $("#loader").hide();
          this.toastr.ErrorToastr("Something missing");
          $("#loader").hide();
        }
      );
    }
  }
  hideShowColumn(e) {
    var col = $(".table").DataTable().column(e);
    col.visible(!col.visible());
    var colindex = this.Buttons.findIndex((m) => m.id == e);
    this.Buttons[colindex].isChecked = col.visible();
  }

  ConvertToApplication(e) {
    let input = {
      action: "add",
      inquiryId: e.target.value,
    };
    this.emitService.onchangeApplicationId(input);
  }
  deleteInquiry(e) {
    this.alerts
      .ComfirmAlert("Do you want to delete inquiry?", "Yes", "No")
      .then((res) => {
        if (res.isConfirmed) {
          $("#loader").show();
          let deleteInput = {
            id: e.target.value,
          };
          this.userInquiryService.RemoveInquiry(deleteInput).subscribe(
            (res) => {
              if (res.status) {
                this.toastr.SuccessToastr(
                  "Student inquiry deleted successfully."
                );
                $("#loader").hide();
                $("#inquiry").DataTable().ajax.reload();
              } else {
                this.toastr.ErrorToastr(res.message);
                $("#loader").hide();
              }
            },
            (err: any) => {
              $("#loader").hide();
              if (err.status == 401) {
                this.router.navigate(["/"]);
              } else {
                this.toastr.ErrorToastr("Something went wrong");
                $("#loader").hide();
              }
            }
          );
        }
      });
  }
  openModel(e: any, isView: any) {
    this.isSubmitted = false;
    this.hasViewModel = isView;
    this.CASform.reset();
    this.modalTitle = "Change CAS Status";
    this.CASform.get("ApplicationId").setValue(e.target.value);

    this.modalService.open(this.CASModal, {
      size: "small",
      backdrop: false,
    });
  }
  openVisaModel(e: any, isView: any) {
    this.isSubmitted = false;
    this.hasViewModel = isView;
    this.Visaform.reset();
    this.modalTitle = "Change Visa Status";
    this.Visaform.get("ApplicationId").setValue(e.target.value);

    this.modalService.open(this.VisaModal, {
      size: "small",
      backdrop: false,
    });
  }
  IsView: any;

  openLarge(id: any, isView: any) {
    this.isSubmitted = false;
    this.hasViewModel = isView;
    this.form.reset();
    this.resetInquiryForm();

    if (id > 0) {
      this.modalTitle = "Update Inquiry";
      this.EditInquiry(id);
      this.IsView = false;
    } else {
      this.inquiryStatusId = this.enquirystus.find(
        (x) => x.inquiryStatusName.toLocaleLowerCase() == "new"
      ).id;
      this.modalTitle = "Add Inquiry";
      this.IsView = false;
    }
    if (isView) {
      this.disableInquiryform();
      this.modalTitle = "View Inquiry";
      this.IsView = true;
    } else {
      this.enableInquiryForm();
    }

    this.modalService.open(this.inquiryModal, {
      size: "lg",
      backdrop: false,
    });
  }

  enableInquiryForm() {
    this.form.get("email")?.enable();
    this.form.get("message")?.enable();
    this.form.get("firstName")?.enable();
    this.form.get("dob")?.enable();
    this.form.get("contactNo")?.enable();
    this.form.get("lastName")?.enable();
    this.form.get("references")?.enable();
    this.form.get("inquiryStatus")?.enable();
    this.form.get("assignedToId")?.enable();
    this.form.get("countryId")?.enable();
    this.form.get("sourceId")?.enable();
    this.form.get("campusId")?.enable();
  }

  disableInquiryform() {
    this.form.get("email")?.disable();
    this.form.get("message")?.disable();
    this.form.get("firstName")?.disable();
    this.form.get("dob")?.disable();
    this.form.get("contactNo")?.disable();
    this.form.get("lastName")?.disable();
    this.form.get("references")?.disable();
    this.form.get("inquiryStatus")?.disable();
    this.form.get("assignedToId")?.disable();
    this.form.get("countryId")?.disable();
    this.form.get("sourceId")?.disable();
    this.form.get("campusId")?.disable();
  }
  // resetInquiryForm() {
  //   this.inquiryCampusId = null;
  //   this.inquirySourceId = null;
  //   this.inquiryCountryId = null;
  //   this.inquiryStatusId = null;
  // }

  resetInquiryForm() {
    this.form.get("email")?.setValue("");
    this.form.get("message")?.setValue("");
    this.form.get("firstName")?.setValue("");
    this.form.get("dob")?.setValue("");
    this.form.get("contactNo")?.setValue("");
    this.form.get("lastName")?.setValue("");
    this.form.get("references")?.setValue("");
    this.form.get("inquiryStatus")?.setValue("");
    this.form.get("assignedToId")?.setValue("");
    this.form.get("countryId")?.setValue("");
    this.form.get("sourceId")?.setValue("");
    this.form.get("inquiryId")?.setValue("0");

    this.inquiryCampusId = null;
    this.inquirySourceId = null;
    this.inquiryCountryId = null;
    //this.inquiryAssignedToId = null;
    this.inquiryAssignedToId = parseInt(this.sessionUser.getuserID());
    this.inquiryStatusId = null;
    this.emailFile = "";
    this.emailFileName = "";
  }
  emailFileView: any;
  messages: any;
  EditInquiry(index: any) {
    $("#loader").show();
    var input = {
      id: index,
    };
    this.userInquiryService.GetInquiryById(input).subscribe(
      (res) => {
        this.resetInquiryForm();
        if (res.status) {
          $("#loader").hide();
          this.form.get("email")?.setValue(res.data.email);
          this.form.get("message")?.setValue(res.data.message);
          this.form.get("firstName")?.setValue(res.data.firstName);
          this.form
            .get("dob")
            ?.setValue(moment(res.data.dob).format("YYYY-MM-DD"));
          this.form.get("contactNo")?.setValue(res.data.contactNo);
          this.form.get("lastName")?.setValue(res.data.lastName);
          this.form.get("references")?.setValue(res.data.references);
          this.form.get("inquiryId")?.setValue(res.data.inquiryId);
          this.inquiryCampusId = res.data.campusData.campusId;
          this.inquirySourceId = res.data.sourceData.sourceId;
          this.inquiryCountryId = res.data.countryData.countryId;
          this.inquiryAssignedToId = res.data.assignToData.assignToId;
          this.form.get("assignedToId")?.setValue(this.inquiryAssignedToId);
          this.inquiryStatusId = res.data.enquiryStatusData.statusId;
          this.emailFileView = "";
          this.emailFileView = res.data.emailFile;
          this.messages = res.data.inquiryMessageMapping;
        } else {
          this.toastr.ErrorToastr(res.message);
          $("#loader").hide();
        }
      },
      (err: any) => {
        $("#loader").hide();
        if (err.status == 401) {
          this.router.navigate(["/"]);
        } else {
          this.toastr.ErrorToastr("Something went wrong");
          $("#loader").hide();
        }
      }
    );
  }
  receiptUrl: any;

  openModelEmail() {
    this.receiptUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
      this.appConfig.baseServiceUrl + this.emailFileView
    );
    this.modalService.open(this.EmailInquiryModal, {
      ariaLabelledBy: "modal-basic-title",
      size: "xl",
    });
  }
  ChangeVisaStatus() {
    if (this.Visaform.valid) {
      $("#loader").show();
      var inputData = JSON.parse(JSON.stringify(this.Visaform.getRawValue()));
      var input = {
        applicationId: this.Visaform.get("ApplicationId").value,

        visaStatus: inputData.visa,
      };
      this.dashboardService.ChangeVisatatus(input).subscribe((res) => {
        if (res.status) {
          $("#loader").hide();
          $("#application8").DataTable().ajax.reload();
          this.cas();
        }
      });
    }
  }
  ChangeCASStatus() {
    if (this.CASform.valid) {
      $("#loader").show();
      var inputData = JSON.parse(JSON.stringify(this.CASform.getRawValue()));
      var input = {
        applicationId: this.CASform.get("ApplicationId").value,

        cASStatus: inputData.cas,
      };
      this.dashboardService.ChangeCASStatus(input).subscribe((res) => {
        if (res.status) {
          $("#loader").hide();
          $("#application8").DataTable().ajax.reload();
          this.cas();
        }
      });
    }
  }
  datePickerChange(e) {
    if (!e.startDate) this.filterForm.get("AppliedDate").reset();
  }

  clearFilterData() {
    this.filterForm.reset();
    this.filters = this.filterForm.getRawValue();
    $("#loader").hide();
  }
  onSubmitFilters() {
    this.filters = this.filterForm.getRawValue();
  }
}
