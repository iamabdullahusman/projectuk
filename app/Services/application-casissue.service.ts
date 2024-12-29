import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../appconfig';
import { BaseModel } from '../models/base-model.model';
import { SessionStorageService } from './session-storage.service';
import { Observable } from 'rxjs/internal/Observable';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class ApplicationCASIssueService {

  private apiUrl: any;
  base = new BaseModel;
  private requestOptions: any;
  private headerDict: any;
  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      getAllCSAIssueByUrl: this.appConfig.baseServiceUrl + 'CAS/GetCASIssue',
      UploadCsaFileUrl: this.appConfig.baseServiceUrl + 'CAS/UploadCasFile',
      GetCasFileByApplicationIdUrl: this.appConfig.baseServiceUrl + 'CAS/GetCasFileByApplicationId',
      GetCasDataByApplicationIdUrl: this.appConfig.baseServiceUrl + 'CAS/GetCASData',
      getCAS: this.appConfig.baseServiceUrl + 'CAS/GetCAS',
      DeferOfferStatusChangeUrl: this.appConfig.baseServiceUrl + 'Offer/ChangeDeferOfferStatus',
      AddCasReportUrl: this.appConfig.baseServiceUrl + 'CAS/CASReport',
      ExportCASDataUrl: this.appConfig.baseServiceUrl + 'CAS/ExportCASData',
      CaseWithdrownUrl: this.appConfig.baseServiceUrl + 'CAS/WithdrowCAS'
    }

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
  getAllCSAIssue(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getAllCSAIssueByUrl, JSON.stringify(input), this.requestOptions);
  }
  UploadCsaFile(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.UploadCsaFileUrl, JSON.stringify(input), this.requestOptions);
  }
  GetCasFileByApplicationId(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.GetCasFileByApplicationIdUrl, JSON.stringify(input), this.requestOptions);
  }
  GetCasDataByApplicationId(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.GetCasDataByApplicationIdUrl, JSON.stringify(input), this.requestOptions);
  }
  GetCAS(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getCAS, JSON.stringify(input), this.requestOptions);
  }
  DeferOfferStatusChange(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.DeferOfferStatusChangeUrl, JSON.stringify(input), this.requestOptions);
  }
  AddCasReport(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.AddCasReportUrl, JSON.stringify(input), this.requestOptions);
  }
  ExportCASData(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.ExportCASDataUrl, JSON.stringify(input), this.requestOptions);
  }
  CaseWithdrown(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.CaseWithdrownUrl, JSON.stringify(input), this.requestOptions);
  }
}
