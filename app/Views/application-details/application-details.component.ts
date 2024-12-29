import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
  Renderer2,
   AfterViewInit,
} from "@angular/core";
import { saveAs } from "file-saver";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { forkJoin } from "rxjs";
import { AppConfig } from "src/app/appconfig";
import { Intake } from "src/app/models/intake.model";
import { OfferDetail } from "src/app/Models/offer-detail.model";
import { User } from "src/app/Models/user.model";
import { AlertServiceService } from "src/app/Services/alert-service.service";
import { ApplicationCASIssueService } from "src/app/Services/application-casissue.service";
import { ApplicationOfferService } from "src/app/Services/application-offer.service";
import { ApplicationService } from "src/app/services/application.service";
import { ConditionServiceService } from "src/app/Services/condition-service.service";
import { DepositService } from "src/app/Services/deposit.service";
import { DocumentService } from "src/app/Services/document.service";
import { DownloadfileService } from "src/app/Services/downloadfile.service";
import { EmittService } from "src/app/Services/emitt.service";
import { FileValidationService } from "src/app/Services/file-validation.service";
import { IntakeService } from "src/app/services/intake.service";
import { KanbanService } from "src/app/Services/kanban.service";
import { OnboardService } from "src/app/Services/onboard.service";
import { SessionStorageService } from "src/app/Services/session-storage.service";
import { ToastrServiceService } from "src/app/Services/toastr-service.service";
import { TodoTaskService } from "src/app/Services/todo-task.service";
import { UnivercityService } from "src/app/Services/univercity.service";
import { UserManagement } from "src/app/Services/user-management.service";
import { VisaService } from "src/app/Services/visa.service";
import { HttpClient } from "@angular/common/http";
import Swal from "sweetalert2";

@Component({
  selector: "app-application-details",
  templateUrl: "./application-details.component.html",
  styleUrls: ["./application-details.component.sass"],
  providers: [OfferDetail],
})
export class ApplicationDetailsComponent implements OnInit, AfterViewInit {
  pdf_document: string | undefined;
  word_document: string | undefined;
  submissionStatus: { [appId: number]: boolean } = {};
  selectedRMName: string = '';
  visaFileUrl: string;
  adminDeferReason: string = '';
  visaFileName: string;
  student_visaFileUrl: string;
  student_visaFileName: string;
  document_fileName: string;
  wordFileInputInvalid: boolean = false;
  isVisaSectionVisible: boolean = false;
  fileInputInvalid: boolean = false;
  selectedFile: File | null = null;
  wordAlertMessage: string | null = null;
  wordAlertClass: string | null = null;
  selectedWordFiles: FileList | null = null;
  selectedFiles: FileList | null = null;
  alertMessage: string | null = null;
  selectedAgentName: string | null = 'Select Agent';
  alertClass: string = "";
  faPlus = faPlus;
  isformLetterValid = true;
  uploadModal: any;
  showStatus: boolean = false;
  isOfferAndApproveDocs: any;
  casActive = false;
  totalCondition = 0;
  //isResonShow = false;
  selectedIntake: any = null;
  selectedCourse: any = null;
  selectedCampuse: any = null;


  color = "accent";
  isRequired = false;
  visaData: any = {
    visaId: 0,
    applicationId: 0,
    visaStatus: 0,
    passportNumber: "",
    visaApplicationUrl: null,
    draftStatus: null,
    reason: null,
    refusedReason: null,
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
    isAllGood: null,
  };

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

  Visaform: FormGroup = new FormGroup({
    statusId: new FormControl(),
    applicationUrl: new FormControl("", []),
    statusDate: new FormControl(),
    reason: new FormControl(),
    fileContent: new FormControl(),
    applicationId: new FormControl(),
  });

  fullfilForm: FormGroup = new FormGroup({
    conditonId: new FormControl(),
    condtion: new FormControl(),
  });

  CasLinkModel: FormGroup = new FormGroup({
    CasLink: new FormControl(),
  });

  airportDetails: any;
  RMs: Array<User> = [];
  OfferDetailModel: any;
  applicationStages = [];
  applicationComments = [];
  applicationNotes = [];
  agents = [];
  regionalmanager = [];
  offerList = [];
  subadmins = [];
  admins = [];
  applicationDocument = [];
  isPayDeposit = false;
  GetRequestDocList = [];
  minmunInstallment = [];
  PaymentReceipts = [];
  SetDate: any;
  applicationdocId = 0;
  storeDocumentStatus: 0;
  StoreApplicationId: 0;
  StoreDocId: 0;
  isValidFile: boolean = true;
  base64FileName: any;
  base64File: any;
  isSubmitted: boolean = false;
  isReasonFormSubmitted: boolean = false;
  placeholderText: string = 'Enter Corrections';
  isSendButton: boolean = true;
  isSaveSendButton: boolean = false;
  isFormSubmitted = false;
  userType: any = "";
  drawerWidth = 60;
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

  applicationArchivedStatusForm: FormGroup = new FormGroup({
    comment: new FormControl(),
  });

  campusStatusForm: FormGroup = new FormGroup({
    historyId: new FormControl(),
    contentId: new FormControl(),
    statusId: new FormControl(),
    arrivalDate: new FormControl(),
    arrivalTime: new FormControl(),
  });

  fileUrl: any;
  userid: any;
  application: any;
  applicationIntakes: Array<Intake> = [];
  ChangeManageby = [];
  applicationParentStatus = 0;
  applicationHistory: any;
  campusHistory: any;
  FeeStructure: any;

  @ViewChild("myButton", { static: true }) myButton!: ElementRef;

  @ViewChild("uploadOfferModal", { static: true })
  uploadOfferModal!: ElementRef;
  @ViewChild("CasUrlModal") ViewCASUrlModal: ElementRef;
  @ViewChild("MultipleDocumentUrlModal") MultipleDocumentUrlModal: ElementRef;
  @ViewChild("applicationDetailModal") applicationDetailsModal: ElementRef;
  @ViewChild("ChageStatusDocNote") ChageStatusDocNote: ElementRef;
  @ViewChild("ChageStatusUploadDocumentNote")
  ChageStatusUploadDocumentNote: ElementRef;

  @ViewChild("RenameDocumentNote")
  RenameDocumentNote: ElementRef;

  @ViewChild("PreviousOfferDetail") PreviousOfferDetail: ElementRef;
  @ViewChild("DocumentRequestModal") documentRequestModal: ElementRef;
  @ViewChild("ApplicationArchievedStatus")
  ApplicationArchievedStatus: ElementRef;

  @ViewChild("ChageStatusDocNotes") ChageStatusDocNotes: ElementRef;
  @ViewChild("DocumentUploadView1") DocumentUploadView1: ElementRef;
  @ViewChild("DeferOfferrejected") deferOfferrejected: ElementRef;
  @ViewChild("Visaoffermodel") Visaoffermodel: ElementRef;
  @ViewChild("ApplicationStatusChange") applicationStatusModal: ElementRef;
  @ViewChild("DocumentUploadView") DocumentUploadView: ElementRef;
  // @ViewChild("PhysicalApprovReject") PhysicalApprovReject: ElementRef
  @ViewChild("AddConditionModal") AddConditionModal: ElementRef;
  @ViewChild("AddConditionOfferModal") AddConditionOfferModal: ElementRef;
  @ViewChild("OfferConditionModal") OfferConditionModal: ElementRef;
  @ViewChild("ReceiptView") ReceiptView: ElementRef;
  @ViewChild("UploadReceiptModal") UploadReceiptModal: ElementRef;
  @ViewChild("LinkInquiry") LinkInquiry: ElementRef;
  latestCampus: any;
  StoreApplicatoinId: any;
  StorewordFile: any;
  CasNUmber: any;
  showCasForm : boolean = false;
  isFormSubmittedSuccessfully: boolean = false;
  isFirstTimeShownForm: boolean = true;
  IsExpire: boolean = false;
  FilterDocument: any;
  CasIssueData = [];
  offerConditions = [];
  previousOffer = [];
  offerId = 0;
  CsaFile: any;
  documentlablename: string;
  documentStatusForm: FormGroup = new FormGroup({
    applicationdocId: new FormControl(),
    reason: new FormControl(),
    status: new FormControl(),
  });

  documentRenameForm: FormGroup = new FormGroup({
    applicationdocId: new FormControl(),
    filename: new FormControl("", Validators.required),
  });

  documentlablenames: string;
  documentStatusForms: FormGroup = new FormGroup({
    applicationOfferId: new FormControl(),
    offerType: new FormControl(),
    applicationId: new FormControl(),
    //docId: new FormControl(),
    reason: new FormControl(),
  });
  deferOfferStatusForm: FormGroup = new FormGroup({
    applicationId: new FormControl(),
    reason: new FormControl(),
    offerType: new FormControl(),
  });

  documentFilterForm: FormGroup = new FormGroup({
    applicationdocId: new FormControl(),
    documentTypeId: new FormControl(),
  });

  sendOfferForm: FormGroup = new FormGroup({
    applicationId: new FormControl(),
    docIds: new FormControl(),
    conditions: new FormControl(),
    offerName: new FormControl(),
    offerId: new FormControl(),
    depositeAmount: new FormControl(),
    isTermsAndConditionApply: new FormControl(),
    intakeId: new FormControl(),
    campusId: new FormControl(),
    courseId: new FormControl(),
    offerType: new FormControl(),
    installments: new FormArray([]),
    totalFee: new FormControl(),
    UniversityId: new FormControl(),
    UniversityCourseId: new FormControl(),
    UniversityCourseDateId: new FormControl(),
    noOfIns: new FormControl(),
  });
  uploadDocumentForm: FormGroup = new FormGroup({
    documentFile: new FormControl(),
    docId: new FormControl(),
    applicationId: new FormControl(),
  });
  CsaIssueFileForm: FormGroup = new FormGroup({
    FileName: new FormControl(),
    applicationId: new FormControl(),
    CasNumber: new FormControl(),
    IssueDate: new FormControl(),
    FileUrl: new FormControl(),
  });
  VisaCoreForm: FormGroup = new FormGroup({
    reason: new FormControl(),
    visaId: new FormControl(),
  });
  CasReportForm: FormGroup = new FormGroup({
    reason: new FormControl(),
    reportDate: new FormControl(),
    applicationId: new FormControl(),
  });
  uploadMultipleDocumentForm: FormGroup = new FormGroup({
    documentFile: new FormControl(),
    docId: new FormControl(),
    applicationId: new FormControl(),
  });
  AddConditionForm: FormGroup = new FormGroup({
    offerid: new FormControl(),
    conditions: new FormControl(),
    isFullFil: new FormControl(),
  });

  UploadDepositReceiptForm: FormGroup = new FormGroup({
    dReceipt: new FormControl(),
    applicationId: new FormControl(),
    installmentId: new FormControl(),
    amount: new FormControl(),
    paymentDate: new FormControl(),
  });

