import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Teacher } from "src/app/Models/teacher.model";
import { TeacherService } from "src/app/Services/teacher.service";
import { ToastrServiceService } from "src/app/services/toastr-service.service";

@Component({
  selector: "app-view-teacher",
  templateUrl: "./view-teacher.component.html",
  styleUrls: ["./view-teacher.component.sass"],
})
export class ViewTeacherComponent implements OnInit {
  teacher: Teacher = new Teacher();
  constructor(
    private teacherService: TeacherService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastrServiceService
  ) {
    route.params.subscribe((params) => {
      console.log("params",params);
      if (params["id"]) {
        this.teacher.teacherId = parseInt(params["id"]);
      }
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    
    this.teacherService.getTeacherById(this.teacher.teacherId).subscribe(
      (res) => {
        console.log("view teacher loadData",res);
        if (res.status) this.teacher = res.data;
        console.log("res 2",res.data);
      },
      (err: any) => this.handleApiError(err)
    );
  }

  handleApiError(err: any) {
    if (err.status == 401) {
      this.router.navigate(["/"]);
    } else {
      this.toast.ErrorToastr("Something went wrong");
    }
    this.teacherService.hideLoader();
  }

  back(){
    this.router.navigate(['/course/user'])
  }
}
