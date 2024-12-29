import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../appconfig';
import { Observable } from 'rxjs';
import { BaseModel } from '../Models/base-model.model';


@Injectable({
  providedIn: 'root'
})
export class UfpServService {
  private apiUrl: any;
  base = new BaseModel;
  constructor(private http: HttpClient, private appConfig: AppConfig) {
    this.apiUrl = {
      login: this.appConfig.baseServiceUrl + 'Account/Login',
      signup: this.appConfig.baseServiceUrl + 'Account/Signup',
      forgotPasswordUrl: this.appConfig.baseServiceUrl + 'Account/ForgotPassword',
      changePasswordUrl: this.appConfig.baseServiceUrl + 'Account/ChangePassword'
    }
  }

  Login(loginInput: any): Observable<BaseModel> {
    return this.http.post<BaseModel>(this.apiUrl.login, loginInput);
  }
  Signup(signupInput: any): Observable<BaseModel> {
    return this.http.post<BaseModel>(this.apiUrl.signup, signupInput);
  }
  forgetPassword(forgetPassInput: any): Observable<BaseModel> {
    return this.http.post<BaseModel>(this.apiUrl.forgotPasswordUrl, forgetPassInput);
  }
  changePasswordUrl(newPasswordInput: any): Observable<BaseModel> {
    console.log("service");
    return this.http.post<BaseModel>(this.apiUrl.changePasswordUrl, newPasswordInput);
    console.log("service 2");
  }
}
