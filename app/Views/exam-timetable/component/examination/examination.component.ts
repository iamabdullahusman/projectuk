import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import dayjs from "dayjs";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { forkJoin } from "rxjs";
import { ExamTimetable } from "src/app/Models/exam-timetable.model";
import { ExamType } from "src/app/Models/exam-type";
import { Examination } from "src/app/Models/examination.model";
import { Room } from "src/app/Models/room.model";
import { SubjectManage } from "src/app/Models/subject-manage.model";
import { Teacher } from "src/app/Models/teacher.model";
import { CustomValidationService } from "src/app/Services/custom-validation.service";
import { DatetimeService } from "src/app/Services/datetime.service";
import { ExamTimetableService } from "src/app/Services/exam-timetable.service";
import { SubjectService } from "src/app/Services/subject.service";
import { TeacherService } from "src/app/Services/teacher.service";
import { AlertServiceService } from "src/app/services/alert-service.service";
import { RoomService } from "src/app/services/room.service";
import { ToastrServiceService } from "src/app/services/toastr-service.service";

@Component({
  selector: "app-examination",
  templateUrl: "./examination.component.html",
  styleUrls: ["./examination.component.sass"],
})
export class ExaminationComponent implements OnInit {
  [x: string]: any;
  examId = 0;
  dtOptions: DataTables.Settings = {};
  modalTitle = "Add Examination";
  examinations: Array<Examination> = [];
  examinationForm: FormGroup;
  EXAM_TYPE = ExamType;
  teachers: Array<Teacher> = [];
  rooms: Array<Room> = [];
  color = "accent";
  examTimetable:ExamTimetable;
  minDate = dayjs().format("YYYY-MM-DD");
  maxDate = dayjs().format("YYYY-MM-DD");
  subjects: Array<SubjectManage> = [];
  subject: { [key: number]: string } = {};
  options: IDropdownSettings = {
    idField: "subjectManagementId",
    textField: "fullSubjectName",
    itemsShowLimit: 3,
    allowSearchFilter: true,
    singleSelection: false,
    selectAllText: "All Subject selected",
  };

  @ViewChild("examinationModal") examinationModal: ElementRef;
  constructor(
    private examService: ExamTimetableService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private toastr: ToastrServiceService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private roomService: RoomService,
    private teacherService: TeacherService,
    private subjectService: SubjectService,
    private customValidation: CustomValidationService,
    private dateTimeService: DatetimeService,
    private alertService:AlertServiceService
  ) {
    this.buildForm();
    activeRoute.params.subscribe((param) => {
      if (param["id"]) {
        this.examId = parseInt(param["id"]);
        this.loadExamTimeTable();
      }
    });
  }

  ngOnInit(): void {
    this.loadExaminations();
    this.loadData();
  }

  buildForm() {
    this.examinationForm = this.fb.group(
      {
        examinationId: [0, [Validators.required]],
        subjectManagementIds: [null, [Validators.required]],
        type: [null, [Validators.required]],
        examinationStartDate: ["", [Validators.required]],
        examinationEndDate: ["", [Validators.required]],
        location: ["", [Validators.required]],
        invigilatorOne: [null, [Validators.required]],
        invigilatorTwo: [null, [Validators.required]],
        markingDue: ["", [Validators.required]],
        comment: [""],
      },
      {
        validator: this.customValidation.dateRangeValidation(
          "examinationStartDate",
          "examinationEndDate"
        ),
      }
    );
  }

  get ef() {
    return this.examinationForm.controls;
  }

  loadExamTimeTable() {
    this.examService.getExamTimetableById(this.examId).subscribe(
      (res) => {
        if (res.status) {
          this.minDate = dayjs(res.data.startDate).format("YYYY-MM-DD");
          this.maxDate = dayjs(res.data.endDate).format("YYYY-MM-DD");
          this.examTimetable = res.data;
        } else this.toastr.ErrorToastr(res.message);
      },
      (err: any) => this.handleApiError(err)
    );
  }

  loadExaminations() {
    let input = {
      size: 10,
      index: 1,
      search: "",
      orderBy: "",
      orderByDirection: "",
      examTimeTableId: this.examId,
    };
    this.dtOptions = {
      pagingType: "simple_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching: true,
      order: [2, "desc"],
      language: {
        infoFiltered: "",
      },
      ajax: (dataTablesParameters: any, callback) => {
        input.size = dataTablesParameters.length;
        input.index = dataTablesParameters.start / dataTablesParameters.length;
        input.search = dataTablesParameters.search.value;
        input.orderByDirection = dataTablesParameters.order[0].dir;
        input.orderBy =
          dataTablesParameters.columns[
            dataTablesParameters.order[0].column
          ].data;
        input.index++;
         this.examService.showLoader();
        this.examService.getAllExamination(input).subscribe(
          (res: any) => {
            console.log("examService load",res);
            if (res && res.status && res.data) {
              this.subject = {};
              this.examinations = res.data.records;
              console.log("examinations 1",this.examinations);
              this.examinations.forEach((m) => {
                this.subject[m.examinationId] = this.getSubjectList(m.subjects);
              });
              console.log("examinations 2",this.examinations);
            } else this.toastr.ErrorToastr(res.message);
            callback({
              recordsTotal: res.data.totalCounts,
              recordsFiltered: res.data.totalCounts,
              data: [],
            });
            this.examService.hideLoader();
          },
          (err: any) => this.handleApiError(err)
        );
      },
      columns: [
        { data: "", orderable: false },
        { data: "", orderable: false },
        { data: "examinationstartdate", orderable: true },
        { data: "roomName", orderable: true },
        { data: "", orderable: false },
      ],
      autoWidth: false,
    };
  }

