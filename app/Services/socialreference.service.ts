import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../appconfig';
import { BaseModel } from '../models/base-model.model';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SocialreferenceService {

  private apiUrl: any;
  base = new BaseModel;

  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      getsocialrefUrl: this.appConfig.baseServiceUrl + 'SocialReference/GetSocialPreference',
      saveSocialrefUrl: this.appConfig.baseServiceUrl + 'SocialReference/AddSocialPreference',
      deletesocialrefUrl: this.appConfig.baseServiceUrl + 'SocialReference/RemoveSocialReference',
      getSources: this.appConfig.baseServiceUrl + 'SocialReference/GetSources',
    }


  }
  getAllSocialRef(input: any) {
    const headerDict = {
      'Authorization': 'Bearer ' + this.sessionService.getToken(),
      'Content-type': 'application/json'
    }

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    return this.http.post<any>(this.apiUrl.getsocialrefUrl, JSON.stringify(input), requestOptions);
  }
  saveSocialRef(input: any) {
    const headerDict = {
      'Authorization': 'Bearer ' + this.sessionService.getToken(),
      'Content-type': 'application/json'
    }

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    return this.http.post<any>(this.apiUrl.saveSocialrefUrl, JSON.stringify(input), requestOptions);
  }
  deleteSocialRef(input: any) {
    const headerDict = {
      'Authorization': 'Bearer ' + this.sessionService.getToken(),
      'Content-type': 'application/json'
    }

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    return this.http.post<any>(this.apiUrl.deletesocialrefUrl, JSON.stringify(input), requestOptions);
  }

  getSources() {
    const headerDict = {
      'Authorization': 'Bearer ' + this.sessionService.getToken(),
      'Content-type': 'application/json'
    }

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    return this.http.get<any>(this.apiUrl.getSources, requestOptions);
  }

  // getAllFeepayOptions(input:any){
  //   const headerDict = {
  //     'Authorization': 'Bearer '+this.sessionService.getToken(),
  //     'Content-type':'application/json'
  //   }

  //   const requestOptions = {                                                                                                                                                                                 
  //     headers: new HttpHeaders(headerDict),
  //   };
  //   return this.http.post<any>(this.apiUrl.getFeePayOptionUrl,JSON.stringify(input),requestOptions);
  // }
  // getAllSecialPreferenceOptions(input:any){
  //   const headerDict = {
  //     'Authorization': 'Bearer '+this.sessionService.getToken(),
  //     'Content-type':'application/json'
  //   }

  //   const requestOptions = {                                                                                                                                                                                 
  //     headers: new HttpHeaders(headerDict),
  //   };
  //   return this.http.post<any>(this.apiUrl.getSocialPreferanceOptionUrl,JSON.stringify(input),requestOptions);
  // }
}
