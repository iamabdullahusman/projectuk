import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { EmailTemplateService } from 'src/app/Services/email-template.service';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { ToastrServiceService } from 'src/app/services/toastr-service.service';
import { KanbanService } from 'src/app/Services/kanban.service';

@Component({
  selector: 'app-new-email-template-model',
  templateUrl: './new-email-template-model.component.html',
  styleUrls: ['./new-email-template-model.component.sass']
})
export class NewEmailTemplateModelComponent implements OnInit {
dtOptions: DataTables.Settings = {};
dtOptions1: DataTables.Settings = {};
  emailTemplateType = [];
  selectedPrimaryRoleList = [];
  selectedSecondaryRoleList = [];
  isSubmitted = false;
  variableNameList = [];
  emailTemplateVeriableTypes = [];
  isemailtypesubmitted = false;
  roleList = [];
  PrimaryList = [];
  editor: any;
  isView = false;
  primaryflag = false;
  secondaryflag = false;
  tabIndex = 0;
  @ViewChild("AddEmailFollowup") AddEmailFollowupModal: ElementRef
  @ViewChild("AddEmailFollowupTemplate") AddEmailFollowupTemplate: ElementRef
  primaryEmailForm: FormGroup = new FormGroup({
    Subject: new FormControl(),
    EmailTempName: new FormControl(),
    EmailTemplateId: new FormControl(),
    PrimaryEmailBody: new FormControl(),
    EmailTemplateType: new FormControl(),
    PrimaryRoleIds: new FormArray([]),
  });
  FolloupAddTemplate: FormGroup = new FormGroup({
    Subject: new FormControl(),
    EmailTempName: new FormControl(),
    SubEmailFolloupId: new FormControl(),
    PrimaryEmailBody: new FormControl(),
    EmailTemplateType: new FormControl(),
    WhoRank: new FormControl(),
    ApplicationStatusWhoRank: new FormControl(),
    WhoTime: new FormControl(),
    ApplicationStatusWhoTime: new FormControl(),
    ApplicationType: new FormControl(),
    ApplicationStatus: new FormControl(),
    PrimaryRoleIds: new FormArray([]),
  });
  secondaryEmailForm: FormGroup = new FormGroup({
    Subject: new FormControl(),
    EmailTempName: new FormControl(),
    EmailTemplateId: new FormControl(),
    SecondaryEmailBody: new FormControl(),
    EmailTemplateType: new FormControl(),
    SecondaryRoleIds: new FormArray([]),
  });
  EmailTemplateForm: FormGroup = new FormGroup({
    EmailTemplateTypeId: new FormControl(),
    EmailTemplateTypeName: new FormControl(),
    EmailTemplateTypeTitle: new FormControl(),
  });
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial'
  };



  
  constructor(private router: Router, private arouter: ActivatedRoute,private kanbanService: KanbanService,private alerts: AlertServiceService, private emailTemplateServices: EmailTemplateService, private toastr: ToastrServiceService, private formBuilder: FormBuilder, private modalService: NgbModal) {
    this.primaryEmailForm = formBuilder.group({
      Subject: ['', [Validators.required]],
      EmailTempName: ['', [Validators.required]],
      EmailTemplateId: [0, [Validators.required]],
      PrimaryEmailBody: ['', [Validators.required]],
      EmailTemplateType: [null, [Validators.required]],
      IsPrimary: [true],
      PrimaryRoleIds: formBuilder.array([], [Validators.required])
    });
    this.FolloupAddTemplate = formBuilder.group({
      Subject: ['', [Validators.required]],
      EmailTempName: ['', [Validators.required]],
      SubEmailFolloupId: [0],
      WhoRank: [0, [Validators.required,Validators.pattern(/^\d+$/)]],
      WhoTime: ["", [Validators.required]],
      ApplicationStatusWhoRank: [0, [Validators.pattern(/^\d+$/)]],
      ApplicationStatusWhoTime: [0],
      ApplicationType: [0],
      ApplicationStatus: [0],
      PrimaryEmailBody: ['', [Validators.required]],
      EmailTemplateType: [null, [Validators.required]],
      IsPrimary: [true],
      PrimaryRoleIds: formBuilder.array([], [Validators.required])
    });
    this.secondaryEmailForm = formBuilder.group({
      Subject: ['', [Validators.required]],
      EmailTempName: ['', [Validators.required]],
      EmailTemplateId: [0, [Validators.required]],
      SecondaryEmailBody: ['', [Validators.required]],
      EmailTemplateType: [null, [Validators.required]],
      IsPrimary: [true],
      SecondaryRoleIds: formBuilder.array([], [Validators.required])
    });
    this.EmailTemplateForm = formBuilder.group({
      EmailTemplateTypeId: [0],
      EmailTemplateTypeName: ['', Validators.required],
      EmailTemplateTypeTitle: ['', Validators.required],

    })
  }

  get fp() {
    return this.primaryEmailForm.controls;
  }

  get FFMS() {
    return this.FolloupAddTemplate.controls;
  }

  get fs() {
    return this.secondaryEmailForm.controls;
  }


  EmailFlowUpIdRoute: any;
  EmailFlowUpSubIdRoute: any;

  ngOnInit(): void {
    this.primaryEmailForm.controls.IsPrimary.setValue(true);
    this.secondaryEmailForm.controls.IsPrimary.setValue(false);
    this.loadEmail();
    this.dataset();
    this.loadEmialData();
    this.GetFolloupData();


    this.arouter.paramMap.subscribe((params: ParamMap) => {
          
      // this.EmailFlowUpIdRoute = params.get('Id');
      // this.EmailFlowUpSubIdRoute =  params.get('Stage');
     
    });


    // this.roleList.push({
    //   RoleId: 1,
    //   RoleName: 'Admin',
    // }),
    //   this.roleList.push({
    //     RoleId: 2,
    //     RoleName: 'Admission Departmentmin',
    //   });
    // this.roleList.push({
    //   RoleId: 3,
    //   RoleName: 'Regional manager',
    // });
    // this.roleList.push({
    //   RoleId: 4,
    //   RoleName: 'Agent',
    // });
    // this.roleList.push({
    //   RoleId: 5,
    //   RoleName: 'Student',
    // });
    // this.roleList.push({
    //   RoleId: 6,
    //   RoleName: 'Parent',
    // });
    // this.roleList.push({
    //   RoleId: 7,
    //   RoleName: 'Sponsor',
    // });
    // this.PrimaryList.push({
    //   primaryId: true,
    //   primaryName: 'Primary Email'
    // });
    // this.PrimaryList.push({
    //   primaryId: false,
    //   primaryName: 'Secondary Email'
    // });
  }


  clickEdit(e) {
    this.openLarge(e.target.value, false)
  }
  clickView(e) {
    this.openLarge(e.target.value, false)
  }
  clickDelete(e) {
    this.openLarge(e.target.value, true)
  }

  openLarge(id: any, isView: any) {

  }
