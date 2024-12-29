import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../appconfig';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class OnboardService {

  private apiUrl: any;
  private requestOptions: any;
  private headerDict: any;
  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      getOnboardData: this.appConfig.baseServiceUrl + 'StudentOnboard/GetStudentOnBoardDashboardData',
      changeStatus: this.appConfig.baseServiceUrl + 'StudentOnboard/ChangeApplicationStatus',
      getCampusHistory: this.appConfig.baseServiceUrl + 'StudentOnboard/getCampusHistory',
      getAirportArrivalDataUrl: this.appConfig.baseServiceUrl + 'AirportArrival/GetAirportArrivalData',
      sendWelcomeKitUrl: this.appConfig.baseServiceUrl + 'StudentOnboard/SendWelcomeKit',
      GetWelcomeKitOnScrollDataUrl: this.appConfig.baseServiceUrl + 'StudentOnboard/GetWelcomeKitOnScrollData',
      GetAirportArrivalOnScrollDataUrl: this.appConfig.baseServiceUrl + 'StudentOnboard/GetAirportArrivalOnScrollData',
      GetCampusArrivalOnScrollDataUrl: this.appConfig.baseServiceUrl + 'StudentOnboard/GetCampusArrivalOnScrollData',
      getReadyForWelcomeKitOnScrollUrl: this.appConfig.baseServiceUrl + 'StudentOnboard/getReadyForWelcomeKitOnScroll',
      GetDocumentOnScrollDataUrl: this.appConfig.baseServiceUrl + 'StudentOnboard/GetDocumentOnScrollData',
      GetArchiveOnScrollDataUrl: this.appConfig.baseServiceUrl + 'StudentOnboard/GetArchiveOnScrollData',
      ReadyForWelcomeKitUrl: this.appConfig.baseServiceUrl + 'StudentOnboard/ReadyForWelcomeKit',
      addArrivalAirportUrl: this.appConfig.baseServiceUrl + 'AirportArrival/AddAirportArrivalData',
      getAirportNameUrl: this.appConfig.baseServiceUrl + 'AirportArrival/GetArrivalAirport',
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
  getOnboardApplications(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getOnboardData, input, this.requestOptions);
  }

  changeStatus(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.changeStatus, input, this.requestOptions);
  }

  getCampusHistory(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getCampusHistory, input, this.requestOptions);
  }
  getAirportArrivalData(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getAirportArrivalDataUrl, input, this.requestOptions);
  }
  GetArchiveOnScrollData(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.GetArchiveOnScrollDataUrl, input, this.requestOptions);
  }
  GetDocumentOnScrollData(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.GetDocumentOnScrollDataUrl, input, this.requestOptions);
  }
  getReadyForWelcomeKitOnScroll(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getReadyForWelcomeKitOnScrollUrl, input, this.requestOptions);
  }
  GetCampusArrivalOnScrollData(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.GetCampusArrivalOnScrollDataUrl, input, this.requestOptions);
  }
  GetAirportArrivalOnScrollData(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.GetAirportArrivalOnScrollDataUrl, input, this.requestOptions);
  }
  GetWelcomeKitOnScrollData(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.GetWelcomeKitOnScrollDataUrl, input, this.requestOptions);
  }
  sendWelcomeKit(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.sendWelcomeKitUrl, input, this.requestOptions);
  }
  ReadyForWelcomeKit(input): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.ReadyForWelcomeKitUrl, input, this.requestOptions);
  }
  addAirportArrivalData(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.addArrivalAirportUrl, JSON.stringify(input), this.requestOptions);
  }
  getAirportByLocationId(): Observable<any> {
    this.setToken();
    return this.http.get<any>(this.apiUrl.getAirportNameUrl, this.requestOptions);
  }
}
