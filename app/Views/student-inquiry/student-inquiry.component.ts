import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentInquiry } from 'src/app/models/student-inquiry.model';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { ToastrServiceService } from 'src/app/services/toastr-service.service';
import { UserInquiryService } from 'src/app/services/user-inquiry.service';
import { Campus } from 'src/app/models/campus.model';
import { Enquirystatus } from 'src/app/Models/enquirystatus.model';
import { CampusService } from 'src/app/services/campus.service';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { AccountService } from 'src/app/Services/account.service';
import { Country } from 'src/app/Models/country.model';
import { SocialreferenceService } from 'src/app/services/socialreference.service';
import { EmittService } from 'src/app/Services/emitt.service';
import * as moment from 'moment';
import { FileValidationService } from 'src/app/Services/file-validation.service';
import { AppConfig } from 'src/app/appconfig';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-student-inquiry',
  templateUrl: './student-inquiry.component.html',
  styleUrls: ['./student-inquiry.component.sass']
})
export class StudentInquiryComponent implements OnInit {
  campuses: Array<Campus> = [];
  countries: Array<Country> = [];
  enquirystus: Array<Enquirystatus> = [];
  receiptUrl: any;
  emailFile: any;
  emailFileView: any;
  emailFileName: any;
  isValidFile = true;
  form: FormGroup = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl(),
    campusId: new FormControl(),
    inquiryStatus: new FormControl(),
    message: new FormControl(),
    inquiryId: new FormControl(),
  });

  heading = 'Recent Enquiries';
  subheading = '';
  icon = 'lnr-laptop-phone';
  faStar = faStar;
  faPlus = faPlus;
  IsView:boolean=false
  IsNew:boolean=false
  userType: number = 0;
  isSubmitted: boolean = false;
  dtOptions: DataTables.Settings = {};
  inquiries: Array<StudentInquiry> = [];
  studentInquiry: StudentInquiry = new StudentInquiry();
  modalTitle = "Add Enquiry";

  // header inputs
  hasViewModel: boolean = false;
  headerCampusId: number = 0;
  headerIntakeId: number = 0;
  //Edit inquiry variables
  inquiryCampusId: any;
  inquirySourceId: any;
  inquiryCountryId: any;
  inquiryAssignedToId: any;
  inquiryStatusId: any;
  AssigedUserDetail: any;
  AssigedUserGroupDetail: [];
  ufpSources: any;
  Buttons = [];
  @ViewChild("inquiryModal") inquiryModal: ElementRef
  @ViewChild("EmailInquiryModal") EmailInquiryModal: ElementRef
  constructor(private userInquiryService: UserInquiryService, private emitService: EmittService, private campusService: CampusService, private router: Router, private alerts: AlertServiceService, private toastr: ToastrServiceService, private modalService: NgbModal, private formBuilder: FormBuilder, private sessionUser: SessionStorageService, private accountService: AccountService, private SocialPreferece: SocialreferenceService, private emittService: EmittService, private fileValid: FileValidationService, private domSanitizer: DomSanitizer, private appConfig: AppConfig) {
    this.form = formBuilder.group({
      inquiryId: ['0'],
      firstName: ['', [Validators.required, this.noWhitespaceValidator]],
      lastName: ['', [Validators.required, this.noWhitespaceValidator]],
      email: ['', [Validators.required, Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}")]],
      campusId: ['', [Validators.required]],
      inquiryStatus: ['', [Validators.required]],
      message: [''],
      references: [''],
    });
    emittService.onChangeAddApplicationbtnHideShow(false);
    emittService.GetCampusIntakeChange().subscribe(res => {

      this.headerCampusId = res.campusId;
      this.headerIntakeId = res.intakeId;
      //this.DatatableBind();

    });
  }
  public noWhitespaceValidator(control: FormControl) {
    return (control.value || '').trim().length? null : { 'whitespace': true };
}
  ngOnInit(): void {
    this.DatatableBind();
    this.loadButtons();
    this.loadForm();
    this.userType = parseInt(this.sessionUser.getUserType());
    this.headerFilter();
  }
  loadButtons() {
    this.Buttons.push({
      id: 6,
      name: "Created By",
      isChecked: false
    });
    this.Buttons.push({
      id: 7,
      name: "Updated On",
      isChecked: false
    });
    this.Buttons.push({
      id: 8,
      name: "Updated By",
      isChecked: false
    });
    this.Buttons.push({
      id: 9,
      name: "Description",
      isChecked: false
    });
  }
  headerFilter() {
    this.emittService.GetCampusIntakeChange().subscribe(res => {
      this.headerCampusId = res.campusId;
      this.headerIntakeId = res.intakeId;
      $(".table").DataTable().ajax.reload();
    });
  }


  loadForm() {
    // $('#loader').show();
    let paginationModal = {
      index: 0,
      size: 0
    };
    let campusData = this.campusService.getAllCampaus(paginationModal);
    let enquiryStatusData = this.userInquiryService.getAllEnquiryStatus(paginationModal);
    let countryData = this.accountService.getCountries();
    let AssignedUser = this.userInquiryService.GetAssignedToUsers();
    let Sources = this.SocialPreferece.getSources();
    forkJoin([campusData, enquiryStatusData, countryData, AssignedUser, Sources]).subscribe(result => {

      if (result[0]) {
        if (result[0].status) {
          this.campuses = result[0].data.records;
        }
        else {
          this.toastr.ErrorToastr(result[0].message);
        }
      }
      if (result[0]) {
        if (result[0].status) {
          this.enquirystus = result[1].data.records;
        }
        else {
          this.toastr.ErrorToastr(result[1].message);
        }
      }



      if (result[0]) {
        if (result[0].status) {
          this.countries = result[2].data;
        }
        else {
          this.toastr.ErrorToastr(result[2].message);
        }
      } if (result[0]) {
        if (result[0].status) {
          this.AssigedUserGroupDetail = result[3].data;

        }
        else {
          this.toastr.ErrorToastr(result[3].message);
        }
      }
      if (result[0]) {
        if (result[0].status) {
          this.ufpSources = result[4].data;
        }
        else {
          this.toastr.ErrorToastr(result[4].message);
        }
      }
      $('#loader').hide();
    }, (err: any) => {
      // $('#loader').hide();
      if (err.status == 401) {
        this.router.navigate(['/'])
      }
      else {
        this.toastr.ErrorToastr("Something went wrong");
        $('#loader').hide();
      }
    })
  }

  groupByFn = (item) => item.userTypeName;
  selectedAccounts = [1];
  groupValueFn = (_: string, children: any[]) => ({ name: children[0].userTypeName });

  DatatableBind() {
    $('#loader').show();
    let input = {
      campusId: this.headerCampusId,
      intakeId: this.headerIntakeId,
      Size: 10,
      Index: 1,
      Search: '',
      OrderByDirection: '',
      sortingColumn: 0,
      OrderBy: ''
    }

    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      responsive: true,
      scrollX: true,
      retrieve: true,
      searching: true,
      order: [10, 'desc'],
      language: {
        infoFiltered: ""
      },
      ajax: async (dataTablesParameters: any, callback) => {
        this.inquiries = [];
        input.Size = dataTablesParameters.length;
        input.Index = dataTablesParameters.start;
        input.Search = dataTablesParameters.search.value;
        input.OrderByDirection = dataTablesParameters.order[0].dir;
        input.campusId = parseInt(this.sessionUser.getCampusId());
        input.intakeId = parseInt(this.sessionUser.getIntakeId());
        //input.OrderByDirection = "FullName"
        input.sortingColumn = dataTablesParameters.order[0].column;
        input.OrderBy = dataTablesParameters.columns[input.sortingColumn].name;
       await this.userInquiryService.GetAllInquiry(input).subscribe(res => {
          this.inquiries = res.data.records;
          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: res.data.records
          });

        });
        $('#loader').hide();
      },
      columns: [
        { name: 'lastName', data: 'lastName', orderable: true, searchable: true },
        { name: 'firstname', data: 'firstName', orderable: true, searchable: true },
        { name: 'email', data: 'email', orderable: true, searchable: true },
        { name: 'campusName', data: 'campusName', orderable: true, searchable: true },
        {
          name: 'InquiryStatusName', data: 'statusName', orderable: true, searchable: true, render: function (data, type, row) {
            return '<button class="btn rounded-pill ' + row.className + '" >' + data + ' </button>';
          }
        },
        {
          name: 'createdDate', data: 'createdDate', orderable: true, searchable: true, render: function (data, type, row) {
            return moment(data).format('DD/MM/YY hh:mm A')
          }
        },
        { name: 'createUser.Name', data: 'created', orderable: true, searchable: true, visible: false },
        {
          name: 'im.updatedDate', data: 'updatedDate', orderable: true, searchable: true, visible: false, render: function (data, type, row) {
            return moment(data + 'Z').format('DD/MM/YY hh:mm A')
          }
        },
        { name: 'updateuser.Name', data: 'updated', orderable: true, visible: false, searchable: true },
        { name: 'im.Messgage', data: 'message', orderable: true, visible: false, searchable: true },
        {
          name: '', data: 'inquiryId', orderable: false, searchable: false, render: function (data, type, row) {
            var htmlButton = '<button class="btn-shadow btn btn-success fa fa-pencil  me-2 pointer" title="Edit" onClick=\"document.getElementById(\'hdnClickEdit\').value=' + data + '; document.getElementById(\'hdnClickEdit\').click()\"></button><button class="btn-shadow btn btn-warning me-2 pointer fa fa-eye" title="View" onClick=\"document.getElementById(\'hdnClickView\').value=' + data + '; document.getElementById(\'hdnClickView\').click()\"></button><button class="btn-shadow btn btn-danger pointer me-2 fa fa-trash" title="Delete" onClick=\"document.getElementById(\'hdnClickDelete\').value=' + data + '; document.getElementById(\'hdnClickDelete\').click()\"></button>';
            if (row.statusName.toLowerCase() != 'converted to application')
              htmlButton += '<button class="btn-shadow btn btn-primary ms-2 pointer fa fa-exchange" title="Convert" onClick=\"document.getElementById(\'hdnClickConvert\').value=' + data + '; document.getElementById(\'hdnClickConvert\').click()\" title=\'Convert to Application\'></button>';
            return htmlButton;
          }
        },
      ],
      autoWidth: false,
    }
    $('#loader').hide();
  }
  get f() {
    return this.form.controls;
  }

  deleteInquiry(e) {
    this.alerts.ComfirmAlert("Do you want to delete inquiry?", "Yes", "No").then(res => {

      if (res.isConfirmed) {
        $('#loader').show();
        let deleteInput = {
          id: e.target.value
        };
        this.userInquiryService.RemoveInquiry(deleteInput).subscribe(res => {

          if (res.status) {
            this.toastr.SuccessToastr("Student inquiry deleted successfully.");
            $('#loader').hide();
            $(".table").DataTable().ajax.reload();
          }
          else {
            this.toastr.ErrorToastr(res.message);
            $('#loader').hide();
          }
        },
          (err: any) => {
            $('#loader').hide();
            if (err.status == 401) {
              this.router.navigate(['/']);
            }
            else {
              this.toastr.ErrorToastr("Something went wrong");
              $('#loader').hide();
            }
          })
      }
    })
  }

  changeEnquiryStatus(EnquiryId: any, EnquiryStatusId: any) {
    this.alerts.ComfirmAlert("Are you sure you want to change an Enquiry status", "Yes", "No").then(res => {
      if (res.isConfirmed) {
        $('#loader').show();
        let Input = {
          ContentId: parseInt(EnquiryId.toString()),
          StatusId: parseInt(EnquiryStatusId.toString()),
        };
        this.userInquiryService.ChangeInquiryStatusById(Input).subscribe(res => {

          if (res.status) {
            this.toastr.SuccessToastr("Enquiry status changed successfully");
            //$(".table").DataTable().ajax.reload();
          }
          else {
            this.toastr.ErrorToastr(res.message);
            $('#loader').hide();
          }
        },
          (err: any) => {
            $('#loader').hide();
            if (err.status == 401) {
              this.router.navigate(['/']);
            }
            else {
              this.toastr.ErrorToastr("Something went wrong");
              $('#loader').hide();
            }
          })
      } else {
        $(".table").DataTable().ajax.reload();
      }
    })
  }
  openLarge(id: any, isView: any) {
    this.isSubmitted = false;
    this.hasViewModel = isView;
    this.form.reset();
    this.resetInquiryForm();

    if (id > 0) {
      this.modalTitle = "Update Inquiry";
      this.EditInquiry(id);
      this.IsView=false
      this.IsNew=false

    }
    else {
      this.inquiryStatusId = this.enquirystus.find(x => x.inquiryStatusName.toLocaleLowerCase() == 'new').id;
      this.modalTitle = "Add Inquiry";
      this.messages = null;
      this.IsView=false
      this.IsNew=true

    }
    if (isView) {
      this.disableInquiryform();
      this.modalTitle = "View Inquiry";
      this.IsView=true
      this.IsNew=false

    } else {
      this.enableInquiryForm();
    }


    this.modalService.open(this.inquiryModal, {
      size: 'lg', backdrop: false
    });
  }


  resetInquiryForm() {
    this.form.get("email")?.setValue("");
    this.form.get("message")?.setValue("");
    this.form.get("firstName")?.setValue("");
    this.form.get("lastName")?.setValue("");
    this.form.get("inquiryStatus")?.setValue("");
    this.form.get("inquiryId")?.setValue("0");

    this.inquiryCampusId = null;
    this.inquirySourceId = null;
    this.inquiryCountryId = null;
    //this.inquiryAssignedToId = null;
    this.inquiryAssignedToId = parseInt(this.sessionUser.getuserID());
    this.inquiryStatusId = null;
    this.emailFile = '';
    this.emailFileName = '';
  }

  SaveInquiry() {
    // this.isSubmitted = true;
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
          this.form.reset(this.form.value);
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


  messages: any = null;
  EditInquiry(index: any) {
    $('#loader').show();
    var input = {
      id: index
    }
    this.userInquiryService.GetInquiryById(input).subscribe(res => {
      this.resetInquiryForm();
      if (res.status) {
        $('#loader').hide();

        this.form.get("email")?.setValue(res.data.email);
         this.form.get("message")?.setValue(res.data.message);
        this.messages = res.data.inquiryMessageMapping;
        if (this.messages && this.messages.length < 1) {
          this.messages = null
        }
        this.form.get("firstName")?.setValue(res.data.firstName);
        this.form.get("lastName")?.setValue(res.data.lastName);
        this.form.get('inquiryId')?.setValue(res.data.inquiryId);
        this.inquiryCampusId = res.data.campusData.campusId;
        this.inquiryStatusId = res.data.inquiryStatusId;
        this.emailFileView = '';
        this.emailFileView = res.data.emailFile
      }
      else {
        this.toastr.ErrorToastr(res.message);
        $('#loader').hide();
      }

    }, (err: any) => {
      $('#loader').hide();
      if (err.status == 401) {
        this.router.navigate(['/']);
      }
      else {
        this.toastr.ErrorToastr("Something went wrong");
        $('#loader').hide();
      }
    })



  }
 
  filterItem(event) {
    if (!event) {
      this.AssigedUserDetail.subAdmins = this.AssigedUserDetail.subAdmins;
      this.AssigedUserDetail.regionalManagers = this.AssigedUserDetail.regionalManagers;
      this.AssigedUserDetail.agents = this.AssigedUserDetail.agents;
    } // when nothing has typed*/
    if (typeof event === 'string') {
      this.AssigedUserDetail.subAdmins = this.AssigedUserDetail.subAdmins.filter((a: { name: string; }) => a.name.toLowerCase()
        .startsWith(event.toLowerCase()));
      this.AssigedUserDetail.regionalManagers = this.AssigedUserDetail.regionalManagers.filter((a: { countryName: string; }) => a.countryName.toLowerCase()
        .startsWith(event.toLowerCase()));
      this.AssigedUserDetail.agents = this.AssigedUserDetail.agents.filter((a: { countryName: string; }) => a.countryName.toLowerCase()
        .startsWith(event.toLowerCase()));
    }
  }

  enableInquiryForm() {
    this.form.get("email")?.enable();
    this.form.get("message")?.enable();
    this.form.get("firstName")?.enable();
    this.form.get("dob")?.enable();
    this.form.get("lastName")?.enable();
    this.form.get("inquiryStatus")?.enable();
    this.form.get("campusId")?.enable();
  }

  disableInquiryform() {
    this.form.get("email")?.disable();
    this.form.get("message")?.disable();
    this.form.get("firstName")?.disable();
    this.form.get("lastName")?.disable();
    this.form.get("inquiryStatus")?.disable();
    this.form.get("campusId")?.disable();
  }


  clickEdit(e) {
    this.openLarge(e.target.value, false)
  }
  clickView(e) {
    this.openLarge(e.target.value, true)
  }

  hideShowColumn(e) {
    var col = $(".table").DataTable().column(e);
    col.visible(!col.visible());
    var colindex = this.Buttons.findIndex(m => m.id == e);
    this.Buttons[colindex].isChecked = col.visible();
  }

  ConvertToApplication(e) {
    let input = {
      action: 'add',
      inquiryId: e.target.value
    }
    this.emitService.onchangeApplicationId(input);
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
    }
    else {
      this.isValidFile = false;
    }

  }
  _handleReaderLoaded(e: any) {
    let reader = e.target;
    var base64result = reader.result.substr(reader.result.indexOf(',') + 1);
    this.emailFile = base64result;
  }
  openModelEmail() {
    this.receiptUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.appConfig.baseServiceUrl + this.emailFileView);
    this.modalService.open(this.EmailInquiryModal, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
  }
  // addNewApplication() {
  //   let input = {
  //     action: 'add'
  //   }
  //   this.emitService.onchangeApplicationId(input);
  // }
}
