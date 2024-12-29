import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import dayjs from 'dayjs';
import { ExamTimetable } from 'src/app/Models/exam-timetable.model';
import { CustomValidationService } from 'src/app/Services/custom-validation.service';
import { ExamTimetableService } from 'src/app/Services/exam-timetable.service';
import { ToastrServiceService } from 'src/app/services/toastr-service.service';

@Component({
  selector: 'app-exam-timetable',
  templateUrl: './exam-timetable.component.html',
  styleUrls: ['./exam-timetable.component.sass']
})
export class ExamTimetableComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  modalTitle = "Add Exam Timetable";
  examTimetables: Array<ExamTimetable> = [];
  examTimetableForm = new FormGroup({
    examTimeTableId: new FormControl(),
    examTimeTableName: new FormControl(),
    startDate: new FormControl(),
    endDate: new FormControl(),
  });

  @ViewChild('examTimetableModal') examTimetableModal: ElementRef;

  constructor(private modalService: NgbModal, private fb: FormBuilder, private examTimetableService: ExamTimetableService, private router: Router, private toastr: ToastrServiceService, private customValidation:CustomValidationService) {
    this.examTimetableForm = fb.group({
      examTimeTableId: [0, [Validators.required]],
      examTimeTableName: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
    },{
      validator: this.customValidation.dateRangeValidation('startDate','endDate')
    })
  }

  months: string[] = [];

  get ef() {
    return this.examTimetableForm.controls;
  }

  ngOnInit(): void {
    this.loadExamTimetables();
  }
  loadExamTimetables() {
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
        this.examTimetableService.showLoader();
        this.examTimetableService.getAllExamTimetable(input).subscribe((res: any) => {
          if (res.status)
            this.examTimetables = res.data.records;
          else this.toastr.ErrorToastr(res.message)
          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: []
          });
          this.examTimetableService.hideLoader();
        }, (err: any) => this.handleApiError(err))
      },
      columns: [{ data: 'examTimeTableName', orderable: true }, { data: 'startDate', orderable: true }, { data: 'endDate', orderable: true }, { data: '', orderable: false }],
      autoWidth: false
    }
  }
  openModal(content: ElementRef, id: number | undefined = undefined) {
    this.resetForm();
    this.modalTitle="Add exam Timetable";
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: false });
  }
  saveExamTimetable() {
    this.examTimetableForm.markAllAsTouched();
    if (this.examTimetableForm.valid) {
      const payload = this.examTimetableForm.getRawValue();
      if (!payload.examTimeTableId || payload.examTimeTableId === 0) {
        this.examTimetableService.showLoader();
        this.examTimetableService.createExamTimetable(payload).subscribe(res => {
          if (res.status) {
            this.modalService.dismissAll();
            this.toastr.SuccessToastr(res.message);
            $(".table").DataTable().ajax.reload();
          }
          else this.toastr.ErrorToastr(res.message)
          this.examTimetableService.hideLoader();
        }, (err: any) => this.handleApiError(err))
      }
      else {
        this.examTimetableService.showLoader();
        this.examTimetableService.updateExamTimetable(payload).subscribe(res => {
          if (res.status) {
            this.modalService.dismissAll();
            $(".table").DataTable().ajax.reload();
            this.toastr.SuccessToastr(res.message);
          }
          else this.toastr.ErrorToastr(res.message);
          this.examTimetableService.hideLoader();
        }, (err: any) => this.handleApiError(err))
      }
    }
  }

  deleteExamTimetable(id: number) {
    if (confirm("Do you want to delete this exam timetable?")) {
      this.examTimetableService.showLoader();
      this.examTimetableService.deleteExamTimetable(id).subscribe((res) => {
        if (res.status) {
          $(".table").DataTable().ajax.reload();
          this.toastr.SuccessToastr(res.message);
        }
        else this.toastr.ErrorToastr(res.message)
        this.examTimetableService.hideLoader();
      }, (err: any) => this.handleApiError(err));
    }
  }

  onUpdateClick(id: number) {
    const examTimetable = this.examTimetables.find(m => m.examTimeTableId === id);
    if (examTimetable) {
      this.modalTitle="Update Exam Timetable";
      this.resetForm();
      this.examTimetableForm.patchValue(examTimetable);
      this.examTimetableForm.get("startDate").setValue(dayjs(examTimetable.startDate).format("YYYY-MM-DD"))
      this.examTimetableForm.get("endDate").setValue(dayjs(examTimetable.endDate).format("YYYY-MM-DD"))
      this.modalService.open(this.examTimetableModal, { ariaLabelledBy: 'modal-basic-title', backdrop: false });
    }
  }

  handleApiError(err: any) {
    if (err.status == 401) {
      this.router.navigate(['/'])
    }
    else {
      this.toastr.ErrorToastr("Something went wrong");
    }
    this.examTimetableService.hideLoader();
  }

  resetForm(){
    this.examTimetableForm.reset();
    this.examTimetableForm.get("examTimeTableId").setValue(0);
  }
}
