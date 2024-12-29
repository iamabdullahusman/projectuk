import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { AccountService } from "src/app/Services/account.service";
import { EmittService } from "src/app/Services/emitt.service";
import { SessionStorageService } from "src/app/services/session-storage.service";

@Component({
  selector: "app-student-sidebar",
  templateUrl: "./student-sidebar.component.html",
  styleUrls: ["./student-sidebar.component.sass"],
})
export class StudentSidebarComponent implements OnInit {
  public config: PerfectScrollbarConfigInterface = {};
  public applicationId=0;
  haseVisa: any;
  OnBoardStatus: number = 0;
  conditional: string = 'true';
  hasDepositFees: any;
  hasCASIssue: any;
  hasArriveAirport: any;
  userType: any = '';
  hasOffer: any;
  permissionMessageImage = false;
  studentName: any;
  
  constructor(
    private router: Router,
    private sessionService: SessionStorageService,
    private emittService: EmittService,
    private AccountService: AccountService
  ) {
    emittService.deshboardPermissionChange().subscribe(res => {
      this.applicationId = parseInt(this.sessionService.getUserApplicationId());
      if (this.applicationId > 0)
        this.UpdateAssigntask();

    });
  }

  ngOnInit(): void {
    this.UpdateAssigntask();
  }
  UpdateAssigntask() {
    let input = {
      ApplicationId: 0
    }
    this.userType = parseInt(this.sessionService.getUserType());
    this.conditional = this.sessionService.getConditional()|| 'false';
    if (this.userType > 5 || this.userType == 4) {
      input.ApplicationId = parseInt(this.sessionService.getUserApplicationId());
      this.studentName = this.sessionService.GetSessionForApplicationname();
      this.AccountService.StudentSidebarSettings(input).subscribe(res => {
        console.log("Response is if ", res);
        if (res.status) {
          this.hasOffer = res.data.hasOffer;
          this.haseVisa = res.data.hasVisa;
          this.hasDepositFees = res.data.hasDepositFees;
          this.hasCASIssue = res.data.hasCASIssue;
          this.hasArriveAirport = res.data.hasArriveAirport;
          this.OnBoardStatus = res.data.campusArrival;
        }
      });
    }
    else {
      this.AccountService.StudentSidebarSettings(input).subscribe(res => {
        console.log("Response is else ", res);
        if (res.status) {
          this.hasOffer = res.data.hasOffer;
          this.haseVisa = res.data.hasVisa;
          this.hasDepositFees = res.data.hasDepositFees;
          this.hasCASIssue = res.data.hasCASIssue;
          this.hasArriveAirport = res.data.hasArriveAirport;
          this.OnBoardStatus = res.data.campusArrival;
        }
      });
    }
  }
}
