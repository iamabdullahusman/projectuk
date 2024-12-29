import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentInquiry } from 'src/app/models/student-inquiry.model';
import { AlertServiceService } from 'src/app/Services/alert-service.service';
import { ToastrServiceService } from 'src/app/Services/toastr-service.service';
import { UserInquiryService } from 'src/app/services/user-inquiry.service';
import { Campus } from 'src/app/models/campus.model';
import { Enquirystatus } from 'src/app/Models/enquirystatus.model';
import { CampusService } from 'src/app/services/campus.service';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { SessionStorageService } from 'src/app/Services/session-storage.service';
import { AccountService } from 'src/app/Services/account.service';
import { Country } from 'src/app/Models/country.model';
import { SocialreferenceService } from 'src/app/services/socialreference.service';
import { EmittService } from 'src/app/Services/emitt.service';
import { FileValidationService } from 'src/app/Services/file-validation.service';
import { TodoTaskService } from 'src/app/Services/todo-task.service';
import { DownloadfileService } from 'src/app/Services/downloadfile.service';
import * as moment from 'moment';
import { TaskTypeEnum } from 'src/app/Models/task-type-enum';
import { ApplicationOfferService } from 'src/app/Services/application-offer.service';
import { KanbanService } from 'src/app/Services/kanban.service';
import { ApplicationService } from 'src/app/services/application.service';
import { IntakeService } from 'src/app/services/intake.service';
import { FeePayByService } from 'src/app/Services/feepayby.service';
import { UserManagement } from 'src/app/Services/user-management.service';
import { VisaService } from 'src/app/Services/visa.service';
import { OnboardService } from 'src/app/Services/onboard.service';
import { CoursesService } from 'src/app/services/courses.service';
import { DocumentService } from 'src/app/Services/document.service';

@Component({
  selector: 'app-todo-task',
  templateUrl: './todo-task.component.html',
  styleUrls: ['./todo-task.component.sass']
})
export class TodoTaskComponent implements OnInit {

  // AssigedUserGroupDetail: any[] = []; // This holds the data for your dropdown
  // taskAssignTo: any; // This will hold the selected value

  campuses: Array<Campus> = [];
  countries: Array<Country> = [];
  enquirystus: Array<Enquirystatus> = [];
  requestFrom = 'todo';
  currentDate = moment().format('YYYY-MM-DD');
  heading = 'My To Do List';
  subheading = '';
  icon = 'lnr-laptop-phone';
  faStar = faStar;
  faPlus = faPlus;

  userType: number = 0;
  isSubmitted: boolean = false;
  dtOptions: DataTables.Settings = {};
  todoTasks: Array<any> = [];
  studentInquiry: StudentInquiry = new StudentInquiry();
  modalTitle = "Add Task";

  // header inputs
  hasViewModel: boolean = false;
  headerCampusId: number = 0;
  headerIntakeId: number = 0;

  //Edit inquiry variables
  inquiryCampusId: any;
  inquirySourceId: any;
  inquiryCountryId: any;
  inquiryAssignedToId: any;
  taskStausId: any;
  AssigedUserDetail: any;
  AssigedUserGroupDetail: [];
  ufpSources: any;

  taskAssignBy: any;
  taskAssignTo: any;
  taskAttachment: any;

  statusList = [
    { statusId: 1, statusName: 'PENDING' },
    { statusId: 2, statusName: 'IN-PROGRESS' },
    { statusId: 3, statusName: 'COMPLETED' },
    { statusId: 4, statusName: 'RE-ASSIGNED' }
  ]

  form: FormGroup = new FormGroup({
    taskId: new FormControl(),
    task: new FormControl(),
    assignById: new FormControl(),
    assignToId: new FormControl(),
    status: new FormControl(),
    completionDate: new FormControl(),
    dueDate: new FormControl(),
    attachments: new FormControl()
  });

  filterForm: FormGroup = new FormGroup({
    status: new FormControl(),
    StartDueDate: new FormControl(),
    EndDueDate: new FormControl(),
    StartComplitionDate: new FormControl(),
    EndComplitionDate: new FormControl(),
    ApplicantName: new FormControl(),
    CompletionDate: new FormControl(),
    DueDate: new FormControl(),
    AssignedTo: new FormControl(),
    Agent: new FormControl(),
    RM: new FormControl(),
  });

