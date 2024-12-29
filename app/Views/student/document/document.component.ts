import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DocumentService } from "src/app/Services/document.service";
import { DownloadfileService } from "src/app/Services/downloadfile.service";
import { EmittService } from "src/app/Services/emitt.service";
import { FileValidationService } from "src/app/Services/file-validation.service";
import { AppConfig } from "src/app/appconfig";
import { AlertServiceService } from "src/app/services/alert-service.service";
import { SessionStorageService } from "src/app/services/session-storage.service";
import { ToastrServiceService } from "src/app/services/toastr-service.service";

@Component({
  selector: "app-document",
  templateUrl: "./document.component.html",
  styleUrls: ["./document.component.sass"],
})
export class DocumentComponent implements OnInit {
  userType: any;
  studentName: any;
  hostUrl: string = "";
  isFormSubmitted: boolean = false;
  @ViewChild("CasUrlModal") ViewCASUrlModal: ElementRef;
  @ViewChild("MultipleDocumentUrlModal") MultipleDocumentUrlModal: ElementRef;
  @ViewChild("DocumentUploadView") DocumentUploadView: ElementRef;
  base64FileName: any;
  permissionMessageImage = false;
  base64File: any;
  fileUrl: any;
  DocumentIndexValidationId = 0;
  BindDocumentIndexValidationId: number;
  modalTitle = "Add Course";
  isValidFile = true;
  studentDocuments: any = [];
  IsUploadMe: any = false;
  IsNotUploadMe: any = false;
  uploadDocumentForm: FormGroup = new FormGroup({
    documentFile: new FormControl(),
    docId: new FormControl(),
    applicationId: new FormControl(),
  });
  constructor(
    private modalService: NgbModal,
    private sessionService: SessionStorageService,
    private formBuilder: FormBuilder,
    private Documentservices: DocumentService,
    private alerts: AlertServiceService,
    private toastr: ToastrServiceService,
    private emittService: EmittService,
    private fileService: DocumentService,
    private appConfig: AppConfig,
    private domSanitizer: DomSanitizer,
    private downloadService: DownloadfileService,
    private fileValidation: FileValidationService
  ) {
    this.uploadDocumentForm = this.formBuilder.group({
      applicationId: ["0"],
      docId: ["0"],
      documentFile: ["", [Validators.required]],
    });
    this.hostUrl = this.appConfig.baseServiceUrl;
    this.emittService.onChangeAddApplicationbtnHideShow(false);
  }

  ngOnInit(): void {
    let input = {
      size: 10,
      index: 1,
    };
    this.getStudentDocument();
    this.loadDocument();
    this.loadDocumentForWelcomeKit();
  }

  get f() {
    return this.uploadDocumentForm.controls;
  }

