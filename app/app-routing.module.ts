import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BaseLayoutComponent } from "./Layout/base-layout/base-layout.component";
import { PagesLayoutComponent } from "./Layout/pages-layout/pages-layout.component";

// // Pages

import { ResetPasswordComponent } from "./DemoPages/UserPages/reset-password/reset-password.component";
import { LoginComponent } from "./DemoPages/UserPages/login/login.component";
import { IntakeComponent } from "./Views/intake/intake.component";
import { CourseComponent } from "./Views/course/course.component";
import { CampusComponent } from "./Views/campus/campus.component";
import { StudentApplicationComponent } from "./Views/student-application/student-application.component";
import { FeepaybyComponent } from "./Views/feepayby/feepayby.component";
import { StudentInquiryComponent } from "./Views/student-inquiry/student-inquiry.component";
import { UsersComponent } from "./Views/users/users.component";
import { SocialReferenceComponent } from "./Views/social-reference/social-reference.component";
import { KanbanComponent } from "./Views/kanban/kanban.component";
import { ApplicationDashboardComponent } from "./Views/application-dashboard/application-dashboard.component";
import { DocumentDashboardComponent } from "./Views/document-dashboard/document-dashboard.component";
import { DocumentUploadComponent } from "./Views/document-upload/document-upload.component";
import { DashboardComponent } from "./Views/dashboard/dashboard.component";
import { VisaComponent } from "./Views/visa/visa.component";
import { ApplicationCASIssueComponent } from "./Views/application-casissue/application-casissue.component";
import { ApplicationDepositComponent } from "./Views/application-deposit/application-deposit.component";
import { ArchiveApplicationsComponent } from "./Views/archive-applications/archive-applications.component";
import { CASComponent } from "./Views/cas/cas.component";
import { TodoTaskComponent } from "./Views/todo-task/todo-task.component";
import { ForgotPasswordComponent } from "./DemoPages/UserPages/forgot-password/forgot-password.component";
import { OnboardingComponent } from "./Views/onboarding/onboarding.component";
import { EmailtemplatesComponent } from "./Views/emailtemplates/emailtemplates.component";
import { EmailTemplateModelComponent } from "./Views/email-template-model/email-template-model.component";

import { EmailtemplatestypemasterComponent } from "./Views/emailtemplatestypemaster/emailtemplatestypemaster.component";
import { ManageSponcerComponent } from "./Views/manage-sponcer/manage-sponcer.component";
import { SponsorRequestComponent } from "./Views/sponsor-request/sponsor-request.component";
import { FeeDashboardComponent } from "./Views/fee-dashboard/fee-dashboard.component";
import { ConditionMasterComponent } from "./Views/condition-master/condition-master.component";
import { CategoryComponent } from "./Views/Country/category/category.component";
import { FeeModelComponent } from "./Views/fee-model/fee-model.component";
import { ProfilePageComponent } from "./Views/profile-page/profile-page.component";
import { UnConditionOfferKanbanComponent } from "./Views/un-condition-offer-kanban/un-condition-offer-kanban.component";
import { SupportTicketComponent } from "./Views/support-ticket/support-ticket.component";
import { NotificationComponent } from "./Views/notification/notification.component";
import { PowerReportComponent } from "./Views/power-report/power-report.component";
import { UnivercityDetailComponent } from "./Views/univercity-detail/univercity-detail.component";
import { UniversityCourseDetailComponent } from "./Views/university-course-detail/university-course-detail.component";
import { NewEmailTemplatesComponent } from "./Views/new-email-templates/new-email-templates.component";
import { NewEmailTemplateModelComponent } from "./Views/new-email-template-model/new-email-template-model.component";
import { TermComponent } from "./Views/term/term.component";
import { SubjectComponent } from "./Views/subject/subject.component";
import { GroupComponent } from "./Views/group/group.component";
import { SubjectManagementComponent } from "./Views/subject-management/subject-management.component";
import { RoomComponent } from "./Views/room/room.component";
import { AdminDashboardComponent } from "./Views/admin-dashboard/admin-dashboard.component";
import { StudentProfileComponent } from "./Views/student/student-profile/student-profile.component";
import { StudentSidebarComponent } from "./Layout/Components/sidebar/elements/student-sidebar/student-sidebar.component";
import { AirrportArrivalComponent } from "./Views/student/airrport-arrival/airrport-arrival.component";
import { CampusArrivalComponent } from "./Views/student/campus-arrival/campus-arrival.component";
//import { EmailTempletVeriableComponent } from './views/email-templet-veriable/email-templet-veriable.component';

