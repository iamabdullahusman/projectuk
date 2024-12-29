import { Component, OnInit } from '@angular/core';
import { EmittService } from 'src/app/Services/emitt.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-student-header',
  templateUrl: './student-header.component.html',
  styleUrls: ['./student-header.component.sass']
})
export class StudentHeaderComponent implements OnInit {

  constructor(private sessionService:SessionStorageService, private emitService:EmittService) { }

  ngOnInit(): void {
  }
  
  get applicationId(){
    return parseInt(this.sessionService.getUserApplicationId());
  }
  eventcall(){
    let input = {
      id: this.applicationId,
      page: 1,
      action: "edit",
    };
    this.emitService.onchangeApplicationId(input);
  }

}
