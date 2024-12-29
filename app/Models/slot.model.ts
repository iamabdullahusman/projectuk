import { Room } from "./room.model";
import { SubjectManage } from "./subject-manage.model";

export class Slot {
  timeTableSlotId: number;
  timetableId:number;
  day: string;
  startTime: string;
  endTime: string;
  subjectManagementId: number;
  roomId: string;
  userId:Array<number>=[];
  subjectManagement:SubjectManage;
  room:Room;
  studentIds:Array<number>;
}
