import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/Models/user.model';
import { AlertServiceService } from 'src/app/Services/alert-service.service';
import { ToastrServiceService } from 'src/app/Services/toastr-service.service';
import { UserManagement } from 'src/app/Services/user-management.service';
import { Country } from 'src/app/Models/country.model';
import { City } from 'src/app/Models/city.model';
import { forkJoin } from 'rxjs';
import { AccountService } from 'src/app/Services/account.service';
import { data } from 'jquery';
import { EmittService } from 'src/app/Services/emitt.service';
import dayjs from 'dayjs';
import intlTelInput from 'intl-tel-input';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.sass']
  
})
export class UsersComponent implements OnInit {
  @ViewChild('phoneInput') phoneInput!: ElementRef;
  myValue = true;
  formfilter: FormGroup = new FormGroup({
    filtervalue: new FormArray([]),
    searchval: new FormControl()
  })
  checktoResetForm: boolean = false;
  hidePassword: boolean = false;
  fileDetails: any;
  agentCountryId: any;
  agentCityId: any;
  country1 = [];
  dropDownForm: FormGroup;
  countryAndCity: Array<City> = [];
  countries1: Array<Country> = [];
  dCities: Array<City> = [];
  userTypes: Array<number>;
  search1: "";
  phoneNumber: null;
  dropdownList = [];
  userId1 = [];
  // dropdownSettings: IDropdownSettings = {};
  // citieDDLSettings: IDropdownSettings = {};
  form: FormGroup = new FormGroup({
    countryCode: new FormControl(),
    userId: new FormControl(),
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),
    userType: new FormControl(),
    rCountries: new FormControl(),
    countries: new FormControl(),
    cities: new FormControl(),
    //Teacher Fields
    contactNo: new FormControl(),
    homeNumber: new FormControl(),
    dateOfBirth: new FormControl(),
    address: new FormControl(),
    emergencyContactName1: new FormControl(),
    emergencyAddress1: new FormControl(),
    emergencyNumber1: new FormControl(),
    emergencyContactName2: new FormControl(),
    emergencyAddress2: new FormControl(),
    emergencyNumber2: new FormControl(),
    CV: new FormControl(),
    fileDetails: new FormControl(),
  });
  countryCodes = [
    { name: 'United States', dial_code: '+1' },
    { name: 'United Kingdom', dial_code: '+44' },
    { name: 'India', dial_code: '+91' },
    { name: 'Australia', dial_code: '+61' },
    { name: 'Canada', dial_code: '+1' },
    { name: 'Pakistan', dial_code: '+92' },
    { name: 'Germany', dial_code: '+49' },
    { name: 'France', dial_code: '+33' },
    { name: 'Japan', dial_code: '+81' },
    { name: 'Brazil', dial_code: '+55' },
    { name: 'China', dial_code: '+86' },
    { name: 'South Africa', dial_code: '+27' },
    { name: 'Mexico', dial_code: '+52' },
    { name: 'Saudi Arabia', dial_code: '+966' },
    { name: 'United Arab Emirates', dial_code: '+971' },
    { name: 'Russia', dial_code: '+7' },
    { name: 'Italy', dial_code: '+39' },
    { name: 'Spain', dial_code: '+34' },
    { name: 'Turkey', dial_code: '+90' },
    { name: 'South Korea', dial_code: '+82' },
    { name: 'Indonesia', dial_code: '+62' },
    { name: 'Nigeria', dial_code: '+234' },
    { name: 'Egypt', dial_code: '+20' },
    { name: 'Bangladesh', dial_code: '+880' },
    { name: 'Argentina', dial_code: '+54' },
    { name: 'Malaysia', dial_code: '+60' },
    { name: 'Singapore', dial_code: '+65' },
    { name: 'Philippines', dial_code: '+63' },
    { name: 'Vietnam', dial_code: '+84' },
    { name: 'Thailand', dial_code: '+66' },
    { name: 'New Zealand', dial_code: '+64' },
    { name: 'Sweden', dial_code: '+46' },
    { name: 'Norway', dial_code: '+47' },
    { name: 'Denmark', dial_code: '+45' },
    { name: 'Netherlands', dial_code: '+31' },
    { name: 'Switzerland', dial_code: '+41' },
    { name: 'Ireland', dial_code: '+353' },
    { name: 'Austria', dial_code: '+43' },
    { name: 'Portugal', dial_code: '+351' },
    { name: 'Belgium', dial_code: '+32' },
    { name: 'Finland', dial_code: '+358' },
    { name: 'Greece', dial_code: '+30' },
    { name: 'Czech Republic', dial_code: '+420' },
    { name: 'Poland', dial_code: '+48' },
    { name: 'Chile', dial_code: '+56' },
    { name: 'Colombia', dial_code: '+57' },
    { name: 'Venezuela', dial_code: '+58' },
    { name: 'Peru', dial_code: '+51' },
    { name: 'Israel', dial_code: '+972' },
    { name: 'Kuwait', dial_code: '+965' },
    { name: 'Qatar', dial_code: '+974' },
    { name: 'Bahrain', dial_code: '+973' },
    { name: 'Oman', dial_code: '+968' },
    { name: 'Iraq', dial_code: '+964' },
    { name: 'Afghanistan', dial_code: '+93' },
    { name: 'Sri Lanka', dial_code: '+94' },
    { name: 'Maldives', dial_code: '+960' },
    { name: 'Nepal', dial_code: '+977' },
    { name: 'Myanmar', dial_code: '+95' },
    { name: 'Cambodia', dial_code: '+855' },
    { name: 'Hong Kong', dial_code: '+852' },
    { name: 'Taiwan', dial_code: '+886' },
    { name: 'Albania', dial_code: '+355' },
    { name: 'Algeria', dial_code: '+213' },
    { name: 'Andorra', dial_code: '+376' },
    { name: 'Angola', dial_code: '+244' },
    { name: 'Antigua and Barbuda', dial_code: '+1-268' },
    { name: 'Armenia', dial_code: '+374' },
    { name: 'Azerbaijan', dial_code: '+994' },
    { name: 'Bahamas', dial_code: '+1-242' },
    { name: 'Barbados', dial_code: '+1-246' },
    { name: 'Belarus', dial_code: '+375' },
    { name: 'Bhutan', dial_code: '+975' },
    { name: 'Bolivia', dial_code: '+591' },
    { name: 'Bosnia and Herzegovina', dial_code: '+387' },
    { name: 'Botswana', dial_code: '+267' },
    { name: 'Brunei', dial_code: '+673' },
    { name: 'Burkina Faso', dial_code: '+226' },
    { name: 'Burundi', dial_code: '+257' },
    { name: 'Cape Verde', dial_code: '+238' },
    { name: 'Cameroon', dial_code: '+237' },
    { name: 'Central African Republic', dial_code: '+236' },
    { name: 'Chad', dial_code: '+235' },
    { name: 'Comoros', dial_code: '+269' },
    { name: 'Congo', dial_code: '+242' },
    { name: 'Cuba', dial_code: '+53' },
    { name: 'Djibouti', dial_code: '+253' },
    { name: 'Dominica', dial_code: '+1-767' },
    { name: 'Dominican Republic', dial_code: '+1-809' },
    { name: 'Ecuador', dial_code: '+593' },
    { name: 'El Salvador', dial_code: '+503' },
    { name: 'Equatorial Guinea', dial_code: '+240' },
    { name: 'Eritrea', dial_code: '+291' },
    { name: 'Estonia', dial_code: '+372' },
    { name: 'Eswatini (Swaziland)', dial_code: '+268' },
    { name: 'Ethiopia', dial_code: '+251' },
    { name: 'Fiji', dial_code: '+679' },
    { name: 'Gabon', dial_code: '+241' },
    { name: 'Gambia', dial_code: '+220' },
    { name: 'Georgia', dial_code: '+995' },
    { name: 'Ghana', dial_code: '+233' },
    { name: 'Grenada', dial_code: '+1-473' },
    { name: 'Guatemala', dial_code: '+502' },
    { name: 'Guinea', dial_code: '+224' },
    { name: 'Guinea-Bissau', dial_code: '+245' },
    { name: 'Guyana', dial_code: '+592' },
    { name: 'Haiti', dial_code: '+509' },
    { name: 'Honduras', dial_code: '+504' },
    { name: 'Iceland', dial_code: '+354' },
    { name: 'Ivory Coast (Côte d\'Ivoire)', dial_code: '+225' },
    { name: 'Jamaica', dial_code: '+1-876' },
    { name: 'Jordan', dial_code: '+962' },
    { name: 'Kazakhstan', dial_code: '+7' },
    { name: 'Kenya', dial_code: '+254' },
    { name: 'Kosovo', dial_code: '+383' },
    { name: 'Laos', dial_code: '+856' },
    { name: 'Latvia', dial_code: '+371' },
    { name: 'Lebanon', dial_code: '+961' },
    { name: 'Lesotho', dial_code: '+266' },
    { name: 'Liberia', dial_code: '+231' },
    { name: 'Libya', dial_code: '+218' },
    { name: 'Liechtenstein', dial_code: '+423' },
    { name: 'Lithuania', dial_code: '+370' },
    { name: 'Luxembourg', dial_code: '+352' },
    { name: 'Madagascar', dial_code: '+261' },
    { name: 'Malawi', dial_code: '+265' },
    { name: 'Mali', dial_code: '+223' },
    { name: 'Malta', dial_code: '+356' },
    { name: 'Mauritania', dial_code: '+222' },
    { name: 'Mauritius', dial_code: '+230' },
    { name: 'Moldova', dial_code: '+373' },
    { name: 'Mongolia', dial_code: '+976' },
    { name: 'Montenegro', dial_code: '+382' },
    { name: 'Morocco', dial_code: '+212' },
    { name: 'Mozambique', dial_code: '+258' },
    { name: 'Namibia', dial_code: '+264' },
    { name: 'Niger', dial_code: '+227' },
    { name: 'Paraguay', dial_code: '+595' },
    { name: 'Rwanda', dial_code: '+250' },
    { name: 'Seychelles', dial_code: '+248' },
    { name: 'Tanzania', dial_code: '+255' },
    { name: 'Togo', dial_code: '+228' },
    { name: 'Trinidad and Tobago', dial_code: '+1-868' },
    { name: 'Uganda', dial_code: '+256' },
    { name: 'Uruguay', dial_code: '+598' },
    { name: 'Zambia', dial_code: '+260' },
    { name: 'Zimbabwe', dial_code: '+263' }
    // Add more countries as needed
  ];
  countryData = [];
  selectedItems = [];
  isSubmitted: boolean = false;
  userdetails: Array<User> = [];
  studentInquiry: User = new User();
  dtOptions: DataTables.Settings = {};
  constructor(private usermanagement: UserManagement, private router: Router, private alerts: AlertServiceService, private toastr: ToastrServiceService, private account: AccountService, private modalService: NgbModal, private formBuilder: FormBuilder, private emittService: EmittService) {
    this.form = formBuilder.group({
      userId: [0],
      firstName: [null, [Validators.required, Validators.pattern(/^[A-Za-z][a-zA-Z0-9 \_]{2,}$/)]],
      lastName: [null, [Validators.required, Validators.pattern(/^[A-Za-z][a-zA-Z0-9 \_]{2,}$/)]],
      email: [null, [Validators.required, Validators.pattern(/^[a-z][A-Za-z0-9\.\_]+@[A-Za-z]*.{2}[a-z\.]{2,4}[a-zA-Z]{2,4}$/)]],
      userType: [null, [Validators.required]],
      //countries: formFuilder.array([]),
      rCountries: [null],
      countries: [null],
      cities: [null],
      //password: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$=!#%*?&])[A-Za-z\d@#=$!%*?&]{8,}$/)]],
      
      contactNo: [null],
      homeNumber: [null],
      dateOfBirth: [null],
      address: [null],
      emergencyContactName1: [null],
      emergencyAddress1: [null],
      emergencyNumber1: [null],
      emergencyContactName2: [null],
      emergencyAddress2: [null],
      emergencyNumber2: [null],
      CV: [null],
      fileDetails: [null],
      countryCode: [null],


    });
    
    emittService.onChangeAddApplicationbtnHideShow(false);
  }
  
  Users: Array<User> = [];
  user?: User;
  ngOnInit(): void {
    
    this.loadForm();
    this.loadUsers(0);
    this.countries1;
 
    this.dropdownList = [
      { id: 1, name: 'Admin' },
      // { id: 2, name: 'Admission department' },
      { id: 3, name: 'Regional manager' },
      { id: 4, name: 'Agent' }
      // { id: 5, name: 'Teacher' }
    ];
    // Promise. resolve().then(()=>{
    //   console.log(" Foorter compnent");
      
    //     const inputElement = document.querySelector("#phone5656565")as HTMLInputElement ;
    //     console.log("inputElement:", inputElement);
  
    //     if (inputElement) {
    //       console.log("into the function")
    //       intlTelInput(inputElement, {
    //         initialCountry: 'us',
    //         separateDialCode: true,
    //         utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js'
    //       });
    //     } else {
    //       console.error("Input element with ID 'phone5656565' not found.");
    //     }})
 
 
  }
  get f() {
    return this.form.controls;
  }
  onFileChoose(event: any) {
    const file = event.target.files[0];
    
    console.log("files",file);
    if (file) {
      //this.form.get('CV')?.setValue(file);
      this.form.get('fileDetails')?.setValue(file);

      this.fileDetails = this.form.get('fileDetails').value;

      console.log("File Details are: ",this.fileDetails)
    }
  }
  onChange(id: number, isChecked: boolean) {
    //var emailFormArray = <FormArray>this.formfilter.controls.id;
 
    if (isChecked) {
      this.userId1.push(id);
    } else {
      let index = this.userId1.findIndex(x => x.value == id)
      this.userId1.splice(index);
    }
  }
 
 
  isShown: boolean = false; // hidden by default
  toggleShow() {
    this.isShown = !this.isShown;
  }
 
  FilterUser() {
    let formVal = JSON.stringify(this.formfilter.getRawValue());
    let input = {
      ...JSON.parse(formVal)
    }
    this.userId1 = this.userId1;
    //this.userTypes = this.userTypes;
    //this.search1 = input.searchval;
    // this.loadStudentApplication();
    $(".table").DataTable().ajax.reload();
  }
 
