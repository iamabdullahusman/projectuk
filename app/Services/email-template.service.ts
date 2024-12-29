import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AppConfig } from '../appconfig';
import { BaseModel } from '../models/base-model.model';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class EmailTemplateService {
  private apiUrl: any;
  base = new BaseModel;
  private requestOptions: any;
  private headerDict: any;


  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      getEmailTemplateTypeUrl: this.appConfig.baseServiceUrl + 'EmailTemplate/GetEmailTemplateType',
      getNewEmailTemplateTypeUrl: this.appConfig.baseServiceUrl + 'NewEmailTemplate/GetEmailTemplateType',
      getFolloupUrl: this.appConfig.baseServiceUrl + 'NewEmailTemplate/GetFolloup',
      saveEmailTemplateUrl: this.appConfig.baseServiceUrl + 'EmailTemplate/SaveEmailTemplate',
      getVerivariableNameListUrl: this.appConfig.baseServiceUrl + 'EmailTemplate/GetEmailTemplateVeriables',
      addEmailTemplateUrl: this.appConfig.baseServiceUrl + 'EmailTemplate/SaveEmailTemplate',
      NewaddEmailTemplateUrl: this.appConfig.baseServiceUrl + 'NewEmailTemplate/SaveEmailTemplate',
      SaveFollloupTemplateDataUrl: this.appConfig.baseServiceUrl + 'NewEmailTemplate/SaveEmailFolloup',
      SaveNewMultipleFollloupTemplateDataUrl: this.appConfig.baseServiceUrl + 'NewEmailTemplate/SaveEmailNewFolloup',
      DeleteFollloupTemplateDataUrl: this.appConfig.baseServiceUrl + 'NewEmailTemplate/DeleteEmailNewFolloup',
      AddNewEmailTemplateUrl: this.appConfig.baseServiceUrl + 'NewEmailTemplate/SaveEmailTemplate',
      getSpEmailTemplateUrl: this.appConfig.baseServiceUrl + 'EmailTemplate/GetSPEmailContents',
      GetEmailContantUrl: this.appConfig.baseServiceUrl + 'NewEmailTemplate/GetEmailContant',
      getEmailTemplateByIdUrl: this.appConfig.baseServiceUrl + 'EmailTemplate/GetEmailTemplateById',
      getEmailTemplateByTypeUrl: this.appConfig.baseServiceUrl + 'EmailTemplate/GetEmailTemplateByType',
      getNewEmailTemplateByTypeUrl: this.appConfig.baseServiceUrl + 'NewEmailTemplate/GetEmailTemplateByType',
      NewGetsEmailTemplateByTypeUrl: this.appConfig.baseServiceUrl + 'NewEmailTemplate/GetNewEmailTemplateByType',
      deleteEmailTemplateUrl: this.appConfig.baseServiceUrl + 'EmailTemplate/EmailTemplateDelete',
      NewdeleteEmailTemplateUrl: this.appConfig.baseServiceUrl + 'NewEmailTemplate/EmailTemplateDelete',
      AddEmailTemplateUrl: this.appConfig.baseServiceUrl + 'EmailTemplate/AddEmailTemplateType',
      NewAddEmailTemplateUrl: this.appConfig.baseServiceUrl + 'NewEmailTemplate/AddEmailTemplateType',
      getAllEmailTemplateTypeUrl: this.appConfig.baseServiceUrl + 'EmailTemplate/GetSPEmailTemplateType',

      saveEmailVeriableTemplateUrl: this.appConfig.baseServiceUrl + 'EmailTemplate/AddEmailTemplateVeriables',
      deleteEmailVeriableTemplateUrl: this.appConfig.baseServiceUrl + 'EmailTemplate/DeleteEmailTemplateVeriables',
      GetEmailVeriableTemplateUrl: this.appConfig.baseServiceUrl + 'EmailTemplate/GetSPEmailVariable',
      GetEmailRoleByEventNameUrl: this.appConfig.baseServiceUrl + 'NewEmailTemplate/GetEmailRoleByEventName',
      FolloupEmailRoleUrl: this.appConfig.baseServiceUrl + 'NewEmailTemplate/FolloupEmailRole',
      GetSubEmailContantUrl: this.appConfig.baseServiceUrl + 'NewEmailTemplate/GetSubEmailContant',
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
  getAllEmailTemplateType(): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getEmailTemplateTypeUrl, '', this.requestOptions);
  }

  getAllNewEmailTemplateType(): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getNewEmailTemplateTypeUrl, '', this.requestOptions);
  }

  getFolloups(input:any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getFolloupUrl,JSON.stringify(input), this.requestOptions);
  }

  saveEmailTemplate(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.saveEmailTemplateUrl, JSON.stringify(input), this.requestOptions);
  }
  getVeriablesList(): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getVerivariableNameListUrl, '', this.requestOptions);
  }
  addEmailTemplateData(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.addEmailTemplateUrl, JSON.stringify(input), this.requestOptions);
  }

  NewaddEmailTemplateData(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.NewaddEmailTemplateUrl, JSON.stringify(input), this.requestOptions);
  }

  SaveFollloupTemplateData(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.SaveFollloupTemplateDataUrl, JSON.stringify(input), this.requestOptions);
  }

  SaveNewMultipleFollloupTemplateData(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.SaveNewMultipleFollloupTemplateDataUrl, JSON.stringify(input), this.requestOptions);
  }

  DeleteFollloupTemplateData(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.DeleteFollloupTemplateDataUrl, JSON.stringify(input), this.requestOptions);
  }

  getSpEmailTemplateData(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getSpEmailTemplateUrl, JSON.stringify(input), this.requestOptions);
  }
  GetEmailContant(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.GetEmailContantUrl, JSON.stringify(input), this.requestOptions);
  }
  getEmailTemplateByIdData(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getEmailTemplateByIdUrl, JSON.stringify(input), this.requestOptions);
  }
  getEmailTemplateByTypeData(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getEmailTemplateByTypeUrl, JSON.stringify(input), this.requestOptions);
  }

  getNewEmailTemplateByTypeData(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getNewEmailTemplateByTypeUrl, JSON.stringify(input), this.requestOptions);
  }

  GetsNewEmailTemplateByTypeData(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.NewGetsEmailTemplateByTypeUrl, JSON.stringify(input), this.requestOptions);
  }

  deleteEmailTemplate(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.deleteEmailTemplateUrl, JSON.stringify(input), this.requestOptions);
  }

  NewdeleteEmailTemplate(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.NewdeleteEmailTemplateUrl, JSON.stringify(input), this.requestOptions);
  }

  AddEmailTemplate(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.AddEmailTemplateUrl, JSON.stringify(input), this.requestOptions);
  }

  NewAddEmailTemplate(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.NewAddEmailTemplateUrl, JSON.stringify(input), this.requestOptions);
  }

  AddNewEmailTemplate(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.AddNewEmailTemplateUrl, JSON.stringify(input), this.requestOptions);
  }

   EmailRole(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.GetEmailRoleByEventNameUrl, JSON.stringify(input), this.requestOptions);
  }

  FolloupEmailRole(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.FolloupEmailRoleUrl, JSON.stringify(input), this.requestOptions);
  }

  GetAllEmailType(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getAllEmailTemplateTypeUrl, JSON.stringify(input), this.requestOptions)
  }

   GetGetSubEmailContant(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.GetSubEmailContantUrl, JSON.stringify(input), this.requestOptions)
  }

  saveEmailVeriableTemplate(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.saveEmailVeriableTemplateUrl, JSON.stringify(input), this.requestOptions);
  }

  deleteEmailVeriableTemplate(input: any): Observable<any> {
    return this.http.post<any>(this.apiUrl.deleteEmailVeriableTemplateUrl, JSON.stringify(input), this.requestOptions);
  }

  GetEmailVeriableTemplate(input: any): Observable<any> {
    return this.http.post<any>(this.apiUrl.GetEmailVeriableTemplateUrl, JSON.stringify(input), this.requestOptions);
  }


}
