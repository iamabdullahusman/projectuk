import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import dayjs from "dayjs";
import { data } from "jquery";
import { forkJoin } from "rxjs";
import { Group } from "src/app/Models/group.modal";
import { SubjectManage } from "src/app/Models/subject-manage.model";
import { Subject } from "src/app/Models/subject.model";
import { Teacher } from "src/app/Models/teacher.model";
import { Term } from "src/app/Models/term";
import { CustomValidationService } from "src/app/Services/custom-validation.service";
import { GroupService } from "src/app/Services/group.service";
import { SubjectService } from "src/app/Services/subject.service";
import { TeacherService } from "src/app/Services/teacher.service";
import { TermService } from "src/app/Services/term.service";
import { IntakeService } from "src/app/services/intake.service";
import { ToastrServiceService } from "src/app/services/toastr-service.service";

@Component({
  selector: "app-subject-management",
  templateUrl: "./subject-management.component.html",
  styleUrls: ["./subject-management.component.sass"],
})
export class SubjectManagementComponent implements OnInit {
  @ViewChild("subjectManageModal") subjectManageModal: ElementRef;
  subjectManageForm: FormGroup;
  dtOptions: DataTables.Settings = {};
  subjectManages: Array<SubjectManage> = [];
  intakes: any = [];
  terms: Array<Term> = [];
  groups: Array<Group> = [];
  subjects: Array<Subject> = [];
  teachers: Array<Teacher> = [];
  
  constructor(
    private fb: FormBuilder,
    private toast: ToastrServiceService,
    private subjectService: SubjectService,
    private intakeService: IntakeService,
    private termService: TermService,
    private groupService: GroupService,
    private teacherService: TeacherService,
    private modalService: NgbModal,
    private router: Router,

  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.loadMangeSubject();
    this.loadData();
  }

  buildForm() {
    this.subjectManageForm = this.fb.group(
      {
        subjectManagementId: [0],
        intakeId: [null, Validators.required],
        termId: [null, Validators.required],
        subjectId: [null, Validators.required],
        teacherId: [null, Validators.required],
        groupId: [null, Validators.required],
      }
    );
   }

  get smf() {
    return this.subjectManageForm.controls;
  }

  loadMangeSubject() {
    let input = {
      size: 10,
      index: 1,
      search: "",
      orderBy: "",
      orderByDirection: "",
    };
    this.dtOptions = {
      pagingType: "simple_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching: true,
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
        this.subjectService.showLoader();
        this.subjectService.getAllSubjectManagement(input).subscribe(
          (res: any) => {
                if (res.status)
                 this.subjectManages = res.data.records;
                else this.toast.ErrorToastr(res.message)
            callback({
              recordsTotal: res.data.totalCounts,
              recordsFiltered: res.data.totalCounts,
              data: [],
            });
            this.subjectService.hideLoader();
          },
          (err: any) => this.handleApiError(err)
        );
      },
      columns: [
        { data: "subjectName", orderable: true },
        { data: "intakeName", orderable: true },
        { data: "termName", orderable: true },
        { data: "groupName", orderable: true },
        { data: "teacherName", orderable: true },
        { data: "", orderable: false },
      ],
      autoWidth: false,
    };
  }

  loadData() {
    this.subjectService.showLoader();
    const payload = {
      index: 0,
      size: 0,
    };
    const intakeApi = this.intakeService.getAllIntake(payload);
    const subjectApi = this.subjectService.getAllSubject({
      ...payload,
      orderByDirection: "asc",
      orderBy: "subjectName",
    });
    const termApi = this.termService.getAllTerm({
      ...payload,
      orderByDirection: "asc",
      orderBy: "termName",
    });
    const groupApi = this.groupService.getAllGroup({
      ...payload,
      orderByDirection: "asc",
      orderBy: "groupName",
    });
    const teacherApi = this.teacherService.getAllTeacher({
      ...payload,
      orderByDirection: "asc",
      orderBy: "surname",
    });
    this.subjectService.showLoader();
    forkJoin([intakeApi, subjectApi, termApi, groupApi, teacherApi]).subscribe(
      (result) => {
        if (result[0]) {
          if (result[0].status) this.intakes = result[0].data.records;
          else this.toast.ErrorToastr(result[0].message);
        }
        if (result[1]) {
          if (result[1].status) this.subjects = result[1].data.records;
          else this.toast.ErrorToastr(result[1].message);
        }
        if (result[2]) {
          if (result[2].status) this.terms = result[2].data.records;
          else this.toast.ErrorToastr(result[2].message);
        }
        if (result[3]) {
          if (result[3].status) this.groups = result[3].data.records;
          else this.toast.ErrorToastr(result[3].message);
        }
        if (result[4]) {
          if (result[4].status) this.teachers = result[4].data.records;
          else this.toast.ErrorToastr(result[4].message);
        }
        this.subjectService.hideLoader();

      },
      (err: any) => this.handleApiError(err)
    );
  }

  openModal(content: ElementRef) {
    this.resetForm();
    this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      backdrop: false,
    });
  }

  save() {
    if (this.subjectManageForm.valid) {
      const payload = this.subjectManageForm.getRawValue();
      debugger
      if (payload.subjectManagementId === 0) {

        this.subjectService.createSubjectManagement(payload).subscribe(res => {
          if (res.status) {
            this.modalService.dismissAll();
            this.toast.SuccessToastr(res.message);
            $(".table").DataTable().ajax.reload();
          }
          else this.toast.ErrorToastr(res.message)
          this.subjectService.hideLoader();
        }, err => {
          this.handleApiError(err);
        })
      }
      else{
        this.subjectService.updateSubjectManagement(payload).subscribe(res => {
          if (res.status) {
            this.modalService.dismissAll();
            this.toast.SuccessToastr(res.message);
            $(".table").DataTable().ajax.reload();
          }
          else this.toast.ErrorToastr(res.message)
          this.subjectService.hideLoader();
        }, err => {
          this.handleApiError(err);
        })
      }
    }
    
  }

  getManageById(id: number) {
    this.resetForm();
    this.subjectService.showLoader();
    this.subjectManageForm.get("subjectManagementId").setValue(id);
    this.subjectService.getSubjectManagementById(id).subscribe(res=>{
      if(res.status){
        const management = res.data;
        this.subjectManageForm.patchValue(management);
        this.modalService.open(this.subjectManageModal, {
          ariaLabelledBy: "modal-basic-title",
          backdrop: false,
        });
      }
      else
        this.toast.ErrorToastr(res.message);
      this.subjectService.hideLoader();
    },(err:any)=>this.handleApiError(err));
  }

  resetForm() {
    this.subjectManageForm.reset();
    this.smf["subjectManagementId"].setValue(0);
  }
  handleApiError(err: any) {
    if (err.status == 401) {
      this.router.navigate(["/"]);
    } else {
      this.toast.ErrorToastr("Something went wrong");
    }
    this.subjectService.hideLoader();
  }
}