Subemails:any;
  loadEmialData() {
    $('#loader').show();

    let input = {
      PageSize: 10,
      StartFrom: 1,
      SearchText: '',
      OrderByDirection: '',
      OrderBy: '',
      EmailTemplateId:0
    }

  
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      responsive: true,
      scrollX: true,
      retrieve: true,
      searching: true,
      order: [2, 'desc'],
      language: {
        infoFiltered: ""
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.Subemails = [];
        input.PageSize = dataTablesParameters.length;
        input.StartFrom = dataTablesParameters.start;
        input.EmailTemplateId = parseInt(this.arouter.snapshot.params.Id);
        input.SearchText = dataTablesParameters.search.value;
        input.OrderByDirection = dataTablesParameters.order[0].dir;
        input.OrderBy = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;

        this.emailTemplateServices.GetGetSubEmailContant(input).subscribe(res => {
          console.log("email template res",res);
          if (res.status) {
            this.Subemails = res.data.records;
          }
          else {
            this.toastr.ErrorToastr("Something went wrong");
          }
          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: this.Subemails
          });


          $('#loader').hide();
        }, (err: any) => {
          $('#loader').hide();
          if (err.status == 401) {
            this.router.navigate(['/'])
          }
          else {
            this.toastr.ErrorToastr("Something went wrong");
          }
        });
      },
      columns: [
          { name: 'emailTemplateName', data: 'emailTemplateName', orderable: true, searchable: true },
        { name: 'subject', data: 'subject', orderable: true, searchable: true },
        // {
        //   name: 'etm.isPrimary', data: 'subType', render: function (data, type, raw) {
        //     if (data != null)
        //       if (data == true)
        //         return "Primary";
        //       else
        //         return "Secondary"
        //     else
        //       return '';
        //   }, orderable: true, searchable: true
        // },
        { name: 'role', data: 'role', orderable: true, searchable: true },
         { name: 'createdBy', data: 'createdBy', orderable: true, searchable: true },
        {
          name: 'createdDate', data: 'createdDate', render: function (data, type, raw) {
            if (data != null)
              return moment(data + 'Z').format('DD/MM/YY hh:mm A')
            else
              return '';
          }, orderable: true, searchable: true
        },
        {
          name: 'subEmailTypeId', data: 'subEmailTypeId', render: function (data, type, raw) {
            if (data) {
              var edit;
              edit = '<button class="me-1 btn btn-success btn-sm fa fa-pencil" onclick="document.getElementById(\'EmailTemplateId\').value=\'' + raw.subEmailTypeId + '\'; document.getElementById(\'editEmailTemplateCall\').click()"></button> <button class="me-1 btn btn-danger btn-sm fa fa-trash" onclick="document.getElementById(\'EmailTemplateId\').value=\'' + raw.subEmailTypeId + '\'; document.getElementById(\'deleteEmailTemplateCall\').click()"></button>'
            }
            return edit;
          }, orderable: false, searchable: false
        },
      ],
      autoWidth: false
    }
    $('#loader').hide();
  }

  addtemplatecount :any = [1];
  addtemplatevalue : any = 1;
  AddNewTempalets(){
    this.addtemplatevalue = this.addtemplatevalue + 1;
      this.addtemplatecount.push(this.addtemplatevalue);
  }
