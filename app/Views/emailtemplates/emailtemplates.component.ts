import { Component,  OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { EmailTemplateService } from 'src/app/Services/email-template.service';
import { ToastrServiceService } from 'src/app/services/toastr-service.service';

@Component({
  selector: 'app-emailtemplates',
  templateUrl: './emailtemplates.component.html',
  styleUrls: ['./emailtemplates.component.sass']
})
export class EmailtemplatesComponent implements OnInit {
  dtOptions: DataTables.Settings = {};

  constructor(private router: Router, private modalService: NgbModal, private alerts: AlertServiceService, private emailTemplateServices: EmailTemplateService, private toastr: ToastrServiceService, private formBuilder: FormBuilder) {
    this.EmailTemplateForm = formBuilder.group({
      EmailTemplateTypeId: [0],
      EmailTemplateTypeName: ['', Validators.required],
      EmailTemplateTypeTitle: ['', Validators.required],

    })
  }

  ngOnInit(): void {
    this.loadEmialData();
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

        this.emailTemplateServices.getSpEmailTemplateData(input).subscribe(res => {
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
        { name: 'ettm.EmailTemplateName', data: 'emailTemplateName', orderable: true, searchable: true },
        {
          name: 'etm.isPrimary', data: 'subType', render: function (data, type, raw) {
            if (data != null)
              if (data == true)
                return "Primary";
              else
                return "Secondary"
            else
              return '';
          }, orderable: true, searchable: true
        },
        { name: 'cum.Name', data: 'name', orderable: true, searchable: true },
        {
          name: 'etm.CreatedDate', data: 'createdDate', render: function (data, type, raw) {
            if (data != null)
              return moment(data + 'Z').format('DD/MM/YY hh:mm A')
            else
              return '';
          }, orderable: true, searchable: true
        },
        {
          name: 'etm.EmailTemplateId', data: 'emailTemplateId', render: function (data, type, raw) {
            if (data) {
              var edit;
              edit = '<button class="me-1 btn btn-success btn-sm fa fa-pencil" onclick="document.getElementById(\'EmailTemplateId\').value=\'' + raw.typeId + '\'; document.getElementById(\'editEmailTemplateCall\').click()"></button> <button class="me-1 btn btn-primary btn-sm fa fa-eye" onclick="document.getElementById(\'EmailTemplateId\').value=\'' + raw.typeId + '\'; document.getElementById(\'viewEmailTemplateCall\').click()"></button> <button class="me-1 btn btn-danger btn-sm fa fa-trash" onclick="document.getElementById(\'EmailTemplateId\').value=\'' + data + '\'; document.getElementById(\'deleteEmailTemplateCall\').click()"></button>'
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
    this.router.navigate(['/EditEmailTemplate/' + $("#EmailTemplateId").val()]);
  }

  deleteEmailTemplate() {
    this.alerts.ComfirmAlert("Do you want to delete Email Template?", "Yes", "No").then(res => {
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
    this.router.navigate(['/ViewEmailTemplate/view/' + $("#EmailTemplateId").val()]);
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

  });
  modalTitle = 'Add EmailTemplate Type';
  emptemplateid: any;
  emailstypemaster: any[];
  isSubmitted: boolean = false;
  openModal(content: any, id: any = 0) {
    this.EmailTemplateForm.reset();
    this.modalTitle = "Add Email Template Type";
    this.resetEmailtemplateForm();
   

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
      this.emailTemplateServices.AddEmailTemplate(input).subscribe(res => {
        if (res.status) {
          this.modalService.dismissAll();
          // this.toastr.SuccessToastr(res.data);
          // if (res.data.EmailTemplateTypeId > 0)
          this.toastr.SuccessToastr("Email added successfully.");
          // else
          // this.toastr.SuccessToastr("Email updated successfullly.");
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


  // clickEdit(e) {
  //   this.openLarge(e.target.value, false)
  // }
  // clickView(e) {
  //   this.openLarge(e.target.value, true)
  // }
  // clickDelete(e) {
  //   this.openLarge(e.target.value, true)
  // }

  // openLarge(id: any, isView: any) {

  // }

}
