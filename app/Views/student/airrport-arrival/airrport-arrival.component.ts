import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import moment, { min } from "moment";
import { City } from "src/app/Models/city.model";
import { AccountService } from "src/app/Services/account.service";
import { OnboardService } from "src/app/Services/onboard.service";
import { ApplicationService } from "src/app/services/application.service";
import { SessionStorageService } from "src/app/Services/session-storage.service";
import { ToastrServiceService } from "src/app/Services/toastr-service.service";

@Component({
  selector: "app-airrport-arrival",
  templateUrl: "./airrport-arrival.component.html",
  styleUrls: ["./airrport-arrival.component.sass"],
})
export class AirrportArrivalComponent implements OnInit {
  isData = false;
  formSubmittedSuccessfully: boolean = false;
  permissionMessageImage = false;
  countries = [];
  storeApplicationId: any;
  birthdatedata: any;
  agentCityId: any;
  userType: any;
  studentName: any;
  aditionalHideShow = false;
  SetDate = moment().format("YYYY-MM-DD");
  aagentCityId: any;
  arrivalAirportId: any;
  arrivalairport = [];
  dropDownForm: FormGroup;
  dCities: Array<City> = [];
  storeAirportId: any;
  arrival: any;
  isFormSubmitted = false;
  isSubmitted = false;
  departCities = [];
  arrivalCities = [];
  ispreview = false;
  arrivalDataForm: FormGroup = new FormGroup({
    AirportId: new FormControl(),
    ApplicationId: new FormControl(),
    AirlineName: new FormControl(),
    FlightNumber: new FormControl(),
    DepartureLocation: new FormControl(),
    ArrivalLocation: new FormControl(),
    ArrivalDate: new FormControl(),
    ArrivalTime: new FormControl(),
    Age: new FormControl(),
    CollegeResident: new FormControl(),
    BoardingStudent: new FormControl(),
    AccommodationAddress: new FormControl(),
    Londontravel: new FormControl(),
    TravelHubCollection: new FormControl(),
    AdditionalPassengers: new FormControl(),
    TotalAditionalPassengers: new FormControl(),
  });

  constructor(
    private formBuilder: FormBuilder,
    private sessionService: SessionStorageService,
    private applicationService: ApplicationService,
    private studentOnBoardingService: OnboardService,
    private toastr: ToastrServiceService,
    private sessionStorage: SessionStorageService,
    private accountService: AccountService,
    private router: Router
  ) {
    this.arrivalDataForm = formBuilder.group(
      {
        AirportId: [0, [Validators.required]],
        ApplicationId: [0, [Validators.required]],
        AirlineName: ["", [Validators.required]],
        FlightNumber: [
          "",
          [Validators.required, Validators.pattern(/(^[A-Z0-9]{4,}$)/), Validators.maxLength(10)],
        ],
        DepartureLocation: [null, [Validators.required]],
        DepartureCountry: [null, [Validators.required]],
        ArrivalCountry: [null, [Validators.required]],
        ArrivalLocation: [null, [Validators.required]],
        ArrivalDate: ["", [Validators.required, this.dateValidator]],
        ArrivalTime: ["", [Validators.required]],
        Age: ["", [Validators.required]],
        CollegeResident: [""],
        BoardingStudent: ["", [Validators.required]],
        AccommodationAddress: ["", [Validators.required]],
        Londontravel: ["",[Validators.required]],
        TravelHubCollection: [null], 
        AdditionalPassengers: [null], 
        TotalAditionalPassengers: [null],
      },
      (err: any) => {
        if (err.status == 401) {
          this.router.navigate(["/"]);
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
      }
    );
  }
  get f() {
    return this.arrivalDataForm.controls;
  }
  ngOnInit(): void {
    this.loadCountry();
    this.airportNameList();
    this.GetSession();
    this.getApplicationData();


     // Subscribe to changes on the Londontravel control to dynamically set validators
     this.arrivalDataForm.get('Londontravel')?.valueChanges.subscribe(value => {
      this.onLondonTravelChange(value);
    });

  }

  dateValidator(control: AbstractControl): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the current date's time to midnight

    const isDateValid = selectedDate > today;
    return isDateValid ? null : { invalidDate: control.value };
  }

