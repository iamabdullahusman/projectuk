import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppConfig } from "../appconfig";
import { BaseModel } from "../Models/base-model.model";
import { SessionStorageService } from "./session-storage.service";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ApplicationService {
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
      downloadOfferDocument: 
      this.appConfig.baseServiceUrl + "Offer/downloadOfferDocument",
      uploadOfferDocumentManully:
        this.appConfig.baseServiceUrl + "Offer/uploadOfferDocumentManully",
      getApplicationFormUrl:
        this.appConfig.baseServiceUrl + "Application/GetAllApplication",
      addApplicationUrl:
        this.appConfig.baseServiceUrl + "Application/AddThreeStepsApplicationForm",
      changeApplicationStatusUrl:
        this.appConfig.baseServiceUrl + "Application/ChangeApplicationStatus",
      ChangeApplicationStatusToReceivedUrl:
        this.appConfig.baseServiceUrl +
        "Application/ChangeApplicationStatusToReceived",
      changeDocumentStatusUrl:
        this.appConfig.baseServiceUrl + "Document/DocStatusUpdateInput",
      getStageCountUrl:
        this.appConfig.baseServiceUrl + "Application/GetStageRecordsById",
      getApplicationByIdUrl:
        this.appConfig.baseServiceUrl + "Application/GetApplicationById",
      getApplicationViewUrl:
        this.appConfig.baseServiceUrl + "Application/AddApplicationView",
      changeRMUrl:
        this.appConfig.baseServiceUrl + "Application/ChangeRegionalManager",

      AddCommentUrl:
        this.appConfig.baseServiceUrl + "Application/AddApplicationComment",
      getCommentsUrl:
        this.appConfig.baseServiceUrl + "Application/GetAllComments",
      AddNoteUrl:
        this.appConfig.baseServiceUrl + "Application/AddApplicationNote",
      getNoteUrl: this.appConfig.baseServiceUrl + "Application/GetAllNotes",
      getDocUrl:
        this.appConfig.baseServiceUrl + "Application/GetApplicationByDocumnet",
      getDocumentFilterUrl:
        this.appConfig.baseServiceUrl +
        "Application/GetFilteredDoumentsByApplicationId",

      changeRmUlmanage:
        this.appConfig.baseServiceUrl + "Application/ChangeManageBy",
      getAllManageuserUrl:
        this.appConfig.baseServiceUrl + "Application/GetAllUserManageBy",
      GetOfferInputUrl: this.appConfig.baseServiceUrl + "Offer/GetOffers",
      GetRequestDocumentsByApplicationIdUrl:
        this.appConfig.baseServiceUrl +
        "Offer/GetRequestDocumentsByApplicationId",
      SaveOfferUrl: this.appConfig.baseServiceUrl + "Offer/SendOffer",
      PriviousOffersUrl:
        this.appConfig.baseServiceUrl + "Offer/OfferLetterGenrate",
      changeApplicationOfferStatusUrl:
        this.appConfig.baseServiceUrl + "Offer/ChangeOfferStatus",
      GetOfferDetailUrl:
        this.appConfig.baseServiceUrl +
        "Offer/GetOfferDetailByApplicationIdAdmin",
      ArchiveApplicationUrl:
        this.appConfig.baseServiceUrl + "Application/GetArchiveApplications",
      DepositStatusurl:
        this.appConfig.baseServiceUrl + "Application/DepositePay",
      EmailSendSettingUrl:
        this.appConfig.baseServiceUrl + "Application/EmailSendSetting",
      AddvisaConversationUrl:
        this.appConfig.baseServiceUrl + "Visa/AddVisaCorrection",
      getApplicationHistoryByIdUrl:
        this.appConfig.baseServiceUrl + "Application/GetApplicationHistoryById",

      addOfferCancelReasonByUrl:
        this.appConfig.baseServiceUrl + "Offer/AddOfferCancelReason",
      AddVisaStudentStatusUrl:
        this.appConfig.baseServiceUrl + "Application/AddVisaStudentStatus",
      changeUploadDocumentStatusUrl:
        this.appConfig.baseServiceUrl + "Document/UploadDocumentStatusChange",
      getAgentUrl: this.appConfig.baseServiceUrl + "Application/AssignToAgent",
      fetchInquiriesUrl:
        this.appConfig.baseServiceUrl + "Application/FetchInquiriesToLink",
      linkUnlinkInquiryUrl:
        this.appConfig.baseServiceUrl + "Application/LinkOrUnlinkInquiry",
      SaveLinkVisaUrl: this.appConfig.baseServiceUrl + "Visa/AddVisaLink",
      GetLinkVisaUrl: this.appConfig.baseServiceUrl + "Visa/GetVisaLink",
      getStudentDataByParentUrl:
        this.appConfig.baseServiceUrl + "Application/GetStudentProfileByParent",
      getApplicationUrl:
        this.appConfig.baseServiceUrl + "Application/GetApplicationStudent",
      getRenameDocumentsByDocIdURL:
        this.appConfig.baseServiceUrl + "Document/RenameDocumentsByDocId",
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
  getAllApplication(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.getApplicationFormUrl,
      JSON.stringify(input),
      this.requestOptions
    );
  }
  saveApplication(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.addApplicationUrl,
      JSON.stringify(input),
      this.requestOptions
    );
  }
  chageEmailSendSetting(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.EmailSendSettingUrl,
      JSON.stringify(input),
      this.requestOptions
    );
  }
  changeApplicationStatus(input): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.changeApplicationStatusUrl,
      input,
      this.requestOptions
    );
  }
  ChangeApplicationStatusToReceived(input): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.ChangeApplicationStatusToReceivedUrl,
      input,
      this.requestOptions
    );
  }
  changeApplicationOfferStatus(input): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.changeApplicationOfferStatusUrl,
      input,
      this.requestOptions
    );
  }
  changeDocumentStatus(input): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.changeDocumentStatusUrl,
      input,
      this.requestOptions
    );
  }
  changeUploadDocumentStatus(input): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.changeUploadDocumentStatusUrl,
      JSON.stringify(input),
      this.requestOptions
    );
  }

  RenameDocumentsByDocIdServiceFun(input): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.getRenameDocumentsByDocIdURL,
      JSON.stringify(input),
      this.requestOptions
    );
  }
  getStageCount(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.getStageCountUrl,
      JSON.stringify(input),
      this.requestOptions
    );
  }
  getApplicationById(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.getApplicationByIdUrl,
      input,
      this.requestOptions
    );
  }
  getApplicationHistoryById(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.getApplicationHistoryByIdUrl,
      input,
      this.requestOptions
    );
  }
  //////////
  ApplicationView(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.getApplicationViewUrl,
      input,
      this.requestOptions
    );
  }
  ChangeRm(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.changeRMUrl,
      input,
      this.requestOptions
    );
  }
  AddComment(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.AddCommentUrl,
      input,
      this.requestOptions
    );
  }
  getComments(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.getCommentsUrl,
      input,
      this.requestOptions
    );
  }
  AddNote(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.AddNoteUrl,
      input,
      this.requestOptions
    );
  }
  getNotes(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.getNoteUrl,
      input,
      this.requestOptions
    );
  }
  getDocList(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.getDocUrl,
      input,
      this.requestOptions
    );
  }
  getDocumentfilterList(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.getDocumentFilterUrl,
      input,
      this.requestOptions
    );
  }

  ChangeManage(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.changeRmUlmanage,
      input,
      this.requestOptions
    );
  }
  GetManageUser(): Observable<any> {
    this.setToken();
    return this.http.get<any>(
      this.apiUrl.getAllManageuserUrl,
      this.requestOptions
    );
  }
  GetFilterOffer(): Observable<any> {
    this.setToken();
    return this.http.get<any>(
      this.apiUrl.GetOfferInputUrl,
      this.requestOptions
    );
  }
  GetRequestDocumentsByApplicationId(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.GetRequestDocumentsByApplicationIdUrl,
      input,
      this.requestOptions
    );
  }
  GetOfferDetail(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.GetOfferDetailUrl,
      input,
      this.requestOptions
    );
  }
  SaveOffers(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.SaveOfferUrl,
      input,
      this.requestOptions
    );
  }

  PriviousOffsers(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.PriviousOffersUrl,
      input,
      this.requestOptions
    );
  }
  downloadOfferLetter(wordurl: string): Observable<Blob> {
    let url = wordurl;
    return this.http.get(url, { responseType: "blob" });
  }

  GetArchiveApplicationData(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.ArchiveApplicationUrl,
      input,
      this.requestOptions
    );
  }
  AddVisaReason(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.AddvisaConversationUrl,
      input,
      this.requestOptions
    );
  }
  DepositStatus(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.DepositStatusurl,
      input,
      this.requestOptions
    );
  }

  addCancelReason(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.addOfferCancelReasonByUrl,
      input,
      this.requestOptions
    );
  }
  ChangeAgent(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.getAgentUrl,
      input,
      this.requestOptions
    );
  }

  AddVisaStudentStatus(applicationId: any, input: any): Observable<any> {
    this.setToken();
    var input1 = {
      id: applicationId,
      status: input,
    };
    return this.http.post<any>(
      this.apiUrl.AddVisaStudentStatusUrl,
      input1,
      this.requestOptions
    );
  }
  FetchInquiries(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.fetchInquiriesUrl,
      input,
      this.requestOptions
    );
  }
  LinkUnlinkInquiry(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.linkUnlinkInquiryUrl,
      input,
      this.requestOptions
    );
  }
  SaveLinkVisa(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.SaveLinkVisaUrl,
      input,
      this.requestOptions
    );
  }
  GetLinkVisa(Input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.GetLinkVisaUrl,
      Input,
      this.requestOptions
    );
  }
  getStudentApplicationData(): Observable<any> {
    this.setToken();
    return this.http.get<any>(
      this.apiUrl.getStudentDataByParentUrl,
      this.requestOptions
    );
  }
  getApplication(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(
      this.apiUrl.getApplicationUrl,
      JSON.stringify(input),
      this.requestOptions
    );
  }
  upload(file: File, wordfile: File, ApplicationId: any): Observable<any> {
    const formData = new FormData();
    formData.append("pdf_document", file);
    formData.append("word_document", wordfile);
    formData.append("ApplicationId", ApplicationId);
    // Get the token from your authentication service or localStorage
    const token = localStorage.getItem("jwtToken"); // Replace with your method of getting the token
    const headers = new HttpHeaders({
      Authorization: "Bearer " + this.sessionService.getToken(),
      // 'Content-type': 'multipart/form-data'
    });
    return this.http.post(this.apiUrl.uploadOfferDocumentManully, formData, {
      headers,
    });
  }
  // downloadOfferDocument(formData: FormData): Observable<Blob> {
  //   const headers = new HttpHeaders({
  //     'Accept': 'application/pdf'
  //   });

  //   return this.http.post(this.apiUrl.downloadOfferDocument, formData, {
  //     headers: headers,
  //     responseType: 'blob'
  //   });
  // }
  // downloadPdf(url: string) {
  //   return this.http.get(url, { responseType: 'arraybuffer' });
  // }
  downloadPdf(visaFileUrl: string): Observable<Blob> {
    const url = 'https://localhost:7102/Visa/getVisaFileNames';
    const input = { visaFileUrl: visaFileUrl }; // Assuming visaFileUrl is the input parameter
    
    // Get the token from your authentication service or localStorage
    const token = localStorage.getItem("jwtToken"); // Replace with your method of getting the token
  
    const headers = new HttpHeaders({
      Authorization: "Bearer " + this.sessionService.getToken(), // Use your token retrieval method
    });
  
    return this.http.post(url, input, {
      headers: headers,
      responseType: "blob"  // Specify that the response is a Blob (binary data)
    });
  }
  
}
