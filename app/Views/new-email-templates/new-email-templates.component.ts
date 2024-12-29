import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { forkJoin } from 'rxjs';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { EmailTemplateService } from 'src/app/Services/email-template.service';
import { ToastrServiceService } from 'src/app/services/toastr-service.service';
import { KanbanService } from 'src/app/Services/kanban.service';


@Component({
  selector: 'app-new-email-templates',
  templateUrl: './new-email-templates.component.html',
  styleUrls: ['./new-email-templates.component.sass']
})
export class NewEmailTemplatesComponent implements OnInit {
dtOptions: DataTables.Settings = {};

  constructor(private router: Router, private modalService: NgbModal,private kanbanService: KanbanService, private alerts: AlertServiceService, private emailTemplateServices: EmailTemplateService, private toastr: ToastrServiceService, private formBuilder: FormBuilder) {
    this.EmailTemplateForm = formBuilder.group({
      EmailTemplateTypeId: [0],
      EmailTemplateTypeName: ['', Validators.required],
      EmailTemplateTypeTitle: ['', Validators.required],
      ApplicationType: ['', Validators.required],

    })
  }

  ngOnInit(): void {
    this.loadEmialData();
    this.Applicationstageget();
  }

  addEmailTemplatePage() {
    this.router.navigate(['/AddEmailTemplate'], { replaceUrl: true });
  }
  emails = [];
  loadEmialData() {
    $('#loader').show();

    let input = {
      PageSize: 10,
      StartFrom: 1,
      SearchText: '',
      OrderByDirection: '',
      OrderBy: ''
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
        this.emails = [];
        input.PageSize = dataTablesParameters.length;
        input.StartFrom = dataTablesParameters.start;
        input.SearchText = dataTablesParameters.search.value;
        input.OrderByDirection = dataTablesParameters.order[0].dir;
        input.OrderBy = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;

        this.emailTemplateServices.GetEmailContant(input).subscribe(res => {
          console.log(" get email content",res);
          if (res.status) {
            this.emails = res.data.records;
          }
          else {
            this.toastr.ErrorToastr("Something went wrong");
          }
          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: this.emails
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
        { name: 'emailVeriableName', data: 'emailVeriableName', orderable: true, searchable: true },
        { name: 'emailVeriableTempCount', data: 'emailVeriableTempCount', orderable: true, searchable: true },
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
          name: 'emailTemplateId', data: 'emailTemplateId', render: function (data, type, raw) {
            if (data) {
              var edit;
              edit = '<button class="me-1 btn btn-primary btn-sm fa fa-eye" onclick="document.getElementById(\'ApplicationType\').value=\'' + raw.applicationType + '\'; document.getElementById(\'EmailTemplateId\').value=\'' + raw.emailTemplateId + '\'; document.getElementById(\'viewEmailTemplateCall\').click()"></button>'
            }
            return edit;
          }, orderable: false, searchable: false
        },
      ],
      autoWidth: false
    }
    $('#loader').hide();
  }

  editEmailTemplate() {
    this.router.navigate(['/EditEmailTemplate/' + $("#EmailTemplateId").val() + "/" + $("#ApplicationType").val()]);
  }
  ApplicationtypeList:any= [];
Applicationstageget(){
  this.kanbanService.getStages().subscribe(res => {
    console.log("application stagget",res);
    if (res.status) {
      this.ApplicationtypeList = res.data;
      this.ApplicationtypeList.push({
        "stageId": 100,
        "stageName": "Other",
        "stageClass": "",
        "parentId": 0,
        "hasSubStage": true,
        "stageDataCount": 0,
        "subStages": []
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
  deleteEmailTemplate() {
    this.alerts.ComfirmAlert("Do you want to delete Email Template?", "Yes", "No").then(res => {
      console.log("delete email",res);
      if (res.isConfirmed) {
        $('#loader').show();
        let deleteInput = {
          EmailTemplateId: $("#EmailTemplateId").val()
        };
        this.emailTemplateServices.deleteEmailTemplate(deleteInput).subscribe(res => {

          if (res.status) {
            this.toastr.SuccessToastr("Email Template deleted successfully.");
            $(".table").DataTable().ajax.reload();
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

  viewEmailTemplate() {
    this.router.navigate(['/NewViewEmailTemplate/view/' + $("#EmailTemplateId").val()+ "/" + $("#ApplicationType").val()]);
  }

  resetEmailtemplateForm() {
    this.EmailTemplateForm.get('EmailTemplateTypeTitle')?.setValue('');
    this.EmailTemplateForm.get('EmailTemplateTypeName')?.setValue('');
    this.EmailTemplateForm.get('EmailTemplateTypeId')?.setValue('0');


  }

  EmailTemplateForm: FormGroup = new FormGroup({
    EmailTemplateTypeId: new FormControl(),
    EmailTemplateTypeName: new FormControl(),
    EmailTemplateTypeTitle: new FormControl(),
    ApplicationType: new FormControl(),
    //variables: new FormControl(),

  });
  modalTitle = 'Add EmailTemplate Type';
  emptemplateid: any;
  emailstypemaster: any[];
  isSubmitted: boolean = false;
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

  get f() {
    return this.EmailTemplateForm.controls;
  }

  SaveEmail() {
    this.isSubmitted = true;
    if (this.EmailTemplateForm.valid) {
      $("loader").show();
      var input = JSON.parse(JSON.stringify(this.EmailTemplateForm.getRawValue()));
      input.EmailTemplateTypeId = parseInt(input.EmailTemplateTypeId);
      this.emailTemplateServices.NewAddEmailTemplate(input).subscribe(res => {
        console.log("save email",res);
        if (res.status) {
          this.modalService.dismissAll();
          // this.toastr.SuccessToastr(res.data);
          // if (res.data.EmailTemplateTypeId > 0)
          this.toastr.SuccessToastr("Email added successfullly.");
          // else
          // this.toastr.SuccessToastr("Email updated successfullly.");
          $(".table").DataTable().ajax.reload();
          this.router.navigate(['/NewViewEmailTemplate/view/' + res.data.emailTemplateId +'/'+ res.data.applicationType]);
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

}
