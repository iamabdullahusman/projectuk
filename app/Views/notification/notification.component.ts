import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDayTemplateData } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-view-model';
import * as moment from 'moment';
import { AlertServiceService } from 'src/app/Services/alert-service.service';
import { EmittService } from 'src/app/Services/emitt.service';
import { FeesService } from 'src/app/Services/fees.service';
import { ToastrServiceService } from 'src/app/Services/toastr-service.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.sass']
})
export class NotificationComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  isRequired = false;
  constructor(private emitService: EmittService, private feesservices: FeesService,private alerts: AlertServiceService, private toastr: ToastrServiceService, private router: Router) {




  }
  color = 'accent';
  checked: boolean;
  ngOnInit(): void {
    this.loadData();
  }
  paginationInput = {
    index: 1,
    searchText: "",
    pageSize: 10,
    startFrom: 0,
    orderBy: "",
    orderByDirection: "",
    filter: ""
  }
  Notificationdata :any = [];
  totalCount: any;
  loadData() {
    $('#loader').show();
    let input = {
      index: 1,
      size: 10,
      startFrom: 1,
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
      order: [0, 'desc'],
      language: {
        infoFiltered: ""
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.Notificationdata = [];
        // input.size = dataTablesParameters.length;
        // input.startFrom = dataTablesParameters.start / dataTablesParameters.length;
        // input.startFrom++;
        // input.Search = dataTablesParameters.search.value;
        // input.OrderByDirection = dataTablesParameters.order[0].dir;
        // //input.OrderByDirection = "FullName"
        // input.sortingColumn = dataTablesParameters.order[0].column;
        // input.OrderBy = dataTablesParameters.columns[input.sortingColumn].data;
        console.log("Datatable para,eters", dataTablesParameters.columns);

        this.paginationInput.pageSize = dataTablesParameters.length;
        this.paginationInput.startFrom = dataTablesParameters.start;
        this.paginationInput.searchText = dataTablesParameters.search.value;
        this.paginationInput.orderByDirection = dataTablesParameters.order[0].dir;
        this.paginationInput.index = dataTablesParameters.start / dataTablesParameters.length;
        this.paginationInput.orderBy = dataTablesParameters.columns[dataTablesParameters.order[0].column].name;
        this.paginationInput.index++;
        this.feesservices.GetNotification(this.paginationInput).subscribe(res => {
          // if (res.status) {
          //   this.Notificationdata = res.data.records;
          //   this.totalCount = res.totalcount;
          // }
          // else {
          //   this.toastr.ErrorToastr("Something went wrong");
          // }
          // callback({
          //   recordsTotal: res.data.totalCounts,
          //   recordsFiltered: res.data.totalCounts,
          //   data: this.Notificationdata
          // });
          if (res.status) {
            this.Notificationdata = res.data.records;
          }
          else {
            this.toastr.ErrorToastr("Something went wrong");
          }

          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: []
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
      columns: [{ data: 'NM.createdDate',name: 'createdDate', orderable: true, searchable: true, width: '15%' }, { data: 'NM.discription',name: 'description', orderable: true, searchable: true }, { data: '', orderable: false }],
      autoWidth: false
      // columns: [

      //   { name: 'am.applicationId', data: 'applicationName', orderable: true },
      //   { name: 'NM.discription', data: 'discription', orderable: true },
      //   {
      //     name: 'NM.createdDate', data: 'createdDate', render: function (data, type, raw) {
      //       if (data != null)
      //         return moment(data + 'Z').format('DD/MM/YY hh:mm A')
      //       else
      //         return '';
      //     }, orderable: true
      //   },
      //   // { name: 'am.isRead', data: 'isRead', orderable: true },

      //   {
      //     data: 'isRead', render: function (data, type, raw) {
      //       var ExWith = '';
      //       var filePath = '';
      //       var filePath1 = '';
      //       // filePath = '<mat-slide-toggle class="example-margin" [color]="accent" [checked]="true">Visa Required</mat-slide-toggle>'
      //       // filePath = '<div class="mat-slide-toggle-bar"><input type="checkbox" role="switch" class="mat-slide-toggle-input cdk-visually-hidden" id="mat-slide-toggle-1-input" tabindex="0" aria-checked="' + data + '"><div class="mat-slide-toggle-thumb-container"><div class="mat-slide-toggle-thumb"></div><div mat-ripple="" class="mat-ripple mat-slide-toggle-ripple mat-focus-indicator" ng-reflect-trigger="[object HTMLLabelElement]" ng-reflect-disabled="' + data +'" ng-reflect-centered="true" ng-reflect-radius="20" ng-reflect-animation="[object Object]"><div class="mat-ripple-element mat-slide-toggle-persistent-ripple"></div></div></div></div>'
      //       filePath = '<div class="mat-slide-toggle-bar"><input type="checkbox" role="switch" class="mat-slide-toggle-input cdk-visually-hidden" id="mat-slide-toggle-3-input" tabindex="0" aria-checked="true"><div class="mat-slide-toggle-thumb-container"><div class="mat-slide-toggle-thumb"></div><div mat-ripple="" class="mat-ripple mat-slide-toggle-ripple mat-focus-indicator" ng-reflect-trigger="[object HTMLLabelElement]" ng-reflect-disabled="false" ng-reflect-centered="true" ng-reflect-radius="20" ng-reflect-animation="[object Object]"><div class="mat-ripple-element mat-slide-toggle-persistent-ripple"></div></div></div></div>'
      //       // filePath1 = '<div class="mat-slide-toggle-bar"><input type="checkbox" role="switch" class="mat-slide-toggle-input cdk-visually-hidden" id="mat-slide-toggle-3-input" tabindex="0" aria-checked="false"><div class="mat-slide-toggle-thumb-container"><div class="mat-slide-toggle-thumb"></div><div mat-ripple="" class="mat-ripple mat-slide-toggle-ripple mat-focus-indicator" ng-reflect-trigger="[object HTMLLabelElement]" ng-reflect-disabled="false" ng-reflect-centered="true" ng-reflect-radius="20" ng-reflect-animation="[object Object]"><div class="mat-ripple-element mat-slide-toggle-persistent-ripple"></div></div></div></div>'
      //       // filePath1 = '<input type="checkbox" data-toggle="switchbutton" checked data-onstyle="success">'

      //       var Total = filePath + filePath1;
      //       return Total
      //     }, orderable: false,
      //   }
      // ],
      //autoWidth: false
    }
    $('#loader').hide();
  }


  IsReadNotifications(notificationmapping: any, isRead: any) {
    let notififationDatas = {
      isRead: isRead.checked,
      notificationmapping: notificationmapping
    }
    this.feesservices.IsNotificationData(notififationDatas).subscribe(res => {
      if (notififationDatas.isRead)
        this.toastr.SuccessToastr("Notification marked as read.");
      else
        this.toastr.SuccessToastr("Notification marked as unread.");
      this.emitService.ChangeNewNotifications('change');

    })

  }

  AllNotificationRead() {
    this.alerts.ComfirmAlert("Do you want to mark all notifications as read ?", "Yes", "No").then(res => {
      if (res.isConfirmed) {
        $("#loader").show();
        this.feesservices.AllNotificationRead().subscribe(res => {
          if (res.status) {
            this.toastr.SuccessToastr("All Notification Read.");
          }
          else {
            this.toastr.ErrorToastr("Something went wrong");
          }
          this.emitService.ChangeNewNotifications('change');
          $("#loader").hide();
          $(".table").DataTable().ajax.reload();
        });
      }
    })

  }


}