LoadUser(Usertype:any){
 
}
 
  loadForm() {
    $('#loader').show();
    let paginationInput = {
      index: 0,
      size: 0
    }
 
    var countryReq = this.account.getCountries();
    forkJoin([countryReq]).subscribe(result => {
 
      if (result[0]) {
        if (result[0].status) {
          this.countries1 = result[0].data;
        } else {
          this.toastr.ErrorToastr("Something went wrong.");
        }
      }
      $('#loader').hide();
    })
  }
Storeeindex:any;
  tabClick(e) {
    this.Storeeindex = e;
    if(this.Storeeindex != undefined){
    if (e.index == 0) {
      this.loadUsers(0);
          $(".table").DataTable().ajax.reload();
    } else if (e.index == 1) {
      this.loadUsers(1);
        $(".table").DataTable().ajax.reload();
    }
    else if (e.index == 2) {
      this.loadUsers(8);
      $(".table").DataTable().ajax.reload();
    } 
    else if (e.index == 3) {
      
      this.loadUsers(3);
        $(".table").DataTable().ajax.reload();
    }else if (e.index == 4) {
      
      this.loadUsers(4);
        $(".table").DataTable().ajax.reload();
    }
    else if (e.index == 5) {
      
      this.loadUsers(5);
        $(".table").DataTable().ajax.reload();
    }
    else if (e.index == 6) {
      
      this.loadUsers(6);
        $(".table").DataTable().ajax.reload();
    }
    else if (e.index == 7) {
    
      this.loadUsers(7);
        $(".table").DataTable().ajax.reload();
    }
  }else{
     this.loadUsers(0);
       $(".table").DataTable().ajax.reload();
  }
  }
 
 
