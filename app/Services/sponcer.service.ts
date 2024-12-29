import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../appconfig';
import { BaseModel } from '../Models/base-model.model';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SponcerService {
  private apiUrl: any;
  base = new BaseModel;
  private requestOptions: any;
  private headerDict: any;

  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {

      AddSponcerUrl: this.appConfig.baseServiceUrl + 'Sponcer/AddSponcer',
      getSponcerUrl: this.appConfig.baseServiceUrl + 'Sponcer/GetSPSponcer',
      getSponcerByIdUrl: this.appConfig.baseServiceUrl + 'Sponcer/GetSponcerById',
      SPGetSponcerRequestDataUrl: this.appConfig.baseServiceUrl + 'Sponcer/SPGetSponcerRequestData',
      GetAllSponsorUrl: this.appConfig.baseServiceUrl + 'Sponcer/GetAllSponsor',
      VerifrySponsorUrl: this.appConfig.baseServiceUrl + 'Sponcer/VerifrySponsor',
      AddSponsorMappingUrl: this.appConfig.baseServiceUrl + 'Sponcer/AddSponcerMapping',
      rejectSponsorMappingUrl: this.appConfig.baseServiceUrl + 'Sponcer/RejectSponsorMapping'


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
  AddSponcer(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.AddSponcerUrl, input, this.requestOptions);
  }
  getSponcerData(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getSponcerUrl, input, this.requestOptions);
  }
  getSponcerBYId(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getSponcerByIdUrl, input, this.requestOptions);
  }
  SPGetSponcerRequestData(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.SPGetSponcerRequestDataUrl, input, this.requestOptions);
  }
  VerifrySponsor(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.VerifrySponsorUrl, input, this.requestOptions);
  }
  GetAllSponsor(): Observable<any> {
    this.setToken();
    return this.http.get<any>(this.apiUrl.GetAllSponsorUrl, this.requestOptions);
  }
  addSponsorMapping(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.AddSponsorMappingUrl, input, this.requestOptions);

  }
  rejectSponsorMapping(input:any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.rejectSponsorMappingUrl, input, this.requestOptions);
  }

}