EmailtemplatetypeValue :any= "";
EmailtemplatetypeValues: any =[];
  openaddfollowup(){
    this.FolloupAddTemplate.reset();
    this.selectedPrimaryRoleList = [];
    this.FolloupAddTemplate.get("EmailTemplateType")?.setValue(parseInt(this.arouter.snapshot.params.Id));
    this.addtemplatecount = [1];
    this.addtemplatevalue = 1;
    $("#EmailEventNameId").val(parseInt(this.arouter.snapshot.params.Id));
    this.EmailtemplatetypeValue = parseInt(this.arouter.snapshot.params.Id);
    this.EmailtemplatetypeValues.push(parseInt(this.arouter.snapshot.params.Id));
    this.IsApplicationStatus = false;
    this.modalService.open(this.AddEmailFollowupModal, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: false });
    this.openfolloupbaserole(0);
  }
  deletefollowupTemplates(Id:any){
    //  Id = Id - 1;
     let finditem = this.addtemplatecount.findIndex(A => A == Id);
    this.addtemplatecount.splice(finditem,1);
    
  }
  storeFolloup:any=0;
  IsShowCheckbox:any;
  openaddfollowupTemplate(Id:any){
    this.storeFolloup = Id;
    this.selectedPrimaryRoleList = [];
    this.openfolloupbaserole(Id);
    this.IsApplicationStatus = false;
    if(this.storemaxfolloup == Id){
    this.IsShowCheckbox = true;
    this.IsApplicationStatus = true;
    this.storeislast = true;
    }
    else{
    this.IsShowCheckbox =false;
    this.IsApplicationStatus = false;
    }
    this.modalService.open(this.AddEmailFollowupTemplate, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: false });
    this.FolloupAddTemplate.reset();
    this.FolloupAddTemplate.get("EmailTemplateType")?.setValue(parseInt(this.arouter.snapshot.params.Id));
  }

AllFolloup:any=[];

changeapplicationstatus(Data:any){

}
EditTemplate(Id :any,folloupNumber:any){
this.storeFolloup = folloupNumber;
this.AllFolloup.forEach(element => {
  console.log("allfolloup",element);
    let Data = element.folloupTemplate.find(A => A.subEmailFolloupId == Id)
    if(Data != null && Data != "" && Data !=  undefined){
      this.FolloupAddTemplate.get('SubEmailFolloupId')?.setValue(Data.subEmailFolloupId);
      // this.FolloupAddTemplate.get("EmailTemplateType")?.setValue(Data.emailTemplateType);
      this.FolloupAddTemplate.get("EmailTempName")?.setValue(Data.emailTemplateName);
      this.FolloupAddTemplate.get("Subject")?.setValue(Data.subject);
      this.FolloupAddTemplate.get("PrimaryEmailBody")?.setValue(Data.emailBody);
      this.FolloupAddTemplate.get("IsPrimary")?.setValue(true);
      this.FolloupAddTemplate.get("WhoRank")?.setValue(Data.whoRank);
      this.FolloupAddTemplate.get("ApplicationType")?.setValue(Data.applicationType);
      this.FolloupAddTemplate.get("ApplicationStatus")?.setValue(Data.applicationStatus);
      this.FolloupAddTemplate.get("ApplicationStatusWhoRank")?.setValue(Data.applicationStatusWhoRank);
      this.FolloupAddTemplate.get("ApplicationStatusWhoTime")?.setValue(Data.applicationStatusWhoTime);
      this.FolloupAddTemplate.get("WhoTime")?.setValue(Data.whoTime);
      this.FolloupAddTemplate.get("EmailTemplateType")?.setValue(parseInt(this.arouter.snapshot.params.Id));
      // $("#CheckIsLastFolloup").prop("checked", Data.isLastFolloup);
      this.IsApplicationStatus = Data.isLastFolloup;
      this.changestages(0);
      this.selectedPrimaryRoleList = [];
      this.FolloupRole = []; 
      this.FolloupRole.push({
        roleId: 1,
        roleName: 'Admin',
      }),
        // this.FolloupRole.push({
        //   roleId: 2,
        //   roleName: 'Admission Department',
        // });
      this.FolloupRole.push({
        roleId: 3,
        roleName: 'Regional manager',
      });
      this.FolloupRole.push({
        roleId: 4,
        roleName: 'Agent',
      });
      this.FolloupRole.push({
        roleId: 5,
        roleName: 'Student',
      });
      this.FolloupRole.push({
        roleId: 6,
        roleName: 'Parent',
      });
      this.FolloupRole.push({
        roleId: 7,
        roleName: 'Sponsor',
      });
      

      var primaryRoleIds: FormArray = this.FolloupAddTemplate.get('PrimaryRoleIds') as FormArray;
      Data.roleIds.forEach(ele => {
        console.log("primary role",ele);
        this.selectedPrimaryRoleList.push(ele);
        primaryRoleIds.controls = [];
        primaryRoleIds.controls.push(new FormControl(parseInt(ele)));
      })
      this.FolloupAddTemplate.get('PrimaryRoleIds').updateValueAndValidity();
     this.storeislast = Data.isLastFolloup;
     
    }
  });
  if(this.storemaxfolloup == folloupNumber)
    this.IsShowCheckbox = true;
    else
    this.IsShowCheckbox =false;
    
  this.modalService.open(this.AddEmailFollowupTemplate, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: false });
  if(this.storeislast)
      $("#CheckIsLastFolloup").prop("checked", true);
  else
      $("#CheckIsLastFolloup").prop("checked", false);
}
IsNewAddFolloup:any= false;
storeislast:any=false;
GetFolloupData(){
  this.FolloupAddTemplate.get("EmailTemplateType")?.setValue(parseInt(this.arouter.snapshot.params.Id));
  let input = {
    PageSize: 10,
    StartFrom: 1,
    SearchText: '',
    OrderByDirection: '',
    OrderBy: '',
    EmailTemplateId: parseInt(this.arouter.snapshot.params.Id)
  }

  this.emailTemplateServices.getFolloups(input).subscribe(res => {
    console.log("GetFolloupData",res);
    if (res.status) {
      this.AllFolloup = res.data.records;
      this.AllFolloup.forEach(element => {
        console.log("all folloup", element);
        this.IsNewAddFolloup = element.isLastFolloup;
        this.storemaxfolloup = element.maxFolloup;
      });
    }

  }, (err: any) => {
    if (err.status == 401) {
      this.router.navigate(['/']);
    }
    else {
      this.toastr.ErrorToastr("Something went wrong");
    }
  });
}
  
  WhenList:any= [];
  ApplicationtypeList:any= [];
  storemaxfolloup:any=[];
  loadEmail() {
    this.WhenList.push({"id":1,"name":"Minutes"},{"id":2,"name":"Hours"},{"id":3,"name":"Day"},{"id":4,"name":"Week"},{"id":5,"name":"Month"});
    //this.ApplicationtypeList.push({"id":0,"name":"Inquery"},{"id":1,"name":"Application"},{"id":2,"name":"Document"},{"id":3,"name":"Offer"},{"id":4,"name":"Cas"},{"id":5,"name":"Visa"},{"id":6,"name":"Deposite"},{"id":7,"name":"WelcomeKit"},{"id":8,"name":"AirporArrival"},{"id":9,"name":"CampusArrival"},{"id":10,"name":"Onbording"},{"id":11,"name":"Other"});
    this.emailTemplateServices.getAllNewEmailTemplateType().subscribe(res => {
      console.log("load email",res);
      if (res.status) {
        this.emailTemplateType = res.data;
        let otherData = {
          emailTemplateId: 0,
          emailTemplateName: "other"
        };
        this.emailTemplateType.push(otherData);
      }

    }, (err: any) => {
      if (err.status == 401) {
        this.router.navigate(['/']);
      }
      else {
        this.toastr.ErrorToastr("Something went wrong");
      }
    });

    this.kanbanService.getStages().subscribe(res => {
      console.log("kanban service",res);
      if (res.status) {
        this.ApplicationtypeList = res.data;
      }
    }, (err: any) => {
      if (err.status == 401) {
        this.router.navigate(['/']);
      }
      else {
        this.toastr.ErrorToastr("Something went wrong");
      }
    });

    var input = {
      EmailTemplateId: parseInt(this.arouter.snapshot.params.Id)
    }
     this.emailTemplateServices.EmailRole(input).subscribe(res => {
      console.log("roleList",res);
      if (res.status) {
        this.roleList = res.data;
      }

    }, (err: any) => {
      if (err.status == 401) {
        this.router.navigate(['/'])
      }
      else {
        this.toastr.ErrorToastr("Something went wrong");
      }
    });

   

  }

