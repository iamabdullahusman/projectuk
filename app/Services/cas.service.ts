import { Injectable } from '@angular/core';
import { BaseModel } from '../models/base-model.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../appconfig';
import { SessionStorageService } from './session-storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CasService {private apiUrl: any;
  base = new BaseModel;
  private requestOptions: any;
  private headerDict: any;
  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      getCASUrl: this.appConfig.baseServiceUrl + 'CAS/GetCasFileByApplicationId',
      GetLinkVisaUrl: this.appConfig.baseServiceUrl + 'Visa/GetVisaLink',
      UpdateStatusUrl: this.appConfig.baseServiceUrl + 'Visa/ChangeStatusVisaLink',
    }
    this.setRequestoption();
  }
  private setRequestoption()
  {
    this.headerDict = {
      'Authorization': 'Bearer ' + this.sessionService.getToken(),
      'Content-type': 'application/json'
    }

    this.requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };
  }
  getCAS(input: any): Observable<any> {
    this.setRequestoption();
    return this.http.post<any>(this.apiUrl.getCASUrl, JSON.stringify(input), this.requestOptions);
  }

  GetLinkVisa(Input:any): Observable<any> {
    this.setRequestoption();
    return this.http.post<any>(this.apiUrl.GetLinkVisaUrl, Input,this.requestOptions);
  }
  
  UpdateStatus(Input:any): Observable<any> {
    this.setRequestoption();
    return this.http.post<any>(this.apiUrl.UpdateStatusUrl, Input,this.requestOptions);
  }
}
