import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationService } from 'src/app/services/application.service';
import { ToastrServiceService } from 'src/app/services/toastr-service.service';

@Component({
  selector: 'app-archive-applications',
  templateUrl: './archive-applications.component.html',
  styleUrls: ['./archive-applications.component.sass']
})
export class ArchiveApplicationsComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  ArchiveApplication: any;

  paginationInput = {
    searchText: "",
    pageSize: 10,
    startFrom: 0,
    orderBy: "",
    orderByDirection: "",
    filter: ""
  }
  constructor(private applicationService: ApplicationService, private toastr: ToastrServiceService, private router: Router) { }

  ngOnInit(): void {
    this.LoadData();
  }
  LoadData() {
    $('#loader').show();
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching: true,
      order: [5, 'desc'],
      language: {
        infoFiltered: ""
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.ArchiveApplication = [];
        this.paginationInput.pageSize = dataTablesParameters.length;
        this.paginationInput.startFrom = dataTablesParameters.start;
        this.paginationInput.searchText = dataTablesParameters.search.value;
        this.paginationInput.orderByDirection = dataTablesParameters.order[0].dir;
        this.paginationInput.orderBy = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
        this.applicationService.GetArchiveApplicationData(this.paginationInput).subscribe(res => {

          if (res.status) {
            this.ArchiveApplication = res.data.records;
          }
          else {
            $("#loader").hide();
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
      columns: [{ data: 'am.firstname', orderable: true }, { data: 'cm.CourseName', orderable: true }, { data: 'ksm.StageName', orderable: true }, { data: 'pksm.StageName', orderable: true }, { data: 'um.Name', orderable: true }, { data: 'am.UpdatedDate', orderable: true }],
      autoWidth: false
    }
  }
}
