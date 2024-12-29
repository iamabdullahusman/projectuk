import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import dayjs from "dayjs";
import { Teacher } from "src/app/Models/teacher.model";
import { TeacherService } from "src/app/Services/teacher.service";
import { ToastrServiceService } from "src/app/services/toastr-service.service";

@Component({
  selector: "app-teacher",
  templateUrl: "./teacher.component.html",
  styleUrls: ["./teacher.component.sass"],
})
export class TeacherComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  subject: { [key: number]: string }={};
  constructor(
    private teacherService: TeacherService,
    private router: Router,
    private toastr: ToastrServiceService
  ) {}
  teachers: Array<Teacher> = [];
  ngOnInit(): void {
    this.loadTeacher();
  }
  loadTeacher() {
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
        console.log("dataTablesParameters",dataTablesParameters);
        console.log("callback",callback);
        input.size = dataTablesParameters.length;
        input.index = dataTablesParameters.start / dataTablesParameters.length;
        input.search = dataTablesParameters.search.value;
        input.orderByDirection = dataTablesParameters.order[0].dir;
        input.orderBy =
          dataTablesParameters.columns[
            dataTablesParameters.order[0].column
          ].data;
        input.index++;
        this.teacherService.showLoader();
        this.teacherService.getAllTeacher(input).subscribe(
          (res: any) => {
            console.log("teacherService",res);
            if (res.status) {
              this.teachers = res.data.records;
              this.teachers.forEach((m) => {
                this.subject[m.teacherId] = this.getSubjectList(
                  m.subjectManagement
                );
              });
            } else this.toastr.ErrorToastr(res.message);
            callback({
              recordsTotal: res.data.totalCounts,
              recordsFiltered: res.data.totalCounts,
              data: [],
            });
            this.teacherService.hideLoader();
          },
          (err: any) => this.handleApiError(err)
        );
      },
      columns: [
        { data: "name", orderable: true },
        { data: "surname", orderable: true },
        { data: "email", orderable: true },
        { data: "mobileNumber", orderable: true },
        { data: "", orderable: false },
        { data: "", orderable: false },
      ],
      autoWidth: false,
    };
  }

  deleteTeacher(id: number) {
    if (confirm("Do you want to delete this teacher?")) {
      this.teacherService.deleteTeacher(id).subscribe(
        (res) => {
          if (res.status) {
            this.toastr.SuccessToastr(res.message);
            $(".table").DataTable().ajax.reload();
          }
        },
        (err: any) => this.handleApiError(err)
      );
    }
  }

  handleApiError(err: any) {
    if (err.status == 401) {
      this.router.navigate(["/"]);
    } else {
      this.toastr.ErrorToastr("Something went wrong");
    }
    this.teacherService.hideLoader();
  }

  getSubjectList(subjectManagement: any) {
    let subjectList = "<ul>";
    subjectManagement && subjectManagement.forEach((element) => {
      const subject = [
        element.intakeMaster.intakeName+'-'+dayjs(element.intakeMaster.startDate).format("YYYY"),
        element.term.termName,
        element.subject.subjectName + " " + element.group.groupName,
      ].join(", ");
      subjectList += "<li>" + subject + "</li>";
    });
    subjectList += "</ul>";
    return subjectList;
  }
}
