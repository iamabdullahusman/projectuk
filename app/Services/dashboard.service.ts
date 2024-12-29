import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { AppConfig } from '../appconfig';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl: any;
  private requestOptions: any;
  private headerDict: any;
  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      getDaseBoardData: this.appConfig.baseServiceUrl + 'Dashboard/GetDashboardData',
      getVisaApplicationUrl: this.appConfig.baseServiceUrl + 'Dashboard/GetVisaNewApplication',
      getCasApplicationUrl: this.appConfig.baseServiceUrl + 'Dashboard/GetCasApplicationOnScroll',
      getDepositApplicationUrl: this.appConfig.baseServiceUrl + 'Dashboard/GetDespositApplicationOnScroll',
      getOfferApplicationUrl: this.appConfig.baseServiceUrl + 'Dashboard/GetOfferApplicationOnScroll',
      getOnBoardApplicationUrl: this.appConfig.baseServiceUrl + 'Dashboard/GetOnBoardApplicationOnScroll',
      getApplicationOnScrollUrl: this.appConfig.baseServiceUrl + 'Dashboard/GetApplicationOnScroll',
      getArchiveOnScrollUrl: this.appConfig.baseServiceUrl + 'Dashboard/GetArchieveApplicationOnScroll',
      getListViewDashboardUrl: this.appConfig.baseServiceUrl + 'Dashboard/GetListViewDashboardData',
      GetInquiriesOnScrollUrl: this.appConfig.baseServiceUrl + 'Dashboard/GetInquiriesOnScroll',
      getListViewDashboardUrl1: this.appConfig.baseServiceUrl + 'Dashboard/GetListViewDashboardData1',
      getListViewDashboardUrl2: this.appConfig.baseServiceUrl + 'Dashboard/GetListViewDashboardData2',
      ChangeCASStatus:this.appConfig.baseServiceUrl+'Dashboard/ChangeCAS',
      ChangeVisatatus:this.appConfig.baseServiceUrl+'Dashboard/ChangeVisa'

    }
    this.setRequestOption();
  }

  getApplicationByStage(input: any): Observable<any> {
    this.setRequestOption();
    return this.http.post<any>(this.apiUrl.getDaseBoardData, input, this.requestOptions);
  }
  getVisaApplication(input: any): Observable<any> {
    this.setRequestOption();
    return this.http.post<any>(this.apiUrl.getVisaApplicationUrl, input, this.requestOptions);
  }
  getCasApplication(input: any): Observable<any> {
    this.setRequestOption();
    return this.http.post<any>(this.apiUrl.getCasApplicationUrl, input, this.requestOptions);
  }
  getDepositApplication(input: any): Observable<any> {
    this.setRequestOption();
    return this.http.post<any>(this.apiUrl.getDepositApplicationUrl, input, this.requestOptions);
  }
  getOfferApplication(input: any): Observable<any> {
    this.setRequestOption();
    return this.http.post<any>(this.apiUrl.getOfferApplicationUrl, input, this.requestOptions);
  }
  getOnBoardApplicationScroll(input: any): Observable<any> {
    this.setRequestOption();
    return this.http.post<any>(this.apiUrl.getOnBoardApplicationUrl, input, this.requestOptions);
  }
  getApplicationonScroll(input: any): Observable<any> {
    this.setRequestOption();
    return this.http.post<any>(this.apiUrl.getApplicationOnScrollUrl, input, this.requestOptions);
  }
  getArchiveonScroll(input: any): Observable<any> {
    this.setRequestOption();
    return this.http.post<any>(this.apiUrl.getArchiveOnScrollUrl, input, this.requestOptions);
  }
  GetInquiriesOnScroll(input: any): Observable<any> {
    this.setRequestOption();
    return this.http.post<any>(this.apiUrl.GetInquiriesOnScrollUrl, input, this.requestOptions);
  }
  getListView(input: any): Observable<any> {
    this.setRequestOption();
    return this.http.post<any>(this.apiUrl.getListViewDashboardUrl, input, this.requestOptions);
  }
  getListView1(input: any): Observable<any> {
    this.setRequestOption();
    return this.http.post<any>(this.apiUrl.getListViewDashboardUrl1, input, this.requestOptions);
  }
  getListView2(input: any): Observable<any> {
    this.setRequestOption();
    return this.http.post<any>(this.apiUrl.getListViewDashboardUrl2, input, this.requestOptions);
  }
  ChangeCASStatus(input:any): Observable<any>
  {
    this.setRequestOption();
    return this.http.post<any>(this.apiUrl.ChangeCASStatus, input, this.requestOptions);

  }
  ChangeVisatatus(input:any): Observable<any>
  {
    this.setRequestOption();
    return this.http.post<any>(this.apiUrl.ChangeVisatatus, input, this.requestOptions);

  }
  private setRequestOption() {
    this.headerDict = {
      'Authorization': 'Bearer ' + this.sessionService.getToken(),
      'Content-type': 'application/json'
    }

    this.requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };
  }
}