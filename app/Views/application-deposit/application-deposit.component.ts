import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { AppConfig } from 'src/app/appconfig';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { DepositService } from 'src/app/Services/deposit.service';
import { EmittService } from 'src/app/Services/emitt.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { ToastrServiceService } from 'src/app/services/toastr-service.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-application-deposit',
  templateUrl: './application-deposit.component.html',
  styleUrls: ['./application-deposit.component.sass']
})
export class ApplicationDepositComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtOptionsFee: DataTables.Settings = {};
  isSubmitted: boolean = false;
  headerCampusId: number = 0;
  headerIntakeId: number = 0;

  DepositForm: FormGroup = new FormGroup({
    ApplicationName: new FormControl(),
    Email: new FormControl(),
    Course: new FormControl(),
    Offer: new FormControl(),
    DepositType: new FormControl(),
    DepositReciept: new FormControl(),
    FileUrl: new FormControl(),
    // statusId: new FormControl(),
    // contentId: new FormControl(),
    // comment: new FormControl()
  });



  receiptUrl: any;
  deposites = [];
  config: any;
  openModalWindow: boolean;
  @ViewChild("RecieptModal") ViewRecieptModal: ElementRef
  @ViewChild("RecieptRejectModal") ViewRecieptRejectModal: ElementRef

  commentmodal: FormGroup = new FormGroup({
    contentId: new FormControl(),
    statusId: new FormControl(),
    comment: new FormControl()
  });

  constructor(private modalService: NgbModal, private sessionService: SessionStorageService, private depositService: DepositService, private appConfig: AppConfig, private formBuilder: FormBuilder, private router: Router, private alerts: AlertServiceService, private toastr: ToastrServiceService, private emitService: EmittService, private domSanitizer: DomSanitizer) {
    this.commentmodal = formBuilder.group({
      contentId: [''],
      statusId: [''],
      comment: ['', [Validators.required]]
    })
    emitService.onChangeAddApplicationbtnHideShow(false);
    emitService.GetCampusIntakeChange().subscribe(res => {
      this.headerCampusId = res.campusId;
      this.headerIntakeId = res.intakeId;
      // $("#fee").DataTable().ajax.reload();
      $(".table").DataTable().ajax.reload();
    });
  }


  ngOnInit(): void {
    this.headerFilter();
    this.loadDeposit();
    this.loadDepositFee();
  }
  get f() {
    return this.commentmodal.controls;
  }

  headerName: any;
  headerFilter() {
    this.emitService.GetCampusIntakeChange().subscribe(res => {
      this.headerCampusId = res.campusId;
      this.headerIntakeId = res.intakeId;
      this.headerName = res.name;
    });
  }

  loadDeposit() {
    $('#loader').show();

    let input = {
      size: 10,
      index: 1,
      Search: '',
      OrderByDirection: '',
      sortingColumn: 0,
      OrderBy: '',
      campusId: this.headerCampusId,
      intakeId: this.headerIntakeId == 0 ? parseInt(this.sessionService.getIntakeId()) : this.headerIntakeId,
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
      order: [8, 'asc'],
      language: {
        infoFiltered: ""
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.deposites = [];
        input.size = dataTablesParameters.length;
        input.index = dataTablesParameters.start;
        input.index++;
        input.Search = dataTablesParameters.search.value;
        input.OrderByDirection = dataTablesParameters.order[0].dir;
        input.sortingColumn = dataTablesParameters.order[0].column;
        input.OrderBy = dataTablesParameters.columns[input.sortingColumn].data;
        input.campusId = this.headerCampusId;
        input.intakeId = this.headerIntakeId;
        this.depositService.getAllDeposit(input).subscribe(res => {

          if (res.status) {
            this.deposites = res.data.records;
          }
          else {
            this.toastr.ErrorToastr("Something went wrong");
          }
          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: res.data.records
          });
          $('#loader').hide();
        }, (err: any) => {
          if (err.status == 401) {
            this.router.navigate(['/'])
          }
          else {
            this.toastr.ErrorToastr("Something went wrong");
          }
          $('#loader').hide();
        });
      },
      columns: [
        { name: 'applicationName', data: 'applicationName', orderable: true, searchable: true },
        { name: 'email', data: 'email', orderable: true, searchable: true },
        { name: 'CourseName', data: 'course', orderable: true, searchable: true },
        { name: 'applicationStatus', data: 'applicationStatus', orderable: true, searchable: true },
        { name: 'amount', data: 'amount', orderable: true, searchable: true },
        { name: 'offer', data: 'offer', orderable: true, searchable: true },
        { name: 'depositeName', data: 'depositType', orderable: false, searchable: false },
        { name: 'FileName', data: 'depositReceipt', orderable: true, searchable: true },
        {
          name: 'depositStatus', data: 'depositStatus', orderable: true, searchable: true, render: function (data, type, row) {
            var tag = '';
            if (data == 0) {
              tag = '<span class="btn btn-warning rounded-pill" > Un-Verify </span>'
            } else if (data == 1) {
              tag = '<span class="btn btn-success rounded-pill" > Verified </span>'
            } else if (data == 2) {
              tag = '<span class="btn btn-danger rounded-pill" > Rejected </span>'
            }
            return tag;
          }
        },
        {
          data: 'fileUrl', orderable: false, searchable: true, render: function (data, type, row) {
            if (data) {
              return '<button class="btn btn-warning" onClick=\"document.getElementById(\'url\').value=\'' + data + '\'; document.getElementById(\'applicationId\').value=\'' + row['applicationId'] + '\'; document.getElementById(\'paymentId\').value=\'' + row['depositId'] + '\'; document.getElementById(\'status\').value=\'' + row['depositStatus'] + '\'; document.getElementById(\'frmDeposite\').click()">View</button>';
            } else {
              return '';
            }
          }
        }],
      autoWidth: false
    }
    $('#loader').hide();
  }
  loadDepositFee() {
    $('#loader').show();

    let input = {
      size: 10,
      index: 1,
      Search: '',
      OrderByDirection: '',
      sortingColumn: 0,
      OrderBy: '',
      campusId: this.headerCampusId,
      intakeId: this.headerIntakeId == 0 ? parseInt(this.sessionService.getIntakeId()) : this.headerIntakeId
    }

    this.dtOptionsFee = {
      pagingType: 'simple_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      responsive: true,
      scrollX: true,
      retrieve: true,
      searching: true,
      language: {
        infoFiltered: ""
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.deposites = [];
        input.campusId = this.headerCampusId;
        input.intakeId = this.headerIntakeId;
        input.size = dataTablesParameters.length;
        input.index = dataTablesParameters.start;
        input.Search = dataTablesParameters.search.value;
        input.OrderByDirection = dataTablesParameters.order[0].dir;
        input.sortingColumn = dataTablesParameters.order[0].column;
        input.OrderBy = dataTablesParameters.columns[input.sortingColumn].data;
        this.depositService.getFeeDeposit(input).subscribe(res => {

          if (res.status) {
            this.deposites = res.data.records;
          }
          else {
            this.toastr.ErrorToastr("Something went wrong");
          }
          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: res.data.records
          });
          $('#loader').hide();
        }, (err: any) => {
          if (err.status == 401) {
            this.router.navigate(['/'])
          }
          else {
            this.toastr.ErrorToastr("Something went wrong");
          }
          $('#loader').hide();
        });
      },
      columns: [
        { name: '', data: 'title', orderable: false, searchable: true },
        { name: '', data: 'firstName', orderable: false, searchable: true },
        { name: '', data: 'lastName', orderable: false, searchable: true },
        { name: '', data: 'candidateCode', orderable: false, searchable: true },
        { name: '', data: 'course', orderable: false, searchable: true },
        { name: '', data: 'standardFee', orderable: false, searchable: true },
        { name: '', data: 'registrationFee', orderable: false, searchable: true },
        { name: '', data: 'praticalFee', orderable: false, searchable: true },
        { name: '', data: 'matrialFee', orderable: false, searchable: true },
        { name: '', data: 'presessional', orderable: false, searchable: true },
        { name: '', data: 'examFee', orderable: false, searchable: true },
        { name: '', data: 'scholarShip', orderable: false, searchable: true },
        { name: '', data: 'reservationFee', orderable: false, searchable: true },
        { name: '', data: 'total', orderable: false, searchable: true },
        { name: '', data: 'reservationFee', orderable: false, searchable: true },
        { name: '', data: 'deposite', orderable: false, searchable: true },
        { name: '', data: 'paidDeposite', orderable: false, searchable: true },
        {
          name: '', data: 'applicationId', orderable: false, searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 0) {
                return row.installments[0].installmentAmount;
              }
            }
            return ''
          }
        },
        {
          name: '', data: 'applicationId', orderable: false, searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 0) {
                return row.installments[0].paidinstallmentAmount;
              }
            }
            return ''
          }
        },
        {
          name: '', data: 'applicationId', orderable: false, type: "date", searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 0) {
                return moment(row.installments[0].installmentDueDate + 'Z').format('DD/MM/YYYY');
              }
            }
            return ''
          }
        },
        {
          name: '', data: 'applicationId', orderable: false, searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 1) {
                return row.installments[1].installmentAmount;
              }
            }
            return ''
          }
        },
        {
          name: '', data: 'applicationId', orderable: false, searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 1) {
                return row.installments[1].paidinstallmentAmount;
              }
            }
            return ''
          }
        },
        {
          name: '', data: 'applicationId', orderable: false, searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 1) {
                return moment(row.installments[1].installmentDueDate + 'Z').format('DD/MM/YYYY');
              }
            }
            return ''
          }
        }, {
          name: '', data: 'applicationId', orderable: false, searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 2) {
                return row.installments[2].installmentAmount;
              }
            }
            return ''
          }
        },
        {
          name: '', data: 'applicationId', orderable: false, searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 2) {
                return row.installments[2].paidinstallmentAmount;
              }
            }
            return ''
          }
        },
        {
          name: '', data: 'applicationId', orderable: false, searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 2) {
                return moment(row.installments[2].installmentDueDate + 'Z').format('DD/MM/YYYY');
              }
            }
            return ''
          }
        }, {
          name: '', data: 'applicationId', orderable: false, searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 3) {
                return row.installments[3].installmentAmount;
              }
            }
            return ''
          }
        },
        {
          name: '', data: 'applicationId', orderable: false, searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 3) {
                return row.installments[3].paidinstallmentAmount;
              }
            }
            return ''
          }
        },
        {
          name: '', data: 'applicationId', orderable: false, searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 3) {
                return moment(row.installments[3].installmentDueDate + 'Z').format('DD/MM/YYYY');
              }
            }
            return ''
          }
        }, {
          name: '', data: 'applicationId', orderable: false, searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 4) {
                return row.installments[4].installmentAmount;
              }
            }
            return ''
          }
        },
        {
          name: '', data: 'applicationId', orderable: false, searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 4) {
                return row.installments[4].paidinstallmentAmount;
              }
            }
            return ''
          }
        },
        {
          name: '', data: 'applicationId', orderable: false, searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 4) {
                return moment(row.installments[4].installmentDueDate + 'Z').format('DD/MM/YYYY');
              }
            }
            return ''
          }
        }, {
          name: '', data: 'applicationId', orderable: false, searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 5) {
                return row.installments[5].installmentAmount;
              }
            }
            return ''
          }
        },
        {
          name: '', data: 'applicationId', orderable: false, searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 5) {
                return row.installments[5].paidinstallmentAmount;
              }
            }
            return ''
          }
        },
        {
          name: '', data: 'applicationId', orderable: false, searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 5) {
                return moment(row.installments[5].installmentDueDate + 'Z').format('DD/MM/YYYY');
              }
            }
            return ''
          }
        }, {
          name: '', data: 'applicationId', orderable: false, searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 6) {
                return row.installments[6].installmentAmount;
              }
            }
            return ''
          }
        },
        {
          name: '', data: 'applicationId', orderable: false, searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 6) {
                return row.installments[6].paidinstallmentAmount;
              }
            }
            return ''
          }
        },
        {
          name: '', data: 'applicationId', orderable: false, searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 6) {
                return moment(row.installments[6].installmentDueDate + 'Z').format('DD/MM/YYYY');
              }
            }
            return ''
          }
        }, {
          name: '', data: 'applicationId', orderable: false, searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 7) {
                return row.installments[7].installmentAmount;
              }
            }
            return ''
          }
        },
        {
          name: '', data: 'applicationId', orderable: false, searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 7) {
                return row.installments[7].paidinstallmentAmount;
              }
            }
            return ''
          }
        },
        {
          name: '', data: 'applicationId', orderable: false, searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 7) {
                return moment(row.installments[7].installmentDueDate + 'Z').format('DD/MM/YYYY');
              }
            }
            return ''
          }
        }, {
          name: '', data: 'applicationId', orderable: false, searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 8) {
                return row.installments[8].installmentAmount;
              }
            }
            return ''
          }
        },
        {
          name: '', data: 'applicationId', orderable: false, searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 8) {
                return row.installments[8].paidinstallmentAmount;
              }
            }
            return ''
          }
        },
        {
          name: '', data: 'applicationId', orderable: false, searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 8) {
                return moment(row.installments[8].installmentDueDate + 'Z').format('DD/MM/YYYY');
              }
            }
            return ''
          }
        },
        {
          name: '', data: 'applicationId', orderable: false, searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 9) {
                return row.installments[9].installmentAmount;
              }
            }
            return ''
          }
        },
        {
          name: '', data: 'applicationId', orderable: false, searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 9) {
                return row.installments[9].paidinstallmentAmount;
              }
            }
            return ''
          }
        },
        {
          name: '', data: 'applicationId', orderable: false, searchable: true, render: function (data, type, row) {
            if (row.installments) {
              if (row.installments.length > 9) {
                return moment(row.installments[9].installmentDueDate + 'Z').format('DD/MM/YYYY');
              }
            }
            return ''
          }
        },
        { name: '', data: 'note', orderable: false, searchable: true }
      ],
    }
    $('#loader').hide();
  }

  viewDeposite() {
    this.OpenRecieptModal($("#url").val(), $("#applicationId").val(), $("#status").val(), $("#paymentId").val());
  }

  getFileName(str: any) {
    if (str == '')
      str = 'student.pdf';
    return str.substring(str.lastIndexOf('/') + 1)
  }

  applicationId: number;
  paymentId: number;
  ishideButton: boolean;
  OpenRecieptModal(url: any, applicationId: any, status: any, paymentId: any) {
    $('#loader').show();
    this.ishideButton = status == 1 || status == 2;
    this.applicationId = applicationId;
    this.paymentId = paymentId;
    this.receiptUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.appConfig.baseServiceUrl + url);
    this.modalService.open(this.ViewRecieptModal, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: false });
    $('#loader').hide();
  }

  getApplication(id: any) {
    $('#loader').show();
    let input = {
      id: id,
      page: 'appDetails'
    }
    this.emitService.onchangeApplicationId(input);
    this.emitService.changeApplicationParentstatus(1);

    $('#loader').hide();
  }

  changeDepositStatus(status: any) {
    $("#loader").show();
    this.isSubmitted = true;
    this.ishideButton = status == 1 || status == 2;
    if (status == 3) {
      if (!this.commentmodal.valid) {
        return;
      }
    }

    let input = {
      contentId: this.applicationId,
      statusId: status,
      paymentId: this.paymentId,
      comment: this.commentmodal.get("comment").value
    }
    this.depositService.changeDepositStatus(input).subscribe(res => {
      if (res.status) {
        $("#loader").hide();
        this.modalService.dismissAll();
        $("#UploadReceipt").DataTable().ajax.reload();
        this.toastr.SuccessToastr("Status changed successfully");
      }
      else {
        this.toastr.ErrorToastr("Something went wrong");
        $("#loader").hide();
      }

    });
  }

  openrejectreasonmodal(content) {
    $('#loader').show();
    this.isSubmitted = false;
    this.commentmodal.reset(this.commentmodal.value);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: false })
    $('#loader').hide();
  }

  // clickView(e) {
  //   this.openLarge(e.target.value, true)
  // }

  tabClick(e) {
    if (e.index == 0) {
      $("#UploadReceipt").DataTable().ajax.reload();
    }
    else
      $("#fee").DataTable().ajax.reload();
  }

  ExportData() {
    $("#loader").show();
    let input = {
      campusId: this.headerCampusId,
      intakeId: this.headerIntakeId,
    }
    let element = '<table id="download" class="align-middle text-truncate mb-0 table table-bordered border table-hover display nowrap" id="fee">' +
      '<thead> <tr>' +
      '<th colspan="3">Student Details</th>' +
      '<th>Candidate Code</th>' +
      '<th>Course</th>' +
      '<th colspan="9">Fee Calculation</th>' +
      '<th colspan="3">Paid pre-arrival</th>' +
      '<th colspan="30">Installments</th>' +
      '<th rowspan="3">Notes</th>' +
      '</tr><tr>' +
      '<th rowspan="2">Title</th>' +
      '<th rowspan="2">First Name</th>' +
      '<th rowspan="2">Surname</th>' +
      '<th rowspan="2">Candidate Code</th>' +
      '<th rowspan="2">Course</th>' +
      '<th rowspan="2">standard Fee</th>' +
      '<th rowspan="2">Registation Fee</th>' +
      '<th rowspan="2">Practical Fee(TBC!)</th>' +
      '<th rowspan="2">Matrial Fee</th>' +
      '<th rowspan="2">Presessional</th>' +
      '<th rowspan="2">Exam Fee</th>' +
      '<th rowspan="2">Scholarship</th>' +
      '<th rowspan="2">Other</th>' +
      '<th rowspan="2">Total</th>' +
      '<th rowspan="2">Reservation Fee</th>' +
      '<th rowspan="2">Total Deposit</th>' +
      '<th rowspan="2">Paid Deposit</th>' +
      '<th colspan="3">Installment 1</th>' +
      '<th colspan="3">Installment 2</th>' +
      '<th colspan="3">Installment 3</th>' +
      '<th colspan="3">Installment 4</th>' +
      '<th colspan="3">Installment 5</th>' +
      '<th colspan="3">Installment 6</th>' +
      '<th colspan="3">Installment 7</th>' +
      '<th colspan="3">Installment 8</th>' +
      '<th colspan="3">Installment 9</th>' +
      '<th colspan="3">Installment 10</th>' +
      '</tr><tr>' +
      '<th>Total Amount</th>' +
      '<th>Paid Amount</th>' +
      '<th>Due Date</th>' +
      '<th>Total Amount</th>' +
      '<th>Paid Amount</th>' +
      '<th>Due Date</th>' +
      '<th>Total Amount</th>' +
      '<th>Paid Amount</th>' +
      '<th>Due Date</th>' +
      '<th>Total Amount</th>' +
      '<th>Paid Amount</th>' +
      '<th>Due Date</th>' +
      '<th>Total Amount</th>' +
      '<th>Paid Amount</th>' +
      '<th>Due Date</th>' +
      '<th>Total Amount</th>' +
      '<th>Paid Amount</th>' +
      '<th>Due Date</th>' +
      '<th>Total Amount</th>' +
      '<th>Paid Amount</th>' +
      '<th>Due Date</th>' +
      '<th>Total Amount</th>' +
      '<th>Paid Amount</th>' +
      '<th>Due Date</th>' +
      '<th>Total Amount</th>' +
      '<th>Paid Amount</th>' +
      '<th>Due Date</th>' +
      '<th>Total Amount</th>' +
      '<th>Paid Amount</th>' +
      '<th>Due Date</th>' +
      '</tr></thead>' +
      '<tbody>';

    this.depositService.getFeeDepositExpose(input).subscribe(res => {

      if (res.status) {
        for (var i = 0; i < res.data.length; i++) {
          element += '<tr>'
          if (res.data[i].title != null)
            element += '<td>' + res.data[i].title + '</td>';
          else
            element += '<td></td>';
          element += '<td>' + res.data[i].firstName + '</td>';
          element += '<td>' + res.data[i].lastName + '</td>';
          if (res.data[i].candidateCode != null)
            element += '<td>' + res.data[i].candidateCode + '</td>';
          else
            element += '<td></td>';
          element += '<td>' + res.data[i].course + '</td>';
          element += '<td>' + res.data[i].standardFee + '</td>';
          element += '<td>' + res.data[i].registrationFee + '</td>';
          element += '<td>' + res.data[i].praticalFee + '</td>';
          element += '<td>' + res.data[i].matrialFee + '</td>';
          element += '<td>' + res.data[i].presessional + '</td>';
          element += '<td>' + res.data[i].examFee + '</td>';
          element += '<td>' + res.data[i].scholarShip + '</td>';
          element += '<td>' + res.data[i].other + '</td>';
          element += '<td>' + res.data[i].total + '</td>';
          element += '<td>' + res.data[i].reservationFee + '</td>';
          element += '<td>' + res.data[i].deposite + '</td>';
          element += '<td>' + res.data[i].paidDeposite + '</td>';
          for (var j = 0; j < 10; j++) {
            if (res.data[i].installments.length > j) {
              element += '<td>' + res.data[i].installments[j].installmentAmount + '</td>';
              element += '<td>' + res.data[i].installments[j].paidinstallmentAmount + '</td>';
              element += '<td>' + moment(res.data[i].installments[j].installmentDueDate).format('DD-MM-YYYY') + '</td>';
            }
            else {
              element += '<td></td>';
              element += '<td></td>';
              element += '<td></td>';
            }
          }
          element += '</tr>'
        }
        element += '</tbody></table>';
        var div = document.createElement('div');
        div.innerHTML = element;
        document.body.append(div);
        var table = document.getElementById('download');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, "Export Fee intake sept2022.xlsx");
        document.body.removeChild(div);
        $("#loader").hide();
      }
      else {
        this.toastr.ErrorToastr(res.message);
      }
    }, (err: any) => {
      this.toastr.ErrorToastr("Someting went wrong.");
    })

  }
}
