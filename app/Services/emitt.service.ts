import { EventEmitter, Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmittService {
  private ApplicationIdChange: EventEmitter<any> = new EventEmitter();
  private AddApplicationbtnHideShow: EventEmitter<any> = new EventEmitter();
  private applicationChange: EventEmitter<any> = new EventEmitter();
  private ApplicationStatusChange: EventEmitter<any> = new EventEmitter();
  private CampusIntakeChange: EventEmitter<any> = new EventEmitter();
  private applicationParentStatusChange: EventEmitter<any> = new EventEmitter();
  private GetNotifications:EventEmitter<any> = new EventEmitter();
  private editapplication: EventEmitter<any> = new EventEmitter();
  private OfferChange: EventEmitter<any> = new EventEmitter();
  private permissionChange: EventEmitter<any> = new EventEmitter();
  private headerpermition: EventEmitter<any> = new EventEmitter();

  constructor() { }
  
  public onchangeApplicationId(id) {
    this.ApplicationIdChange.emit(id);
  }
  public onchangeApplicationStatusChange(id) {
    this.ApplicationStatusChange.emit(id)
  }
  public getApplicationId(): Observable<any> {
    return this.ApplicationIdChange;
  }
  public onChangeAddApplicationbtnHideShow(ishide) {
    this.AddApplicationbtnHideShow.emit(ishide);
  }
  public getAddApplicationbtnHideShow(): Observable<any> {
    return this.AddApplicationbtnHideShow;
  }
  public OnChangeapplication(input) {
    this.applicationChange.emit(input);
  }
  public getapplicationChange(): Observable<any> {
    return this.applicationChange;
  }
  public getapplicationStatusChange(): Observable<any> {
    return this.ApplicationStatusChange;
  }

  //set intakeCampue changes
  public onChangeCampusIntake(input) {
    this.CampusIntakeChange.emit(input);
  }
  //get intakeCampus changes
  public GetCampusIntakeChange(): Observable<any> {
    return this.CampusIntakeChange;
  }
  public changeApplicationParentstatus(id: any) {
    this.applicationParentStatusChange.emit(id);
  }
  public getApplicationParentstatus() {
    return this.applicationParentStatusChange;
  }
  public ChangeNewNotifications(input)
  {
    return this.GetNotifications.emit(input);
  }
  public GetNewNotifications()
  {
    return this.GetNotifications;
  }
  public getapplication(): Observable<any> {
    return this.editapplication;
  }
  public addapplication() {
    this.editapplication.emit("changed");
  }

  public OnChangeOfferId(Input: any) {
    this.OfferChange.emit(Input);
  }
  public getOfferIdChange(): Observable<any> {
    return this.OfferChange;
  }
  public changePermission() {
    this.permissionChange.emit("changed");
  }
   public callheaderpermition() {
    this.headerpermition.emit("changed");
  }

   public getheaderpermition(): Observable<any> {
    return this.headerpermition;
  }

  public deshboardPermissionChange(): Observable<any> {
    return this.permissionChange;
  }
}
