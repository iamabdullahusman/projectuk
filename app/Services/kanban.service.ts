import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../appconfig';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class KanbanService {

  private apiUrl: any;
  private requestOptions: any;
  private headerDict: any;
  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      getKanbanStages: this.appConfig.baseServiceUrl + 'KanbanDashboard/GetKanbanStages',

      getKanbanStagesByPerentUrl: this.appConfig.baseServiceUrl + 'KanbanDashboard/GetKanbanStageById',
      getKanbanApplicationByStages: this.appConfig.baseServiceUrl + 'KanbanDashboard/GetStageViseApplications',
      getApplicationsOnScrollUrl: this.appConfig.baseServiceUrl + 'KanbanDashboard/getApplicationsOnScroll',
    }
    this.headerDict = {
      'Authorization': 'Bearer ' + this.sessionService.getToken(),
      'Content-type': 'application/json'
    }

    this.setHeader();

  }
  setHeader() {
    this.headerDict = {
      'Authorization': 'Bearer ' + this.sessionService.getToken(),
      'Content-type': 'application/json'
    }

    this.requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };
  }
  getStages(): Observable<any> {
    this.setHeader();
    return this.http.get(this.apiUrl.getKanbanStages, this.requestOptions);
  }
  getStagesByPerent(input): Observable<any> {
    this.setHeader();
    return this.http.post(this.apiUrl.getKanbanStagesByPerentUrl, input, this.requestOptions);
  }

  getApplicationByStage(input: any): Observable<any> {
    this.setHeader();
    return this.http.post(this.apiUrl.getKanbanApplicationByStages, input, this.requestOptions);
  }
  getApplicationsOnScroll(input: any): Observable<any> {
    this.setHeader();
    return this.http.post(this.apiUrl.getApplicationsOnScrollUrl, input, this.requestOptions);
  }
}
