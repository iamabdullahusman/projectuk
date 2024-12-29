import { Injectable } from '@angular/core';
import { BaseModel } from '../models/base-model.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../appconfig';
import { SessionStorageService } from './session-storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private apiUrl: any;
  base = new BaseModel;
  private requestOptions: any;
  private headerDict: any;
  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      getAllSubject: this.appConfig.baseServiceUrl + 'Subject/GetAllSubjects',
      createSubject: this.appConfig.baseServiceUrl + 'Subject/AddSubjects',
      updateSubject: this.appConfig.baseServiceUrl + 'Subject/UpdateSubjects',
      deleteSubject: this.appConfig.baseServiceUrl + 'Subject/DeleteSubjectById',
      createSubjectManagement: this.appConfig.baseServiceUrl + 'Subject/AddSubjectManagement',
      updateSubjectManagement: this.appConfig.baseServiceUrl + 'Subject/UpdateSubjectManagement',
      getAllSubjectManagement: this.appConfig.baseServiceUrl + 'Subject/GetAllSubjectsManagement',
      subjectManagementById: this.appConfig.baseServiceUrl + 'Subject/GetSubjectManagementById',
      subjectManagementByIntakeAndTerm: this.appConfig.baseServiceUrl + 'Subject/GetSubjectManagementByIntakeAndTerm',
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

  getAllSubject(payload: any): Observable<any> {
    this.setToken();
    return this.http.post(this.apiUrl.getAllSubject, payload, this.requestOptions);
  }
  createSubject(payload: any): Observable<any> {
    this.setToken();
    return this.http.post(this.apiUrl.createSubject, payload,this.requestOptions);
  }
  updateSubject(payload: any): Observable<any> {
    this.setToken();
    return this.http.put(this.apiUrl.updateSubject, payload,this.requestOptions);
  }
  getAllSubjectManagement(payload: any): Observable<any> {
    this.setToken();
    return this.http.post(this.apiUrl.getAllSubjectManagement, payload,this.requestOptions);
  }
  getSubjectManagementById(id: number): Observable<any> {
    this.setToken();
    return this.http.get(this.apiUrl.subjectManagementById+'?subjectManagementId='+id,this.requestOptions);
  }
  createSubjectManagement(payload: any): Observable<any> {
    this.setToken();
    return this.http.post(this.apiUrl.createSubjectManagement, payload,this.requestOptions);
  }
  updateSubjectManagement(payload: any): Observable<any> {
    this.setToken();
    return this.http.put(this.apiUrl.updateSubjectManagement, payload,this.requestOptions);
  }
  deleteSubject(id: number): Observable<any> {
    this.setToken();
    return this.http.delete(this.apiUrl.deleteSubject+'?subjectId='+id,this.requestOptions);
  }
  getSubjectManagementByIntakeAndTerm(intakeId: number, termId:number): Observable<any> {
    this.setToken();
    return this.http.get(this.apiUrl.subjectManagementByIntakeAndTerm+'?intakeId='+intakeId+'&termId='+termId,this.requestOptions);
  }

  showLoader() {
    $('#loader').show();
  }

  hideLoader() {
    $('#loader').hide();
  }
}
