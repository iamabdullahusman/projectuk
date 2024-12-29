import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../appconfig';
import { BaseModel } from '../models/base-model.model';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class VisaService {

  private apiUrl: any;
  base = new BaseModel;
  private requestOptions: any;
  private headerDict: any;
  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      GetVisaUrl: this.appConfig.baseServiceUrl + 'VisaType/GetVisaTypes',
      GetAllVisa: this.appConfig.baseServiceUrl + 'Visa/GetVisaApplication',
      GetVisaDetailsUrl: this.appConfig.baseServiceUrl + 'Visa/GetVisaDetails',
      ChangeVisaStatusUrl: this.appConfig.baseServiceUrl + 'Visa/changeVisaStatus',
      VisaAllGoodUrl: this.appConfig.baseServiceUrl + 'Visa/visaAllGood',
      GetVisaApplicationOnScrollUrl: this.appConfig.baseServiceUrl + 'Visa/GetVisaApplicationOnScroll',
      GetVisaHistoryUrl: this.appConfig.baseServiceUrl + 'Visa/GetVisaHistory',
      GetVisaFilesUrl: this.appConfig.baseServiceUrl + 'Visa/getVisaFileNames'
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
  GetVisaType(Input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.GetVisaUrl, Input, this.requestOptions);
  }
  GetVisa(Input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.GetAllVisa, Input, this.requestOptions);
  }
  GetVisaDetails(Input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.GetVisaDetailsUrl, Input, this.requestOptions);
  }
  ChangeVisaStatus(input: any): Observable<any> {
    this.setToken();
    let headers = {
      'Authorization': 'Bearer ' + this.sessionService.getToken(),      
    }
    let CustomeRequestOptions = {
      headers: new HttpHeaders(headers),
    };
    return this.http.post<any>(this.apiUrl.ChangeVisaStatusUrl, input, CustomeRequestOptions);
  }
  VisaAllGood(Input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.VisaAllGoodUrl, Input, this.requestOptions);
  }
  GetVisaApplicationOnScroll(Input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.GetVisaApplicationOnScrollUrl, Input, this.requestOptions);
  }
  GetVisaHistory(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.GetVisaHistoryUrl, input, this.requestOptions);
  }
  GetVisaFiles(Input: any): Observable<any> {
    this.setToken();
    console.log("Input of Get Visa File is: ",Input);
    return this.http.post<any>(this.apiUrl.GetVisaFilesUrl, Input, this.requestOptions);
  }
}
