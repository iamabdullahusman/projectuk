import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { reflow } from '@ng-bootstrap/ng-bootstrap/util/util';
import { data } from 'jquery';
import * as moment from 'moment';
import { AppConfig } from 'src/app/appconfig';
import { ApplicationCASIssueService } from 'src/app/Services/application-casissue.service';
import { DashboardService } from 'src/app/Services/dashboard.service';
import { EmittService } from 'src/app/Services/emitt.service';
import { FileValidationService } from 'src/app/Services/file-validation.service';
import { SessionStorageService } from 'src/app/Services/session-storage.service';
import { ToastrServiceService } from 'src/app/Services/toastr-service.service';

@Component({
  selector: 'app-cas',
  templateUrl: './cas.component.html',
  styleUrls: ['./cas.component.sass']
})
export class CASComponent implements OnInit {

  headerCampusId: number = 0;
  headerIntakeId: number = 0;
  dtOptions: DataTables.Settings = {};
  casId: any;
  CASFileUrl: any;
  CASdata: any;
  totalCount: any;
  // isSubmitted: any;
  isSubmitted: boolean = true;

  CsaIssueFileForm: FormGroup = new FormGroup({
    FileName: new FormControl(),
    applicationId: new FormControl(),
    CasNumber: new FormControl(),
    IssueDate: new FormControl(),
    FileUrl: new FormControl()
  })
  ChangeCASform: FormGroup = new FormGroup({
    ApplicationId: new FormControl(),
    cas: new FormControl()
  })
  paginationInput = {
    searchText: "",
    pageSize: 10,
    startFrom: 0,
    orderBy: "",
    orderByDirection: "",
    filter: "",
    campusId: this.headerCampusId,
    intakeId: this.headerIntakeId,
  }
  SetDate: any;

  @ViewChild("RecieptModal") ViewRecieptModal: ElementRef
  @ViewChild("AddCas") AddCasModal: ElementRef
  @ViewChild("CASModal1") CASModal1: ElementRef

  requestFrom = "cas";
  constructor(private dashboardService: DashboardService, private fileValid: FileValidationService, private formBuilder: FormBuilder, private sessionService: SessionStorageService, private casService: ApplicationCASIssueService, private emitService: EmittService, private domSanitizer: DomSanitizer, private modalService: NgbModal, private appConfig: AppConfig, private toastr: ToastrServiceService, private router: Router) {

    $('#loader').show();
    emitService.onChangeAddApplicationbtnHideShow(false);
    emitService.GetCampusIntakeChange().subscribe(res => {
      this.headerCampusId = res.campusId;
      this.headerIntakeId = res.intakeId;
      $(".table").DataTable().ajax.reload();
    });
    this.CsaIssueFileForm = formBuilder.group({
      applicationId: 0,
      FileName: ['', Validators.required],
      CasNumber: ['', [Validators.required, Validators.pattern(/(^[A-Z0-9]{14,14}$)/)]],
      IssueDate: ['', Validators.required]
    })
    this.ChangeCASform = formBuilder.group({
      ApplicationId: [''],
      cas: ['',Validators.required]
    })
  }
  userType: any = '';
  ngOnInit(): void {
    this.SetDate = moment().format("YYYY-MM-DD")
    // this.GetSession();
    this.loadData();
    this.headerFilter();
  }

  headerName: any;
  headerFilter() {
    this.emitService.GetCampusIntakeChange().subscribe(res => {
      this.headerCampusId = res.campusId;
      this.headerIntakeId = res.intakeId;
      this.headerName = res.name;
    });
  }

