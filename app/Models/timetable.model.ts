import { Term } from "./term";

export class Timetable {
  id: number;
  termId: number;
  intakeId: number;
  year: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  isValid: boolean;
  intakeMaster:any;
  term:Term;
  timeTableId:number;
}