const routes: Routes = [
  {
    path: "",
    component: PagesLayoutComponent,
    children: [
      // User Pages
      {
        path: "pages/login",
        component: LoginComponent,
        data: { extraParameter: "" },
      },
      {
        path: "pages/reset-password",
        component: ResetPasswordComponent,
        data: { extraParameter: "" },
      },
      {
        path: "pages/recoverpassword",
        component: ForgotPasswordComponent,
        data: { extraParameter: "" },
      },
      {
        path: "",
        redirectTo: "pages/login",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "",
    component: BaseLayoutComponent,
    children: [
      {
        path: "course/documents",
        component: DocumentUploadComponent,
        data: { extraParameter: "" },
      },
      {
        path: "course/user",
        component: UsersComponent,
        data: { extraParameter: "" },
      },
      {
        path: "inquiry",
        component: StudentInquiryComponent,
        data: { extraParameter: "" },
      },
      {
        path: "course/intake",
        component: IntakeComponent,
        data: { extraParameter: "" },
      },
      {
        path: "course/course",
        component: CourseComponent,
        data: { extraParameter: "" },
      },
      {
        path: "course/campus",
        component: CampusComponent,
        data: { extraParameter: "" },
      },
      {
        path: "course/studentApplication",
        component: StudentApplicationComponent,
        data: { extraParameter: "" },
      },
      {
        path: "course/feepayby",
        component: FeepaybyComponent,
        data: { extraParameter: "" },
      },
      {
        path: "course/socialreference",
        component: SocialReferenceComponent,
        data: { extraParameter: "" },
      },
      {
        path: "course/term",
        component: TermComponent,
        data: { extraParameter: "" },
      },
      {
        path: "course/subject",
        component: SubjectComponent,
        data: { extraParameter: "" },
      },
      {
        path: "subjectmanagement",
        component: SubjectManagementComponent,
        data: { extraParameter: "" },
      },
      {
        path: "course/group",
        component: GroupComponent,
        data: { extraParameter: "" },
      },
      {
        path: "course/room",
        component: RoomComponent,
        data: { extraParameter: "" },
      },
      {
        path: "application",
        component: KanbanComponent,
        data: { extraParameter: "" },
      },
      {
        path: "document",
        component: DocumentDashboardComponent,
        data: { extraParameter: "" },
      },
      {
        path: "applicationAnalytics",
        component: ApplicationDashboardComponent,
        data: { extraParameter: "" },
      },
      {
        path: "dashboard",
        component: DashboardComponent,
      },
      {
        path: "visa",
        component: VisaComponent,
        data: { extraParameter: "" },
      },
      {
        path: "student/airportArrival",
        component: AirrportArrivalComponent,
        data: { extraParameter: "" },
      },
      {
        path: "student/campusArrival",
        component: CampusArrivalComponent,
        data: { extraParameter: "" },
      },
      {
        path: "onboarding",
        component: OnboardingComponent,
        data: { extraParameter: "" },
      },
      {
        path: "casIssued",
        component: ApplicationCASIssueComponent,
        data: { extraParameter: "" },
      },
      {
        path: "deposit",
        component: ApplicationDepositComponent,
        data: { extraParameter: "" },
      },
      {
        path: "archived",
        component: ArchiveApplicationsComponent,
        data: { extraParameter: "" },
      },
      {
        path: "cas",
        component: CASComponent,
      },
      {
        path: "todoList",
        component: TodoTaskComponent,
        data: { extraParameter: "" },
      },
      {
        path: "EmailTemplates",
        component: EmailtemplatesComponent,
        data: { extraParameter: "" },
      },
      {
        path: "NewEmailTemplates",
        component: NewEmailTemplatesComponent,
        data: { extraParameter: "" },
      },
      {
        path: "Fee",
        component: FeeDashboardComponent,
        data: { extraParameter: "" },
      },
      {
        path: "AddEmailTemplate",
        component: EmailTemplateModelComponent,
        data: { extraParameter: "" },
      },
      {
        path: "EditEmailTemplate/:Id",
        component: EmailTemplateModelComponent,
        data: { extraParameter: "" },
      },
      {
        path: "ViewEmailTemplate/:action/:Id",
        component: EmailTemplateModelComponent,
        data: { extraParameter: "" },
      },
      {
        path: "NewViewEmailTemplate/:action/:Id/:Stage",
        component: NewEmailTemplateModelComponent,
        data: { extraParameter: "" },
      },
      {
        path: "EmailTemplatesTypeMaster",
        component: EmailtemplatestypemasterComponent,
        data: { extraParameter: "" },
      },
      {
        path: "ManageSponsor",
        component: ManageSponcerComponent,
        data: { extraParameter: "" },
      },
      {
        path: "SponsorRequest",
        component: SponsorRequestComponent,
        data: { extraParameter: "" },
      },
      {
        path: "Condition",
        component: ConditionMasterComponent,
        data: { extraParameter: "" },
      },
      {
        path: "Category",
        component: CategoryComponent,
        data: { extraParameter: "" },
      },
      {
        path: "Support",
        component: SupportTicketComponent,
        data: { extraParameter: "" },
      },
      {
        path: "AddFee",
        component: FeeModelComponent,
        data: { extraParameter: "" },
      },
      {
        path: "Univercity",
        component: UnivercityDetailComponent,
        data: { extraParameter: "" },
      },
      {
        path: "Universitycoursedetail",
        component: UniversityCourseDetailComponent,
        data: { extraParameter: "" },
      },
      {
        path: "EditFee/:Id",
        component: FeeModelComponent,
        data: { extraParameter: "" },
      },
      {
        path: "ViewFee/:Id",
        component: FeeModelComponent,
        data: { extraParameter: "" },
      },
      {
        path: "pages/ProfilePage",
        component: ProfilePageComponent,
        data: { extraParameter: "" },
      },
      {
        path: "offer",
        component: UnConditionOfferKanbanComponent,
        data: { extraParameter: "" },
      },
      {
        path: "Notification",
        component: NotificationComponent,
        data: { extraParameter: "" },
        // path: 'UnConditionOfferKanban', component: UnConditionOfferKanbanComponent, data: { extraParameter: '' }
      },
      {
        path: "power/report",
        component: PowerReportComponent,
        data: { extraParameter: "" },
      },
      {
        path: "admin/dashboard",
        component: AdminDashboardComponent,
        data: { extraParameter: "" },
      },
      {
        path: "student/StudentProfile",
        component: StudentProfileComponent,
        data: { extraParameter: "" },
      },

      // {
      //   path: '',
      //   redirectTo: 'dashboards/analytics',
      //   pathMatch: 'full'
      // },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: "enabled",
      anchorScrolling: "enabled",
      relativeLinkResolution: "legacy",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
