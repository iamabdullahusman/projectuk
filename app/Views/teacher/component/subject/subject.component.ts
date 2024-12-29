import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import dayjs from "dayjs";

@Component({
  selector: "app-subject",
  templateUrl: "./subject.component.html",
  styleUrls: ["./subject.component.sass"],
})
export class SubjectComponent implements OnChanges {
  @Input() subjects: any;
  subjectList = "";
  ngOnChanges(changes: SimpleChanges): void {
        if (changes["subjects"]) {
          this.getSubjectList();
    }
  }
  getSubjectList() {
    this.subjectList = "<ul>";
    this.subjects && this.subjects.forEach((element) => {
      const subject = [
        element.intakeMaster.intakeName +
          "-" +
          dayjs(element.intakeMaster.startDate).format("YYYY"),
        element.term.termName,
        element.subject.subjectName + " " + element.group.groupName,
      ].join(", ");
      this.subjectList += "<li>" + subject + "</li>";
    });
    this.subjectList += "</ul>";
  }
}
