import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { mixinColor } from '@angular/material/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { AccountService } from 'src/app/Services/account.service';
import { AlertServiceService } from 'src/app/Services/alert-service.service';
import { CountryCategoryService } from 'src/app/Services/country-category.service';
import { ToastrServiceService } from 'src/app/Services/toastr-service.service';



@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.sass']
})
export class CategoryComponent implements OnInit {


  isSubmitted: boolean = false;
  modalTitle = 'Add Condition';

  dtOptions: DataTables.Settings = {};
  dtOptionsmap: DataTables.Settings = {};
  hasViewModel: boolean = false;
  Countrydata = [];
  CategoryList: any;
  CategoryForm: FormGroup = new FormGroup({
    CategoryId: new FormControl(),
    CategoryName: new FormControl(),
    ColorCode: new FormControl(),
    Age: new FormControl(),
  })
  CountryMappingForm: FormGroup = new FormGroup({
    CategoryId: new FormControl(),
    CountryId: new FormControl(),
    MappingId: new FormControl(),

  })
  @ViewChild("CategoryModal") CategoryModal: ElementRef
  @ViewChild("CountryMappingModal") CountryMappingModal: ElementRef
  selectedindex: string = '0';
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private accountservices: AccountService, private router: Router, private toastr: ToastrServiceService, private alerts: AlertServiceService, private countrycategoryservice: CountryCategoryService) {
    this.CategoryForm = formBuilder.group({
      CategoryName: ['', Validators.required],
      ColorCode: ['', Validators.required],
      CategoryId: ['0'],
      Age: ['0', Validators.required],
    })
    this.CountryMappingForm = formBuilder.group({
      CategoryId: ['', Validators.required],
      CountryId: ['', Validators.required],
      MappingId: ['0'],
    })
  }
  loadform() {
    if (this.Countrydata.length == 0) {
      this.accountservices.getCountries().subscribe(res => {

        if (res.status) {
                    this.Countrydata = res.data;

        }
        else {
          this.toastr.ErrorToastr(res.message);
        }

      });

    }
    this.countrycategoryservice.GetCategoryList().subscribe(res => {
      if (res.status) {
        
        this.CategoryList = res.data;
      } else {
        this.toastr.ErrorToastr("Something went wrong");
      }

    });


    // forkJoin([ CategoryId]).subscribe(result => {
    //   $('#loader').hide();
    //   if (result[0]) {
    //     if (result[0].status) {
    //       this.Countrydata =result[0].data;
    //     }
    //     else {
    //       this.toastr.ErrorToastr(result[0].message);
    //     }
    //   }
    //   if (result[1]) {
    //     if (result[1].status) {
    //       this.CategoryList = result[1].data;
    //     } else {
    //       this.toastr.ErrorToastr("Something went wrong");
    //     }
    //   }
    //   $('#loader').hide();
    // });

  }

  ngOnInit(): void {
    this.loadData();
    this.loadform();
    this.loadCountryMapping();
    // this.loadCountryMapping();
    // $("#category").DataTable().ajax.reload();
  }
  get f() {
    return this.CategoryForm.controls;
  }
  get fmap() {
    return this.CountryMappingForm.controls;
  }
  CategoryData: any;
  CountryMappingData: any;
  loadData() {
    $('#loader').show();

    var inputdata = {
      searchText: "",
      pageSize: 10,
      startFrom: 0,
      orderBy: "",
      orderByDirection: "",
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
        this.CategoryData = [];

        inputdata.startFrom = dataTablesParameters.start;
        inputdata.pageSize = dataTablesParameters.length;
        inputdata.searchText = dataTablesParameters.search.value;

        inputdata.orderByDirection = dataTablesParameters.order[0].dir;
        inputdata.orderBy = dataTablesParameters.columns[dataTablesParameters.order[0].column].name;

        this.countrycategoryservice.GetSpCategory(inputdata).subscribe(res => {

          if (res.status) {
            this.CategoryData = res.data.records;
          }
          else {
                        this.toastr.ErrorToastr("Something went wrong");
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
            this.router.navigate(['/'])
          }
          else {
                        this.toastr.ErrorToastr("Something went wrong");
          }
        });
      },
      columns: [

        { name: 'CategoryName', data: "categoryName", orderable: true, searchable: true },
        {
          name: 'ColorCode', data: "colorCode", orderable: true, searchable: true, render: function (data, type, row) {
            return '<div style="background:' + data + ';height:15px;width:15px" ></div>'
          },
        },
        { name: 'age', data: "age", orderable: true, searchable: true },
        { name: 'name', data: 'createdBy', orderable: true, searchable: true },
        {
          name: 'UpdatedDate', data: 'updatedDate', orderable: true, searchable: true, render: function (data, type, row) {
            return moment(data + 'Z').format('DD/MM/YY hh:mm A')
          },
        },

        {
          name: '', data: 'categoryId', orderable: false, searchable: false, render: function (data, type, row) {

            return '<button class="btn-shadow btn btn-success me-2 pointer" onClick=\"document.getElementById(\'hdnClickEdit\').value=' + data + '; document.getElementById(\'hdnClickEdit\').click()\">Edit</button><button class="btn-shadow btn btn-warning pointer me-2" onClick=\"document.getElementById(\'hdnClickView\').value=' + data + '; document.getElementById(\'hdnClickView\').click()\">View</button><button class="btn-shadow btn btn-danger  pointer" onClick=\"document.getElementById(\'hdnClickDelete\').value=' + data + '; document.getElementById(\'hdnClickDelete\').click()\">Delete</button>';
          },
        }
      ],
      autoWidth: false
    }
    $('#loader').hide();
  }
  openModal(id: any = 0, isView: any) {
    this.isSubmitted = false;
    this.hasViewModel = isView;
    this.resetCategoryForm();
    this.CategoryForm.reset(this.CategoryForm.value);

    if (id > 0) {
      this.EditCategory(id);
      this.modalTitle = 'Update Category';

    }
    else {
      this.modalTitle = "Add Category"

    }
    if (isView) {

      this.CategoryForm.get("CategoryName")?.disable();
      this.CategoryForm.get("ColorCode")?.disable();
      this.modalTitle = "View Category";
    }
    else {
      this.CategoryForm.enable();
    }


    this.modalService.open(this.CategoryModal, { ariaLabelledBy: 'modal-basic-title', backdrop: false });
  }
  openModalMapping(id: any = 0, isView: any) {
    this.loadform();
    // this.CategoryList = this.countrycategoryservice.GetCategoryList();
    this.isSubmitted = false;
    this.hasViewModel = isView;
    this.resetCategoryMappingForm();
    this.CountryMappingForm.reset(this.CountryMappingForm.value);

    if (id > 0) {
      this.EditCountryMapping(id);
      this.modalTitle = 'Update Country of Nationality Mapping';

    }
    else {
      this.modalTitle = "Add Country of Nationality Mapping"

    }
    if (isView) {

      this.CountryMappingForm.get("CountryId")?.disable();
      this.CountryMappingForm.get("CategoryId")?.disable();
      this.modalTitle = "View Country of Nationality Mapping";
    }
    else {
      this.CountryMappingForm.enable();
    }


    this.modalService.open(this.CountryMappingModal, { ariaLabelledBy: 'modal-basic-title', backdrop: false });
  }
  resetCategoryMappingForm() {
    this.CountryMappingForm.get("CountryId").setValue('');
    this.CountryMappingForm.get("CategoryId").setValue('');
    this.CountryMappingForm.get("MappingId").setValue(0);
  }
  SaveCategory() {
    this.isSubmitted = true;
    if (this.CategoryForm.valid) {
      $('#loader').show();
      var formVal = JSON.parse(JSON.stringify(this.CategoryForm.getRawValue()));

      formVal.ConditonId = parseInt(formVal.ConditonId);
      this.countrycategoryservice.AddCategory(formVal).subscribe(res => {

        if (res.status) {
          this.modalService.dismissAll();
          if (res.data.categoryId == 0)
            this.toastr.SuccessToastr("Category Added Successfully.");


          else {
            this.toastr.SuccessToastr("Category Updated Successfully");
          }
          $('#loader').hide();
          $("#category").DataTable().ajax.reload();

        }


      }, (err: any) => {

        $('#loader').hide();
        this.toastr.ErrorToastr("Something missing");
      })
    }
  }
  resetCategoryForm() {
    this.CategoryForm.get("CategoryName")?.setValue('');
    this.CategoryForm.get("ColorCode")?.setValue('');
  }
  EditCategory(id: any) {
    $('#loader').show();
    var input = {
      CategoryId: id
    }
    this.countrycategoryservice.GetCategoryById(input).subscribe(res => {
      //this.resetsponcerform();
      if (res.status) {
        $('#loader').hide();
        this.CategoryForm.get('CategoryId')?.setValue(res.data.categoryId);
        this.CategoryForm.get('CategoryName')?.setValue(res.data.categoryName);
        this.CategoryForm.get('ColorCode')?.setValue(res.data.colorCode);
        this.CategoryForm.get('Age')?.setValue(res.data.age);

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
                this.toastr.ErrorToastr("Something went wrong");
        $('#loader').hide();
      }
    })
  }
  DeleteCategory(e) {

    this.alerts.ComfirmAlert("Do you want to delete Category?", "Yes", "No").then(res => {

      if (res.isConfirmed) {
        $('#loader').show();
        var input = {
          CategoryId: e.target.value
        }
        this.countrycategoryservice.RemoveCategory(input).subscribe(res => {

          if (res.status) {
            this.toastr.SuccessToastr("Category deleted successfully.");
            $('#loader').hide();
            $("#category").DataTable().ajax.reload();
          }
          else {
            this.toastr.ErrorToastr(res.message);
            $('#loader').hide();

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
              $('#loader').hide();
            }
          })
      }
    })
  }

  clickEdit(e) {
    console.log("category value", e.target.value)
    this.openModal(e.target.value, false)
  }
  clickView(e) {
    this.openModal(e.target.value, true)
  }
  IsAgeshow : any = false;
  ChangeCategory(){
     var formVal = JSON.parse(JSON.stringify(this.CountryMappingForm.getRawValue()));
     var category = this.CategoryList.find(A => A.categoryId == formVal.CategoryId);
     if(category != undefined && category != null && category != ""){
      if(category.categoryName == 'High Risk' || category.categoryName == 'Medium Risk'){
        this.IsAgeshow = true;
      }else{
        this.IsAgeshow = false;
        this.CountryMappingForm.get("Age").setValue(0);
      }
     }
  }
  SaveCountryMapping() {

    this.isSubmitted = true;
    if (this.CountryMappingForm.valid) {
      $('#loader').show();
      var formVal = JSON.parse(JSON.stringify(this.CountryMappingForm.getRawValue()));

      formVal.MappingId = parseInt(formVal.MappingId);
      this.countrycategoryservice.AddCountryMapping(formVal).subscribe(res => {

        if (res.status) {
          this.modalService.dismissAll();
          if (res.data.mappingId == 0)
            this.toastr.SuccessToastr("Category Added Successfully.");


          else {
            this.toastr.SuccessToastr("Category Updated SuccessFully");
          }
          $('#loader').hide();
          $("#Mapping").DataTable().ajax.reload();

        }
        else {
          this.toastr.ErrorToastr("Duplicate country cannot be added");
          $("#loader").hide();
        }
      }, (err: any) => {

        $('#loader').hide();
        this.toastr.ErrorToastr("Something missing");
      })
    }
  }
  EditCountryMapping(id: any) {
    $('#loader').show();
    var input = {
      MappingId: id
    }
    this.countrycategoryservice.GetCountryMappingBYId(input).subscribe(res => {
      //this.resetsponcerform();
      if (res.status) {
        $('#loader').hide();
        this.CountryMappingForm.get('CategoryId')?.setValue(res.data.categoryId);
        this.CountryMappingForm.get('CountryId')?.setValue(res.data.countryId);
        this.CountryMappingForm.get('MappingId')?.setValue(res.data.mappingId);

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
                this.toastr.ErrorToastr("Something went wrong");
        $('#loader').hide();
      }
    })
  }
  DeleteCategorymap(e) {
    this.alerts.ComfirmAlert("Do you want to delete Category?", "Yes", "No").then(res => {

      if (res.isConfirmed) {
        $('#loader').show();
        var input = {
          MappingId: e.target.value
        }
        this.countrycategoryservice.RemoveCountryMapping(input).subscribe(res => {

          if (res.status) {
            this.toastr.SuccessToastr("Category deleted successfully.");
            $('#loader').hide();
            $("#Mapping").DataTable().ajax.reload();
          }
          else {
            this.toastr.ErrorToastr(res.message);
            $('#loader').hide();

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
              $('#loader').hide();
            }
          })
      }
    })

  }

  loadCountryMapping() {
    $('#loader').show();

    var input = {
      searchText: "",
      pageSize: 10,
      startFrom: 0,
      orderBy: "",
      orderByDirection: "",
    }
    this.dtOptionsmap = {
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
        this.CountryMappingData = [];

        input.startFrom = dataTablesParameters.start;
        input.pageSize = dataTablesParameters.length;
        input.searchText = dataTablesParameters.search.value;

        input.orderByDirection = dataTablesParameters.order[0].dir;
        input.orderBy = dataTablesParameters.columns[dataTablesParameters.order[0].column].name;

        this.countrycategoryservice.SpGetCountryMapping(input).subscribe(res => {
          
          if (res.status) {
            this.CountryMappingData = res.data.records;
          }
          else {
                        this.toastr.ErrorToastr("Something went wrong");
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
            this.router.navigate(['/'])
          }
          else {
            this.toastr.ErrorToastr("Something went wrong");
          }
        });
      },
      columns: [

        { name: 'category', data: "category", orderable: true, searchable: true },
        { name: 'country', data: "country", orderable: true, searchable: true },
        { name: 'createdby', data: 'createdBy', orderable: true, searchable: true },
        {
          name: 'updateddate', data: 'updatedDate', orderable: true, searchable: true, render: function (data, type, row) {
            return moment(data + 'Z').format('DD/MM/YY hh:mm A')
          },
        },

        {
          name: '', data: 'mappingId', orderable: false, searchable: false, render: function (data, type, row) {

            return '<button class="btn-shadow btn btn-success me-2 pointer" onClick=\"document.getElementById(\'hdnClickEditmap\').value=' + data + '; document.getElementById(\'hdnClickEditmap\').click()\">Edit</button><button class="btn-shadow btn btn-warning pointer me-2" onClick=\"document.getElementById(\'hdnClickViewmap\').value=' + data + '; document.getElementById(\'hdnClickViewmap\').click()\">View</button><button class="btn-shadow btn btn-danger  pointer" onClick=\"document.getElementById(\'hdnClickDeletemap\').value=' + data + '; document.getElementById(\'hdnClickDeletemap\').click()\">Delete</button>';
          },
        }
      ],
      autoWidth: false
    }
    $('#loader').hide();

  }
  setmetgroupindex(tabEvent: any) {

    if (tabEvent != null && tabEvent >= 0) {
      this.selectedindex = tabEvent.toString();
    } else {
      this.selectedindex = tabEvent.index.toString();
      const tab = tabEvent.index.toString();
      const selectedTab = tabEvent.tab.textLabel;
      if (selectedTab == "Category") {
        $("#category").DataTable().ajax.reload();
        // this.loadData();

      } else if (selectedTab == "Nationality Mapping") {
        this.loadCountryMapping();
        $("#Mapping").DataTable().ajax.reload();
        // this.loadCountryMapping();
        // $("#Mapping").DataTable().ajax.reload();
      }
      this.isSubmitted = false;
    }
  }
  clickEditmap(e) {
    console.log(e.target.value);
    this.openModalMapping(e.target.value, false)
  }
  clickViewmap(e) {
    this.openModalMapping(e.target.value, true)
  }

}
