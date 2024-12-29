import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseModel } from '../models/base-model.model';
import { AppConfig } from '../appconfig';
import { SessionStorageService } from './session-storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TermService {
  private apiUrl: any;
  base = new BaseModel;
  private requestOptions: any;
  private headerDict: any;
  private terms = [];
  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      getAllTerm: this.appConfig.baseServiceUrl + 'Terms/GetAllTerms',
      createTerm: this.appConfig.baseServiceUrl + 'Terms/AddTerms',
      updateTerm: this.appConfig.baseServiceUrl + 'Terms/UpdateTerms',
      deleteTerm: this.appConfig.baseServiceUrl + 'Terms/TermsDeleteById',
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

  getAllTerm(payload: any): Observable<any> {
    this.setToken();
    return this.http.post(this.apiUrl.getAllTerm, payload, this.requestOptions);
  }
  createTerm(payload: any): Observable<any> {
    this.setToken();
    return this.http.post(this.apiUrl.createTerm, payload,this.requestOptions);
  }
  updateTerm(payload: any): Observable<any> {
    this.setToken();
    return this.http.put(this.apiUrl.updateTerm, payload,this.requestOptions);
  }
  deleteTerm(id: number): Observable<any> {
    this.setToken();
    return this.http.delete(this.apiUrl.deleteTerm+'?id='+id,this.requestOptions);
  }

  showLoader() {
    $('#loader').show();
  }

  hideLoader() {
    $('#loader').hide();
  }
}
