import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { City } from 'src/app/Models/city.model';
import { FeePayOption } from 'src/app/models/fee-pay-option.model';
import { AccountService } from 'src/app/Services/account.service';
import { FeePayByService } from 'src/app/Services/feepayby.service';
import { SponcerService } from 'src/app/Services/sponcer.service';
import { ToastrServiceService } from 'src/app/Services/toastr-service.service';

@Component({
  selector: 'app-manage-sponcer',
  templateUrl: './manage-sponcer.component.html',
  styleUrls: ['./manage-sponcer.component.sass']
})
export class ManageSponcerComponent implements OnInit {
  isSubmitted: boolean = false;
  modalTitle = 'Add Sponcer';
  dtOptions: DataTables.Settings;
  SponcerForm: FormGroup = new FormGroup({
    sponsorId: new FormControl(),
    SponcerName: new FormControl(),
    FirstName: new FormControl(),
    LastName: new FormControl(),
    EmailId: new FormControl(),
    CountryId: new FormControl(),
    CityId: new FormControl(),
    Address: new FormControl(),
    PostalCode: new FormControl(),
    ContactDetail: new FormControl(),

  });
  @ViewChild("SponcerModal") SponcerModal: ElementRef
  constructor(private formBuilder: FormBuilder, private modalService: NgbModal,private feepayService: FeePayByService, private accountservices: AccountService, private route: Router, private toastr: ToastrServiceService, private sponcerServices: SponcerService) {
    this.SponcerForm = formBuilder.group({
      sponsorId: [0],
      SponcerName: ['', Validators.required],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      SponserType: [0, Validators.required],
      EmailId: ['', [Validators.required, Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}")]],
      CountryId: ['', Validators.required],
      CityId: ['', Validators.required],
      Address: ['', Validators.required],
      PostalCode: ['', [Validators.required, Validators.pattern("[A-Za-z0-9]{5,}")]],
      ContactDetail: ['', [Validators.required, Validators.pattern("[0-9]{10,12}")]],

    });
  }
  hasViewModel: boolean = false;
  Countrydata: any;
  citydata: Array<City> = [];
  Buttons = [];
  sponcer: any;
  sponcerCountryId: any;
  sponcerbyid: any;
  ngOnInit(): void {
    this.loadButtons();
    this.loadData();
    this.loadform();
    this.sponcertypedata();
  }
  feePayOptions: Array<FeePayOption> = [];

  sponcertypedata() {
    let paginationModal = {
      index: 0,
      size: 0
    };
    $('#loader').show();
    let FeePayOptionData = this.feepayService.getAllFeePayBy(paginationModal);
    forkJoin([FeePayOptionData]).subscribe(result => {
      $('#loader').hide();
      if (result[0]) {
        if (result[0].status) {
          this.feePayOptions = result[0].data.records;
        }
        else {
          this.toastr.ErrorToastr(result[0].message);
        }
      }
     
    }, (err: any) => {
      $('#loader').hide();
      if (err.status == 401) {
        this.route.navigate(['/'])
      }
      else {
        this.toastr.ErrorToastr("Something went wrong");
      }
    })
    // this.dateofStudies = [2022, 2023];
  }
  loadform() {
    var input = {

    }
    let CountryId = this.accountservices.getCountries();
    //let CityId = this.accountservices.getCitiesByCountryId();

    forkJoin([CountryId]).subscribe(result => {
      $('#loader').hide();
      if (result[0]) {
        if (result[0].status) {
          this.Countrydata = result[0].data;
        }
        else {
          this.toastr.ErrorToastr(result[0].message);
        }
      }
      // if (result[1]) {
      //   if (result[1].status) {
      //     this.citydata = result[1].data;
      //   } else {
      //     this.toastr.ErrorToastr("Something went wrong");
      //   }
      // }
      $('#loader').hide();
    });
  }
  changeContry(cityId: any) {
    $("#loader").show();
    this.SponcerForm.get('CityId').setValue('');
    let input = {
      id: this.SponcerForm.get('CountryId').value
    }
    this.accountservices.getCitiesByCountryId(input).subscribe(res => {
      if (res.status) {
        this.citydata = res.data

      }
      else {
        this.toastr.ErrorToastr(res.message);
      }
      $("#loader").hide();
    }, (err: any) => {
      $("#loader").hide();
      this.toastr.ErrorToastr("Something went wrong");
      console.log(err);
    })
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
      lengthMenu: [[10, 20, 50], [10, 20, 50]],
      serverSide: true,
      processing: true,
      responsive: true,
      scrollX: true,
      retrieve: true,
      searching: true,
      order: [8, 'desc'],
      language: {
        infoFiltered: "",
        emptyTable:"No data found"
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.sponcer = [];
        //this.emailvariables = [];
        input.startFrom = dataTablesParameters.start;
        input.pageSize = dataTablesParameters.length;
        input.searchText = dataTablesParameters.search.value;

        input.orderByDirection = dataTablesParameters.order[0].dir;
        input.orderBy = dataTablesParameters.columns[dataTablesParameters.order[0].column].name;


        this.sponcerServices.getSponcerData(input).subscribe(res => {

          if (res.status) {
            this.sponcer = res.data.records;
          }
          else {
            this.toastr.ErrorToastr(res.message);
          }

          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            data: res.data.records
          });
          $('#loader').hide();
        }, (err: any) => {
          $('#loader').hide();
          if (err.status == 401) {
            this.route.navigate(['/'])
          }
          else {
            this.toastr.ErrorToastr("Something went wrong");
          }
        });
      },
      columns: [
        { name: 'sm.SponcerName', data: 'sponcerName', orderable: true, searchable: true },
        { name: 'sm.SponcerTypeName', data: 'sponcerTypeName', orderable: true, searchable: true },
        { name: 'sm.AuthorizedPersonName', data: 'authorizedName', orderable: true, searchable: true },
        { name: 'sm.ContactDetail', data: 'number', orderable: true, searchable: true },
        { name: 'sm.EmailId', data: 'email', orderable: true, searchable: true },
        
        { name: 'cm.CountryName', data: 'countryId', orderable: true, searchable: true },
        { name: 'ctm.CityName', data: 'cityId', orderable: true, visible: false, searchable: true },
        { name: 'sm.PostalCode', data: 'postalCode', orderable: true, visible: false, searchable: true },
        { name: 'sm.Address', data: 'address', orderable: true, searchable: true, visible: false },
        {
          name: 'sm.CreatedDate', data: 'createdDate', orderable: true, searchable: true, visible: false, render: function (data, type, row) {
            return moment(data + 'Z').format('DD/MM/YY hh:mm A')
          },
        },
        { name: 'um.name', data: 'createdBy', orderable: true, searchable: true, visible: false },
        {
          name: 'sm.UpdatedDate', data: 'updateDate', orderable: true, searchable: true, visible: false, render: function (data, type, row) {
            return moment(data + 'Z').format('DD/MM/YY hh:mm A')
          },
        },
        { name: 'uum.name', data: 'updateBy', orderable: true, searchable: true, visible: false },
        {
          name: 'sm.isVerifry', data: 'verify', orderable: true, searchable: true, render: function (data, type, row) {
            if (data == true)
              return 'Verified'
            else
              return 'Un Verified'
          },
        },



        {
          name: '', data: 'sponcerId', orderable: false, searchable: false, render: function (data, type, row) {

            return '<button class="btn-shadow btn btn-success me-2 pointer" onClick=\"document.getElementById(\'hdnClickEdit\').value=' + data + '; document.getElementById(\'hdnClickEdit\').click()\">Edit</button><button class="btn-shadow btn btn-warning pointer" onClick=\"document.getElementById(\'hdnClickView\').value=' + data + '; document.getElementById(\'hdnClickView\').click()\">View</button>';
          },
        }
      ],
      autoWidth: false
    }
    $('#loader').hide();
  }

  loadButtons() {
    this.Buttons.push({
      id: 5,
      name: "Country",
      isChecked: true
    });
    this.Buttons.push({
      id: 6,
      name: "City",
      isChecked: false
    });
    this.Buttons.push({
      id: 7,
      name: "Postal code",
      isChecked: false
    });
    this.Buttons.push({
      id: 8,
      name: "Address",
      isChecked: false
    });
    this.Buttons.push({
      id: 9,
      name: "Created date",
      isChecked: false
    });
    this.Buttons.push({
      id: 10,
      name: "Created by",
      isChecked: false
    });
    this.Buttons.push({
      id: 11,
      name: "Updated date",
      isChecked: false
    });
    this.Buttons.push({
      id: 12,
      name: "Update by",
        isChecked: false
    });
  }

  openModal(id: any = 0, isView: any) {
    this.isSubmitted = false;
    this.hasViewModel = isView;
    this.SponcerForm.reset();
    this.SponcerForm.get('sponsorId').setValue(id);

    if (id > 0) {
      this.EditSponcer(id);
      this.modalTitle = "Update Sponsor";
      this.SponcerForm.get("EmailId")?.disable();
    }
    else {
      this.modalTitle = "Add Sponsor";
      this.SponcerForm.get("EmailId")?.enable();
    }

    if (isView) {
      this.SponcerForm.disable();
      this.modalTitle = "View Sponsor";

    }
    else {
      this.SponcerForm.enable();
    }
    if (id > 0) {
      this.SponcerForm.get("EmailId")?.disable();
    }
    else {
      this.SponcerForm.get("EmailId")?.enable();
    }


    this.modalService.open(this.SponcerModal, { ariaLabelledBy: 'modal-basic-title', size: 'lg', backdrop: false });
  }
  get f() {
    return this.SponcerForm.controls;
  }

  EditSponcer(id: any) {
    console.log(id);
    $('#loader').show();
    var input = {
      SponcerId: id
    }
    this.sponcerServices.getSponcerBYId(input).subscribe(res => {
      //this.resetsponcerform();
      if (res.status) {
        $('#loader').hide();
        this.SponcerForm.get('sponsorId')?.setValue(res.data.sponsorId);
        this.SponcerForm.get('SponserType')?.setValue(res.data.sponcerType);
        this.SponcerForm.get('SponcerName')?.setValue(res.data.sponcerName);
        this.SponcerForm.get('FirstName')?.setValue(res.data.firstName);
        this.SponcerForm.get('LastName')?.setValue(res.data.lastName);
        this.SponcerForm.get('ContactDetail')?.setValue(res.data.contactDetail);
        this.SponcerForm.get('Address')?.setValue(res.data.address);
        this.SponcerForm.get('EmailId')?.setValue(res.data.emailId);
        this.SponcerForm.get("CountryId")?.setValue(res.data.countryId);
        this.SponcerForm.get("CityId")?.setValue(res.data.cityId);

        this.SponcerForm.get("PostalCode")?.setValue(res.data.postalCode);



      }
      else {
        this.toastr.ErrorToastr(res.message);
        $('#loader').hide();
      }

    }, (err: any) => {
      $('#loader').hide();
      if (err.status == 401) {
        this.route.navigate(['/']);
      }
      else {
        this.toastr.ErrorToastr("Something went wrong");
        $('#loader').hide();
      }
    })
  }
  SaveSponcer() {
    this.isSubmitted = true;
    console.log(this.isSubmitted);
    if (this.SponcerForm.valid) {
      $('#loader').show();
      var formVal = JSON.parse(JSON.stringify(this.SponcerForm.getRawValue()));
      console.log(formVal);
      if(formVal.sponsorId == null || formVal.sponsorId == 0){

        formVal.sponsorId =  0;  //parseInt(formVal.sponsorId);
      }
      
      
      formVal.SponcerType = parseInt(formVal.SponserType);
      this.sponcerServices.AddSponcer(formVal).subscribe(res => {
        if (res.status) {
          console.log(formVal);
          this.modalService.dismissAll();
          if (res.data.sponcerId == 0)
            this.toastr.SuccessToastr("Sponsor Added Successfully.");


          else {
            this.toastr.SuccessToastr("Sponsor Updated Successfully");
          }
          $('#loader').hide();
          $(".table").DataTable().ajax.reload();

        }
        else {
          this.toastr.ErrorToastr("Duplicate Email not Added.");
          $("#loader").hide();
        }

      }, (err: any) => {

        $('#loader').hide();
        this.toastr.ErrorToastr("Something missing");
      })
    }

  }
  resetsponcerform() {
    this.SponcerForm.reset();
    this.SponcerForm.get("sponcerId")?.setValue(0);
    // this.SponcerForm.get("SponcerName")?.setValue("");
    // this.SponcerForm.get("ContactDetail")?.setValue("");
    // this.SponcerForm.get("EmailId")?.setValue("");
    // this.SponcerForm.get("Address")?.setValue("");
    // this.SponcerForm.get("PostalCode")?.setValue("");
    // this.SponcerForm.get("CountryId")?.setValue("");
    // this.SponcerForm.get("CityId")?.setValue("");

  }
  clickView(e) {
    this.openModal(e.target.value, true)
  }
  clickEdit(e) {
    this.openModal(e.target.value, false)
  }
  hideShowColumn(e) {
    var col = $(".table").DataTable().column(e);
    col.visible(!col.visible());
    var colindex = this.Buttons.findIndex(m => m.id == e);
    this.Buttons[colindex].isChecked = col.visible();
  }
}
