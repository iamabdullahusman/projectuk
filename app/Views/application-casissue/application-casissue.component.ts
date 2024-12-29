import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { ApplicationCASIssueService } from 'src/app/Services/application-casissue.service';
import { EmittService } from 'src/app/Services/emitt.service';
import { ToastrServiceService } from 'src/app/services/toastr-service.service';

@Component({
  selector: 'app-application-casissue',
  templateUrl: './application-casissue.component.html',
  styleUrls: ['./application-casissue.component.sass']
})

export class ApplicationCASIssueComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  AllCSAIssue = [];
  // feePayByForm: FormGroup = new FormGroup({
  //   feePaidPerson: new FormControl(),
  //   feePaybyId: new FormControl()
  // });
  constructor(private modalService: NgbModal, private CASService: ApplicationCASIssueService, private formBuilder: FormBuilder, private router: Router, private alerts: AlertServiceService, private toastr: ToastrServiceService, private emittService: EmittService) {
    // this.feePayByForm = formBuilder.group({
    //   feePaidPerson: ['', Validators.required],
    //   feePaybyId: ['0']
    // })
    emittService.onChangeAddApplicationbtnHideShow(false);
  }

  ngOnInit(): void {
    this.loadCSAIssueby();
  }
  loadCSAIssueby() {
    $('#loader').show();

    let input = {
      size: 10,
      index: 1,
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
      searching: true,
      language: {
        infoFiltered: ""
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.AllCSAIssue = [];
        input.size = dataTablesParameters.length;
        input.index = dataTablesParameters.start / dataTablesParameters.length;
        input.index++;
        input.Search = dataTablesParameters.search.value;
        input.OrderByDirection = dataTablesParameters.order[0].dir;
        input.sortingColumn = dataTablesParameters.order[0].column;
        input.OrderBy = dataTablesParameters.columns[input.sortingColumn].data;
        this.CASService.getAllCSAIssue(input).subscribe(res => {
          // $('#loader').hide();
          if (res.status) {
            this.AllCSAIssue = res.data.records;
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

          if (err.status == 401) {
            this.router.navigate(['/'])
          }
          else {
            this.toastr.ErrorToastr("Something went wrong");
          }
          $('#loader').hide();
        });
      },
      columns: [{ data: '', orderable: true }, { data: 'applicationName', orderable: true }, { data: 'email', orderable: true }, { data: 'issueDate', orderable: true }, { data: 'fileName', orderable: true }],
      autoWidth: false
    }
  }

}
