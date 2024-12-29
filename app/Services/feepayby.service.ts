import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AppConfig } from '../appconfig';
import { BaseModel } from '../Models/base-model.model';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class FeePayByService {

  private apiUrl: any;
  base = new BaseModel;
  private requestOptions: any;
  private headerDict: any;
  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      getFeePayByUrl: this.appConfig.baseServiceUrl + 'FeePay/GetFeePayOptions',
      saveFeePayByUrl: this.appConfig.baseServiceUrl + 'FeePay/AddFeePayOption',
      deleteFeePayByUrl: this.appConfig.baseServiceUrl + 'FeePay/RemoveFeePayOption',
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
  getAllFeePayBy(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getFeePayByUrl, JSON.stringify(input), this.requestOptions);
  }
  saveFeePayBy(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.saveFeePayByUrl, JSON.stringify(input), this.requestOptions);
  }
  deleteFeePayBy(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.deleteFeePayByUrl, JSON.stringify(input), this.requestOptions);
  }
}
