import { Injectable } from '@angular/core';
import { BaseModel } from '../models/base-model.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../appconfig';
import { SessionStorageService } from './session-storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl: any;
  base = new BaseModel;
  private requestOptions: any;
  private headerDict: any;
  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      getAllGroup: this.appConfig.baseServiceUrl + 'Group/GetAllGroups',
      createGroup: this.appConfig.baseServiceUrl + 'Group/AddGroup',
      updateGroup: this.appConfig.baseServiceUrl + 'Group/UpdateGroup',
      deleteGroup: this.appConfig.baseServiceUrl + 'Group/DeleteGroupById',
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
  getAllGroup(payload: any): Observable<any> {
    this.setToken();
    return this.http.post(this.apiUrl.getAllGroup, payload, this.requestOptions);
  }
  createGroup(payload: any): Observable<any> {
    this.setToken();
    return this.http.post(this.apiUrl.createGroup, payload,this.requestOptions);
  }
  updateGroup(payload: any): Observable<any> {
    this.setToken();
    return this.http.put(this.apiUrl.updateGroup, payload,this.requestOptions);
  }
  deleteGroup(id: number): Observable<any> {
    this.setToken();
    return this.http.delete(this.apiUrl.deleteGroup+'?id='+id,this.requestOptions);
  }

  showLoader() {
    $('#loader').show();
  }

  hideLoader() {
    $('#loader').hide();
  }
}
