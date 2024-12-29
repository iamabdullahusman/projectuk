import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../appconfig';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationOfferService {
  private apiUrl: any;
  private requestOptions: any;
  private headerDict: any;
  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      getDashboardOfferUrl: this.appConfig.baseServiceUrl + 'Offer/GetOfferDashboardApplications',
      getOfferedDetailByApplicationId: this.appConfig.baseServiceUrl + 'Offer/GetOfferedDetailByApplicationId',
      getOfferIntakes: this.appConfig.baseServiceUrl + 'Intake/GetIntakeList',
      getCampusUrl: this.appConfig.baseServiceUrl + 'Campus/GetCampusList',
      getCourseUrl: this.appConfig.baseServiceUrl + 'Course/GetCourseList',
      getOfferScrollUrl: this.appConfig.baseServiceUrl + 'Offer/OffersOnScroll',
      AddConditionUrl: this.appConfig.baseServiceUrl + 'Offer/AddCondition',
      GetConditionsUrl: this.appConfig.baseServiceUrl + 'Offer/GetConditions',
      ReadyToOfferUrl: this.appConfig.baseServiceUrl + 'application/ApplicationReadyForOffer',
      GetFeeUrl: this.appConfig.baseServiceUrl + 'Offer/GetFee',
      savefullfilUrl: this.appConfig.baseServiceUrl + 'Offer/offerIsFullfil',
      MoveToRatifyUrl: this.appConfig.baseServiceUrl + 'Offer/MoveToRatify',
      addDepositeOfferedDocument: this.appConfig.baseServiceUrl + 'Deposit/AddDepositeOfferedDocument',
      getFutureIntakeUrl: this.appConfig.baseServiceUrl + 'Intake/GetIntakeData',
      addConfirmOfferedDocument: this.appConfig.baseServiceUrl + 'Offer/AddConfirmOfferedDocument',
      confirmOffer: this.appConfig.baseServiceUrl + 'Offer/ConfirmOffer',
      getDeposites: this.appConfig.baseServiceUrl + 'Offer/GetDeposites',
      getOfferReasonUrl: this.appConfig.baseServiceUrl + 'Offer/GetOfferReason',
      DeferOfferStatusChangeUrl: this.appConfig.baseServiceUrl + 'Offer/ChangeDeferOfferStatus',
      getIntakesByCampusCourseUrl: this.appConfig.baseServiceUrl + 'Intake/GetIntakesByCampusCourse',
      getCourseByCampusUrl: this.appConfig.baseServiceUrl + 'Course/GetCoursesByCampusId',
      getOfferUrl: this.appConfig.baseServiceUrl + 'Offer/getOfferHitsory',
      GetCampusCourseIntakeUrl: this.appConfig.baseServiceUrl + 'Application/getCampusCourseIntakeById',
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
  getOfferDetail(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getOfferedDetailByApplicationId, JSON.stringify(input), this.requestOptions);
  }
  getDashboardOffer(input: any): Observable<any> {
    this.setToken();
    return this.http.post(this.apiUrl.getDashboardOfferUrl, input, this.requestOptions);
  }
  getIntakeOfDeferOffer(input: any): Observable<any> {
    this.setToken();
    return this.http.get<any>(this.apiUrl.getOfferIntakes, this.requestOptions);
  }
  getCampus(): Observable<any> {
    this.setToken();
    return this.http.get<any>(this.apiUrl.getCampusUrl, this.requestOptions);
  }
  getCourse(): Observable<any> {
    this.setToken();
    return this.http.get<any>(this.apiUrl.getCourseUrl, this.requestOptions);
  }
  getOfferScroll(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getOfferScrollUrl, JSON.stringify(input), this.requestOptions);
  }
  AddCondition(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.AddConditionUrl, JSON.stringify(input), this.requestOptions);
  }
  GetConditions(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.GetConditionsUrl, JSON.stringify(input), this.requestOptions);
  }
  ReadyToOffer(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.ReadyToOfferUrl, JSON.stringify(input), this.requestOptions);
  }
  getFee(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.GetFeeUrl, JSON.stringify(input), this.requestOptions);
  }
  savefullfil(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.savefullfilUrl, JSON.stringify(input), this.requestOptions);
  }
  MoveToRatify(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.MoveToRatifyUrl, JSON.stringify(input), this.requestOptions);
  }
  addDepositeOffered(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.addDepositeOfferedDocument, JSON.stringify(input), this.requestOptions);
  }

  addOfferDocument(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.addConfirmOfferedDocument, JSON.stringify(input), this.requestOptions);
  }
  confirmOffer(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.confirmOffer, JSON.stringify(input), this.requestOptions);
  }
  getDeposites(): Observable<any> {
    this.setToken();
    return this.http.get<any>(this.apiUrl.getDeposites, this.requestOptions);
  }
  getOfferReason(): Observable<any> {
    this.setToken();
    return this.http.get<any>(this.apiUrl.getOfferReasonUrl, this.requestOptions);
  }
  DeferOfferStatusChange(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.DeferOfferStatusChangeUrl, JSON.stringify(input), this.requestOptions);
  }
  getOfferHistory(): Observable<any> {
    this.setToken();
    return this.http.get<any>(this.apiUrl.getOfferUrl, this.requestOptions);
  }
  getFutureIntake(): Observable<any> {
    this.setToken();
    return this.http.get<any>(this.apiUrl.getFutureIntakeUrl, this.requestOptions);
  }

  getIntakesByCampusCourse(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getIntakesByCampusCourseUrl, JSON.stringify(input), this.requestOptions);
  }

  getCoursesByCampus(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.getCourseByCampusUrl, JSON.stringify(input), this.requestOptions);
  }

  getCampusCourseIntakeById(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.GetCampusCourseIntakeUrl, JSON.stringify(input), this.requestOptions);
  }
  
}
