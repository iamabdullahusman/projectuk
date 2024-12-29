import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Socialreference } from 'src/app/models/socialreference.model';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { EmittService } from 'src/app/Services/emitt.service';
import { SocialreferenceService } from 'src/app/services/socialreference.service';
import { ToastrServiceService } from 'src/app/services/toastr-service.service';

@Component({
  selector: 'app-social-reference',
  templateUrl: './social-reference.component.html',
  styleUrls: ['./social-reference.component.sass']
})
export class SocialReferenceComponent implements OnInit {

  isSubmitted: boolean = false;
  modalTitle = 'Add Source';
  dtOptions: DataTables.Settings = {};
  socialreferences: Array<Socialreference> = [];
  socialreference?: Socialreference;
  socialrefform: FormGroup = new FormGroup({
    referenceName: new FormControl(),
    referenceId: new FormControl()
  })
  constructor(private modalService: NgbModal, private socialrefService: SocialreferenceService, private formBuilder: FormBuilder, private router: Router, private alerts: AlertServiceService, private toastr: ToastrServiceService, private emittService: EmittService) {
    this.socialrefform = formBuilder.group({
      referenceId: ['0'],
      referenceName: ['', [Validators.required]]
    })
    emittService.onChangeAddApplicationbtnHideShow(false);
  }


  ngOnInit(): void {
    this.loadsocialreference();
  }

  get f() {
    return this.socialrefform.controls;
  }

  loadsocialreference() {
    $('#loader').show();
    //this.socialreferences=[];
    let input = {
      size: 10,
      index: 1,
      search: '',
      orderBy: '',
      orderByDirection: '',
    }
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching: true,
      language: {
        infoFiltered: ""
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.socialreferences = [];
        input.size = dataTablesParameters.length;
        input.index = dataTablesParameters.start / dataTablesParameters.length;
        input.search = dataTablesParameters.search.value;
        input.orderByDirection = dataTablesParameters.order[0].dir;
        input.orderBy = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
        input.index++;
        this.socialrefService.getAllSocialRef(input).subscribe(res => {

          if (res.status) {
            for (let i = 0; i < res.data.records.length; i++) {
              this.socialreferences.push(res.data.records[i]);
            }
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
      columns: [{ data: '', orderable: false }, { data: 'referenceName', orderable: true }],
      autoWidth: false
    }
    // this.socialrefService.getAllSocialRef(input).subscribe(res=>{
    //   if(res.status){
    //     for(var i=0;i<res.data.length;i++){
    //       this.socialreferences.push(res.data[i]);
    //     }
    //   }
    //   else{
    //     this.toastr.ErrorToastr(res.message);
    //   }
    // },(err:any)=>{
    //   if(err.status==401){
    //     this.router.navigate(['/'])
    //   }
    //   else{
    //     this.toastr.ErrorToastr("Something went wrong");
    //   }
    // });
  }





  openModal(content: any, id: any = 0) {
    $("#loader").show();
    this.resetCourseForm();
    this.socialrefform.reset(this.socialrefform.value);
    if (id > 0) {

      this.modalTitle = 'Update Source';
      this.GetSocialRef(id);
    }
    else {

      this.modalTitle = 'Add Source';
      this.resetCourseForm();
    }
    this.isSubmitted = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: false });
    $('#loader').hide();
  }

  resetCourseForm() {
    this.socialrefform.get("referenceName")?.setValue("");
    this.socialrefform.get("referenceId")?.setValue('0');
  }

  deleteSocialRef(id: any) {
    this.alerts.ComfirmAlert("Do you want to delete Source?", "Yes", "No").then(res => {
      if (res.isConfirmed) {
        $("#loader").show();
        let deleteInput = {
          id: id
        };
        this.socialrefService.deleteSocialRef(deleteInput).subscribe(res => {

          if (res.status) {
            this.toastr.SuccessToastr("Source deleted successfully.");
            this.loadsocialreference();
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
  SaveSocialreference() {
    this.isSubmitted = true;

    if (this.socialrefform.valid) {
      $('#loader').show();
      var formVal = JSON.parse(JSON.stringify(this.socialrefform.getRawValue()));

      formVal.referenceId = parseInt(formVal.referenceId);
      this.socialrefService.saveSocialRef(formVal).subscribe(res => {

        if (res.status) {
          this.modalService.dismissAll();
          if (res.data.referenceId == 0) {
            this.toastr.SuccessToastr("Social reference added successfully.");
            $(".table").DataTable().ajax.reload();
          }
          else {
            this.toastr.SuccessToastr("Social reference updated successfully.");
            this.loadsocialreference();
            $(".table").DataTable().ajax.reload();
          }
        }
        else {
          this.toastr.ErrorToastr("Social reference is not added.");
        }
        $('#loader').hide();
      }, (err: any) => {
        $('#loader').hide();
        this.toastr.ErrorToastr("Something missing");
      })
    }
  }
  GetSocialRef(id: any) {
    this.socialreference = this.socialreferences.find(x => x.referenceId == id);
    this.socialrefform.get("referenceName")?.setValue(this.socialreference?.referenceName);
    this.socialrefform.get("referenceId")?.setValue(this.socialreference?.referenceId);
  }

}
