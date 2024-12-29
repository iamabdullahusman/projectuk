import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseModel } from "../models/base-model.model";
import { AppConfig } from "../appconfig";
import { SessionStorageService } from "./session-storage.service";

@Injectable({
  providedIn: "root",
})
export class TimetableService {
  private apiUrl: any;
  base = new BaseModel();
  private requestOptions: any;
  private headerDict: any;
  private timetables = [];
  constructor(
    private http: HttpClient,
    private appConfig: AppConfig,
    private sessionService: SessionStorageService
  ) {
    this.apiUrl = {
      getAllTimetable:
        this.appConfig.baseServiceUrl + "Timetable/GetAllTimeTable",
      createTimetable:
        this.appConfig.baseServiceUrl + "Timetable/AddTimeTables",
      updateTimetable:
        this.appConfig.baseServiceUrl + "Timetable/UpdateTimeTable",
      deleteTimetable:
        this.appConfig.baseServiceUrl + "Timetable/DeleteTimeTableById",
      getTimetableById:
        this.appConfig.baseServiceUrl + "Timetable/GetTimeTableById",
      timetableActiveInactive:
        this.appConfig.baseServiceUrl +
        "Timetable/UpdateTimeTableActiveAndInActive",
      getAllSlot:
        this.appConfig.baseServiceUrl + "TimeTableSlot/GetAllTimeTableSlot",
      createSlot:
        this.appConfig.baseServiceUrl + "TimeTableSlot/AddTimeTablesSlot",
      updateSlot:
        this.appConfig.baseServiceUrl + "TimeTableSlot/UpdateTimeTableSlot",
      deleteSlot:
        this.appConfig.baseServiceUrl + "TimeTableSlot/DeleteTimeTableSlotById",
      getSlotById:
        this.appConfig.baseServiceUrl + "TimeTableSlot/GetTimeTableSlotById",
      getAttendanceSheetByTimeTableSlotId:
        this.appConfig.baseServiceUrl +
        "TimeTableSlot/GetAttendanceSheetByTimeTableSlotId",
        getAttendanceSheetByTeacherId:
        this.appConfig.baseServiceUrl +
        "TimeTableSlot/GetAttendanceSheetByTeacherId",
        getAttendanceManagementByAttendanceSheetId:
        this.appConfig.baseServiceUrl +
        "TimeTableSlot/GetAttendanceManagementByAttendanceSheetId",
        updateAttendanceManagementByAttendanceSheetId:
        this.appConfig.baseServiceUrl +
        "TimeTableSlot/UpdateAttendanceManagementByAttendanceSheetId",
        getAllTimeTableSlotByTeacherId:
        this.appConfig.baseServiceUrl +
        "TimeTableSlot/GetAllTimeTableSlotByTeacherId",
        getAllTimetableTeacherByUserIdToken:
        this.appConfig.baseServiceUrl +
        "TimeTableSlot/GetAllTimetableTeacherByUserIdToken",
        getAllSubjectTeacherByUserIdToken:
        this.appConfig.baseServiceUrl +
        "TimeTableSlot/GetAllSubjectTeacherByUserIdToken",
        
    };
    this.setToken();
  }
  setToken() {
    this.headerDict = {
      Authorization: "Bearer " + this.sessionService.getToken(),
      "Content-type": "application/json",
    };

    this.requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };
  }

  getAllTimetable(payload: any): Observable<any> {
    this.setToken();
    return this.http.post(
      this.apiUrl.getAllTimetable,
      payload,
      this.requestOptions
    );
  }
  createTimetable(payload: any): Observable<any> {
    this.setToken();
    return this.http.post(
      this.apiUrl.createTimetable,
      payload,
      this.requestOptions
    );
  }
  updateTimetable(payload: any): Observable<any> {
    this.setToken();
    return this.http.put(
      this.apiUrl.updateTimetable,
      payload,
      this.requestOptions
    );
  }
  timetableActiveInactive(payload: any): Observable<any> {
    this.setToken();
    return this.http.put(
      this.apiUrl.timetableActiveInactive,
      payload,
      this.requestOptions
    );
  }
  deleteTimetable(id: number): Observable<any> {
    this.setToken();
    return this.http.delete(
      this.apiUrl.deleteTimetable + "?id=" + id,
      this.requestOptions
    );
  }
  getTimetableById(id: number): Observable<any> {
    this.setToken();
    return this.http.get(
      this.apiUrl.getTimetableById + "?id=" + id,
      this.requestOptions
    );
  }
  getAllSlot(payload: any): Observable<any> {
    this.setToken();
    return this.http.post(this.apiUrl.getAllSlot, payload, this.requestOptions);
  }
  createSlot(payload: any): Observable<any> {
    this.setToken();
    return this.http.post(this.apiUrl.createSlot, payload, this.requestOptions);
  }
  updateSlot(payload: any): Observable<any> {
    this.setToken();
    return this.http.put(this.apiUrl.updateSlot, payload, this.requestOptions);
  }
  deleteSlot(id: number): Observable<any> {
    this.setToken();
    return this.http.delete(
      this.apiUrl.deleteSlot + "?id=" + id,
      this.requestOptions
    );
  }
  getSlotById(id: number): Observable<any> {
    this.setToken();
    return this.http.get(
      this.apiUrl.getSlotById + "?id=" + id,
      this.requestOptions
    );
  }
  
  GetAttendanceSheetByTimeTableSlotId(payload: any): Observable<any> {
    this.setToken();
    return this.http.post(
      this.apiUrl.getAttendanceSheetByTimeTableSlotId,
      payload,
      this.requestOptions
    );
  }
  
  GetAttendanceSheetByTeacherId(payload: any): Observable<any> {
    this.setToken();
    return this.http.post(
      this.apiUrl.getAttendanceSheetByTeacherId,
      payload,
      this.requestOptions
    );
  }
  
  GetAttendanceManagementByAttendanceSheetId(input:any): Observable<any> {
    this.setToken();
    return this.http.post(
      this.apiUrl.getAttendanceManagementByAttendanceSheetId,
      input,
      this.requestOptions
    );
  }
  
  UpdateAttendanceManagementByAttendanceSheetId(payload: any): Observable<any> {
    this.setToken();
    return this.http.put(
      this.apiUrl.updateAttendanceManagementByAttendanceSheetId,payload,
      this.requestOptions
    );
  }

  GetAllTimeTableSlotByTeacherId(payload:any): Observable<any> {
    this.setToken();
    return this.http.post(
        this.apiUrl.getAllTimeTableSlotByTeacherId,payload,
      this.requestOptions
    );
  }
  GetAllTimetableTeacherByUserIdToken(payload:any):Observable<any> {
    console.log("service");
    this.setToken();
    return this.http.get(
      this.apiUrl.getAllTimetableTeacherByUserIdToken,
      { params: payload, headers: this.requestOptions.headers }
    );
  }
  GetAllSubjectTeacherByUserIdToken():Observable<any> {
    this.setToken();
    return this.http.get(
      this.apiUrl.getAllSubjectTeacherByUserIdToken,
      {  headers: this.requestOptions.headers }
    );
  }

  showLoader() {
    $("#loader").show();
  }

  hideLoader() {
    $("#loader").hide();
  }
}