  loadData() {
    const payload = {
      index: 0,
      size: 0,
    };
    this.teacherService.showLoader();
    const teacherApi = this.teacherService.getAllTeacher(payload);
    const roomApi = this.roomService.getAllRoom(payload);
    const subjectApi = this.subjectService.getAllSubjectManagement(payload);
    forkJoin([teacherApi, roomApi, subjectApi]).subscribe(
      (result) => {
        if (result[0]) {
          if (result[0].status) {
            this.teachers = result[0].data.records;
          } else this.toastr.ErrorToastr(result[0].message);
        }
        if (result[1]) {
          if (result[1].status) {
            this.rooms = result[1].data.records;
          } else this.toastr.ErrorToastr(result[1].message);
        }
        if (result[2]) {
          if (result[2].status) {
            this.subjects = result[2].data.records;
          } else this.toastr.ErrorToastr(result[2].message);
        }
        this.teacherService.hideLoader();
      },
      (err: any) => this.handleApiError(err)
    );
  }

  openModal(content: ElementRef, id: number | undefined = undefined) {
    this.resetForm();
    this.modalTitle = "Add examination";
    this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      backdrop: false,
    });
  }
  saveExamination() {
    this.examinationForm.markAllAsTouched();
    if (this.examinationForm.valid) {
      let payload = this.examinationForm.getRawValue();
      payload.subjectManagementIds = payload.subjectManagementIds.map(
        (m) => m.subjectManagementId
      );
      console.log(dayjs(payload.examinationEndDate).toDate());
      payload.examinationEndDate = this.dateTimeService.setWriteOffset(
        dayjs(payload.examinationEndDate).toDate()
      );
      payload.examinationStartDate = this.dateTimeService.setWriteOffset(
        dayjs(payload.examinationStartDate).toDate()
      );
      console.log(payload);
      payload = {
        ...payload,
        examTimetableId: this.examId,
      };
      if (!payload.examinationId || payload === 0) {
        this.examService.showLoader();
        this.examService.createExamination(payload).subscribe(
          (res) => {
            if (res.status) {
              this.modalService.dismissAll();
              this.toastr.SuccessToastr(res.message);
              $(".table").DataTable().ajax.reload();
            } else this.toastr.ErrorToastr(res.message);
            this.examService.hideLoader();
          },
          (err: any) => this.handleApiError(err)
        );
      } else {
        this.examService.showLoader();
        this.examService.updateExamination(payload).subscribe(
          (res) => {
            if (res.status) {
              this.modalService.dismissAll();
              $(".table").DataTable().ajax.reload();
              this.toastr.SuccessToastr(res.message);
            } else this.toastr.ErrorToastr(res.message);
            this.examService.hideLoader();
          },
          (err: any) => this.handleApiError(err)
        );
      }
    }
  }

  deleteExamination(id: number) {
    if (confirm("Do you want to delete this examination?")) {
      this.examService.showLoader();
      this.examService.deleteExamination(id).subscribe(
        (res) => {
          if (res.status) {
            $(".table").DataTable().ajax.reload();
            this.toastr.SuccessToastr(res.message);
          } else this.toastr.ErrorToastr(res.message);
          this.examService.hideLoader();
        },
        (err: any) => this.handleApiError(err)
      );
    }
  }

  onUpdateClick(id: number) {
    const examination = this.examinations.find((m) => m.examinationId === id);
    if (examination) {
      const selectedSubjectsId = examination.subjects.map(
        (m) => m.subjectManagementId
      );
      var selectedSubjects = this.subjects.filter((m) =>
        selectedSubjectsId.includes(m.subjectManagementId)
      );
      this.modalTitle = "Update Examination";
      this.resetForm();
      this.examinationForm.patchValue(examination);
      this.examinationForm
        .get("markingDue")
        .setValue(dayjs(examination.markingDue).format("YYYY-MM-DD"));
      this.examinationForm
        .get("subjectManagementIds")
        .setValue(selectedSubjects);
      this.modalService.open(this.examinationModal, {
        ariaLabelledBy: "modal-basic-title",
        backdrop: false,
      });
    }
  }

  handleApiError(err: any) {
    if (err.status == 401) {
      this.router.navigate(["/"]);
    } else {
      this.toastr.ErrorToastr("Something went wrong");
    }
    this.examService.hideLoader();
  }

  resetForm() {
    this.examinationForm.reset();
    this.examinationForm.get("examinationId").setValue(0);
  }

  getSubjectList(subjectManagement: any) {
    let subjectList = "<ul>";
    subjectManagement.forEach((element) => {
      subjectList += "<li>" + element.fullSubjectName + "</li>";
    });
    subjectList += "</ul>";
    return subjectList;
  }

  activeInactiveExamTimetable(event:any){
    const activeInactiveText = this.examTimetable.isActive
      ? "in-active"
      : "active";
    this.alertService
      .ComfirmAlert(
        "Do you want to " + activeInactiveText + " this exam timetable?",
        "Yes",
        "No"
      )
      .then((res) => {
        console.log("activeInactiveExamTimetable",res);
        if (res.isConfirmed) {
          this.examService.showLoader();
          const payload = {
            examTimeTableId: this.examTimetable.id,
            isActive: !this.examTimetable.isActive,
          };
          this.examService.updateExamTimeTableActiveAndInActive(payload).subscribe(
            (m) => {
              console.log("examService",m);
              if (m.status) {
                this.toastr.SuccessToastr(m.message);
                this.examTimetable.isActive =
                  !this.examTimetable.isActive;
              } else {
                this.toastr.ErrorToastr(m.message);
              }
              this.examService.hideLoader();
            },
            (err: any) => this.handleApiError(err)
          );
        } else {
          event.source.checked = this.examTimetable.isActive;
        }
      });
  }
  back(){
    this.router.navigate(["/exam-timetable"]);
  }
}
