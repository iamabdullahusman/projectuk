import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { EmittService } from "src/app/Services/emitt.service";
import { AppConfig } from "src/app/appconfig";
import {
  ApplicationOfferDetail,
  EmailedDocuments,
  OfferDetail,
  RequestedDocuments,
  StudentOffer,
} from "../Model/student-offer.model";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AlertServiceService } from "src/app/Services/alert-service.service";
import { SessionStorageService } from "src/app/Services/session-storage.service";
import { ToastrServiceService } from "src/app/Services/toastr-service.service";
import { DownloadfileService } from "src/app/Services/downloadfile.service";
import { DocumentService } from "src/app/Services/document.service";
import { FileValidationService } from "src/app/Services/file-validation.service";
import { forkJoin } from "rxjs";
import { ApplicationOfferService } from "src/app/Services/application-offer.service";
import { AccountService } from "src/app/Services/account.service";
import { OFFERTYPE, OFFERTYPECLASS } from "./offer-type";
@Component({
  selector: "app-offer",
  templateUrl: "./offer.component.html",
  styleUrls: ["./offer.component.sass"],
})
export class OfferComponent implements OnInit {
  offerType = OFFERTYPE;
  offerTypeClass = OFFERTYPECLASS;
  name = "Set iframe source";
  url: string = "https://angular.io/api/router/RouterLink";
  urlSafe: SafeResourceUrl;
  hostUrl: string = "";
  OfferRejectDroupDownData: any;
  base64FileName: any;
  permissionMessageImage = false;
  base64File: any;
  fileUrl: any;
  offerConditions = [];
  CampusData: any;
  CourseData: any;
  isReSubmitFormSubmitted = false;
  isValidFile = true;
  applicationId: number = 0;
  userType: any;
  studentName: any;
  BaseUrl: any;
  IsTermAndCondition: boolean = false;
  tacDocid = 0;
  studentOfferDetail: StudentOffer;
  studentRequestedDocument: RequestedDocuments[];
  studentOffer: OfferDetail;
  applicationOfferDetail: ApplicationOfferDetail;
  emailedDocuments: EmailedDocuments[];

  // base64 variables
  FileUploadedUrlTandC: string = "";
  FileUploadedUrlTandCFileName: string = "";
  FileUploadedUrlReceipt: string = "";

  //form variables
  ShowOffer: boolean = true;

  //form variables
  isModelSubmitted: boolean = false;
  isDeferModelSubmitted: boolean = false;
  isTandCSubmitted: boolean = false;
  isDepositReceiptSubmitted: boolean = false;

  //modal variables
  modalTitle: string = "";
  modalTitleClass: string = "";
  intakeData: any[];
  selectedIntake: any = null;
  selectedCourse: any = null;
  selectedCampuse: any = null;

  // button hide variables
  hideDeclineBtn = false;
  hideAcceptedBtn = false;
  hideDeferBtn = false;
  hasOffer: any;
  haseVisa: any;
  hasDepositFees: any;
  @ViewChild("OfferConditionModal") OfferConditionModal: ElementRef;
  @ViewChild("documentModel") documentModel: ElementRef;
  offerUrl: string = "";
  intakeId: any;
  campusId: any;
  courseId: any;
  // forms
  UploadTandCForm: FormGroup = new FormGroup({
    TandCDocument: new FormControl(),
  });

  UploadDepositReceiptForm: FormGroup = new FormGroup({
    dReceipt: new FormControl(),
  });

  OfferModelForm: FormGroup = new FormGroup({
    offerType: new FormControl(),
    comment: new FormControl(),
    reasonComment: new FormControl(),
  });

  DeferOfferModelForm: FormGroup = new FormGroup({
    intakeId: new FormControl(),
    campusId: new FormControl(),
    courseId: new FormControl(),
    comment: new FormControl(),
  });

  DeferOfferForm: FormGroup = new FormGroup({
    intakeId: new FormControl(),
    campusId: new FormControl(),
    courseId: new FormControl(),
    comment: new FormControl(),
    offerType: new FormControl(),
  });

