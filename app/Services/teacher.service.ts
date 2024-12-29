import { Injectable } from "@angular/core";
import { BaseModel } from "../models/base-model.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppConfig } from "../appconfig";
import { SessionStorageService } from "./session-storage.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TeacherService {
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
      getAllTeacher: this.appConfig.baseServiceUrl + "Teacher/GetAllTeachers",
      getTeacherById: this.appConfig.baseServiceUrl + "Teacher/GetTeacherById",
     getTeacherUserById: this.appConfig.baseServiceUrl + "Teacher/GetTeacherByUserId",
      createTeacher: this.appConfig.baseServiceUrl + "Teacher/AddTeachers",
      updateTeacher: this.appConfig.baseServiceUrl + "Teacher/UpdateTeacher",
      deleteTeacher:
        this.appConfig.baseServiceUrl + "Teacher/DeleteTeacherById",
    }
    this.setToken();
  }
  // baseUrl = {
  //   getTeacherByUserId: 'https://localhost:7102/api/teacher/GetTeacherByUserId' // Update to the correct API URL
  // };
  setToken() {
    this.headerDict = {
      Authorization: "Bearer " + this.sessionService.getToken(),
      "Content-type": "application/json",
    };

    this.requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };
  }

  setTokenWithFormData() {
    this.headerDict = {
      Authorization: "Bearer " + this.sessionService.getToken(),
    };

    this.requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };
  }

  getAllTeacher(payload: any): Observable<any> {
    this.setToken();
    return this.http.post(
      this.apiUrl.getAllTeacher,
      payload,
      this.requestOptions
    );
  }
  createTeacher(payload: any): Observable<any> {
    this.setTokenWithFormData();
    let formData = new FormData();
    formData.append("teacherId", "0");
    formData.append("name", payload.name);
    formData.append("surname", payload.surname);
    formData.append("mobileNumber", payload.mobileNumber);
    formData.append("homeNumber", payload.homeNumber);
    formData.append("email", payload.email);
    formData.append("dateOfBirth", payload.dateOfBirth);
    formData.append("address", payload.address);
    formData.append("emergencyContactName1", payload.emergencyContactName1);
    formData.append("emergencyNumber1", payload.emergencyNumber1);
    formData.append("emergencyAddress1", payload.emergencyAddress1);
    formData.append("emergencyAddress2", payload.emergencyAddress2);
    formData.append("emergencyContactName2", payload.emergencyContactName2);
    formData.append("emergencyNumber2", payload.emergencyNumber2);
    formData.append("fileDetails", payload.cvFile);
    return this.http.post(
      this.apiUrl.createTeacher,
      formData,
      this.requestOptions
    );
  }
  updateTeacher(payload: any): Observable<any> {
    console.log(payload)
    this.setTokenWithFormData();
    let formData = new FormData();
    formData.append("teacherId", payload.teacherId);
    formData.append("name", payload.name);
    formData.append("surname", payload.surname);
    formData.append("mobileNumber", payload.mobileNumber);
    if (payload.homeNumber) formData.append("homeNumber", payload.homeNumber);
    formData.append("email", payload.email);
    if (payload.dateOfBirth)
      formData.append("dateOfBirth", payload.dateOfBirth);
    formData.append("address", payload.address);
    formData.append("emergencyContactName1", payload.emergencyContactName1);
    if (payload.emergencyNumber1)
      formData.append("emergencyNumber1", payload.emergencyNumber1);
    formData.append("emergencyAddress1", payload.emergencyAddress1);
    formData.append("emergencyAddress2", payload.emergencyAddress2);
    formData.append("emergencyContactName2", payload.emergencyContactName2);
    if (payload.emergencyNumber2)
      formData.append("emergencyNumber2", payload.emergencyNumber2);
    formData.append("fileDetails", payload.cvFile);
    return this.http.put(
      this.apiUrl.updateTeacher,
      formData,
      this.requestOptions
    );
  }
  deleteTeacher(id: number): Observable<any> {
    this.setToken();
    return this.http.delete(
      this.apiUrl.deleteTeacher + "?id=" + id,
      this.requestOptions
    );
  }
  getTeacherById(id: number): Observable<any> {
    this.setToken();
    return this.http.get(
      this.apiUrl.getTeacherById + "?id=" + id,
      this.requestOptions
    );
  }
  getTeacherUserById(userId:number): Observable<any> {
      this.setToken();
    // const userId = localStorage.getItem('userId');
    return this.http.get(
      this.apiUrl.getTeacherUserById + "?userId=" + userId,
      this.requestOptions
    );
    
  }

  showLoader() {
    $("#loader").show();
  }

  hideLoader() {
    $("#loader").hide();
  }
}
