import { Component, Input, OnChanges, OnInit ,  SimpleChanges, } from '@angular/core';
import dayjs from "dayjs";
import { TimetableService } from "src/app/Services/timetable.service";
@Component({
  selector: 'app-portal-subject',
  templateUrl: './portal-subject.component.html',
  styleUrls: ['./portal-subject.component.sass']
})
export class PortalSubjectComponent implements OnInit {
  subjectList = "";
  constructor(private timetableservice: TimetableService)
  {}
  ngOnInit(): void {
    console.log("hi");
    this.loadSubjects();
  }
  // ngOnChanges(changes: SimpleChanges): void {
  //       if (changes["subjects"]) {
  //         this.getSubjectList();
  //   }
  // }
  loadSubjects() {
    this.timetableservice.GetAllSubjectTeacherByUserIdToken().subscribe(
      (res) => {
        console.log("timetableservice",res);
        if (res.status) {
          this.subjectList = this.formatSubjectList(res.data.records);
          console.log("this.subjectList",this.subjectList);
        } else {
          console.error('Error fetching subjects:', res.message);
        }
      },
      (err) => {
        console.error('API error:', err);
      }
    );
  }
  formatSubjectList(subjects: any[]): string {
    let subjectHTML = '<ul>';
    subjects.forEach((element) => {
      // Using optional chaining (?.) to safely access nested properties
      const intakeName = element?.intakeMaster?.intakeName ?? 'Unknown Intake';
      const intakeYear = dayjs(element?.intakeMaster?.startDate).isValid()
        ? dayjs(element?.intakeMaster?.startDate).format('YYYY')
        : 'Unknown Year';
      const termName = element?.term?.termName ?? 'Unknown Term';
      const subjectName = element?.subject?.subjectName ?? 'Unknown Subject';
      const groupName = element?.group?.groupName ?? 'Unknown Group';
  
      const subject = [intakeName + '-' + intakeYear, termName, subjectName + ' ' + groupName].join(', ');
  
      subjectHTML += '<li>' + subject + '</li>';
    });
    subjectHTML += '</ul>';
    return subjectHTML;
  }
  
  // getSubjectList() {
  //   this.subjectList = "<ul>";
  //   this.subjects && this.subjects.forEach((element) => {
  //     const subject = [
  //       element.intakeMaster.intakeName +
  //         "-" +
  //         dayjs(element.intakeMaster.startDate).format("YYYY"),
  //       element.term.termName,
  //       element.subject.subjectName + " " + element.group.groupName,
  //     ].join(", ");
  //     this.subjectList += "<li>" + subject + "</li>";
  //   });
  //   this.subjectList += "</ul>";
  // }
}