  @ViewChild("inquiryModal") todoModel: ElementRef;
  constructor(private OfferService: ApplicationOfferService, private todoService: TodoTaskService, private downloadService: DownloadfileService, private fileValid: FileValidationService, private emittService: EmittService, private kanbanService: KanbanService, private router: Router, private modalService: NgbModal, private accountService: AccountService, private toastr: ToastrServiceService, private applicationService: ApplicationService, private formBuilder: FormBuilder, private campusService: CampusService, private intakeService: IntakeService, private courseService: CoursesService, private route: Router, private feepayService: FeePayByService, private socialReferanceService: SocialreferenceService, private userService: UserManagement, private emitService: EmittService, private documentService: DocumentService, private alerts: AlertServiceService, private sessionUser: SessionStorageService, private userInquiryService: UserInquiryService, private visaService: VisaService, private offerService: ApplicationOfferService, private onboardService: OnboardService) {
    this.form = formBuilder.group({
      taskId: [0],
      task: ['', [Validators.required]],
      assignById: [null, [Validators.required]],
      assignToId: [null], // Ensure this is required if you want validation],
      status: [null, [Validators.required]],
      dueDate: [''],
      completionDate: [''],
      attachments: ['']
    });
    emittService.onChangeAddApplicationbtnHideShow(false);
    emittService.GetCampusIntakeChange().subscribe(res => {

      this.headerCampusId = res.campusId;
      this.headerIntakeId = res.intakeId;
      //this.DatatableBind();

    });
  }

  ngOnInit(): void {
    this.DatatableBind();
    this.loadForm();
    this.userType = parseInt(this.sessionUser.getUserType());
    this.headerFilter();
    this.loaddroupdown();
    //this.loadAssignToDropdown(); // Load data when the component initializes
  }


  assignedTo = [];
  courses: any;
  applicationIntakes: any;
  loaddroupdown() {
    $("#loader").show();
    let paginationModal = {
      index: 0,
      size: 0
    };
    // $('#loader').show();
    let coursesData = this.courseService.getAllCourses(paginationModal);
    let campusData = this.campusService.getAllCampaus(paginationModal);
    let intakeData = this.intakeService.getAllIntake(paginationModal);
    let FeePayOptionData = this.feepayService.getAllFeePayBy(paginationModal);
    let socialPreferenceData = this.socialReferanceService.getAllSocialRef(paginationModal);
    let managedata = this.userInquiryService.GetAssignedToUsers();
    let RMInputs = {
      userType: 3
    }
    let RMData = this.userService.getUsersByType(RMInputs);
    let AgentInputs = {
      userType: 4
    }
    let AgentData = this.userService.getUsersByType(AgentInputs);
    forkJoin([coursesData, campusData, intakeData, FeePayOptionData, socialPreferenceData, RMData, AgentData, managedata]).subscribe(result => {
      $('#loader').hide();
      if (result[0]) {
        if (result[0].status) {
          this.courses = result[0].data.records;
        }
        else {
          this.toastr.ErrorToastr(result[0].message);
        }
      }
      if (result[1]) {
        if (result[1].status) {
          this.campuses = result[1].data.records;
        }
        else {
          this.toastr.ErrorToastr(result[1].message);
        }
      }
      if (result[2]) {
        if (result[2].status) {
          this.applicationIntakes = result[2].data.records;

        }
        else {
          this.toastr.ErrorToastr(result[2].message);
        }
      }
      if (result[3]) {
        if (result[3].status) {
          this.feePayOptions = result[3].data.records;
        }
        else {
          this.toastr.ErrorToastr(result[3].message);
        }
      }
      if (result[4]) {
        if (result[4].status) {
          this.SocialPreferences = result[4].data.records;
        }
        else {
          this.toastr.ErrorToastr(result[4].message);
        }
      }
      if (result[5]) {
        if (result[5].status) {
          this.RMs = result[5].data;
        }
        else {
          this.toastr.ErrorToastr(result[5].message);
        }
      }
      if (result[6]) {
        if (result[6].status) {
          this.Agents = result[6].data;
        }
        else {
          this.toastr.ErrorToastr(result[6].message);
        }
      }
      if (result[7]) {
        if (result[7].status) {
          this.ChangeManageby = result[7].data;
          this.ChangeManageby.unshift({
            name: "All",
            userId: 0,
            userTypeId: 0,
            userTypeName: "All"
          })
          this.RMs = result[7].data.filter(m => m.userTypeId == 3);
          this.agents = result[7].data.filter(m => m.userTypeId == 4);
          this.assignedTo = result[7].data.filter(m => m.userTypeId == 1 || m.userTypeId == 2);
        }
        else {
          this.toastr.ErrorToastr(result[7].message);
        }
      }
      $('#loader').hide();
    }, (err: any) => {
      $('#loader').hide();
      if (err.status == 401) {
        this.route.navigate(['/'])
      }
      else {
        this.toastr.ErrorToastr("Something went wrong");
      }
    })
  }

