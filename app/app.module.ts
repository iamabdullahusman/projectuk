import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgReduxModule } from '@angular-redux/store';
import { NgRedux, DevToolsExtension } from '@angular-redux/store';
import { rootReducer, ArchitectUIState } from './ThemeOptions/store';
import { ConfigActions } from './ThemeOptions/store/config.actions';
import { AppRoutingModule } from './app-routing.module';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { TrendModule } from 'ngx-trend';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

// BOOTSTRAP COMPONENTS

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
// import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import { ToastrModule } from 'ngx-toastr';
import { SlickCarouselModule } from 'ngx-slick-carousel';
// import { CountUpModule } from 'countup.js-angular2';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { NgSelectModule } from '@ng-select/ng-select';
// import { SelectDropDownModule } from 'ngx-select-dropdown';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';
import { AngularEditorModule } from '@kolkov/angular-editor';
// import { TextMaskModule } from 'angular2-text-mask';
import { TextareaAutosizeModule } from 'ngx-textarea-autosize';

// ANGULAR MATERIAL COMPONENTS

import { MatCheckboxModule } from '@angular/material/checkbox';

// LAYOUT

import { BaseLayoutComponent } from './Layout/base-layout/base-layout.component';
import { AppsLayoutComponent } from './Layout/apps-layout/apps-layout.component';
import { PagesLayoutComponent } from './Layout/pages-layout/pages-layout.component';
import { ThemeOptions } from './theme-options';
// import {PageTitleComponent} from './Layout/Components/page-title/page-title.component';

// HEADER

import { HeaderComponent } from './Layout/Components/header/header.component';
import { UserBoxComponent } from './Layout/Components/header/elements/user-box/user-box.component';

// SIDEBAR

import { SidebarComponent } from './Layout/Components/sidebar/sidebar.component';
import { LogoComponent } from './Layout/Components/sidebar/elements/logo/logo.component';

// FOOTER

import { FooterComponent } from './Layout/Components/footer/footer.component';
import { FooterMenuComponent } from './Layout/Components/footer/elements/footer-menu/footer-menu.component';

// Pages

import { ResetPasswordComponent } from './DemoPages/UserPages/reset-password/reset-password.component';
import { LoginComponent } from './DemoPages/UserPages/login/login.component';
// Components



import { DataTablesModule } from 'angular-datatables';
import { IntakeComponent } from './Views/intake/intake.component';
import { CampusComponent } from './Views/campus/campus.component';
import { CourseComponent } from './Views/course/course.component';
import { StudentInquiryComponent } from './Views/student-inquiry/student-inquiry.component';
import { StudentApplicationComponent } from './Views/student-application/student-application.component';
import { FeepaybyComponent } from './Views/feepayby/feepayby.component';
import { UsersComponent } from './Views/users/users.component';
import { SocialReferenceComponent } from './Views/social-reference/social-reference.component';
import { KanbanComponent } from './Views/kanban/kanban.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTabsModule } from '@angular/material/tabs';
import { ApplicationDashboardComponent } from './Views/application-dashboard/application-dashboard.component';
import { DocumentDashboardComponent } from './Views/document-dashboard/document-dashboard.component';
import { PageTitleModule } from './Layout/Components/page-title/page-title.module';
import { DocumentUploadComponent } from './Views/document-upload/document-upload.component';
import { CapitalizePipe } from './CustomPipes/capitalize';
import { ApplicationDetailsComponent } from './Views/application-details/application-details.component';
import { DashboardComponent } from './Views/dashboard/dashboard.component';
import { VisaComponent } from './Views/visa/visa.component';
import { ApplicationCASIssueComponent } from './Views/application-casissue/application-casissue.component';
import { ApplicationDepositComponent } from './Views/application-deposit/application-deposit.component';
import { ArchiveApplicationsComponent } from './Views/archive-applications/archive-applications.component';
import { CASComponent } from './Views/cas/cas.component';
import { TodoTaskComponent } from './Views/todo-task/todo-task.component';
import { ForgotPasswordComponent } from './DemoPages/UserPages/forgot-password/forgot-password.component';
import { OnboardingComponent } from './Views/onboarding/onboarding.component';
import { EmailtemplatesComponent } from './Views/emailtemplates/emailtemplates.component';
import { EmailTemplateModelComponent } from './Views/email-template-model/email-template-model.component';