StoreUsertype:any = 0;
  loadUsers(Usertype:any) {
this.StoreUsertype = Usertype;
    $('#loader').show();
    let input = {
      size: 10,
      index: 1,
      userType: this.StoreUsertype,
      Search: '',
      OrderByDirection: '',
      sortingColumn: 0,
      OrderBy: ''
    }
 
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching: true,
      language: {
        infoFiltered: "",
        emptyTable:"No data found"
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.userdetails = [];
        input.size = dataTablesParameters.length;
        input.index = dataTablesParameters.start / dataTablesParameters.length;
        input.index++;
        input.Search = dataTablesParameters.search.value;
        input.OrderByDirection = dataTablesParameters.order[0].dir;
        //input.OrderByDirection = "FullName"
        input.sortingColumn = dataTablesParameters.order[0].column;
        input.OrderBy = dataTablesParameters.columns[input.sortingColumn].data;
        input.userType = this.StoreUsertype;
 
        this.usermanagement.GetUsers(input).subscribe(res => {
 
          if (res.status) {
            this.userdetails = res.data.records;
          }
          else {
            this.toastr.ErrorToastr("Something went wrong.");
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
            this.toastr.ErrorToastr("Something went wrong.");
          }
        });
      },
      columns: [{ data: '', orderable: true, searchable: true }, { data: 'firstName', orderable: true, searchable: true }, { data: 'email', orderable: true, searchable: true }, { data: 'homeNumber', orderable: true, searchable: true }, { data: 'dateOfBirth', orderable: true, searchable: true }, { data: 'address', orderable: true, searchable: true },{ data: 'contactNo', orderable: true, searchable: true }, { data: 'emergencyContactName1', orderable: true, searchable: true }, { data: 'emergencyContactName2', orderable: true, searchable: true }, { data: 'emergencyAddress1', orderable: true, searchable: true }, { data: 'emergencyAddress2', orderable: true, searchable: true }, { data: 'emergencyNumber1', orderable: true, searchable: true }, { data: 'emergencyNumber2', orderable: true, searchable: true }, { data: 'userTypeName', orderable: true, searchable: true },{ data: 'fileDetails', orderable: true, searchable: true}, {data:'', orderable:false, searchable:false}],
      autoWidth: false
    }
  }
  nrSelect = '';
  nrCountrySelect = '';
 
  open(content: any) {
    console.log("open modal");
    this.isNew = true
    this.form.reset();
    this.isSubmitted = false;
    this.nrSelect = '';
    this.nrCountrySelect = '';
    this.resetInquiryForm();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: false });
    // setTimeout(() => {
    //   const inputElement = document.querySelector("#phone5656565") as HTMLInputElement;
    //   console.log("inputElement:", inputElement);
    
    //   if (inputElement) {
    //     console.log("into the function");
    //     intlTelInput(inputElement, {
    //       initialCountry: 'us',
    //       separateDialCode: true,
    //       utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js'
    //     });
    //   } else {
    //     console.error("Input element with ID 'phone5656565' not found.");
    //   }
    // }, 10);
  }
  // open(content: any) {
  //   console.log("open modal");
  
  //   this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: false });
  
  //   setTimeout(() => {
  //     const inputElement = document.querySelector("#phone5656565") as HTMLInputElement;
  
  //     if (inputElement) {
  //       console.log("Initializing intlTelInput");
  //       intlTelInput(inputElement, {
  //         initialCountry: 'us',
  //         separateDialCode: true,
  //         utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js',
  //       });
  //     } else {
  //       console.error("Input element with ID 'phone5656565' not found.");
  //     }
  //   }, 200); 
  // }
  
 
  view(id: number){
    console.log("Id is", id);
  }
  edit(content: any, index: number) {
    this.checktoResetForm = true;
    this.isNew = false
    this.isSubmitted = false;
    this.form.reset();
    this.resetInquiryForm();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: false });
    this.form.get("email")?.setValue(this.userdetails[index].email);
    this.form.get("firstName")?.setValue(this.userdetails[index].firstName);
    this.form.get("lastName")?.setValue(this.userdetails[index].lastName);
    this.form.get("userTypeName")?.setValue(this.userdetails[index].userTypeName);
   
    this.form.get("contactNo")?.setValue(this.userdetails[index].contactNo);
   
    this.form.get("homeNumber")?.setValue(this.userdetails[index].homeNumber);
   
    this.form.get("address")?.setValue(this.userdetails[index].address);
   
    this.form.get("dateOfBirth")?.setValue(this.userdetails[index].dateOfBirth);
   
    this.form.get("emergencyContactName1")?.setValue(this.userdetails[index].emergencyContactName1);
 
    this.form.get("emergencyNumber1")?.setValue(this.userdetails[index].emergencyNumber1);
 
    this.form.get("emergencyAddress1")?.setValue(this.userdetails[index].emergencyAddress1);
 
    this.form.get("emergencyContactName2")?.setValue(this.userdetails[index].emergencyContactName2);
 
    this.form.get("emergencyNumber2")?.setValue(this.userdetails[index].emergencyNumber2);
 
    this.form.get("emergencyAddress2")?.setValue(this.userdetails[index].emergencyAddress2);
 
 
 
    this.form.get("userId")?.setValue(this.userdetails[index].userId);
    this.nrSelect = this.userdetails[index].userType.toString();
    this.form.get("password")?.setValue(this.userdetails[index].password);
    this.country1 = [];
    if (this.userdetails[index].userType == 3) {
      this.userdetails[index].countries.forEach((res: any) => this.country1.push(res.countryId));
    }
 
    if (this.userdetails[index].userType == 4) {
      this.agentCountryId = this.userdetails[index].cities[0].countryId;
      this.agentCityId = this.userdetails[index].cities[0].cityId;
    }
 
    this.ChangeUserRole();
  }
 
  resetInquiryForm() {
    this.form.get("userId")?.setValue('0');
    this.country1 = [];
    this.agentCityId = null;
    this.agentCountryId = null;
  }
  isNew: boolean = false
  SaveUser() {

    this.checktoResetForm = false;
    this.isSubmitted = true;
    if (this.form.valid) {
      $("#loader").show();
      let formVal = JSON.stringify(this.form.getRawValue());
      let input = {
        ...JSON.parse(formVal)
      }
      if (input.userId == '')
        input.userId = 0;
      input.userType = parseInt(input.userType);
      this.countryAndCity = [];
      if (input.userType == 3) {
        input.rCountries.forEach((res: any) => {
          let Cdetail = new City();
          Cdetail.countryId = res;
          this.countryAndCity.push(Cdetail);
        });
      }
 
      if (input.userType == 4) {
        let Cdetail = new City();
        Cdetail.countryId = input.countries;
        Cdetail.cityId = input.cities;
        this.countryAndCity.push(Cdetail);
      }


      input.countries = this.countryAndCity;

      if(input.userType != 8){
        input.contactNo = this.phoneNumber;
      }
      input.fileDetails = this.fileDetails;
      input.countryOfResident = input.countryOfResident ? input.countryOfResident.toString() : "";
      input.countryCode = input.countryCode ? input.countryCode.toString() :
      //this.countryData.push(this.countries1)
      //input.countries = this.countryData;
      console.log("input",input);
      
      if (input.userType == 8) {
        console.log("SaveUser as Teacher");
        this.usermanagement.AddTeacher(input).subscribe(res => {
        console.log("SaveUser",res);
        if (res.status) {
            this.modalService.dismissAll();
            if (res.status.userId == 0) {
            this.toastr.SuccessToastr("User added successfully.");
            }
            else {
              this.toastr.SuccessToastr("User updated successfully.");
            }
            this.resetInquiryForm();
            this.loadUsers(this.StoreUsertype);
            $(".table").DataTable().ajax.reload();
            }
            else {
              // this.toastr.ErrorToastr("User not added.");
              this.toastr.ErrorToastr(res.message);
               $("#loader").hide();
            }
        }, (err: any) => {
        this.toastr.ErrorToastr("Something missing.");
           $("#loader").hide();
        })
      }
      else{
        console.log("SaveUser as Other");
        console.log("API Request",input);
        this.usermanagement.AddUsers(input).subscribe(res => {
          console.log("SaveUser",res);
            if (res.status) {
              this.modalService.dismissAll();
              if (res.status.userId == 0) {
                this.toastr.SuccessToastr("User added successfully.");
     
              }
              else {
     
                this.toastr.SuccessToastr("User updated successfully.");
              }
              this.resetInquiryForm();
              this.loadUsers(this.StoreUsertype);
              $(".table").DataTable().ajax.reload();
            }
            else {
              // this.toastr.ErrorToastr("User not added.");
              this.toastr.ErrorToastr(res.message);
              $("#loader").hide();
            }
          }, (err: any) => {
            this.toastr.ErrorToastr("Something missing.");
          
            $("#loader").hide();
            })
      }
    }
  }
 
  onCloseClick() {
    this.checktoResetForm = false; // Set checkresetform to false
    this.modalService.dismissAll('Cross click'); // Dismiss the modal
  }
  ChangeUserRole() {

    //Waseem's Part of checkToResetForm check because function on click of edit or open form.
    if(this.checktoResetForm == false){
      this.form.get("contactNo")?.reset();   
      this.form.get("homeNumber")?.reset();
      this.form.get("address")?.reset();
      this.form.get("dateOfBirth")?.reset();
      this.form.get("emergencyContactName1")?.reset();
      this.form.get("emergencyNumber1")?.reset();
      this.form.get("emergencyAddress1")?.reset();
      this.form.get("emergencyContactName2")?.reset();
      this.form.get("emergencyNumber2")?.reset();
      this.form.get("fileDetails")?.reset();
      this.form.get("emergencyAddress2")?.reset();

    }
    if (this.nrSelect == '3') {
      
      this.form.get("contactNo").clearValidators();
      this.form.get("rCountries").addValidators(Validators.required);
      this.form.get("cities").clearValidators();
      this.form.get("countries").updateValueAndValidity();
      this.form.get("rCountries").updateValueAndValidity();
      this.form.get("cities").updateValueAndValidity();
    }
    else if (this.nrSelect == '4') {
      this.form.get("contactNo").clearValidators();
      this.form.get("rCountries").clearValidators();
      this.form.get("rCountries").updateValueAndValidity();
      this.form.get("countries").addValidators(Validators.required);
      this.form.get("cities").addValidators(Validators.required);
    }
    else if(this.nrSelect == '8'){
      this.form.get("contactNo").updateValueAndValidity();
      this.form.get("contactNo").addValidators(Validators.required);
      this.form.get("countries").clearValidators();
      this.form.get("rCountries").clearValidators();
      this.form.get("cities").clearValidators();
      setTimeout(() => {
        const inputElement = document.getElementById('phoneInputId') as HTMLInputElement;
        if (inputElement) {
          const iti = intlTelInput(inputElement, {
            initialCountry: "us",
            separateDialCode: true,
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
          });
          inputElement.addEventListener("countrychange", () => {
            const selectedCountryData = iti.getSelectedCountryData();
            const countryCode = selectedCountryData.dialCode; 
            console.log("Selected country code:", countryCode);
    
           
            this.form.get("countryCode").setValue(countryCode);
          });
        } else {
          console.error("Input element not found.");
        }
         
      },100)
    }
    else {
      this.form.get("countries").clearValidators();
      this.form.get("rCountries").clearValidators();
      this.form.get("contactNo").clearValidators();
      this.form.get("cities").clearValidators();
      this.form.get("countries").updateValueAndValidity();
      this.form.get("rCountries").updateValueAndValidity();
      this.form.get("cities").updateValueAndValidity();
    }
  }
 
  changeContry(CInput: any) {
    if (CInput > 0) {
      let input = {
        id: parseInt(CInput.toString())
      }
      $("#loader").show();
      this.account.getCitiesByCountryId(input).subscribe(res => {
        if (res.status)
          this.dCities = res.data
        else {
          this.toastr.ErrorToastr(res.message);
        }
        $("#loader").hide();
      }, (err: any) => {
        this.toastr.ErrorToastr("Something went wrong.");
        console.log(err);
        $("#loader").hide();
      })
    }
  }
 
 
}
 
