import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../appconfig';
import { BaseModel } from '../models/base-model.model';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CampusService {

  private apiUrl: any;
  base = new BaseModel;
  private requestOptions: any;
  private headerDict: any;
  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      getCampusUrl: this.appConfig.baseServiceUrl + 'Campus/GetCampus',
      saveCampusUrl: this.appConfig.baseServiceUrl + 'Campus/AddCampus',
      deleteCampusUrl: this.appConfig.baseServiceUrl + 'Campus/RemoveCampus',
      getEnquiryStatusUrl: this.appConfig.baseServiceUrl + 'Campus/GetEnquiryStatus',
      getCampusByIdUrl: this.appConfig.baseServiceUrl + 'Campus/GetCampusById',
      addCampusArrivalUrl: this.appConfig.baseServiceUrl + 'StudentOnboard/ChangeApplicationStatus',
      getCampusArrialHistory: this.appConfig.baseServiceUrl + 'StudentOnboard/GetCampusHistory',
      AddCampusHistoryUrl: this.appConfig.baseServiceUrl + 'StudentOnboard/AddCampusHistory',
      getCampusApproveUrl: this.appConfig.baseServiceUrl + 'StudentOnboard/CampusApprove'
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
  getAllCampaus(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getCampusUrl, JSON.stringify(input), this.requestOptions);
  }
  getAllEnquiryStatus(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getEnquiryStatusUrl, JSON.stringify(input), this.requestOptions);
  }
  saveCampaus(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.saveCampusUrl, JSON.stringify(input), this.requestOptions);
  }
  deleteCampaus(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.deleteCampusUrl, JSON.stringify(input), this.requestOptions);
  }

  getCampusById(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getCampusByIdUrl, JSON.stringify(input), this.requestOptions);
  }

  addCampusArrivaldata(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.addCampusArrivalUrl, JSON.stringify(input), this.requestOptions);
  }
  getCampusHistory(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getCampusArrialHistory, JSON.stringify(input), this.requestOptions);
  }
  addCampusHistorydata(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.AddCampusHistoryUrl, JSON.stringify(input), this.requestOptions);
  }
  campusApprovestatus(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getCampusApproveUrl, JSON.stringify(input), this.requestOptions);
  }
}