import { EmailtemplatestypemasterComponent } from './Views/emailtemplatestypemaster/emailtemplatestypemaster.component';

import { ManageSponcerComponent } from './Views/manage-sponcer/manage-sponcer.component';
import { SponsorRequestComponent } from './Views/sponsor-request/sponsor-request.component';
import { FeeDashboardComponent } from './Views/fee-dashboard/fee-dashboard.component';
import { ConditionMasterComponent } from './Views/condition-master/condition-master.component';
import { CategoryComponent } from './Views/Country/category/category.component';



import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { FeeModelComponent } from './Views/fee-model/fee-model.component';
import { ProfilePageComponent } from './Views/profile-page/profile-page.component';
import { UnConditionOfferKanbanComponent } from './Views/un-condition-offer-kanban/un-condition-offer-kanban.component';
import { SupportTicketComponent } from './Views/support-ticket/support-ticket.component';
import { SupportTicketChatComponent } from './Views/support-ticket-chat/support-ticket-chat.component';
import { NotificationComponent } from './Views/notification/notification.component';
import { NotificationHeaderComponent } from './Layout/Components/header/elements/notification-header/notification-header.component';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { PowerReportComponent } from './Views/power-report/power-report.component';
import { UnivercityDetailComponent } from './Views/univercity-detail/univercity-detail.component';
import { UniversityCourseDetailComponent } from './Views/university-course-detail/university-course-detail.component';
import { NewEmailTemplatesComponent } from './Views/new-email-templates/new-email-templates.component';
import { NewEmailTemplateModelComponent } from './Views/new-email-template-model/new-email-template-model.component';
import { levenshtein } from 'fast-levenshtein';
import { TermComponent } from './Views/term/term.component';
import { SubjectComponent } from './Views/subject/subject.component';
import { GroupComponent } from './Views/group/group.component';
import { TeacherModule } from './Views/teacher/teacher.module';
import { SubjectManagementComponent } from './Views/subject-management/subject-management.component';
import { RoomComponent } from './Views/room/room.component';
import { TimetableModule } from './Views/timetable/timetable.module';
import { TeacherSidebarComponent } from './Layout/Components/sidebar/elements/teacher-sidebar/teacher-sidebar.component';
import { ExamTimetableModule } from './Views/exam-timetable/exam-timetable.module';
import { AdminDashboardComponent } from './Views/admin-dashboard/admin-dashboard.component';
import { NewsAndAnnouncementModule } from './Views/news-and-announcement/news-and-announcement.module';
import { KanbanHeaderComponent } from './Views/kanban-header/kanban-header.component';
import { KanbanCardComponent } from './Views/kanban-card/kanban-card.component';
// import { Documentupload } from './services/documentupload.service/documentupload.service.component';
import { StudentModule } from './Views/student/student.module';
import { AddmissionHeaderComponent } from './Layout/Components/header/elements/addmission-header/addmission-header.component';
import { StudentHeaderComponent } from './Layout/Components/header/elements/student-header/student-header.component';
import { StudentSidebarComponent } from './Layout/Components/sidebar/elements/student-sidebar/student-sidebar.component';
import { VisaKanbanCardComponent } from './Views/visa/visa-kanban-card/visa-kanban-card.component';
import { DashboardKanbanComponent } from './Views/dashboard/dashboard-kanban/dashboard-kanban.component';
import { DashboardKanbanHeaderComponent } from './Views/dashboard/dashboard-kanban-header/dashboard-kanban-header.component';
import { InquiryModelComponent } from './Views/dashboard/inquiry-model/inquiry-model.component';
import { OnboardCardComponent } from './Views/onboarding/onboard-card/onboard-card.component';
// Angular Material

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


