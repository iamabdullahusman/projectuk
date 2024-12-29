import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import dayjs from "dayjs";
import { Teacher } from "src/app/Models/teacher.model";
import { AppConfig } from "src/app/appconfig";

@Component({
  selector: "app-teacher-details",
  templateUrl: "./teacher-details.component.html",
  styleUrls: ["./teacher-details.component.sass"],
})
export class TeacherDetailsComponent {
  @Input() teacher: Teacher;
  fileUrl:any;
  @ViewChild('viewFile') fileView:ElementRef;
  /**
   *:
   */
  constructor(private appConfig: AppConfig,private modalService: NgbModal, private domSanitizer: DomSanitizer) {}
  viewCV() {
    if (this.teacher.cvName){
      const url=this.appConfig.baseServiceUrl + this.teacher.cvName;
      this.fileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
      this.modalService.open(this.fileView, { ariaLabelledBy: 'modal-basic-title', backdrop: false, size:'lg' });
    }
  }

  get DOB(){
    return this.teacher.dateOfBirth ? dayjs(this.teacher.dateOfBirth).format('DD/MM/YYYY') : 'NA'
  }
}
