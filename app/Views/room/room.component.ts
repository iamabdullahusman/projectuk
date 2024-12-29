import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Room } from "src/app/Models/room.model";
import { ToastrServiceService } from "src/app/services/toastr-service.service";
import { RoomService } from "src/app/services/room.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-room",
  templateUrl: "./room.component.html",
  styleUrls: ["./room.component.sass"],
})
export class RoomComponent implements OnInit {
  rooms: Array<Room> = [];
  roomForm: FormGroup;
  dtOptions: DataTables.Settings = {};
  modalTitle = "Add Room";
  @ViewChild('roomModal') roomModal: ElementRef;
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private roomService: RoomService,
    private router: Router,
    private toastr: ToastrServiceService
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.loadRooms();
  }

  buildForm() {
    this.roomForm=this.fb.group({
      roomId:[0,Validators.required],
      roomName:['',Validators.required]
    })
  }

  get rf(){
    return this.roomForm.controls;
  }

  loadRooms() {
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
        this.roomService.showLoader();
        this.roomService.getAllRoom(input).subscribe((res: any) => {
          if (res.status)
            this.rooms =res.data.records;
          else this.toastr.ErrorToastr(res.message)
          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: []
          });
          this.roomService.hideLoader();
        }, (err: any) => this.handleApiError(err))
      },
      columns: [{ data: 'roomName', orderable: true }, { data: '', orderable: false }],
      autoWidth: false
    }
  }
  openModal(content: ElementRef, id: number | undefined = undefined) {
    this.resetForm();
    this.modalTitle="Add room";
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: false });
  }
  saveRoom() {
    if (this.roomForm.valid) {
      const payload = this.roomForm.getRawValue();
      if (!payload.roomId || payload === 0) {
        this.roomService.showLoader();
        this.roomService.createRoom(payload).subscribe(res => {
          if (res.status) {
            this.modalService.dismissAll();
            this.toastr.SuccessToastr(res.message);
            $(".table").DataTable().ajax.reload();
          }
          else this.toastr.ErrorToastr(res.message)
          this.roomService.hideLoader();
        }, (err: any) => this.handleApiError(err))
      }
      else {
        this.roomService.showLoader();
        this.roomService.updateRoom(payload).subscribe(res => {
          if (res.status) {
            this.modalService.dismissAll();
            $(".table").DataTable().ajax.reload();
            this.toastr.SuccessToastr(res.message);
          }
          else this.toastr.ErrorToastr(res.message);
          this.roomService.hideLoader();
        }, (err: any) => this.handleApiError(err))
      }
    }
  }

  deleteRoom(id: number) {
    if (confirm("Do you want to delete this room?")) {
      this.roomService.showLoader();
      this.roomService.deleteRoom(id).subscribe((res) => {
        if (res.status) {
          $(".table").DataTable().ajax.reload();
          this.toastr.SuccessToastr(res.message);
        }
        else this.toastr.ErrorToastr(res.message)
        this.roomService.hideLoader();
      }, (err: any) => this.handleApiError(err));
    }
  }

  onUpdateClick(id: number) {
    const room = this.rooms.find(m => m.roomId === id);
    if (room) {
      this.modalTitle="Update Room";
      this.resetForm();
      this.roomForm.patchValue(room);
      this.modalService.open(this.roomModal, { ariaLabelledBy: 'modal-basic-title', backdrop: false });
    }
  }

  handleApiError(err: any) {
    if (err.status == 401) {
      this.router.navigate(['/'])
    }
    else {
      this.toastr.ErrorToastr("Something went wrong");
    }
    this.roomService.hideLoader();
  }

  resetForm(){
    this.roomForm.reset();
    this.roomForm.get("roomId").setValue(0);
  }
}
