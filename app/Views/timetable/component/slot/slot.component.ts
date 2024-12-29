import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { forkJoin } from "rxjs";
import { Room } from "src/app/Models/room.model";
import { Slot } from "src/app/Models/slot.model";
import { SubjectManage } from "src/app/Models/subject-manage.model";
import { Timetable } from "src/app/Models/timetable.model";
import { CustomValidationService } from "src/app/Services/custom-validation.service";
import { SubjectService } from "src/app/Services/subject.service";
import { TimetableService } from "src/app/Services/timetable.service";
import { User } from "src/app/models/user.model";
import { AlertServiceService } from "src/app/services/alert-service.service";
import { RoomService } from "src/app/services/room.service";
import { ToastrServiceService } from "src/app/services/toastr-service.service";
import { UserManagement } from "src/app/services/user-management.service";

@Component({
  selector: "app-slot",
  templateUrl: "./slot.component.html",
  styleUrls: ["./slot.component.sass"],
})
export class SlotComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  modalTitle = "Add Slot";
  slots: Array<Slot> = [];
  slotForm: FormGroup;
  rooms: Array<Room> = [];
  timeTableId: number;
  timetableDetails: Timetable;
  days: Array<string> = [];
  students: Array<User> = [];
  subjectManagements: Array<SubjectManage> = [];
  options: IDropdownSettings = {
    idField: "userId",
    textField: "fullName",
    itemsShowLimit: 3,
    allowSearchFilter: true,
    singleSelection: false,
    selectAllText: "All student selected",
  };
  @ViewChild("slotModal") slotModal: ElementRef;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private timetableService: TimetableService,
    private roomService: RoomService,
    private subjectService: SubjectService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private userService: UserManagement,
    private toastr: ToastrServiceService,
    private alertService: AlertServiceService,
    private changeRef: ChangeDetectorRef,
    private customValidation:CustomValidationService
  ) {
    activeRouter.params.subscribe((param) => {
      if (param["id"]) {
        this.timeTableId = parseInt(param["id"]);
      }
    });
    this.buildForm();
  }

  months: string[] = [];
  color = "accent";
  get sf() {
    return this.slotForm.controls;
  }

  ngOnInit(): void {
    this.loadSlots();
    this.loadData();
  }

  buildForm() {
    this.slotForm = this.fb.group({
      timeTableSlotId: [0, [Validators.required]],
      roomId: [null, Validators.required],
      day: [null, Validators.required],
      subjectManagementId: [null, Validators.required],
      userId: [null, Validators.required],
      startTime: [null, [Validators.required]],
      endTime: [null, Validators.required],
    },{
      validator:this.customValidation.timeRangeValidation('startTime','endTime')
    });
  }

  loadData() {
    this.days = [];
    this.days.push("Monday");
    this.days.push("Tuesday");
    this.days.push("Wednesday");
    this.days.push("Thursday");
    this.days.push("Friday");
    this.days.push("Saturday");
    this.days.push("Sunday");
    this.timetableService.showLoader();
    const payload = {
      index: 0,
      size: 0,
    };
    const roomApi = this.roomService.getAllRoom({
      ...payload,
      orderByDirection: "asc",
      orderBy: "roomName",
    });
    const studentApi = this.userService.GetUsers({
      ...payload,
      userType: 5,
      orderByDirection: "asc",
      orderBy: "name",
    });
    const timetable = this.timetableService.getTimetableById(this.timeTableId);
    forkJoin([roomApi, timetable, studentApi]).subscribe(
      (result) => {
        if (result[0]) {
          if (result[0].status) {
            this.rooms = result[0].data.records;
          } else this.toastr.ErrorToastr(result[0].message);
        }
        if (result[1]) {
          if (result[1].status) {
            this.timetableDetails = result[1].data;
            this.loadSubject();
          } else this.toastr.ErrorToastr(result[1].message);
        }
        if (result[2]) {
          if (result[2].status) {
            this.students = result[2].data.records;
          }
        }
      },
      (err: any) => this.handleApiError(err)
    );
  }
  loadSubject() {
    this.subjectService
      .getSubjectManagementByIntakeAndTerm(
        this.timetableDetails.intakeId,
        this.timetableDetails.termId
      )
      .subscribe(
        (res) => {
          if (res.status) {
                        this.subjectManagements = res.data;
          }
        },
        (err: any) => this.handleApiError(err)
      );
  }
  loadSlots() {
    let input = {
      size: 10,
      index: 1,
      search: "",
      orderBy: "",
      orderByDirection: "",
      timeTableId: this.timeTableId,
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
        this.timetableService.showLoader();
        this.timetableService.getAllSlot(input).subscribe(
          (res: any) => {
            if (res.status) this.slots = res.data.records;
            else this.toastr.ErrorToastr(res.message);
            callback({
              recordsTotal: res.data.totalCounts,
              recordsFiltered: res.data.totalCounts,
              data: [],
            });
            this.timetableService.hideLoader();
          },
          (err: any) => this.handleApiError(err)
        );
      },
      columns: [
        { data: "day", orderable: true },
        { data: "", orderable: false },
        { data: "", orderable: false },
        { data: "roomName", orderable: true },
        { data: "", orderable: false },
      ],
      autoWidth: false,
    };
  }
  openModal(content: ElementRef, id: number | undefined = undefined) {
    this.resetForm();
    this.modalTitle = "Add slot";
    this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      backdrop: false,
    });
  }
  saveSlot() {
    if (this.slotForm.valid) {
      let payload = this.slotForm.getRawValue();
      payload.userId = payload.userId.map((m) => m.userId);
      payload = {
        ...payload,
        timeTableId: this.timeTableId,
      };
            if (!payload.timeTableSlotId || payload.timeTableSlotId === 0) {
        this.timetableService.showLoader();
        this.timetableService.createSlot(payload).subscribe(
          (res) => {
            if (res.status) {
              this.modalService.dismissAll();
              this.toastr.SuccessToastr(res.message);
              $(".table").DataTable().ajax.reload();
            } else this.toastr.ErrorToastr(res.message);
            this.timetableService.hideLoader();
          },
          (err: any) => this.handleApiError(err)
        );
      } else {
        this.timetableService.showLoader();
        this.timetableService.updateSlot(payload).subscribe(
          (res) => {
            if (res.status) {
              this.modalService.dismissAll();
              $(".table").DataTable().ajax.reload();
              this.toastr.SuccessToastr(res.message);
            } else this.toastr.ErrorToastr(res.message);
            this.timetableService.hideLoader();
          },
          (err: any) => this.handleApiError(err)
        );
      }
    }
  }

  deleteSlot(id: number) {
    if (confirm("Do you want to delete this slot?")) {
      this.timetableService.deleteSlot(id).subscribe(
        (res) => {
          if (res.status) {
            this.modalService.dismissAll();
            $(".table").DataTable().ajax.reload();
            this.toastr.SuccessToastr(res.message);
          } else this.toastr.ErrorToastr(res.message);
          this.timetableService.hideLoader();
        },
        (err: any) => this.handleApiError(err)
      );
    }
  }

  onUpdateClick(id: number) {
    const slot = this.slots.find((m) => m.timeTableSlotId === id);
    if (slot) {
      this.modalTitle = "Update Slot";
      this.resetForm();
      this.slotForm.patchValue(slot);
      this.slotForm
        .get("userId")
        .setValue(
          this.students.filter((m) => slot.studentIds.includes(m.userId))
        );
      this.modalService.open(this.slotModal, {
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
    this.timetableService.hideLoader();
  }

  resetForm() {
    this.slotForm.reset();
    this.slotForm.get("timeTableSlotId").setValue(0);
  }

  back() {
    this.router.navigate(["/timetable"]);
  }
  activeInactiveTimetable(event: MatSlideToggleChange) {
    const activeInactiveText = this.timetableDetails.isActive
      ? "in-active"
      : "active";
    this.alertService
      .ComfirmAlert(
        "Do you want to " + activeInactiveText + " this timetable?",
        "Yes",
        "No"
      )
      .then((res) => {
        if (res.isConfirmed) {
          this.timetableService.showLoader();
          const payload = {
            timeTableId: this.timetableDetails.id,
            isActive: !this.timetableDetails.isActive,
          };
          this.timetableService.timetableActiveInactive(payload).subscribe(
            (m) => {
              if (m.status) {
                this.toastr.SuccessToastr(m.message);
                this.timetableDetails.isActive =
                  !this.timetableDetails.isActive;
              } else {
                this.toastr.ErrorToastr(m.message);
              }
              this.timetableService.hideLoader();
            },
            (err: any) => this.handleApiError(err)
          );
        } else {
          event.source.checked = this.timetableDetails.isActive;
        }
      });
  }
}
