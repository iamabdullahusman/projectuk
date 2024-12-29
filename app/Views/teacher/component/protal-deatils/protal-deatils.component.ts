import { Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import dayjs from "dayjs";
import { Teacher } from "src/app/Models/teacher.model";
import { AppConfig } from "src/app/appconfig";
import { ActivatedRoute, Router } from "@angular/router";

import { TeacherService } from "src/app/Services/teacher.service";
import { ToastrServiceService } from "src/app/services/toastr-service.service";

@Component({
  selector: 'app-protal-deatils',
  templateUrl: './protal-deatils.component.html',
  styleUrls: ['./protal-deatils.component.sass']

})
export class ProtalDeatilsComponent implements OnInit {
  // @Input() teacher: Teacher;
   teacher: Teacher = new Teacher();
  // fileUrl:any;
  // @ViewChild('viewFile') fileView:ElementRef;

  constructor(private route: ActivatedRoute,
    private router: Router,private teacherservice: TeacherService) { 
      // route.params.subscribe((params) => {
      //   console.log("params",params);
      //   if (params["id"]) {
      //     this.teacher.teacherId = parseInt(params["id"]);
      //   }
      // });
    }
  ngOnInit(): void {
    this.loadData();
  }
  loadData()
  {
    // Fetch the teacher's userId from local storage
    const userId = localStorage.getItem('userId');
    if (userId) {
      console.log("User ID from localStorage:", userId);
      const parsedUserId = parseInt(userId, 10);

      // Call the service to get the teacher data by userId
      this.teacherservice.getTeacherUserById(parsedUserId).subscribe(
        (res) => {
          console.log('Teacher data loaded', res);
          if (res.status) {
            this.teacher = res.data;
          }
        },
        (err) => {
          console.error('Error loading teacher data', err);
          
        }
      );
    } else {
      console.error('User ID not found in local storage.');
      
      this.router.navigate(['/']);
    }

  }
  // viewCV() {
  //   if (this.teacher.cvName){
  //     const url=this.appConfig.baseServiceUrl + this.teacher.cvName;
  //     this.fileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  //     this.modalService.open(this.fileView, { ariaLabelledBy: 'modal-basic-title', backdrop: false, size:'lg' });
  //   }
  // }

  get DOB(){
    return this.teacher.dateOfBirth ? dayjs(this.teacher.dateOfBirth).format('DD/MM/YYYY') : 'NA'
  }
}