  getStudentDocument() {
    $("#loader").show();
    var application = {
      ApplicationId: 0,
    };
    this.userType = parseInt(this.sessionService.getUserType());
    if (this.userType > 5 || this.userType == 4) {
      application.ApplicationId = parseInt(
        this.sessionService.getUserApplicationId()
      );
      this.studentName = this.sessionService.GetSessionForApplicationname();
      var userPermission = this.sessionService.getpermission();
      if (userPermission == "true") {
        this.fileService.GetStudentDocuments(application).subscribe((res) => {
          if (res.status) {
            this.studentDocuments = res.data;
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
      this.fileService.GetStudentDocuments(application).subscribe((res) => {
        if (res.status) {
          this.studentDocuments = res.data;
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
        $("#loader").hide();
      });
    }
  }

  resetUploadDocumentform() {
    this.isFormSubmitted = false;
    this.isValidFile = true;
    this.uploadDocumentForm.reset();
  }

  SubDocumentList: any = [];
  DocumentSatus: any;
  DocumentName: any;
  bindSubDocuments(id: any) {
    $("#loader").show();
    let DocIdInputModel = {
      DocId: id,
    };
    this.fileService.GetbindSubDocuments(DocIdInputModel).subscribe((res) => {
      $("#loader").hide();
      if (res.status) {
        this.SubDocumentList = res.data.docList;
        this.DocumentName = res.data.mainDocumentName;
        this.DocumentSatus = res.data.mainDocumentSatus;
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

  ViewMyFile(url: any) {
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    link.setAttribute("type", "hidden");
    link.setAttribute("href", this.appConfig.baseServiceUrl + url);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  MultipleDocUment: any;
  OpenMultipleDocumentModal(Id: any) {
    this.MultipleDocUment = [];
    let DocIdInputModel = {
      DocId: Id,
    };
    this.fileService.GetbindSubDocuments(DocIdInputModel).subscribe((res) => {
      $("#loader").hide();
      if (res.status) {
        this.SubDocumentList = res.data.docList;
        this.DocumentName = res.data.mainDocumentName;
        this.DocumentSatus = res.data.mainDocumentSatus;
        if (this.SubDocumentList) {
          this.SubDocumentList.forEach((element) => {
            let file = this.domSanitizer.bypassSecurityTrustResourceUrl(
              this.appConfig.baseServiceUrl + element.docPath
            );
            let FileDetal = {
              file: element.docPath,
              fileUrl: file,
              fileName: element.document_Name,
            };
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

          this.modalService.open(this.MultipleDocumentUrlModal, {
            size: "xl",
            ariaLabelledBy: "modal-basic-title",
            backdrop: false,
          });
        }
      } else {
        this.toastr.ErrorToastr("Something went wrong");
      }
    });
  }
  SupprotiongDocument: any;
  loadDocument() {
    $("#loader").show();
    let input = {
      docTypeId: 3,
      ApplicationId: this.sessionService.getUserApplicationId()
    };
    this.Documentservices.GetAllDocument(input).subscribe((res) => {
      console.log("load document",res);
      if (res.status) {
        this.SupprotiongDocument = res.data.records;
      } else {
        this.toastr.ErrorToastr("Something went wrong");
      }
      $("#loader").hide();
    });
  }

  WelcomeKitDocument: any;
  loadDocumentForWelcomeKit() {
    $("#loader").show();
    let input = {
      docTypeId: 4,
      ApplicationId: this.sessionService.getUserApplicationId(),
    };
    this.Documentservices.GetAllDocument(input).subscribe((res) => {
      console.log("Welcome kit",res);
      if (res.status) {
        this.WelcomeKitDocument = res.data.records;
        console.log("WelcomeKitDocument:", this.WelcomeKitDocument); // Log the value of WelcomeKitDocument
        console.log("Records found:", res.data.records.length); // Check the length of records
        console.log("Records content:", res.data.records); // Check what is inside records
      } else {
        this.toastr.ErrorToastr("Something went wrong");
      }
      $("#loader").hide();
    });
  }

  DeleteDocument(id: any) {
    this.alerts
      .ComfirmAlert("Do you want to delete file?", "Yes", "No")
      .then((res) => {
        console.log("Delete Document",res);
        if (res.isConfirmed) {
          $("#loader").show();
          let DocIdInputModel = {
            UploadDocId: id,
          };
          this.fileService.DeleteUploadedDocument(DocIdInputModel).subscribe((res) => {
            console.log("file service deleteupload",res);
            $("#loader").hide();
            if (res.status) {
              this.bindSubDocuments(this.storeDocId);
              this.DocumentUploadViewModel(
                this.DocumentUploadView,
                this.storeDocId
              );
              this.getStudentDocument();
              this.toastr.SuccessToastr("File deleted succesfully");
            } else {
              this.toastr.ErrorToastr("Something went wrong");
            }
          });
        }
      });
  }
  StoreUploadDoc: any;
  openModal(content: any, id: any = 0, UploadId: any) {
    this.uploadDocumentForm.reset();
    this.resetInquiryForm();
    this.StoreUploadDoc = UploadId;
    this.uploadDocumentForm.reset(this.uploadDocumentForm.value);
    this.modalTitle = "Upload Document";
    this.bindDocument(id);
    this.isReSubmitFormSubmitted = false;
    this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      backdrop: false,
    });
  }

  downloadMyFile(url: any) {
    var filename = this.getFileName(url);
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    link.setAttribute("type", "hidden");
    link.setAttribute("href", this.appConfig.baseServiceUrl + url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  getFileName(str: any = "/defalut.pdf") {
    return str.substring(str.lastIndexOf("/") + 1);
  }
  // htmldoc: 'convertFileToBase64($event)';
  testcode: any;
  htmldoc: '(change)="convertFileToBase64($event)"';
  NewDocUp() {
    this.BindDocumentIndexValidationId = this.DocumentIndexValidationId + 1;
    // $("#NewDocUPLoad").append("<br><div class='row' id='maindiv" + this.BindDocumentIndexValidationId + "'><div class='col - md - 11 col-sm-11'><input type='file' formControlName='documentFile' class='form-control ng-untouched ng-pristine ng-invalid'  id='documentFile" + this.BindDocumentIndexValidationId + "' (change)='convertFileToBase64($event)'></div><div class='col - md - 1 col-sm-1 fs-4'><sapn (click)='deleterowdoc(" + this.BindDocumentIndexValidationId + ")'>X</span></div>")
    $("#NewDocUPLoad").append(
      "<div id='maindiv" +
        this.BindDocumentIndexValidationId +
        "'  class='d-flex card-footer justify-content-between mt-2' style=' border-style: groove; '><div><div class='border-1'><input type='file' id='fileId_" +
        this.BindDocumentIndexValidationId +
        "' class='border-0' (change)='convertFileToBase64($event)' {{htmldoc.angular}}></div></div><div><button onClick=\"document.getElementById('hdnClickEdit').value=" +
        this.BindDocumentIndexValidationId +
        "; document.getElementById('hdnClickEdit').click()\" class='text-end btn btn-danger'><i class='fa fa-trash'></i></button></div></div>"
    );
    // this.htmldoc = "<div id='maindiv" + this.BindDocumentIndexValidationId + "'  class='d-flex card-footer justify-content-between mt-2' style=' border-style: groove; '><div><div class='border-1'><input type='file' (change)='convertFileToBase64($event)' class='border-0'> <input type='text'></div></div><div><button onClick=\"document.getElementById(\'hdnClickEdit\').value=" + this.BindDocumentIndexValidationId + "; document.getElementById(\'hdnClickEdit\').click()\" class='text-end btn btn-danger'><i class='fa fa-trash'></i></button></div></div>"
    this.DocumentIndexValidationId = this.BindDocumentIndexValidationId;
    this.testcode =
      "<div id='maindiv" +
      this.BindDocumentIndexValidationId +
      "'  class='d-flex card-footer justify-content-between mt-2' style=' border-style: groove; '><div><div class='border-1'><input type='file' id='fileId_" +
      this.BindDocumentIndexValidationId +
      "' class='border-0' (change)='convertFileToBase64($event)' {{htmldoc.angular}}></div></div><div><button onClick=\"document.getElementById('hdnClickEdit').value=" +
      this.BindDocumentIndexValidationId +
      "; document.getElementById('hdnClickEdit').click()\" class='text-end btn btn-danger'><i class='fa fa-trash'></i></button></div></div>";
    // $("#fileId_" + this.BindDocumentIndexValidationId).attr('onChange', 'convertFileToBase64($event)');
  }
  deleterowdoc(id) {
    let getvalue = $("#hdnClickEdit").val();
    $("#maindiv" + getvalue + "").remove();
  }

  get fuploadsdoc() {
    return this.uploadDocumentForm.controls;
  }

  isReSubmitFormSubmitted = false;
  uploadDocument() {
    this.isReSubmitFormSubmitted = true;

    if (this.uploadDocumentForm.valid) {
      this.alerts
        .ComfirmAlert("Do you want to upload document?", "Yes", "No")
        .then((res) => {
          console.log("upload document",res);
          if (res.isConfirmed) {
            $("#loader").show();
            for (var i = 0; i <= this.DocumentIndexValidationId; i++) {}
            let formVal = JSON.stringify(this.uploadDocumentForm.getRawValue());
            let input = {
              ...JSON.parse(formVal),
            };
            let serviceInput = {
              applicationId: this.StoreApplicationId,
              docId: this.StoreDocIds,
              uploadDocId: this.StoreUploadDoc,
              contentUrl: this.base64File,
              contentUrlName: this.base64FileName,
              IsNewAdd: false,
            };
            this.fileService
              .AddStudentDocument(serviceInput)
              .subscribe((res) => {
                console.log("add student document",res);
                if (res.status) {
                  // this.modalService.dismissAll();
                  this.uploadDocumentForm.get("documentFile")?.setValue("");
                  this.DocumentUploadViewModel(
                    this.DocumentUploadView,
                    this.storeDocId
                  );
                  this.getStudentDocument();
                  this.StoreUploadDoc = 0;
                  this.toastr.SuccessToastr("File uploaded successfully");
                } else {
                  this.toastr.ErrorToastr("Something went wrong");
                }
                $("#loader").hide();
              });
          }
        });
    }
  }

  resetInquiryForm() {
    this.uploadDocumentForm.get("applicationId")?.setValue("0");
    this.uploadDocumentForm.get("docId")?.setValue("0");
    //this.uploadDocumentForm.get("documentFile")?.setValue("");

    this.base64File = null;
    this.base64FileName = null;
  }
  StoreApplicationId: any;
  StoreDocIds: any;
  bindDocument(index: any) {
    let documentDetail = this.studentDocuments.find((m) => m.docId == index);
    if (documentDetail.isSubmitted) {
      this.uploadDocumentForm
        .get("applicationId")
        ?.setValue(documentDetail.applicationId);
      this.uploadDocumentForm.get("docId")?.setValue(documentDetail.docId);
      // this.uploadDocumentForm.get("documentFile")?.setValue(this.getFileName(documentDetail.sampleDocumentUrl));
    } else {
      this.uploadDocumentForm
        .get("applicationId")
        ?.setValue(documentDetail.applicationId);
      this.uploadDocumentForm.get("docId")?.setValue(documentDetail.docId);
    }
    this.StoreApplicationId = documentDetail.applicationId;
    this.StoreDocIds = documentDetail.docId;
  }

  convertFileToBase64(event: any) {
    if (this.fileValidation.checkFileType(event.target.files)) {
      this.isValidFile = true;
      const file = event.target.files[0];
      this.base64FileName = file.name;
      const reader = new FileReader();
      reader.onloadend = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
    } else {
      this.isValidFile = false;
      this.uploadDocumentForm.get("documentFile")?.setValue("");
    }
  }

  AddMultiDocument: any;

  _handleReaderLoaded(e: any) {
    let reader = e.target;
    var base64result = reader.result.substr(reader.result.indexOf(",") + 1);
    this.base64File = base64result;
    // this.base64FileName = Name;
    // console.log(this.base64File);
    let UploadDocument = {
      ContentUrl: base64result,
      ContentUrlName: this.base64FileName,
    };
    if (this.AddMultiDocument == undefined)
      this.AddMultiDocument = UploadDocument;
    else this.AddMultiDocument.push(UploadDocument);

    console.log(this.AddMultiDocument);
  }

  applicationId: number;
  OpenCASUrlModal(url: any) {
    this.fileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
      this.appConfig.baseServiceUrl + url
    );
    this.modalService.open(this.ViewCASUrlModal, {
      size: "xl",
      ariaLabelledBy: "modal-basic-title",
      backdrop: false,
    });
  }
  storeDocId: any;
  DocumentUploadViewModel(Model: any, Id: any) {
    this.storeDocId = Id;
    this.StoreDocIds = 0;
    this.StoreApplicationId = 0;
    this.resetUploadDocumentform();
    //this.resetInquiryForm();
    // this.uploadDocumentForm.reset(this.uploadDocumentForm.value);
    this.modalService.dismissAll();
    this.modalTitle = "Upload Document";
    this.bindDocument(Id);
    this.isFormSubmitted = false;
    this.bindSubDocuments(Id);
    this.modalService.open(Model, {
      size: "lg",
      ariaLabelledBy: "modal-basic-title",
      backdrop: false,
    });
  }
  downloadForm(url) {
    let file = this.appConfig.baseServiceUrl + url;
    this.downloadService.DownloadFile(url).subscribe((res) => {
      let a = document.createElement("a");
      a.download = "";
      a.href = window.URL.createObjectURL(res);
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }
}
