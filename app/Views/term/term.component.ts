import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Term } from 'src/app/Models/term';
import { TermService } from 'src/app/Services/term.service';
import { ToastrServiceService } from 'src/app/services/toastr-service.service';

@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.sass']
})
export class TermComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  modalTitle = "Add Term";
  terms: Array<Term> = [];
  termForm = new FormGroup({
    termId: new FormControl(),
    termName: new FormControl(),
    startMonth: new FormControl(),
    endMonth: new FormControl(),
  });

  @ViewChild('termModal') termModal: ElementRef;

  constructor(private modalService: NgbModal, private fb: FormBuilder, private termService: TermService, private router: Router, private toastr: ToastrServiceService) {
    this.termForm = fb.group({
      termId: [0, [Validators.required]],
      termName: ['', [Validators.required]],
      startMonth: ['', [Validators.required]],
      endMonth: ['', [Validators.required]],
    })
  }

  months: string[] = [];

  get tf() {
    return this.termForm.controls;
  }

  ngOnInit(): void {
    this.loadTerms();
    this.loadMonths();
  }
  loadMonths() {
    this.months.push("January");
    this.months.push("Febuary");
    this.months.push("March");
    this.months.push("April");
    this.months.push("May");
    this.months.push("June");
    this.months.push("July");
    this.months.push("August");
    this.months.push("September");
    this.months.push("October");
    this.months.push("November");
    this.months.push("December");
  }
  loadTerms() {
    let input = {
      size: 10,
      index: 1,
      search: '',
      orderBy: '',
      orderByDirection: '',
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
        input.size = dataTablesParameters.length;
        input.index = dataTablesParameters.start / dataTablesParameters.length;
        input.search = dataTablesParameters.search.value;
        input.orderByDirection = dataTablesParameters.order[0].dir;
        input.orderBy = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
        input.index++;
        this.termService.showLoader();
        this.termService.getAllTerm(input).subscribe((res: any) => {
          if (res.status)
            this.terms = res.data.records;
          else this.toastr.ErrorToastr(res.message)
          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: []
          });
          this.termService.hideLoader();
        }, (err: any) => this.handleApiError(err))
      },
      columns: [{ data: 'termName', orderable: true }, { data: 'startMonth', orderable: true }, { data: 'endMonth', orderable: true }, { data: '', orderable: false }],
      autoWidth: false
    }
  }
  openModal(content: ElementRef, id: number | undefined = undefined) {
    this.resetForm();
    this.modalTitle="Add term";
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: false });
  }
  saveTerm() {
    if (this.termForm.valid) {
      const payload = this.termForm.getRawValue();
      if (!payload.termId || payload === 0) {
        this.termService.showLoader();
        this.termService.createTerm(payload).subscribe(res => {
          if (res.status) {
            this.modalService.dismissAll();
            this.toastr.SuccessToastr(res.message);
            $(".table").DataTable().ajax.reload();
          }
          else this.toastr.ErrorToastr(res.message)
          this.termService.hideLoader();
        }, (err: any) => this.handleApiError(err))
      }
      else {
        this.termService.showLoader();
        this.termService.updateTerm(payload).subscribe(res => {
          if (res.status) {
            this.modalService.dismissAll();
            $(".table").DataTable().ajax.reload();
            this.toastr.SuccessToastr(res.message);
          }
          else this.toastr.ErrorToastr(res.message);
          this.termService.hideLoader();
        }, (err: any) => this.handleApiError(err))
      }
    }
  }

  deleteTerm(id: number) {
    if (confirm("Do you want to delete this term?")) {
      this.termService.showLoader();
      this.termService.deleteTerm(id).subscribe((res) => {
        if (res.status) {
          $(".table").DataTable().ajax.reload();
          this.toastr.SuccessToastr(res.message);
        }
        else this.toastr.ErrorToastr(res.message)
        this.termService.hideLoader();
      }, (err: any) => this.handleApiError(err));
    }
  }

  onUpdateClick(id: number) {
    const term = this.terms.find(m => m.termId === id);
    if (term) {
      this.modalTitle="Update Term";
      this.resetForm();
      this.termForm.patchValue(term);
      this.modalService.open(this.termModal, { ariaLabelledBy: 'modal-basic-title', backdrop: false });
    }
  }

  handleApiError(err: any) {
    if (err.status == 401) {
      this.router.navigate(['/'])
    }
    else {
      this.toastr.ErrorToastr("Something went wrong");
    }
    this.termService.hideLoader();
  }

  resetForm(){
    this.termForm.reset();
    this.termForm.get("termId").setValue(0);
  }
}
