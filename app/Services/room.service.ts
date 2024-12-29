import { Injectable } from '@angular/core';
import { BaseModel } from '../models/base-model.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../appconfig';
import { SessionStorageService } from './session-storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl: any;
  base = new BaseModel;
  private requestOptions: any;
  private headerDict: any;
  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      getAllRoom: this.appConfig.baseServiceUrl + 'room/GetAllRooms',
      createRoom: this.appConfig.baseServiceUrl + 'room/AddRooms',
      updateRoom: this.appConfig.baseServiceUrl + 'room/UpdateRoom',
      deleteRoom: this.appConfig.baseServiceUrl + 'room/DeleteRoomById',
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

  getAllRoom(payload: any): Observable<any> {
    this.setToken();
    return this.http.post(this.apiUrl.getAllRoom, payload, this.requestOptions);
  }
  createRoom(payload: any): Observable<any> {
    this.setToken();
    return this.http.post(this.apiUrl.createRoom, payload,this.requestOptions);
  }
  updateRoom(payload: any): Observable<any> {
    this.setToken();
    return this.http.put(this.apiUrl.updateRoom, payload,this.requestOptions);
  }
  deleteRoom(id: number): Observable<any> {
    this.setToken();
    return this.http.delete(this.apiUrl.deleteRoom+'?id='+id,this.requestOptions);
  }

  showLoader() {
    $('#loader').show();
  }

  hideLoader() {
    $('#loader').hide();
  }}
