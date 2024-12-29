import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeePayOption } from 'src/app/models/fee-pay-option.model';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { EmittService } from 'src/app/Services/emitt.service';
import { FeePayByService } from 'src/app/Services/feepayby.service';
import { ToastrServiceService } from 'src/app/services/toastr-service.service';

@Component({
  selector: 'app-feepayby',
  templateUrl: './feepayby.component.html',
  styleUrls: ['./feepayby.component.sass']
})
export class FeepaybyComponent implements OnInit {
  isSubmitted: boolean = false;
  modalTitle = 'Add Fee Payer';
  dtOptions: DataTables.Settings = {};
  feePayByForm: FormGroup = new FormGroup({
    feePaidPerson: new FormControl(),
    feePaybyId: new FormControl()
  });
  feepays: Array<FeePayOption> = [];
  feepayby?: FeePayOption;
  constructor(private modalService: NgbModal, private feePayByService: FeePayByService, private formBuilder: FormBuilder, private router: Router, private alerts: AlertServiceService, private toastr: ToastrServiceService, private emittService: EmittService) {

    this.feePayByForm = formBuilder.group({
      feePaidPerson: ['', Validators.required],
      feePaybyId: ['0']
    })
    emittService.onChangeAddApplicationbtnHideShow(false);
  }
  ngOnInit(): void {
    this.loadfeepayby();
  }
  get f() {
    return this.feePayByForm.controls;
  }

  loadfeepayby() {
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
        this.feepays = [];
        input.size = dataTablesParameters.length;
        input.index = dataTablesParameters.start / dataTablesParameters.length;
        input.index++;
        input.Search = dataTablesParameters.search.value;
        input.OrderByDirection = dataTablesParameters.order[0].dir;
        input.sortingColumn = dataTablesParameters.order[0].column;
        input.OrderBy = dataTablesParameters.columns[input.sortingColumn].data;
        this.feePayByService.getAllFeePayBy(input).subscribe(res => {

          if (res.status) {
            this.feepays = res.data.records;
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
      columns: [{ data: '', orderable: true }, { data: 'feePaidPerson', orderable: true }],
      autoWidth: false
    }
  }
  openModal(content: any, id: any = 0) {
    this.feePayByForm.reset(this.feePayByForm.value);
    if (id > 0) {
      this.modalTitle = "Update fee payer";
      this.Getfeepayby(id);
    }
    else {
      this.modalTitle = "Add fee payer";
      this.resetFeePayByForm();
    }
    this.isSubmitted = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: false });
  }
  Getfeepayby(id: any) {
    this.feepayby = this.feepays.find(m => m.feePaybyId == id);
    this.feePayByForm.get('feePaidPerson')?.setValue(this.feepayby?.feePaidPerson);
    this.feePayByForm.get('feePaybyId')?.setValue(this.feepayby?.feePaybyId);
  }

  resetFeePayByForm() {
    this.feePayByForm.get('feePaidPerson')?.setValue('');
    this.feePayByForm.get('feePaybyId')?.setValue('0');
  }

  SaveFeePayBy() {
    this.isSubmitted = true;
    if (this.feePayByForm.valid) {
      $('#loader').show();
      var formVal = JSON.parse(JSON.stringify(this.feePayByForm.getRawValue()));

      formVal.feePaybyId = parseInt(formVal.feePaybyId);
      this.feePayByService.saveFeePayBy(formVal).subscribe(res => {

        if (res.status) {
          this.modalService.dismissAll();
          if (res.data.feePaybyId == 0)
            this.toastr.SuccessToastr("Fee payer added successfully.");
          else
            this.toastr.SuccessToastr("Fee payer updated successfully.");
          $(".table").DataTable().ajax.reload();
        }
        else {
          this.toastr.ErrorToastr("fee payer is not added.");
        }
        $('#loader').hide();
      }, (err: any) => {
        $('#loader').hide();
        this.toastr.ErrorToastr("Something missing");
      })
    }
  }

  deleteFeePayBy(id: any) {
    this.alerts.ComfirmAlert("Do you want to delete fee payer option?", "Yes", "No").then(res => {
      if (res.isConfirmed) {
        $('#loader').show();
        let deleteInput = {
          id: id
        };
        this.feePayByService.deleteFeePayBy(deleteInput).subscribe(res => {

          if (res.status) {
            this.toastr.SuccessToastr("Fee payer deleted successfully.");
            $(".table").DataTable().ajax.reload();
          }
          else {
            this.toastr.ErrorToastr(res.message);
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
            }
          })
      }
    })
  }

}