  feePayOptions: any;
  RMs: any;
  ChangeManageby: any;
  agents: any;
  Agents: any;
  SocialPreferences: any;

  ApplyFilter() {
    $(".table").DataTable().ajax.reload();
  }

  headerFilter() {
    this.emittService.GetCampusIntakeChange().subscribe(res => {
      this.headerCampusId = res.campusId;
      this.headerIntakeId = res.intakeId;
      $(".table").DataTable().ajax.reload();
    });
  }

  loadForm() {
    let paginationModal = {
      index: 0,
      size: 0
    };
    $('#loader').show();
    let taskInputModel = {
      index: 1,
      size: 10,
      search: '',
      orderBy: '',
      orderByDirection: '',
    }
    let AssignedUser = this.userInquiryService.GetAssignedToUsers();
    // let TaskList = this.todoService.getTasks(taskInputModel);
    forkJoin([AssignedUser]).subscribe(result => {
      console.log("Forjoin data of  dropdown",result[0].data);

      if (result[0]) {
        if (result[0].status) {
          this.AssigedUserGroupDetail = result[0].data;

        }
        else {
          this.toastr.ErrorToastr(result[0].message);
        }
      }
      $('#loader').hide();
    }, (err: any) => {

      if (err.status == 401) {
        this.router.navigate(['/'])
      }
      else {
        this.toastr.ErrorToastr("Something went wrong");
      }
      $('#loader').hide();
    })
  }

   groupByFn = (item) => item.userTypeName;
  selectedAccounts = [1];
   groupValueFn = (_: string, children: any[]) => ({ name: children[0].userTypeName });
  