  MinPassengers(control: AbstractControl): ValidationErrors | null {
    let enteredValue = parseInt(control.value, 10); // Convert the value to a number

    const validValue = enteredValue >= 1; // Check if the value is greater than 0

    if (validValue === true) {
      return null;
    } else {
      return { invalidValue: "invalid" };
    }
  }
  // { invalidValue: null };
  loadData() {
    $("#loader").show();
    this.isData = true;
    let input = {
      ApplicationId: 0,
    };
    this.userType = parseInt(this.sessionService.getUserType());
    if (this.userType > 5) {
      input.ApplicationId = parseInt(
        this.sessionService.getUserApplicationId()
      );
      this.studentName = this.sessionService.GetSessionForApplicationname();
      var userPermission = this.sessionService.getpermission();
      if (userPermission == "true") {
        this.studentOnBoardingService.getAirportArrivalData(input).subscribe(
          (res) => {
            if (res.status) {
              
              if (res.data) {
                if (res.data.additionalPassengers) {
                  this.arrivalDataForm
                    .get("TotalAditionalPassengers")
                    .addValidators([Validators.required, this.MinPassengers]);
                }

                this.aditionalHideShow = res.data.additionalPassengers;
                this.arrivalDataForm
                  .get("ApplicationId")
                  .setValue(res.data.applicationId);
                this.arrivalDataForm
                  .get("AirportId")
                  .setValue(res.data.airportId);
                this.arrivalDataForm
                  .get("AirlineName")
                  .setValue(res.data.airlineName);
                this.arrivalDataForm
                  .get("FlightNumber")
                  .setValue(res.data.flightNumber);
                this.arrivalDataForm
                  .get("DepartureLocation")
                  .setValue(res.data.departureLocation);
                this.arrivalDataForm
                  .get("ArrivalLocation")
                  .setValue(res.data.arrivalLocation);
                this.arrivalDataForm
                  .get("DepartureCountry")
                  .setValue(res.data.departureCountry);
                this.arrivalDataForm
                  .get("ArrivalCountry")
                  .setValue(res.data.arrivalCountry);
                this.arrivalDataForm
                  .get("ArrivalDate")
                  .setValue(moment(res.data.arrivalDate).format("YYYY-MM-DD"));
                this.arrivalDataForm
                  .get("ArrivalTime")
                  .setValue(moment(res.data.arrivalDate).format("HH:mm"));
                this.arrivalDataForm.get("Age").setValue(res.data.age);
                this.arrivalDataForm
                  .get("CollegeResident")
                  .setValue(res.data.collegeResidence);
                this.arrivalDataForm
                  .get("BoardingStudent")
                  .setValue(res.data.boardingStudent);
                this.arrivalDataForm
                  .get("AccommodationAddress")
                  .setValue(res.data.accommodationAddress);
                this.arrivalDataForm
                  .get("Londontravel")
                  .setValue(res.data.londonTravel);
                this.arrivalDataForm
                  .get("TravelHubCollection")
                  .setValue(res.data.travelHubCollection);
                this.arrivalDataForm
                  .get("AdditionalPassengers")
                  .setValue(res.data.additionalPassengers);
                this.arrivalDataForm
                  .get("TotalAditionalPassengers")
                  .setValue(res.data.totalAdditionalPassengers);
              }
            } else {
              this.toastr.ErrorToastr(res.message);
            }
            $("#loader").hide();
          },
          (err: any) => {
            if (err.status == 401) {
              this.router.navigate(["/"]);
            } else {
              this.toastr.ErrorToastr("Something went wrong");
            }
            $("#loader").hide();
          }
        );
      } else {
        this.permissionMessageImage = true;
        $("#loader").hide();
      }
    } else {
      this.studentOnBoardingService.getAirportArrivalData(input).subscribe(
        (res) => {
          if (res.status) {
            if (res.data) {
              this.arrivalAirportId = res.data.airportId;
           
              if (res.data.additionalPassengers) {
                this.arrivalDataForm
                  .get("TotalAditionalPassengers")
                  .addValidators([Validators.required, this.MinPassengers]);
              }
              this.aditionalHideShow = res.data.additionalPassengers;
              this.arrivalDataForm
                .get("ApplicationId")
                .setValue(res.data.applicationId);
              this.arrivalDataForm
                .get("AirportId")
                .setValue(res.data.airportId);
              this.arrivalDataForm
                .get("AirlineName")
                .setValue(res.data.airlineName);
              this.arrivalDataForm
                .get("FlightNumber")
                .setValue(res.data.flightNumber);
              this.arrivalDataForm
                .get("DepartureLocation")
                .setValue(res.data.departureLocation);
              this.arrivalDataForm
                .get("ArrivalLocation")
                .setValue(res.data.arrivalLocation);
              this.arrivalDataForm
                .get("DepartureCountry")
                .setValue(res.data.departureCountry);
              this.arrivalDataForm
                .get("ArrivalCountry")
                .setValue(res.data.arrivalCountry);
              this.arrivalDataForm
                .get("ArrivalDate")
                .setValue(moment(res.data.arrivalDate).format("YYYY-MM-DD"));
              this.arrivalDataForm
                .get("ArrivalTime")
                .setValue(moment(res.data.arrivalDate).format("HH:mm"));
              this.arrivalDataForm.get("Age").setValue(res.data.age);
              this.arrivalDataForm
                .get("CollegeResident")
                .setValue(res.data.collegeResidence);
              this.arrivalDataForm
                .get("BoardingStudent")
                .setValue(res.data.boardingStudent);
              this.arrivalDataForm
                .get("AccommodationAddress")
                .setValue(res.data.accommodationAddress);
              this.arrivalDataForm
                .get("Londontravel")
                .setValue(res.data.londonTravel);
              this.arrivalDataForm
                .get("TravelHubCollection")
                .setValue(res.data.travelHubCollection);
              this.arrivalDataForm
                .get("AdditionalPassengers")
                .setValue(res.data.additionalPassengers);
              this.arrivalDataForm
                .get("TotalAditionalPassengers")
                .setValue(res.data.totalAdditionalPassengers);
            }
          } else {
            this.toastr.ErrorToastr(res.message);
          }
          $("#loader").hide();
        },
        (err: any) => {
          if (err.status == 401) {
            this.router.navigate(["/"]);
          } else {
            this.toastr.ErrorToastr("Something went wrong");
          }
          $("#loader").hide();
        }
      );
    }
  }

