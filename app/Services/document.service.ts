import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../appconfig';
import { BaseModel } from '../models/base-model.model';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private apiUrl: any;
  base = new BaseModel;
  private requestOptions: any;
  private headerDict: any;
  constructor(private http: HttpClient, private appConfig: AppConfig, private sessionService: SessionStorageService) {
    this.apiUrl = {
      DocumentDashbaordUrl: this.appConfig.baseServiceUrl + 'Document/DocumentDashboard',
      DocumentRequestUrl: this.appConfig.baseServiceUrl + 'Document/DocumentRequest',
      DocumentUploadUrl: this.appConfig.baseServiceUrl + 'Document/DocumentUpload',
      DocumentStatusChangeUrl: this.appConfig.baseServiceUrl + 'Document/DocStatusUpdateInput',
      SaveDocument: this.appConfig.baseServiceUrl + 'Document/AddDocument',
      UserSaveDocument: this.appConfig.baseServiceUrl + 'Document/UserAddDocument',
      DeleteDocument: this.appConfig.baseServiceUrl + 'Document/DeleteDocument',
      ActiveDeactiveDoc: this.appConfig.baseServiceUrl + 'Document/ActiveDeactiveDocument',
      GetAllDocument: this.appConfig.baseServiceUrl + 'Document/GetAllDocument',
      DocumentsForApplicationUrl: this.appConfig.baseServiceUrl + 'Document/DocumentTypeMasterForApplication',
      AddStudentDocumentUrl: this.appConfig.baseServiceUrl + 'Document/AddRequestedDocument',
      UpdateDocumentTypeUrl: this.appConfig.baseServiceUrl + 'Document/DocumentTypeFileUpload',
      GetbindSubDocumentsUrl: this.appConfig.baseServiceUrl + 'Document/GetDocumentsByDocId',
      DeleteDocumentUrl: this.appConfig.baseServiceUrl + 'Document/DeletUploadDocumentByUploadDocId',
      DocumentsOnScrollUrl: this.appConfig.baseServiceUrl + 'Document/DocumentsOnScroll',
      StudentDocumentsUrl: this.appConfig.baseServiceUrl + 'Document/GetRequestedDocuments',
      DeleteUploadedDocumentUrl: this.appConfig.baseServiceUrl + 'Document/DeletUploadDocumentByUploadDocId',
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

  getDocumentDashboardData(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.DocumentDashbaordUrl, input, this.requestOptions);
  }
  DocumentRequest(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.DocumentRequestUrl, input, this.requestOptions);
  }
  DocumentsUpload(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.DocumentUploadUrl, input, this.requestOptions);
  }
  DocumentsStatusChange(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.DocumentStatusChangeUrl, input, this.requestOptions);
  }

  SaveDocument(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.SaveDocument, input, this.requestOptions);
  }
  UserSaveDocument(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.UserSaveDocument, input, this.requestOptions);
  }
  DeleteDocument(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.DeleteDocument, input, this.requestOptions);
  }
  DeleteUploadedDocument(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.DeleteUploadedDocumentUrl, input, this.requestOptions);
  }
  changeDocumentStatus(input: any): Observable<any> {
    this.setToken();

    return this.http.post<any>(this.apiUrl.ActiveDeactiveDoc, input, this.requestOptions);
  }
  GetAllDocument(input: any): Observable<any> {
    this.setToken();

    return this.http.post<any>(this.apiUrl.GetAllDocument, input, this.requestOptions);
  }
  DocumentsOnScroll(input: any): Observable<any> {
    this.setToken();

    return this.http.post<any>(this.apiUrl.DocumentsOnScrollUrl, input, this.requestOptions);
  }
  GetStudentDocuments(input:any): Observable<any> {
    this.setToken();

    return this.http.post<any>(this.apiUrl.StudentDocumentsUrl,input, this.requestOptions);
  }
  AddStudentDocument(input: any): Observable<any> {
    this.setToken();

    return this.http.post<any>(this.apiUrl.AddStudentDocumentUrl, input, this.requestOptions);
  }
  DocumentsForApplication(): Observable<any> {
    this.setToken();

    return this.http.get<any>(this.apiUrl.DocumentsForApplicationUrl, this.requestOptions);
  }
  UpdateDocumentType(input): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.UpdateDocumentTypeUrl, input, this.requestOptions);
  }
  GetbindSubDocuments(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.GetbindSubDocumentsUrl, input, this.requestOptions);
  }
  DeleteMultipleDocument(input: any): Observable<any> {
    this.setToken();
    return this.http.post<any>(this.apiUrl.DeleteDocumentUrl, input, this.requestOptions);
  }

}
