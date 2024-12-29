import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BaseModel } from "../Models/base-model.model";
import { AppConfig } from "../appconfig";
import { Observable } from "rxjs";
import { SessionStorageService } from "./session-storage.service";

@Injectable({
  providedIn: "root",
})
export class AccountService {
  private apiUrl: any;
  base = new BaseModel();
  private requestOptions: any;
  private headerDict: any;
  constructor(
    private http: HttpClient,
    private appConfig: AppConfig,
    private sessionService: SessionStorageService
  ) {
    this.apiUrl = {
      getCountriesUrl: this.appConfig.baseServiceUrl + "Account/GetCountries",
      getCitiesUrl:
        this.appConfig.baseServiceUrl + "Account/GetCitiesByCountryId",
      getUserFilters: this.appConfig.baseServiceUrl + "Account/GetUserFilters",
      changePasswordUrl:
        this.appConfig.baseServiceUrl + "Account/ChangePassword",
      StudentSidebarSettingsUrl:
        this.appConfig.baseServiceUrl + "Account/StudentSidebarSettings",
    };
    this.setToken();
  }
  setToken() {
    this.headerDict = {
      Authorization: "Bearer " + this.sessionService.getToken(),
      "Content-type": "application/json",
    };

    this.requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };
  }
  getCountries(): Observable<any> {
    this.setToken();
    return this.http.get<any>(this.apiUrl.getCountriesUrl, this.requestOptions);
  }

  getCitiesByCountryId(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.getCitiesUrl,
      JSON.stringify(input),
      this.requestOptions
    );
  }

  getUserFilters(): Observable<any> {
    this.setToken();
    return this.http.get<any>(this.apiUrl.getUserFilters, this.requestOptions);
  }

  changePassword(input: any): Observable<any> {
    this.setToken();
    console.log("Input is: ",input);
    return this.http.post<any>(
      this.apiUrl.changePasswordUrl,
      JSON.stringify(input),
      this.requestOptions
    );
  }
  StudentSidebarSettings(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.StudentSidebarSettingsUrl,
      input,
      this.requestOptions
    );
  }
}
