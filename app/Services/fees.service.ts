import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../appconfig';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class FeesService {

  private apiUrl: any;
  private requestOptions: any;
  private headerDict: any;

  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      getSpFeeUrl: this.appConfig.baseServiceUrl + 'Fee/GetSPFeeContents',
      getFeeByIdUrl: this.appConfig.baseServiceUrl + 'Fee/GetFee',
      saveFee: this.appConfig.baseServiceUrl + 'Fee/AddFee',
      IsFeeAvailableUrl: this.appConfig.baseServiceUrl + 'Fee/IsFeeAvailable',
      GetNotificationUrl: this.appConfig.baseServiceUrl + 'Notification/UserBaseNotification',
      IsNotificationUrl: this.appConfig.baseServiceUrl + 'Notification/IsReadNotification',
      HeaderNotificationUrl: this.appConfig.baseServiceUrl + 'Notification/HeaderNotification',
      AllNotificationReadUrl: this.appConfig.baseServiceUrl + 'Notification/IsReadAllNotification',
    }
    this.setheader();
  }

  setheader() {
    this.headerDict = {
      'Authorization': 'Bearer ' + this.sessionService.getToken(),
      'Content-type': 'application/json'
    }

    this.requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };
  }
  getSpFeeData(input: any): Observable<any> {
    this.setheader();
    return this.http.post<any>(this.apiUrl.getSpFeeUrl, JSON.stringify(input), this.requestOptions);
  }

  getFeeById(input: any): Observable<any> {
    this.setheader();
    return this.http.post<any>(this.apiUrl.getFeeByIdUrl, JSON.stringify(input), this.requestOptions);
  }

  saveFee(input: any): Observable<any> {
    this.setheader();
    return this.http.post<any>(this.apiUrl.saveFee, JSON.stringify(input), this.requestOptions);
  }

  IsFeeAvailable(input: any): Observable<any> {
    this.setheader();
    return this.http.post<any>(this.apiUrl.IsFeeAvailableUrl, JSON.stringify(input), this.requestOptions);
  }

  GetNotification(input: any): Observable<any> {
    this.setheader();
    return this.http.post<any>(this.apiUrl.GetNotificationUrl, JSON.stringify(input), this.requestOptions);
  }

  IsNotificationData(input: any): Observable<any> {
    this.setheader();
    return this.http.post<any>(this.apiUrl.IsNotificationUrl, JSON.stringify(input), this.requestOptions);
  }

  AllNotificationRead(): Observable<any> {
    this.setheader();
    return this.http.get<any>(this.apiUrl.AllNotificationReadUrl, this.requestOptions);
  }

  HeaderNotification(): Observable<any> {
    this.setheader();
    return this.http.post<any>(this.apiUrl.HeaderNotificationUrl, '', this.requestOptions);
  }
}
