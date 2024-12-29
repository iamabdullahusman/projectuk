import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmittService } from 'src/app/Services/emitt.service';
import { Socialreference } from 'src/app/models/socialreference.model';
import { ApplicationService } from 'src/app/services/application.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { ToastrServiceService } from 'src/app/services/toastr-service.service';

@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.sass']
})
export class DashbaordComponent implements OnInit {
  userType: any;
  studentName: any;
  permissionMessageImage = false;
  HistoryData: any;
  socialrefform: FormGroup = new FormGroup({
    referenceName: new FormControl(),
    referenceId: new FormControl()
  })
  constructor( private sessionService: SessionStorageService, private formBuilder: FormBuilder, private toastr: ToastrServiceService, private emittService: EmittService, private applicationservices: ApplicationService) {
    this.socialrefform = this.formBuilder.group({
      referenceId: ['0'],
      referenceName: ['', [Validators.required]]
    })
    this.emittService.onChangeAddApplicationbtnHideShow(false);
  }

  ngOnInit(): void {
    this.loadHistory();
  }
  loadHistory() {
    $("#loader").show();
    var Input = {
      id: 0
    }
    this.userType = parseInt(this.sessionService.getUserType());
    if (this.userType > 5 || this.userType == 4) {
      Input.id = parseInt(this.sessionService.getUserApplicationId());
      this.studentName = this.sessionService.GetSessionForApplicationname();
      var userPermission = this.sessionService.getpermission();
      if (userPermission == "true") {
        this.applicationservices.getApplicationHistoryById(Input).subscribe(res => {
          this.HistoryData = res.data;
          $("#loader").hide();
        }, (err: any) => {
          this.toastr.ErrorToastr("Something went wrong");
          console.error(err);
          $("#loader").hide();
        });
      }
      else {
        this.permissionMessageImage = true;
        $('#loader').hide();
      }
    } else {
      this.applicationservices.getApplicationHistoryById(Input).subscribe(res => {
        this.HistoryData = res.data;
        $("#loader").hide();
      }, (err: any) => {
        this.toastr.ErrorToastr("Something went wrong");
        console.error(err);
        $("#loader").hide();
      });
    }
  }
}
