import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from 'src/app/Services/account.service';
import { SponcerService } from 'src/app/Services/sponcer.service';
import { ToastrServiceService } from 'src/app/Services/toastr-service.service';
import { forkJoin } from 'rxjs';
import { City } from 'src/app/Models/city.model';
import { FeePayByService } from 'src/app/Services/feepayby.service';
import { FeePayOption } from 'src/app/models/fee-pay-option.model';

@Component({
  selector: 'app-sponsor-request',
  templateUrl: './sponsor-request.component.html',
  styleUrls: ['./sponsor-request.component.sass']
})
export class SponsorRequestComponent implements OnInit {
  isSubmitted: boolean = false;
  dtOptions: DataTables.Settings = {};
  SponsorRequest = [];
  SponsorList = [];
  countries = [];
  cityList = [];
  SponsorDetail: any;
  studentSponsorName: any;
  sponsorRequestStatus: any;
  VerifiedSponsorForm: FormGroup = new FormGroup({
    CountryId: new FormControl(),
    EmailId: new FormControl(),
    LastName: new FormControl(),
    FirstName: new FormControl(),
    SponcerName: new FormControl(),
    sponsorId: new FormControl(),
    applicationId: new FormControl(),
    newSponser: new FormControl(),
    oldSposer: new FormControl(),
    isApprove: new FormControl(),
    CityId: new FormControl(),
    Address: new FormControl(),
    PostalCode: new FormControl(),
    ContactDetail: new FormControl(),
  });
  @ViewChild("SponsorDetails") SponsorDetails: ElementRef;
  @ViewChild("SponsorReject") SponsorReject: ElementRef;
  constructor(private SponsorService: SponcerService, private formBuilder: FormBuilder, private toastr: ToastrServiceService, private route: Router, private modalService: NgbModal, private accountService: AccountService  ,private feepayService: FeePayByService) {
    this.VerifiedSponsorForm = formBuilder.group({
      CountryId: ['', Validators.required],
      FirstName: ['', Validators.required],
      SponcerName: ['', Validators.required],
      sponsorId: [0],
      applicationId: [null, [Validators.required]],
      newSponser: [null, [Validators.required]],
      oldSposer: [null, [Validators.required]],
      isApprove: [null, [Validators.required]],
      reason: [null],
      LastName: ['', Validators.required],
      EmailId: ['', [Validators.required, Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}")]],
      CityId: ['', Validators.required],
      Address: ['', Validators.required],
      PostalCode: ['', [Validators.required, Validators.pattern("[A-Za-z0-9]{5,}")]],
      ContactDetail: ['', [Validators.required, Validators.pattern("[0-9]{10,12}")]],
   
    SponserType: [null, Validators.required],
   
    });
  }
  Countrydata: any;
  citydata: Array<City> = [];

  ngOnInit(): void {
    this.DatatableBind();
    this.loadForm();
    this.sponcertypedata();
  }
  get f() {
    return this.VerifiedSponsorForm.controls;
  }
  // openModal(id: any = 0)
  // {
  //   this.VerifiedSponsorForm.get('sponsorId').setValue(id);
  // }
  openModal(id: any = 0, isView: boolean = false) {
    this.isSubmitted = false; // Reset the submission state
    this.VerifiedSponsorForm.reset(); // Reset the form
  
    // Set the sponsorId in the form
    this.VerifiedSponsorForm.get('sponsorId')?.setValue(id);
  
    
  
    // Open the modal
    this.modalService.open(this.SponsorDetails, { ariaLabelledBy: 'modal-basic-title', size: 'lg', backdrop: false });
  }
  loadForm()
  {
    var input = {

    }
    let CountryId = this.accountService.getCountries();
    //let CityId = this.accountservices.getCitiesByCountryId();

    forkJoin([CountryId]).subscribe(result => {
      console.log("loadform",result);
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
    this.VerifiedSponsorForm.get('CityId').setValue('');
    let input = {
      id: this.VerifiedSponsorForm.get('CountryId').value
    }
    this.accountService.getCitiesByCountryId(input).subscribe(res => {
      console.log("countires",res);
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
  feePayOptions: Array<FeePayOption> = [];
  sponcertypedata()
  {
    let paginationModal = {
      index: 0,
      size: 0
    };
    $('#loader').show();
    let FeePayOptionData = this.feepayService.getAllFeePayBy(paginationModal);
    forkJoin([FeePayOptionData]).subscribe(result => {
      console.log("names",result);
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

  }
  
  DatatableBind() {
    $('#loader').show();
    let input = {
      pageSize: 10,
      startFrom: 1,
      searchText: '',
      orderBy: '',
      sortingColumn: '',
      orderByDirection: 0
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
      order: [3, 'desc'],
      language: {
        infoFiltered: ""
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.SponsorRequest = [];
        input.pageSize = dataTablesParameters.length;
        input.startFrom = dataTablesParameters.start;
        input.searchText = dataTablesParameters.search.value;
        input.orderByDirection = dataTablesParameters.order[0].dir;
        input.sortingColumn = dataTablesParameters.order[0].column;
        input.orderBy = dataTablesParameters.columns[input.sortingColumn].name;
        this.SponsorService.SPGetSponcerRequestData(input).subscribe(res => {
          this.SponsorRequest = res.data.records;
          callback({
            recordsTotal: res.data.totalCounts,
            recordsFiltered: res.data.totalCounts,
            //  data: res.data.records
          });

        });
        $('#loader').hide();
      },
      columns: [

        { name: 'sm.SponcerName', data: '', orderable: true, searchable: true },
        { name: 'srsm.StatusName', data: '', orderable: true, searchable: true },
        { name: 'srm.CreatedDate', data: '', orderable: true, searchable: true },
        { name: '', data: '', orderable: false, searchable: false },
        { name: 'sm.EmailId', data: 'email', orderable: true, searchable: true },
        { name: 'sm.Address', data: 'address', orderable: true, searchable: true, visible: false },
        { name: 'sm.PostalCode', data: 'postalCode', orderable: true, visible: false, searchable: true },
        { name: 'sm.ContactDetail', data: 'number', orderable: true, searchable: true },

      ],
      autoWidth: false,
    }
    $('#loader').hide();
  }
  // ViewSponsorRequest(appid: number, sponsorid: number, status: string) {
  //   if (this.VerifiedSponsorForm) {
  //     // Set other form controls
  //     this.VerifiedSponsorForm.get("applicationId")?.setValue(appid);
  //     this.VerifiedSponsorForm.get("oldSposer")?.setValue(sponsorid);
  //     this.VerifiedSponsorForm.get("newSponser")?.setValue(sponsorid);
  
  //     // Find the selected sponsor by ID and set the name
  //     const selectedSponsor = this.SponsorRequest.find(sponsor => sponsor.sponsorId === sponsorid);
  //     if (selectedSponsor) {
  //       this.VerifiedSponsorForm.get("SponcerName")?.setValue(selectedSponsor.sponcerName);
  //     } else {
  //       this.VerifiedSponsorForm.get("SponcerName")?.setValue('');
  //     }
  //   }
  
  //   // Open the modal
  //   this.modalService.open(this.SponsorDetails, {
  //     ariaLabelledBy: 'modal-basic-title',
  //     size: 'lg',
  //     backdrop: false
  //   });
  // }
//   ViewSponsorRequest(applicationId: number, sponcerName: string, status: string) {
//     // Find the sponsor details based on sponsorId
//     const selectedSponsor = this.SponsorRequest.find(sponsor => sponsor.sponcerName === sponcerName);

//     if (selectedSponsor) {
//         // Only set the SponcerName field in the form
//         this.VerifiedSponsorForm.patchValue({
//             SponcerName: selectedSponsor.sponcerName,
//         });

//         // Open the modal with sponsor name displayed
//         this.modalService.open(this.SponsorDetails, {
//             ariaLabelledBy: 'modal-basic-title',
//             size: 'lg',
//             backdrop: false,
//         });
//     } else {
//         console.error('Sponsor not found');
//     }
// }
// sponcerName

  

  ViewSponsorRequest(appid, sponsorid, status , sponcerName) {
    console.log("click on view");
    const selectedSponsor = this.SponsorRequest.find(sponsor => sponsor.sponcerName === sponcerName);
    this.VerifiedSponsorForm.get("SponserType").disable();
    this.VerifiedSponsorForm.get("SponcerName").setValue(sponcerName);
    this.VerifiedSponsorForm.get("SponcerName").disable();
    this.VerifiedSponsorForm.get("oldSposer").setValue(sponsorid);
    this.VerifiedSponsorForm.get("newSponser").setValue(sponsorid);
    this.VerifiedSponsorForm.get("applicationId").setValue(appid);
    console.log("click on view 2",sponsorid);
    if (selectedSponsor) {
      this.VerifiedSponsorForm.get("SponcerName").setValue(selectedSponsor.sponcerName); // Set sponsor name
      
      console.log("nmames",selectedSponsor);
      


    }
 
    this.sponsorRequestStatus = status;
    this.GetSponcer(sponsorid);
    if (this.SponsorList.length == 0) {
      this.loadCountry();
    }
    this.getSponsorList();

    this.modalService.open(this.SponsorDetails, { ariaLabelledBy: 'modal-basic-title', size: 'lg', backdrop: false });
    console.log("click on view 3");
  }
  GetSponcer(id: any) {
    $('#loader').show();
    var input = {
      SponcerId: id
    }
    this.SponsorService.getSponcerBYId(input).subscribe(res => {
      //this.resetsponcerform();
      if (res.status) {
        $('#loader').hide();
        this.SponsorDetail = res.data;
        var oldSposer = parseInt(this.VerifiedSponsorForm.get("oldSposer").value);
        if (oldSposer == this.SponsorDetail.sponcerId)
          this.studentSponsorName = this.SponsorDetail.sponcerName;
        this.location(this.SponsorDetail.countryId)
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
        // this.toastr.ErrorToastr("Something went wrong");
        $('#loader').hide();
      }
    })
  }
  verifirySponsor(isApprove) {
    this.VerifiedSponsorForm.get("isApprove").setValue(isApprove);
    if (this.VerifiedSponsorForm.valid) {
      var input = this.VerifiedSponsorForm.getRawValue();
      this.SponsorService.addSponsorMapping(input).subscribe(res => {

        if (!res.status) {
          $('#loader').hide();
          this.toastr.SuccessToastr("Successfully Approved");
          this.modalService.dismissAll();
          $(".table").DataTable().ajax.reload();
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
  }

  getSponsorList() {
    this.SponsorService.GetAllSponsor().subscribe(res => {
      console.log("sponser name",res);
      //this.resetsponcerform();
      if (res.status) {
        $('#loader').hide();
        this.SponsorList = res.data; var sponsor = this.SponsorList.find(m => m.sponcerId == this.SponsorDetail.sponcerId);
        if (!sponsor)
          this.SponsorList.push({
            sponcerName: this.SponsorDetail.sponcerName,
            sponcerId: this.SponsorDetail.sponcerId
          });
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
  loadCountry() {
    $("#loader").show();
    this.accountService.getCountries().subscribe(res => {
      if (res.status) {
        this.countries = res.data;
        $("#loader").hide();

      }
    }, (err: any) => {
      if (err.status == 401) {
        this.route.navigate(['/'])
      }
      else {
        this.toastr.ErrorToastr("Something went wrong");
      }
      $("#loader").hide();
    });
  }
  location(CInput: any) {
    if (CInput) {
      $("#loader").show();
      let input = {
        Id: CInput
      }
      this.accountService.getCitiesByCountryId(input).subscribe(res => {
        if (res.status) {
          this.cityList = res.data;
        }
        else {
          this.toastr.ErrorToastr(res.message);
        }
        $("#loader").hide();
      }, (err: any) => {
        if (err.status == 401) {
          this.route.navigate(['/'])
        }
        else {
          this.toastr.ErrorToastr("Something went wrong");
        }
        $("#loader").hide();
      })
    }
  }

  openReason() {
    this.modalService.open(this.SponsorReject, { ariaLabelledBy: 'modal-basic-title', size: 'lg', backdrop: false });
  }
  rejectSponsor(isApprove)
  {
    this.VerifiedSponsorForm.get("isApprove").setValue(isApprove);
    if (this.VerifiedSponsorForm.valid) {
      var input = this.VerifiedSponsorForm.getRawValue();
      this.SponsorService.rejectSponsorMapping(input).subscribe(res => {
        console.log("rejectsponser",res);

        if (res.status) {
          $('#loader').hide();
          // this.toastr.SuccessToastr(res.data);
          this.toastr.ErrorToastr("Sponser Mapping Rejected");
          this.modalService.dismissAll();
          $(".table").DataTable().ajax.reload();
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

  }
}
