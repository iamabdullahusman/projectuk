import { Group } from "./group.modal";
import { Subject } from "./subject.model";
import { Teacher } from "./teacher.model";
import { Term } from "./term";

export class SubjectManage {
  subjectManagementId: number;
  intakeId: number;
  termId: number;
  subjectId: number;
  teacherId: number;
  groupId: number;
  startDate: Date;
  endDate: Date;
  subjectName: string;
  intakeName: string;
  termName: string;
  groupName: string;
  teacherName: string;
  intakeMaster:any;
  term:Term;
  subject:Subject;
  group:Group;
  teacher:Teacher;
  fullSubjectName:string;
}
