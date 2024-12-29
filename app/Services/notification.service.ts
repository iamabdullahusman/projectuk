import { Injectable } from '@angular/core';
import { BaseModel } from '../models/base-model.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../appconfig';
import { SessionStorageService } from './session-storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl: any;
  base = new BaseModel;
  private requestOptions: any;
  private headerDict: any;
  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      GetAllNewsAndAnnouncementNotifications: this.appConfig.baseServiceUrl + 'Notification/GetAllNewsAndAnnouncementNotifications',
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

  GetAllNewsAndAnnouncementNotifications() : Observable<any>{
    this.setToken();
    return this.http.get(this.apiUrl.GetAllNewsAndAnnouncementNotifications,this.requestOptions);
  }

  showLoader() {
    $('#loader').show();
  }

  hideLoader() {
    $('#loader').hide();
  }}
