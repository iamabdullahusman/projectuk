import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../appconfig';
import { BaseModel } from '../models/base-model.model';
import { SessionStorageService } from './session-storage.service';
@Injectable({
  providedIn: 'root'
})

export class UserManagement {
  private apiUrl: any;
  base = new BaseModel;
  private requestOptions: any;
  private headerDict: any;
  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      addUsers: this.appConfig.baseServiceUrl + 'User/AddUser',
      getUsers: this.appConfig.baseServiceUrl + 'User/GetUsers',
      getUsersByTypeUrl: this.appConfig.baseServiceUrl + 'User/GetUsersByType',
      getUserByIdUrl: this.appConfig.baseServiceUrl + 'User/GetUserById',
      addTeacher: this.appConfig.baseServiceUrl + 'User/AddTeacher',
      
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
  AddUsers(Input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.addUsers, JSON.stringify(Input), this.requestOptions);
  }

  GetUsers(Input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getUsers, JSON.stringify(Input), this.requestOptions);
  }

  getUsersByType(Input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getUsersByTypeUrl, Input, this.requestOptions);
  }
  getUserById(Input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getUserByIdUrl, Input, this.requestOptions);
  }
  // AddTeacher(Input: any): Observable<any> {
  //   this.setToken();
  //   return this.http.post<any>(this.apiUrl.addTeacher, JSON.stringify(Input), this.requestOptions);
  // }

  setTokenWithFormData() {
    this.headerDict = {
      Authorization: "Bearer " + this.sessionService.getToken(),
    };

    this.requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };
  }
  // AddTeacher(input: any): Observable<any> {
  //   this.setTokenWithFormData();
  //   console.log("File:", input.fileDetails);
  //   console.log("Email:", input.email);
  //   console.log("firstName", input.firstName);
  //   console.log("lastName:", input.lastName);
  //   console.log("userType:", input.userType);
  //   console.log("FirstName", input.firstName);
  //   console.log("address:", input.address);
  //   console.log("contactNo:", input.contactNo);
  //   console.log("dateOfBirth:", input.dateOfBirth);
  //   console.log("homeNumber", input.homeNumber);
  //   console.log("emergencyContactName1:", input.emergencyContactName1);
  //   console.log("emergencyNumber1:", input.emergencyNumber1);
  //   console.log("emergencyAddress1", input.emergencyAddress1);
  //   console.log("emergencyContactName2:", input.emergencyContactName2);
  //   console.log("emergencyNumber2:", input.emergencyNumber2);
  //   console.log("emergencyAddress2", input.emergencyAddress2);

  //   let formData = new FormData();
  //   formData.append("firstName",input.firstName);
  //   formData.append("lastName",input.lastName);
  //   formData.append("userType", '8');
  //   formData.append("teacherId", "0");
  //   formData.append("contactNo", input.contactNo);
  //   formData.append("homeNumber", input.homeNumber);
  //   formData.append("email", input.email);
  //   formData.append("dateOfBirth", input.dateOfBirth);
  //   formData.append("address", input.address);
  //   formData.append("emergencyContactName1", input.emergencyContactName1);
  //   formData.append("emergencyNumber1", input.emergencyNumber1);
  //   formData.append("emergencyAddress1", input.emergencyAddress1);
  //   formData.append("emergencyAddress2", input.emergencyAddress2);
  //   formData.append("emergencyContactName2", input.emergencyContactName2);
  //   formData.append("emergencyNumber2", input.emergencyNumber2);
  //   formData.append("fileDetails", input.fileDetails);


  //   console.log("formData", formData);

  //   return this.http.post(this.apiUrl.addTeacher, formData, this.requestOptions);
  // }


//For ADDING TEACHER FIELD 
  AddTeacher(payload: any): Observable<any> {
    this.setTokenWithFormData();
    console.log("userId", payload.userId);
    let formData = new FormData();
    formData.append("userId",payload.userId || "0");
    formData.append("firstName", payload.firstName || "");
    formData.append("lastName", payload.lastName || "");
    formData.append("userType", payload.userType || ""); // Assuming '8' is a constant value
    formData.append("teacherId", "0"); // Assuming this is always '0'
    formData.append("contactNo", payload.contactNo || "");
    //formData.append("password",payload.password || "");
    formData.append("homeNumber", payload.homeNumber || "");
    formData.append("email", payload.email || "");
    formData.append("dateOfBirth", payload.dateOfBirth || "");
    formData.append("address", payload.address || "");
    formData.append("emergencyContactName1", payload.emergencyContactName1 || "");
    formData.append("emergencyNumber1", payload.emergencyNumber1 || "");
    formData.append("emergencyAddress1", payload.emergencyAddress1 || "");
    formData.append("emergencyAddress2", payload.emergencyAddress2 || "");
    formData.append("emergencyContactName2", payload.emergencyContactName2 || "");
    formData.append("emergencyNumber2", payload.emergencyNumber2 || "");

    // Assuming fileDetails is a File object
    if (payload.fileDetails) {
        formData.append("fileDetails", payload.fileDetails);
    }

    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    return this.http.post(this.apiUrl.addTeacher, formData, this.requestOptions);
  }
}