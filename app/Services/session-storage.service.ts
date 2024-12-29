import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SessionStorageService {
  constructor() {}

  saveSession(user: any) {
    localStorage.setItem("conditional", user.conditional);
    localStorage.setItem("userName", user.fullName);
    localStorage.setItem("token", user.token);
    localStorage.setItem("userType", user.userType);
    localStorage.setItem("userId", user.userId);
    if(user.userType == 5)
      this.setApplicationId(user.applicationId);
  }

  saveSessionForApplicationname(Email: any) {
    localStorage.setItem("SessionForApplicationname", Email);
  }

  getUserApplicationId() {
    return localStorage.getItem("applicationId");
  }
  setApplicationId(applicationId: any) {
    localStorage.setItem("applicationId", applicationId);
  }

  getUsername() {
    return localStorage.getItem("userName");
  }

  GetSessionForApplicationname() {
    return localStorage.getItem("SessionForApplicationname");
  }
    getToken() {
    return localStorage.getItem("token");
  }

  getUserType() {
    return localStorage.getItem("userType");
  }

  getuserID() {
    return localStorage.getItem("userId");
  }

  getCampusId() {
    return sessionStorage.getItem("CampusId");
  }
  getIntakeId() {
    return sessionStorage.getItem("IntakeId");
  }
  getDashboardTab() {
    return localStorage.getItem("DashboardTab");
  }
  setDashboardTab(dtab: string) {
    return localStorage.setItem("DashboardTab", dtab);
  }
  clearSession() {
    localStorage.clear();
  }
  setpermission(isPermission: any) {
    localStorage.setItem("isPermission", isPermission);
  }
  getpermission() {
    return localStorage.getItem("isPermission");
  }
  getConditional() {
    return localStorage.getItem("conditional");
  }
 
}
