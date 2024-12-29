import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import {
  ApplicationOfferDetail,
  OfferDetail,
} from "../Model/student-offer.model";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ApplicationOfferService } from "src/app/Services/application-offer.service";
import { FileValidationService } from "src/app/Services/file-validation.service";
import { SessionStorageService } from "src/app/services/session-storage.service";
import { ToastrServiceService } from "src/app/services/toastr-service.service";
import { AppConfig } from "src/app/appconfig";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DownloadfileService } from "src/app/Services/downloadfile.service";
import { DepositService } from "src/app/Services/deposit.service";
import moment from "moment";

@Component({
  selector: "app-fee",
  templateUrl: "./fee.component.html",
  styleUrls: ["./fee.component.sass"],
})
export class FeeComponent implements OnInit {
  urlSafe: SafeResourceUrl;
  SetDate: any;
  isDepositReceiptSubmitted: boolean = false;
  studentOffer: OfferDetail;
  storeApplicationId: any;
  BaseUrl: any;
  permissionMessageImage = false;
  isSaveDisabled: boolean;
  isCancelDisabled: boolean;
  userType: any;
  studentName: any;
  depositeData: any;
  modalTitle: any;
  applicationOfferDetail: ApplicationOfferDetail;
  FileUploadedUrlTandC: string = "";
  FileUploadedUrlTandCFileName: string = "";
  installmentList = [];
  PaymentReceipts = [];
  UploadDepositReceiptForm: FormGroup = new FormGroup({
    dReceipt: new FormControl(),
    applicationId: new FormControl(),
    installmentId: new FormControl(),
    amount: new FormControl(),
  });
  @ViewChild("ReceiptView") ReceiptView: ElementRef;
  constructor(
    private formBuilder: FormBuilder,
    private offerService: ApplicationOfferService,
    private fileValidation: FileValidationService,
    private sessionService: SessionStorageService,
    private deposite: DepositService,
    private toastr: ToastrServiceService,
    public sanitizer: DomSanitizer,
    private appConfig: AppConfig,
    private modalService: NgbModal,
    private domSanitizer: DomSanitizer,
    private downloadService: DownloadfileService
  ) {
    this.UploadDepositReceiptForm = formBuilder.group({
      dReceipt: ["", Validators.required],
      applicationId: ["", Validators.required],
      installmentId: ["", Validators.required],
      amount: ["", Validators.required],
      paymentDate: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.SetDate = moment().format("YYYY-MM-DD");
    this.GetSession();
    this.GetDepositeByApplicationId();
    this.getStudentOffer();
  }

  getStudentOffer() {
    $("#loader").show();

    let input = {
      applicationId: this.storeApplicationId,
    };
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
      this.offerService.getOfferDetail(input).subscribe((res) => {
        if (res.status) {
          this.modifiedStudentOfferData(res.data);
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
        $("#loader").hide();
      });
    }
  }

  modifiedStudentOfferData(data: any) {
    data.forEach((element) => {
      this.studentOffer = element.offerDetail;
      this.applicationOfferDetail = element.applicationOfferDetail;
    });
  }

  GetSession(): any {
    this.storeApplicationId = this.sessionService.getUserApplicationId();
  }

  GetDepositeByApplicationId() {
    this.UploadDepositReceiptForm.get("applicationId").setValue(
      this.storeApplicationId
    );
    $("#loader").show();
    this.BaseUrl = this.appConfig.baseServiceUrl;
    let input = {
      applicationId: this.storeApplicationId,
    };
    // this.deposite.getDeposit(input).subscribe(res => {
    this.deposite.GetInstallmentsByApplication(input).subscribe((res) => {
      if (res.status) {
        this.installmentList = res.data;
      } else {
        this.toastr.ErrorToastr("Something went wrong");
      }
      $("#loader").hide();
    });
  }

  uploadDepositeReceipt() {
    this.isDepositReceiptSubmitted = true;
    if (this.UploadDepositReceiptForm.valid) {
      $("#loader").show();
      let formInput = this.UploadDepositReceiptForm.getRawValue();
      let input = {
        ...formInput,
        fileUploadedUrl: this.FileUploadedUrlTandC,
        fileName: this.FileUploadedUrlTandCFileName,
        docId: 4,
      };
      this.offerService.addDepositeOffered(input).subscribe((res) => {
        if (res.status) {
          this.toastr.SuccessToastr("Fees Receipt uploaded successfully.");
          this.GetDepositeByApplicationId();
          this.UploadDepositReceiptForm.reset();
          this.UploadDepositReceiptForm.get("applicationId").setValue(
            this.storeApplicationId
          );
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
        $("#loader").hide();
      });
    }
  }

  disabledDeposiForm() {
    this.UploadDepositReceiptForm.get("dReceipt")?.disable();
    this.isSaveDisabled = true;
    this.isCancelDisabled = true;
  }

  downloadFile(url: any) {
    this.downloadService.DownloadFile(url).subscribe((res) => {
      let a = document.createElement("a");
      a.download = "";
      a.href = window.URL.createObjectURL(res);
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }

  getFileName(str: any = "/defalut.pdf") {
    return str.substring(str.lastIndexOf("/") + 1);
  }

  get f() {
    return this.UploadDepositReceiptForm.controls;
  }
  isValidFile: any = true;
  convertFileToBase64(event: any) {
    const file = event.target.files[0];
    if (this.fileValidation.checkFileType(event.target.files)) {
      this.isValidFile = true;
      const reader = new FileReader();
      reader.onloadend = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
      this.FileUploadedUrlTandCFileName = file.name;
    } else {
      this.isValidFile = false;
      this.UploadDepositReceiptForm.get("dReceipt")?.setValue("");
    }
  }

  _handleReaderLoaded(e: any) {
    let reader = e.target;
    var base64result = reader.result.substr(reader.result.indexOf(",") + 1);
    this.FileUploadedUrlTandC = base64result;
  }
  GetAllReceipt(ApplicationId, installmentNo, installmentType) {
    var input = {
      applicationId: ApplicationId,
      installmentNo: installmentNo === 0 ? null : installmentNo,
    };
    this.deposite.getReceiptUrls(input).subscribe(
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
}
