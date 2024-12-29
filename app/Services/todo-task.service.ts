import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../appconfig';
import { Observable } from 'rxjs';
import { BaseModel } from '../models/base-model.model';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TodoTaskService {

  private apiUrl: any;
  base = new BaseModel;
  private requestOptions: any;
  private headerDict: any;
  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      saveTask: this.appConfig.baseServiceUrl + 'Task/AddTask',
      getTask: this.appConfig.baseServiceUrl + 'Task/GetTasks',
      getTasksForApplicationIdUrl: this.appConfig.baseServiceUrl + 'Task/GetTasksForApplicationId',
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

  addTask(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.saveTask, JSON.stringify(input), this.requestOptions);
  }

  getTasks(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getTask, JSON.stringify(input), this.requestOptions);
  }

  getTasksForApplicationId(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getTasksForApplicationIdUrl, JSON.stringify(input), this.requestOptions);
  }
}