  GetSession(): any {
    this.storeApplicationId = this.sessionStorage.getUserApplicationId();
    this.arrivalDataForm.get("ApplicationId").setValue(this.storeApplicationId);
  }
  loadCountry() {
    $("#loader").show();
    this.accountService.getCountries().subscribe(
      (res) => {
        if (res.status) {
          this.countries = res.data;
          $("#loader").hide();
          this.loadData();
        }
      },
      (err: any) => {
        if (err.status == 401) {
          this.router.navigate(["/"]);
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
        $("#loader").hide();
      }
    );
  }
  location(CInput: any, isDepart: boolean) {
    if (CInput) {
      $("#loader").show();
      let input = {
        Id: CInput,
      };
      this.accountService.getCitiesByCountryId(input).subscribe(
        (res) => {
          if (res.status) {
            if (isDepart) this.departCities = res.data;
            else this.arrivalCities = res.data;
            if (!this.isData) this.loadData();
          } else {
            this.toastr.ErrorToastr(res.message);
          }
          $("#loader").hide();
        },
        (err: any) => {
          if (err.status == 401) {
            this.router.navigate(["/"]);
          } else {
            this.toastr.ErrorToastr("Something went wrong");
          }
          $("#loader").hide();
        }
      );
    }
  }

  getApplicationData() {
    $("#loader").show();
    let application = {
      ApplicationId: 0,
    };
    this.applicationService.getApplication(application).subscribe(
      (res) => {
        if (res.status) this.birthdatedata = res.data.dateOfBirth;
        $("#loader").hide();
      },
      (err: any) => {
        if (err.status == 401) {
          this.router.navigate(["/"]);
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
        $("#loader").hide();
      }
    );
  }

  birthdateCount(e: any) {
    var birthdate = new Date(this.birthdatedata);
    var currentYear = new Date(e.target.value);
    var finalAge = currentYear.getTime() - birthdate.getTime();
    this.arrivalDataForm
      .get("Age")
      .setValue((finalAge / 31536000000).toFixed(0));
  }
  airportNameList() {
    $("#loader").show();
    let input = {
      Id: 0,
    };
    this.studentOnBoardingService.getAirportByLocationId().subscribe(
      (res) => {
        if (res.status) this.arrivalairport = res.data;
        else {
          this.toastr.ErrorToastr(res.message);
        }
        $("#loader").hide();
      },
      (err: any) => {
        if (err.status == 401) {
          this.router.navigate(["/"]);
        } else {
          this.toastr.ErrorToastr("Something went wrong");
        }
        $("#loader").hide();
      }
    );
  }
  onLondonTravelChange(value: string) {
    if (value === 'true') {
      // Add required validators if "Yes" is selected
      this.arrivalDataForm.get('TravelHubCollection')?.setValidators(Validators.required);
      this.arrivalDataForm.get('AdditionalPassengers')?.setValidators(Validators.required);
      this.arrivalDataForm.get('TotalAditionalPassengers')?.setValidators(Validators.required);
    } else {
      // Clear validators if "No" is selected
      this.arrivalDataForm.get('TravelHubCollection')?.clearValidators();
      this.arrivalDataForm.get('AdditionalPassengers')?.clearValidators();
      this.arrivalDataForm.get('TotalAditionalPassengers')?.clearValidators();
    }
 
    // Update the validity of the form controls
    this.arrivalDataForm.get('TravelHubCollection')?.updateValueAndValidity();
    this.arrivalDataForm.get('AdditionalPassengers')?.updateValueAndValidity();
    this.arrivalDataForm.get('TotalAditionalPassengers')?.updateValueAndValidity();
  }
  savedata() {
    console.log(this.arrivalDataForm.get('TotalAditionalPassengers').value);
    console.log(this.arrivalDataForm.get('TotalAditionalPassengers').errors);
    if (this.arrivalDataForm.get('AdditionalPassengers').value === true) {
      if (this.arrivalDataForm.get('TotalAditionalPassengers').invalid) {
        alert('Please enter a valid number of additional passengers');
        return;
      }
    }
    if (this.arrivalDataForm.invalid) {
      console.log('Form is invalid', this.arrivalDataForm);
      for (const controlName in this.arrivalDataForm.controls) {
        if (this.arrivalDataForm.controls[controlName].invalid) {
          console.log(`Control '${controlName}' is invalid:`, this.arrivalDataForm.controls[controlName].errors);
        }
      }
      this.arrivalDataForm.markAllAsTouched();
      return;
    }
   
    $("#loader").show();
  
    this.isSubmitted = true;
    if (this.arrivalDataForm.valid) {
      var formVal = JSON.parse(
        JSON.stringify(this.arrivalDataForm.getRawValue())
      );
      console.log("Form Inputs:", formVal); // Log form inputs

      if (typeof formVal.CollegeResident !== "boolean")
        formVal.CollegeResident = this.convertToBoolean(
          formVal.CollegeResident
        );
      if (typeof formVal.BoardingStudent !== "boolean")
        formVal.BoardingStudent = this.convertToBoolean(
          formVal.BoardingStudent
        );
      if (typeof formVal.Londontravel !== "boolean")
        formVal.Londontravel = this.convertToBoolean(formVal.Londontravel);
      if (formVal.TotalAditionalPassengers == "")
        formVal.TotalAditionalPassengers = null;
      console.log("Processed Form Inputs:", formVal); // Log processed form inputs
      this.studentOnBoardingService.addAirportArrivalData(formVal).subscribe(
        (res) => {
          console.log("form val ", res);
          if (res.status) {
            this.formSubmittedSuccessfully = true;
            this.toastr.SuccessToastr("Arrival form submitted successfully.");
            this.arrivalDataForm.reset();
            this.loadData();

          } else {
            console.log("Errorin Airport Arrival");
            this.toastr.ErrorToastr("Arrival form is not submitted.");
          }
          $("#loader").hide();
        },
        (err: any) => {
          console.log("API Error:", err); // Log API error
          this.toastr.ErrorToastr("Something missing");
          $("#loader").hide();
        }
      );
    }
  }

  convertToBoolean(input: any) {
    if (input == "true") {
      return true;
    } else if (input == "false") {
      return false;
    }
  }

  clearData() {
    this.arrivalDataForm.reset();
    this.storeApplicationId = this.sessionStorage.getUserApplicationId();
    this.arrivalDataForm.get("ApplicationId").setValue(this.storeApplicationId);
    this.arrivalDataForm.get("AirportId").setValue(this.arrivalAirportId);
    this.aditionalHideShow = false;
  }

  aditionalPassengers(e: any) {
    if (e == true) {
      this.aditionalHideShow = true;
      this.arrivalDataForm
        .get("TotalAditionalPassengers")
        .addValidators([Validators.required,this.MinPassengers]);
    } else {
      this.aditionalHideShow = false;
      this.arrivalDataForm.get("TotalAditionalPassengers").setValue("");
      this.arrivalDataForm.get("TotalAditionalPassengers").clearValidators();
      this.arrivalDataForm.get("TotalAditionalPassengers").reset(); // Add this line here
      this.arrivalDataForm
        .get("TotalAditionalPassengers")
        .updateValueAndValidity();
    }
  }
}
