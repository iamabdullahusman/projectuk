import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../appconfig';
import { BaseModel } from '../models/base-model.model';
import { SessionStorageService } from './session-storage.service';


@Injectable({
  providedIn: 'root'
})
export class UnivercityService {
 private apiUrl: any;
  base = new BaseModel;
   private requestOptions: any;
  private headerDict: any;
 constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      GetAllUnivercity: this.appConfig.baseServiceUrl + 'Univercity/GetUnivercity',
      AddUnivercity: this.appConfig.baseServiceUrl + 'Univercity/AddUnivercity',
      ActDeactiveUni: this.appConfig.baseServiceUrl + 'Univercity/UnivercityActiveDeactive',
      GetUniversitycourse: this.appConfig.baseServiceUrl + 'Univercity/GetUniversityCourse',
      getUniversityList: this.appConfig.baseServiceUrl + 'Univercity/GetUnivercityList',
      AddUniversityCourse: this.appConfig.baseServiceUrl + 'Univercity/AddUniversityCourse',
      ActDeacUniversityCourse: this.appConfig.baseServiceUrl + 'Univercity/UniversityCourseActDeac',
      getuniversitycoursebyid: this.appConfig.baseServiceUrl + 'Univercity/GetUniversityCourseForUniversityid',
      GetUniversityDatebyid: this.appConfig.baseServiceUrl + 'Univercity/GetUniversitycourseDatebyId',
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

   GetAllUnivercity(input: any): Observable<any> {
     this.setToken();
    return this.http.post<any>(this.apiUrl.GetAllUnivercity, JSON.stringify(input), this.requestOptions);
  }
   AddUnivercity(input: any): Observable<any> {
     this.setToken();
    return this.http.post<any>(this.apiUrl.AddUnivercity, JSON.stringify(input), this.requestOptions);
  }

  AddUniversityCourse(input: any): Observable<any> {
     this.setToken();
    return this.http.post<any>(this.apiUrl.AddUniversityCourse, JSON.stringify(input), this.requestOptions);
  }

  GetUniversitycourse(input: any): Observable<any> {
     this.setToken();
    return this.http.post<any>(this.apiUrl.GetUniversitycourse, JSON.stringify(input), this.requestOptions);
  }

   ActDeactiveUnivercity(input: any): Observable<any> {
     this.setToken();
    return this.http.post<any>(this.apiUrl.ActDeactiveUni, JSON.stringify(input), this.requestOptions);
  }

  ActDeacUniversityCourse(input: any): Observable<any> {
     this.setToken();
    return this.http.post<any>(this.apiUrl.ActDeacUniversityCourse, JSON.stringify(input), this.requestOptions);
  }

    getUniversityList(): Observable<any> {
     this.setToken();
    return this.http.get<any>(this.apiUrl.getUniversityList, this.requestOptions);
  }

   getuniversitycoursebyid(Input:any): Observable<any> {
     this.setToken();
    return this.http.post<any>(this.apiUrl.getuniversitycoursebyid, JSON.stringify(Input) , this.requestOptions);
  }

GetUniversityDatebyid(Input:any): Observable<any> {
     this.setToken();
    return this.http.post<any>(this.apiUrl.GetUniversityDatebyid, JSON.stringify(Input) , this.requestOptions);
  }
}
