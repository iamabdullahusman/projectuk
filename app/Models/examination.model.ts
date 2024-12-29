import { SubjectManage } from "./subject-manage.model";

export class Examination {
    examinationId:number;
    subjectManagementIds:Array<number>;
    type:number;
    examinationStartDate:string;
    examinationEndDate:string;
    InvigilatorOne:number;
    location:number;
    InvigilatorTwo:number;
    markingDue:Date;
    examDate:Date;
    comment:string;
    subjects:Array<SubjectManage>;
}
