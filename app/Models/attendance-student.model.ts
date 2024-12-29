import { AttendanceSheet } from "./attendance-sheet.model";

export class AttendanceStudent {
    attendanceManagementId:number;
    attendanceSheetId:number;
    studentSlotManagementId:number;
    attendanceType:string;
    comment:string;
    studentSlotManagement:any;
    attendanceSheet:AttendanceSheet;
}
