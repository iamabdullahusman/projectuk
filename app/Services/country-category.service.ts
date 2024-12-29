import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../appconfig';
import { BaseModel } from '../models/base-model.model';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CountryCategoryService {
  private apiUrl: any;
  base = new BaseModel;
  private requestOptions: any;
  private headerDict: any;
  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      AddCategoryUrl: this.appConfig.baseServiceUrl + 'CountryCategory/AddNewCategory',
      GetCategoryByIdUrl: this.appConfig.baseServiceUrl + 'CountryCategory/GetCategoryById',
      RemoveCategoryUrl: this.appConfig.baseServiceUrl + 'CountryCategory/DeleteCategory',
      SpGetCategoryUrl: this.appConfig.baseServiceUrl + 'CountryCategory/GetSpCountryCategoryData',
      GetCateloryListUrl: this.appConfig.baseServiceUrl + 'CountryCategory/GetCategoryList',
      AddCountryMappingUrl: this.appConfig.baseServiceUrl + 'CountryCategoryMapping/AddNewCountryMapping',
      GetCountryMappingUrl: this.appConfig.baseServiceUrl + 'CountryCategoryMapping/GetCountryMappingById',
      RemoveCountryMappingUrl: this.appConfig.baseServiceUrl + 'CountryCategoryMapping/DeleteCountryMapping',
      SpGetCountryMappingUrl: this.appConfig.baseServiceUrl + 'CountryCategoryMapping/SpGetCountryMapping',

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
  AddCategory(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.AddCategoryUrl, JSON.stringify(input), this.requestOptions);
  }
  GetCategoryById(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.GetCategoryByIdUrl, JSON.stringify(input), this.requestOptions);
  }
  RemoveCategory(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.RemoveCategoryUrl, JSON.stringify(input), this.requestOptions);
  }
  GetSpCategory(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.SpGetCategoryUrl, JSON.stringify(input), this.requestOptions);
  }
  GetCategoryList(): Observable<any> {
    this.setToken();
    return this.http.get<any>(this.apiUrl.GetCateloryListUrl, this.requestOptions);
  }
  AddCountryMapping(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.AddCountryMappingUrl, JSON.stringify(input), this.requestOptions);
  }
  GetCountryMappingBYId(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.GetCountryMappingUrl, JSON.stringify(input), this.requestOptions);

  }
  RemoveCountryMapping(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.RemoveCountryMappingUrl, JSON.stringify(input), this.requestOptions);

  }
  SpGetCountryMapping(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.SpGetCountryMappingUrl, JSON.stringify(input), this.requestOptions);

  }

}
