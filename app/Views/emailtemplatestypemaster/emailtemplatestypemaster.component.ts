import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { EmailTemplateService } from 'src/app/Services/email-template.service';
import { ToastrServiceService } from 'src/app/services/toastr-service.service';

@Component({
  selector: 'app-emailtemplatestypemaster',
  templateUrl: './emailtemplatestypemaster.component.html',
  styleUrls: ['./emailtemplatestypemaster.component.sass']
})
export class EmailtemplatestypemasterComponent implements OnInit {

  //dtOptions: { pagingType: string; pageLength: number; serverSide: boolean; processing: boolean; responsive: boolean; scrollX: boolean; retrieve: boolean; searching: boolean; order: (string | number)[]; language: { infoFiltered: string; }; ajax: (dataTablesParameters: any, callback: any) => void; columns: ({ name: string; data: string; orderable: boolean; searchable: boolean; render?: undefined; } | { name: string; data: string; orderable: boolean; searchable: boolean; render: (data: any, type: any, row: any) => string; })[]; autoWidth: boolean; };
  isSubmitted: boolean = false;
  modalTitle = 'Add EmailTemplate Type';
  dtOptions: DataTables.Settings = {};
  EmailTemplateForm: FormGroup = new FormGroup({
    EmailTemplateTypeId: new FormControl(),
    EmailTemplateTypeName: new FormControl(),
    EmailTemplateTypeTitle: new FormControl(),
    //variables: new FormControl(),

  });
  emailstypemaster: any[];
  emailvariables: any[];
  dropdownSettings = {};

  constructor(private formBuilder: FormBuilder, private modalService: NgbModal, private emailtemplateservices: EmailTemplateService, private toastr: ToastrServiceService, private router: Router) {
    this.EmailTemplateForm = formBuilder.group({
      EmailTemplateTypeId: [0],
      EmailTemplateTypeName: ['', Validators.required],
      EmailTemplateTypeTitle: ['', Validators.required],

    })
  }

  ngOnInit(): void {
    this.loadData();
    // this.dropdownSettings; this.dropdownSettings = {
    //   singleSelection: false,
    //   idField: 'item_id',
    //   textField: 'item_text',
    //   selectAllText: 'Select All',
    //   unSelectAllText: 'UnSelect All',
    //   itemsShowLimit: 3,
    //   allowSearchFilter: true
    // };
  }
  get f() {
    return this.EmailTemplateForm.controls;
  }
  resetEmailtemplateForm() {
    this.EmailTemplateForm.get('EmailTemplateTypeTitle')?.setValue('');
    this.EmailTemplateForm.get('EmailTemplateTypeName')?.setValue('');
    this.EmailTemplateForm.get('EmailTemplateTypeId')?.setValue('0');


  }


  loadData() {
    $('#loader').show();


    var input = {
      searchText: "",
      pageSize: 10,
      startFrom: 0,
      orderBy: "",
      orderByDirection: "",
    }
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 10,
      lengthMenu: [[10, 20, -1], [10, 20, 'All']],
      serverSide: true,
      processing: true,
      responsive: true,
      scrollX: true,
      retrieve: true,
      searching: true,
      order: [3, 'desc'],
      language: {
        infoFiltered: ""
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.emailstypemaster = [];
        //this.emailvariables = [];
        input.startFrom = dataTablesParameters.start;
        input.pageSize = dataTablesParameters.length;
        input.searchText = dataTablesParameters.search.value;

        input.orderByDirection = dataTablesParameters.order[0].dir;
        input.orderBy = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
        //let emailmaster = this.emailtemplateservices.GetAllEmailType(input);
        //let getvariables = this.emailtemplateservices.GetEmailVeriableTemplate(input);
        // forkJoin([emailmaster, getvariables]).subscribe(result => {
        //   if (result[0]) {
        //     if (result[0].status) {
        //       this.emailstypemaster = result[0].data;
        //       callback({
        //         recordsTotal: result[0].data.totalCounts,
        //         recordsFiltered: result[0].data.totalCounts,
        //         data: []
        //       })
        //     }
        //     else {
        //       this.toastr.ErrorToastr(result[0].message);
        //     }
        //   }
        //   if (result[1]) {
        //     if (result[1].status) {
        //       this.emailvariables = result[1].data;
        //     }
        //     else {
        //       this.toastr.ErrorToastr(result[1].message);
        //     }
        //   }
        //   $('#loader').hide();
        // }, (err: any) => {
        //   if (err.status == 401) {
        //     this.router.navigate(['/'])
        //   }
        //   else {
        //     this.toastr.ErrorToastr("Something went wrong");
        //   }
        //   $('#loader').hide();
        // });

        this.emailtemplateservices.GetAllEmailType(input).subscribe(res => {
          if (res.status) {
            this.emailstypemaster = res.data.records;
          }
          else {
            this.toastr.ErrorToastr("Something went wrong");
          }

          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: []
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
        { data: 'ettm.EmailTypeTitle', orderable: true, searchable: true },
        { data: 'ettm.EmailTemplateName', orderable: true, searchable: true },
        { data: 'um.Name', orderable: true, searchable: true },
        { data: 'ettm.UpdatedDate ', orderable: true, searchable: true },
        { name: '', data: '', orderable: false, searchable: false },

      ],
      autoWidth: false
    }
    $('#loader').hide();
  }
  emptemplateid: any;
  openModal(content: any, id: any = 0) {
    this.EmailTemplateForm.reset();
    if (id > 0) {
      this.modalTitle = "Update EmailTemplate Type";
      this.emptemplateid = this.emailstypemaster.find(m => m.emailTypeId == id);
      this.EmailTemplateForm.get("EmailTemplateTypeId")?.setValue(this.emptemplateid?.emailTypeId);
      this.EmailTemplateForm.get("EmailTemplateTypeName")?.setValue(this.emptemplateid?.emailTempleName);
      this.EmailTemplateForm.get("EmailTemplateTypeTitle")?.setValue(this.emptemplateid?.emailTitle);

    }
    else {
      this.modalTitle = "Add Email Template Type";
      this.resetEmailtemplateForm();
    }

    this.isSubmitted = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: false });
  }
  disable() {
    this.EmailTemplateForm.get("EmailTemplateTyneName").disable();
  }
  SaveEmail() {
    this.isSubmitted = true;
    if (this.EmailTemplateForm.valid) {
      $("loader").show();
      var input = JSON.parse(JSON.stringify(this.EmailTemplateForm.getRawValue()));
      input.EmailTemplateTypeId = parseInt(input.EmailTemplateTypeId);
      this.emailtemplateservices.AddEmailTemplate(input).subscribe(res => {
        if (res.status) {
          this.modalService.dismissAll();
          this.toastr.SuccessToastr(res.data);
          // if (res.data.EmailTemplateTypeId == 0)
          //   this.toastr.SuccessToastr("Email added successfullly.");
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




}
