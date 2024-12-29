import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../appconfig';
import { BaseModel } from '../models/base-model.model';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ConditionServiceService {

  private apiUrl: any;
  base = new BaseModel;
  private requestOptions: any;
  private headerDict: any;
  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      AddConditionUrl: this.appConfig.baseServiceUrl + 'Condition/AddNewCondition',
      getConditionByIdUrl: this.appConfig.baseServiceUrl + 'Condition/GetConditionById',
      RemoveConditionUrl: this.appConfig.baseServiceUrl + 'Condition/DeleteCondition',
      SpGetConditionUrl: this.appConfig.baseServiceUrl + 'Condition/GetSpConditionData',
      GetAllCondtionsUrl: this.appConfig.baseServiceUrl + 'Condition/GetAllCondtions',

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
  AddCondition(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.AddConditionUrl, JSON.stringify(input), this.requestOptions);
  }
  getConditionbyId(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getConditionByIdUrl, JSON.stringify(input), this.requestOptions);
  }
  RemoveCondition(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.RemoveConditionUrl, JSON.stringify(input), this.requestOptions);
  }
  spGetConditiondata(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.SpGetConditionUrl, JSON.stringify(input), this.requestOptions);
  }
  GetAllCondtions(): Observable<any> {
    this.setToken();
    return this.http.get<any>(this.apiUrl.GetAllCondtionsUrl, this.requestOptions);
  }

}
