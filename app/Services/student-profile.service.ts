import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../appconfig';
import { BaseModel } from '../Models/base-model.model';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class StudentProfileService {
  private apiUrl: any;
  base = new BaseModel;
  private requestOptions: any;
  private headerDict: any;
  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      getStudentProfileDataUrl: this.appConfig.baseServiceUrl + 'Application/GetStudentProfileData',
      saveStudentProfileDataUrl: this.appConfig.baseServiceUrl + 'Application/SaveStudentProfile',
      addParentSponcerPermissionUrl: this.appConfig.baseServiceUrl + 'Account/AddParentSponcerPermission',
      getFirstLoginUrl: this.appConfig.baseServiceUrl + 'Account/GetFirstLogin',
      gtePermissionDataByUserUrl: this.appConfig.baseServiceUrl + 'Account/GetPermissionStatusByUserType',
    }
    this.setRequestoption();
  }
  private setRequestoption()
  {
    this.headerDict = {
      'Authorization': 'Bearer ' + this.sessionService.getToken(),
      'Content-type': 'application/json'
    }

    this.requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };
  }
  getStudentsProfileData(input: any): Observable<any> {
    this.setRequestoption();
    return this.http.post<any>(this.apiUrl.getStudentProfileDataUrl, JSON.stringify(input), this.requestOptions);
  }
  saveStudentProfileById(input: any): Observable<any> {
    this.setRequestoption();
    return this.http.post<any>(this.apiUrl.saveStudentProfileDataUrl, JSON.stringify(input), this.requestOptions);
  }
  addParentSponcerPermissions(input: any): Observable<any> {
    this.setRequestoption();
    return this.http.post<any>(this.apiUrl.addParentSponcerPermissionUrl, JSON.stringify(input), this.requestOptions);
  }
  getFirstLoginData(input: any): Observable<any> {
    this.setRequestoption();
    return this.http.post<any>(this.apiUrl.getFirstLoginUrl, JSON.stringify(input), this.requestOptions);
  }
  getUserPermissionData(input: any): Observable<any> {
    this.setRequestoption();
    return this.http.post<any>(this.apiUrl.gtePermissionDataByUserUrl, JSON.stringify(input), this.requestOptions);
  }

}