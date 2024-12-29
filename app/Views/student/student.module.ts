import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { StudentRoutingModule } from "./student-routing.module";
import { DashbaordComponent } from "./dashbaord/dashbaord.component";
import { SponsorDashboardComponent } from "./sponsor-dashboard/sponsor-dashboard.component";
import { ParentDashboardComponent } from "./parent-dashboard/parent-dashboard.component";
import { AgentDashboardComponent } from "./agent-dashboard/agent-dashboard.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DataTablesModule } from "angular-datatables";
import { ApplicationComponent } from "./application/application.component";
import { DocumentComponent } from "./document/document.component";
import { MatTabsModule } from "@angular/material/tabs";
import { ReactiveFormsModule } from "@angular/forms";
import { OfferComponent } from "./offer/offer.component";
import { OfferDocumentComponent } from './offer/offer-document/offer-document.component';
import { NgSelectModule } from "@ng-select/ng-select";
import { CasComponent } from './cas/cas.component';
import { VisaComponent } from './visa/visa.component';
import { StudentProfileComponent } from "./student-profile/student-profile.component";
import { SupportTicketComponent } from './support-ticket/support-ticket.component';
import { SupportTicketChatComponent } from './support-ticket-chat/support-ticket-chat.component';
import { CampusArrivalComponent } from './campus-arrival/campus-arrival.component';
import { AirrportArrivalComponent } from './airrport-arrival/airrport-arrival.component';
import { FeeComponent } from './fee/fee.component';
@NgModule({
  declarations: [
    DashbaordComponent,
    SponsorDashboardComponent,
    ParentDashboardComponent,
    AgentDashboardComponent,
    ApplicationComponent,
    DocumentComponent,
    OfferComponent,
    OfferDocumentComponent,
    CasComponent,
    VisaComponent,
    StudentProfileComponent,
    SupportTicketComponent,
    SupportTicketChatComponent,
    CampusArrivalComponent,
    AirrportArrivalComponent,
    FeeComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    NgbModule,
    DataTablesModule,
    MatTabsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
})
export class StudentModule {}