  DatatableBind() {
    $('#loader').show();
    let duestartDate = null
    let dueDateendDate = null
    let ComplitionstartDate = null
    let ComplitionendDate = null

    let input = {
      campusId: this.headerCampusId,
      intakeId: this.headerIntakeId,
      index: 1,
      size: 10,
      orderBy: '',
      orderByDirection: '',
      sortingColumn: '',
      StartComplitionDate: "",
      EndComplitionDate: "",
      StartDueDate: "",
      EndDueDate: "",
      AssignedTo: "",
      search: "",
      status: []
    }

    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      responsive: true,
      order: [0, 'desc'],
      scrollY: "700px",
      scrollX: true,
      scrollCollapse: true,
      retrieve: true,
      searching: true,
      orderCellsTop: true,
      // fixedHeader: true,
      language: {
        infoFiltered: ""
      },
      
      ajax: (dataTablesParameters: any, callback) => {

        var inputData = JSON.parse(JSON.stringify(this.filterForm.getRawValue()));
        if (inputData.DueDate == null)
          duestartDate = null
        else
          duestartDate = inputData.DueDate.startDate
        if (inputData.DueDate == null)
          dueDateendDate = null
        else
          dueDateendDate = inputData.DueDate.endDate


        if (inputData.CompletionDate == null)
          ComplitionstartDate = null
        else
          ComplitionstartDate = inputData.CompletionDate.startDate
        if (inputData.CompletionDate == null)
          ComplitionendDate = null
        else
          ComplitionendDate = inputData.CompletionDate.endDate


        this.todoTasks = [];
        input.size = dataTablesParameters.length;
        input.index = dataTablesParameters.start;
        input.search = inputData.ApplicantName;
        var email = this.sessionUser.GetSessionForApplicationname();
        if (email != null && email != undefined && email != "") {
          input.search = email;
        } else if (input.search == null || input.search == undefined || input.search == "") {
          input.search = dataTablesParameters.search.value;
        }
        this.sessionUser.saveSessionForApplicationname("");
        input.orderByDirection = dataTablesParameters.order[0].dir;
        input.campusId = parseInt(this.sessionUser.getCampusId());
        input.intakeId = parseInt(this.sessionUser.getIntakeId());
        input.sortingColumn = dataTablesParameters.order[0].column;
        input.orderBy = dataTablesParameters.columns[input.sortingColumn].name;
        input.StartComplitionDate = ComplitionstartDate;
        input.EndComplitionDate = ComplitionendDate;
        input.StartDueDate = duestartDate;
        input.EndDueDate = dueDateendDate;
        input.AssignedTo = inputData.AssignedTo;
        if(inputData.status)
        {
          if(Array.isArray(inputData.status))
          {
            input.status = inputData.status
          }
          else
          {
           var statusValue=[];
           statusValue.push(input.status)
          }
        }      
        this.todoService.getTasks(input).subscribe(res => {
          this.todoTasks = res.data.records;

          console.log("task", this.todoTasks)

          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: res.data.records
          });
          $('#loader').hide();
        });
      },
      columns: [

        {
          data: 'createdDate', name: 'createddate', orderable: true, searchable: true, render: function (data, type, row) {
            return moment(data + 'Z').format('DD/MM/YY')
          }
        },
        {
          data: 'task', name: 'task', orderable: true, searchable: true, render: function (data, type, row) {
            if (row.applicationID)
              return '<span class="pointer" onClick="document.getElementById(\'appId\').value=' + row.applicationID + ';document.getElementById(\'tasktypeId\').value=' + row.taskTypeId + '; document.getElementById(\'btnapp\').click()">' + data + '</span>';
            else
              return data;
          }
        },
        { data: 'assignByName', name: 'assignBy.Name', orderable: true, searchable: true, render: function (data, type, row) { if (data == null) return "System"; else return data } },
        { data: 'assignToName', name: 'assignto.Name', orderable: true, searchable: true },
        {
          data: 'statusname', name: 'statusname', orderable: true, searchable: true, render: function (data, type, row) {
            if (row.status == 1)
              return '<button class="btn rounded-pill btn-warning text-light">' + 'PENDING' + ' </button>';
            else if (row.status == 3)
              return '<button class="btn rounded-pill btn-success text-light">' + 'COMPLETED' + '</button>';
            else if (row.status == 2)
              return '<button class="btn rounded-pill btn-info text-light">' + 'IN-PROGRESS' + ' </button>'
            else if (row.status == 4)
              return '<button class="btn rounded-pill btn-danger text-light"> ' + 'RE-ASSIGNED' + '</button>';
          }
        },
        {
          data: 'dueDate', name: 'tm.DueDate', orderable: true, searchable: true, render: function (data, type, row) {
            if (data != null) {
              return moment(data + 'Z').format('DD/MM/YY')
            }
            else
              return '';
          }
        },
        {
          data: 'completionDate', name: 'tm.CompletionDate', orderable: true, searchable: true, render: function (data, type, row) {
            if (data)
              return moment(data + 'Z').format('DD/MM/YY')
            else
              return '';
          }
        },
        { data: 'attachment', name: '', orderable: false, searchable: false },
        {
          data: 'taskId', name: '', orderable: false, searchable: false, render: function (data, type, row) {
            if (row.applicationID) {
              return ''
            }
            else {
              return '<button class="btn-shadow btn btn-success me-2" onClick="document.getElementById(\'taskId\').value=' + data + ';document.getElementById(\'action\').value=\'true\'; document.getElementById(\'btninquiry\').click()"> Edit </button><button class="btn-shadow btn btn-warning" onClick="document.getElementById(\'taskId\').value=' + data + ';document.getElementById(\'action\').value=\'false\'; document.getElementById(\'btninquiry\').click()"> View </button>'
            }
          }
        }
      ],
      autoWidth: false
    }

  }

  datePickerChangeCompletionDate(e) {
    if (!e.startDate)
      this.filterForm.get("CompletionDate").reset();
  }

  datePickerChangeDueDate(e) {
    if (!e.startDate)
      this.filterForm.get("DueDate").reset();
  }


  pagerefrance() {
    $('.table').DataTable().ajax.reload();
  }

  get f() {
    return this.form.controls;
  }

  deleteInquiry(id: any) {
    this.alerts.ComfirmAlert("Do you want to delete inquiry?", "Yes", "No").then(res => {
      if (res.isConfirmed) {
        $('#loader').show();
        let deleteInput = {
          id: id
        };
        this.userInquiryService.deleteInquiry(deleteInput).subscribe(res => {

          if (res.status) {
            this.toastr.SuccessToastr("Student inquiry deleted successfully.");
            $(".table").DataTable().ajax.reload();
          }
          else {
            this.toastr.ErrorToastr(res.message);
          }
          $('#loader').hide();
        },
          (err: any) => {

            if (err.status == 401) {
              this.router.navigate(['/']);
            }
            else {
              this.toastr.ErrorToastr("Something went wrong");
            }
            $('#loader').hide();
          })
      }
    })
  }

  openLarge(id: any, isView: any) {
    this.currentDate = moment().format('YYYY-MM-DD');
    this.isSubmitted = false;
    this.hasViewModel = isView;
    this.form.reset(this.form.value);
    this.resetTaskForm();
    this.filename = '';
    if (id > 0) {
      this.modalTitle = "Update Task";
      this.EditInquiry(id);
    }
    else {
      // this.taskStausId = this.enquirystus.find(x => x.inquiryStatusName.toLocaleLowerCase() == 'cold').taskStausId;
      this.taskAssignTo = parseInt(this.sessionUser.getuserID());
      this.taskAssignBy = parseInt(this.sessionUser.getuserID());
      this.modalTitle = "Add Task";
    }
    if (isView) {
      this.disableTaskform();
    } else {
      this.enableTaskform();
    }
    this.form.get('assignById')?.disable();
    this.modalService.open(this.todoModel, {
      size: 'lg', backdrop: false
    });
  }

  resetTaskForm() {
    this.form.get("taskId")?.setValue(0);
    this.form.get("task")?.setValue("");
    this.form.get("assignById")?.setValue(null);
    this.form.get("assignToId")?.setValue(null);
    this.form.get("status")?.setValue(null);
    this.form.get("dueDate")?.setValue("");
    this.form.get("completionDate")?.setValue("");

    this.taskStausId = 1;
    this.taskAssignBy = null;
    this.taskAssignTo = null;
  }

  SaveTask() {
    this.isSubmitted = true;
    if (this.form.valid) {
      $('#loader').show();
      let formVal = JSON.stringify(this.form.getRawValue());

      let input = {
        ...JSON.parse(formVal)
      }
      input.attachments = this.taskAttachment;
      if (input.completionDate == undefined||input.completionDate == "") {
        input.completionDate = null;
      }
      if (input.dueDate == undefined||input.dueDate == "") {
        input.dueDate = null;
      }
      console.log("InPUT", input);
      this.todoService.addTask(input).subscribe(res => {
        console.log("ook save ",res);
        

        if (res.status) {
          this.modalService.dismissAll();
          if (input.taskId > 0)
            this.toastr.SuccessToastr("Task updated successfully.");
          else
            this.toastr.SuccessToastr("Task added successfully.");
          //  $("#application").DataTable().ajax.reload();

        //  this.isSubmitted = false;
          $('#loader').hide();
          this.form.reset();
          this.resetTaskForm();
          $(".table").DataTable().ajax.reload();
        
        }
        else {
          this.toastr.ErrorToastr("Task not added.");
        }
      }, (err: any) => {
        $('#loader').hide();
        this.toastr.ErrorToastr("Something missing");
      });
    }

  }

  filename: any;
  completionDate = moment().format('YYYY-MM-DD');
  EditInquiry(index: any) {
    let taskDetail = this.todoTasks.find(m => m.taskId == index);
    this.resetTaskForm();
    this.form.get('taskId')?.setValue(taskDetail.taskId);
    this.form.get("task")?.setValue(taskDetail.task);
    this.form.get("status")?.setValue(taskDetail.status);
    this.form.get("assignById")?.setValue(taskDetail.assignById);
    this.form.get("assignToId")?.setValue(taskDetail.assignToId);
    this.form.get("dueDate")?.setValue(taskDetail.dueDate?.split('T')[0]);

    this.form.get("references")?.setValue(taskDetail.references);
    this.form.get('inquiryId')?.setValue(taskDetail.inquiryId);
    this.filename = taskDetail.attahcmentName;
    this.taskStausId = taskDetail.status;
    this.taskAssignBy = taskDetail.assignById;
    this.taskAssignTo = taskDetail.assignToId;
    this.currentDate = taskDetail.createdDate?.split('T')[0];
    this.completionDate = taskDetail.dueDate?.split('T')[0];

    this.form.get("completionDate")?.setValue(taskDetail.completionDate?.split('T')[0]);
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

  enableTaskform() {
    this.form.get("taskId")?.enable();
    this.form.get("task")?.enable();
    this.form.get("assignById")?.enable();
    this.form.get("assignToId")?.enable();
    this.form.get("status")?.enable();
    this.form.get("dueDate")?.enable();
    this.form.get("completionDate")?.enable();
    this.form.get("attachments")?.enable();
  }

  disableTaskform() {
    this.form.get("taskId")?.disable();
    this.form.get("task")?.disable();
    this.form.get("assignById")?.disable();
    this.form.get("assignToId")?.disable();
    this.form.get("status")?.disable();
    this.form.get("dueDate")?.disable();
    this.form.get("completionDate")?.disable();
    this.form.get("attachments")?.disable();
  }

  isValidFile: boolean;
  convertFileToBase64(event: any) {
    const files = event.target.files;
    this.isValidFile = true;
    if (this.fileValid.checkFileType(files)) {
      for (var i = 0; i < files.length; i++) {
        const reader = new FileReader();
        let file = files[i];
        reader.readAsDataURL(file);
        reader.onload = () => {
          var base64result = reader.result.toString().split(',')[1];
          let attachment = {
            taskAttachmentId: 0,
            attachment: base64result,
            attachmentName: file.name,
            attahcmentMEMEType: file.type
          }
          this.taskAttachment = attachment;
        }
      }
    }
    else {
      this.isValidFile = false;
    }
  }

  _handleReaderLoaded(e: any, file: any) {
    let reader = e;
    var base64result = reader.result.substr(reader.result.indexOf(',') + 1);
    let attachment = {
      taskAttachmentId: 0,
      Attachment: base64result,
      AttachmentName: e.target.filename,
      attahcmentMEMEType: ''
    }
    this.taskAttachment = attachment;
    //this.uploadDocumentForm.get('docTypecontent').setValue(base64result);
  }

  downloadForm(url) {
    this.downloadService.DownloadFile(url).subscribe(res => {
      let a = document.createElement('a');
      a.download = '';
      a.href = window.URL.createObjectURL(res);
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
  }

  isValidCompletionDate = true;
  compareTwoDates() {
    if (new Date(this.form.controls['completionDate'].value) >= new Date(this.form.controls['dueDate'].value)) {
      this.isValidCompletionDate = false;
      this.form.get('completionDate').addValidators(Validators.required);
    } else {
      this.isValidCompletionDate = true;
      this.form.get('completionDate').removeValidators(Validators.required);
      this.form.updateValueAndValidity();
    }
  }

  getApplication(applicationId, taskTypeId) {
    let input = {
      id: applicationId,
      page: this.requestFrom,
      action: 'view',
      tabIndex: 0
    }
    if (taskTypeId == TaskTypeEnum.Document) {
      input.tabIndex = 1;
    }
    else if (taskTypeId == TaskTypeEnum.differOffer || taskTypeId == TaskTypeEnum.offer)
      input.tabIndex = 4;
    else if (taskTypeId == TaskTypeEnum.cas || taskTypeId == TaskTypeEnum.visa)
      input.tabIndex = 5;
    else if (taskTypeId == TaskTypeEnum.studentonboard)
      input.tabIndex = 7;
    this.emittService.onchangeApplicationId(input);
    this.emittService.changeApplicationParentstatus(1);
  }
  openInquiryEditView() {
    if ($("#action").val() == 'false')
      this.openLarge($("#taskId").val(), true)
    else
      this.openLarge($("#taskId").val(), false)

  }

  getApplicationIDClick() {
    this.getApplication(parseInt($("#appId").val().toString()), parseInt($("#tasktypeId").val().toString()))
  }
   // Hardcode dropdown data
//    loadAssignToDropdown() {
//     this.AssigedUserGroupDetail = [
//       { id: 1, name: 'User Admin', userTypeName: 'Users' },
//       { id: 2, name: 'User Admin2', userTypeName: 'Users' },
//       { id: 3, name: 'User Admin3', userTypeName: 'Users' },
//       { id: 4, name: 'Smit Stev', userTypeName: 'Sub Admins' }
//     ];
//   }
//    // Optional: Handle selection changes
//    onAssignToChange(event: any) {
//     this.taskAssignTo = event; // Update the selected value
//   }
 }
