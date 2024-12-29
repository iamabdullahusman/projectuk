import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AppConfig } from '../appconfig';
import { BaseModel } from '../models/base-model.model';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class DepositService {


  private apiUrl: any;
  base = new BaseModel;
  private requestOptions: any;
  private headerDict: any;

  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      getDepositUrl: this.appConfig.baseServiceUrl + 'Deposit/SpGetDeposit',
      ChangeDepositStatusUrl: this.appConfig.baseServiceUrl + 'Deposit/ChangeDepositStatus',
      getFeeDepositUrl: this.appConfig.baseServiceUrl + 'Deposit/getFeeDeposit',
      getFeeDepositExposeUrl: this.appConfig.baseServiceUrl + 'Deposit/getFeeDepositExpose',
      GetInstallmentsByApplicationUrl: this.appConfig.baseServiceUrl + 'Deposit/GetInstallmentsByApplication',
      getReceiptsUrl: this.appConfig.baseServiceUrl + 'Deposit/getReceiptUrls',
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
  getAllDeposit(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getDepositUrl, JSON.stringify(input), this.requestOptions);
  }

  changeDepositStatus(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.ChangeDepositStatusUrl, JSON.stringify(input), this.requestOptions);
  }
  getFeeDeposit(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getFeeDepositUrl, JSON.stringify(input), this.requestOptions);
  }
  getFeeDepositExpose(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getFeeDepositExposeUrl, JSON.stringify(input), this.requestOptions);
  }
  GetInstallmentsByApplication(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.GetInstallmentsByApplicationUrl, JSON.stringify(input), this.requestOptions);
  }
  getReceiptUrls(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getReceiptsUrl, JSON.stringify(input), this.requestOptions);
  }
}
