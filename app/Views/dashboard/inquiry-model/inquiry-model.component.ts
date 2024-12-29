import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { forkJoin } from "rxjs";
import { CampusService } from "src/app/services/campus.service";
import { SocialreferenceService } from "src/app/services/socialreference.service";
import { ToastrServiceService } from "src/app/services/toastr-service.service";
import { UserInquiryService } from "src/app/services/user-inquiry.service";

@Component({
  selector: "app-inquiry-model",
  templateUrl: "./inquiry-model.component.html",
  styleUrls: ["./inquiry-model.component.sass"],
})
export class InquiryModelComponent implements OnChanges, OnInit {
  @Input() inquiryId = 0;
  @Input() isEditable = false;
  @Output() closeModel = new EventEmitter<void>();
  modalTitle = "View Inquiry";
  inquiryCampusId: any;
  inquiryStatusId: any;
  emailFileView: any;
  emailFile: any;
  emailFileName: any;
  form: FormGroup;
  messages: any = null;
  isValidFile = true;
  @ViewChild("inquiryModal") inquiryModal: ElementRef;
  campuses: any;
  enquirystus: any;
  AssigedUserGroupDetail: any;
  ufpSources: any;
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private userInquiryService: UserInquiryService,
    private toastr: ToastrServiceService,
    private router: Router,
    private campusService: CampusService,
    private SocialPreferece: SocialreferenceService
  ) {
    this.buildForm();
  }
  ngOnInit(): void {
    this.loadForm();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["inquiryId"]) {
      if (this.inquiryId > 0) {
        this.openModel();
      }
    }
  }

  buildForm() {
    this.form = this.fb.group({
      firstName: [""],
      lastName: [""],
      email: [""],
      campusId: [""],
      inquiryStatus: [""],
      message: [""],
      inquiryId: [""],
    });
  }

  get f() {
    return this.form.controls;
  }

  loadForm() {
    let paginationModal = {
      index: 0,
      size: 0,
    };
    let campusData = this.campusService.getAllCampaus(paginationModal);
    let enquiryStatusData =
      this.userInquiryService.getAllEnquiryStatus(paginationModal);
    let AssignedUser = this.userInquiryService.GetAssignedToUsers();
    let Sources = this.SocialPreferece.getSources();
    forkJoin([campusData, enquiryStatusData, AssignedUser, Sources]).subscribe(
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
            this.AssigedUserGroupDetail = result[2].data;
          } else {
            this.toastr.ErrorToastr(result[2].message);
          }
        }
        if (result[3]) {
          if (result[3].status) {
            this.ufpSources = result[3].data;
          } else {
            this.toastr.ErrorToastr(result[3].message);
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

  openModel() {
    this.EditInquiry();
    if (!this.isEditable) {
      this.form.disable();
      this.modalTitle = "View Inquiry";
    } else {
      this.modalTitle = "Edit Inquiry";
      this.form.enable();
    }
    let modelInst = this.modalService.open(this.inquiryModal, {
      size: "lg",
      backdrop: false,
    });
    modelInst.dismissed.subscribe(() => this.closeModel.next());
  }

  EditInquiry() {
    $("#loader").show();
    var input = {
      id: this.inquiryId,
    };
    this.userInquiryService.GetInquiryById(input).subscribe(
      (res) => {
        this.form.reset();
        if (res.status) {
          $("#loader").hide();

          this.messages = res.data.inquiryMessageMapping;
          if (this.messages && this.messages.length < 1) {
            this.messages = null;
          }
          this.form.patchValue(res.data);
          this.inquiryCampusId = res.data.campusData.campusId;
          this.inquiryStatusId = res.data.inquiryStatusId;
          this.emailFileView = "";
          this.emailFileView = res.data.emailFile;
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

  SaveInquiry() {
    if (this.form.valid) {
      $('#loader').show();
      let formVal = JSON.stringify(this.form.getRawValue());
      let input = {
        ...JSON.parse(formVal),
        emailFile: this.emailFile,
        emailFileName: this.emailFileName
      }
      input.campusId = parseInt(input.campusId.toString());
      input.inquiryStatus = parseInt(input.inquiryStatus);
      if(input.message == null || input.message == "" || input.message == undefined)
      input.message = "";
      this.userInquiryService.AddInquiryFn(input).subscribe(res => {

        if (res.status) {
          this.modalService.dismissAll();
          if (res.data.inquiryId == 0)
            this.toastr.SuccessToastr("Student inquiry added successfully.");
          else
            this.toastr.SuccessToastr("Student inquiry updated successfully.");
          $('#loader').hide();
          this.form.reset();
          this.resetInquiryForm();
          $(".table").DataTable().ajax.reload();
        }
        else {
          this.toastr.ErrorToastr("Student inquiry is not added.");
          $('#loader').hide();
        }
      }, (err: any) => {
        //$('#loader').hide();
        this.toastr.ErrorToastr("Something missing");
        $('#loader').hide();
      });

    }
  }
  resetInquiryForm() {
    this.form.reset();
    this.inquiryCampusId = null;
    this.inquiryStatusId = null;
    this.emailFile = '';
    this.emailFileName = '';
  }
}