  uploadDocumentForm: FormGroup = new FormGroup({
    documentFile: new FormControl(),
    docId: new FormControl(),
    applicationId: new FormControl(),
  });

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private alerts: AlertServiceService,
    private sessionService: SessionStorageService,
    private toastr: ToastrServiceService,
    private emittService: EmittService,
    private offerService: ApplicationOfferService,
    private AccountService: AccountService,
    private appConfig: AppConfig,
    public sanitizer: DomSanitizer,
    private session: SessionStorageService,
    private emitService: EmittService,
    private downloadService: DownloadfileService,
    private fileService: DocumentService,
    private fileValidation: FileValidationService
  ) {
    this.buildDeferForm();
    this.applicationId = parseInt(this.session.getUserApplicationId());
    this.UploadTandCForm = formBuilder.group({
      TandCDocument: ["", [Validators.required]],
    });
    BaseUrl: this.appConfig.baseServiceUrl;
    this.UploadDepositReceiptForm = formBuilder.group({
      dReceipt: ["", [Validators.required]],
    });
    this.uploadDocumentForm = formBuilder.group({
      applicationId: ["0"],
      docId: ["0"],
      documentFile: ["", [Validators.required]],
    });
    this.DeferOfferModelForm = formBuilder.group({
      intakeId: [0, [Validators.required]],
      offerType: [0],
      campusId: [0],
      courseId: [0],
      comment: ["", [Validators.required]],
    });

    this.OfferModelForm = formBuilder.group({
      comment: ["", [Validators.required]],
      offerType: ["0"],
      reasonComment: [],
    });
  }

  get fReceipt() {
    return this.UploadDepositReceiptForm.controls;
  }

  get fTandC() {
    return this.UploadTandCForm.controls;
  }

  get fDefer() {
    return this.DeferOfferModelForm.controls;
  }

  get fDeferOffer() {
    return this.DeferOfferForm.controls;
  }
  get fModal() {
    return this.OfferModelForm.controls;
  }

  ngOnInit(): void {
    this.getStudentOffer();
    this.UpdateAssigntaskList();
  }

  applicationFutureIntakes: any;
  getDeferOfferIntakes() {
    if (!this.campusId && !this.intakeId && !this.courseId) {
      $("#loader").show();
      let input = {
        applicationId: this.applicationId,
      };
      this.offerService.getCampusCourseIntakeById(input).subscribe((res) => {
        if (res) {
          if (res.status) {
            this.campusId = res.data.campusId;
            this.courseId = res.data.courseId;
            this.intakeId = res.data.intakeId;
            let courseInput = {
              campusId: this.campusId,
            };
            let getDeferintakes =
              this.offerService.getIntakeOfDeferOffer(input);
            let getCampus = this.offerService.getCampus();
            let getCourse = this.offerService.getCoursesByCampus(courseInput);
            forkJoin([getDeferintakes, getCampus, getCourse]).subscribe(
              (result: any) => {
                if (result[0]) {
                  if (result[0].status) {
                    this.intakeData = result[0].data;
                  } else {
                    this.toastr.ErrorToastr("Something went wrong");
                  }
                }
                if (result[1]) {
                  if (result[1].status) {
                    this.CampusData = result[1].data;
                  } else {
                    this.toastr.ErrorToastr("Something went wrong");
                  }
                }
                if (result[2]) {
                  if (result[2].status) {
                    this.CourseData = result[2].data.records;
                  } else {
                    this.toastr.ErrorToastr("Something went wrong");
                  }
                }
                $("#loader").hide();
              }
            );
          } else {
            this.toastr.ErrorToastr("Something went wrong");
          }
        }
      });
    }
  }

  buildDeferForm() {
    this.DeferOfferForm = this.formBuilder.group({
      intakeId: [0, [Validators.required]],
      offerType: [3],
      campusId: [0],
      courseId: [0],
      comment: ["", [Validators.required]],
    });

    this.DeferOfferForm.get("campusId").valueChanges.subscribe((m) => {
      if (m) {
        this.campusId = m;
        let courseInput = {
          campusId: m,
        };
        this.offerService
          .getCoursesByCampus(courseInput)
          .subscribe((result) => {
            if (result.status) {
              this.CourseData = result.data.records;
            } else {
              this.toastr.ErrorToastr("Something went wrong");
            }
          });
      }
    });
  }
  isRejectOther: boolean = false;
  CheckReasonStatus(data) {
    if (data == "Other") {
      this.isRejectOther = true;
      this.OfferModelForm.get("reasonComment").addValidators(
        Validators.required
      );
    } else {
      this.isRejectOther = false;
      this.OfferModelForm.get("reasonComment").setValue("");
      this.OfferModelForm.get("reasonComment").clearValidators();
      this.OfferModelForm.get("reasonComment").updateValueAndValidity();
    }
  }
  isIntake = false;
  isCourse = false;
  isCampus = false;
  isComment = false;

  ChengeOption(data) {
    this.DeferOfferModelForm.reset();
    if (data == 1) {
      this.DeferOfferModelForm.get("offerType").setValue(3);
      this.isIntake = true;
      this.isCampus = false;
      this.isCourse = false;
      this.isComment = true;
      this.DeferOfferModelForm.get("campusId").clearValidators();
      this.DeferOfferModelForm.get("courseId").clearValidators();
      this.DeferOfferModelForm.get("intakeId").addValidators(
        Validators.required
      );
      this.DeferOfferModelForm.get("campusId").updateValueAndValidity();
      this.DeferOfferModelForm.get("courseId").updateValueAndValidity();
      this.DeferOfferModelForm.get("intakeId").updateValueAndValidity();
    } else if (data == 2) {
      this.DeferOfferModelForm.get("offerType").setValue(3);
      this.isCampus = true;
      this.isIntake = false;
      this.isCourse = false;
      this.isComment = true;
      this.DeferOfferModelForm.get("campusId").addValidators(
        Validators.required
      );
      this.DeferOfferModelForm.get("courseId").clearValidators();
      this.DeferOfferModelForm.get("intakeId").clearValidators();
      this.DeferOfferModelForm.get("campusId").updateValueAndValidity();
      this.DeferOfferModelForm.get("courseId").updateValueAndValidity();
      this.DeferOfferModelForm.get("intakeId").updateValueAndValidity();
    } else if (data == 3) {
      this.DeferOfferModelForm.get("offerType").setValue(3);
      this.isCourse = true;
      this.isCampus = false;
      this.isIntake = false;
      this.isComment = true;
      this.DeferOfferModelForm.get("campusId").clearValidators();
      this.DeferOfferModelForm.get("courseId").addValidators(
        Validators.required
      );
      this.DeferOfferModelForm.get("intakeId").clearValidators();
      this.DeferOfferModelForm.get("campusId").updateValueAndValidity();
      this.DeferOfferModelForm.get("courseId").updateValueAndValidity();
      this.DeferOfferModelForm.get("intakeId").updateValueAndValidity();
    } else if (data == 4) {
      this.DeferOfferModelForm.get("offerType").setValue(3);
      this.isIntake = true;
      this.isCourse = true;
      this.isCampus = false;
      this.isComment = true;
      this.DeferOfferModelForm.get("campusId").clearValidators();
      this.DeferOfferModelForm.get("courseId").addValidators(
        Validators.required
      );
      this.DeferOfferModelForm.get("intakeId").addValidators(
        Validators.required
      );
      this.DeferOfferModelForm.get("campusId").updateValueAndValidity();
      this.DeferOfferModelForm.get("courseId").updateValueAndValidity();
      this.DeferOfferModelForm.get("intakeId").updateValueAndValidity();
    }
  }
  storeApplicationOfferId = 0;
  openModal(content: any, id: any = 0, ApplicationOfferId: any = 0) {
    if (ApplicationOfferId != 0)
      this.storeApplicationOfferId = ApplicationOfferId;
    this.isModelSubmitted = false;
    this.isDeferModelSubmitted = false;
    this.isIntake = false;
    this.isCourse = false;
    this.isCampus = false;
    this.isComment = false;
    this.DeferOfferModelForm.reset();
    if (id == 1) {
      this.alerts
        .ComfirmAlert("Do you want to Decline Offer?", "Yes", "No")
        .then((res) => {
          if (res.isConfirmed) {
            this.OfferModelForm.reset();
            this.isRejectOther = false;
            this.isModelSubmitted = false;
            this.modalTitleClass = "text-danger";
            //this.modalTitle = "Offer Rejected";
            this.modalTitle = "Decline Offer";
            this.OfferModelForm.get("offerType").setValue(1);
            this.offerService.getOfferReason().subscribe((res) => {
              if (res.status) {
                this.OfferRejectDroupDownData = res.data;
              } else {
                this.toastr.ErrorToastr("Something went wrong");
              }
            });
            this.modalService.open(content, {
              ariaLabelledBy: "modal-basic-title",
              backdrop: false,
            });
          }
        });
    } else if (id == 2) {
      this.modalTitleClass = "text-success";
      this.modalTitle = "Offer Accepted";
      this.OfferModelForm.get("offerType").setValue(2);
      this.modalService.open(content, {
        ariaLabelledBy: "modal-basic-title",
        backdrop: false,
      });
    } else if (id == 3) {
      this.DeferOfferModelForm.get("offerType").setValue(3);
      this.modalTitleClass = "text-warning";
      this.modalTitle = "Offer Defer";
      this.offerService.getCampus().subscribe((res) => {
        if (res.status) {
          this.CampusData = res.data;
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
      });
      this.offerService.getCourse().subscribe((res) => {
        if (res.status) {
          this.CourseData = res.data;
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
      });
      this.modalService.open(content, {
        ariaLabelledBy: "modal-basic-title",
        backdrop: false,
      });
    }
  }

  StorePageRedirection = 0;
  redirectToDeferPage(id: any, ApplicationOfferId: any) {
    this.getDeferOfferIntakes();
    this.refraceDeferOfferPage();
    this.storeApplicationOfferId = ApplicationOfferId;
    this.StorePageRedirection = id;
    this.isHistoryPage = false;
    this.isDifferPage = true;
    this.isMainPage = false;
  }
  CancelDeferPage() {
    if (this.StorePageRedirection != 0) {
      this.isHistoryPage = true;
      this.isDifferPage = false;
      this.isMainPage = false;
    } else {
      this.isHistoryPage = false;
      this.isDifferPage = false;
      this.isMainPage = true;
    }
    this.StorePageRedirection = 0;
  }

  getStudentOffer() {
    $("#loader").show();
    let input = {
      applicationId: this.applicationId,
    };
    this.getOfferConditions(this.applicationId, false);
    this.userType = parseInt(this.sessionService.getUserType());

    if (this.userType > 5) {
      input.applicationId = parseInt(
        this.sessionService.getUserApplicationId()
      );
      this.studentName = this.sessionService.GetSessionForApplicationname();
      var userPermission = this.sessionService.getpermission();
      if (userPermission == "true") {
        this.offerService.getOfferDetail(input).subscribe((res) => {
          if (res.status) {
            this.modifiedStudentOfferData(res.data);
          } else {
            this.toastr.ErrorToastr("Something went wrong");
          }
          $("#loader").hide();
        });
      } else {
        this.permissionMessageImage = true;
        $("#loader").hide();
      }
    } else {
      console.log("getOfferDetail Request", input);

      this.offerService.getOfferDetail(input).subscribe((res) => {
        console.log("getOfferDetail Response: ", res);
        if (res.status) {
          if (
            res.data[0] &&
            res.data[0].applicationOfferDetail.offerType === 14
          ) {
            this.ShowOffer = false;
          }
          this.IsTermAndCondition = res.data[0].isSubmittedTermAndCondition;
          console.log("isTermAndCOndition", this.IsTermAndCondition);
          this.modifiedStudentOfferData(res.data);
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
        $("#loader").hide();
      });
    }
  }
  isDeferOfferPage: any = false;

  isMainPage: any = false;
  isHistoryPage: any = false;
  isDifferPage: any = false;

  MainData = [];
  modifiedStudentOfferData(Data: any) {
    this.MainData = Data;
    this.offerUrl =
      this.appConfig.baseServiceUrl +
      Data[0].applicationOfferDetail.offerLetterUrl;

    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.offerUrl);

    this.tacDocid = Data[0].docId;
    if (Data.length > 1) {
      //Waseem did length to 1 to show only single offer not all history
      Data.length = 1;
      Data.forEach((data) => {
        this.emailedDocuments = data.emailedDocuments;
        this.emailedDocuments.forEach((element) => {
          element.filePath = this.appConfig.baseServiceUrl + element.filePath;
        });
        //element.filePath = this.appConfig.baseServiceUrl + element.filePath;

        this.applicationOfferDetail = data.applicationOfferDetail;
        this.emailedDocuments = data.emailedDocuments;
        this.studentOffer = data.offerDetail;
        this.applicationOfferDetail = data.applicationOfferDetail;
        this.hideDeclineBtn = true;
        this.hideAcceptedBtn = true;
        this.hideDeferBtn = true;
        this.isDeferOfferPage = true;
        this.isHistoryPage = true;
        this.isDifferPage = false;
        this.isMainPage = false;
      });
    } else {
      this.isHistoryPage = false;
      this.isDifferPage = false;
      this.isMainPage = true;
      Data.forEach((data) => {
        this.studentRequestedDocument = data.requestedDocuments;
        this.emailedDocuments = data.emailedDocuments;
        this.studentOffer = data.offerDetail;
        this.applicationOfferDetail = data.applicationOfferDetail;
        if (this.applicationOfferDetail.offerType == 0) {
          //this.hideDeferBtn = true;
        } else if (this.applicationOfferDetail.offerType == 1) {
          this.hideDeclineBtn = true;
          this.hideAcceptedBtn = true;
          this.hideDeferBtn = true;
        } else if (this.applicationOfferDetail.offerType == 2) {
          this.hideDeclineBtn = true;
          this.hideAcceptedBtn = true;
          this.hideDeferBtn = false;
        } else if (this.applicationOfferDetail.offerType == 3) {
          this.hideDeclineBtn = true;
          this.hideAcceptedBtn = true;
          this.hideDeferBtn = true;
        } else if (this.applicationOfferDetail.offerType == 4) {
          this.hideDeclineBtn = true;
          this.hideAcceptedBtn = true;
          this.hideDeferBtn = true;
        } else if (this.applicationOfferDetail.offerType == 7) {
          this.hideDeclineBtn = false;
          this.hideAcceptedBtn = true;
          this.hideDeferBtn = false;
        } else if (this.applicationOfferDetail.offerType == 8) {
          this.hideDeclineBtn = true;
          this.hideAcceptedBtn = true;
          this.hideDeferBtn = true;
        } else if (this.applicationOfferDetail.offerType == 11) {
          this.hideDeclineBtn = true;
          this.hideAcceptedBtn = true;
          this.hideDeferBtn = true;
        } else if (this.applicationOfferDetail.offerType == 12) {
          this.hideDeclineBtn = true;
          this.hideAcceptedBtn = true;
          this.hideDeferBtn = true;
        } else if (
          this.applicationOfferDetail.offerType == 9 ||
          this.applicationOfferDetail.offerType == 10
        ) {
          this.hideDeclineBtn = true;
          this.hideAcceptedBtn = true;
          this.hideDeferBtn = true;
        }

        this.emailedDocuments.forEach((element) => {
          element.filePath = this.appConfig.baseServiceUrl + element.filePath;
        });

        this.offerUrl = this.emailedDocuments[0]?.filePath;
        // this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.offerUrl);
      });
    }
    // this.urlSafe = this.sanitizer.bypassSecurityTrustHtml(this.offerUrl);
  }

  UpdateAssigntaskList() {
    $("#loader").show();
    let inputs = {
      ApplicationId: 0,
    };
    this.userType = parseInt(this.sessionService.getUserType());
    if (this.userType > 5) {
      inputs.ApplicationId = parseInt(
        this.sessionService.getUserApplicationId()
      );
      this.studentName = this.sessionService.GetSessionForApplicationname();
      // var userPermission = this.sessionService.getpermission();
      // if (userPermission == "true") {
      this.AccountService.StudentSidebarSettings(inputs).subscribe((res) => {
        if (res.status) {
          this.hasOffer = res.data.hasOffer;
          this.haseVisa = res.data.hasVisa;
          this.hasDepositFees = res.data.hasDepositFees;
        }
        $("#loader").hide();
      });
      // }
      // else {
      //   this.permissionMessageImage = true;
      //   $('#loader').hide();
      // }
    } else {
      this.AccountService.StudentSidebarSettings(inputs).subscribe((res) => {
        if (res.status) {
          this.hasOffer = res.data.hasOffer;
          this.haseVisa = res.data.hasVisa;
          this.hasDepositFees = res.data.hasDepositFees;
        }
        $("#loader").hide();
      });
    }
  }

  downloadFile(url: any) {
    console.log(url);
    this.downloadService.DownloadFileWithBaseUrl(url).subscribe((res) => {
      let a = document.createElement("a");
      a.download = "";
      a.href = window.URL.createObjectURL(res);
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
    // var filename = this.getFileName(url);
    // const link = document.createElement('a');
    // link.setAttribute('target', '_blank');
    // link.setAttribute('type', 'hidden');
    // //link.setAttribute('href', this.appConfig.baseServiceUrl + url);
    // link.setAttribute('href', url);
    // link.setAttribute('download', filename);
    // document.body.appendChild(link);
    // link.click();
    // link.remove();
  }

  getFileName(str: any = "/defalut.pdf") {
    return str.substring(str.lastIndexOf("/") + 1);
  }

  redirectToDocumentPage() {
    this.router.navigate(["student/document"]);
  }

  uploadTandC() {
    this.isTandCSubmitted = true;
    $("#loader").show();
    if (this.UploadTandCForm.valid) {
      let input = {
        offerId: this.studentOffer.offerId,
        applicationOfferId: this.applicationOfferDetail.applicationOfferId,
        docId: 3,
        fileUploadedUrl: this.FileUploadedUrlTandC,
        fileName: this.FileUploadedUrlTandCFileName,
      };
      this.offerService.addOfferDocument(input).subscribe((res) => {
        if (res.status) {
          this.toastr.SuccessToastr("Document Uploaded successfully");
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
        $("#loader").hide();
      });
    }
  }

  uploadDepositeReceipt() {
    this.isDepositReceiptSubmitted = true;
    if (this.UploadDepositReceiptForm.valid) {
      $("#loader").show();
      let input = {
        offerId: this.studentOffer.offerId,
        applicationOfferId: this.applicationOfferDetail.applicationOfferId,
        docId: 4,
        fileUploadedUrl: this.FileUploadedUrlTandC,
        fileName: this.FileUploadedUrlTandCFileName,
      };
      this.offerService.addDepositeOffered(input).subscribe((res) => {
        if (res.status) {
          this.toastr.SuccessToastr("Document Uploaded successfully");
          window.location.reload();
          this.router.navigate(["student/offer"]);
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
        $("#loader").hide();
      });
    }
  }

  convertFileToBase64(event: any) {
    if (this.fileValidation.checkFileType(event.target.files)) {
      this.isValidFile = true;
      const file = event.target.files[0];
      this.base64FileName = file.name;
      const reader = new FileReader();
      reader.onloadend = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
      this.isReSubmitFormSubmitted = false;
    } else {
      this.isValidFile = false;
      this.uploadDocumentForm.get("documentFile")?.setValue("");
    }
  }

  _handleReaderLoaded(e: any) {
    let reader = e.target;
    var base64result = reader.result.substr(reader.result.indexOf(",") + 1);
    this.base64File = base64result;
  }

  onCancelClick(id: any) {
    if (id == 1) {
      this.isTandCSubmitted = false;
      this.UploadTandCForm.get("TandCDocument").setValue("");
      this.UploadTandCForm.reset(this.UploadTandCForm.value);
    } else if (id == 2) {
      this.isDepositReceiptSubmitted = false;
      this.UploadDepositReceiptForm.get("dReceipt").setValue("");
      this.UploadDepositReceiptForm.reset(this.UploadDepositReceiptForm.value);
    }
  }

  ConformValidtion(Status: any, ApplicationOfferId: any) {
    this.storeApplicationOfferId = ApplicationOfferId;
    let alertMessange = "";
    if (Status == 9) {
      alertMessange = "Do you want to continue with the same offer?";
    } else if (Status == 10) {
      alertMessange = "Are you sure to reject offer?";
    } else if (Status == 2) {
      alertMessange = "Are you sure to Accept offer?";
    } else if (Status == 4) {
      alertMessange = "Are you sure to withdraw offer?";
    } else if (Status == 12) {
      alertMessange = "Are you sure to Request offer?";
    } else if (Status == 13) {
      alertMessange = "Are you sure to offer Accept?";
    }
    if (Status == 2 && this.IsTermAndCondition == false) {
      this.uploadDocumentForm.get("docId").setValue(this.tacDocid);
      this.uploadDocumentForm.get("applicationId").setValue(this.applicationId);
      this.modalService.open(this.documentModel, {
        ariaLabelledBy: "modal-basic-title",
        backdrop: false,
      });
    } else if (Status == 9 || Status == 10 || Status == 4 || Status == 12) {
      this.alerts.ComfirmAlert(alertMessange, "Yes", "No").then((res) => {
        if (res.isConfirmed) {
          this.ChangeOfferStatus(Status);
        }
      });
    } else {
      this.alerts.ComfirmAlert(alertMessange, "Yes", "No").then((res) => {
        if (res.isConfirmed) {
          this.updateOfferStatus(Status);
        }
      });
    }
  }

  updateOfferStatus(offerType: any = 0) {
    $("#loader").show();
    this.isModelSubmitted = true;
    this.isDeferModelSubmitted = true;
    let formVal = JSON.stringify(this.OfferModelForm.getRawValue());
    let formValue = {
      ...JSON.parse(formVal),
    };
    if (formValue.reasonComment != "") {
      formValue.comment = formValue.reasonComment;
    }
    let input = {
      offerId: this.studentOffer.offerId,
      applicationOfferId: this.storeApplicationOfferId,
      comment: formValue.comment,
      offerType: parseInt(formValue.offerType.toString()),
    };
    if (offerType > 0) {
      input.offerType = offerType;
    }
    this.offerService.confirmOffer(input).subscribe((res) => {
      if (res.status) {
        $("#loader").hide();
        this.modalService.dismissAll();
        this.toastr.SuccessToastr(res.message);
        this.getStudentOffer();
      } else {
        this.toastr.ErrorToastr("Something went wrong");
      }
      $("#loader").hide();
    });
  }

  ChangeOfferStatus(offerType: any = 0) {
    $("#loader").show();
    let input = {
      ApplicationId: this.applicationId,
      OfferType: offerType,
      reason: "",
      applicationOfferId: this.storeApplicationOfferId,
    };
    this.offerService.DeferOfferStatusChange(input).subscribe((res) => {
      if (res.status) {
        this.modalService.dismissAll();
        this.toastr.SuccessToastr(res.message);
        this.getStudentOffer();
      } else {
        this.toastr.ErrorToastr("Something went wrong");
      }
      $("#loader").hide();
    });
  }

  updateDeferOfferStatus() {
    $("#loader").show();
    this.isModelSubmitted = true;
    this.isDeferModelSubmitted = true;
    if (this.DeferOfferModelForm.valid && this.changeCampusError == false) {
      let formVal = JSON.stringify(this.DeferOfferModelForm.getRawValue());
      let formValue = {
        ...JSON.parse(formVal),
      };
      if (formValue.campusId == null) formValue.campusId = 0;
      if (formValue.courseId == null) formValue.courseId = 0;
      if (formValue.intakeId == null) formValue.intakeId = 0;
      let input = {
        intakeId: formValue.intakeId,
        offerId: this.studentOffer.offerId,
        applicationOfferId: this.storeApplicationOfferId,
        comment: formValue.comment,
        offerType: parseInt(formValue.offerType.toString()),
        CampusId: formValue.campusId,
        CourseId: formValue.courseId,
      };
      this.offerService.confirmOffer(input).subscribe((res) => {
        if (res.status) {
          this.modalService.dismissAll();
          this.toastr.SuccessToastr(res.message);
          this.getStudentOffer();
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
        $("#loader").hide();
      });
    }
  }

  // new Defer Offer changes
  isAnyDeferOfferSelected = true;
  isDeferIntakeShow = false;
  isDeferCourseShow = false;
  isDeferCampusShow = false;
  isDeferOfferSubmitted = false;

  refraceDeferOfferPage() {
    this.isDeferOfferSubmitted = false;
    this.DeferOfferForm.reset();
    this.isDeferIntakeShow = false;
    this.DeferOfferForm.get("intakeId").clearValidators();
    this.isDeferCourseShow = false;
    this.DeferOfferForm.get("courseId").clearValidators();
    this.isDeferCampusShow = false;
    this.DeferOfferForm.get("campusId").clearValidators();
    this.DeferOfferForm.get("intakeId").updateValueAndValidity();
    this.DeferOfferForm.get("campusId").updateValueAndValidity();
    this.DeferOfferForm.get("courseId").updateValueAndValidity();
    this.isAnyDeferOfferSelected = true;
  }

  deferOfferSelectionCheckBox() {
    let intake = $("#isChangeIntakeChecked").is(":checked");
    let course = $("#isChangeCourseChecked").is(":checked");
    let campus = $("#isChangeCampusChecked").is(":checked");

    if (intake) {
      this.isDeferIntakeShow = true;
      this.DeferOfferForm.get("intakeId").addValidators(Validators.required);
    } else {
      this.isDeferIntakeShow = false;
      this.DeferOfferForm.get("intakeId").clearValidators();
    }

    if (course) {
      this.isDeferCourseShow = true;
      this.DeferOfferForm.get("courseId").addValidators(Validators.required);
    } else {
      this.isDeferCourseShow = false;
      this.DeferOfferForm.get("courseId").clearValidators();
    }

    if (campus) {
      this.isDeferCampusShow = true;
      this.DeferOfferForm.get("campusId").addValidators(Validators.required);
    } else {
      this.isDeferCampusShow = false;
      this.DeferOfferForm.get("campusId").clearValidators();
    }

    this.DeferOfferForm.get("intakeId").updateValueAndValidity();
    this.DeferOfferForm.get("campusId").updateValueAndValidity();
    this.DeferOfferForm.get("courseId").updateValueAndValidity();

    if (!intake && !campus && !course) {
      this.isAnyDeferOfferSelected = false;
    } else {
      this.isAnyDeferOfferSelected = true;
    }
  }

  storeOfferData: any;
  getOffer(OfferId: any) {
    var data = this.MainData.find(
      (m) => m.applicationOfferDetail.applicationOfferId == OfferId
    );
    let EmailData = "";
    let MailEmaildata = "";
    this.MainData.forEach((element) => {
      EmailData = element.emailedDocuments;
      if (EmailData.length != 0) MailEmaildata = element.emailedDocuments;
    });
    let inputdata = {
      Detail: data.applicationOfferDetail,
      Emaildocument: MailEmaildata,
    };
    this.emitService.OnChangeOfferId(inputdata);
  }

  updateDeferOffer() {
    this.isDeferOfferSubmitted = true;

    if (
      $("#isChangeIntakeChecked").is(":checked") ||
      $("#isChangeCourseChecked").is(":checked") ||
      $("#isChangeCampusChecked").is(":checked")
    ) {
      this.isAnyDeferOfferSelected = true;
    } else {
      this.isAnyDeferOfferSelected = false;
    }

    if (this.DeferOfferForm.valid && this.isAnyDeferOfferSelected) {
      $("#loader").show();
      let formVal = JSON.stringify(this.DeferOfferForm.getRawValue());
      let formValue = {
        ...JSON.parse(formVal),
      };
      if (formValue.campusId == null) formValue.campusId = 0;
      if (formValue.courseId == null) formValue.courseId = 0;
      if (formValue.intakeId == null) formValue.intakeId = 0;
      if (formValue.offerType == null) formValue.offerType = 3;
      let input = {
        intakeId: formValue.intakeId,
        offerId: this.studentOffer.offerId,
        applicationOfferId: this.storeApplicationOfferId,
        comment: formValue.comment,
        offerType: parseInt(formValue.offerType.toString()),
        CampusId: formValue.campusId,
        CourseId: formValue.courseId,
      };
      this.offerService.confirmOffer(input).subscribe((res) => {
        if (res.status) {
          this.modalService.dismissAll();
          this.toastr.SuccessToastr(res.message);
          this.getStudentOffer();
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
        $("#loader").hide();
      });
    }
  }

  getOfferConditions(OfferId, isOpenModal) {
    var input = {
      offerId: OfferId,
    };
    this.offerService.GetConditions(input).subscribe(
      (res) => {
        if (res.status) {
          this.offerConditions = res.data;
          if (isOpenModal)
            this.modalService.open(this.OfferConditionModal, {
              ariaLabelledBy: "modal-basic-title",
              backdrop: false,
            });
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
  uploadDocument() {
    this.isReSubmitFormSubmitted = true;
    if (this.uploadDocumentForm.valid) {
      this.alerts
        .ComfirmAlert("Do you want to upload document?", "Yes", "No")
        .then((res) => {
          if (res.isConfirmed) {
            $("#loader").show();
            let formVal = JSON.stringify(this.uploadDocumentForm.getRawValue());
            let input = {
              ...JSON.parse(formVal),
            };
            let serviceInput = {
              applicationId: input.applicationId,
              docId: this.tacDocid,
              uploadDocId: 0,
              contentUrl: this.base64File,
              contentUrlName: this.base64FileName,
              IsNewAdd: true,
            };
            this.fileService
              .AddStudentDocument(serviceInput)
              .subscribe((res) => {
                if (res.status) {
                  this.updateOfferStatus(2);
                  this.modalService.dismissAll();
                  this.uploadDocumentForm.get("documentFile")?.setValue("");
                  this.toastr.SuccessToastr("File uploaded successfully");
                } else {
                  this.toastr.ErrorToastr("Something went wrong");
                }
              });
          }
        });
    }
  }

  changeCampusError: boolean = false;
  changeCourseIntake() {
    this.changeCampusError = true;
  }
}
