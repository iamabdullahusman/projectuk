import { Injectable } from '@angular/core';
import { BaseModel } from '../models/base-model.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../appconfig';
import { SessionStorageService } from './session-storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamTimetableService {
  private apiUrl: any;
  base = new BaseModel;
  private requestOptions: any;
  private headerDict: any;
  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      getAllExamTimetable: this.appConfig.baseServiceUrl + 'ExamTimeTable/GetAllExamTimeTable',
      getExamTimetableById: this.appConfig.baseServiceUrl + 'ExamTimeTable/GetExamTimeTableById',
      createExamTimetable: this.appConfig.baseServiceUrl + 'ExamTimeTable/AddExamTimeTables',
      updateExamTimetable: this.appConfig.baseServiceUrl + 'ExamTimeTable/UpdateExamTimeTable',
      deleteExamTimetable: this.appConfig.baseServiceUrl + 'ExamTimeTable/DeleteExamTimeTableById',
      updateExamTimeTableActiveAndInActive: this.appConfig.baseServiceUrl + 'ExamTimeTable/updateExamTimeTableActiveAndInActive',
      getAllExamination: this.appConfig.baseServiceUrl + 'Examination/GetAllExamination',
      createExamination: this.appConfig.baseServiceUrl + 'Examination/AddExamination',
      updateExamination: this.appConfig.baseServiceUrl + 'Examination/UpdateExamination',
      deleteExamination: this.appConfig.baseServiceUrl + 'Examination/DeleteExaminationById',
    }
    this.setToken();
  }
  setToken() {
    this.headerDict = {
      'Authorization': 'Bearer ' + this.sessionService.getToken(),
      'Content-type': 'application/json'
    }

    this.requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };
  }

  getAllExamTimetable(payload: any): Observable<any> {
    this.setToken();
    return this.http.post(this.apiUrl.getAllExamTimetable, payload, this.requestOptions);
  }
  createExamTimetable(payload: any): Observable<any> {
    this.setToken();
    return this.http.post(this.apiUrl.createExamTimetable, payload,this.requestOptions);
  }
  getExamTimetableById(id: number): Observable<any> {
    this.setToken();
    return this.http.get(this.apiUrl.getExamTimetableById+'?id='+id,this.requestOptions);
  }
  updateExamTimetable(payload: any): Observable<any> {
    this.setToken();
    return this.http.put(this.apiUrl.updateExamTimetable, payload,this.requestOptions);
  }
  deleteExamTimetable(id: number): Observable<any> {
    this.setToken();
    return this.http.delete(this.apiUrl.deleteExamTimetable+'?id='+id,this.requestOptions);
  }
  updateExamTimeTableActiveAndInActive(payload: any): Observable<any> {
    this.setToken();
    return this.http.put(this.apiUrl.updateExamTimeTableActiveAndInActive,payload,this.requestOptions);
  }
  
  getAllExamination(payload: any): Observable<any> {
    this.setToken();
    return this.http.post(this.apiUrl.getAllExamination, payload, this.requestOptions);
  }
  createExamination(payload: any): Observable<any> {
    this.setToken();
    return this.http.post(this.apiUrl.createExamination, payload,this.requestOptions);
  }
  updateExamination(payload: any): Observable<any> {
    this.setToken();
    return this.http.put(this.apiUrl.updateExamination, payload,this.requestOptions);
  }
  deleteExamination(id: number): Observable<any> {
    this.setToken();
    return this.http.delete(this.apiUrl.deleteExamination+'?id='+id,this.requestOptions);
  }

  showLoader() {
    $('#loader').show();
  }

  hideLoader() {
    $('#loader').hide();
  }
}
