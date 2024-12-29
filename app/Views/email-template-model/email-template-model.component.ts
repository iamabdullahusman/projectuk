import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailTemplateService } from 'src/app/Services/email-template.service';
import { ToastrServiceService } from 'src/app/services/toastr-service.service';

@Component({
  selector: 'app-email-template-model',
  templateUrl: './email-template-model.component.html',
  styleUrls: ['./email-template-model.component.sass']
})

export class EmailTemplateModelComponent implements OnInit {
  //dtOptions: DataTables.Settings = {};
  emailTemplateType = [];
  selectedPrimaryRoleList = [];
  selectedSecondaryRoleList = [];
  isSubmitted = false;
  variableNameList = [];
  emailTemplateVeriableTypes = [];
  isemailtypesubmitted = false;
  roleList = [];
  PrimaryList = [];
  // htmlContent = '';
  editor: any;
  isView = false;
  primaryflag = false;
  secondaryflag = false;
  tabIndex = 0;
  primaryEmailForm: FormGroup = new FormGroup({
    Subject: new FormControl(),
    EmailTemplateId: new FormControl(),
    PrimaryEmailBody: new FormControl(),
    EmailTemplateType: new FormControl(),
    PrimaryRoleIds: new FormArray([]),
  });
  secondaryEmailForm: FormGroup = new FormGroup({
    Subject: new FormControl(),
    EmailTemplateId: new FormControl(),
    SecondaryEmailBody: new FormControl(),
    EmailTemplateType: new FormControl(),
    SecondaryRoleIds: new FormArray([]),
  });
  EmailTemplateForm: FormGroup = new FormGroup({
    EmailTemplateTypeId: new FormControl(),
    EmailTemplateTypeName: new FormControl(),
    EmailTemplateTypeTitle: new FormControl(),
    //variables: new FormControl(),

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

  constructor(private router: Router, private arouter: ActivatedRoute, private emailTemplateServices: EmailTemplateService, private toastr: ToastrServiceService, private formBuilder: FormBuilder, private modalService: NgbModal) {
    this.primaryEmailForm = formBuilder.group({
      Subject: ['', [Validators.required]],
      EmailTemplateId: [0, [Validators.required]],
      PrimaryEmailBody: ['', [Validators.required]],
      EmailTemplateType: [null, [Validators.required]],
      // IsPrimary: [true, [Validators.required]],
      IsPrimary: [true],
      PrimaryRoleIds: formBuilder.array([], [Validators.required])
    });
    this.secondaryEmailForm = formBuilder.group({
      Subject: ['', [Validators.required]],
      EmailTemplateId: [0, [Validators.required]],
      SecondaryEmailBody: ['', [Validators.required]],
      EmailTemplateType: [null, [Validators.required]],
      // IsPrimary: [true, [Validators.required]],
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
  get fs() {
    return this.secondaryEmailForm.controls;
  }

  ngOnInit(): void {
    this.primaryEmailForm.controls.IsPrimary.setValue(true);
    this.secondaryEmailForm.controls.IsPrimary.setValue(false);
    this.loadEmail();
    this.editEmailTemplate();
    this.roleList.push({
      RoleId: 1,
      RoleName: 'Admin',
    }),
      // this.roleList.push({
      //   RoleId: 2,
      //   RoleName: 'Admission Departmentmin',
      // });
    this.roleList.push({
      RoleId: 3,
      RoleName: 'Regional manager',
    });
    this.roleList.push({
      RoleId: 4,
      RoleName: 'Agent',
    });
    this.roleList.push({
      RoleId: 5,
      RoleName: 'Student',
    });
    this.roleList.push({
      RoleId: 6,
      RoleName: 'Parent',
    });
    this.roleList.push({
      RoleId: 7,
      RoleName: 'Sponsor',
    });
    this.PrimaryList.push({
      primaryId: true,
      primaryName: 'Primary Email'
    });
    this.PrimaryList.push({
      primaryId: false,
      primaryName: 'Secondary Email'
    });
  }

  // clickOnButton(editor, VeriableName) {
  //   //editor.editorService.insertHtml("{{ Veriable.variableName }}");
  //   editor.editorService.insertHtml(VeriableName);
  // }

  // openDocModal() {
  //   this.loadEmail(Input);
  //   //this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: false, size: 'xl' });
  // }



  clickEdit(e) {
    this.openLarge(e.target.value, false)
  }
  clickView(e) {
    this.openLarge(e.target.value, true)
  }
  clickDelete(e) {
    this.openLarge(e.target.value, true)
  }

  openLarge(id: any, isView: any) {

  }

  loadEmail() {
    this.emailTemplateServices.getAllEmailTemplateType().subscribe(res => {
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
        this.router.navigate(['/'])
      }
      else {
        this.toastr.ErrorToastr("Something went wrong");
      }
    });
  }

  // emailTypeChange(emailTemplateId: any) {
  //   // this.variableNameList = emailTemplateId.emailTemplateVeriableTypes;
  //   // this.emailTemplateType.find(x => x.emailTemplateId == emailTemplateId);
  //   //var veriablesList = emailTemplateId.emailTemplateVeriableTypes
  // }

  addEmailTemplateType: any;
  emailTypeChange(element: any, TemplateTypeModal: any) {
    if (element.emailTemplateId == 0) {
      this.openModal(TemplateTypeModal, 0);
      // var formValaa = JSON.parse(JSON.stringify(this.emailForm.getRawValue()));
      // this.f.EmailTemplateType.setValue = formValaa.EmailTemplateId;
      // this.addEmailTemplateType = formValaa.EmailTemplateId;
    }
  }
  submitForms() {
    // $("#primaryEmailTemplatebtn").click();
    this.savePrimaryEmailTemplates();
    // $("#secondaryEmailTemplatebtn").click();
    this.saveSecondaryEmailTemplates();
    if (this.primaryflag == true && this.secondaryflag == true) {
      this.router.navigate(['/EmailTemplates'], { replaceUrl: true });
    }
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
        isPrimary: this.primaryEmailForm.controls.IsPrimary.value,
        roleIds: this.primaryEmailForm.controls.PrimaryRoleIds.value
      };
      this.emailTemplateServices.addEmailTemplateData(input).subscribe(res => {
        if (res.status) {
          this.toastr.SuccessToastr("Email Template is submitted successfully.");
          this.primaryEmailForm.reset();
          this.primaryflag = true;
          // this.tabIndex = 1;
          // this.router.navigate(['/EmailTemplates'], { replaceUrl: true });
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

  // viewEmailTemplate(){
  // }

  editEmailTemplate() {
    $('#loader').show();
    var input = {
      // EmailTemplateId: parseInt(this.arouter.snapshot.params.Id)
      EmailTemplateId: parseInt(this.arouter.snapshot.params.Id)
    }
    // this.emailTemplateServices.getEmailTemplateByIdData(input).subscribe(res => {
    this.emailTemplateServices.getEmailTemplateByTypeData(input).subscribe(res => {
      if (res.status) {
        $('#loader').hide();
        res.data.forEach(element => {
          if (element.isPrimary == true) {
            this.primaryEmailForm.get('EmailTemplateId')?.setValue(element.emailTemplateId);
            this.primaryEmailForm.get("EmailTemplateType")?.setValue(element.emailTemplateType);
            this.primaryEmailForm.get("Subject")?.setValue(element.subject);
            this.primaryEmailForm.get("PrimaryEmailBody")?.setValue(element.emailBody);
            this.primaryEmailForm.get("IsPrimary")?.setValue(true);
            this.selectedPrimaryRoleList = [];
            var primaryRoleIds: FormArray = this.primaryEmailForm.get('PrimaryRoleIds') as FormArray;
            element.roleIds.forEach(ele => {
              this.selectedPrimaryRoleList.push(ele);
              primaryRoleIds.controls.push(new FormControl(parseInt(ele)));
            })
            this.primaryEmailForm.get('PrimaryRoleIds').updateValueAndValidity();
          } else {
            this.secondaryEmailForm.get('EmailTemplateId')?.setValue(element.emailTemplateId);
            this.secondaryEmailForm.get("EmailTemplateType")?.setValue(element.emailTemplateType);
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
          this.primaryEmailForm.disable();
          this.secondaryEmailForm.disable();
          this.isView = true;
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
        //this.toastr.ErrorToastr("Something went wrong");
        $('#loader').hide();
      }
    })
  }

  primaryRoleChange(event) {
    var primaryRoleIds: FormArray = this.primaryEmailForm.get('PrimaryRoleIds') as FormArray;
    primaryRoleIds.clear();
    event.forEach(ele => {
      primaryRoleIds.controls.push(new FormControl(parseInt(ele.RoleId)));
    })
    this.primaryEmailForm.get('PrimaryRoleIds').updateValueAndValidity();
  }

  saveSecondaryEmailTemplates() {
    this.secondaryflag = false;
    this.isSubmitted = true;
    if (this.secondaryEmailForm.valid) {
      // var formVal = JSON.parse(JSON.stringify(this.secondaryEmailForm.getRawValue()));

      var input = {
        emailTemplateId: this.secondaryEmailForm.controls.EmailTemplateId.value,
        emailBody: this.secondaryEmailForm.controls.SecondaryEmailBody.value,
        emailTemplateType: this.secondaryEmailForm.controls.EmailTemplateType.value,
        subject: this.secondaryEmailForm.controls.Subject.value,
        isPrimary: this.secondaryEmailForm.controls.IsPrimary.value,
        roleIds: this.secondaryEmailForm.controls.SecondaryRoleIds.value
      };

      this.emailTemplateServices.addEmailTemplateData(input).subscribe(res => {
        if (res.status) {
          this.toastr.SuccessToastr("Email Template is submitted successfully.");
          this.secondaryEmailForm.reset();
          this.secondaryflag = true;
          // this.router.navigate(['/EmailTemplates'], { replaceUrl: true });
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

  // viewEmailTemplate(){
  // }

  // editSecondaryEmailTemplate() {
  //   $('#loader').show();
  //   var input = {
  //     EmailTemplateId: parseInt(this.arouter.snapshot.params.Id)
  //   }
  //   this.emailTemplateServices.getEmailTemplateByIdData(input).subscribe(res => {
  //     if (res.status) {
  //       $('#loader').hide();
  //       this.secondaryEmailForm.get('EmailTemplateId')?.setValue(res.data.emailTemplateId);
  //       this.secondaryEmailForm.get("EmailTemplateType")?.setValue(res.data.emailTemplateType);
  //       this.secondaryEmailForm.get("Subject")?.setValue(res.data.subject);
  //       this.secondaryEmailForm.get("SecodaryEmailBody")?.setValue(res.data.emailBody);
  //       this.secondaryEmailForm.get("IsPrimary")?.setValue(res.data.isPrimary);
  //       this.selectedSecondaryRoleList = [];
  //       var secondaryRoleIds: FormArray = this.secondaryEmailForm.get('SecondaryRoleIds') as FormArray;
  //       res.data.roleIds.forEach(ele => {
  //         this.selectedSecondaryRoleList.push(ele);
  //         secondaryRoleIds.controls.push(new FormControl(parseInt(ele)));
  //       })
  //       this.secondaryEmailForm.get('SecondaryRoleIds').updateValueAndValidity();
  //       if (this.arouter.snapshot.params.action == 'view') {
  //         this.secondaryEmailForm.disable();
  //         this.isView = true;
  //       }
  //       else {
  //         this.isView = false;
  //       }
  //       this.config.editable = !this.isView
  //     }
  //     else {
  //       this.toastr.ErrorToastr(res.message);
  //       $('#loader').hide();
  //     }
  //   }, (err: any) => {
  //     $('#loader').hide();
  //     if (err.status == 401) {
  //       this.router.navigate(['/']);
  //     }
  //     else {
  //       //this.toastr.ErrorToastr("Something went wrong");
  //       $('#loader').hide();
  //     }
  //   })
  // }

  secondaryRoleChange(event) {
    var secondaryRoleIds: FormArray = this.secondaryEmailForm.get('SecondaryRoleIds') as FormArray;
    secondaryRoleIds.clear();
    event.forEach(ele => {
      secondaryRoleIds.controls.push(new FormControl(parseInt(ele.RoleId)));
    })
    this.secondaryEmailForm.get('SecondaryRoleIds').updateValueAndValidity();
  }

  closeemailtemplate() {
    this.router.navigate(['/EmailTemplates'], { replaceUrl: true });
  }

  resetEmailtemplateForm() {
    this.EmailTemplateForm.get('EmailTemplateTypeTitle')?.setValue('');
    this.EmailTemplateForm.get('EmailTemplateTypeName')?.setValue('');
    this.EmailTemplateForm.get('EmailTemplateTypeId')?.setValue('0');


  }

  modalTitle = 'Add EmailTemplate Type';
  openModal(content: any, id: any = 0) {
    this.EmailTemplateForm.reset();
    // if (id > 0) {
    //   this.modalTitle = "Update EmailTemplate Type";
    //   this.emptemplateid = this.emailstypemaster.find(m => m.emailTypeId == id);
    //   this.EmailTemplateForm.get("EmailTemplateTypeId")?.setValue(this.emptemplateid?.emailTypeId);
    //   this.EmailTemplateForm.get("EmailTemplateTypeName")?.setValue(this.emptemplateid?.emailTempleName);
    //   this.EmailTemplateForm.get("EmailTemplateTypeTitle")?.setValue(this.emptemplateid?.emailTitle);

    // }
    // else {
    this.modalTitle = "Add Email Template Type";
    this.resetEmailtemplateForm();
    // }

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
          // this.toastr.SuccessToastr(res.data);
          // if (res.data.EmailTemplateTypeId == 0)
          this.toastr.SuccessToastr("Email added successfully.");
          this.loadEmail();
          this.primaryEmailForm.controls.EmailTemplateType.setValue(res.data.emailTemplateId);
          this.secondaryEmailForm.controls.EmailTemplateType.setValue(res.data.emailTemplateId);
          // else
          //   this.toastr.SuccessToastr("Email updated successfullly.");
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

}

