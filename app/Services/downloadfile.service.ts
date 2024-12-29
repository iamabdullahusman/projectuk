import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../appconfig';

@Injectable({
  providedIn: 'root'
})
export class DownloadfileService {

  constructor(private http: HttpClient, private appConfig: AppConfig) {

  }
  DownloadFile(url): Observable<any> {
    return this.http.get(this.appConfig.baseServiceUrl + url, { responseType: 'blob' })
  }
  DownloadFileWithBaseUrl(url): Observable<any> {
    return this.http.get(url, { responseType: 'blob' })
  }
}