@NgModule({
  declarations: [

    // LAYOUT
    CapitalizePipe,
    AppComponent,
    BaseLayoutComponent,
    AppsLayoutComponent,
    PagesLayoutComponent,
    // HEADER

    HeaderComponent,
    UserBoxComponent,

    // SIDEBAR

    SidebarComponent,
    LogoComponent,

    // FOOTER

    FooterComponent,
    FooterMenuComponent,

    // // User Pages
    LoginComponent,
    ResetPasswordComponent,
    // Tables
    IntakeComponent,
    CampusComponent,
    CourseComponent,
    StudentInquiryComponent,
    StudentApplicationComponent,
    FeepaybyComponent,
    UsersComponent,
    SocialReferenceComponent,
    KanbanComponent,
    ApplicationDashboardComponent,
    DocumentDashboardComponent,
    DocumentUploadComponent,
    ApplicationDetailsComponent,
    DashboardComponent,
    VisaComponent,
    ApplicationCASIssueComponent,
    ApplicationDepositComponent,
    ArchiveApplicationsComponent,
    CategoryComponent,
    CASComponent,
    TodoTaskComponent,
    ForgotPasswordComponent,
    OnboardingComponent,
    EmailtemplatesComponent,
    EmailTemplateModelComponent,
    EmailtemplatestypemasterComponent,
    FeeDashboardComponent,

    ManageSponcerComponent,
    SponsorRequestComponent,
    ConditionMasterComponent,
    FeeModelComponent,
    ProfilePageComponent,
    UnConditionOfferKanbanComponent,
    SupportTicketComponent,
    SupportTicketChatComponent,
    NotificationComponent,
    NotificationHeaderComponent,
    PowerReportComponent,
    UnivercityDetailComponent,
    UniversityCourseDetailComponent,
    NewEmailTemplatesComponent,
    NewEmailTemplateModelComponent,
    TermComponent,
    SubjectComponent,
    GroupComponent,
    SubjectManagementComponent,
    RoomComponent,
    TeacherSidebarComponent,
    AdminDashboardComponent,
    KanbanHeaderComponent,
    KanbanCardComponent,

    AddmissionHeaderComponent,
    StudentHeaderComponent,
    StudentSidebarComponent,
    VisaKanbanCardComponent,
    DashboardKanbanComponent,
    DashboardKanbanHeaderComponent,
    InquiryModelComponent,
    OnboardCardComponent,
    
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    NgReduxModule,
    CommonModule,
    DataTablesModule,
    LoadingBarRouterModule,
    DragDropModule,
    MatTabsModule,
    TrendModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatSlideToggleModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    PageTitleModule,

    // Angular Bootstrap Components

    PerfectScrollbarModule,
    NgbModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    NgxIntlTelInputModule,
    NgxDaterangepickerMd.forRoot(),
    NgBootstrapFormValidationModule.forRoot(),
    ToastrModule.forRoot(),
    SlickCarouselModule,
    NgSelectModule,
    // SelectDropDownModule,
    NgMultiSelectDropDownModule.forRoot(),
    JwBootstrapSwitchNg2Module,
    AngularEditorModule,
    HttpClientModule,
    TextareaAutosizeModule,

    // Angular Material Components

    MatCheckboxModule,
    TeacherModule,
    TimetableModule,
    ExamTimetableModule,
    NewsAndAnnouncementModule,
    StudentModule,



    NgbModalModule
  ],
  providers: [
    {
      provide:
        PERFECT_SCROLLBAR_CONFIG,
      // DROPZONE_CONFIG,
      useValue:
        DEFAULT_PERFECT_SCROLLBAR_CONFIG,
      // DEFAULT_DROPZONE_CONFIG,
    },
    ConfigActions,
    ThemeOptions,

  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(private ngRedux: NgRedux<ArchitectUIState>,
    private devTool: DevToolsExtension) {

    this.ngRedux.configureStore(
      rootReducer,
      {} as ArchitectUIState,
      [],
      [this.devTool.isEnabled() ? this.devTool.enhancer() : f => f]
    );

  }
}
