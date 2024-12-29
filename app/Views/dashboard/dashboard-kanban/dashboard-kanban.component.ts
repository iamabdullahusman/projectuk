import {
  Component,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { DashboardService } from "src/app/Services/dashboard.service";
import { EmittService } from "src/app/Services/emitt.service";
import { SessionStorageService } from "src/app/Services/session-storage.service";
import { DashboardStatus } from "../dashboard-status";
import { DatetimeService } from "src/app/Services/datetime.service";
import dayjs from "dayjs";

@Component({
  selector: "app-dashboard-kanban",
  templateUrl: "./dashboard-kanban.component.html",
  styleUrls: ["./dashboard-kanban.component.sass"],
})
export class DashboardKanbanComponent implements OnChanges {
  @Input() filters: any;
  headerCampusId: number = 0;
  headerIntakeId: number = 0;
  skipdata = 0;
  skipappdata: number;
  skiparchidata: number;
  skipofferdata: number;
  skiponboardata: number;
  skipInquiry: number;
  applicationDashboardData: any;
  visaDashboardData: any;
  archivedDashboardData: any;
  studentOnboardedDashboardData: any;
  inquiryDashboardData: any;
  conditionOfferDashboardData: any;
  unConditionOfferDashboardData: any;
  requestFrom = "dashboard";
  isMaxApplication: boolean;
  isVisaCall: boolean;
  InquiryCall: any;
  isArchiveCall: boolean;
  isAppCall: boolean;
  isOnbaordCall: boolean;
  isofferCall: boolean;
  inquiriesStatuses: Array<DashboardStatus> = [];
  applicationsStatuses: Array<DashboardStatus> = [];
  conditionOfferStatuses: Array<DashboardStatus> = [];
  unConditionOfferStatuses: Array<DashboardStatus> = [];
  visaStatuses: Array<DashboardStatus> = [];
  onBoardingStatuses: Array<DashboardStatus> = [];
  archiveStatuses: Array<DashboardStatus> = [];
  inquiryId = 0;
  constructor(
    private sessionUser: SessionStorageService,
    private dashboardService: DashboardService,
    private emitService: EmittService,
    private dateTimeService: DatetimeService
  ) {
    emitService.GetCampusIntakeChange().subscribe((res) => {
      this.headerCampusId = res.campusId;
      this.headerIntakeId = res.intakeId;
      this.loadData();
    });
    emitService.getapplicationChange().subscribe((res) => {
      if (this.requestFrom == res) this.loadData();
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["filters"]) {
      this.loadData();
    }
  }

  @HostListener("scroll", ["$event"])
  scollhandler(event) {
    let AppliedDatestartDate = null;
    let AppliedDateendDate = null;
    if (this.filters.AppliedDate == null) AppliedDatestartDate = null;
    else AppliedDatestartDate = dayjs(this.filters.AppliedDate.startDate).toDate();
    if (this.filters.AppliedDate == null) AppliedDateendDate = null;
    else AppliedDateendDate = dayjs(this.filters.AppliedDate.endDate).toDate();

    this.isMaxApplication = false;

    if (this.skipdata >= this.visaDashboardData.applicationCount) {
      this.isMaxApplication = true;
    }
    if (event.deltaY > 0 && !this.isMaxApplication && !this.isVisaCall) {
      this.isVisaCall = true;
      var input = {
        ...this.filters,
        AppliedStartDate: AppliedDatestartDate,
        AppliedEndDate: AppliedDateendDate,
        campusId: this.headerCampusId,
        intakeId: this.headerIntakeId,
        skip: this.skipdata,
        take: 2,
      };

      this.dashboardService.getVisaApplication(input).subscribe((res: any) => {
        this.isVisaCall = false;
        if (res.status) {
          this.visaDashboardData.visa = this.visaDashboardData.visa.concat(
            res.data.visa
          );
          this.skipdata += 2;
        }
      });
    }
  }

  loadData() {
    this.headerCampusId =
      this.headerCampusId == 0 || this.headerCampusId == null
        ? parseInt(this.sessionUser.getCampusId())
        : this.headerCampusId;
    this.headerIntakeId =
      this.headerIntakeId == 0 || this.headerIntakeId == null
        ? parseInt(this.sessionUser.getIntakeId())
        : this.headerIntakeId;
    $("#loader").show();
    let AppliedDatestartDate = null;
    let AppliedDateendDate = null;
    if (this.filters.AppliedDate == null) AppliedDatestartDate = null;
    else AppliedDatestartDate = this.dateTimeService.setWriteOffset(dayjs(this.filters.AppliedDate.startDate).toDate());
    if (this.filters.AppliedDate == null) AppliedDateendDate = null;
    else AppliedDateendDate = this.dateTimeService.setWriteOffset(dayjs(this.filters.AppliedDate.endDate).toDate());
    this.skipappdata = 0;
    var input = {
      ...this.filters,
      StageId: 1,
      CampusId: parseInt(this.sessionUser.getCampusId()),
      IntakeId: parseInt(this.sessionUser.getIntakeId()),
      AppliedStartDate: AppliedDatestartDate,
      AppliedEndDate: AppliedDateendDate,
      Skip: null,
      Take: 10,
      RequestType: 0,
    };
    var dataServiceRequest = this.dashboardService.getApplicationByStage(input);
    dataServiceRequest.subscribe((result) => {
      console.log("loadData",result);
      this.inquiriesStatuses = [];
      this.applicationsStatuses = [];
      this.unConditionOfferStatuses = [];
      this.conditionOfferStatuses = [];
      this.visaStatuses = [];
      this.onBoardingStatuses = [];
      this.archiveStatuses = [];
  
      $("#loader").hide();
      this.skipdata = 10;
      this.skipappdata = 10;
      this.skiparchidata = 10;
      this.skipofferdata = 10;
      this.skiponboardata = 10;
      this.skipInquiry = 10;
      this.applicationDashboardData = result.data.applicationDashbaord;
      this.visaDashboardData = result.data.visaDashbaord;
      this.archivedDashboardData = result.data.archiveDashbaord;
      this.studentOnboardedDashboardData = result.data.studentOnBoardDashbaord;
      this.inquiryDashboardData = result.data.inquiryDashbaord;
      this.conditionOfferDashboardData = result.data.conditionOfferDashbaord;
      this.unConditionOfferDashboardData =
        result.data.unConditionOfferDashbaord;
      this.inquiriesStatuses.push({
        name: "NEW",
        count: this.inquiryDashboardData.totalNew,
      });
      this.inquiriesStatuses.push({
        name: "CLOSED",
        count: this.inquiryDashboardData.totalclosed,
      });

      this.applicationsStatuses.push({
        name: "IN-PROGRESS",
        count: this.applicationDashboardData.totalInProgress,
      });
      this.applicationsStatuses.push({
        name: "NEW",
        count: this.applicationDashboardData.totalReceive,
      });
      this.applicationsStatuses.push({
        name: "SEEN",
        count: this.applicationDashboardData.totalSeen,
      });
      this.applicationsStatuses.push({
        name: "RECEIVED",
        count: this.applicationDashboardData.totalApprove,
      });

      this.visaStatuses.push({
        name: "PREPARATION",
        count: this.visaDashboardData.totalPrepairation,
      });
      this.visaStatuses.push({
        name: "AWAITING",
        count: this.visaDashboardData.totalAwaiting,
      });
      this.visaStatuses.push({
        name: "GRANTED",
        count: this.visaDashboardData.totalGranted,
      });
      this.visaStatuses.push({
        name: "REFUSED",
        count: this.visaDashboardData.totalRefused,
      });

      this.onBoardingStatuses.push({
        name: "welcomeKit",
        count: this.studentOnboardedDashboardData.totalWelcomekit,
      });
      this.onBoardingStatuses.push({
        name: "Arrival",
        count: this.studentOnboardedDashboardData.totalArrival,
      });
      this.onBoardingStatuses.push({
        name: "Campus",
        count: this.studentOnboardedDashboardData.totalCampusArrival,
      });
      this.onBoardingStatuses.push({
        name: "Register",
        count: this.studentOnboardedDashboardData.totalDocs,
      });

      this.archiveStatuses.push({
        name: "ON HOLD",
        count: this.archivedDashboardData.totalOnHold,
      });
      this.archiveStatuses.push({
        name: "REJECTED",
        count: this.archivedDashboardData.totalRejected,
      });
      this.archiveStatuses.push({
        name: "WITHDRAWN",
        count: this.archivedDashboardData.totalWithdrawn,
      });

      this.unConditionOfferStatuses.push({
        name: "ISSUED",
        count: this.unConditionOfferDashboardData.totalPending,
      });
      this.unConditionOfferStatuses.push({
        name: "ACCEPT BY STUDENT",
        count: this.unConditionOfferDashboardData.totalApprove,
      });
      this.unConditionOfferStatuses.push({
        name: "DECLINED",
        count: this.unConditionOfferDashboardData.totalDeclined,
      });

      this.conditionOfferStatuses.push({
        name: "ISSUED",
        count: this.conditionOfferDashboardData.totalPending,
      });
      this.conditionOfferStatuses.push({
        name: "ACCEPT BY STUDENT",
        count: this.conditionOfferDashboardData.totalApprove,
      });
      this.conditionOfferStatuses.push({
        name: "DECLINED",
        count: this.conditionOfferDashboardData.totalDeclined,
      });
    });
  }

  scollOfferApplication(event, offerType) {
    let AppliedDatestartDate = null;
    let AppliedDateendDate = null;
    if (this.filters.AppliedDate == null) AppliedDatestartDate = null;
    else AppliedDatestartDate = this.dateTimeService.setWriteOffset(dayjs(this.filters.AppliedDate.startDate).toDate());
    if (this.filters.AppliedDate == null) AppliedDateendDate = null;
    else AppliedDateendDate = this.dateTimeService.setWriteOffset(dayjs(this.filters.AppliedDate.endDate).toDate());

    this.isMaxApplication = false;
    if (offerType == 1) {
      if (
        this.skipofferdata >= this.conditionOfferDashboardData.applicationCount
      ) {
        this.isMaxApplication = true;
      }
      if (event.deltaY > 0 && !this.isMaxApplication && !this.isofferCall) {
        this.isofferCall = true;
        var input = {
          ...this.filters,
          AppliedStartDate: AppliedDatestartDate,
          AppliedEndDate: AppliedDateendDate,
          campusId: this.headerCampusId,
          intakeId: this.headerIntakeId,
          skip: this.skipofferdata,
          take: 2,
        };

        this.dashboardService
          .getOfferApplication(input)
          .subscribe((res: any) => {
            if (res.status) {
              this.isofferCall = false;
              //for (let i = 0; i < res.data.visa.length; i++) {
              this.conditionOfferDashboardData.offers =
                this.conditionOfferDashboardData.offers.concat(res.data.offers);
              this.skipofferdata += 2;
              //}
            }
          });
      }
    } else {
      if (
        this.skipofferdata >=
        this.unConditionOfferDashboardData.applicationCount
      ) {
        this.isMaxApplication = true;
      }
      if (event.deltaY > 0 && !this.isMaxApplication && !this.isofferCall) {
        this.isofferCall = true;
        var input = {
          ...this.filters,
          AppliedStartDate: AppliedDatestartDate,
          AppliedEndDate: AppliedDateendDate,
          campusId: this.headerCampusId,
          intakeId: this.headerIntakeId,
          skip: this.skipofferdata,
          take: 2,
        };

        this.dashboardService
          .getOfferApplication(input)
          .subscribe((res: any) => {
            if (res.status) {
              this.isofferCall = false;
              //for (let i = 0; i < res.data.visa.length; i++) {
              this.unConditionOfferDashboardData.offers =
                this.unConditionOfferDashboardData.offers.concat(
                  res.data.studentOnboard
                );
              this.skipofferdata += 2;
              //}
            }
          });
      }
    }
  }
  scollOnboardApplication(event) {
    let AppliedDatestartDate = null;
    let AppliedDateendDate = null;
    if (this.filters.AppliedDate == null) AppliedDatestartDate = null;
    else AppliedDatestartDate = this.dateTimeService.setWriteOffset(dayjs(this.filters.AppliedDate.startDate).toDate());
    if (this.filters.AppliedDate == null) AppliedDateendDate = null;
    else AppliedDateendDate = this.dateTimeService.setWriteOffset(dayjs(this.filters.AppliedDate.endDate).toDate());

    this.isMaxApplication = false;
    if (
      this.skiponboardata >= this.studentOnboardedDashboardData.applicationCount
    ) {
      this.isMaxApplication = true;
    }
    if (event.deltaY > 0 && !this.isMaxApplication && !this.isOnbaordCall) {
      this.isOnbaordCall = true;
      var input = {
        ...this.filters,
        AppliedStartDate: AppliedDatestartDate,
        AppliedEndDate: AppliedDateendDate,
        campusId: this.headerCampusId,
        intakeId: this.headerIntakeId,
        skip: this.skiponboardata,
        take: 2,
      };

      this.dashboardService
        .getOnBoardApplicationScroll(input)
        .subscribe((res: any) => {
          this.isOnbaordCall = false;
          if (res.status) {
            //for (let i = 0; i < res.data.visa.length; i++) {
            this.studentOnboardedDashboardData.studentOnboard =
              this.studentOnboardedDashboardData.studentOnboard.concat(
                res.data.studentOnboard
              );
            this.skiponboardata += 2;
            //}
          }
        });
    }
  }

  scollApplication(event) {
    let AppliedDatestartDate = null;
    let AppliedDateendDate = null;
    if (this.filters.AppliedDate == null) AppliedDatestartDate = null;
    else AppliedDatestartDate = this.dateTimeService.setWriteOffset(dayjs(this.filters.AppliedDate.startDate).toDate());
    if (this.filters.AppliedDate == null) AppliedDateendDate = null;
    else AppliedDateendDate = this.dateTimeService.setWriteOffset(dayjs(this.filters.AppliedDate.endDate).toDate());

    this.isMaxApplication = false;
    if (this.skipappdata >= this.applicationDashboardData.applicationCount) {
      this.isMaxApplication = true;
    }
    if (event.deltaY > 0 && !this.isMaxApplication && !this.isAppCall) {
      this.isAppCall = true;
      var input = {
        ...this.filters,
        AppliedStartDate: AppliedDatestartDate,
        AppliedEndDate: AppliedDateendDate,
        campusId: this.headerCampusId,
        intakeId: this.headerIntakeId,
        skip: this.skipappdata,
        take: 2,
      };

      this.dashboardService
        .getApplicationonScroll(input)
        .subscribe((res: any) => {
          this.isAppCall = false;
          if (res.status) {
            //for (let i = 0; i < res.data.visa.length; i++) {
            this.applicationDashboardData.applications =
              this.applicationDashboardData.applications.concat(
                res.data.applications
              );
            this.skipappdata += 2;
            //}
          }
        });
    }
  }
  scollArchieveApplication(event) {
    let AppliedDatestartDate = null;
    let AppliedDateendDate = null;
    if (this.filters.AppliedDate == null) AppliedDatestartDate = null;
    else AppliedDatestartDate = this.dateTimeService.setWriteOffset(dayjs(this.filters.AppliedDate.startDate).toDate());
    if (this.filters.AppliedDate == null) AppliedDateendDate = null;
    else AppliedDateendDate = this.dateTimeService.setWriteOffset(dayjs(this.filters.AppliedDate.endDate).toDate());

    this.isMaxApplication = false;
    if (this.skiparchidata >= this.archivedDashboardData.applicationCount) {
      this.isMaxApplication = true;
    }
    if (event.deltaY > 0 && !this.isMaxApplication && !this.isArchiveCall) {
      this.isArchiveCall = true;
      var input = {
        ...this.filters,
        AppliedStartDate: AppliedDatestartDate,
        AppliedEndDate: AppliedDateendDate,
        campusId: this.headerCampusId,
        intakeId: this.headerIntakeId,
        skip: this.skiparchidata,
        take: 2,
      };

      this.dashboardService.getArchiveonScroll(input).subscribe((res: any) => {
        this.isArchiveCall = false;
        if (res.status) {
          //for (let i = 0; i < res.data.visa.length; i++) {
          this.archivedDashboardData.archives =
            this.archivedDashboardData.archives.concat(res.data.archives);
          this.skiparchidata += 2;
          //}
        }
      });
    }
  }

  scollInquiryApplication(event) {
    let AppliedDatestartDate = null;
    let AppliedDateendDate = null;
    if (this.filters.AppliedDate == null) AppliedDatestartDate = null;
    else AppliedDatestartDate = this.dateTimeService.setWriteOffset(dayjs(this.filters.AppliedDate.startDate).toDate());
    if (this.filters.AppliedDate == null) AppliedDateendDate = null;
    else AppliedDateendDate = this.dateTimeService.setWriteOffset(dayjs(this.filters.AppliedDate.endDate).toDate());

    this.isMaxApplication = false;
    if (this.skipInquiry >= this.archivedDashboardData.applicationCount) {
      this.isMaxApplication = true;
    }
    if (event.deltaY > 0 && !this.isMaxApplication && !this.InquiryCall) {
      this.InquiryCall = true;
      var input = {
        ...this.filters,
        AppliedStartDate: AppliedDatestartDate,
        AppliedEndDate: AppliedDateendDate,
        campusId: this.headerCampusId,
        intakeId: this.headerIntakeId,
        skip: this.skipInquiry,
        take: 2,
      };

      this.dashboardService
        .GetInquiriesOnScroll(input)
        .subscribe((res: any) => {
          this.InquiryCall = false;
          if (res.status) {
            //for (let i = 0; i < res.data.visa.length; i++) {
            this.inquiryDashboardData.inquiryDetails =
              this.inquiryDashboardData.inquiryDetails.concat(
                res.data.inquiryDetails
              );
            this.skipInquiry += 2;
            //}
          }
        });
    }
  }

  openLarge(id: any) {
    this.inquiryId = id;
  }

  getApplication(id: any) {
    $("#loader").show();
    let input = {
      id: id,
      page: "dashboard",
      action: "view",
    };
    $("#loader").hide();
    this.emitService.onchangeApplicationId(input);
    this.emitService.changeApplicationParentstatus(1);
  }
}
