import { Component, Input, OnChanges, OnInit , SimpleChanges } from '@angular/core';
import { Slot } from "src/app/Models/slot.model";
import { Router } from "@angular/router";
import { TimetableService } from "src/app/Services/timetable.service";
import { ToastrServiceService } from "src/app/services/toastr-service.service";
@Component({
  selector: 'app-portal-timetable',
  templateUrl: './portal-timetable.component.html',
  styleUrls: ['./portal-timetable.component.sass']
})
export class PortalTimetableComponent implements OnInit  {
  dtOptions: DataTables.Settings = {};
  teacherId: number;
  slots: Array<Slot> = [];  
  constructor(
    private timetableService: TimetableService,
    private toast: ToastrServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.teacherId = 1;
    console.log("ok",this.teacherId);
    this.loadData();
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes["teacherId"]) {
  //     this.loadData();
  //   }
  // }

  // loadData() {
  //   let input = {
  //     index:0,
  //     size:10,
  //     teacherId:this.teacherId,
  //     search: '',
  //     orderBy: '',
  //     orderByDirection: '',
  //   }
  //   this.dtOptions = {
  //     pagingType: 'simple_numbers',
  //     pageLength: 10,
  //     serverSide: true,
  //     processing: true,
  //     searching: true,
  //     order:[1,'asc'],
  //     language: {
  //       infoFiltered: ""
  //     },
  //     ajax: (dataTablesParameters: any, callback) => {
  //       input.size = dataTablesParameters.length;
  //       input.index = dataTablesParameters.start / dataTablesParameters.length;
  //       input.search = dataTablesParameters.search.value;
  //       input.orderByDirection = dataTablesParameters.order[0].dir;
  //       input.orderBy = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
  //       input.index++;
  //       // this.timetableService.showLoader();
  //       console.log("input",input);
  //       this.timetableService
  //         .GetAllTimetableTeacherByUserIdToken(input)
  //         .subscribe(
  //           (res) => {
  //             console.log("GetAllTimetableTeacherByUserIdToken",res);
  //             if (res.status)
  //           this.slots = res.data.records;
  //             if (res.data.teacherId) {
  //               this.teacherId = res.data.teacherId; // Set teacherId from response
  //             }
  //         else this.toast.ErrorToastr(res.message)
  //         callback({
  //           recordsTotal: res.data.totalCounts,
  //           recordsFiltered: res.data.totalCounts,
  //           data: []
  //         });
  //             this.timetableService.hideLoader();
  //           },
  //           (err: any) => this.handleApiError(err)
  //         );
  //     },
  //     columns: [{ data: '', orderable: false }, { data: 'startTime', orderable: true }, { data: '', orderable: false }, { data: 'roomName', orderable: false }],
  //     autoWidth: false
  //   }
    
  // }
  loadData() {
    const input = {
      index: 0,
      size: 10,
      teacherId: this.teacherId,
      search: '',
      orderBy: '',
      orderByDirection: '',
    };

    // Call the API
    this.timetableService.GetAllTimetableTeacherByUserIdToken(input).subscribe(
      (res) => {
        console.log("API Response:", res);
        if (res.status) {
          this.slots = res.data.records;  // Assign response data to the slots array
        } else {
          this.toast.ErrorToastr(res.message);
        }
      },
      (err) => {
        this.handleApiError(err);
      }
    );
  }

  handleApiError(err: any) {
    if (err.status == 401) {
      this.router.navigate(["/"]);
    } else {
      this.toast.ErrorToastr("Something went wrong");
    }
    this.timetableService.hideLoader();
  }

  onSlotClick(day:string, subjectManagementId:number){
    this.router.navigateByUrl('/teacher/attendance?day='+day+'&subjectId='+subjectManagementId);
  }
}