  GetSession(): any {
    this.userType = this.sessionService.getUserType();
  }
  get CASData() {
    return this.ChangeCASform.controls;
  }
  UploadCsaFile() {

    this.isSubmitted = true;
    if (this.CsaIssueFileForm.valid) {
      $("#loader").show();
      //$('#loader').show();
      var formVal = JSON.parse(JSON.stringify(this.CsaIssueFileForm.getRawValue()));
      formVal.CasNumber = formVal.CasNumber;
      formVal.applicationId = $("#ApplicationId").val();
      formVal.CASId = $("#CASId").val();
      formVal.FileName = this.getFileName(formVal.FileName);
      if (this.Storeimage != '') {
        formVal.File = this.Storeimage;
      } else {
        formVal.File = '';
      }
      this.casService.UploadCsaFile(formVal).subscribe(res => {

        if (res.status) {
          this.modalService.dismissAll();

          this.toastr.SuccessToastr("CAS file uploaded successfully ");
          this.CsaIssueFileForm.reset();
          this.isSubmitted = false;
          this.ngOnInit();
          window.location.reload();
        }
        else {
          this.toastr.ErrorToastr("CAS file is not uploaded.");
        }
        $('#loader').hide();
      }, (err: any) => {
        $('#loader').hide();
        this.toastr.ErrorToastr("Something missing");
      })
    }
  }
  hasViewModel: boolean = false;
  modalTitle = "";

  openModel1(e: any, isView: any) {
    this.isSubmitted = false;
    this.hasViewModel = isView;
    this.ChangeCASform.reset()
    this.modalTitle = "Change CAS Status";
    this.ChangeCASform.get("ApplicationId").setValue(e.target.value)



    this.modalService.open(this.CASModal1, {
      size: 'small', backdrop: false
    });
    


  }
  get f() {
    return this.CsaIssueFileForm.controls;
  }

