import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'src/app/Models/subject.model';
import { SubjectService } from 'src/app/Services/subject.service';
import { ToastrServiceService } from 'src/app/services/toastr-service.service';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.sass']
})
export class SubjectComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  modalTitle = '';
  subjectForm = new FormGroup({
    subjectId: new FormControl(),
    subjectName: new FormControl(),
    subjectType: new FormControl()
  });
  subjects: Array<Subject> = [];
  @ViewChild('subjectModal') subjectModal: ElementRef;
  constructor(private modalService: NgbModal, private fb: FormBuilder, private subjectService: SubjectService, private router: Router, private toastr: ToastrServiceService) {
    this.subjectForm = fb.group({
      subjectId: [0],
      subjectName: ['', Validators.required],
      subjectType: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.loadSubject();
  }

  get sf() {
    return this.subjectForm.controls;
  }

  loadSubject(){
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
        this.subjectService.showLoader();
        this.subjectService.getAllSubject(input).subscribe((res: any) => {
          if (res.status)
            this.subjects = res.data.records;
          else this.toastr.ErrorToastr(res.message)
          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: []
          });
          this.subjectService.hideLoader();
        }, (err: any) => this.handleApiError(err))
      },
      columns: [{ data: 'subjectName', orderable: true }, { data: 'subjectType', orderable: true }, { data: '', orderable: false }],
      autoWidth: false
    }
  }

  openModal(content: ElementRef) {
    this.resetForm();
    this.modalTitle='Add Subject';
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: false });
  }

  saveSubject() {
    if (this.subjectForm.valid) {
      let payload = this.subjectForm.getRawValue();
      this.subjectService.showLoader();
      if (payload.subjectId === 0) {

        this.subjectService.createSubject(payload).subscribe(res => {
          if (res.status) {
            this.modalService.dismissAll();
            this.toastr.SuccessToastr(res.message);
            $(".table").DataTable().ajax.reload();
          }
          else this.toastr.ErrorToastr(res.message)
          this.subjectService.hideLoader();
        }, err => {
          this.handleApiError(err);
        })
      }
      else{
        this.subjectService.updateSubject(payload).subscribe(res => {
          if (res.status) {
            this.modalService.dismissAll();
            this.toastr.SuccessToastr(res.message);
            $(".table").DataTable().ajax.reload();
          }
          else this.toastr.ErrorToastr(res.message)
          this.subjectService.hideLoader();
        }, err => {
          this.handleApiError(err);
        })
      }
    }
  }

  onUpdateClick(id: number) {
    this.resetForm();
    this.modalTitle='Update Subject'
    const subject = this.subjects.find(m=>m.subjectId === id);
    this.subjectForm.patchValue(subject);
    this.modalService.open(this.subjectModal, { ariaLabelledBy: 'modal-basic-title', backdrop: false });
  }

  deleteSubject(id: number) {
    if(confirm("can you delete this subject?")){
      this.subjectService.showLoader();
      this.subjectService.deleteSubject(id).subscribe(res=>{
        if (res.status) {
          this.resetForm();
          this.modalService.dismissAll();
          this.toastr.SuccessToastr(res.message);
          $(".table").DataTable().ajax.reload();
        }
        else this.toastr.ErrorToastr(res.message)
        this.subjectService.hideLoader();        
      },(err:any)=>{
        this.handleApiError(err);
      })
    }
  }

  resetForm() {
    this.subjectForm.reset();
    this.subjectForm.get("subjectId").setValue(0);
  }

  handleApiError(err: any) {
    if (err.status == 401) {
      this.router.navigate(['/'])
    }
    else {
      this.toastr.ErrorToastr("Something went wrong");
    }
    this.subjectService.hideLoader();
  }
}
