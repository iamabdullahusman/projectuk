import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../appconfig';
import { BaseModel } from '../models/base-model.model';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SupportTicketService {
  private apiUrl: any;
  base = new BaseModel;
  private requestOptions: any;
  private headerDict: any;

  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {

      AddSupportTicketUrl: this.appConfig.baseServiceUrl + 'SupportTicket/AddSupportTicket',
      GetSupportTicketByIdUrl: this.appConfig.baseServiceUrl + 'SupportTicket/GetSupportTicketById',
      UpdateSupportTicketStatusUrl: this.appConfig.baseServiceUrl + 'SupportTicket/UpdateSupportTicketStatus',
      GetSupportTicketsUrl: this.appConfig.baseServiceUrl + 'SupportTicket/GetSupportTickets'
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
  AddSupportTicket(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.AddSupportTicketUrl, input, this.requestOptions);
  }
  GetSupportTicketById(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.GetSupportTicketByIdUrl, input, this.requestOptions);
  }
  UpdateSupportTicketStatus(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.UpdateSupportTicketStatusUrl, input, this.requestOptions);
  }
  GetSupportTickets(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.GetSupportTicketsUrl, input, this.requestOptions);
  }
}
