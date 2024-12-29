import { Injectable } from '@angular/core';
import { BaseModel } from '../models/base-model.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../appconfig';
import { SessionStorageService } from './session-storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl: any;
  base = new BaseModel;
  private requestOptions: any;
  private headerDict: any;
  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      getAllAttendance: this.appConfig.baseServiceUrl + 'Attendances/GetAllAttendances',
      createAttendance: this.appConfig.baseServiceUrl + 'Attendances/AddAttendances',
      updateAttendance: this.appConfig.baseServiceUrl + 'Attendances/UpdateAttendances',
      deleteAttendance: this.appConfig.baseServiceUrl + 'Attendances/AttendancesDeleteById',
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

  getAllAttendance(payload: any): Observable<any> {
    this.setToken();
    return this.http.post(this.apiUrl.getAllAttendance, payload, this.requestOptions);
  }
  createAttendance(payload: any): Observable<any> {
    this.setToken();
    return this.http.post(this.apiUrl.createAttendance, payload,this.requestOptions);
  }
  updateAttendance(payload: any): Observable<any> {
    this.setToken();
    return this.http.put(this.apiUrl.updateAttendance, payload,this.requestOptions);
  }
  deleteAttendance(id: number): Observable<any> {
    this.setToken();
    return this.http.delete(this.apiUrl.deleteAttendance+'?id='+id,this.requestOptions);
  }

  showLoader() {
    $('#loader').show();
  }

  hideLoader() {
    $('#loader').hide();
  }
}