  Storeimage = '';
  fileNameHTML: any;
  isValidFile: any = true;
  changeCsafile(event) {
    this.fileNameHTML = '';
    const files = event.target.files;
    if (this.fileValid.checkFileType(files)) {
      this.isValidFile = true;
      for (var i = 0; i < files.length; i++) {
        const reader = new FileReader();
        let file = files[i]
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.Storeimage = reader.result.toString().split(',')[1]
        };
      }
    } else {
      this.isValidFile = false;
      this.CsaIssueFileForm.get('FileName').setValue('');
      // this.CsaIssueFileForm.reset();
    }
  }

  getFileName(str: any) {
    return str.substring(str.lastIndexOf('/') + 1)
  }

  loadData() {
    $('#loader').show();
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      responsive: true,
      scrollX: true,
      retrieve: true,
      searching: true,
      order: [7, 'desc'],
      language: {
        infoFiltered: ""
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.CASdata = [];
        this.paginationInput.pageSize = dataTablesParameters.length;
        this.paginationInput.startFrom = dataTablesParameters.start;
        this.paginationInput.searchText = dataTablesParameters.search.value;
        this.paginationInput.orderByDirection = dataTablesParameters.order[0].dir;
        this.paginationInput.orderBy = dataTablesParameters.columns[dataTablesParameters.order[0].column].name;
        this.paginationInput.campusId = this.headerCampusId;
        this.paginationInput.intakeId = this.headerIntakeId == 0 ? parseInt(this.sessionService.getIntakeId()) : this.headerIntakeId;
        this.casService.GetCAS(this.paginationInput).subscribe(res => {

          if (res.status) {
            console.log("Cas Response is:", res)
           this.CASdata = res.data.records;
           //this.CASdata = res.data.records.filter(record => record.regionalManagerId !== null);
           this.totalCount = res.totalcount;
          }
          else {
            this.toastr.ErrorToastr("Something went wrong");
          }

          callback({

            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            
            data: this.CASdata
          });
          $('#loader').hide();
        }, (err: any) => {
          $('#loader').hide();
          if (err.status == 401) {
            this.router.navigate(['/'])
          }
          else {
            this.toastr.ErrorToastr("Something went wrong");
          }
        });
      },
      columns: [
        {
          name: 'lastname', data: 'fullName', orderable: true
        },
        { name: 'CourseName', data: 'courseName', orderable: true },
        {
          name: '', data: 'status', render: function (data, type, raw) {
            var tag = '';
            if (data == 1) {
              return '<button style="font-size:14px" class="btn btn-danger rounded-pill pointer"  onClick=\"document.getElementById(\'ChangeCAS\').value=' + raw.applicationId + '; document.getElementById(\'ChangeCAS\').click()\">Expired</button>';

            }
            else if (data == 2) {
              return '<button style="font-size:14px" class="btn btn-success rounded-pill pointer" onClick=\"document.getElementById(\'ChangeCAS\').value=' + raw.applicationId + '; document.getElementById(\'ChangeCAS\').click()\";>Issued</button>';

            }
            else if (data == 3) {
              return '<button style="font-size:14px" class="btn btn-success rounded-pill pointer" onClick=\"document.getElementById(\'ChangeCAS\').value=' + raw.applicationId + '; document.getElementById(\'ChangeCAS\').click()\";test()>Re-Issued</button>';
            }
            else if (data == 4) {
              return '<button style="font-size:14px" class="btn btn-danger rounded-pill pointer" onClick=\"document.getElementById(\'ChangeCAS\').value=' + raw.applicationId + '; document.getElementById(\'ChangeCAS\').click()\">Withdraw</button>';

            }
            else if (data == 5) {
              return '<button style="font-size:14px" class="btn btn-danger rounded-pill pointer" onClick=\"document.getElementById(\'ChangeCAS\').value=' + raw.applicationId + '; document.getElementById(\'ChangeCAS\').click()\">Reported</button>';
            }
            else if (data == 6) {
              return '<button style="font-size:14px" class="btn btn-danger rounded-pill pointer" onClick=\"document.getElementById(\'ChangeCAS\').value=' + raw.applicationId + '; document.getElementById(\'ChangeCAS\').click()\">Visa Refuse</button>';

            }
            else if (data == 7) {
              return '<button style="font-size:14px" class="btn btn-success rounded-pill pointer" onClick=\"document.getElementById(\'ChangeCAS\').value=' + raw.applicationId + '; document.getElementById(\'ChangeCAS\').click()\">Visa Granted</button>';

            }
            else if (data == 8) {
              return '<button style="font-size:14px" class="btn btn-warning rounded-pill pointer" onClick=\"document.getElementById(\'ChangeCAS\').value=' + raw.applicationId + '; document.getElementById(\'ChangeCAS\').click()\">AssignTo</button>';

            }
            else if (data == 9) {
              return '<button style="font-size:14px" class="btn btn-warning rounded-pill pointer" onClick=\"document.getElementById(\'ChangeCAS\').value=' + raw.applicationId + '; document.getElementById(\'ChangeCAS\').click()\">Used</button>';

            }
            else
              return tag;
          }, orderable: false
        },
        {
          name: 'IssueDate', data: 'issueDate', render: function (data, type, raw) {
            if (data != null)
              return moment(data + 'Z').format('DD/MM/YY hh:mm A')
            else
              return '';
          }, orderable: true
        },
        { name: 'ReportReason', data: 'reportReason', orderable: false },
        {
          name: 'ReportedDate', data: 'reportedDate', render: function (data, type, raw) {
            if (data != null)
              return moment(data + 'Z').format('DD/MM/YY hh:mm A')
            else
              return '';
          }, orderable: true
        },
        { name: 'Name', data: 'createdBy', orderable: true },
        {
          name: 'CreatedDate', data: 'createdDate', render: function (data, type, raw) {
            if (data != null)
              return moment(data + 'Z').format('DD/MM/YY hh:mm A')
            else
              return '';
          }, orderable: true
        },
        {
          data: 'fileUrl', render: function (data, type, raw) {
            var ExWith = '';
            var filePath = '';
            if (data)
              filePath = '<button class="btn btn-warning me-2" onclick="document.getElementById(\'url\').value=\'' + data + '\'; document.getElementById(\'frmcas\').click()">View</button>'
            else
              return '';
            // if (this.userType == 1) {
            if (raw.status == 1 && !raw.iscasSend || raw.status == 4 && !raw.iscasSend)
              ExWith = '<button class="btn btn-warning" onclick="document.getElementById(\'ApplicationId\').value=\'' + raw.applicationId + '\'; document.getElementById(\'CASId\').value=\'' + raw.casId + '\'; document.getElementById(\'AddNewCAS\').click()">Add New CAS</button>'
            // }
            var Total = filePath + ExWith;
            return Total
          }, orderable: false,
        }
      ],
      autoWidth: false
    }
    $('#loader').hide();
  }
  Casstatus: any
  ChangeCASStatus() {
    if(this.ChangeCASform.valid)
    {
    $('#loader').show();
    var inputData = JSON.parse(JSON.stringify(this.ChangeCASform.getRawValue()));
    var input = {
      applicationId: this.ChangeCASform.get('ApplicationId').value,
      //cASStatus:this.ChangeCASform.get('cas').value
      cASStatus: inputData.cas
    }
    this.dashboardService.ChangeCASStatus(input).subscribe(res => {
      if (res.status) {
        this.Casstatus = res.data
        $('#loader').hide();
        $("#application8").DataTable().ajax.reload();
      }
    })
      this.modalService.dismissAll();
    }
  }
  AddNewCAS() {

    this.CsaIssueFileForm.reset();
    this.isSubmitted = false;
    this.modalService.open(this.AddCasModal, { ariaLabelledBy: 'modal-basic-title', backdrop: false });

  }
  OpenRecieptModal(url: any, casId: any) {

    this.casId = casId;
    this.CASFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.appConfig.baseServiceUrl + url);
    this.modalService.open(this.ViewRecieptModal, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: false });

  }

  getApplication(id: any) {
    let input = {
      id: id,
      page: this.requestFrom,
      action: 'view',
      tabIndex: '5'
    }
    this.emitService.onchangeApplicationId(input);
    this.emitService.changeApplicationParentstatus(1);
  }
  viewInquery() {
    this.OpenRecieptModal($("#url").val(), 0);
  }

  exportCSV() {
    var input = {
      campusId: this.headerCampusId,
      intakeId: this.headerIntakeId,
      search: "",
      assignBy: 0,
      skip: 0,
      take: 10

    }
    this.casService.ExportCASData(input).subscribe(result => {
      if (result.status == true) {
        let header = ["casId", "issueDate", "firstName", "lastName", "casStatus", "casStatusName"];
        let csvData = this.ConvertToCSV(result.data, header);
        let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
        // return saveAs(blob, [scope.filename + ".csv"]);
        let dwldLink = document.createElement("a");
        let url = URL.createObjectURL(blob);
        let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
        if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
          dwldLink.setAttribute("target", "_blank");
        }
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", "CASData.csv");
        dwldLink.style.visibility = "hidden";
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
      }
    })
  }

  ConvertToCSV(dataList: any, header: any) {
    let CASarr = typeof dataList != "object" ? JSON.parse(dataList) : dataList;
    let listToStr = '';
    let row = 'S.No, ';

    let newHeader = ["casId", "issueDate", "firstName", "lastName", "casStatus", "casStatusName"];

    for (let i in newHeader) {
      row += newHeader[i] + ',';
    }

    row = row.slice(0, -1);
    listToStr = row + '\r\n';

    for (let i = 0; i < CASarr.length; i++) {
      let line = (i + 1) + '';
      for (let j = 0; j < header.length; j++) {
        let head = header[j] + ''

        line += ',' + this.strRep(dataList[i][head]);
      }
      listToStr += line + '\r\n';
    }
    return listToStr;
  }

  strRep(data) {
    if (typeof data == "string") {
      let newData = data.replace(/,/g, " ");
      return newData;
    }
    else if (typeof data == "undefined") {
      return "-";
    }
    else if (typeof data == "number") {
      return data.toString();
    }
    else {
      return data;
    }
  }
}
