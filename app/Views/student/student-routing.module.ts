import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BaseLayoutComponent } from "src/app/Layout/base-layout/base-layout.component";
import { DashbaordComponent } from "./dashbaord/dashbaord.component";
import { SponsorDashboardComponent } from "./sponsor-dashboard/sponsor-dashboard.component";
import { AgentDashboardComponent } from "./agent-dashboard/agent-dashboard.component";
import { ParentDashboardComponent } from "./parent-dashboard/parent-dashboard.component";
import { ApplicationComponent } from "./application/application.component";
import { DocumentComponent } from "./document/document.component";
import { OfferComponent } from "./offer/offer.component";
import { CasComponent } from "./cas/cas.component";
import { VisaComponent } from "./visa/visa.component";
import { SupportTicketComponent } from "./support-ticket/support-ticket.component";
import { AirrportArrivalComponent } from "./airrport-arrival/airrport-arrival.component";
import { CampusArrivalComponent } from "./campus-arrival/campus-arrival.component";
import { FeeComponent } from "./fee/fee.component";

const routes: Routes = [
  {
    path: "student",
    component: BaseLayoutComponent,
    children: [
      // User Pages
      {
        path: "",
        component: DashbaordComponent,
        data: { extraParameter: "" },
      },
      {
        path: "sponsor/dashboard",
        component: SponsorDashboardComponent,
        data: { extraParameter: "" },
      },
      {
        path: "agent/dashboard",
        component: AgentDashboardComponent,
        data: { extraParameter: "" },
      },
      {
        path: "parent/dashboard",
        component: ParentDashboardComponent,
        data: { extraParameter: "" },
      },
      {
        path: "myapplication",
        component: ApplicationComponent,
        data: { extraParameter: "" },
      },
      {
        path: "document",
        component: DocumentComponent,
        data: { extraParameter: "" },
      },
      {
        path: "offer",
        component: OfferComponent,
        data: { extraParameter: "" },
      },
      {
        path: "cas",
        component: CasComponent,
        data: { extraParameter: "" },
      },
      {
        path: "visa",
        component: VisaComponent,
        data: { extraParameter: "" },
      },
      {
        path: "supportticket",
        component: SupportTicketComponent,
        data: { extraParameter: "" },
      },
      {
        path: "AirportArrival",
        component: AirrportArrivalComponent,
        data: { extraParameter: "" },
      },
      {
        path: "CampusArrival",
        component: CampusArrivalComponent,
        data: { extraParameter: "" },
      },
      {
        path: "fee",
        component: FeeComponent,
        data: { extraParameter: "" },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
