import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AppConfig } from '../appconfig';
import { BaseModel } from '../models/base-model.model';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private apiUrl: any;
  base = new BaseModel;
  private requestOptions: any;
  private headerDict: any;
  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      getCourseUrl: this.appConfig.baseServiceUrl + 'Course/GetCourses',
      getCourseByCampusUrl: this.appConfig.baseServiceUrl + 'Course/GetCoursesByCampusId',
      saveCourseUrl: this.appConfig.baseServiceUrl + 'Course/AddCourse',
      deleteCourseUrl: this.appConfig.baseServiceUrl + 'Course/RemoveCourse',
      getCourseByIdUrl: this.appConfig.baseServiceUrl + 'Course/GetCourseById',
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
  getAllCourses(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getCourseUrl, JSON.stringify(input), this.requestOptions);
  }
  getCoursesByCampus(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getCourseByCampusUrl, JSON.stringify(input), this.requestOptions);
  }
  saveCourse(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.saveCourseUrl, JSON.stringify(input), this.requestOptions);
  }
  deleteCourse(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.deleteCourseUrl, JSON.stringify(input), this.requestOptions);
  }
  getCourseById(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getCourseByIdUrl, JSON.stringify(input), this.requestOptions);
  }
}
