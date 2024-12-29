import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../appconfig';
import { BaseModel } from '../models/base-model.model';
import { SessionStorageService } from './session-storage.service';
@Injectable({
  providedIn: 'root'
})
export class UserInquiryService {
  private apiUrl: any;
  base = new BaseModel;
  private requestOptions: any;
  private headerDict: any;
  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      getUserInquiry: this.appConfig.baseServiceUrl + 'Inquiry/SpGetInquiry',
      deleteInquiry: this.appConfig.baseServiceUrl + 'Inquiry/RemoveInquiry',
      addInquiry: this.appConfig.baseServiceUrl + 'Inquiry/AddInquiry',
      getEnquiryStatusUrl: this.appConfig.baseServiceUrl + 'Inquiry/GetInquiryStatus',
      chnageEnquiryStatusUrl: this.appConfig.baseServiceUrl + 'Inquiry/ChangeInquiryStatusById',
      GetAssignedToUsersUrl: this.appConfig.baseServiceUrl + 'Inquiry/GetAssignedToUsers',
      GetInquiryByIdUrl: this.appConfig.baseServiceUrl + 'Inquiry/GetInquiryById',
      InquirytoApplicationConvertUrl: this.appConfig.baseServiceUrl + 'Inquiry/InquirytoApplicationConvert',
      RemoveEnquiryUrl: this.appConfig.baseServiceUrl + 'Inquiry/RemoveInQuiry',




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
  GetAllInquiry(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getUserInquiry, JSON.stringify(input), this.requestOptions);
  }

  deleteInquiry(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.deleteInquiry, JSON.stringify(input), this.requestOptions);
  }

  AddInquiryFn(req: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.addInquiry, JSON.stringify(req), this.requestOptions);
  }
  getAllEnquiryStatus(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getEnquiryStatusUrl, JSON.stringify(input), this.requestOptions);
  }
  ChangeInquiryStatusById(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.chnageEnquiryStatusUrl, JSON.stringify(input), this.requestOptions);
  }
  GetAssignedToUsers(): Observable<any> {
    this.setToken();
    return this.http.get<any>(this.apiUrl.GetAssignedToUsersUrl, this.requestOptions);
  }
  GetInquiryById(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.GetInquiryByIdUrl, input, this.requestOptions);
  }
  InquirytoApplicationConvert(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.InquirytoApplicationConvertUrl, input, this.requestOptions);
  }
  RemoveInquiry(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.RemoveEnquiryUrl, JSON.stringify(input), this.requestOptions);
  }
}
