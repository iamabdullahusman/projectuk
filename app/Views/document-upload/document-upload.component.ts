import { formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray,
} from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AppConfig } from "src/app/appconfig";
import { Course } from "src/app/models/course.model";
import { Documentupload } from "src/app/Models/documentupload";
import { Intake } from "src/app/models/intake.model";
import { AlertServiceService } from "src/app/services/alert-service.service";
import { CoursesService } from "src/app/services/courses.service";
import { DocumentService } from "src/app/Services/document.service";
import { EmittService } from "src/app/Services/emitt.service";
import { FileValidationService } from "src/app/Services/file-validation.service";
import { IntakeService } from "src/app/services/intake.service";
import { ToastrServiceService } from "src/app/services/toastr-service.service";
import { forkJoin } from "rxjs";
import { CampusService } from "src/app/services/campus.service";
import moment, { min } from "moment";

@Component({
  selector: "app-document-upload",
  templateUrl: "./document-upload.component.html",
  styleUrls: ["./document-upload.component.sass"],
})
export class DocumentUploadComponent implements OnInit {
  isSubmitted: boolean = false;
  modalTitle = "Add Documet";
  isformLetterValid = true;
  DocTypeval = null;
  docCategory = 2;
  dtOptions: DataTables.Settings = {};
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
    CourseId: new FormControl(),
    IntakeId: new FormControl(),
    // course: new FormArray([])
  });
  DocUpload: Array<Documentupload> = [];
  Documentupload?: Documentupload;
  isValidFile = true;
  isFormSubmitted = false;
  uploadDocumentForm: FormGroup = new FormGroup({
    docTypecontent: new FormControl(),
    doctypeId: new FormControl(),
  });

  constructor(
    private modalService: NgbModal,
    private documentService: DocumentService,
    private CourseServices: CoursesService,
    private IntakeServices: IntakeService,
    private CampusServices: CampusService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alerts: AlertServiceService,
    private toastr: ToastrServiceService,
    private emittService: EmittService,
    private config: AppConfig,
    private fileValid: FileValidationService,
    private courseServive: CoursesService,
    private intakeService: IntakeService
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
      CourseId: [null],
      IntakeId: [null],
      // course: formBuilder.array([], [Validators.required])
    });
    this.uploadDocumentForm = formBuilder.group({
      docTypecontent: ["", Validators.required],
      doctypeId: ["", Validators.required],
      documentName: ["", Validators.required],
    });
    emittService.onChangeAddApplicationbtnHideShow(false);
  }

  AllIntake = [];
  AllCampus = [];
  AllCourse = [];

  ngOnInit(): void {
    this.loadDocument(this.docCategory);
    this.FormInputChangeFunc();
    this.loadForm();

    let paginationModal = {
      index: 0,
      size: 0,
    };

    let coursesData = this.CourseServices.getAllCourses(paginationModal);
    let campusData = this.CampusServices.getAllCampaus(paginationModal);
    let intakeData = this.IntakeServices.getAllIntake(paginationModal);
    forkJoin([coursesData, campusData, intakeData]).subscribe(
      (result) => {
        $("#loader").hide();
        if (result[0]) {
          if (result[0].status) {
            this.AllCourse = result[0].data.records;
          } else {
            this.toastr.ErrorToastr(result[0].message);
          }
        }
        if (result[1]) {
          if (result[1].status) {
            this.AllCampus = result[1].data.records;
          } else {
            this.toastr.ErrorToastr(result[1].message);
          }
        }
        if (result[2]) {
          if (result[2].status) {
            this.AllIntake = result[2].data.records;
            this.AllIntake.forEach((element) => {
              element.intakeName =
                element.intakeName +
                " - " +
                moment(element.startDate + "Z").format("YYYY") +
                " (Academic Year " +
                element.yearOfStudy +
                ")";
            });
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
  }
  currentDate = new Date();
  courses: Array<Course> = [];
  intakes: Array<Intake> = [];
  loadForm() {
    $("#loader").show();
    let paginationInput = {
      index: 0,
      size: 0,
    };
    var courseReq = this.courseServive.getAllCourses(paginationInput);
    var intakeReq = this.intakeService.getAllIntake(paginationInput);
    forkJoin([courseReq, intakeReq]).subscribe((result) => {
      if (result[0]) {
        if (result[0].status) {
          // this.courses = result[0].data.records;
          result[0].data.records.forEach((element) => {
            if (
              formatDate(element.startDate, "yyyy-MM-dd", "en_US") >
              formatDate(this.currentDate, "yyyy-MM-dd", "en_US")
            ) {
              this.courses.push(element);
            }
          });
        } else {
          this.toastr.ErrorToastr(result[0].message);
        }
      }
      if (result[1]) {
        if (result[1].status) {
          // this.intakes = result[1].data.records;
          result[1].data.records.forEach((element) => {
            if (
              formatDate(element.endDate, "yyyy-MM-dd", "en_US") >
              formatDate(this.currentDate, "yyyy-MM-dd", "en_US")
            ) {
              this.intakes.push(element);
            }
          });
          this.courses.forEach((c) => {
            c.intakes = [];
            this.intakes.forEach((element) => {
              if (
                formatDate(element.endDate, "yyyy-MM-dd", "en_US") <
                formatDate(c.endDate, "yyyy-MM-dd", "en_US")
              ) {
                c.intakes.push(element);
              }
            });
          });
        } else {
          this.toastr.ErrorToastr(result[1].message);
        }
      }
      $("#loader").hide();
    });
    $("#loader").hide();
  }

  downloadMyFile(url: any) {
    var filename = this.config.baseServiceUrl + this.getFileName(url);
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    link.setAttribute("type", "hidden");
    link.setAttribute("href", this.config.baseServiceUrl + url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  FormInputChange: any = true;
  Storeeindex: any;
  tabClick(e) {
    this.Storeeindex = e;
    if (this.Storeeindex != undefined) {
      if (e.index == 0) {
        this.loadDocument(2);
        this.docCategory = 2;
        if (this.FormInputChange == false) {
          this.FormInputChange = true;
          this.FormInputChangeFunc();
        }
      } else if (e.index == 1) {
        this.loadDocument(3);
        this.docCategory = 3;
        if (this.FormInputChange == false) {
          this.FormInputChange = true;
          this.FormInputChangeFunc();
        }
      } else if (e.index == 2) {
        this.loadDocument(4);
        if (this.FormInputChange == true) {
          this.FormInputChange = false;
          this.FormInputChangeFunc();
        }
      } 
    } else {
      this.loadDocument(2);
      this.docCategory = 2;
      if (this.FormInputChange == false) {
        this.FormInputChange = true;
        this.FormInputChangeFunc();
      }
    }


    //Original Hide for Offer Kit Test Section
    // if (this.Storeeindex != undefined) {
    //   if (e.index == 0) {
    //     this.loadDocument(2);
    //     this.docCategory = 2;
    //     if (this.FormInputChange == false) {
    //       this.FormInputChange = true;
    //       this.FormInputChangeFunc();
    //     }
    //   } else if (e.index == 1) {
    //     this.loadDocument(1);
    //     this.docCategory = 1;
    //     if (this.FormInputChange == false) {
    //       this.FormInputChange = true;
    //       this.FormInputChangeFunc();
    //     }
    //   } else if (e.index == 2) {
    //     this.loadDocument(3);
    //     this.docCategory = 3;
    //     if (this.FormInputChange == false) {
    //       this.FormInputChange = true;
    //       this.FormInputChangeFunc();
    //     }
    //   } else if (e.index == 3) {
    //     this.loadDocument(4);
    //     if (this.FormInputChange == true) {
    //       this.FormInputChange = false;
    //       this.FormInputChangeFunc();
    //     }
    //   }
    // } else {
    //   this.loadDocument(2);
    //   this.docCategory = 2;
    //   if (this.FormInputChange == false) {
    //     this.FormInputChange = true;
    //     this.FormInputChangeFunc();
    //   }
    // }
  }

  FormInputChangeFunc() {
    if (this.FormInputChange == true) {
      if (!this.documentForm.contains("documentType")) {
        this.documentForm.addControl(
          "documentType",
          this.formBuilder.control("", [Validators.required])
        );
        this.documentForm.addControl(
          "sampleDocumentUrl",
          this.formBuilder.control("")
        );
        this.documentForm.addControl(
          "sampleDocumentName",
          this.formBuilder.control("")
        );
        this.documentForm.addControl(
          "formOrLetter",
          this.formBuilder.control("")
        );
        this.documentForm.addControl(
          "formOrLetterName",
          this.formBuilder.control("")
        );
        this.documentForm.get("IntakeId")?.clearValidators();
        this.documentForm.get("CourseId")?.clearValidators();
      }
      // if (this.documentForm.contains('course')) {
      //   this.documentForm.removeControl('course');
      // }
    } else if (this.FormInputChange == false) {
      if (this.documentForm.contains("documentType")) {
        this.documentForm.removeControl("documentType");
        // this.documentForm.removeControl('sampleDocumentUrl');
        // this.documentForm.removeControl('sampleDocumentName');
        this.documentForm.removeControl("formOrLetter");
        this.documentForm.removeControl("formOrLetterName");
        this.documentForm.addControl(
          "sampleDocumentUrl",
          this.formBuilder.control("")
        );
        this.documentForm.addControl(
          "sampleDocumentName",
          this.formBuilder.control("")
        );
        this.documentForm.get("IntakeId")?.addValidators(Validators.required);
        this.documentForm.get("CourseId")?.addValidators(Validators.required);
      }
      // if (!this.documentForm.contains('course')) {
      //   this.documentForm.addControl('course', this.formBuilder.array([], [Validators.required]))
      // }
    }
  }

  loadDocument(doctype) {
    $("#loader").show();
    this.documentForm.get("documentCategory").setValue(doctype);
    let input = {
      docTypeId: doctype,
    };
    this.documentService.GetAllDocument(input).subscribe((res) => {
      if (res.status) {
        this.DocUpload = res.data.records;
        // if (doctype == 1) {
        //   this.DocUpload.splice(this.DocUpload.findIndex(x => x.documentName.toLowerCase() == "conditional offer"), 1);
        //   this.DocUpload.splice(this.DocUpload.findIndex(x => x.documentName.toLowerCase() == "unconditional offer"), 1);
        // }
      } else {
        this.toastr.ErrorToastr("Something went wrong");
      }
      $("#loader").hide();
    });
  }
  selectedCourse: Array<number> = [];
  checkedCourse(id) {
    return this.selectedCourse.findIndex((m) => m == id) >= 0;
  }

  checkhedIntake(courseId: any, intake: any) {
    var chkcourse: FormArray = this.documentForm.get("course") as FormArray;
    return (
      chkcourse.controls.findIndex((m) => m.value == courseId + "," + intake) >=
      0
    );
  }

  Closemodel() {
    this.modalService.dismissAll();
    this.documentForm.reset();
    this.selectedCourse = [];
    this.tabClick(this.Storeeindex);
  }

  isSelectCourseAndIntake(courseIntakeId: any, chkcourse: FormArray) {
    var courseId = parseInt(courseIntakeId.split(",")[0]);
    var courseIds: Array<number> = [];
    for (let i = 0; i < chkcourse.controls.length; i++) {
      if (
        courseIds.findIndex(
          (m) => m == parseInt(chkcourse.controls[i].value.split(",")[0])
        ) < 0
      ) {
        if (
          this.selectedCourse.findIndex(
            (m) => m == parseInt(chkcourse.controls[i].value.split(",")[0])
          ) < 0
        )
          return false;
        courseIds.push(parseInt(chkcourse.controls[i].value.split(",")[0]));
      }
    }
    if (this.selectedCourse.findIndex((m) => m == courseId) >= 0) {
      if (this.selectedCourse.length == 1) return true;
      else if (
        this.selectedCourse.length == 1 &&
        chkcourse.controls.length == 0
      )
        return false;
      else {
        for (let i = 0; i < this.selectedCourse.length; i++) {
          if (courseIds.findIndex((m) => m == this.selectedCourse[i]) < 0) {
            return false;
          }
        }
        return true;
      }
    } else {
      return false;
    }
  }

  onIntakeChange(e: any) {
    var chkcourse: FormArray = this.documentForm.get("course") as FormArray;
    var courseIntakeId = e.target.value as string;
    var courseId = parseInt(courseIntakeId.split(",")[0]);
    if (e.target.checked) {
      if (this.selectedCourse.findIndex((m) => m == courseId) == -1) {
        this.selectedCourse.push(courseId);
      }
      chkcourse.push(new FormControl(courseIntakeId));
      if (!this.isSelectCourseAndIntake(courseIntakeId, chkcourse)) {
        // this.campusForm.get('course')?.setErrors({ 'selectIntake': false });
        this.documentForm.get("course")?.setErrors(null);
      }
    } else {
      let index = chkcourse.controls.findIndex(
        (m) => m.value == e.target.value
      );
      chkcourse.removeAt(index);
      if (!this.isSelectCourseAndIntake(courseIntakeId, chkcourse)) {
        this.documentForm.get("course")?.setErrors({ selectIntake: true });
      }
    }
  }

  onCourseChecked(e: any) {
    if (e.target.checked) {
      this.selectedCourse.push(parseInt(e.target.value));
      if (!this.isSelectCourseAndIntakeByCourse(e.target.value, true)) {
        this.documentForm.get("course")?.setErrors({ selectIntake: true });
      }
    } else {
      this.removeIntakeByCourse(e.target.value);
      let index = this.selectedCourse.findIndex((m) => m == e.target.value);
      this.selectedCourse.splice(index, 1);
      if (!this.isSelectCourseAndIntakeByCourse(e.target.value, false)) {
        this.documentForm.get("course")?.setErrors({ selectIntake: true });
      } else {
        this.documentForm.get("course")?.setErrors(null);
      }
    }
  }

  isSelectCourseAndIntakeByCourse(id: any, isChecked: any) {
    var chkcourse: FormArray = this.documentForm.get("course") as FormArray;
    var tempCourseIds: Array<number> = [];
    for (var i = 0; i < chkcourse.controls.length; i++) {
      if (
        tempCourseIds.findIndex(
          (m) => m == chkcourse.controls[i].value.split(",")[0]
        ) < 0
      ) {
        tempCourseIds.push(parseInt(chkcourse.controls[i].value.split(",")[0]));
      }
    }
    if (isChecked) {
      return tempCourseIds.findIndex((m) => m == parseInt(id)) >= 0;
    } else {
      for (var i = 0; i < this.selectedCourse.length; i++) {
        if (tempCourseIds.findIndex((m) => m == this.selectedCourse[i]) < 0)
          return false;
      }
    }
    return true;
  }

  removeIntakeByCourse(courseId: any) {
    var chkcourse: FormArray = this.documentForm.get("course") as FormArray;
    var IntakeToRemove = chkcourse.controls.filter(
      (x) => (x.value as string).split(",")[0] == courseId
    );
    IntakeToRemove.forEach((element) => {
      chkcourse.controls.splice(
        chkcourse.controls.findIndex((x) => x === element),
        1
      );
    });
  }

  openDocModal(content: any, id: any = 0) {
    this.fileNameHTML = "";
    this.documentForm.reset(this.documentForm.value);
    this.isformLetterValid = true;
    if (id > 0) {
      this.modalTitle = "Update Document";
      this.isSubmitted = false;
      this.getDocumentById(id);
      this.modalService.open(content, {
        ariaLabelledBy: "modal-basic-title",
        backdrop: false,
        size: "xl",
      });
    } else {
      this.modalTitle = "Add Document";
      this.isSubmitted = false;
      this.modalService.open(content, {
        ariaLabelledBy: "modal-basic-title",
        backdrop: false,
        size: "xl",
      });
      this.resetdocumentForm();
    }
  }
  fileNameHTML: any;
  IsDocFilled: any;
  fileNameHTMLName: any;
  setIsSampleUrlRemove = false;
  setIsFormLetterUrlRemove = false;
  RemoveFile() {
    this.documentForm.get("sampleDocumentUrl")?.setValue("");
    this.fileNameHTML = "";
    this.setIsSampleUrlRemove = true;
  }
  RemoveFileForFileLocad() {
    this.documentForm.get("formOrLetter")?.setValue("");
    this.IsDocFilled = "";
    this.setIsFormLetterUrlRemove = true;
  }
  getDocumentById(id: any) {
    this.Documentupload = this.DocUpload.find((m) => m.documentTypeId == id);
    this.documentForm
      .get("documentName")
      ?.setValue(this.Documentupload?.documentName);
    this.documentForm
      .get("documentDescription")
      ?.setValue(this.Documentupload?.documentDescription);
    this.DocTypeval = this.Documentupload?.documentType;
    // if (this.Documentupload.documentType != 4) {
    this.fileNameHTML = this.getFileName(
      this.Documentupload?.sampleDocumentUrl
    );
    this.IsDocFilled = this.getFileName(this.Documentupload?.formOrLetterUrl);
    // }
    //$("#FileNameBind").html(this.Documentupload?.sampleDocumentUrl);
    console.log(this.Documentupload);
    this.documentForm
      .get("documentTypeId")
      ?.setValue(this.Documentupload?.documentTypeId);
    this.documentForm.get("IntakeId")?.setValue(this.Documentupload?.intakeId);
    this.documentForm.get("CourseId")?.setValue(this.Documentupload?.courseId);
    if (this.Documentupload.documentType == 4) {
      // this.getSelectedCourses(this.Documentupload?.courseIntakes);
      // this.documentForm.patchValue(JSON.parse(JSON.stringify(this.Documentupload)));
    }
  }

  getSelectedCourses(courseIntakes: any) {
    courseIntakes.forEach((courseIntake: any) => {
      if (
        this.selectedCourse.findIndex(
          (m) => m == parseInt(courseIntake.split(",")[0])
        ) < 0
      )
        this.selectedCourse.push(courseIntake.split(",")[0]);
      var chkcourse: FormArray = this.documentForm.get("course") as FormArray;
      chkcourse.push(new FormControl(courseIntake));
    });
  }

  getFileName(str: any) {
    if (str != null && str != undefined)
      return str.substring(str.lastIndexOf("/") + 1);
    return "";
  }

  openUploadDocModal(content: any, id: any = 0) {
    this.isFormSubmitted = false;
    this.uploadDocumentForm.reset();
    this.modalTitle = "Upload File";
    this.uploadDocumentForm.get("doctypeId").setValue(id);
    this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      backdrop: false,
      size: "xl",
    });
  }

  resetdocumentForm() {
    if (this.documentForm.contains("documentType")) {
      this.documentForm.get("documentType")?.setValue("");
    }
    if (this.documentForm.contains("samepleDocumentUrl")) {
      this.documentForm.get("sampleDocumentUrl")?.setValue("");
    }
    if (this.documentForm.contains("sampleDocumentName")) {
      this.documentForm.get("sampleDocumentName")?.setValue("");
    }
    if (this.documentForm.contains("formOrLetter")) {
      this.documentForm.get("formOrLetter")?.setValue("");
    }
    if (this.documentForm.contains("formOrLetterName")) {
      this.documentForm.get("formOrLetterName")?.setValue("");
    }
    if (this.documentForm.contains("course")) {
      this.selectedCourse = [];
      var chkCourse = this.documentForm.get("course") as FormArray;
      chkCourse.clear();
    }
    this.documentForm.get("documentName")?.setValue("");
    this.documentForm.get("documentDescription")?.setValue("");
    this.documentForm.get("documentTypeId")?.setValue("0");
    this.DocTypeval = null;
    this.Storeimage = "";
  }
  Storeimage = "";

  changeDocument(event) {
    this.fileNameHTML = "";
    const files = event.target.files;
    if (this.fileValid.checkFileType(files)) {
      for (var i = 0; i < files.length; i++) {
        const reader = new FileReader();
        let file = files[i];
        this.documentForm.get("sampleDocumentName")?.setValue(file.name);
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.Storeimage = reader.result.toString().split(",")[1];
        };
      }
    } else {
      this.isValidFile = false;
      this.documentForm.get("sampleDocumentUrl")?.setValue("");
      this.documentForm.get("sampleDocumentName")?.setValue("");
    }
  }

  get f() {
    return this.documentForm.controls;
  }

  get f1() {
    return this.uploadDocumentForm.controls;
  }
  SaveDocUpload() {
    this.isSubmitted = true;
    if (this.documentForm.valid) {
      $("#loader").show();
      var formVal = JSON.parse(JSON.stringify(this.documentForm.getRawValue()));
      formVal.documentTypeId = parseInt(formVal.documentTypeId);
      // if (formVal.documentCategory != 4) {
      formVal.sampleDocumentName = formVal.sampleDocumentUrl;
      formVal.IsSampleUrlRemove = this.setIsSampleUrlRemove;
      formVal.IsFormLetterUrlRemove = this.setIsFormLetterUrlRemove;
      if (this.Storeimage) {
        formVal.sampleDocumentUrl = this.Storeimage;
      } else {
        formVal.sampleDocumentUrl = "";
      }

      if (!formVal.sampleDocumentName) {
        formVal.sampleDocumentName = "";
      }

      // }
      this.documentService.SaveDocument(formVal).subscribe(
        (res) => {
          if (res.status) {
            this.modalService.dismissAll();
            if (res.data == 0) {
              this.toastr.SuccessToastr("Document Uploaded successfully");
              this.Storeimage = "";
              this.documentForm.get("sampleDocumentUrl")?.setValue("");
              // this.ngOnInit();
              this.setIsFormLetterUrlRemove = false;
              this.setIsSampleUrlRemove = false;
              this.Closemodel();
              this.tabClick(this.Storeeindex);
            } else {
              this.toastr.SuccessToastr("Document updated successfully");
              this.Storeimage = "";
              this.documentForm.get("sampleDocumentUrl")?.setValue("");
              this.Closemodel();
              this.tabClick(this.Storeeindex);
              this.setIsFormLetterUrlRemove = false;
              this.setIsSampleUrlRemove = false;
            }
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
    } else {
      $("#loader").hide();
      // if (this.documentForm.get("course").hasError("selectIntake")) {
      //   setTimeout(() => {
      //     this.documentForm.get('course').setErrors({ 'selectIntake': true });
      //   }, 1);
      // }
    }
  }

  ChageCheck(id) {
    if (id == 1) {
      $("#GovermentBox" + id + "").prop("checked", true);
      $("#GovermentBox" + 2 + "").prop("checked", false);
    } else {
      $("#GovermentBox" + id + "").prop("checked", true);
      $("#GovermentBox" + 1 + "").prop("checked", false);
    }
  }

  deleteDoc(id: any) {
    this.alerts
      .ComfirmAlert("Do you want to delete it?", "Yes", "No")
      .then((res) => {
        if (res.isConfirmed) {
          $("#loader").show();
          let deleteInput = {
            documenTypeId: id,
          };
          this.documentService.DeleteDocument(deleteInput).subscribe(
            (res) => {
              if (res.status) {
                this.toastr.SuccessToastr("successfully Deleted.");
                // this.loadDocument();
                this.tabClick(this.Storeeindex);
              } else {
                this.toastr.ErrorToastr(res.message);
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
      });
  }

  ADtext = "";
  ActiveDoc(id: any, status: any) {
    if (status) this.ADtext = "deactivate";
    else this.ADtext = "active";

    this.alerts
      .ComfirmAlert("Do you want to " + this.ADtext + "?", "Yes", "No")
      .then((res) => {
        if (res.isConfirmed) {
          $("#loader").show();
          let deleteInput = {
            documenTypeId: id,
            status: !status,
          };
          this.documentService.changeDocumentStatus(deleteInput).subscribe(
            (res) => {
              if (res.status) {
                this.toastr.SuccessToastr("successfully Updated.");
                // this.loadDocument();
                this.tabClick(this.Storeeindex);
              } else {
                this.toastr.ErrorToastr(res.message);
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
      });
  }

  uploadDocument() {
    this.isFormSubmitted = true;
    if (this.uploadDocumentForm.valid) {
      $("#loader").show();
      let input = JSON.stringify(this.uploadDocumentForm.getRawValue());

      this.documentService.UpdateDocumentType(input).subscribe((res) => {
        if (res.status) {
          this.modalService.dismissAll();
          this.toastr.SuccessToastr("File uploaded successfully");
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
        $("#loader").hide();
      });
      $("#loader").hide();
    }
  }

  convertFileToBase64(event: any) {
    const files = event.target.files;
    this.isValidFile = true;
    if (this.fileValid.checkFileType(files)) {
      for (var i = 0; i < files.length; i++) {
        const reader = new FileReader();
        let file = files[i];
        reader.readAsDataURL(file);
        reader.onload = () => {
          var base64result = reader.result.toString().split(",")[1];
          this.uploadDocumentForm.get("docTypecontent").setValue(base64result);
          this.uploadDocumentForm.get("documentName").setValue(file.name);
        };
      }
    } else {
      this.isValidFile = false;
    }
  }
  _handleReaderLoaded(e: any) {
    let reader = e.target;
    var base64result = reader.result.substr(reader.result.indexOf(",") + 1);
    this.uploadDocumentForm.get("docTypecontent").setValue(base64result);
  }

  changeFormLetterDocument(event: any) {
    this.IsDocFilled = "";
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
      this.documentForm.get("formOrLetter")?.setValue("");
    }
  }
}