FolloupRole :any = [];
applicationstages:any = [];
changestages(id:any){
  this.kanbanService.getStagesByPerent({ id: this.StageId ?? 0 }).subscribe(result => {
    console.log("changestages",result);
    if (result.status) {
      this.applicationstages = result.data.subStages;
    }
    $('#loader').hide();
  }, (err: any) => {
    if (err.status == 401) {
    }
    else {
      this.toastr.ErrorToastr("Something went wrong");
    }
    $('#loader').hide();
  });
}

openfolloupbaserole(folloupnumber:any=0){
  var input = {
    EmailTemplateId: parseInt(this.arouter.snapshot.params.Id),
    FolloupNumber:folloupnumber
  }
   this.emailTemplateServices.FolloupEmailRole(input).subscribe(res => {
    console.log("openfolloupbaserole",res);
    if (res.status) {
      this.FolloupRole = res.data;
    }
  }, (err: any) => {
    if (err.status == 401) {
      this.router.navigate(['/'])
    }
    else {
      this.toastr.ErrorToastr("Something went wrong");
    }
  });
}
  addEmailTemplateType: any;
  emailTypeChange(element: any, TemplateTypeModal: any) {
    if (element.emailTemplateId == 0) {
      this.openModal(TemplateTypeModal, 0);
    }
  }
  submitForms() {
    this.savePrimaryEmailTemplates();
    // this.saveSecondaryEmailTemplates();
    if (this.primaryEmailForm.valid) {
     window.location.reload();

    if (this.primaryflag == true && this.secondaryflag == true) {
     // this.router.navigate(['/NewEmailTemplates'], { replaceUrl: true });
     window.location.reload();
    }
  }
    //  this.loadEmail();
    // this.editEmailTemplate();
    // this.loadEmialData();
  }
  savePrimaryEmailTemplates() {
    this.primaryflag = false;
    this.isSubmitted = true;
    if (this.primaryEmailForm.valid) {

      var input = {
        emailTemplateId: this.primaryEmailForm.controls.EmailTemplateId.value,
        emailBody: this.primaryEmailForm.controls.PrimaryEmailBody.value,
        emailTemplateType: this.primaryEmailForm.controls.EmailTemplateType.value,
        subject: this.primaryEmailForm.controls.Subject.value,
        emailTempName: this.primaryEmailForm.controls.EmailTempName.value,
        isPrimary: this.primaryEmailForm.controls.IsPrimary.value,
        roleIds: this.primaryEmailForm.controls.PrimaryRoleIds.value
      };
      this.emailTemplateServices.NewaddEmailTemplateData(input).subscribe(res => {
        console.log("savePrimaryEmailTemplates",res);
        if (res.status) {
          this.toastr.SuccessToastr("Email Template is submitted successfully.");
          this.primaryEmailForm.reset();
          this.primaryflag = true;
        }
        else {
          this.toastr.ErrorToastr(res.data);
        }
        $("#loader").hide();
      }, (err: any) => {
        this.toastr.ErrorToastr("Something missing");
        $("#loader").hide();
      });
    }
    this.primaryflag = true;
  }


  deletefolloup(Id :any){
    this.alerts.ComfirmAlert("Do you want to delete this follow up Template?", "Yes", "No").then(res => {
      console.log("deletefolloup", res);
      if (res.isConfirmed) {
    let input = {
      EmailFollowUpId : Id
    }
    this.emailTemplateServices.DeleteFollloupTemplateData(input).subscribe(res => {
      if (res.status) {
        this.toastr.SuccessToastr("Email Template is deleted successfully.");
        this.FolloupAddTemplate.reset();
        this.storeFolloup = 0;
        this.modalService.dismissAll();
        this.GetFolloupData();
      }
      else {
        this.toastr.ErrorToastr(res.data);
      }
      $("#loader").hide();
    }, (err: any) => {
      this.toastr.ErrorToastr("Something missing");
      $("#loader").hide();
    });
  }
})
  }
  SaveFollloupTemplate() {
    this.isSubmitted = true;
    if (this.FolloupAddTemplate.valid) {
      var input = {
        EmailFollowUpId: this.FolloupAddTemplate.controls.SubEmailFolloupId.value ?? 0,
        emailBody: this.FolloupAddTemplate.controls.PrimaryEmailBody.value,
        emailTemplateType: this.FolloupAddTemplate.controls.EmailTemplateType.value,
        subject: this.FolloupAddTemplate.controls.Subject.value,
        emailTempName: this.FolloupAddTemplate.controls.EmailTempName.value,
        isPrimary: this.FolloupAddTemplate.controls.IsPrimary.value,
        roleIds: this.FolloupAddTemplate.controls.PrimaryRoleIds.value,
        WhoTime: this.FolloupAddTemplate.controls.WhoTime.value,
        WhoRank: this.FolloupAddTemplate.controls.WhoRank.value,
        ApplicationType: this.StageId ?? 0,
        ApplicationStatus: this.FolloupAddTemplate.controls.ApplicationStatus.value ?? 0,
        ApplicationStatusWhoRank: this.FolloupAddTemplate.controls.ApplicationStatusWhoRank.value ?? 0,
        ApplicationStatusWhoTime: this.FolloupAddTemplate.controls.ApplicationStatusWhoTime.value ?? 0,
        FollowUpNumber : this.storeFolloup,
        IsLastFolloup : $("#CheckIsLastFolloup").is(":checked")
      };
      this.emailTemplateServices.SaveFollloupTemplateData(input).subscribe(res => {
        console.log("SaveFollloupTemplateData",res);
        if (res.status) {
          this.toastr.SuccessToastr("Email Template is submitted successfully.");
          this.FolloupAddTemplate.reset();
          this.storeFolloup = 0;
          this.modalService.dismissAll();
          this.GetFolloupData();
        }
        else {
          this.toastr.ErrorToastr(res.data);
        }
        $("#loader").hide();
      }, (err: any) => {
        this.toastr.ErrorToastr("Something missing");
        $("#loader").hide();
      });
    }
    this.primaryflag = true;
  }

  SaveMultipleFolloupTemplate() {
    this.isSubmitted = true;
    let MultipleTemplateList = [];
// this.addtemplatecount.forEach(element => {
//   let follouptemplte = {
//     EmailFollowUpId: 0,
//     emailBody: $("#EmailBody"+element).val(),
//     emailTemplateType: $("#EmailEventNameId"+element).val(),
//     subject: $("#Subject"+element).val(),
//     emailTempName: $("#EmailTemplateName"+element).val(),
//     isPrimary: false,
//     roleIds: $("#whom"+element).val(),
//     WhoTime: $("#WhenTimeFolloup").val(),
//     WhoRank: $("#WhenNumberFolloup").val(),
//     FollowUpNumber : 0
//   }
//   MultipleTemplateList.push(follouptemplte);
// });


if (this.FolloupAddTemplate.valid) {
  var inputData = {
    EmailFollowUpId: this.EmailFlowUpIdRoute,
    SubEmailFolloupId:this.EmailFlowUpSubIdRoute,
    emailBody: this.FolloupAddTemplate.controls.PrimaryEmailBody.value,
    emailTemplateType: this.FolloupAddTemplate.controls.EmailTemplateType.value,
    subject: this.FolloupAddTemplate.controls.Subject.value,
    emailTempName: this.FolloupAddTemplate.controls.EmailTempName.value,
    isPrimary: this.FolloupAddTemplate.controls.IsPrimary.value,
    roleIds: this.FolloupAddTemplate.controls.PrimaryRoleIds.value,
    WhoTime: this.FolloupAddTemplate.controls.WhoTime.value,
    WhoRank: this.FolloupAddTemplate.controls.WhoRank.value,
    ApplicationType: this.StageId ?? 0,
    ApplicationStatus: this.FolloupAddTemplate.controls.ApplicationStatus.value ?? 0,
    ApplicationStatusWhoRank: this.FolloupAddTemplate.controls.ApplicationStatusWhoRank.value ?? 0,
    ApplicationStatusWhoTime: this.FolloupAddTemplate.controls.ApplicationStatusWhoTime.value ?? 0,
    FollowUpNumber : 0,
    IsLastFolloup : $("#CheckIsLastFolloup").is(":checked")
  };
  MultipleTemplateList.push(inputData);
  let Input = {
    EmailFollowUpList : MultipleTemplateList
  }

  console.log("is ki" , Input);
      this.emailTemplateServices.SaveNewMultipleFollloupTemplateData(Input).subscribe(res => {
        console.log("email response",res)
        if (res.status) {
          this.toastr.SuccessToastr("Followup submitted successfully");
          this.FolloupAddTemplate.reset();
          this.storeFolloup = 0;
          this.modalService.dismissAll();
          this.GetFolloupData();
        }
        else {
          this.toastr.ErrorToastr(res.data);
        }
        $("#loader").hide();
      }, (err: any) => {
        this.toastr.ErrorToastr("Something missing");
        $("#loader").hide();
      });
    }
  }
  changetemplate(){
    var primaryRoleIds: FormArray = this.primaryEmailForm.get('PrimaryRoleIds') as FormArray;
    primaryRoleIds.clear();
    this.primaryEmailForm.get('PrimaryRoleIds').updateValueAndValidity();
    this.selectedPrimaryRoleList = [];
  }
  tabClick(event){
    var primaryRoleIds: FormArray = this.primaryEmailForm.get('PrimaryRoleIds') as FormArray;
    primaryRoleIds.clear();
    this.primaryEmailForm.get('PrimaryRoleIds').updateValueAndValidity();
    this.selectedPrimaryRoleList = [];
  }
  IsApplicationStatus:any=false;
  changeCheckIsLastFolloup(ISChecked:any){
    let checked = $("#CheckIsLastFolloup").is(":checked");
    if(checked){
this.IsApplicationStatus= true;
    }else{
this.IsApplicationStatus = false;
    }
  }
