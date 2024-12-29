import { CdkMonitorFocus } from '@angular/cdk/a11y';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { ConditionServiceService } from 'src/app/Services/condition-service.service';
import { ToastrServiceService } from 'src/app/services/toastr-service.service';

@Component({
  selector: 'app-condition-master',
  templateUrl: './condition-master.component.html',
  styleUrls: ['./condition-master.component.sass']
})
export class ConditionMasterComponent implements OnInit {
  isSubmitted: boolean = false;
  modalTitle = 'Add Condition';
  dtOptions: DataTables.Settings = {};
  hasViewModel: boolean = false;
  conditionForm: FormGroup = new FormGroup({
    Condtion: new FormControl(),
    ConditonId: new FormControl(),

  });

  @ViewChild("conditionModal") conditionModal: ElementRef




  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private router: Router, private toastr: ToastrServiceService, private conditionService: ConditionServiceService, private alerts: AlertServiceService,) {
    this.conditionForm = formBuilder.group({
      Condtion: ['', Validators.required],
      ConditonId: ['0'],

    })
  }

  ngOnInit(): void {
    this.loadData();
  }
  get f() {
    return this.conditionForm.controls;
  }
  condition: any;


  loadData() {
    $('#loader').show();

    var input = {
      searchText: "",
      pageSize: 10,
      startFrom: 0,
      orderBy: "",
      orderByDirection: "",
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
        this.condition = [];

        input.startFrom = dataTablesParameters.start;
        input.pageSize = dataTablesParameters.length;
        input.searchText = dataTablesParameters.search.value;

        input.orderByDirection = dataTablesParameters.order[0].dir;
        input.orderBy = dataTablesParameters.columns[dataTablesParameters.order[0].column].name;

        this.conditionService.spGetConditiondata(input).subscribe(res => {

          if (res.status) {
            this.condition = res.data.records;
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

        { name: 'cm.Condtion', data: "condtion", orderable: true, searchable: true },
        { name: 'um.name', data: 'createdBy', orderable: true, searchable: true },
        {
          name: 'cm.UpdatedDate', data: 'updatedDate', orderable: true, searchable: true, render: function (data, type, row) {
            return moment(data + 'Z').format('DD/MM/YY hh:mm A')
          },
        },

        {
          name: '', data: 'conditonId', orderable: false, searchable: false, render: function (data, type, row) {

            return '<button class="btn-shadow btn btn-success me-2 pointer" onClick=\"document.getElementById(\'hdnClickEdit\').value=' + data + '; document.getElementById(\'hdnClickEdit\').click()\">Edit</button><button class="btn-shadow btn btn-warning pointer me-2" onClick=\"document.getElementById(\'hdnClickView\').value=' + data + '; document.getElementById(\'hdnClickView\').click()\">View</button><button class="btn-shadow btn btn-danger  pointer" onClick=\"document.getElementById(\'hdnClickDelete\').value=' + data + '; document.getElementById(\'hdnClickDelete\').click()\">Delete</button>';
          },
        }
      ],
      autoWidth: false
    }
    $('#loader').hide();
  }
  openModal(id: any = 0, isView: any) {
    this.isSubmitted = false;
    this.hasViewModel = isView;
    this.resetConditionForm();
    this.conditionForm.reset(this.conditionForm.value);
    this.conditionForm.get('ConditonId')?.setValue(0);
    
    if (id > 0) {
      this.EditCondition(id);
      this.modalTitle = 'Update Condition';

    }
    else {
      this.modalTitle = "Add Condition"

    }
    if (isView) {
      //this.disableConditionForm();

      this.conditionForm.get("Condtion")?.disable();
      this.modalTitle = "View Condition";
    }
    else {
      this.conditionForm.enable();
    }


    this.modalService.open(this.conditionModal, { ariaLabelledBy: 'modal-basic-title', backdrop: false });
  }
  resetConditionForm() {
    this.conditionForm.get('Condtion')?.setValue('');
  }
  // disableConditionForm() {
  //   this.conditionForm.get("condtion")?.disable();
  // }
  SaveCondition() {
    this.isSubmitted = true;
    if (this.conditionForm.valid) {
      $('#loader').show();
      var formVal = JSON.parse(JSON.stringify(this.conditionForm.getRawValue()));

      formVal.ConditonId = parseInt(formVal.ConditonId);
      this.conditionService.AddCondition(formVal).subscribe(res => {

        if (res.status) {
          this.modalService.dismissAll();
          if (res.data.conditonId == 0)
            this.toastr.SuccessToastr("Condition added successfully.");


          else {
            this.toastr.SuccessToastr("Condition Updated SuccessFully");
          }
          $('#loader').hide();
          $(".table").DataTable().ajax.reload();

        }


      }, (err: any) => {

        $('#loader').hide();
        this.toastr.ErrorToastr("Something missing");
      })
    }
  }
  DeleteCondition(e) {

    this.alerts.ComfirmAlert("Do you want to delete Condition?", "Yes", "No").then(res => {

      if (res.isConfirmed) {
        $('#loader').show();
        var input = {
          ConditonId: e.target.value
        }
        this.conditionService.RemoveCondition(input).subscribe(res => {

          if (res.status) {
            this.toastr.SuccessToastr("Condition deleted successfully.");
            $('#loader').hide();
            $(".table").DataTable().ajax.reload();
          }
          else {
            this.toastr.ErrorToastr(res.message);
            $('#loader').hide();

          }
          $('#loader').hide();
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
  EditCondition(id: any) {
    $('#loader').show();
    var input = {
      ConditonId: id
    }
    this.conditionService.getConditionbyId(input).subscribe(res => {
      //this.resetsponcerform();
      if (res.status) {
        $('#loader').hide();
        this.conditionForm.get('ConditonId')?.setValue(res.data.conditonId);
        this.conditionForm.get('Condtion')?.setValue(res.data.condtion);

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

  clickEdit(e) {
    this.openModal(e.target.value, false)
  }
  clickView(e) {
    this.openModal(e.target.value, true)
  }

}


