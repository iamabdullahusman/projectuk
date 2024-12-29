import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { AgentService } from 'src/app/Services/agent.service';
import { EmittService } from 'src/app/Services/emitt.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { StudentProfileService } from 'src/app/Services/student-profile.service';
import { ToastrServiceService } from 'src/app/services/toastr-service.service';

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.sass']
})
export class AgentDashboardComponent implements OnInit {

  dtOptions: { pagingType: string; pageLength: number; lengthMenu: number[][]; serverSide: boolean; processing: boolean; responsive: boolean; scrollX: boolean; retrieve: boolean; searching: boolean; order: (string | number)[]; language: { infoFiltered: string; }; ajax: (dataTablesParameters: any, callback: any) => void; columns: ({ name: string; data: string; orderable: boolean; searchable: boolean; render?: undefined; } | { name: string; data: string; orderable: boolean; searchable: boolean; render: (data: any, type: any, row: any) => string; })[]; autoWidth: boolean; };

  constructor(private sessionStorage: SessionStorageService, private router: Router, private ProfileService: StudentProfileService, private emittService: EmittService, private sessionService: SessionStorageService, private formBuilder: FormBuilder, private modalService: NgbModal, private route: Router, private toastr: ToastrServiceService, private agentServices: AgentService) { }

  ngOnInit(): void {
    this.loadData();
    this.sessionService.setApplicationId(0);
    this.emittService.changePermission();
  }

  agentdata: any;
  UserIdvalue: any;
  application: any;
  loadData() {
    $('#loader').show();
    var input = {
      searchText: "",
      pageSize: 10,
      startFrom: 0,
      orderBy: "",
      userId: '',
      orderByDirection: "",
    }
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 10,
      lengthMenu: [[10, 20, 50], [10, 20, 50]],
      serverSide: true,
      processing: true,
      responsive: true,
      scrollX: true,
      retrieve: true,
      searching: true,
      order: [4, 'desc'],
      language: {
        infoFiltered: ""
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.agentdata = [];
        input.startFrom = dataTablesParameters.start;
        input.pageSize = dataTablesParameters.length;
        input.searchText = dataTablesParameters.search.value;
        input.userId = dataTablesParameters.userId;
        input.orderByDirection = dataTablesParameters.order[0].dir;
        input.orderBy = dataTablesParameters.columns[dataTablesParameters.order[0].column].name;
        this.agentServices.GetApplicationBySponcer(input).subscribe(res => {
          if (res.status) {
            this.agentdata = res.data.records;

          }
          else {
            this.toastr.ErrorToastr(res.message);
          }
          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: res.data.records
          });

          $('#loader').hide();
        }, (err: any) => {
          $('#loader').hide();
          if (err.status == 401) {
            this.route.navigate(['/'])
          }
          else {
            this.toastr.ErrorToastr("Something went wrong");
          }
        });
      },
      columns: [
        { name: 'ApplicationName', data: 'applicationName', orderable: true, searchable: true },
        { name: 'CampusName', data: 'campusName', orderable: true, searchable: true },
        { name: 'CourseName', data: 'courseName', orderable: true, searchable: true },
        {
          name: 'intake', data: 'intake', orderable: true, searchable: true
        },
        {
          name: 'CreatedDate', data: 'createdOn', orderable: true, searchable: true, render: function (data, type, row) {
            return moment(data + 'Z').format('DD/MM/YY hh:mm A')
          },
        },
        { name: 'name', data: 'createdBy', orderable: true, searchable: true },
        {
          name: '', data: 'applicationId', orderable: false, searchable: false, render: function (data, type, row) {
            var htmlButton = '<button class="btn-shadow btn btn-primary me-2 pointer" onClick=\"document.getElementById(\'hdnClickView\').value=' + data + '; document.getElementById(\'hdnClickView\').click()\">View</button>';
            return htmlButton;
          }
        },
        ],
      autoWidth: false
    }
    $('#loader').hide();
  }

  clickView(e) {
    this.openApplication(e.target.value)
    this.emittService.callheaderpermition();
  }

  openApplication(applicationId: any) {
    this.application = this.agentdata.find(m => m.applicationId == applicationId);
    this.sessionService.saveSessionForApplicationname(this.application.applicationName);
    this.sessionService.setApplicationId(parseInt(applicationId));
    this.emittService.changePermission();
    let application = {
      ApplicationId: applicationId,
      UserType: 6
    }
    this.ProfileService.getUserPermissionData(application).subscribe(res => {
      this.router.navigate(['student/myapplication']);
      if (res.data == true) {
        this.sessionService.setpermission(res.data);
      }

    });

  }

}
