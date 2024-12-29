import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AppConfig } from '../appconfig';
import { BaseModel } from '../models/base-model.model';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class IntakeService {

  private apiUrl: any;
  base = new BaseModel;
  private requestOptions: any;
  private headerDict: any;
  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      getIntakeUrl: this.appConfig.baseServiceUrl + 'Intake/GetIntakes',
      getIntakesByCampusCourseUrl: this.appConfig.baseServiceUrl + 'Intake/GetIntakesByCampusCourse',
      getFutureIntakeUrl: this.appConfig.baseServiceUrl + 'Intake/GetIntakeData',
      saveIntakeUrl: this.appConfig.baseServiceUrl + 'Intake/AddIntake',
      deleteIntakeUrl: this.appConfig.baseServiceUrl + 'Intake/RemoveIntake',
      changeintakeUrl: this.appConfig.baseServiceUrl + 'Intake/ChangeIntake',
      GEtSponcerListUrl: this.appConfig.baseServiceUrl + 'Sponcer/ChangefeepayByList',
      GetCurrentIntakeUrl: this.appConfig.baseServiceUrl + 'Intake/GetIntakes',

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
  getAllIntake(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getIntakeUrl, JSON.stringify(input), this.requestOptions);
  }
  getIntakesByCampusCourse(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getIntakesByCampusCourseUrl, JSON.stringify(input), this.requestOptions);
  }

  GetSponcerList(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.GEtSponcerListUrl, JSON.stringify(input), this.requestOptions);
  }

  saveIntake(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.saveIntakeUrl, JSON.stringify(input), this.requestOptions);
  }
  GetCurrentIntake(): Observable<any> {
    this.setToken();
    return this.http.get<any>(this.apiUrl.GetCurrentIntakeUrl, this.requestOptions);
  }
  deleteIntake(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.deleteIntakeUrl, JSON.stringify(input), this.requestOptions);
  }
  getFutureIntake(): Observable<any> {
    this.setToken();
    return this.http.get<any>(this.apiUrl.getFutureIntakeUrl, this.requestOptions);
  }
  ChangeIntake(input: any): Observable<any> {
    return this.http.post<any>(this.apiUrl.changeintakeUrl, input, this.requestOptions);
  }

}
