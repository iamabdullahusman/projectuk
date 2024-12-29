import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { FeesService } from 'src/app/Services/fees.service';
import { ToastrServiceService } from 'src/app/services/toastr-service.service';

@Component({
  selector: 'app-fee-dashboard',
  templateUrl: './fee-dashboard.component.html',
  styleUrls: ['./fee-dashboard.component.sass']
})
export class FeeDashboardComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  fees = [];
  constructor(private router: Router, private modalService: NgbModal, private alerts: AlertServiceService, private feeServices: FeesService, private toastr: ToastrServiceService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loadFeeData();
  }

  loadFeeData() {
    $('#loader').show();

    let input = {
      PageSize: 10,
      StartFrom: 1,
      SearchText: '',
      OrderByDirection: '',
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
      order: [2, 'desc'],
      language: {
        infoFiltered: ""
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.fees = [];
        input.PageSize = dataTablesParameters.length;
        input.StartFrom = dataTablesParameters.start;
        input.SearchText = dataTablesParameters.search.value;
        input.OrderByDirection = dataTablesParameters.order[0].dir;
        input.OrderBy = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
        this.feeServices.getSpFeeData(input).subscribe(res => {
          if (res.status) {
            this.fees = res.data.records;
          }
          else {
            this.toastr.ErrorToastr("Something went wrong");
          }
          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: this.fees
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
          data: 'intakeName', name: 'im.IntakeName', orderable: true, searchable: true,
          render: function (data, type, row) {
            return data + ' - ' + moment(row.startDate + 'Z').format('YYYY')
          }
        },
        { data: 'courseName', name: 'ucm.CourseName', orderable: true, searchable: true },
        { data: 'campusName', name: 'cm.CampusName', orderable: true, searchable: true },
        { data: 'totalFee', name: 'fm.TotalFee', orderable: true, searchable: true },
        {
          data: 'feeId',
          render: function (data, type, raw) {
            if (data) {
              var edit;
              edit = '<button class="me-1 btn btn-success btn-sm fa fa-pencil" onclick="document.getElementById(\'FeeId\').value=\'' + data + '\'; document.getElementById(\'editFeeCall\').click()"></button> <button class="me-1 btn btn-primary btn-sm fa fa-eye" onclick="document.getElementById(\'FeeId\').value=\'' + data + '\'; document.getElementById(\'viewFeeCall\').click()"></button>'
            }
            return edit;
          }, orderable: false
        },
      ],
      autoWidth: false
    }
    $('#loader').hide();
  }

  addFeePage() {
    this.router.navigate(['/AddFee'], { replaceUrl: true });
  }

  editFee() {
    this.router.navigate(['/EditFee/' + $("#FeeId").val()]);
    // alert('From Edit' + $("#FeeId").val());
  }

  viewFee() {
    this.router.navigate(['/ViewFee/' + $("#FeeId").val()]);
    // alert('From View' + $("#FeeId").val());
  }
}