  LinkInquiryForm: FormGroup = new FormGroup({
    applicationId: new FormControl(),
    inquiryId: new FormControl(),
    link: new FormControl(),
  });
  modalTitle = "";
  selectedindex: string = "0";
  requestForm = "";
  IsVisa: boolean;
  isShowCondition = false;
  archiveApplicationId = 0;
  archiveStatus = 0;
  documentList = [];
  conditionList = [];
  selectedDocumentList: Array<number> = [];
  installmentList = [];
  setEndDate: any;
  offerLetterUrl =
    "https://localhost:7102/Helper/OfferDocuments/MuhammadRizwan_sadi_638580205814905208_offer.pdf";
  constructor(
    private filevalidation: FileValidationService,
    private Univercity: UnivercityService,
    private todoService: TodoTaskService,
    private formBuilder: FormBuilder,
    private visaservices: VisaService,
    private router: Router,
    private emitService: EmittService,
    private downloadService: DownloadfileService,
    private toastr: ToastrServiceService,
    private alerts: AlertServiceService,
    private sessionStorage: SessionStorageService,
    private applicationService: ApplicationService,
    private onboardService: OnboardService,
    private modalService: NgbModal,
    private emittService: EmittService,
    private userService: UserManagement,
    private kanbanService: KanbanService,
    private intakeService: IntakeService,
    private documentService: DocumentService,
    private CsaService: ApplicationCASIssueService,
    private config: AppConfig,
    private appConfig: AppConfig,
    private domSanitizer: DomSanitizer,
    private offerDetail: OfferDetail,
    private fileValid: FileValidationService,
    private visaService: VisaService,
    private offerService: ApplicationOfferService,
    private studentBoarding: OnboardService,
    private conditionService: ConditionServiceService,
    private depositService: DepositService,
    private http: HttpClient,
    private renderer: Renderer2
  ) {
    this.Visaform = formBuilder.group({
      statusId: [1],
      // applicationUrl: ["", Validators.required],
      applicationUrl: [""],
      statusDate: [""],
      reason: [""],

      fileContent: [""],
      applicationId: [0],
    });
    this.applicationArchivedStatusForm = formBuilder.group({
      comment: ["", [Validators.required]],
    });
    this.CasLinkModel = formBuilder.group({
      CasLink: ["", [Validators.required]],
    });
    this.uploadMultipleDocumentForm = formBuilder.group({
      applicationId: ["0"],
      docId: ["0"],
      documentFile: ["", [Validators.required]],
    });
    this.documentForm = formBuilder.group({
      documentName: ["", [Validators.required, this.noWhitespaceValidator]],
      documentTypeId: ["0"],
      documentType: ["", [Validators.required]],
      documentDescription: [
        "",
        [Validators.required, this.noWhitespaceValidator],
      ],
      sampleDocumentUrl: [""],
      formOrLetter: [""],
      formOrLetterName: [""],
      documentCategory: [null, Validators.required],
    });
    this.documentStatusForms = formBuilder.group({
      applicationOfferId: [0],
      offerType: [0],
      applicationId: [0],
      // docId: [0],
      reason: ["", [Validators.required, this.noWhitespaceValidator]],
    });
    this.CasReportForm = formBuilder.group({
      applicationId: [0],
      reason: ["", Validators.required],
      reportDate: ["", Validators.required],
    });
    emittService.getApplicationId().subscribe((res) => {
      console.log("ctor getApplicationId", res);

      if (res.action == "view") {
        this.requestForm = res.page;
        $("#loader").hide();
        this.StoreApplicationId = res.id;
        this.getApplication(res.id, res.tabIndex);
        this.loadform();
      }
    });
    this.UploadDepositReceiptForm = formBuilder.group({
      dReceipt: ["", Validators.required],
      applicationId: ["", Validators.required],
      installmentId: ["", Validators.required],
      amount: ["", Validators.required],
      paymentDate: ["", Validators.required],
    });

    this.LinkInquiryForm = formBuilder.group({
      applicationId: [0, Validators.required],
      inquiryId: [0],
      link: [false, Validators.required],
    });

    emittService.getApplicationParentstatus().subscribe((res) => {
      console.log("Application parent status 422", res);
      this.applicationParentStatus = res;
      this.getApplicationStatus(res);
      $("#loader").hide();
    });

    this.CsaIssueFileForm = formBuilder.group({
      applicationId: [""],
      FileName: ["", Validators.required],
      CasNumber: [
        "",
        [Validators.required, Validators.pattern(/(^[A-Z0-9]{14,14}$)/)],
      ],
      IssueDate: ["", Validators.required],
      // IsExpire: ['']
    });
    this.sendOfferForm = formBuilder.group({
      depositeAmount: [
        "",
        [Validators.required, Validators.pattern(/(^[0-9]*$)/)],
      ],
      offerId: [null, [Validators.required]],
      docIds: [],
      conditions: [],
      isTermsAndConditionApply: false,
      offerName: "",
      applicationId: 0,
      intakeId: ["", [Validators.required]],
      campusId: ["", [Validators.required]],
      courseId: ["", [Validators.required]],
      UniversityId: [0],
      UniversityCourseId: [0],
      UniversityCourseDateId: [0],
      offerType: [0],
      installments: new FormArray([]),
      totalFee: [""],
      noOfIns: [1, [Validators.min(1), Validators.max(10)]],
    });
    this.VisaCoreForm = formBuilder.group({
      reason: ["", [Validators.required]],
      visaId: [0, [Validators.required]],
    });
    this.documentStatusForm = formBuilder.group({
      reason: [""],
    });

    this.deferOfferStatusForm = formBuilder.group({
      reason: [""],
    });

    this.uploadDocumentForm = formBuilder.group({
      documentFile: ["", [Validators.required]],
    });
    this.commentForm = formBuilder.group({
      applicationId: ["", Validators.required],
      comment: ["", Validators.required],
    });
    this.noteForm = formBuilder.group({
      applicationId: ["", Validators.required],
      note: ["", Validators.required],
    });
    this.campusStatusForm = formBuilder.group({
      historyId: [null, [Validators.required]],
      contentId: [null, [Validators.required]],
      statusId: [null, [Validators.required]],
      arrivalDate: [null, [Validators.required]],
      arrivalTime: [null, [Validators.required]],
    });

    this.AddConditionForm = formBuilder.group({
      offerid: [null, [Validators.required]],
      conditions: [null, [Validators.required]],
      isFullFil: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.once = true;

    this.SetDate = moment().format("YYYY-MM-DD");
    this.userid = this.sessionStorage.getuserID();
    this.loadData();
    this.GetSession();
    this.getStudentDocument();
    this.courseget();
    this.Progresioninfounicourse = "";
    this.GetLink();
    this.RoleListSetUp();
    
  }

  ngAfterViewInit(): void {
    // The button is now accessible, but we won't trigger it immediately.
    // We will trigger it based on some other event.
  }

  public noWhitespaceValidator(control: FormControl) {
    return (control.value || "").trim().length ? null : { whitespace: true };
  }
  Universitycourselist = [];
  roleList: any = [];
  RoleListSetUp() {
    this.roleList = [];
    this.roleList.push({
      roleIds: 1,
      roleName: "Admin",
    }),
      // this.roleList.push({
      //   roleIds: 2,
      //   roleName: "Admission Department",
      // });
    this.roleList.push({
      roleIds: 3,
      roleName: "Regional manager",
    });
    this.roleList.push({
      roleIds: 4,
      roleName: "Agent",
    });
    this.roleList.push({
      roleIds: 5,
      roleName: "Student",
    });
    this.roleList.push({
      roleIds: 6,
      roleName: "Parent",
    });
    this.roleList.push({
      roleIds: 7,
      roleName: "Sponsor",
    });
  }

  ChangeRole(RoleIdss: any) {
    // let role = $("#RoleIds").val();
    let model = {
      ApplicationId: this.StoreApplicationId,
      RoleId: RoleIdss,
    };
    this.alerts
      .ComfirmAlert("Are sure change role ?", "Yes", "No")
      .then((res) => {
        if (res.isConfirmed) {
          this.applicationService
            .chageEmailSendSetting(model)
            .subscribe((res) => {
              if (res.status) {
                this.toastr.SuccessToastr("Role Updated Successfully");
                this.mailSendRoleIdList = [];
                this.mailSendRoleIdList.push(RoleIdss);
                this.application.mailSendRoleId = RoleIdss;
              } else {
                this.toastr.ErrorToastr("Something went wrong");
              }
              $("#loader").hide();
            });
        }
      });
  }

  changeUniversity() {
    this.Universitycourselist = [];
    this.UniversityCourseDate = [];
    $("#UniversityCourse").val("");
    $("#UniversityCourseDateId").val("");
    $("#UniversityCourseId").val("");

    // this.sendOfferForm.get("UniversityCourseId")?.setValue(0);
    // this.sendOfferForm.get("UniversityCourseDateId")?.setValue(0);
    var UniversityId = this.sendOfferForm.value.UniversityId;
    let Model = {
      Id: UniversityId,
    };
    this.Progresioninfounicourse = "";
    this.Univercity.getuniversitycoursebyid(Model).subscribe((res) => {
      if (res.status) {
        this.Universitycourselist = res.data;
      } else {
        this.toastr.ErrorToastr("Something went wrong");
      }
      $("#loader").hide();
    });
  }
  UniversityCourseDate = [];
  Progresioninfounicourse: any;
  changeCourse() {
    this.UniversityCourseDate = [];
    this.Progresioninfounicourse = "";
    // this.sendOfferForm.get("UniversityCourseDateId")?.setValue(0);
    $("#UniversityCourseDateId").val("");
    var UniversityCourseId = $("#UniversityCourseId").val();
    let Model = {
      Id: UniversityCourseId,
    };
    let universitycourse = this.Universitycourselist.find(
      (A) => A.id == UniversityCourseId
    );
    if (universitycourse)
      this.Progresioninfounicourse = universitycourse.progressionInfo;
    this.Univercity.GetUniversityDatebyid(Model).subscribe((res) => {
      if (res.status) {
        this.UniversityCourseDate = res.data;
      } else {
        this.toastr.ErrorToastr("Something went wrong");
      }
      $("#loader").hide();
    });
  }

  universitylist: any;
  courseget() {
    this.Universitycourselist = [];
    this.UniversityCourseDate = [];
    this.Univercity.getUniversityList().subscribe((res) => {
      if (res.status) {
        this.universitylist = res.data;
      } else {
        this.toastr.ErrorToastr("Something went wrong");
      }
      $("#loader").hide();
    });
  }
  Todolistpage() {
    this.sessionStorage.setApplicationId(this.StoreApplicationId);
    this.router.navigate(["todoList"]);
  }

  statuValue: any;
  SetGrantedDate: any;
  visadetailsData: any;
  valuecheck: boolean = false;
  removestar = "*";
  datelabel = "";
  removefilevalidation = "*";
  firsttimecheck = true;
  Statusvalue: any;

  changestatuss(value) {
    this.statuValue = value;

    if (value == 1) {
      if (this.visadetailsData?.createdDate)
        this.Visaform.get("statusDate")?.setValue(
          moment(this.visadetailsData?.createdDate).format("YYYY-MM-DD")
        );
      else
        this.Visaform.get("statusDate")?.setValue(
          moment().format("YYYY-MM-DD")
        );
    } else if (value == 2) {
      this.SetDate = moment().format("YYYY-MM-DD");
      if (this.visadetailsData?.updatedDate)
        this.Visaform.get("statusDate")?.setValue(
          moment(this.visadetailsData?.updatedDate).format("YYYY-MM-DD")
        );
      else this.Visaform.get("statusDate")?.setValue("");
      this.SetGrantedDate = moment(this.visadetailsData?.awaitingDate).format(
        "YYYY-MM-DD"
      );
    } else if (value == 3) {
      if (this.visadetailsData?.grantedAt)
        this.Visaform.get("statusDate")?.setValue(
          moment(this.visadetailsData?.grantedAt).format("YYYY-MM-DD")
        );
      else this.Visaform.get("statusDate")?.setValue("");

      this.SetGrantedDate = moment(this.visadetailsData?.scheculeDate).format(
        "YYYY-MM-DD"
      );
    } else if (value == 4) {
      if (this.visadetailsData?.rejectAt)
        this.Visaform.get("statusDate")?.setValue(
          moment(this.visadetailsData?.rejectAt).format("YYYY-MM-DD")
        );
      else this.Visaform.get("statusDate")?.setValue("");

      this.SetGrantedDate = moment(this.visadetailsData?.scheculeDate).format(
        "YYYY-MM-DD"
      );
    } else if (value == 5) {
      if (this.visadetailsData?.rejectAt)
        this.Visaform.get("statusDate")?.setValue(
          moment(this.visadetailsData?.rejectAt).format("YYYY-MM-DD")
        );
      else this.Visaform.get("statusDate")?.setValue("");
    }
    if (value == "1" || value == 1) {
      this.valuecheck = false;
      this.removestar = "";
      this.datelabel = "Applied Date";
      this.removefilevalidation = "";
      this.Visaform.get("statusDate")?.clearValidators();
      this.Visaform.get("reason")?.clearValidators();
      this.Visaform.get("fileContent")?.clearValidators();
      this.Visaform.updateValueAndValidity();
      // this.Visaform.get("applicationUrl")?.addValidators(Validators.required);
      this.Visaform.get("applicationUrl");
    } else if (value == "2" || value == 2) {
      this.valuecheck = true;
      this.datelabel = "Submission Date";
      this.removestar = "";
      this.removefilevalidation = "";
      this.Visaform.get("applicationUrl").clearValidators();
      this.Visaform.get("reason").clearValidators();
      this.Visaform.updateValueAndValidity();
      this.Visaform.get("fileContent").clearValidators();
      this.Visaform.get("fileContent").updateValueAndValidity();
      this.Visaform.get("statusDate").addValidators(Validators.required);
    } else if (value == "3" || value == 3) {
      this.datelabel = "Granted Date";
      this.removestar = "";
      this.removefilevalidation = "";
      this.valuecheck = true;
      this.Visaform.get("applicationUrl").clearValidators();
      this.Visaform.get("reason").clearValidators();
      // this.Visaform.get('fileContent').clearValidators();
      //this.Visaform.get('fileContent').updateValueAndValidity();
      this.Visaform.updateValueAndValidity();
      this.Visaform.get("statusDate").addValidators(Validators.required);
    } else if (value == "4" || value == 4) {
      this.valuecheck = true;
      this.datelabel = "Refused Date";
      this.removestar = "*";
      this.removefilevalidation = "*";
      this.Visaform.get("applicationUrl").clearValidators();
      this.Visaform.get("applicationUrl").updateValueAndValidity();
      this.Visaform.get("statusDate").addValidators(Validators.required);
      this.Visaform.get("reason").addValidators(Validators.required);
      this.Visaform.get("fileContent").addValidators(Validators.required);
      this.Visaform.get("fileContent").updateValueAndValidity();
    } else {
      this.valuecheck = true;
      this.removestar = "*";
      this.datelabel = "Rejected Date";
      this.removefilevalidation = "*";
      this.Visaform.get("applicationUrl").clearValidators();
      this.Visaform.get("reason").clearValidators();
      this.Visaform.get("fileContent").clearValidators();
      this.Visaform.get("reason").updateValueAndValidity();
      this.Visaform.get("applicationUrl").updateValueAndValidity();
      this.Visaform.get("fileContent").updateValueAndValidity();
      this.Visaform.get("statusDate").addValidators(Validators.required);
      // this.Visaform.get('fileContent').addValidators(Validators.required);
      // this.Visaform.get('fileContent').updateValueAndValidity();
    }
  }
  GetSession(): any {
    this.userType = this.sessionStorage.getUserType();
  }
  intakeData: any[];
  CampusData: any;
  CourseData: any;
  getIntakeCampusCourse(id: any) {
    $("#loader").show();
    let input = {
      applicationId: id,
    };
    this.offerService.getIntakeOfDeferOffer(input).subscribe((res) => {
      console.log("Intake Response: ", res);
      if (res.status) {
        this.intakeData = res.data;
      } else {
        this.toastr.ErrorToastr("Something went wrong");
      }
      $("#loader").hide();
    });
    this.offerService.getCampus().subscribe((res) => {
      console.log("get Campus: ", res);
      if (res.status) {
        this.CampusData = res.data;
      } else {
        this.toastr.ErrorToastr("Something went wrong");
      }
      $("#loader").hide();
    });
    this.offerService.getCourse().subscribe((res) => {
      console.log("Get Course: ", res);
      if (res.status) {
        this.CourseData = res.data;
      } else {
        this.toastr.ErrorToastr("Something went wrong");
      }
      $("#loader").hide();
    });
    $("#loader").hide();
  }
  CasReportSave() {
    this.isSubmitted = true;
    if (this.CasReportForm.valid) {
      $("#loader").show();
      var input = JSON.parse(JSON.stringify(this.CasReportForm.getRawValue()));
      (input.applicationId = this.StoreApplicationId),
        this.CsaService.AddCasReport(input).subscribe(
          (res) => {
            if (res.status) {
              this.CasReportForm.reset();
              this.toastr.SuccessToastr("Reason Added Successfully");
              this.Documentrefrace();
              this.getVisaData();
              this.BindCasDocument();
              this.closeAnyModal.close();
            } else {
              //$("#loader").hide();
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
  }

  storeIsAddNew: boolean = false;
  BindCondition: any = [];
  AllconditionList: any;
  ConfirmReviseOffer() {
    const message =
      "Any manual generated offer uploaded on the system will be lost. Do you wish to continue";

    this.alerts.ComfirmAlert(message + "?", "Yes", "No").then((res) => {
      console.log("Revise Offer Response: ", res);
      if (res.isConfirmed) {
        // User clicked 'Yes', proceed with showing the form
        //this.openTab(4);
        this.RedirectSaveOffer();
      } else {
        // User clicked 'No', do nothing and close the popup
      }
    });
  }
  RedirectSaveOffer() {
    this.StoreOfferConditionid = [];
    if (this.application.campusData.campusId == 0) {
      this.toastr.ErrorToastr(
        "Please edit the application and assign the campus to this student inorder to proceed further on offer stage"
      );
    } else {
      // $('#loader').show();
      this.totalCondition = null;
      this.iscancelDtail = true;
      this.getIntakeCampusCourse(this.StoreApplicatoinId);
      this.storeIsAddNew = true;
      this.IsSaveoffer = false;
      this.isSaveSendButton = true;
      this.isSendButton = false;
      this.aDDDoc = [];

      this.sendOfferForm.get("docIds").setValue("");
      this.sendOfferForm.get("docIds").setValue(null);
      // this.OfferDetailModel = null;
      this.sendOfferForm.get("isTermsAndConditionApply").setValue("checked");
      if (
        this.OfferDetailModel != null &&
        this.OfferDetailModel != undefined &&
        this.OfferDetailModel != "" &&
        this.OfferDetailModel.length != 0
      ) {
        this.sendOfferForm.get('depositeAmount').setValue(this.OfferDetailModel.amount);
        // let Checkintake = this.applicationIntakes.find(m => m.intakeId == this.OfferDetailModel.intakeId)
        // if (Checkintake != null || Checkintake != undefined)
        //   this.sendOfferForm.get('intakeId').setValue(this.OfferDetailModel.intakeId);
        // if (this.OfferDetailModel.campuseId != 0)
        //   this.sendOfferForm.get('campusId').setValue(this.OfferDetailModel.campuseId);
        // if (this.OfferDetailModel.courseId != 0)
        //   this.sendOfferForm.get('courseId').setValue(this.OfferDetailModel.courseId);

        let Checkintake = this.applicationIntakes.find(
          (m) => m.intakeId == this.application.intakeData.intakeId
        );
        if (
          this.application.intakeData.intakeId != 0 &&
          Checkintake != null &&
          Checkintake != undefined
        )
          this.sendOfferForm
            .get("intakeId")
            .setValue(this.application.intakeData.intakeId);
        if (this.application.intakeData.campusId != 0)
          this.sendOfferForm
            .get("campusId")
            .setValue(this.application.campusData.campusId);
        if (this.application.intakeData.courseId != 0)
          this.sendOfferForm
            .get("courseId")
            .setValue(this.application.course.courseId);
      } else {
        let Checkintake = this.applicationIntakes.find(
          (m) => m.intakeId == this.application.intakeData.intakeId
        );
        if (
          this.application.intakeData.intakeId != 0 &&
          Checkintake != null &&
          Checkintake != undefined
        )
          this.sendOfferForm
            .get("intakeId")
            .setValue(this.application.intakeData.intakeId);
        if (this.application.intakeData.campusId != 0)
          this.sendOfferForm
            .get("campusId")
            .setValue(this.application.campusData.campusId);
        if (this.application.intakeData.courseId != 0)
          this.sendOfferForm
            .get("courseId")
            .setValue(this.application.course.courseId);
      }

      this.conditionService.GetAllCondtions().subscribe(
        (res) => {
          console.log("Condition Response: ", res);
          if (res.status) {
            this.AllconditionList = res.data;
          } else {
            this.toastr.ErrorToastr(res.message);
          }
          // $("#loader").hide();
        },
        (err: any) => {
          this.toastr.ErrorToastr("Something went wrong");
          console.log(err);
          // $("#loader").hide();
        }
      );

      var input = {
        offerId: this.offerId,
      };
      this.offerService.GetConditions(input).subscribe(
        (res) => {
          console.log("getcondition Response: ", res);
          if (res.status) {
            this.offerConditions = res.data;
            this.totalCondition = res.data.length;
            var tempArray = [];
            this.offerConditions.forEach((element) => {
              tempArray.push(parseInt(element.conditonId));
            });
            this.sendOfferForm.controls.conditions.setValue(tempArray);
          } else {
            this.toastr.ErrorToastr(res.message);
          }
          // $("#loader").hide();
        },
        (err) => {
          this.toastr.ErrorToastr("Something went wrong");
          $("#loader").hide();
        }
      );

      if (this.OfferDetailModel) {
        this.sendOfferForm
          .get("offerId")
          .setValue(this.OfferDetailModel.offerId);
        if (this.OfferDetailModel.offerId == 1) {
          this.isShowdropCondition = true;
          // $("#loader").show();
          this.conditionService.GetAllCondtions().subscribe(
            (res) => {
              console.log("OfferLetterModal Response: ", res);
              if (res.status) {
                this.conditionList = res.data;
                this.BindCondition = [];
                this.BindCondition.push(res.data[0].conditonId);
                // this.sendOfferForm.get('conditions').setValue(res.data);
              } else {
                this.toastr.ErrorToastr(res.message);
              }
              // $("#loader").hide();
            },
            (err: any) => {
              this.toastr.ErrorToastr("Something went wrong");
              console.log(err);
              // $("#loader").hide();
            }
          );
        } else {
          this.isShowdropCondition = false;
        }
        if (this.OfferDetailModel.offerStatus == 14) {
          this.sendOfferForm.get("campusId").disable();
          this.sendOfferForm.get("intakeId").disable();
          this.sendOfferForm.get("courseId").disable();
        } else {
          this.sendOfferForm.get("campusId").enable();
          this.sendOfferForm.get("intakeId").enable();
          this.sendOfferForm.get("courseId").enable();
        }
      } else {
        this.sendOfferForm.get("campusId").disable();
        this.sendOfferForm.get("intakeId").disable();
        this.sendOfferForm.get("courseId").disable();
        this.offerId = 0;
      }
    }
    // $('#loader').hide();
  }
  onCheckboxChange() {
    this.sendOfferForm.get("isTermsAndConditionApply").setValue("checked");
  }
  UploadCsaFile() {
    this.submissionStatus[this.StoreApplicatoinId] = false;
    this.isSubmitted = true;
    this.isFormSubmittedSuccessfully = true;  // Set to false to show the form fields
    //this.isFirstTimeShownForm = false;
    if (this.CsaIssueFileForm.valid) {
      $("#loader").show();
      var formVal = JSON.parse(
        JSON.stringify(this.CsaIssueFileForm.getRawValue())
      );
      formVal.applicationId = this.StoreApplicatoinId;
      formVal.CasNumber = formVal.CasNumber;
      formVal.FileName = this.getFileName(formVal.FileName);
      if (this.Storeimage != "") {
        formVal.File = this.Storeimage;
      } else {
        formVal.File = "";
      }
      this.CsaService.UploadCsaFile(formVal).subscribe(
        (res) => {
          console.log("Csa File Upload Response: ", res);
          if (res.status) {
            this.casActive = true;
            
            this.isFormSubmittedSuccessfully = true;  // Form successfully submitted
            this.isFirstTimeShownForm = false; 
            // this.modalService.dismissAll();
            this.toastr.SuccessToastr("CAS file uploaded successfully ");
            this.submissionStatus[this.StoreApplicatoinId] = true;
            // this.Storeimage = "";
            // this.Documentrefrace();
            this.CsaIssueFileForm.reset();
            this.isSubmitted = false;
            this.BindCasDocument();
            this.emittService.OnChangeapplication(this.requestForm);

            if (
              this.OpenVisaOfferModel != null &&
              this.OpenVisaOfferModel != "" &&
              this.OpenVisaOfferModel != undefined
            )
              this.OpenVisaOfferModel.close();

            // this.isValidFile = true;

            // this.ngOnInit();
          } else {
            this.toastr.ErrorToastr("CAS file is not uploaded.");
          }
          $("#loader").hide();
        },
        (err: any) => {
          $("#loader").hide();
          this.toastr.SuccessToastr("CAS file uploaded successfully ");
          //this.isFormSubmittedSuccessfully = true;
          this.submissionStatus[this.StoreApplicatoinId] = true;
          this.CsaIssueFileForm.reset();
          this.isSubmitted = false;
          //console.log("Error is: ", err);
          //this.toastr.ErrorToastr("Something missing");
        }
      );
    }
  }
  get ff() {
    return this.Visaform.controls;
  }
  get f() {
    return this.CsaIssueFileForm.controls;
  }
  get fLink() {
    return this.CasLinkModel.controls;
  }
  get fDeposit() {
    return this.UploadDepositReceiptForm.controls;
  }
  get fVisaform() {
    return this.VisaCoreForm.controls;
  }
  get fOffer() {
    return this.sendOfferForm.controls;
  }
  get f1() {
    return this.uploadDocumentForm.controls;
  }
  get f2() {
    return this.documentStatusForm.controls;
  }

  get frn() {
    return this.documentRenameForm.controls;
  }

  get f3() {
    return this.documentStatusForms.controls;
  }
  get fDeferOffer() {
    return this.deferOfferStatusForm.controls;
  }
  get fCas() {
    return this.CasReportForm.controls;
  }
  get fc() {
    return this.AddConditionForm.controls;
  }
  get fl() {
    return this.LinkInquiryForm.controls;
  }
  get freasonvalidation() {
    return this.applicationArchivedStatusForm.controls;
  }

  Datarefrace() {
    this.CsaIssueFileForm.reset();
    this.isValidFile = true;
    this.isSubmitted = false;
  }




  // showOfferAlert(OfferTypes: any) {
  //   let alertMessage = "";
  //   if (OfferTypes == 7) {
  //     alertMessage = "Are you sure you want to Approve this Request?";
  //   }
  //   if (OfferTypes == 8) {
  //     alertMessage = "Are you sure you want to Declined this Request?";
  //   }
  //   this.alerts.ComfirmAlert(alertMessage, "Yes", "No").then((res) => {
  //     console.log("ShowOffer Response: ", res);
  //     if (res.isConfirmed) {
  //       this.openOfferModel(OfferTypes);
  //     }
  //   });
  // }

// In your component.ts
showOfferAlert(OfferTypes: any) {
  let alertMessage = "";
  let reasonRequired = false;
 
  if (OfferTypes == 7) {
    alertMessage = "Are you sure you want to Approve this Request?";
  }
  if (OfferTypes == 8) {
    alertMessage = "Are you sure you want to Declined this Request?";
    reasonRequired = true; // Require reason for decline
  }
 
  Swal.fire({
    title: 'Confirmation',
    text: alertMessage,
    input: 'text',
    inputLabel: reasonRequired ? 'Terms' : 'Terms (optional)',
    inputPlaceholder: 'Enter Terms',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    inputValidator: (value) => {
      if (!value && reasonRequired) {
        return 'You need to enter a reason!';
      }
    }
  }).then((res) => {
    console.log("ShowOffer Response: ", res);
    if (res.isConfirmed) {
      this.openOfferModel(OfferTypes, res.value); // Pass reason to openOfferModel
    }
  });
}








  
  sendOffer(OfferTypes: any) {
    this.alerts
      .ComfirmAlert("Are you sure you want to send Offer ?", "Yes", "No")
      .then((res) => {
        console.log("Send offer Response: ", res);
        if (res.isConfirmed) {
          this.UpdateDeferOffer(OfferTypes);
        }
      });
  }

  DeferModelReference: any;
  openOfferModel(OfferTypes: any, value: any) {
    this.issubmitdocstatus = true;
    this.adminDeferReason = value;
    if (OfferTypes == 8) {
      this.issubmitdocstatus = false;
      this.DeferModelReference = this.modalService.open(
        this.deferOfferrejected,
        { ariaLabelledBy: "modal-basic-title", backdrop: false }
      );
      this.deferOfferStatusForm
        .get("reason")
        .addValidators([Validators.required]);
      this.deferOfferStatusForm.get("reason").updateValueAndValidity();
    } else if (OfferTypes == 7) {
      this.deferOfferStatusForm.get("reason").clearValidators();
      this.deferOfferStatusForm.get("reason").updateValueAndValidity();
      this.UpdateDeferOffer(OfferTypes);
    }
  }

  UpdateDeferOffer(OfferTypes: any) {
    $("#loader").show();
    this.issubmitdocstatus = true;
    if (this.deferOfferStatusForm.valid) {
      $("#loader").show();
      var InputData = JSON.parse(
        JSON.stringify(this.deferOfferStatusForm.getRawValue())
      );
      let getDocument = {
        ApplicationId: this.StoreApplicatoinId,
        OfferType: OfferTypes,
        reason: InputData.reason,
        applicationOfferId: this.OfferDetailModel.applicationOfferId,
        adminDeferReason: this.adminDeferReason
      };
      this.CsaService.DeferOfferStatusChange(getDocument).subscribe(
        (res) => {
          console.log("Document Response: ", res);
          if (res.status) {
            this.toastr.SuccessToastr("Offer sent successfully");
            $("#loader").hide();
            this.OfferDetailRefrech();
            if (
              this.DeferModelReference != undefined &&
              this.DeferModelReference != "" &&
              this.DeferModelReference != null
            )
              this.DeferModelReference.close();
            $("#loader").hide();
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
    }
  }
  isrejectdoc = true;
  isapprovedoc = true;
  ispenddingdoc = true;
  Documentrefrace() {
    $("#loader").show();
    let getDocument = {
      ApplicationId: this.StoreApplicatoinId,
    };
    let getDocumentView = this.applicationService.getDocList(getDocument);
    let getDocumentFilterView =
      this.applicationService.getDocumentfilterList(getDocument);
    let GetCsvFile = this.CsaService.GetCasFileByApplicationId(getDocument);

    forkJoin([getDocumentView, getDocumentFilterView, GetCsvFile]).subscribe(
      (result) => {
        console.log("Response:", result);
        if (result[0]) {
          if (result[0].status) {
            this.applicationDocument = result[0].data;
            let rejectdoc = this.applicationDocument.find(
              (x) => x.physicsStatus == 2
            );
            if (rejectdoc == null) this.isrejectdoc = false;
            else this.isrejectdoc = true;
            let approvedoc = this.applicationDocument.find(
              (x) => x.physicsStatus == 1
            );
            if (approvedoc == null) this.isapprovedoc = false;
            else this.isapprovedoc = true;
            let penddingdoc = this.applicationDocument.find(
              (x) => x.physicsStatus == 0
            );
            if (penddingdoc == null) this.ispenddingdoc = false;
            else this.ispenddingdoc = true;
          }
        }
        if (result[1]) {
          if (result[1].status) {
            this.FilterDocument = result[1].data;
          }
        }
        if (result[2]) {
          if (result[2].status) {
            this.CsaFile = result[2].data;
          }
        }
        $("#loader").hide();
      }
    );
    $("#loader").hide();
  }

  IsVisaStudent() {
    this.isRequired = !this.isRequired;

    if (this.isRequired) var visaStud = "Does this applicant requires visa";
    else var visaStud = "Are you sure, this applicant do not need visa";
    this.alerts.ComfirmAlert(visaStud + "?", "Yes", "No").then((res) => {
      console.log("Visa Student Response: ", res);
      if (res.isConfirmed) {
        this.IsVisa = this.isRequired;
        $("#loader").show();
        this.applicationService
          .AddVisaStudentStatus(this.application.applicationId, this.IsVisa)
          .subscribe((result) => {
            console.log("Response:", result);
            if (result.data == true)
              this.toastr.SuccessToastr(
                "Student’s visa status updated successfully "
              );
            else this.toastr.ErrorToastr("Student’s visa status is not updated ");
          });
        $("#loader").hide();
      } else {
        this.isRequired = !this.isRequired;
      }
    });
  }
  OpenVisaOfferModel: any;
  IsVisaStudentForOffer() {
    this.isRequired = !this.isRequired;

    if (this.isRequired) var visaStud = "Does this applicant requires visa";
    else var visaStud = "Are you sure, this applicant do not need visa";
    this.alerts.ComfirmAlert(visaStud + "?", "Yes", "No").then((res) => {
      console.log("Student Offer Response: ", res);
      if (res.isConfirmed) {
        this.IsVisa = this.isRequired;
        $("#loader").show();
        this.applicationService
          .AddVisaStudentStatus(this.application.applicationId, this.IsVisa)
          .subscribe((result) => {
            if (result.data == true)
              this.toastr.SuccessToastr(
                "Student’s visa status updated successfully "
              );
            else this.toastr.ErrorToastr("Student’s visa status is not updated ");
            if (this.isRequired) {
              this.Datarefrace();
              this.OpenVisaOfferModel = this.modalService.open(
                this.Visaoffermodel,
                { ariaLabelledBy: "modal-basic-title", backdrop: false }
              );
            }
          });
        $("#loader").hide();
      } else {
        this.isRequired = !this.isRequired;
      }
    });
  }

  resetdocumentForm() {
    this.documentFilterForm.get("documentTypeId")?.setValue("");
    this.documentStatusForm.get("reason")?.setValue("");
    this.storeDocumentStatus = 0;
  }
  DocumentRequestFromDroupdown() {
    $("loader").show();
    var InputData = JSON.parse(
      JSON.stringify(this.documentFilterForm.getRawValue())
    );
    let input = {
      applicationId: this.StoreApplicationId,
      documentIds: InputData.documentTypeId,
    };
    this.documentService.DocumentRequest(input).subscribe(
      (res) => {
        console.log("DocumentRequest Response: ", res);
        if (res.status) {
          this.toastr.SuccessToastr("Document(s) have been requested.");
          this.Documentrefrace();
          this.documentFilterForm.reset();
        } else {
          this.toastr.ErrorToastr(res.message);
        }
        $("loader").hide();
      },
      (err: any) => {
        this.toastr.ErrorToastr("Something went wrong");
        console.error(err);
        $("loader").hide();
      }
    );
  }
  DocchangeStatusReference: any;
  ishideButton: boolean;
  DocchangeStatus(ChageStatusDocNote, status) {
    this.issubmitdocstatus = false;

    this.storeDocumentStatus = status;
    this.documentStatusForm.reset();
    if (status == 1 || status == 2) {
      this.documentlablename = "Note";
      this.updateDocumentStatus();
    } else if (status == 0 || status == 3) {
      this.documentlablename = "Reason";
      this.DocchangeStatusValidation();
      this.DocchangeStatusReference = this.modalService.open(
        this.ChageStatusDocNote,
        { ariaLabelledBy: "modal-basic-title", backdrop: false }
      );
    }
  }
  UploadDocId: any;
  storeUploadDocumentStatus: any;
  UploadDocchangeStatus(ChageStatusDocNote, UploadDocId, status) {
    this.issubmitdocstatus = false;
    this.UploadDocId = UploadDocId;
    this.storeUploadDocumentStatus = status;
    
    console.log("Status is", status);
    
    this.documentStatusForm.reset();
    if (status == 3 || status == 6) {
      this.documentlablename = "Note";
      
      this.updateUploadDocumentStatus();

    } else if (status == 4 || status == 7) {
      this.documentlablename = "Reason";
      this.DocchangeStatusValidation();
      this.DocchangeStatusReference = this.modalService.open(
        this.ChageStatusUploadDocumentNote,
        { ariaLabelledBy: "modal-basic-title", backdrop: false }
      
      );
      
    }
  }

  RenameDocument(UploadDocId, newfileName) {
    console.log(
      "updating the id",
      UploadDocId,
      "New name will be",
      newfileName
    );


    this.UploadDocId = UploadDocId;

    console.log("Renaming document ID" , UploadDocId)

    this.documentlablename = "Name";
    this.DocchangeStatusReference = this.modalService.open(
      this.RenameDocumentNote,
      { ariaLabelledBy: "modal-basic-title", backdrop: false }
    );
  }

  DocchangeStatusValidation() {
    this.documentStatusForm
      .get("reason")
      .addValidators([Validators.required, this.noWhitespaceValidator]);
    this.documentStatusForm.get("reason").updateValueAndValidity();

  }

  resetOfferForm() {
    this.isFormSubmitted = false;
    this.isSendButton = true;
    this.isSaveSendButton = false;
    this.IsSaveoffer = true;

    // this.sendOfferForm.reset();
  }

  redirectOfferDetail() {
    this.isFormSubmitted = false;
    this.isSendButton = true;
    this.isSaveSendButton = false;
    //this.sendOfferForm.reset();
    this.OfferDetailRefrech();
    //this.DataRefreshforOffer();
    this.storeIsAddNew = false;
    this.IsSaveoffer = true;
    this.sendOfferForm.get("isTermsAndConditionApply").setValue("checked");
    this.getIntakeCampusCourse(this.StoreApplicatoinId);

    // this.sendOfferForm.reset();
  }

  loadData() {
    $("#loader").show();
    let RMInputs = {
      userType: 3,
    };
    let paginationModal = {
      index: 0,
      size: 0,
    };
    let RMData = this.userService.getUsersByType(RMInputs);

    let intakeData = this.intakeService.getFutureIntake();
    let managedata = this.applicationService.GetManageUser();
    forkJoin([intakeData, RMData, managedata]).subscribe(
      (result) => {
        if (result[0]) {
          if (result[0].status) {
            this.applicationIntakes = result[0].data;
          } else {
            this.toastr.ErrorToastr(result[0].message);
          }
        }

        if (result[1]) {
          if (result[1].status) {
            this.RMs = result[1].data;
          } else {
            this.toastr.ErrorToastr(result[1].message);
          }
        }
        if (result[2]) {
          if (result[2].status) {
            this.ChangeManageby = result[2].data;
            this.admins = result[2].data.filter((m) => m.userTypeId == 1);
            this.subadmins = result[2].data.filter((m) => m.userTypeId == 2);
            this.regionalmanager = result[2].data.filter(
              (m) => m.userTypeId == 3
            );
            this.agents = result[2].data.filter((m) => m.userTypeId == 4);
          } else {
            this.toastr.ErrorToastr(result[2].message);
          }
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

  getApplicationStatus(id) {
    this.kanbanService.getStagesByPerent({ id: id }).subscribe((res) => {
      console.log("GetApplicationStatus Response: ", res);
      if (res.status) {
        this.applicationStages = res.data.subStages;
      }
    });
  }

  filterOffer() {
    $("#loader").show();
    let getDocument = {
      Id: this.StoreApplicatoinId,
    };
    let GetOffer = this.applicationService.GetFilterOffer();
    let GetRequestDoc =
      this.applicationService.GetRequestDocumentsByApplicationId(getDocument);
    forkJoin([GetOffer, GetRequestDoc]).subscribe((result) => {
      if (result[0]) {
        if (result[0].status) {
          this.offerList = result[0].data;
        }
      }
      if (result[1]) {
        if (result[1].status) {
          this.GetRequestDocList = result[1].data;
          let otherData = {
            docId: 0,
            docName: "other",
          };
          this.GetRequestDocList.push(otherData);
        }
      }
      $("loader").hide();
    });
    $("loader").hide();
  }
  IsOpenforOfferDoc: any = true;
  changeDocumentRequest(data: any, DocumentModal: any) {
    data.forEach((element) => {
      if (element == 0) {
        this.IsOpenforOfferDoc = false;
        this.openDocModal(DocumentModal, 0);
        var formValaa = JSON.parse(
          JSON.stringify(this.sendOfferForm.getRawValue())
        );
        this.setValueaDDDoc = [];
        this.setValueaDDDoc = formValaa.docIds;
        this.setValueaDDDoc = this.setValueaDDDoc.filter((x) => x != 0);
        this.aDDDoc = [];
        this.aDDDoc = this.setValueaDDDoc;
      }
    });
  }

  StoreimageDoc: any;
  changeDocument(event) {
    this.fileNameHTML = "";
    const files = event.target.files;
    if (this.fileValid.checkFileType(files)) {
      for (var i = 0; i < files.length; i++) {
        const reader = new FileReader();
        let file = files[i];
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.StoreimageDoc = reader.result.toString().split(",")[1];
        };
      }
    } else {
      this.isValidFile = false;
    }
  }

  StoreimageDocforletter: any = "";
  changeDocumentforletter(event) {
    this.fileNameHTML = "";
    const files = event.target.files;
    if (this.fileValid.checkFileType(files)) {
      for (var i = 0; i < files.length; i++) {
        const reader = new FileReader();
        let file = files[i];
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.StoreimageDocforletter = reader.result.toString().split(",")[1];
        };
      }
    } else {
      this.isValidFile = false;
    }
  }

  storeDocumentModal: any;
  openDocModal(content: any, id: any = 0) {
    this.fileNameHTML = "";
    this.documentForm.reset(this.documentForm.value);
    this.isformLetterValid = true;
    this.modalTitle = "Add Document";
    this.isSubmitted = false;
    this.storeDocumentModal = this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      backdrop: false,
    });
    this.resetdocumentForm();
  }

  DocReq() {
    this.applicationStatusForm.reset();
    this.applicationStatusForm
      .get("contentId")
      .setValue(this.StoreApplicationId);
    this.applicationStatusForm
      .get("comment")
      .addValidators(Validators.required);
    //$("#loader").show();

    $("#loader").hide();
    this.openMasterModal(this.StoreApplicatoinId);
    $("#loader").hide();
  }

  MultidocModels: any;

  openMasterModal(applicationId) {
    $("#loader").show();
    let getDocument = {
      ApplicationId: applicationId,
    };

    // this.storeApplicationId = applicationId;
    this.archiveApplicationId = this.StoreApplicationId;
    //let getDocumentFilterView = this.applicationService.getDocumentfilterList(getDocument);
    this.applicationService.getDocumentfilterList(getDocument).subscribe(
      (res) => {
        console.log("Application Service Response: ", res);
        if (res.status) {
          this.documentList = res.data;
          if (this.documentList.length > 0) {
            this.selectedDocumentList = [];
            this.MultidocModels = this.modalService.open(
              this.documentRequestModal,
              {
                ariaLabelledBy: "modal-basic-title",
                size: "lg",
                backdrop: false,
              }
            );
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
                  console.log("Application service Response: ", res);
                  if (res.status) {
                    this.loadData();
                    this.toastr.SuccessToastr(
                      "Application status has been changed successfully."
                    );
                    $("#loader").hide();
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
  IsSave: any = false;
  ArchievedApplication(Status: any) {
    this.IsSave = true;
    if (this.applicationArchivedStatusForm.valid) {
      $("#loader").show();
      var inputcomment = JSON.parse(
        JSON.stringify(this.applicationArchivedStatusForm.getRawValue())
      );
      var input = {
        contentId: this.StoreNewApplicationId,
        statusId: this.StoreStatusId,
        comment: inputcomment.comment,
        // note:""
      };
      this.applicationService.changeApplicationStatus(input).subscribe(
        (res) => {
          console.log("ArchievedApplication Response: ", res);
          $("#loader").hide();
          if (res.status) {
            this.application.applicationStatusName =
              this.applicationStages.find(
                (m) => m.stageId == this.StoreStatusId
              ).stageName;
            this.emittService.OnChangeapplication(this.requestForm);
            this.toastr.SuccessToastr(
              "Application has been status change successfully."
            );
            this.ArchivedMessage.close();
            this.StoreStatusId = 0;
            this.StoreNewApplicationId = 0;
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
        console.log("DocumentRequest Response: ", res);
        if (!res.isConfirmed) {
          $("#loader").show();
          let input = {
            applicationId: this.archiveApplicationId,
            documentIds: this.selectedDocumentList,
          };

          this.documentService.DocumentRequest(input).subscribe(
            (res) => {
              console.log("DocumentReuqest1 Response: ", res);
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
              console.log("DocumentRequest2 Response: ", res);
              if (res.status) {
                this.loadData();
                this.toastr.SuccessToastr(
                  "Application status has been changed successfully."
                );
                $("#loader").hide();
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

  aDDDoc: Array<any> = [];
  setValueaDDDoc: Array<any> = [];
  SaveDocUpload() {
    this.documentForm.get("documentCategory").setValue(2);
    this.isSubmitted = true;
    if (this.documentForm.valid) {
      this.alerts
        .ComfirmAlert(
          "Do you want to add this document in document master?",
          "Yes",
          "N0"
        )
        .then((res) => {
          console.log("savedocupload Response: ", res);
          if (res.isConfirmed) {
            this.isSubmitted = true;
            if (this.documentForm.valid) {
              var formVal = JSON.parse(
                JSON.stringify(this.documentForm.getRawValue())
              );
              formVal.documentTypeId = parseInt(formVal.documentTypeId);
              formVal.sampleDocumentName = formVal.sampleDocumentUrl;
              formVal.applicationId = this.StoreApplicationId;
              formVal.documentTypeId = 0;
              if (this.StoreimageDoc != "" && this.StoreimageDoc != null) {
                formVal.sampleDocumentUrl = this.StoreimageDoc;
              } else {
                formVal.sampleDocumentUrl = "";
              }
              formVal.formOrLetterName = formVal.formOrLetter;
              if (this.StoreimageDocforletter != "") {
                formVal.formOrLetter = this.StoreimageDocforletter;
              } else {
                formVal.formOrLetter = "";
              }
              var formValaa = JSON.parse(
                JSON.stringify(this.sendOfferForm.getRawValue())
              );
              this.setValueaDDDoc = formValaa.docIds;
              this.documentService.SaveDocument(formVal).subscribe(
                (res) => {
                  console.log("saveDocupload1 Response: ", res);
                  if (res.status) {
                    if (this.MultidocModels) this.MultidocModels.close();
                    if (this.storeDocumentModal)
                      this.storeDocumentModal.close();
                    if (this.IsOpenforOfferDoc)
                      this.openMasterModal(this.StoreApplicatoinId);
                    this.IsOpenforOfferDoc = true;
                    this.filterOffer();
                    //this.modalService.dismissAll();
                    //this.toastr.SuccessToastr("Document added successfullly.");

                    this.Documentrefrace();
                    this.documentForm.reset();
                    this.StoreimageDoc = "";
                    this.documentForm.get("sampleDocumentUrl")?.setValue("");
                    this.sendOfferForm.get("docIds")?.setValue(null);
                    //this.sendOfferForm.get('docIds')?.setValue(res.data.documenTypeId);
                    // this.aDDDoc = res.data.documenTypeId;
                    this.aDDDoc = [];
                    this.aDDDoc = this.setValueaDDDoc;
                    this.aDDDoc.push(res.data.documenTypeId);

                    // this.filterOffer();
                    // //this.modalService.dismissAll();
                    if (res.data.documentTypeId == 0) {
                      this.toastr.SuccessToastr(
                        "Document Uploaded successfully."
                      );
                      this.StoreimageDoc = "";
                      this.documentForm.get("sampleDocumentUrl")?.setValue("");
                    } else {
                      this.toastr.SuccessToastr(
                        "Document updated successfully."
                      );
                      this.StoreimageDoc = "";
                      this.documentForm.get("sampleDocumentUrl")?.setValue("");
                      // this.ngOnInit();
                    }
                    this.documentForm.reset();
                  } else {
                    this.toastr.ErrorToastr("Document is not added");
                  }
                  $("#loader").hide();
                },
                (err: any) => {
                  $("#loader").hide();
                  this.toastr.ErrorToastr("Something missing");
                }
              );
            }
          } else {
            $("#loader").show();
            this.isSubmitted = true;
            if (this.documentForm.valid) {
              var formVal = JSON.parse(
                JSON.stringify(this.documentForm.getRawValue())
              );
              formVal.documentTypeId = parseInt(formVal.documentTypeId);
              formVal.sampleDocumentName = formVal.sampleDocumentUrl;
              formVal.applicationId = this.StoreApplicationId;
              formVal.documentTypeId = 0;
              if (this.StoreimageDoc != "" && this.StoreimageDoc != null) {
                formVal.sampleDocumentUrl = this.StoreimageDoc;
              } else {
                formVal.sampleDocumentUrl = "";
              }
              formVal.formOrLetterName = formVal.formOrLetter;
              if (this.StoreimageDocforletter != "") {
                formVal.formOrLetter = this.StoreimageDocforletter;
              } else {
                formVal.formOrLetter = "";
              }
              var formValaa = JSON.parse(
                JSON.stringify(this.sendOfferForm.getRawValue())
              );
              this.setValueaDDDoc = formValaa.docIds;
              //this.setValueaDDDoc = this.setValueaDDDoc.filter(x => x != 0);
              this.documentService.UserSaveDocument(formVal).subscribe(
                (res) => {
                  console.log("saveDocupload2 Response: ", res);
                  if (res.status) {
                    if (this.MultidocModels) this.MultidocModels.close();
                    if (this.storeDocumentModal)
                      this.storeDocumentModal.close();
                    if (this.IsOpenforOfferDoc)
                      this.openMasterModal(this.StoreApplicatoinId);
                    this.IsOpenforOfferDoc = true;
                    this.filterOffer();
                    //this.modalService.dismissAll();
                    this.toastr.SuccessToastr("Document added successfully.");

                    this.Documentrefrace();
                    this.documentForm.reset();
                    this.StoreimageDoc = "";
                    this.documentForm.get("sampleDocumentUrl")?.setValue("");
                    this.sendOfferForm.get("docIds")?.setValue(null);
                    this.aDDDoc = [];
                    this.aDDDoc = this.setValueaDDDoc;
                    this.aDDDoc.push(res.data);
                    // this.aDDDoc.push(otherDatas);
                  } else {
                    this.toastr.ErrorToastr("Document is not added");
                  }

                  $("#loader").hide();
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

  get fdoc() {
    return this.documentForm.controls;
  }
  resetPlaceholder(){
    this.placeholderText = 'Enter Corrections';
  }
  VisaCorectionAdd() {
    this.isSubmitted = true;
    if (this.VisaCoreForm.valid) {
      let formval = JSON.stringify(this.VisaCoreForm.getRawValue());
      let input = {
        ...JSON.parse(formval),
      };
      input.visaId = this.visaData.visaId;
      
      this.applicationService.AddVisaReason(input).subscribe((res) => {
        console.log("Visacorection Response: ", res);
        if (res.status) {
          this.toastr.SuccessToastr("Visa correction added successfully ");
          this.resetPlaceholder();
          this.placeholderText = 'Enter Corrections';
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
      });
    }
    
        window.location.reload();
  }

  Reason() {
    this.isReasonFormSubmitted = true;

    if (this.documentStatusForms.valid) {
      $("#loader").show();
      var formVal = JSON.parse(
        JSON.stringify(this.documentStatusForms.getRawValue())
      );
      let input = {
        reason: formVal.reason,
        applicationId: this.offerDetailModelForCancleOffer.applicationId,
        applicationOfferId:
          this.offerDetailModelForCancleOffer.applicationOfferId,
        offerType: 11,
      };
      // formVal.reason = formVal.reason;
      // formVal.applicationOfferId = this.OfferDetailModel.applicationOfferId;
      // formVal.applicationId = this.OfferDetailModel.applicationId;
      // formVal.offerType = 11;
      //this.isResonShow = false;
      this.applicationService.addCancelReason(input).subscribe((res) => {
        console.log("Reason Response: ", res);
        if (res.status) {
          this.toastr.SuccessToastr("Offer canceled successfully");
          //this.isResonShow = true;
          this.ChageStatusDocNotesmodel.close();
          this.OfferDetailRefrech();
          this.documentStatusForms.reset();
        } else {
          this.toastr.ErrorToastr("Something went wrong");
          // this.isResonShow = true;
          this.documentStatusForms.reset();
        }
        $("#loader").hide();
      });
      $("#loader").hide();
    }
  }

  Letterfile: any;
  // ViewOfferLatterfunction(Model: any, Letter: any) {
  //   this.Letterfile = this.domSanitizer.bypassSecurityTrustResourceUrl(
  //     this.appConfig.baseServiceUrl + Letter
  //   );
  //   this.PreviousOfferDetailModel = this.modalService.open(Model, {
  //     size: "lg",
  //     ariaLabelledBy: "modal-basic-title",
  //     backdrop: false,
  //   });
  // }
  ViewOfferLatterfunction(Model: any, Letter: string) {
    $('#loader').show();
    setTimeout(() => {
    if (!Letter) {
      this.toastr.ErrorToastr("PDF document is not available for preview");
      return;
    }


    this.Letterfile = this.domSanitizer.bypassSecurityTrustResourceUrl(
      this.appConfig.baseServiceUrl + Letter
    );

    this.PreviousOfferDetailModel = this.modalService.open(Model, {
      size: "lg",
      ariaLabelledBy: "modal-basic-title",
      backdrop: false,
    });
    
  $('#loader').hide();
  }, 5000); 

  }

  isSendOfferButton = false;
  isCancelButton = false;
  docName: any;
  docId: any;
  iscancelDtail = false;
  PreviousOfferDetailModel: any;
  PreviousIntake: any;
  PreviousCourse: any;
  PreviousCampus: any;
  PreviousMinAmount: any;
  wordDocument: string;
  FullPathWordDocument: string;
  PreviousOfferDate: any;
  PreviousOfferName: any;
  PrevousAdditionalDocument = [];
  PriviousOfferLetterList = [];
  PriviousOfferLetterFinalList = [];
  SavePreviewOffer() {

    this.isFormSubmitted = true;
    if (this.sendOfferForm.valid) {
      $("#loader").show();
      var formVal = JSON.parse(
        JSON.stringify(this.sendOfferForm.getRawValue())
      );
      formVal.applicationId = this.StoreApplicationId;
      if (formVal.offerName == null) {
        formVal.offerName = "";
      }

      if (formVal.docIds == null) {
        formVal.docIds = [];
      }
      formVal.isAddNew = this.storeIsAddNew;
      formVal.offerType = 0;
      formVal.isTermsAndConditionApply = true;
      
      if ((this.totalCondition == 0 && formVal.offerId == 1) || (this.totalCondition == null && formVal.offerId == 1)) {
        console.log("Total Conditions are: ",this.totalCondition)
        this.toastr.ErrorToastr("Please select a condition");
        $("#loader").hide();
      } else {
        if (
          formVal.conditions != undefined &&
          formVal.conditions != null &&
          formVal.conditions != ""
        ) {
        } else {
          formVal.conditions = [];
        }
        this.applicationService.PriviousOffsers(formVal).subscribe(
          (res) => {
            console.log("SavePreviewOffer Response: ", res);
            if (res.status) {
              this.isSendOfferButton = true;
              this.PriviousOfferLetterFinalList = [];
              this.isCancelButton = true;
              this.iscancelDtail = false;
              this.PriviousOfferLetterList = res.data.listOfPDF;
              this.FullPathWordDocument =
                this.appConfig.baseServiceUrl + res.data.wordfile;
              this.wordDocument = res.data.downloadFileName;
              this.PriviousOfferLetterList.forEach((element) => {
                let file = this.domSanitizer.bypassSecurityTrustResourceUrl(
                  this.appConfig.baseServiceUrl + element
                );
                let FileDetal = {
                  fileUrl: file,
                };
                this.PriviousOfferLetterFinalList.push(FileDetal);
              });

              this.PreviousOfferDetailModel = this.modalService.open(
                this.PreviousOfferDetail,
                {
                  size: "lg",
                  ariaLabelledBy: "modal-basic-title",
                  backdrop: false,
                }
              );
               $("#loader").hide();
            } else {
              this.toastr.ErrorToastr("Offer is not added");
            }
          },
          (err: any) => {
            $("#loader").hide();
            this.toastr.ErrorToastr("Something missing");
          }
        );
      }
    }
  }
  //   downloadOfferLetter() {
  //     if (this.StoreApplicationId) {
  //       $("#loader").show();
  //       this.applicationService.downloadOfferLetter(this.StoreApplicationId).subscribe(
  //         (res) => {
  //           const blob = new Blob([res], { type: 'application/pdf' });
  //           saveAs(blob, 'OfferLetter.pdf');
  //           $("#loader").hide();
  //         },
  //         (err) => {
  //           console.error('Error downloading the offer letter', err);
  //           this.toastr.ErrorToastr('Error downloading the offer letter.');
  //           $("#loader").hide();
  //         }
  //       );
  //     }
  //   }
  // }

  CanselSendOffer() {
    this.isFormSubmitted = true;
    this.isSendOfferButton = false;
    this.isCancelButton = false;
    this.iscancelDtail = false;
    this.PrevousAdditionalDocument = [];
    this.PreviousOfferDetailModel.close();
    this.enableOfferFormForm();
  }

  DataRefreshforOffer() {
    this.sendOfferForm.reset();
    this.isFormSubmitted = true;
    this.isSendOfferButton = false;
    this.isCancelButton = false;
    this.iscancelDtail = false;
    this.PrevousAdditionalDocument = [];
    this.enableOfferFormForm();
  }
  ChageStatusDocNotesmodel: any;
  cancelOfferReason() {
    let alertMessage = "";
    alertMessage = "Are you sure to cancel offer?";
    this.alerts.ComfirmAlert(alertMessage, "Yes", "N0").then((res) => {
      console.log("CancelOfferReason Response: ", res);
      if (res.isConfirmed) {
        this.documentStatusForms.reset();
        this.isSubmitted = false;
        this.ChageStatusDocNotesmodel = this.modalService.open(
          this.ChageStatusDocNotes,
          { ariaLabelledBy: "modal-basic-title", backdrop: false }
        );
        //this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: false });
      }
      this.documentStatusForms.reset();
      this.isReasonFormSubmitted = false;
    });
  }

  enableOfferFormForm() {
    this.sendOfferForm.get("docIds")?.enable();
    this.sendOfferForm.get("applicationId")?.enable();
    this.sendOfferForm.get("offerName")?.enable();
    this.sendOfferForm.get("offerId")?.enable();
    this.sendOfferForm.get("depositeAmount")?.enable();
    this.sendOfferForm.get("isTermsAndConditionApply")?.enable();
    this.sendOfferForm.get("intakeId")?.enable();
    this.sendOfferForm.get("campusId")?.enable();
    this.sendOfferForm.get("courseId")?.enable();
  }

  disableOfferform() {
    this.sendOfferForm.get("docIds")?.disable();
    this.sendOfferForm.get("applicationId")?.disable();
    this.sendOfferForm.get("offerName")?.disable();
    this.sendOfferForm.get("offerId")?.disable();
    this.sendOfferForm.get("depositeAmount")?.disable();
    this.sendOfferForm.get("isTermsAndConditionApply")?.disable();
    this.sendOfferForm.get("intakeId")?.disable();
    this.sendOfferForm.get("campusId")?.disable();
    this.sendOfferForm.get("courseId")?.disable();
  }
  closeAnyModal: any;
  modalObj: any;
  openModal(content: any, id: any = 0) {
    this.isSubmitted = false;
    this.closeAnyModal = this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      backdrop: false,
    });
  }
  StoreUploadDoc: any;
  UdateDocument: any;
  storeModelaHideshow: any;
  isReSubmitFormSubmitted: any;
  openReuploadModal(
    content: any,
    id: any = 0,
    UploadId: any,
    ModelaHideshow: any
  ) {
    // this.resetInquiryForm();
    (this.storeModelaHideshow = ModelaHideshow),
      (this.StoreUploadDoc = UploadId),
      (this.StoreDocId = id),
      (this.storeDocId = id),
      this.uploadDocumentForm.reset(this.uploadDocumentForm.value);
    this.modalTitle = "Upload Document";
    this.bindDocument(id);
    this.isReSubmitFormSubmitted = false;
    this.UdateDocument = this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      backdrop: false,
    });
  }

  Confirmmessage: any;
  Confirmmessagebtn: any;
  SaveSendOffer(offerstatus) {
    if (offerstatus == 14) {
      this.Confirmmessage = "Do you want to save offer?";
      this.Confirmmessagebtn = "Save";
    } else {
      this.Confirmmessage = "Do you want to send an offer?";
      this.Confirmmessagebtn = "Send";
    }

    this.isFormSubmitted = true;
    this.alerts
      .ComfirmAlert(this.Confirmmessage, this.Confirmmessagebtn, "Cancel")
      .then((res) => {
        console.log("Response: ", res);
        if (res.isConfirmed) {
          this.isFormSubmitted = false;
          this.sendOfferForm.get("offerType").setValue(offerstatus);
          $("#loader").show();
          var formVal = JSON.parse(
            JSON.stringify(this.sendOfferForm.getRawValue())
          );
          formVal.applicationId = this.StoreApplicationId;
          if (formVal.offerName == null) {
            formVal.offerName = "";
          }
          if (formVal.docIds == null) {
            formVal.docIds = [];
          }
          if (
            formVal.UniversityCourseDateId == null ||
            formVal.UniversityCourseDateId == undefined
          ) {
            formVal.UniversityCourseDateId = 0;
          }
          if (
            formVal.UniversityCourseId == null ||
            formVal.UniversityCourseId == undefined
          ) {
            formVal.UniversityCourseId = null;
          }
          if (
            formVal.UniversityId == null ||
            formVal.UniversityId == undefined
          ) {
            formVal.UniversityId = null;
          }

          formVal.isAddNew = this.storeIsAddNew;
          formVal.isTermsAndConditionApply = true;
          if (
            formVal.conditions != undefined &&
            formVal.conditions != null &&
            formVal.conditions != ""
          ) {
          } else {
            formVal.conditions = [];
          }
          this.applicationService.SaveOffers(formVal).subscribe(
            (res) => {
              console.log("Response: ", res);

              console.log(res);
             
              if (res.status) {
                this.storeIsAddNew = false;
                this.isFormSubmitted = false;
                this.IsSaveoffer = false;
                // this.getApplication(this.StoreApplicationId);
                const successMgs =
                  offerstatus === 14
                    ? "Offer saved successfully"
                    : "Offer sent successfully";
                this.toastr.SuccessToastr(successMgs);
                this.filterOffer();
                this.OfferDetailRefrech();
                this.emittService.OnChangeapplication(this.requestForm);
                this.CanselSendOffer();
                this.AddConditionForm.reset();
                this.totalCondition = 0;
                //this.sendOfferForm.reset();
              } else {
                const errorMsg =
                  offerstatus === 14
                    ? "Offer is not save"
                    : "Offer is not send";
                this.toastr.ErrorToastr("Offer is not sent");
              }
              $("#loader").hide();
            },
            (err: any) => {
              $("#loader").hide();
              this.toastr.ErrorToastr("Something missing");
            }
          );
        }
      });
    // }
  }
  setmetgroupindex(tabEvent: any) {
    // this.isShowCondition = false;


    console.log("this.OfferDetailModel", this.OfferDetailModel);
    console.log("this.applicationIntakes", this.applicationIntakes);
    // if(this.OfferDetailModel.offerTypeName == 'Conditional Offer'){
    //   console.log("Yes Visa is COnditional");
    //   this.isVisaSectionVisible = true;
    // }
    if (tabEvent == 0) {
      if (!$("#information").children()[0].className.includes("collapsed")) {
        this.DocumentDetailRefrech();
      }
    } else if (tabEvent == 1) {
      if (!$("#documentation").children()[0].className.includes("collapsed")) {
        this.Documentrefrace();
      }
    } else if (tabEvent == 4) {
      this.totalCondition = null;
      if (!$("#offer").children()[0].className.includes("collapsed")) {
        this.DataRefreshforOffer();
        this.storeIsAddNew = false;

        this.sendOfferForm.get("isTermsAndConditionApply").setValue("checked");
        if (this.OfferDetailModel != null) {
          this.sendOfferForm
            .get("depositeAmount")
            .setValue(this.OfferDetailModel.amount);
          let Checkintake = this.applicationIntakes.find(
            (m) => m.intakeId == this.OfferDetailModel.intakeId
          );
          if (Checkintake != null || Checkintake != undefined)
            this.sendOfferForm
              .get("intakeId")
              .setValue(this.OfferDetailModel.intakeId);
          if (this.OfferDetailModel.campuseId != 0)
            this.sendOfferForm
              .get("campusId")
              .setValue(this.OfferDetailModel.campuseId);
          if (this.OfferDetailModel.courseId != 0)
            this.sendOfferForm
              .get("courseId")
              .setValue(this.OfferDetailModel.courseId);
        } else {
          let Checkintake = this.applicationIntakes.find(
            (m) => m.intakeId == this.application.intakeData.intakeId
          );
          if (
            this.application.intakeData.intakeId != 0 ||
            Checkintake != null ||
            Checkintake != undefined
          )
            this.sendOfferForm
              .get("intakeId")
              .setValue(this.application.intakeData.intakeId);
          if (
            this.application.intakeData.campusId != null ||
            this.application.intakeData.campusId != undefined ||
            this.application.intakeData.campusId != 0
          )
            this.sendOfferForm
              .get("campusId")
              .setValue(this.application.campusData.campusId);

          console.log(
            "this.application.intakeData",
            this.application.intakeData
          );

          if (
            this.application.intakeData.courseId != null ||
            this.application.intakeData.courseId != undefined ||
            this.application.intakeData.courseId != 0
          )
            this.sendOfferForm
              .get("courseId")
              .setValue(this.application.course.courseId);
          this.setEndDate = moment(this.application.course.startDate).format(
            "YYYY-MM-DD"
          );
        }

        if (this.OfferDetailModel?.offerId == 1) {
          this.isShowCondition = true;
          this.offerId = this.OfferDetailModel.applicationOfferId;
          this.isShowdropCondition = true;
        } else {
          this.isShowCondition = false;
          this.isShowdropCondition = false;
        }
        this.getIntakeCampusCourse(this.StoreApplicatoinId);

        this.getFee();
        this.getStudentOffer();
      }
    } else if (tabEvent == 5) {
      if (!$("#visa").children()[0].className.includes("collapsed")) {
        this.getVisaData();
        this.loadform();
      }
    } else if (tabEvent == 6) {
      if (!$("#ukvi").children()[0].className.includes("collapsed")) {
        this.BindCasDocument();
        this.getVisaData();
        this.loadform();
      }
    } else if (tabEvent == 9 || tabEvent.index == 3) {
      // if (!$("#timeline").children()[0].className.includes('collapsed')) {
      var Input = {
        id: this.application.applicationId,
      };
      this.applicationService.getApplicationHistoryById(Input).subscribe(
        (res) => {
          console.log("Response of Application: ", res);
          this.applicationHistory = res.data;
        },
        (err: any) => {
          this.toastr.ErrorToastr("Something went wrong");
          console.error(err);
        }
      );
      // }
    } else if (tabEvent == 3) {
      this.getFinanceList();
    }

    if (tabEvent.index == 4) {
      this.modalService.dismissAll();
      this.sessionStorage.setApplicationId(this.StoreApplicationId);
      this.router.navigate(["todoList"]);
    }

    if (tabEvent == 8) {
      if (!$("#campus-arrival").children()[0].className.includes("collapsed")) {
        this.getCampusHistory();
      }
    }

    if (tabEvent == 7) {
      if (
        !$("#airport-arrival").children()[0].className.includes("collapsed")
      ) {
        this.getAirportArriveData(this.StoreApplicationId);
      }
    }

    this.isFormSubmitted = false;
  }














  getAirportArriveData(id: any) {
    $("#loader").show();
    var input = {
      applicationId: id,
    };
    this.studentBoarding.getAirportArrivalData(input).subscribe(
      (res) => {
        console.log("Response: ", res);
        if (res.status) {
          this.airportDetails = res.data;
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
  offerDetailModelForCancleOffer: any;
  mailSendRoleIdList: any = [];
  getApplication(id: any, tabIndex: any) {
    $("#loader").show();


    //this.isFormSubmittedSuccessfully = false;  // Set to false to show the form fields

    //this.isSubmitted = true; // Reset submission state if needed

    this.isFirstTimeShownForm = true;  
    this.isFormSubmittedSuccessfully = false;  // Ensure form shows on first open
    this.isSubmitted = false;  // Reset submission state

    this.storeIsAddNew = false;
    this.documentFilterForm.reset();
    this.applicationStatusForm.reset();
    this.noteForm.reset();
    this.commentForm.reset();
    this.documentStatusForm.reset();
    this.sendOfferForm.reset();
    this.uploadDocumentForm.reset();
    this.CsaIssueFileForm.reset();
    this.isSubmitted = false;
    this.StoreApplicatoinId = id;

    //this.BindCasDocument();

    let input = {
      id: id,
    };
    let Application = {
      ApplicationId: id,
    };
    let CampusInput = {
      applicationid: id,
    };
    let getDocument = {
      ApplicationId: id,
    };

    let viewApplication = this.applicationService.ApplicationView(input);
    let getApplicationView = this.applicationService.getApplicationById(input);

    let getVisaFileName = this.visaService.GetVisaFiles(Application);

    let getDocumentView = this.applicationService.getDocList(getDocument);
    let getDocumentFilterView =
      this.applicationService.getDocumentfilterList(getDocument);
    let GetCsvFile = this.CsaService.GetCasFileByApplicationId(getDocument);
    let GetOffer = this.applicationService.GetFilterOffer();
    let GetRequestDoc =
      this.applicationService.GetRequestDocumentsByApplicationId(input);
    let GetOfferDetail = this.applicationService.GetOfferDetail(input);
    let VisaDataRequest = this.visaService.GetVisaDetails(getDocument);
    let depositData = this.applicationService.DepositStatus(input);
    let GetCasData = this.CsaService.GetCasDataByApplicationId(getDocument);

    forkJoin([
      getApplicationView,
      viewApplication,
      getDocumentView,
      getDocumentFilterView,
      GetCasData,
      GetOffer,
      GetRequestDoc,
      GetOfferDetail,
      GetCsvFile,
      VisaDataRequest,
      depositData,
      getVisaFileName,
    ]).subscribe(
      (result) => {
        console.log("getApplication Id", id);

        console.log("getApplication Response : 2664", result);

        if (result[0]) {
          if (result[0].status) {
            this.application = result[0].data;
            this.mailSendRoleIdList.push(this.application.mailSendRoleId);
            this.commentForm.reset();
            this.commentForm
              .get("applicationId")
              .setValue(this.application.applicationId);
            this.applicationComments = result[0].data.comments;
            this.noteForm.reset();
            this.noteForm
              .get("applicationId")
              .setValue(this.application.applicationId);
            this.applicationNotes = result[0].data.notes;
            if (this.selectedindex == "7") {
              this.getCampusHistory();
            }
            this.sessionStorage.saveSessionForApplicationname(
              this.application.lastName + " " + this.application.firstName
            );
          }
        }
        if (result[1]) {
          if (result[1].status) {
            this.emittService.OnChangeapplication(this.requestForm);
          }
        }
        if (result[2]) {
          if (result[2].status) {
            this.applicationDocument = result[2].data;
            let rejectdoc = this.applicationDocument.find(
              (x) => x.physicsStatus == 2
            );
            if (rejectdoc == null) this.isrejectdoc = false;
            else this.isrejectdoc = true;
            let approvedoc = this.applicationDocument.find(
              (x) => x.physicsStatus == 1
            );
            if (approvedoc == null) this.isapprovedoc = false;
            else this.isapprovedoc = true;
            let penddingdoc = this.applicationDocument.find(
              (x) => x.physicsStatus == 0
            );
            if (penddingdoc == null) this.ispenddingdoc = false;
            else this.ispenddingdoc = true;
          }
        }
        if (result[3]) {
          if (result[3].status) {
            this.FilterDocument = result[3].data;
          }
        }
        if (result[4]) {
          if (result[4].status) {
            this.CasIssueData = result[4].data;
            if (result[4].data != null && result[4].data.length > 0) {
              //this.CasIssueData = result[4].data;
              let expiredCAS = this.CasIssueData[0].isExpire;
              let CASWithrow = this.CasIssueData[0].casStatusName;
              if (CASWithrow == "Withdraw") {
                this.isCASWithrow = true;
              } else {
                this.isCASWithrow = false;
              }
              if (expiredCAS) {
                this.IsExpire = true;
              }
            }

            // this.CsaIssueFileForm.get("applicationId")?.setValue(result[4].data.applicationId);
            // this.CsaIssueFileForm.get("CasNumber")?.setValue(result[4].data.casNumber);
            // this.CsaIssueFileForm.get("IssueDate")?.setValue(result[4].data.issueDate);
            // this.CsaIssueFileForm.get("FileName")?.setValue(result[4].data.fileName);
          }
        }

        if (result[5]) {
          if (result[5].status) {
            this.offerList = result[5].data;
          }
        }
        if (result[6]) {
          if (result[6].status) {
            this.GetRequestDocList = result[6].data;
            let otherData = {
              docId: 0,
              docName: "other",
            };
            this.GetRequestDocList.push(otherData);
          }
        }
        if (result[7]) {
          if (result[7].status) {
            this.OfferDetailModel = result[7].data;
            this.offerDetailModelForCancleOffer = result[7].data;
            if (result[7].data != null) {
              this.isSendButton = false;
              this.isSaveSendButton = false;
            } else {
              this.isSendButton = true;
              this.isSaveSendButton = false;
              // this.isSaveSendButton = true;
              // this.isSendButton = false;
            }
            if (this.OfferDetailModel != null) {
              this.sendOfferForm
                .get("depositeAmount")
                .setValue(this.OfferDetailModel.amount);
            }
          }
        }
        if (result[8]) {
          if (result[8].status) {
            this.CsaFile = result[8].data;
          }
        }
        if (result[9]) {
          if (result[9].status) {
            this.visaData = result[9].data.visaDetail;
            // if (this.visaData != null) {
            //   if (this.visaData.isStudentVisa != null && this.visaData.isStudentVisa != false) {
            //     this.IsVisa = true;
            //     $("#Isvasa").prop("checked", true);
            //   } else {
            //     this.IsVisa = false;
            //   }
            //   this.VisaCoreForm.get("reason").setValue(this.visaData?.reason);
            // } else {
            //   this.IsVisa = false;
            //   $("#Isvasa").prop("checked", false);
            // }
            //this.IsVisa = false;
            // this.Documentrefrace();
            this.getVisaData();
            // this.BindCasDocument();
          }
        }
        if (result[10]) {
          if (result[10].status) {
            this.isPayDeposit = result[10].data;
          }
        }

        if (result[11] && result[11].status) {
          console.log("Received Data:", result[11].data);

          this.visaFileUrl = result[11].data.fileUrl;
          this.student_visaFileUrl = result[11].data.studentFileUrl;
          this.visaFileName = result[11].data.fileName;
          this.student_visaFileName = result[11].data.studentFileName;
        } else {
          console.error("Error in API response", result[11].message);
        }

        $("#loader").hide();
      },
      (err: any) => {
        console.error(err);
        $("#loader").hide();
      }
    );

    this.CsaIssueFileForm.get("applicationId")?.setValue("");
    this.CsaIssueFileForm.get("CasNumber")?.setValue("");
    this.CsaIssueFileForm.get("IssueDate")?.setValue("");
    this.CsaIssueFileForm.get("FileName")?.setValue("");
    this.modalService.open(this.applicationDetailsModal, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: "application-window",
      backdrop: false,
      modalDialogClass: "application-dialog my-0 h-100 me-0",
    });
    this.drawerWidth = 60;
    $(".application-dialog").css("max-width", this.drawerWidth + "%");
    if (tabIndex == null) {
      this.openTab(0);
    } else {
      this.openTab(parseInt(tabIndex));
    }
  }

  MainCloseModel() {
    this.sessionStorage.saveSessionForApplicationname("");
    this.modalService.dismissAll();
    this.isFormSubmittedSuccessfully = false;  // Set to false to show the form fields
    this.isSubmitted = false; // Reset submission state if needed
    this.CsaIssueFileForm.reset();  // Reset the form if required
    this.showCasForm = false;
  }


  openTab(id) {
    setTimeout(() => {
      if (id > 0) {
        $(".accordion-button").addClass("collapsed");
        $(".accordion-collapse").removeClass("show");
      }

      if (id == 1) {
        $("#documentation").children()[0].classList.remove("collapsed");
        $("#documentation-details").addClass("show");
      } 
      else if (id == 4) {
        $("#offer").children()[0].classList.remove("collapsed");
        $("#offer-details").addClass("show");
        
      } 
      else if (id == 10) {
        $("#Todo").children()[0].classList.remove("collapsed");
        $("#Todo-details").addClass("show");
      } else if (id == 5) {
        $("#visa").children()[0].classList.remove("collapsed");
        $("#visa-details").addClass("show");
      } else if (id == 6) {
        $("#ukvi").children()[0].classList.remove("collapsed");
        $("#ukvi-details").addClass("show");
      } else if (id == 7) {
        $("#airport-arrival").children()[0].classList.remove("collapsed");
        $("#airport-arrival-details").addClass("show");
      } else if (id == 8) {
        $("#campus-arrival").children()[0].classList.remove("collapsed");
        $("#campus-arrival-details").addClass("show");
      } else if (id == 9) {
        $("#timeline").children()[0].classList.remove("collapsed");
        $("#timeline-details").addClass("show");
      }
      this.setmetgroupindex(id);
    }, 500);
  }

  DocumentDetailRefrech() {
    $("#loader").show();
    let getDocument = {
      id: this.StoreApplicatoinId,
    };
    let getApplicationView =
      this.applicationService.getApplicationById(getDocument);
    forkJoin([getApplicationView]).subscribe((result) => {
      console.log("Responsess:", result); // print the response here
      if (result[0]) {
        if (result[0].status) {
          this.application = result[0].data;
          this.commentForm.reset();
          this.commentForm
            .get("applicationId")
            .setValue(this.application.applicationId);
          this.applicationComments = result[0].data.comments;
          this.noteForm.reset();
          this.noteForm
            .get("applicationId")
            .setValue(this.application.applicationId);
          this.applicationNotes = result[0].data.notes;
        }
        $("#loader").hide();
      }
      $("#loader").hide();
    });
    $("#loader").hide();
  }

  OfferDetailRefrech() {
    let getDocument = {
      id: this.StoreApplicatoinId,
    };
    let GetOfferDetail = this.applicationService.GetOfferDetail(getDocument);
    forkJoin([GetOfferDetail]).subscribe((result) => {
      console.log("Response:", result);
      if (result[0]) {
        if (result[0].status) {
          this.OfferDetailModel = result[0].data;
          this.offerDetailModelForCancleOffer = result[0].data;
          if (result[0].data != null) {
            this.isSendButton = false;
            this.isSaveSendButton = false;
            this.isShowCondition = result[0].data.offerType == 1;
            this.offerId = result[0].data.applicationOfferId;

            
          }
        }
      }
    });
  }


  //Abdullah's Code
  changeRM(applicationId, userid , fullName  ) {
    console.log("ist full name",fullName);
    var input = {
      applicationId: applicationId,
      rmId: userid,
    };
    $("#loader").show();
    console.log("Input",input);
    this.applicationService.ChangeRm(input).subscribe(
      (res) => {
        console.log("changeRM Response:", res);
        if (res.status) {
          this.toastr.SuccessToastr("Regional manager changed successfully.");
             // Update the selected Regional Manager's name
             this.selectedRMName = this.RMs.find((m) => m.userId == userid).fullName;
             this.application.regionalManagerDetail.fullName = this.selectedRMName;
             console.log(this.selectedRMName);
            this.selectedRMName = fullName;
            console.log("full name",fullName);
            this.application.regionalManagerDetail.userName = fullName;
            console.log("full name 2",fullName);
 
          // this.application.regionalManagerDetail.userName = this.RMs.find(
          //   (m) => m.userId == userid
          // ).fullName;
         
          this.application.isAssignedToRegionalManager = true;
          //this.emittService.OnChangeapplication();
          // Manually trigger change detection
          //this.cd.detectChanges();
 
          console.log("Selected RM Name:", this.selectedRMName)
        } else {
          this.toastr.ErrorToastr(res.message);
        }
        $("#loader").hide();
      },
      (err: any) => {
        this.toastr.ErrorToastr("Something doing wrong.");
        $("#loader").hide();
      }
    );
  }



/*
Previous Code

  changeRM(applicationId, userid) {
    var input = {
      applicationId: applicationId,
      rmId: userid,
    };
    $("#loader").show();
    this.applicationService.ChangeRm(input).subscribe(
      (res) => {
        console.log("Response:", res);
        if (res.status) {
          this.toastr.SuccessToastr("Regional manager changed successfully ");

          this.application.regionalManagerDetail.userName = this.RMs.find(
            (m) => m.userId == userid
          ).fullName;
          this.application.isAssignedToRegionalManager = true;
          //this.emittService.OnChangeapplication();
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

  */
  StoreNewApplicationId: any;
  StoreStatusId: any;
  ArchivedMessage: any;

  changeApplicationStatus(applicationId, statusId) {
    $("#loader").show();
    var input = {
      contentId: applicationId,
      statusId: statusId,
      comment: "",
    };

    this.StoreNewApplicationId = applicationId;
    this.StoreStatusId = statusId;

    if (statusId != 5 && statusId != 6 && statusId != 7) {
      this.applicationService.changeApplicationStatus(input).subscribe(
        (res) => {
          if (res.status) {
            this.application.applicationStatusName =
              this.applicationStages.find(
                (m) => m.stageId == statusId
              ).stageName;
            this.emittService.OnChangeapplication(this.requestForm);
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
    } else {
      $("#loader").hide();
      this.ArchivedMessage = this.modalService.open(
        this.ApplicationArchievedStatus,
        { ariaLabelledBy: "modal-basic-title", size: "lg", backdrop: false }
      );
    }
  }

  addNewComment() {
    $("#loader").show();
    this.commentForm.disable();
    let input = JSON.parse(JSON.stringify(this.commentForm.getRawValue()));
    this.applicationService.AddComment(input).subscribe(
      (res) => {
        console.log("Response:", res);
        if (res.status) {
          this.getAllComments();
          this.commentForm.reset();
          this.commentForm.enable();

          this.commentForm
            .get("applicationId")
            .setValue(this.application.applicationId);
          // this.emittService.OnChangeapplication(this.requestForm);
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
    this.applicationService.getComments(input).subscribe(
      (res) => {
        console.log("Response:", res);
        if (res.status) {
          this.applicationComments = res.data;
        }
      },
      (err: any) => {
        this.toastr.ErrorToastr("Something went wrong");
        console.error(err);
      }
    );
  }
  addNewNote() {
    $("#loader").show();
    this.noteForm.disable();
    let input = JSON.parse(JSON.stringify(this.noteForm.getRawValue()));
    this.applicationService.AddNote(input).subscribe(
      (res) => {
        console.log("Response:", res);
        if (res.status) {
          this.getAllNotes();
          this.noteForm.reset();
          this.noteForm.enable();

          this.noteForm
            .get("applicationId")
            .setValue(this.application.applicationId);
          // this.emittService.OnChangeapplication(this.requestForm);
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
  getAllNotes() {
    let input = {
      Id: this.application.applicationId,
    };
    this.applicationService.getNotes(input).subscribe(
      (res) => {
        console.log("Response:", res);
        if (res.status) {
          this.applicationNotes = res.data;
        }
      },
      (err: any) => {
        this.toastr.ErrorToastr("Something went wrong");
        console.error(err);
      }
    );
  }

  editApplication(id) {
    this.modalService.dismissAll();
    let input = {
      id: id,
      page: this.requestForm,
      action: "edit",
    };
    this.emittService.onchangeApplicationId(input);
  }

  ChangeIntake(applicationId, intakeId) {
    $("#loader").show();
    var input = {
      applicationId: applicationId,
      intakeId: intakeId,
    };
    this.intakeService.ChangeIntake(input).subscribe(
      (res) => {
        console.log("Response:", res);
        if (res.status) {
          $("#loader").hide();
          this.toastr.SuccessToastr("Intake changed successfully");
          this.application.intakeData.intakeName = this.applicationIntakes.find(
            (m) => m.intakeId == intakeId
          ).intakeName;
          this.application.intakeData.endDate = this.applicationIntakes.find(
            (m) => m.intakeId == intakeId
          ).endDate;
          this.ngOnInit();
        } else {
          this.toastr.ErrorToastr(res.message);
        }
      },
      (err: any) => {
        this.toastr.ErrorToastr("something doing wrong");
      }
    );
  }
  ChangeManage(applicationId, ManageById) {
    var input = {
      applicationId: applicationId,
      ManageById: ManageById,
    };
    this.applicationService.ChangeManage(input).subscribe(
      (res) => {
        console.log("Response:", res);
        if (res.status) {
          this.toastr.SuccessToastr("Updated successfully");
          this.application.managedata.userName = this.ChangeManageby.find(
            (m) => m.userId == ManageById
          ).userName;
          this.loadData();
        } else {
          this.toastr.ErrorToastr(res.message);
        }
      },
      (err: any) => {
        this.toastr.ErrorToastr("something doing wrong");
      }
    );
  }

  ChangeAgnetData(applicationId, AgentId, fullName) {
    var input = {
      applicationId: applicationId,
      AgentId: AgentId,
    };
    this.applicationService.ChangeAgent(input).subscribe(
      (res) => {
        console.log("Response:", res);
        if (res.status) {
          this.toastr.SuccessToastr("Agent assigned successfully");
          // this.application.agentDetail.userName = this.ChangeManageby.find(
          //   (m) => m.userId == AgentId
          // ).userName;

          this.selectedAgentName = this.agents.find((m) => m.userId == AgentId).userName;
          
          this.application.agentDetail.fullName = this.selectedAgentName;
          this.application.agentDetail.userName = fullName;
          this.application.isAssignedToAgent = true;
          
          console.log("ok",fullName);
          // this.loadData();
        } else {
          this.toastr.ErrorToastr(res.message);
        }
      },
      (err: any) => {
        this.toastr.ErrorToastr("something doing wrong");
      }
    );
  }
  isEmptyOrWhitespace(value: string): boolean {
    return !value || value.trim().length === 0;
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
  NochangeStatus(status, stagid) {
    if (status == 4 && this.applicationParentStatus == 1) return true;
    else if (status == 10 && this.applicationParentStatus == 8) return true;
    else if (stagid < 3) return true;
    else return false;
  }

  searchManager(e) {
    if (e.target.value == "") {
      this.admins = this.ChangeManageby.filter((m) => m.userTypeId == 1);
      this.subadmins = this.ChangeManageby.filter((m) => m.userTypeId == 2);
      this.regionalmanager = this.ChangeManageby.filter(
        (m) => m.userTypeId == 3
      );
      this.agents = this.ChangeManageby.filter((m) => m.userTypeId == 4);
    } else {
      this.admins = this.ChangeManageby.filter(
        (m) =>
          m.userTypeId == 1 && m.userName.toLowerCase().includes(e.target.value)
      );
      this.subadmins = this.ChangeManageby.filter(
        (m) =>
          m.userTypeId == 2 && m.userName.toLowerCase().includes(e.target.value)
      );
      this.regionalmanager = this.ChangeManageby.filter(
        (m) =>
          m.userTypeId == 3 && m.userName.toLowerCase().includes(e.target.value)
      );
      this.agents = this.ChangeManageby.filter(
        (m) =>
          m.userTypeId == 4 && m.userName.toLowerCase().includes(e.target.value)
      );
    }
  }
  downloadMyFile(url: any) {
    var fileName = this.getFileName(url);
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    link.setAttribute("type", "hidden");
    link.setAttribute("href", this.config.baseServiceUrl + url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  getFileName(str: any) {
    return str.substring(str.lastIndexOf("/") + 1);
  }
  modalReference: any;
  openUploadDocModal(content: any, id: any = 0) {
    $("#loader").show();
    this.StoreDocId = id;

    this.uploadDocumentForm.reset(this.uploadDocumentForm.value);
    this.modalTitle = "Upload File";
    // this.bindDocument(id);
    this.isFormSubmitted = false;

    this.modalReference = this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      backdrop: false,
    });
    $("#loader").hide();
  }

  bindDocument(index: any) {
    let documentDetail = this.applicationDocument.find((x) => x.docId == index);
    if (documentDetail) {
      this.uploadDocumentForm
        .get("applicationId")
        ?.setValue(documentDetail.applicationId);
      this.uploadDocumentForm.get("docId")?.setValue(documentDetail.docId);
      this.uploadDocumentForm.get("documentFile")?.setValue("");
    } else {
      this.uploadDocumentForm
        .get("applicationId")
        ?.setValue(documentDetail.applicationId);
      this.uploadDocumentForm.get("docId")?.setValue(documentDetail.docId);
    }
    // this.StoreApplicationId = documentDetail.applicationId;
    // this.StoreDocIds = documentDetail.docId;
  }

  uploadDocument() {
    // $('#loader').show();
    if (this.uploadDocumentForm.valid) {
      // this.isFormSubmitted = true;
      this.alerts
        .ComfirmAlert("Do you want to upload document?", "Yes", "No")
        .then((res) => {
          console.log("Response:", res);
          if (res.isConfirmed) {
            $("#loader").show();
            let formVal = JSON.stringify(this.uploadDocumentForm.getRawValue());
            let input = {
              ...JSON.parse(formVal),
            };
            let serviceInput = {
              applicationId: this.StoreApplicationId,
              docId: this.StoreDocId,
              uploadDocId: this.StoreUploadDoc,
              contentUrl: this.base64File,
              contentUrlName: this.base64FileName,
              IsNewAdd: false,
            };
            this.documentService
              .AddStudentDocument(serviceInput)
              .subscribe((res) => {
                console.log("Response:", res);
                $("#loader").hide();
                if (res.status) {
                  ///this.modalService.dismissAll();
                  if (
                    this.UdateDocument != null ||
                    this.UdateDocument != undefined
                  )
                    this.UdateDocument.close();

                  this.Documentrefrace();
                  //$('#loader').hide();
                  this.getStudentDocument();
                  this.uploadDocumentForm.reset();

                  if (this.storeModelaHideshow == 1)
                    this.DocumentUploadViewModel(
                      this.PhysicalApprovReject,
                      this.storeDocId
                    );
                  else
                    this.DocumentUploadViewModel(
                      this.DocumentUploadView,
                      this.storeDocId
                    );

                  this.toastr.SuccessToastr("File uploaded successfully");
                  this.MulipleDocumentModel.close();
                  if (
                    this.modalReference != null ||
                    this.modalReference != undefined
                  )
                    this.modalReference.close();
                } else {
                  this.toastr.ErrorToastr("Something went wrong");
                }
                $("#loader").hide();
              });
            $("#loader").hide();
          }
        });
    }
  }

  isValiddOCFile = true;

  convertFileToBase64(event: any) {
    const files = event.target.files;
    if (this.fileValid.checkFileType(files)) {
      this.isValiddOCFile = true;
      this.isValidFile = true;
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
      this.base64FileName = file.name;
    } else {
      this.isValiddOCFile = false;
      this.isValidFile = false;
      this.uploadDocumentForm.get("documentFile")?.setValue("");
      this.uploadMultipleDocumentForm.get("documentFile")?.setValue("");
    }
  }
  _handleReaderLoaded(e: any) {
    let reader = e.target;
    var base64result = reader.result.substr(reader.result.indexOf(",") + 1);
    this.base64File = base64result;
  }
  Storeimage = "";
  fileNameHTML: any;
  changeCsafile(event) {
    this.fileNameHTML = "";
    const files = event.target.files;
    if (this.fileValid.checkFileType(files)) {
      // this.isValidFile = true;
      for (var i = 0; i < files.length; i++) {
        const reader = new FileReader();
        let file = files[i];
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.Storeimage = reader.result.toString().split(",")[1];
        };
      }
    } else {
      // this.isValidFile = false;
      // this.CsaIssueFileForm.get('FileName')?.setValue('');
      this.CsaIssueFileForm.reset();
    }
  }
  issubmitdocstatus = false;
  IsSaveoffer: any = false;

  updateUploadDocumentStatus() {
    this.issubmitdocstatus = true;
    this.documentStatusForm.get("reason")?.clearValidators();

    if (this.documentStatusForm.valid) {
      console.log("Status Kuch: ", status)
      console.log("Status false kuch: ", this.documentStatusForm)
      $("#loader").show();
      var input = JSON.parse(
        JSON.stringify(this.documentStatusForm.getRawValue())
      );
      input.uploadDocId = this.UploadDocId;
      input.docStatus = this.storeUploadDocumentStatus;
      if (input.reason == null) input.reason = "";
      this.applicationService.changeUploadDocumentStatus(input).subscribe(
        (res) => {
          console.log("Response:", res);
          if (res.status) {
            this.toastr.SuccessToastr("Document status has been changed");
            if (res.data.isOfferAndApproveDocs == true) {
              this.alerts
                .ComfirmAlert("Do you want to send offer?", "Yes", "No")
                .then((res) => {
                  console.log("Response:", res);
                  if (res.isConfirmed) {
                    this.getStudentDocument();
                    this.Documentrefrace();
                    this.modalObj.close();
                    this.openTab(4);
                  }
                  // this.ReadyToOffer();
                  // this.PhysicalApprovReject.close();
                  else this.IsSaveoffer = true;
                  this.getStudentDocument();
                  this.Documentrefrace();
                  // this.openTab(4);
                  this.RedirectSaveOffer();
                });
            } else {
              // if (this.storeUploadDocumentStatus == 6 || this.storeUploadDocumentStatus == 7)
              //   this.DocumentUploadViewModel(this.PhysicalApprovReject, this.storeDocId)
              // else
              //   this.DocumentUploadViewModel(this.DocumentUploadView, this.storeDocId)
              this.storeDocId = this.SubDocumentList.find(
                (m) => m.uploadDocId == input.uploadDocId
              ).docId;
              this.bindSubDocuments(this.storeDocId);
              this.getStudentDocument();
              this.Documentrefrace();
              //this.emittService.OnChangeapplication(this.requestForm);
              if (
                this.DocchangeStatusReference != null &&
                this.DocchangeStatusReference != undefined
              )
                this.DocchangeStatusReference.close();
              this.documentStatusForm.reset();
              this.UploadDocId = 0;
              this.storeUploadDocumentStatus = 0;
            }
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
    else{
      console.log("Status false kuch: ", this.documentStatusForm)
    }
  }

  RenameDocumentServiceCall() {
    this.issubmitdocstatus = true;
    if (this.documentRenameForm.valid) {
      $("#loader").show();
      var input = JSON.parse(
        JSON.stringify(this.documentRenameForm.getRawValue())
      );

      input.applicationdocId = this.applicationdocId;
      input.applicationdocId = this.UploadDocId;
      console.log("input ===> ", input);

      if (input.filename == null) input.filename = "";
      ///

      this.applicationService.RenameDocumentsByDocIdServiceFun(input).subscribe(
        (res) => {
          console.log("RenameDocumentsByDocId Response:", res);
          if (res.status) {
            this.toastr.SuccessToastr("Document name has been changed.");
            this.documentRenameForm.reset();
            this.UploadDocId = 0;
            $("#loader").hide();
            this.modalService.dismissAll();
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

      ///
    }
  }

  approveApplication() {
    $("#loader").show();
    //var input = JSON.parse(JSON.stringify(this.applicationStatusForm.getRawValue()));
    var input = {
      contentId: this.StoreApplicationId,
      statusId: 4,
      comment: "",
      // note:""
    };
    this.applicationService.changeApplicationStatus(input).subscribe(
      (res) => {
        console.log("Response:", res);
        $("#loader").hide();
        if (res.status) {
          this.loadData();
          this.toastr.SuccessToastr(
            "Application has been received successfully"
          );
          this.modalService.dismissAll();
          this.archiveApplicationId = 0;
          this.archiveStatus = 0;
        } else {
          this.toastr.ErrorToastr(res.message);
        }
        $("#loader").hide();
        window.location.reload();
      },
      (err: any) => {
        this.toastr.ErrorToastr("Something went wrong");
        $("#loader").hide();
      }
    );
  }
  updateDocumentStatus() {
    // $("#loader").show();
    this.issubmitdocstatus = true;
    if (this.documentStatusForm.valid) {
      var input = JSON.parse(
        JSON.stringify(this.documentStatusForm.getRawValue())
      );
      input.applicationdocId = this.applicationdocId;
      input.status = this.storeDocumentStatus;
      if (input.status == 1 || input.status == 2) {
        input.reason = "";
        this.applicationService.changeDocumentStatus(input).subscribe(
          (res) => {
            console.log("Response:", res);
            if (res.status) {
              this.toastr.SuccessToastr("Document status has been changed");
              this.Documentrefrace();
              this.emittService.OnChangeapplication(this.requestForm);
              if (
                this.DocchangeStatusReference != null &&
                this.DocchangeStatusReference != undefined
              )
                this.DocchangeStatusReference.close();
              this.documentStatusForm.reset();
              this.applicationdocId = 0;
              this.storeDocumentStatus = 0;
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
      } else if (
        (input.status == 0 && input.reason != null) ||
        (input.status == 3 && input.reason != null)
      ) {
        this.applicationService.changeDocumentStatus(input).subscribe(
          (res) => {
            console.log("Response:", res);
            if (res.status) {
              this.toastr.SuccessToastr("Document status has been changed");
              this.Documentrefrace();
              if (
                this.DocchangeStatusReference != null &&
                this.DocchangeStatusReference != undefined
              )
                this.DocchangeStatusReference.close();
              this.documentStatusForm.reset();
              this.applicationdocId = 0;
              this.storeDocumentStatus = 0;
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
    }
  }

  isCASWithrow = false;
  BindCasDocument() {
    $("#loader").show();
    this.CasIssueData = [];
    var input = {
      applicationId: this.StoreApplicatoinId,
    };
    this.CsaService.GetCasDataByApplicationId(input).subscribe((res) => {
      console.log("Response:", res);
      if (res.status) {
        // let data = res.data;
        // this.CsaIssueFileForm.get("applicationId")?.setValue(data.applicationId);
        // this.CsaIssueFileForm.get("CasNumber")?.setValue(data.casNumber);
        // this.CsaIssueFileForm.get("IssueDate")?.setValue(data.issueDate);
        // this.CsaIssueFileForm.get("IssueFile")?.setValue(data.fileName);
        // this.CsaIssueFileForm.get("FileUrl")?.setValue(data.fileUrl);
        this.CasIssueData = res.data;
        if (this.CasIssueData.length > 0) {
          // if (this.CasIssueData[0].isStudentVisa != false) {
          //   this.IsVisa = true;
          //   $("#Isvasa").prop("checked", true);
          // } else {
          //   this.IsVisa = false;
          // }
          let expiredCAS = this.CasIssueData[0].isExpire;
          let CASWithrow = this.CasIssueData[0].casStatusName;
          if (CASWithrow == "Withdraw") {
            this.isCASWithrow = true;
          } else {
            this.isCASWithrow = false;
          }
          if (expiredCAS) {
            this.IsExpire = true;
          } else {
            this.IsExpire = false;
          }
        }

        // let expiredCAS = data.find(x => x.isExpire);
        // if (expiredCAS != null || expiredCAS != undefined || expiredCAS.length > 0) {
        //   this.IsExpire = true;
        // }
        //this.CsaIssueFileForm.get("IsExpire")?.setValue(data.isExpire);
      } else {
        this.toastr.ErrorToastr("Something went wrong");
      }
      $("#loader").hide();
    });
    $("#loader").hide();
  }

  applicationId: number;
  IsUploadMe: any = false;
  IsNotUploadMe: any = false;
  OpenCASUrlModal(url: any, applicationId: any) {
    this.applicationId = applicationId;
    this.fileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
      this.appConfig.baseServiceUrl + url
    );
    this.modalService.open(this.ViewCASUrlModal, {
      size: "xl",
      ariaLabelledBy: "modal-basic-title",
      backdrop: false,
    });
  }
  once: boolean = true;
  getVisaData() {
    this.ngOnInit();
    this.changestatuss(1);
    $("#loader").show();
    // this.IsVisa = false;
    // var VisaDataRequest = this.visaService.GetVisaDetails({applicationId: 14});
    var VisaDataRequest = this.visaService.GetVisaDetails({
      applicationId: this.application.applicationId,
    });
    VisaDataRequest.subscribe((result) => {
      console.log("Response:", result);

      this.visaData = result.data.visaDetail;
      this.isVisaSectionDisabled = !result.data.isStudentVisa;
      this.isVisaSectionVisible = result.data.isStudentVisa;
      if (result.data.isStudentVisa) {
        $("#Isvasa").prop("checked", true);
        this.IsVisa = true;
      } else {
        this.IsVisa = false;
      }
      this.isRequired = this.IsVisa;
      if (this.visaData) {
        this.once = false;
        if (
          this.visaData.isStudentVisa != null &&
          this.visaData.isStudentVisa != false
        ) {
          $("#Isvasa").prop("checked", true);
          this.IsVisa = true;
        } else {
          this.IsVisa = false;
        }
      // this.VisaCoreForm.get("reason").setValue(this.visaData?.reason);
      }
      $("#loader").hide();
    });
    $("#loader").hide();
  }

  changeStatus(hId: any, id: any, status: any) {
    $("#loader").show();
    var input = {
      historyId: hId,
      contentId: id,
      statusId: status,
      arrivalDate: "0001-01-01T00:00:00",
      arrivalTime: "",
    };

    this.onboardService.changeStatus(input).subscribe(
      (res) => {
        console.log("Response:", res);
        if (res.status) {
          this.toastr.SuccessToastr("Application status has been changed successfully.");
          $("#loader").hide();
          this.getCampusHistory();
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

  getCampusHistory() {
    $("#loader").show();
    var CampusInput = {
      applicationid: this.application.applicationId,
    };
    this.onboardService.getCampusHistory(CampusInput).subscribe(
      (res) => {
        console.log("Response:", res);
        this.campusHistory = res.data;

        if (this.campusHistory?.length > 0) {
          this.latestCampus = this.campusHistory[0];
        }
        $("#loader").hide();
      },
      (err: any) => {
        $("#loader").hide();
        this.toastr.ErrorToastr("Something went wrong");
        console.error(err);
      }
    );
    $("#loader").hide();
  }
  modelCampusChange: any;
  CampusStatusUpdate(historyId: any, app: any, dropContainer: any, model: any) {
    if (app != null) {
      this.campusStatusForm.reset();
      this.campusStatusForm.get("historyId").setValue(historyId);
      this.campusStatusForm.get("contentId").setValue(app);
      this.campusStatusForm.get("statusId").setValue(dropContainer);
      this.modelCampusChange = this.modalService.open(model, {
        ariaLabelledBy: "modal-basic-title",
        size: "lg",
        backdrop: false,
      });
    } else {
      this.toastr.ErrorToastr("Something Went Wrong");
    }
  }
  get cf() {
    return this.campusStatusForm.controls;
  }

  ChangeCampusStatus() {
    $("#loader").show();
    var input = JSON.parse(JSON.stringify(this.campusStatusForm.getRawValue()));

    this.onboardService.changeStatus(input).subscribe(
      (res) => {
        console.log("Response:", res);
        if (res.status) {
          // this.loadData();
          this.toastr.SuccessToastr("Application status has been changed successfully.");
          $("#loader").hide();
          this.modelCampusChange.close();
          this.getCampusHistory();
          // this.modalService.dismissAll();
          this.campusStatusForm.reset();
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

  RejectOrRescheduleConfirm(historyId, id, app: any) {
    this.alerts
      .ComfirmAlert("Do you want to reschedule", "Yes", "No")
      .then((res) => {
        console.log("Response:", res);
        if (res.isConfirmed) {
          this.CampusStatusUpdate(
            historyId,
            id,
            6,
            this.applicationStatusModal
          );
        } else {
          this.changeStatus(historyId, id, 5);
        }
      });
  }

  saveReason() {
    this.isReasonFormSubmitted = true;
    if (this.documentStatusForms.valid) {
      $("#loader").show();
      var formVal = JSON.parse(
        JSON.stringify(this.documentStatusForms.getRawValue())
      );
      let input = {
        reason: formVal.reason,
        applicationId: this.offerDetailModelForCancleOffer.applicationId,
        applicationOfferId:
          this.offerDetailModelForCancleOffer.applicationOfferId,
        offerType: 11,
      };
      // formVal.reason = formVal.reason;
      // formVal.applicationOfferId = this.OfferDetailModel.applicationOfferId;
      // formVal.applicationId = this.OfferDetailModel.applicationId;
      // formVal.offerType = 11;
      //this.isResonShow = false;
      this.applicationService.addCancelReason(input).subscribe((res) => {
        console.log("Response:", res);
        if (res.status) {
          this.toastr.SuccessToastr("Offer canceled successfully");
          //this.isResonShow = true;
          this.ChageStatusDocNotesmodel.close();
          this.OfferDetailRefrech();
          this.documentStatusForms.reset();
        } else {
          this.toastr.ErrorToastr("Something went wrong");
          // this.isResonShow = true;
          this.documentStatusForms.reset();
        }
        $("#loader").hide();
      });
    }
  }

  VisaAllGood(id: any) {
    var input = {
      applicationId: id,
    };
    $("#loader").show();
    this.visaService.VisaAllGood(input).subscribe((res) => {
      if (res.status) {
        // this.loadData();
        this.getVisaData();
        this.toastr.SuccessToastr("All Good!");
       // this.resetPlaceholder();
       // this.placeholderText = 'Enter Corrections';
      } else {
        this.toastr.ErrorToastr("Something went wrong");
        // this.isResonShow = true;
        this.documentStatusForms.reset();
      }
      $("#loader").hide();
    });
    $("#loader").hide();
  }
  SubDocumentList: any;
  DocumentSatus: any;
  DocumentName: any;
  OnboardStatus: any;
  bindSubDocuments(id: any) {
    $("#loader").show();
    let DocIdInputModel = {
      DocId: id,
    };
    this.documentService
      .GetbindSubDocuments(DocIdInputModel)
      .subscribe((res) => {
        console.log("Response:", res);
        $("#loader").hide();
        if (res.status) {
          //this.applicationDocument=res.data
          this.SubDocumentList = res.data.docList;
          this.DocumentName = res.data.mainDocumentName;
          this.DocumentSatus = res.data.mainDocumentSatus;
          this.OnboardStatus = res.data.applicationStatus;
          this.IsNotUploadMe = false;
          this.IsUploadMe = false;

          if (this.SubDocumentList.find((m) => m.isUploadByMe == true)) {
            this.IsUploadMe = true;
          }
          if (this.SubDocumentList.find((m) => m.isUploadByMe == false)) {
            this.IsNotUploadMe = true;
          }
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
      });
  }

  StoreMultipleApplicationId: any;
  StoreMultipleDocIds: any;
  bindMultipleDocument(index: any) {
    let documentDetail = this.applicationDocument.find((m) => m.docId == index);
    if (documentDetail.isSubmitted) {
      this.uploadMultipleDocumentForm
        .get("applicationId")
        ?.setValue(documentDetail.applicationId);
      this.uploadMultipleDocumentForm
        .get("docId")
        ?.setValue(documentDetail.docId);
      // this.uploadMultipleDocumentForm.get("documentFile")?.setValue(this.getFileName(documentDetail.sampleDocumentUrl));
    } else {
      this.uploadMultipleDocumentForm
        .get("applicationId")
        ?.setValue(documentDetail.applicationId);
      this.uploadMultipleDocumentForm
        .get("docId")
        ?.setValue(documentDetail.docId);
    }
    this.StoreMultipleApplicationId = documentDetail.applicationId;
    this.StoreMultipleDocIds = documentDetail.docId;
  }

  uploadMultipleDocument() {
    this.isFormSubmitted = true;
    if (this.uploadMultipleDocumentForm.valid) {
      this.alerts
        .ComfirmAlert("Do you want to upload document?", "Yes", "No")
        .then((res) => {
          console.log("Response:", res);
          if (res.isConfirmed) {
            $("loader").show();
            let formVal = JSON.stringify(
              this.uploadMultipleDocumentForm.getRawValue()
            );
            let input = {
              ...JSON.parse(formVal),
            };
            let serviceInput = {
              applicationId: this.StoreMultipleApplicationId,
              docId: this.StoreMultipleDocIds,
              contentUrl: this.base64File,
              contentUrlName: this.base64FileName,
              IsNewAdd: true,
            };
            this.documentService
              .AddStudentDocument(serviceInput)
              .subscribe((res) => {
                console.log("Response:", res);
                $("#loader").hide();
                if (res.status) {
                  // this.modalService.dismissAll();
                  this.uploadMultipleDocumentForm
                    .get("documentFile")
                    ?.setValue("");
                  this.DocumentUploadViewModel(
                    this.DocumentUploadView,
                    this.storeDocId
                  );
                  this.getStudentDocument();
                  this.Documentrefrace();
                  this.toastr.SuccessToastr("File uploaded successfully");
                  if (res.data == true) {
                    $("#loader").hide();
                    this.alerts
                      .ComfirmAlert("Do you want to send offer?", "Yes", "No")
                      .then((res) => {
                        if (res.isConfirmed) {
                          $("#loader").hide();
                          this.modalObj.close();
                          this.openTab(4);
                        }
                        // this.ReadyToOffer();
                        else $("#loader").hide();
                        this.IsSaveoffer = true;
                        this.MulipleDocumentModel.close();
                        this.IsSaveoffer = true;
                        this.openTab(4);
                        this.RedirectSaveOffer();
                        // this.openTab(4);
                      });
                  }
                } else {
                  $("#loader").hide();
                  this.toastr.ErrorToastr("Something went wrong");
                }
              });
          }
        });
    }
  }
  studentDocuments: any;
  getStudentDocument() {
    if (this.StoreApplicationId && this.StoreApplicationId > 0) {
      $("#loader").show();
      var application = {
        ApplicationId: this.StoreApplicationId,
      };
      this.documentService.GetStudentDocuments(application).subscribe((res) => {
        if (res.status) {
          this.studentDocuments = res.data;
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
        $("#loader").hide();
      });
    }
  }

  storeDocId: any;
  MulipleDocumentModel: any;
  PhysicalApprovReject: any;
  DocumentUploadViewModel(Model: any, Id: any) {
    this.storeDocId = Id;
    this.StoreMultipleDocIds = 0;
    this.StoreMultipleApplicationId = 0;
    this.resetUploadDocumentform();
    // this.modalService.dismissAll()
    if (this.MulipleDocumentModel != null) this.MulipleDocumentModel.close();
    this.modalTitle = "Upload Document";
    this.bindMultipleDocument(Id);
    this.isFormSubmitted = false;
    this.bindSubDocuments(Id);
    this.MulipleDocumentModel = this.modalService.open(Model, {
      size: "lg",
      ariaLabelledBy: "modal-basic-title",
      backdrop: false,
    });
  }

  resetUploadDocumentform() {
    this.isFormSubmitted = false;
    this.isValidFile = true;
    this.uploadMultipleDocumentForm.reset();
  }

  get fuploadsdoc() {
    return this.uploadMultipleDocumentForm.controls;
  }

  DeleteDocument(id: any) {
    this.alerts
      .ComfirmAlert("Do you want to delete file?", "Yes", "No")
      .then((res) => {
        if (res.isConfirmed) {
          $("#loader").show();
          let DocIdInputModel = {
            UploadDocId: id,
          };
          this.documentService
            .DeleteMultipleDocument(DocIdInputModel)
            .subscribe((res) => {
              $("#loader").hide();
              if (res.status) {
                this.Documentrefrace();
                this.bindSubDocuments(this.storeDocId);
                this.toastr.SuccessToastr("File Deleted Successfully");
              } else {
                this.toastr.ErrorToastr("Something went wrong");
              }
            });
        }
      });
  }

  downloadForm(url, fileName) {
    this.downloadService.DownloadFile(url).subscribe((res) => {
      let a = document.createElement("a");
      a.download = fileName;
      a.href = window.URL.createObjectURL(res);
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }
  DrawerSizeChange(value) {
    if (value == 1) {
      this.drawerWidth += 10;
    } else this.drawerWidth -= 10;
    $(".application-dialog").css("max-width", this.drawerWidth + "%");
  }
  conditionModalRef: any;

  saveOfferCondition() {
    $("#loader").show();
    if (this.AddConditionForm.valid) {
      var input = this.AddConditionForm.getRawValue();
      var tempConditions = input.conditions;
      input.conditions = [];
      tempConditions.forEach((element) => {
        var isold = this.offerConditions.find((x) => x.conditonId == element);
        if (isold)
          input.conditions.push({
            conditionId: isold.conditonId,
            isFullfill: isold.isFullFil,
          });
        else input.conditions.push({ conditionId: element, isFullfill: false });
      });
      this.offerService.AddCondition(input).subscribe(
        (res) => {
          if (res.status) {
            this.toastr.SuccessToastr("Condition Updated Successfully");
            this.conditionModalRef.close();
          } else {
            this.toastr.ErrorToastr(res.message);
          }
          $("#loader").hide();
        },
        (err) => {
          this.toastr.ErrorToastr("Something went wrong");
          $("#loader").hide();
        }
      );
    }
  }

  // var input = {
  //   offerId: this.offerId
  // };
  // this.offerService.GetConditions(input).subscribe((res) => {
  //   if (res.status) {
  //     this.offerConditions = res.data;
  //     this.conditionmodelshow = this.modalService.open(this.OfferConditionModal, { ariaLabelledBy: 'modal-basic-title', backdrop: false, size: 'lg' });
  //   }
  //   else {
  //     this.toastr.ErrorToastr(res.message);
  //   }
  //   $("#loader").hide();
  // }, (err) => {
  //   this.toastr.ErrorToastr("Something went wrong")
  //   $("#loader").hide();
  // })

  // onlytempArray = [];
  // onlycoditionmodelopen(){
  //   var input = {
  //     offerId: this.offerId
  //   };
  //   if (this.onlytempArray.length == 0){
  //   this.offerService.GetConditions(input).subscribe((res) => {
  //     if (res.status) {
  //       this.offerConditions = res.data;
  //       this.AddConditionForm.get("conditions").setValue(this.offerConditions.map(m => m.conditonId));
  //       this.totalCondition = res.data.length;

  //       this.offerConditions.forEach(element => {
  //         this.onlytempArray.push(parseInt(element.conditonId));
  //       });
  //       this.sendOfferForm.controls.conditions.setValue(this.onlytempArray);
  //     }
  //     else {
  //       this.toastr.ErrorToastr(res.message);
  //     }
  //     $("#loader").hide();
  //   }, (err) => {
  //     this.toastr.ErrorToastr("Something went wrong")
  //     $("#loader").hide();
  //   })
  // }
  //   this.conditionModalRef = this.modalService.open(this.AddConditionOfferModal, { ariaLabelledBy: 'modal-basic-title', backdrop: false, size: 'lg' });
  // }
  storeoferId: any;
  openConditionModal(isSendOffer: any = false) {
    this.AddConditionForm.reset();
    this.AddConditionForm.get("offerid").setValue(this.offerId);
    this.AddConditionForm.get("isFullFil").setValue(false);
    this.getConditionList();
    var input = {
      offerId: this.offerId,
    };
    this.offerService.GetConditions(input).subscribe(
      (res) => {
        if (res.status) {
          this.offerConditions = res.data;
          if (this.storeoferId != this.offerId) {
            this.AddConditionForm.get("conditions").setValue(
              this.offerConditions.map((m) => m.conditonId)
            );
          } else {
            if (!this.IsConditionchanges)
              this.AddConditionForm.get("conditions").setValue(
                this.offerConditions.map((m) => m.conditonId)
              );
            else
              this.AddConditionForm.get("conditions").setValue(
                this.StoreOfferConditionid
              );
          }

          if (!isSendOffer) {
            this.IsCoditionoffer = true;
            this.conditionModalRef = this.modalService.open(
              this.AddConditionModal,
              {
                ariaLabelledBy: "modal-basic-title",
                backdrop: false,
                size: "lg",
              }
            );
          } else
            this.conditionModalRef = this.modalService.open(
              this.AddConditionOfferModal,
              {
                ariaLabelledBy: "modal-basic-title",
                backdrop: false,
                size: "lg",
              }
            );
        } else {
          this.toastr.ErrorToastr(res.message);
        }
        $("#loader").hide();
      },
      (err) => {
        this.toastr.ErrorToastr("Something went wrong");
        $("#loader").hide();
      }
    );
  }

  //Abdullah Working
  isShowdropCondition: any = false;
  isVisaSectionDisabled: boolean = false;
  isCampusArrivalDisabled: boolean = false;
  isAirportArrivalDisabled: boolean = false;
  isVisaRequiredVisible: boolean = false;
  ChangeOfferType(event) {
    var offerType = this.offerList.find((m) => m.offerId == event);
    if (offerType) {
      this.isShowdropCondition = offerType.offerType == 1;
      this.isVisaSectionVisible = offerType.offerType == 1;
      this.isVisaSectionDisabled = offerType.offerType == 1;
      this.isVisaRequiredVisible = offerType.offerType == 1;
 
       // Disable Campus Arrival and Airport Arrival when conditional offer is selected (offerType == 1)
    if (offerType.offerType == 1) {
      this.isCampusArrivalDisabled = true;
      this.isAirportArrivalDisabled = true;
    } else {
      this.isCampusArrivalDisabled = false;
      this.isAirportArrivalDisabled = false;
    }
    }
    if (this.isShowdropCondition && this.conditionList.length == 0) {
      this.getConditionList();
    }
  }






  // isShowdropCondition: any = false;
  // ChangeOfferType(event) {
  //   var offerType = this.offerList.find((m) => m.offerId == event);
  //   if (offerType) {
  //     this.isShowdropCondition = offerType.offerType == 1;
  //     this.isVisaSectionVisible = offerType.offerType == 1;
  //   }
  //   if (this.isShowdropCondition && this.conditionList.length == 0) {
  //     this.getConditionList();
  //   }
  // }





  getConditionList() {
    $("#loader").show();
    var input = {
      offerId: this.offerId,
    };
    this.offerService.GetConditions(input).subscribe(
      (res) => {
        if (res.status) {
          this.conditionList = res.data;
          this.BindCondition = [];
          // this.BindCondition.push(
          //   res.data[0].conditonId
          // );
          // this.sendOfferForm.get('conditions').setValue(res.data);
          // this.sendOfferForm.setValue(res.data[0]);
        } else {
          this.toastr.ErrorToastr(res.message);
        }
        $("#loader").hide();
      },
      (err: any) => {
        this.toastr.ErrorToastr("Something went wrong");
        console.log(err);
        $("#loader").hide();
      }
    );
  }

  conditionmodelshow: any;
  getOfferConditions() {
    var input = {
      offerId: this.offerId,
    };
    this.offerService.GetConditions(input).subscribe(
      (res) => {
        if (res.status) {
          this.offerConditions = res.data;
          this.conditionmodelshow = this.modalService.open(
            this.OfferConditionModal,
            { ariaLabelledBy: "modal-basic-title", backdrop: false, size: "lg" }
          );
        } else {
          this.toastr.ErrorToastr(res.message);
        }
        $("#loader").hide();
      },
      (err) => {
        this.toastr.ErrorToastr("Something went wrong");
        $("#loader").hide();
      }
    );
  }
  MultipleDocUment: any;

  OpenModel(content: any, Id: any) {
    this.MultipleDocUment = [];
    this.applicationdocId = Id;

    let DocIdInputModel = {
      DocId: Id,
    };
    this.documentService
      .GetbindSubDocuments(DocIdInputModel)
      .subscribe((res) => {
        $("#loader").hide();

        console.log("Response is:", res);
        if (res.status) {
          this.SubDocumentList = res.data.docList;
          this.DocumentName = res.data.mainDocumentName;
          this.DocumentSatus = res.data.mainDocumentSatus;
          this.OnboardStatus = res.data.applicationStatus;

          // this.document_fileName = res.data.docList[0].document_Name;
          //  console.log("DocumentNamesAre: ", this.document_fileName);

          this.SubDocumentList.forEach((element) => {
            let file = this.domSanitizer.bypassSecurityTrustResourceUrl(
              this.appConfig.baseServiceUrl + element.docPath
            );
            let FileDetal = {
              file: element.docPath,
              fileUrl: file,
              fileName: element.document_Name,
            };
            // this.document_fileName = FileDetal.fileName;
            this.MultipleDocUment.push(FileDetal);
          });
          this.IsNotUploadMe = false;
          this.IsUploadMe = false;
          if (this.SubDocumentList.find((m) => m.isUploadByMe == true)) {
            this.IsUploadMe = true;
          }
          if (this.SubDocumentList.find((m) => m.isUploadByMe == false)) {
            this.IsNotUploadMe = true;
          }

          this.isSubmitted = false;
          this.modalObj = this.modalService.open(content, {
            size: "xl",
            ariaLabelledBy: "modal-basic-title",
            backdrop: false,
          });
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
      });
  }
  ReadyToOffer() {
    
    this.openTab(4);
    this.RedirectSaveOffer();
    this.IsSaveoffer = true;
  }
  IsPriviousOffer: any = false;
  getFee() {
    (<FormArray>this.sendOfferForm.get("installments")).clear();
    if (
      this.sendOfferForm.value.intakeId > 0 &&
      this.sendOfferForm.value.courseId > 0 &&
      this.sendOfferForm.value.campusId > 0
    ) {
      var input = {
        intakeId: this.sendOfferForm.value.intakeId,
        courseId: this.sendOfferForm.value.courseId,
        campusId: this.sendOfferForm.value.campusId,
      };

      this.offerService.getFee(input).subscribe(
        (res) => {
          if (res.status) {
            this.IsPriviousOffer = true;
            this.FeeStructure = res.data;
            var totalFee =
              this.FeeStructure.totalFee - this.FeeStructure.depositAmount;
            for (let i = 0; i < this.FeeStructure.installments.length; i++) {
              (<FormArray>this.sendOfferForm.get("installments")).push(
                this.getInstallmentForm()
              );
              this.installmentControls[i]
                .get("installmentAmount")
                .setValue(this.FeeStructure.installments[i].installmentAmount);
              this.installmentControls[i]
                .get("installmentDue")
                .setValue(
                  moment(
                    this.FeeStructure.installments[i].installmentDue
                  ).format("YYYY-MM-DD")
                );
            }
            this.sendOfferForm
              .get("depositeAmount")
              .setValue(this.FeeStructure.depositAmount);
            this.sendOfferForm.get("totalFee").setValue(totalFee);
            this.sendOfferForm
              .get("noOfIns")
              .setValue(this.installmentControls.length);
            this.addInstallment(false);
          } else {
            this.IsPriviousOffer = false;
            this.toastr.ErrorToastr(res.message);
          }
        },
        (err: any) => {
          this.toastr.SuccessToastr("Something went wrong");
        }
      );
    }
  }

  changeDepoInsatll() {
    var formVal = JSON.parse(JSON.stringify(this.sendOfferForm.getRawValue()));
    var ChangedepoAmount = formVal.depositeAmount
      ? parseInt(formVal.depositeAmount)
      : 0;
    (<FormArray>this.sendOfferForm.get("installments")).clear();
    var input = {
      intakeId: formVal.intakeId,
      courseId: formVal.courseId,
      campusId: formVal.campusId,
    };

    this.offerService.getFee(input).subscribe(
      (res) => {
        if (res.status) {
          let DepositeAmountUPDown = 0;
          this.FeeStructure = res.data;
          var totalFee = 0;
          if (this.FeeStructure.depositAmount != ChangedepoAmount) {
            var depogapamount =
              this.FeeStructure.depositAmount - formVal.depositeAmount;
            DepositeAmountUPDown =
              depogapamount / this.FeeStructure.installments.length;
          }
          for (let i = 0; i < this.FeeStructure.installments.length; i++) {
            (<FormArray>this.sendOfferForm.get("installments")).push(
              this.getInstallmentForm()
            );
            this.installmentControls[i]
              .get("installmentAmount")
              .setValue(
                this.FeeStructure.installments[i].installmentAmount +
                  DepositeAmountUPDown
              );
            this.installmentControls[i]
              .get("installmentDue")
              .setValue(
                moment(this.FeeStructure.installments[i].installmentDue).format(
                  "YYYY-MM-DD"
                )
              );
            totalFee =
              totalFee +
              this.FeeStructure.installments[i].installmentAmount +
              DepositeAmountUPDown;
          }

          this.sendOfferForm.get("totalFee").setValue(totalFee);
          this.sendOfferForm
            .get("noOfIns")
            .setValue(this.installmentControls.length);
          this.addInstallment(false);
        } else {
          this.toastr.ErrorToastr(res.message);
        }
      },
      (err: any) => {
        this.toastr.ErrorToastr("Your intake, course and campus are invalid ");
      }
    );
  }

  printPage(url) {
    this.downloadService.DownloadFile(url).subscribe((res) => {
      let a = document.createElement("a");
      a.download = "";
      a.href = window.URL.createObjectURL(res);
      document.body.appendChild(a);
      // var v=window.open(a.href,"_self")
      //v.window.print()

      const WindowPrt = window.open(
        a.href,
        "",
        "left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0"
      );
      WindowPrt.print();
    });
  }

  getInstallmentForm(): FormGroup {
    return this.formBuilder.group({
      installmentID: [0],
      installmentDue: [null, [Validators.required]],
      installmentAmount: [
        null,
        [
          Validators.required,
          Validators.pattern(/(^0$)|(^[1-9]\d{0,8}$)/),
          Validators.min(1),
        ],
      ],
    });
  }

  get installmentControls() {
    return (<FormArray>this.sendOfferForm.get("installments")).controls;
  }

  addInstallment(isAutoAmount) {
    if (isAutoAmount) {
      this.minmunInstallment = [];
      (this.sendOfferForm.controls["installments"] as FormArray).clear();
    }
    var total = parseInt(this.sendOfferForm.get("noOfIns").value);
    if (total <= 10) {
      if (total < 11)
        var installmentAmt =
          parseFloat(this.sendOfferForm.get("totalFee").value) / total;
      for (let i = 0; i < total; i++) {
        if (isAutoAmount) {
          (<FormArray>this.sendOfferForm.get("installments")).push(
            this.getInstallmentForm()
          );
          this.installmentControls[i]
            .get("installmentAmount")
            .setValue(installmentAmt);
        }
        this.minmunInstallment.push(moment().format("YYYY-MM-DD"));
      }
    }
  }
  changeInstallmentAmount() {
    var totalInstallmentAmount = 0;
    var totalFee = parseInt(this.sendOfferForm.get("totalFee").value);
    for (let i = 0; i < this.installmentControls.length; i++) {
      totalInstallmentAmount += parseFloat(
        this.installmentControls[i].get("installmentAmount").value
      );
    }
    for (let i = 0; i < this.installmentControls.length; i++)
      if (totalFee == totalInstallmentAmount) {
        this.installmentControls[i].get("installmentAmount").clearValidators();
        this.installmentControls[i]
          .get("installmentAmount")
          .updateValueAndValidity();
      } else {
        this.installmentControls[i]
          .get("installmentAmount")
          .setErrors(Validators.min);
      }
  }
  setMinimumInstallmentValues(id) {
    if (id < this.minmunInstallment.length) {
      this.minmunInstallment[id + 1] = (<FormArray>(
        this.sendOfferForm.get("installments")
      )).value[id].installmentDue;
    }
  }

  FillfilldatArray: any = [];

  SaveFullfil() {
    this.offerConditions.forEach((element) => {
      let isfullfill = $("#oc_" + element.conditionOfferId + "").is(":checked");
      let conditionid = element.conditionOfferId;

      this.FillfilldatArray.push({
        ConditionOfferId: conditionid,
        IsFullfil: isfullfill,
      });
    });

    let inputdata = {
      OfferConditiondata: this.FillfilldatArray,
    };
    this.offerService.savefullfil(inputdata).subscribe(
      (res) => {
        if (res.status) {
          this.toastr.SuccessToastr("Offer condition status updated");
          this.conditionmodelshow.close();
          if (res.data.isAllFullFill) {
            this.alerts
              .ComfirmAlert("Does this applicant requires visa?", "Yes", "No")
              .then((res) => {
                if (res.isConfirmed) {
                  this.IsVisa = true;
                  $("#loader").show();
                  var visainput = {
                    statusId: 1,
                    applicationId: this.StoreApplicationId,
                  };
                  var visa = this.visaService.ChangeVisaStatus(visainput);
                  var needVisa = this.applicationService.AddVisaStudentStatus(
                    this.StoreApplicationId,
                    this.IsVisa
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
                    applicationId: this.StoreApplicationId,
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
          }
        } else {
          this.toastr.ErrorToastr(res.message);
        }
      },
      (err: any) => {
        this.toastr.SuccessToastr("Something went wrong");
      }
    );
  }

  getStudentOffer() {
    $("#loader").show();
    let input = {
      applicationId: this.StoreApplicationId,
    };
    this.offerService.getOfferDetail(input).subscribe((res) => {
      
      if (res.status) {
        
        this.previousOffer = res.data.map((m) => m.applicationOfferDetail);
        this.previousOffer = this.previousOffer.filter(
          (m) =>
            m.applicationOfferId != this.OfferDetailModel.applicationOfferId
        );
      } else {
        this.toastr.ErrorToastr("Something went wrong");
      }
      $("#loader").hide();
    });
  }

  getFinanceList() {
    let input = {
      applicationId: this.StoreApplicationId,
    };
    this.depositService.GetInstallmentsByApplication(input).subscribe(
      (res) => {
        this.installmentList = res.data;
      },
      (err: any) => {
        this.toastr.ErrorToastr("Something went wrong");
      }
    );
  }
  GetAllReceipt(ApplicationId, installmentNo, installmentType) {
    var input = {
      applicationId: ApplicationId,
      installmentNo: installmentNo == 0 ? null : installmentNo,
    };
    this.depositService.getReceiptUrls(input).subscribe(
      (res) => {
        if (res.status) {
          this.PaymentReceipts = res.data;
          this.modalTitle = installmentType;
          this.modalService.open(this.ReceiptView, {
            ariaLabelledBy: "modal-basic-title",
          });
        }
      },
      (err: any) => {
        this.toastr.ErrorToastr("Something went wrong");
      }
    );
  }

  
  UploadReceipt(installmentNo: any) {
    //this.UploadDepositReceiptForm.reset();
    this.UploadDepositReceiptForm.get("applicationId").setValue(
      this.StoreApplicationId
    );
    console.log("this.UploadDepositReceiptForm.get(installmentId): ", installmentNo);
    this.UploadDepositReceiptForm.get("installmentId").setValue(installmentNo);
    this.uploadModal = this.modalService.open(this.UploadReceiptModal, {
      ariaLabelledBy: "modal-basic-title",
    });
  }
  uploadDepositeReceipt() {
    if (this.UploadDepositReceiptForm.valid) {
      $("#loader").show();
      let formInput = this.UploadDepositReceiptForm.getRawValue();
      console.log("Installment: ", formInput.installmentId);
      let input = {
        ...formInput,
        fileUploadedUrl: this.base64File,
        fileName: this.base64FileName,
        docId: 4,
      };
      
      
      this.offerService.addDepositeOffered(input).subscribe((res) => {
        if (res.status) {
          this.toastr.SuccessToastr("Document Uploaded successfully");
          this.setmetgroupindex(3);
          this.uploadModal.close();
          this.UploadDepositReceiptForm.reset();
          this.UploadDepositReceiptForm.get("applicationId").setValue(
            this.StoreApplicationId
          );
          this.UploadDepositReceiptForm.get("installmentId").setValue(0);
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
        $("#loader").hide();
      });
    }
  }
  
  visastatusData: any;
  AfterStatusvalue: any;
  fileName = "";

  loadform() {
    let input = {
      applicationId: this.StoreApplicationId,
    };
    $("#loader").show();
    let visastatus = this.visaservices.GetVisaHistory(input);
    let visadetails = this.visaservices.GetVisaDetails(input);
    forkJoin([visastatus, visadetails]).subscribe((result) => {
      if (result[0]) {
        if (result[0].status) {
          this.visastatusData = result[0].data;
        } else {
          this.toastr.ErrorToastr(result[0].message);
        }
      }
      if (result[1]) {
        if (result[1].status) {
          this.visadetailsData = result[1].data.visaDetail;
          if (result[1].data.visaDetail == null) {
            this.firsttimecheck == true;
            // this.Statusvalue = 0;
            this.changestatuss(1);
          } else {
            this.changestatuss(this.visadetailsData?.visaStatus);
            this.firsttimecheck = false;
            this.Visaform.get("statusId")?.setValue(
              this.visadetailsData?.visaStatus
            );
            this.Visaform.get("applicationUrl")?.setValue(
              this.visadetailsData?.visaApplicationUrl
            );
            if (this.visadetailsData?.visaStatus == 1) {
              this.Visaform.get("statusDate")?.setValue(
                moment(this.visadetailsData?.createdDate).format("YYYY-MM-DD")
              );
              this.Statusvalue = 1;
              this.AfterStatusvalue = 2;
            } else if (this.visadetailsData?.visaStatus == 2) {
              this.Visaform.get("statusDate")?.setValue(
                moment(this.visadetailsData?.updatedDate).format("YYYY-MM-DD")
              );
              this.Statusvalue = 2;
              this.AfterStatusvalue = 3;
            } else if (this.visadetailsData?.visaStatus == 3) {
              this.Visaform.get("statusDate")?.setValue(
                moment(this.visadetailsData?.grantedAt).format("YYYY-MM-DD")
              );
              this.Statusvalue = 3;
              this.AfterStatusvalue = 4;
            } else if (this.visadetailsData?.visaStatus == 4) {
              this.Visaform.get("statusDate")?.setValue(
                moment(this.visadetailsData?.rejectAt).format("YYYY-MM-DD")
              );
              this.Statusvalue = 4;
              this.AfterStatusvalue = 5;
            } else if (this.visadetailsData?.visaStatus == 5) {
              this.Visaform.get("statusDate")?.setValue(
                moment(this.visadetailsData?.rejectAt).format("YYYY-MM-DD")
              );
              this.Statusvalue = 5;
              this.AfterStatusvalue = 2;
            }

            //this.Visaform.get("reason")?.setValue(this.visadetailsData?.reason);
            this.Visaform.get("fileName")?.setValue(
              this.visadetailsData?.fileUrl
            );
            this.fileName = this.getFileName(this.visadetailsData?.fileUrl);
          }
        } else {
          this.toastr.ErrorToastr(result[1].message);
        }
      }

      $("#loader").hide();
    });
  }
  saveVisaform() {
    this.isSubmitted = true;

    if (this.Visaform.valid) {
      $("#loader").show();
      let formVal = JSON.stringify(this.Visaform.getRawValue());
      let serviceInput = {
        ...JSON.parse(formVal),
        fileName: this.base64FileName,
        applicationId: this.StoreApplicationId,
      };

      if (serviceInput.statusId == 1) {
        this.Visaform.get("statusDate")?.clearValidators();
        this.Visaform.get("reason")?.clearValidators();
        this.Visaform.get("fileContent")?.clearValidators();
        this.Visaform.updateValueAndValidity();
        // this.Visaform.get("applicationUrl")?.addValidators(Validators.required);
        this.Visaform.get("applicationUrl");
      }

      console.log("saveVisaform Request - serviceInput", serviceInput);

      let saveVisaformFormData = new FormData();

      saveVisaformFormData.append("applicationId", serviceInput.applicationId);
      saveVisaformFormData.append(
        "applicationUrl",
        serviceInput.applicationUrl
      );
      saveVisaformFormData.append("reason", serviceInput.reason);
      saveVisaformFormData.append("statusDate", serviceInput.statusDate);
      saveVisaformFormData.append("statusId", serviceInput.statusId);

      if (this.selectedFile) {
        saveVisaformFormData.append(
          "PDF",
          this.selectedFile,
          this.selectedFile.name
        );
      }

      this.visaservices
        .ChangeVisaStatus(saveVisaformFormData)
        .subscribe((res) => {
          if (res.status) {
            this.toastr.SuccessToastr("Visa Status Changed successfully");
            this.loadform();
            this.setmetgroupindex(5);
          } else {
            this.toastr.ErrorToastr("Something went wrong");
          }
          $("#loader").hide();
        });
    }
  }

  filevalid: false;

  SelectVisa(event: any) {
    const file = event.target.files[0];
    if (this.filevalidation.checkFileType(event.target.files)) {
      const reader = new FileReader();
      reader.onloadend = this._handleReaderLoadedd.bind(this);
      reader.readAsDataURL(file);

      this.base64FileName = file.name;
    } else this.filevalid = false;
  }

  CaseWithdrown(SandApplicationId: any) {
    let input = {
      ApplicationId: SandApplicationId,
    };
    this.alerts
      .ComfirmAlert("Are you sure you want to withdrawn CAS?", "Yes", "No")
      .then((res) => {
        if (res.isConfirmed) {
          this.CsaService.CaseWithdrown(input).subscribe((res) => {
            if (res.status) {
              this.toastr.SuccessToastr("CAS withdrawn successfully");
              this.BindCasDocument();
            } else {
              this.toastr.ErrorToastr("Something went wrong");
            }
            $("#loader").hide();
          });
        }
      });
  }

  _handleReaderLoadedd(e: any) {
    let reader = e.target;
    var base64result = reader.result.substr(reader.result.indexOf(",") + 1);
    this.base64File = base64result;
    this.Visaform.get("fileContent").setValue(this.base64File);
  }

  Inquiries: any;
  matchedInquiry: any;
  inquiryModal: any;
  Ismatched = false;
  InquiryLinkUnLink(applicationId: any, inquiryId: any) {
    let alertMessage = "";
    if (inquiryId > 0) {
      alertMessage = "Do you want to unlink the inquiry to this application?";
    }
    if (inquiryId < 1) {
      alertMessage = "Do you want to link the inquiry to this application?";
    }
    this.alerts.ComfirmAlert(alertMessage, "Yes", "No").then((res) => {
      if (res.isConfirmed) {
        if (inquiryId > 0) {
          this.LinkInquiryForm.controls.applicationId.setValue(applicationId);
          this.LinkInquiryForm.controls.link.setValue(false);
          this.LinkInquiryToApplication();
        } else if (inquiryId < 1) {
          $("#loader").show();
          let input = {
            applicationId: applicationId,
            email: null,
          };
          this.applicationService.FetchInquiries(input).subscribe((res) => {
            if (res.status) {
              this.Inquiries = res.data;
              this.Inquiries.forEach((element) => {
                if (element.isMatched == true) {
                  this.matchedInquiry = element.inquiryId;
                  this.Ismatched = true;
                }
                element.firstName = element.firstName + " " + element.lastName;
              });
              this.LinkInquiryForm.controls.applicationId.setValue(
                applicationId
              );
              this.LinkInquiryForm.controls.link.setValue(true);
              this.LinkInquiryForm.controls.inquiryId.addValidators(
                Validators.required
              );
              this.LinkInquiryForm.controls.inquiryId.updateValueAndValidity();
              this.inquiryModal = this.modalService.open(this.LinkInquiry, {
                ariaLabelledBy: "modal-basic-title",
              });
            } else {
              this.toastr.ErrorToastr("Something went wrong");
            }
            $("#loader").hide();
          });
        }
      }
    });
  }

  LinkInquiryToApplication() {
    if (this.LinkInquiryForm.valid) {
      $("#loader").show();
      if (this.Ismatched == false) {
        if (this.LinkInquiryForm.controls.inquiryId.value > 0) {
          this.alerts
            .ComfirmAlert(
              "Are you sure you want to link the inquiry to this application? ",
              "Yes",
              "No"
            )
            .then((res) => {
              if (res.isConfirmed) {
                var input = JSON.parse(
                  JSON.stringify(this.LinkInquiryForm.getRawValue())
                );
                this.applicationService.LinkUnlinkInquiry(input).subscribe(
                  (res) => {
                    if (res.status) {
                      this.toastr.SuccessToastr("Inquiry Linked Successfully");
                      this.LinkInquiryForm.reset();
                      this.LinkInquiryForm.controls.inquiryId.removeValidators(
                        Validators.required
                      );
                      this.LinkInquiryForm.controls.inquiryId.updateValueAndValidity();
                      this.inquiryModal.close();
                      this.setmetgroupindex(0);
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
          var input = JSON.parse(
            JSON.stringify(this.LinkInquiryForm.getRawValue())
          );
          this.applicationService.LinkUnlinkInquiry(input).subscribe(
            (res) => {
              if (res.status) {
                this.toastr.SuccessToastr("Inquiry Unlinked Successfully");
                this.LinkInquiryForm.reset();
                this.inquiryModal.close();
                this.setmetgroupindex(0);
              } else {
                this.toastr.ErrorToastr(res.message);
              }
            },
            (err: any) => {
              this.toastr.ErrorToastr("Something went wrong");
            }
          );
        }
      } else {
        var input = JSON.parse(
          JSON.stringify(this.LinkInquiryForm.getRawValue())
        );
        this.applicationService.LinkUnlinkInquiry(input).subscribe(
          (res) => {
            if (res.status) {
              if (this.LinkInquiryForm.controls.inquiryId.value > 0) {
                this.toastr.SuccessToastr("Inquiry Linked Successfully");
              } else {
                this.toastr.SuccessToastr("Inquiry Unlinked Successfully");
              }
              this.LinkInquiryForm.reset();
              this.inquiryModal.close();
            } else {
              this.toastr.ErrorToastr(res.message);
            }
          },
          (err: any) => {
            this.toastr.ErrorToastr("Something went wrong");
          }
        );
      }
      this.setmetgroupindex(0);
      $("#loader").hide();
    }
  }

  isSubmitteds: any = false;
  VisaLinkDataList: any;
  VisaLinkDataListLastRecord: any;

  GetLink() {
    let Input = {
      ApplicationId: this.StoreApplicationId,
    };
    this.applicationService.GetLinkVisa(Input).subscribe(
      (res) => {
        if (res.status) {
          this.VisaLinkDataList = res.data;
          this.VisaLinkDataListLastRecord =
            this.VisaLinkDataList[this.VisaLinkDataList.length - 1];
          this.isSubmitteds = false;
          this.CasLinkModel.reset();
        } else {
          this.toastr.ErrorToastr(res.message);
        }
      },
      (err: any) => {
        this.toastr.ErrorToastr("Something went wrong");
      }
    );
  }

  SaveLink() {
    this.isSubmitteds = true;
    if (this.CasLinkModel.valid) {
      var input = JSON.parse(JSON.stringify(this.CasLinkModel.getRawValue()));
      let inputdata = {
        ApplicationId: this.StoreApplicationId,
        Link: input.CasLink,
        VisaId: 0,
      };
      this.applicationService.SaveLinkVisa(inputdata).subscribe(
        (res) => {
          if (res.status) {
            this.isSubmitteds = false;
            this.toastr.SuccessToastr("Visa Link Added Successfully");
            this.CasLinkModel.reset();
            this.GetLink();
          } else {
            this.toastr.ErrorToastr(res.message);
          }
        },
        (err: any) => {
          this.toastr.ErrorToastr("Something went wrong");
        }
      );
    }
  }

  IsCoditionoffer: any = true;
  IsConditionchanges: any = false;
  onChangeCondition(e) {
    var selectedids = this.AddConditionForm.controls.conditions.value;
    if (e.target.checked) {
      this.IsCoditionoffer = false;
      selectedids.push(parseInt(e.target.value));
    } else {
      this.IsCoditionoffer = false;
      var index = selectedids.findIndex((m) => m == parseInt(e.target.value));
      selectedids.splice(index, 1);
    }
    this.AddConditionForm.controls.conditions.setValue(selectedids);
  }
  StoreOfferConditionid: any;
  onChangeOfferCondition(e) {
    this.IsConditionchanges = true;
    var selectedids = this.sendOfferForm.controls.conditions.value;
    var tempArray = [];
    if (!Array.isArray(selectedids)) {
      if (selectedids) tempArray.push(parseInt(selectedids));
    } else tempArray = selectedids;
    if (e.target.checked) {
      tempArray.push(parseInt(e.target.value));
    } else {
      var index = tempArray.findIndex((m) => m == parseInt(e.target.value));
      tempArray.splice(index, 1);
    }
    this.totalCondition = tempArray.length;
    this.StoreOfferConditionid = tempArray;
    this.sendOfferForm.controls.conditions.setValue(tempArray);
  }
  isChecked(id) {
    var selectedids = this.AddConditionForm.controls.conditions.value;

    return selectedids?.findIndex((m) => m == id) >= 0;
  }
  isOfferConditionChecked(id) {
    var selectedids = this.sendOfferForm.controls.conditions.value;

    return selectedids?.findIndex((m) => m == id) >= 0;
  }

  isoffercodition(id) {
    this.storeoferId = this.offerId;
    var selectedids = this.AddConditionForm.controls.conditions.value;

    return selectedids?.findIndex((m) => m == id) >= 0;
  }
  // downloadOfferLetter() {
  //   const applicationId = this.StoreApplicationId; // Replace with the actual application ID
  //   this.applicationService.downloadOfferLetter(applicationId).subscribe(
  //     (res) => {
  //       const blob = new Blob([res], { type: 'application/pdf' });
  //       saveAs(blob, 'OfferLetter.pdf');
  //     },
  //     (err) => {
  //       console.error('Error downloading the offer letter', err);
  //       // this.toastr.error('Error downloading the offer letter.');
  //     }
  //   );
  // }
  downloadFile() {
    this.applicationService
      .downloadOfferLetter(this.FullPathWordDocument)
      .subscribe(
        (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = this.wordDocument; //'MuhammadRizwan_offer test'; // Set the default filename for download
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        },
        (error) => {
          console.error("Error downloading the file", error);
        }
      );
  }
  onFileSelected(event: any): void {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;

    this.selectedFiles = null;
    this.fileInputInvalid = false;

    if (files.length === 0) {
      this.fileInputInvalid = true;
      inputElement.value = "";
      return;
    }
    let valid = true;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileType = file.type;

      if (fileType !== "application/pdf") {
        valid = false;
        break;
      }
    }
    if (valid) {
      this.selectedFiles = files;
      this.toastr.SuccessToastr("Successfully selected PDF file(s).");
      this.fileInputInvalid = false;
    } else {
      inputElement.value = "";
      inputElement.type = "";
      inputElement.type = "file";
      this.fileInputInvalid = true;
      this.toastr.ErrorToastr("Error: Only PDF files are allowed");
    }
  }

  onButtonClick() {
    console.log("Button was clicked!");
  }

  triggerButtonClick() {
    if (this.myButton) {
      this.myButton.nativeElement.click();
    } else {
      console.log("Button not found");
    }
  }

  uploadFiles(): void {
    // Reset validation states
    this.fileInputInvalid = false;
    this.wordFileInputInvalid = false;

    // Check if PDF file is selected
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      this.fileInputInvalid = true;
      this.toastr.ErrorToastr("Please select a PDF file before uploading.");
      return;
    }

    // Check if Word file is selected (optional, so no error if not selected)
    if (this.selectedWordFiles && this.selectedWordFiles.length > 0) {
      const wordFile = this.selectedWordFiles[0];

      // Ensure the wordFile is valid (if it's already validated, this might not be necessary)
      const fileType = wordFile.type;
      if (
        !fileType.match(
          /application\/(msword|vnd.openxmlformats-officedocument.wordprocessingml.document)/
        )
      ) {
        this.wordFileInputInvalid = true;
        this.toastr.ErrorToastr("Error: Only Word files are allowed.");
        return;
      }
    }
    for (let i = 0; i < this.selectedFiles.length; i++) {
      const file = this.selectedFiles[i];

      console.log("Application ID for File upload: ", this.StoreApplicatoinId);

      let input = {
        id: this.StoreApplicatoinId,
      };

      // let GetOfferDetail = this.applicationService
      //   .GetOfferDetail(input)
      //   .subscribe((sammi) => {
      //     console.log("sammi", sammi);
      //   });

      this.OfferDetailRefrech();

      this.applicationService
        .upload(file, this.StorewordFile, this.StoreApplicatoinId)
        .subscribe(
          (response) => {
            console.log("Response URL", response);
            this.toastr.SuccessToastr("File uploaded successfully.");
            this.pdf_document = response.result.pdf_Document;

            this.OfferDetailModel.offerLetterUrl = this.pdf_document;

            // sammi
            this.triggerButtonClick();

            console.log(this.pdf_document, "pdf_document");
            // this.word_document = response.word_document;
            //console.log(this.word_document,"word_document");
          },
          (error) => {
            console.error(error);
            this.toastr.ErrorToastr("Error uploading file.");
          }
        );
    }
  }

  onWordFileSelected(event: any): void {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;

    this.selectedWordFiles = null;
    this.wordFileInputInvalid = false;

    if (files.length === 0) {
      this.wordFileInputInvalid = true;
      inputElement.value = "";
      return;
    }

    let valid = true;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.StorewordFile = file;
      const fileType = file.type;

      if (
        !fileType.match(
          /application\/(msword|vnd.openxmlformats-officedocument.wordprocessingml.document)/
        )
      ) {
        valid = false;
        break;
      }
    }

    if (valid) {
      this.selectedWordFiles = files;
      this.toastr.SuccessToastr("Successfully selected Word file(s).");
      this.wordFileInputInvalid = false;
    } else {
      inputElement.value = "";
      inputElement.type = "";
      inputElement.type = "file";
      this.wordFileInputInvalid = true;
      this.toastr.ErrorToastr("Error: Only Word files are allowed.");
    }
  }

  onFile(event: any): void {
    const file: File = event.target.files[0];
    this.selectedFile = file;
    console.log("Selected file", this.selectedFile);
    if (file) {
      if (file.type === "application/pdf") {
        this.selectedFile = file;
        console.log("Successfully selected file");
      } else {
        console.log("This is the wrong file type. Please select a PDF.");
        event.target.value = ""; // Clear the file input
      }
    }
  }
  downloadPdf(url, fileName) {
    console.log("url->", url);

    let admin_url = this.appConfig.baseServiceUrl + url;

    this.applicationService.downloadOfferLetter(admin_url).subscribe(
      (blob: Blob) => {
        if (blob.size > 0) {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = fileName; // Set the default filename for download
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } else {
          console.error("The downloaded file is not a valid PDF");
        }
      },
      (error) => {
        console.error("Error downloading the file", error);
      }
    );
  }
  // Method to open the modal
  // Method to open the modal
  open(content: TemplateRef<any>) {
    this.modalService.open(content);
  }


  waitOnView(){
    setTimeout(() => {
      console.log('This message is shown after 5 seconds');
    }, 5000); 
  }
  // Method to close the modal
  closeOfferModal() {
    if (this.uploadOfferModal) {
      this.modalService.dismissAll();
    } else {
      console.error("Modal element is not initialized or found");
    }
  }
  ReIssueCasFile() {
    console.log("Re-Issue button clicked");
    this.showCasForm = true;
    this.isFormSubmittedSuccessfully = false;  // Show the form again
    this.isFirstTimeShownForm = false;  // No longer the first time
    this.submissionStatus[this.StoreApplicatoinId] = false;
    this.isSubmitted = false; // Reset submission state if needed
    this.CsaIssueFileForm.reset();  // Reset the form if required
    this.Storeimage = ""; // Clear the uploaded file
    //console.log("isFormSubmittedSuccessfully",this.isFormSubmittedSuccessfully);
   
}
}