StageId:any=0;
  dataset() {
    $("#EmailEventNameId").val(parseInt(this.arouter.snapshot.params.Id));
    this.StageId= parseInt(this.arouter.snapshot.params.Stage);
    this.changestages(0);
    this.primaryEmailForm.get("EmailTemplateType")?.setValue(parseInt(this.arouter.snapshot.params.Id));
    this.FolloupAddTemplate.get("EmailTemplateType")?.setValue(parseInt(this.arouter.snapshot.params.Id));
    
    $('#loader').show();
    // var input = {
    //   EmailTemplateId: parseInt(this.arouter.snapshot.params.Id)
    // }
    // this.emailTemplateServices.getEmailTemplateByTypeData(input).subscribe(res => {
    //   if (res.status) {
    //     $('#loader').hide();
    //     res.data.forEach(element => {
    //       if (element.isPrimary == true) {
    //         // this.primaryEmailForm.get('EmailTemplateId')?.setValue(element.emailTemplateId);
           
    //         // this.primaryEmailForm.get("Subject")?.setValue(element.subject);
    //         // this.primaryEmailForm.get("PrimaryEmailBody")?.setValue(element.emailBody);
    //         // this.primaryEmailForm.get("IsPrimary")?.setValue(true);
    //         // this.selectedPrimaryRoleList = [];
    //         // var primaryRoleIds: FormArray = this.primaryEmailForm.get('PrimaryRoleIds') as FormArray;
    //         // element.roleIds.forEach(ele => {
    //         //   this.selectedPrimaryRoleList.push(ele);
    //         //   primaryRoleIds.controls.push(new FormControl(parseInt(ele)));
    //         // })
    //         // this.primaryEmailForm.get('PrimaryRoleIds').updateValueAndValidity();
    //       } else {
    //         // this.secondaryEmailForm.get('EmailTemplateId')?.setValue(element.emailTemplateId);
    //         this.secondaryEmailForm.get("EmailTemplateType")?.setValue(element.emailTemplateType);
    //         // this.secondaryEmailForm.get("Subject")?.setValue(element.subject);
    //         // this.secondaryEmailForm.get("SecondaryEmailBody")?.setValue(element.emailBody);
    //         // this.secondaryEmailForm.get("IsPrimary")?.setValue(false);
    //         // this.selectedSecondaryRoleList = [];
    //         // var secondaryRoleIds: FormArray = this.secondaryEmailForm.get('SecondaryRoleIds') as FormArray;
    //         // element.roleIds.forEach(ele => {
    //         //   this.selectedSecondaryRoleList.push(ele);
    //         //   secondaryRoleIds.controls.push(new FormControl(parseInt(ele)));
    //         // })
    //         // this.secondaryEmailForm.get('SecondaryRoleIds').updateValueAndValidity();
    //       }
    //     });

    //     if (this.arouter.snapshot.params.action == 'view') {
    //       // this.primaryEmailForm.disable();
    //       // this.secondaryEmailForm.disable();
    //       this.isView = false;
    //     }
    //     else {
    //       this.isView = false;
    //     }
    //     this.config.editable = !this.isView
    //   }
    //   else {
    //     this.toastr.ErrorToastr(res.message);
    //     $('#loader').hide();
    //   }
    // }, (err: any) => {
    //   $('#loader').hide();
    //   if (err.status == 401) {
    //     this.router.navigate(['/']);
    //   }
    //   else {
    //     $('#loader').hide();
    //   }
    // })
  }
  
  primaryRoleChange(event) {
    var primaryRoleIds: FormArray = this.primaryEmailForm.get('PrimaryRoleIds') as FormArray;
    primaryRoleIds.clear();
    event.forEach(ele => {
      primaryRoleIds.controls.push(new FormControl(parseInt(ele.roleId)));
    })
    this.primaryEmailForm.get('PrimaryRoleIds').updateValueAndValidity();
  }

  FolloupRoleChange(event) {
    var primaryRoleIds: FormArray = this.FolloupAddTemplate.get('PrimaryRoleIds') as FormArray;
    primaryRoleIds.clear();
    event.forEach(ele => {
      primaryRoleIds.controls.push(new FormControl(parseInt(ele.roleId)));
    })
    this.FolloupAddTemplate.get('PrimaryRoleIds').updateValueAndValidity();
  }

  saveSecondaryEmailTemplates() {
    this.secondaryflag = false;
    this.isSubmitted = true;
    if (this.secondaryEmailForm.valid) {
      var input = {
        emailTemplateId: this.secondaryEmailForm.controls.EmailTemplateId.value,
        emailBody: this.secondaryEmailForm.controls.SecondaryEmailBody.value,
        emailTemplateType: this.secondaryEmailForm.controls.EmailTemplateType.value,
        subject: this.secondaryEmailForm.controls.Subject.value,
        emailTempName: this.secondaryEmailForm.controls.EmailTempName.value,
        isPrimary: this.secondaryEmailForm.controls.IsPrimary.value,
        roleIds: this.secondaryEmailForm.controls.SecondaryRoleIds.value
      };

      this.emailTemplateServices.NewaddEmailTemplateData(input).subscribe(res => {
        if (res.status) {
          this.toastr.SuccessToastr("Email Template is submitted successfully.");
          this.secondaryEmailForm.reset();
          this.secondaryflag = true;
        }
        else {
          this.toastr.ErrorToastr(res.data);
        }
        $("#loader").hide();
      }, (err: any) => {
        this.toastr.ErrorToastr("Something missing");
        $("#loader").hide();
      });
    }
    this.secondaryflag = true;
  }

  secondaryRoleChange(event) {
    var secondaryRoleIds: FormArray = this.secondaryEmailForm.get('SecondaryRoleIds') as FormArray;
    secondaryRoleIds.clear();
    event.forEach(ele => {
      secondaryRoleIds.controls.push(new FormControl(parseInt(ele.RoleId)));
    })
    this.secondaryEmailForm.get('SecondaryRoleIds').updateValueAndValidity();
  }

  closeemailtemplate() {
    this.alerts.ComfirmAlert("You might have unsaved changes to this email template ?", "Go Back", "Save Changes").then(res => {
      if (res.isConfirmed) {
           this.router.navigate(['/NewEmailTemplates'], { replaceUrl: true });
      }
    });

  }

  resetEmailtemplateForm() {
    this.EmailTemplateForm.get('EmailTemplateTypeTitle')?.setValue('');
    this.EmailTemplateForm.get('EmailTemplateTypeName')?.setValue('');
    this.EmailTemplateForm.get('EmailTemplateTypeId')?.setValue('0');


  }

  modalTitle = 'Add EmailTemplate Type';
  openModal(content: any, id: any = 0) {
    this.EmailTemplateForm.reset();

    this.modalTitle = "Add Email Template Type";
    this.resetEmailtemplateForm();

    this.isSubmitted = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: false });
  }

  SaveEmail() {
    this.isSubmitted = true;
    if (this.EmailTemplateForm.valid) {
      $("loader").show();
      var input = JSON.parse(JSON.stringify(this.EmailTemplateForm.getRawValue()));
      input.EmailTemplateTypeId = parseInt(input.EmailTemplateTypeId);
      this.emailTemplateServices.AddEmailTemplate(input).subscribe(res => {
        if (res.status) {
          this.modalService.dismissAll();

          this.toastr.SuccessToastr("Email added successfully.");
          this.loadEmail();
          this.primaryEmailForm.controls.EmailTemplateType.setValue(res.data.emailTemplateId);
          this.secondaryEmailForm.controls.EmailTemplateType.setValue(res.data.emailTemplateId);

          $(".table").DataTable().ajax.reload();
        }
        else {
          this.toastr.ErrorToastr(res.message);
        }
        $('#loader').hide();
      }, (err: any) => {
        $('#loader').hide();
        this.toastr.ErrorToastr("Something missing");
      })

    }

  }

  get f1() {
    return this.EmailTemplateForm.controls;
  }

   editEmailTemplate() {

this.roleList = [];
    this.roleList.push({
      roleId: 1,
      roleName: 'Admin',
    }),
      // this.roleList.push({
      //   roleId: 2,
      //   roleName: 'Admission Department',
      // });
    this.roleList.push({
      roleId: 3,
      roleName: 'Regional manager',
    });
    this.roleList.push({
      roleId: 4,
      roleName: 'Agent',
    });
    this.roleList.push({
      roleId: 5,
      roleName: 'Student',
    });
    this.roleList.push({
      roleId: 6,
      roleName: 'Parent',
    });
    this.roleList.push({
      roleId: 7,
      roleName: 'Sponsor',
    });
    this.PrimaryList.push({
      primaryId: true,
      primaryName: 'Primary Email'
    });
    this.PrimaryList.push({
      primaryId: false,
      primaryName: 'Secondary Email'
    });

    var input = {
      EmailTemplateId: $("#EmailTemplateId").val()
    }
    this.emailTemplateServices.GetsNewEmailTemplateByTypeData(input).subscribe(res => {
      if (res.status) {
        $('#loader').hide();
        res.data.forEach(element => {
          if (element.isPrimary == true) {
             this.primaryEmailForm.get('EmailTemplateId')?.setValue(element.emailTemplateId);
            this.primaryEmailForm.get("EmailTemplateType")?.setValue(element.emailTemplateType);
            this.primaryEmailForm.get("EmailTempName")?.setValue(element.emailTempName);
            this.primaryEmailForm.get("Subject")?.setValue(element.subject);
            this.primaryEmailForm.get("PrimaryEmailBody")?.setValue(element.emailBody);
            this.primaryEmailForm.get("IsPrimary")?.setValue(true);
            this.selectedPrimaryRoleList = [];

            var primaryRoleIds: FormArray = this.primaryEmailForm.get('PrimaryRoleIds') as FormArray;
            element.roleIds.forEach(ele => {
              this.selectedPrimaryRoleList.push(ele);
              primaryRoleIds.controls = [];
              primaryRoleIds.controls.push(new FormControl(parseInt(ele)));
            })
            this.primaryEmailForm.get('PrimaryRoleIds').updateValueAndValidity();
          } else {
            this.secondaryEmailForm.get('EmailTemplateId')?.setValue(element.emailTemplateId);
            this.secondaryEmailForm.get("EmailTemplateType")?.setValue(element.emailTemplateType);
             this.primaryEmailForm.get("EmailTempName")?.setValue(element.emailTempName);
            this.secondaryEmailForm.get("Subject")?.setValue(element.subject);
            this.secondaryEmailForm.get("SecondaryEmailBody")?.setValue(element.emailBody);
            this.secondaryEmailForm.get("IsPrimary")?.setValue(false);
            this.selectedSecondaryRoleList = [];
            var secondaryRoleIds: FormArray = this.secondaryEmailForm.get('SecondaryRoleIds') as FormArray;
            element.roleIds.forEach(ele => {
              this.selectedSecondaryRoleList.push(ele);
              secondaryRoleIds.controls.push(new FormControl(parseInt(ele)));
            })
            this.secondaryEmailForm.get('SecondaryRoleIds').updateValueAndValidity();
          }
        });

        if (this.arouter.snapshot.params.action == 'view') {
          // this.primaryEmailForm.disable();
          // this.secondaryEmailForm.disable();
          this.isView = false;
        }
        else {
          this.isView = false;
        }
        this.config.editable = !this.isView
      }
      else {
        this.toastr.ErrorToastr(res.message);
        $('#loader').hide();
      }
    }, (err: any) => {
      $('#loader').hide();
      if (err.status == 401) {
        this.router.navigate(['/']);
      }
      else {
        $('#loader').hide();
      }
    })
  }


Reset(){
  window.location.reload();
}

  deleteEmailTemplate() {
    this.alerts.ComfirmAlert("Do you want to delete Email Template?", "Yes", "No").then(res => {
      if (res.isConfirmed) {
        $('#loader').show();
        let deleteInput = {
          EmailTemplateId: $("#EmailTemplateId").val()
        };
        this.emailTemplateServices.NewdeleteEmailTemplate(deleteInput).subscribe(res => {

          if (res.status) {
            this.toastr.SuccessToastr("Email Template deleted successfully.");
            $(".table").DataTable().ajax.reload();
            window.location.reload();
          }
          else {
            this.toastr.ErrorToastr(res.message);
          }
          $('#loader').hide();
        },
          (err: any) => {
            $('#loader').hide();
            if (err.status == 401) {
              this.router.navigate(['/']);
            }
            else {
              this.toastr.ErrorToastr("Something went wrong");
            }
          })
      }
    })
  }

}
